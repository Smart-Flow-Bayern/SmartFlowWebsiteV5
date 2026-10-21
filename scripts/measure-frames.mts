// Frame-Zeit-Messung mit echter GPU: Chromium headed, 3 s requestAnimationFrame, dabei in 10 Schritten
// von Progress 0 bis 1 scrollen. Gibt Median und p95 der Frame-Dauer aus.
// Aufruf: pnpm start -p 3006 (anderes Terminal), dann `pnpm measure:frames [baseUrl]`.
// Ziel: p95 <= 33 ms (30 fps). Nicht Teil der e2e-Suite.
import { chromium, devices } from '@playwright/test'

const BASE = process.argv[2] ?? process.env.BASE_URL ?? 'http://localhost:3006'
const DURATION_MS = 3000
const STEPS = 10

const cases = [
  { name: 'desktop 1440x900', context: { viewport: { width: 1440, height: 900 } } },
  { name: 'mobil 390x844', context: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } } },
] as const

function percentile(sorted: number[], p: number): number {
  return sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)]
}

const browser = await chromium.launch({ headless: false, args: ['--ignore-gpu-blocklist'] })
for (const c of cases) {
  const context = await browser.newContext(c.context)
  const page = await context.newPage()
  await page.goto(BASE, { waitUntil: 'load' })
  await page.waitForSelector('canvas', { timeout: 30_000 })
  // Produktion setzt window.__sf nicht; Modell- und Shader-Aufbau abwarten.
  await page.waitForTimeout(4000)
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
  console.log(
    `${c.name}: frames=${durations.length} median=${median.toFixed(1)} ms p95=${p95.toFixed(1)} ms ` +
      `max=${sorted[sorted.length - 1].toFixed(1)} ms ziel_p95<=33: ${p95 <= 33 ? 'erreicht' : 'verfehlt'}`,
  )
  await context.close()
}
await browser.close()
