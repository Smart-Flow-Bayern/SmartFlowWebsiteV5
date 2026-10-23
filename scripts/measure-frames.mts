// Frame-Zeit-Messung der SVG-Prozessgrafik gegen den Production-Server: Chromium headed (echte GPU und VSync),
// 3 s requestAnimationFrame, dabei in 14 Schritten von oben bis ans Seitenende scrollen.
// Gibt Median und p95 der Frame-Abstände je Gerät aus; Exit 1, wenn ein p95 über der Grenze liegt.
// Aufruf: pnpm build && pnpm start -p 3006 (anderes Terminal), dann `pnpm measure:frames [baseUrl]`.
// Nicht Teil der e2e-Suite.
import { chromium, devices } from '@playwright/test'

const BASE = process.argv[2] ?? process.env.BASE_URL ?? 'http://localhost:3006'
const DURATION_MS = 3000
const STEPS = 14

const cases = [
  { name: 'desktop 1440x900', limitP95: 20, context: { viewport: { width: 1440, height: 900 } } },
  { name: 'mobil iPhone 13', limitP95: 33, context: { ...devices['iPhone 13'] } },
] as const

function percentile(sorted: number[], p: number): number {
  return sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)]
}

let failed = false
const browser = await chromium.launch({ headless: false, args: ['--ignore-gpu-blocklist'] })
for (const c of cases) {
  const context = await browser.newContext(c.context)
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForSelector('svg.process-stage')
  await page.evaluate(() => document.fonts.ready)
  const durations = await page.evaluate(
    ({ durationMs, steps }) =>
      new Promise<number[]>((resolve) => {
        const out: number[] = []
        const max = document.documentElement.scrollHeight - window.innerHeight
        const start = performance.now()
        let last = start
        let step = 0
        const tick = (now: number) => {
          out.push(now - last)
          last = now
          const wanted = Math.min(steps, Math.floor(((now - start) / durationMs) * (steps + 1)))
          if (wanted > step) {
            step = wanted
            window.scrollTo(0, (step / steps) * max)
          }
          if (now - start < durationMs) requestAnimationFrame(tick)
          else resolve(out.slice(1))
        }
        window.scrollTo(0, 0)
        requestAnimationFrame(tick)
      }),
    { durationMs: DURATION_MS, steps: STEPS },
  )
  const sorted = [...durations].sort((a, b) => a - b)
  const median = percentile(sorted, 0.5)
  const p95 = percentile(sorted, 0.95)
  const ok = p95 <= c.limitP95
  if (!ok) failed = true
  console.log(
    `${c.name}: frames=${durations.length} median=${median.toFixed(1)} ms p95=${p95.toFixed(1)} ms ` +
      `max=${sorted[sorted.length - 1].toFixed(1)} ms ziel_p95<=${c.limitP95}: ${ok ? 'erreicht' : 'verfehlt'}`,
  )
  await context.close()
}
await browser.close()
process.exit(failed ? 1 : 0)
