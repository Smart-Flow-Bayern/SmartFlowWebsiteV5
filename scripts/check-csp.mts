// CSP-Prüfung gegen den Production-Build: lädt / und /en, scrollt in 14 Schritten durch die Fahrt,
// öffnet nach dem Scrollen ans Ende den Cal.com-Embed und schlägt bei jeder CSP-Verletzung fehl.
// Aufruf: pnpm build && pnpm start -p 3006 (anderes Terminal), dann `pnpm check:csp [baseUrl]`.
// Erfasst Konsolenmeldungen ("Content Security Policy", "Refused to") und securitypolicyviolation-Events.
// Nicht Teil der e2e-Suite.
import { chromium } from '@playwright/test'

const BASE = process.argv[2] ?? process.env.BASE_URL ?? 'http://localhost:3006'
const pages = [
  { path: '/', cta: 'Termin wählen' },
  { path: '/en', cta: 'Pick a time' },
]
const STEPS = 14

const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
})
const violations: string[] = []
const errors: string[] = []
let calFrame = 0

for (const p of pages) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  const tag = (m: string) => `[${p.path}] ${m}`
  page.on('console', (msg) => {
    const text = msg.text()
    if (/Content Security Policy|Refused to/i.test(text)) violations.push(tag(`console: ${text}`))
    else if (msg.type() === 'error') errors.push(tag(`console.error: ${text}`))
  })
  page.on('pageerror', (e) => errors.push(tag(`pageerror: ${e.message}`)))
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e) => {
      console.log(`Content Security Policy event: ${e.violatedDirective} blocked ${e.blockedURI}`)
    })
  })

  const res = await page.goto(BASE + p.path, { waitUntil: 'load' })
  const csp = res?.headers()['content-security-policy']
  if (!csp) violations.push(tag('Antwort ohne Content-Security-Policy-Header'))
  await page.waitForSelector('canvas', { timeout: 30_000 })
  await page.waitForTimeout(4000) // Modell (Meshopt/WASM) und Shader

  for (let i = 0; i <= STEPS; i++) {
    await page.evaluate(
      (f) => window.scrollTo(0, f * (document.documentElement.scrollHeight - window.innerHeight)),
      i / STEPS,
    )
    await page.waitForTimeout(500)
  }
  await page.waitForTimeout(1000)
  await page.getByRole('button', { name: p.cta }).click()
  const frame = page.locator('iframe[title]').first()
  await frame.waitFor({ state: 'attached', timeout: 10_000 })
  calFrame += 1
  await page.waitForTimeout(8000) // Cal.com lädt eigene Skripte und Stile im iframe
  await context.close()
}
await browser.close()

console.log(`Seiten geprüft: ${pages.map((p) => p.path).join(', ')}; Cal-iframe geöffnet: ${calFrame}/${pages.length}`)
if (errors.length) console.log(`Sonstige Konsolenfehler (keine CSP):\n  ${errors.join('\n  ')}`)
if (violations.length) {
  console.error(`CSP-Verletzungen: ${violations.length}\n  ${violations.join('\n  ')}`)
  process.exit(1)
}
console.log('CSP: keine Verletzungen')
