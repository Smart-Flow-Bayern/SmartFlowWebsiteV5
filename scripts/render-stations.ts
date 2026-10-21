// Rendert die 14 Stationsbilder gegen den laufenden Dev-Server: node scripts/render-stations.ts
import { mkdirSync, statSync } from 'node:fs'
import { chromium } from '@playwright/test'
import sharp from 'sharp'

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3005'
const STATIONS = ['gehaeuse', 'mainboard', 'cpu', 'ram', 'gpu', 'ssd', 'kontakt']
const SIZES = [
  { suffix: '', width: 1600, height: 1000 },
  { suffix: '-mobile', width: 800, height: 1200 },
]
const QUALITY = 80
const MAX_TOTAL_BYTES = 2 * 1024 * 1024
const OUT_DIR = new URL('../public/stations/', import.meta.url).pathname

mkdirSync(OUT_DIR, { recursive: true })

const browser = await chromium.launch({
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})

let total = 0
for (const { suffix, width, height } of SIZES) {
  for (const [index, station] of STATIONS.entries()) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 })
    const page = await context.newPage()
    await page.goto(`${BASE_URL}/dev/pose/${station}`)
    await page.waitForFunction(() => window.__sf?.modelLoaded === true, undefined, { timeout: 60_000 })
    // Dev-Indikator von Next.js ("1 Insight") nicht mitfotografieren
    await page.addStyleTag({ content: 'nextjs-portal { display: none !important }' })
    // Einblend-Fade (0,6 s) plus Kühler- und Kabel-Easing
    await page.waitForTimeout(1500)
    const png = await page.screenshot({ type: 'png' })
    const file = `${OUT_DIR}station-${index}${suffix}.webp`
    await sharp(png).webp({ quality: QUALITY }).toFile(file)
    const size = statSync(file).size
    total += size
    console.log(`station-${index}${suffix}.webp ${(size / 1024).toFixed(0)} kB`)
    await context.close()
  }
}
await browser.close()

console.log(`Summe: ${(total / 1024).toFixed(0)} kB (Grenze ${MAX_TOTAL_BYTES / 1024} kB, QUALITY=${QUALITY})`)
if (total > MAX_TOTAL_BYTES) {
  console.error('Zu groß: QUALITY in 5er-Schritten senken und neu rendern.')
  process.exitCode = 1
}
