import { expect, test } from '@playwright/test'
import { de } from '@/content/de'
import { waitForScroll } from './helpers'

const isCal = (url: string) => /(^|\.)cal\.com$/.test(new URL(url).hostname)

test('Cal.com lädt erst nach Klick, Seite bleibt scrollbar', async ({ page }) => {
  const calRequests: string[] = []
  page.on('request', (req) => {
    if (isCal(req.url())) calRequests.push(req.url())
  })
  // Kein echter Aufruf von Cal.com im Test: Antwort lokal, der Request wird trotzdem mitgeschnitten.
  await page.route(/^https:\/\/([^/]+\.)?cal\.com\//, (route) =>
    route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Cal</title>' }),
  )

  await page.goto('/#kontakt')
  await waitForScroll(page)
  await page.waitForLoadState('networkidle')
  expect(calRequests).toEqual([])

  await page.getByRole('button', { name: de.scenes.kontakt.calCta }).click()
  const frame = page.locator('iframe[title]')
  await expect(frame).toHaveAttribute('src', /^https:\/\/cal\.com\//)
  await expect.poll(() => calRequests.length).toBeGreaterThan(0)

  // Mausrad außerhalb des Kalenders: die Seite scrollt bis zum Footer weiter.
  const footer = page.locator('footer')
  const { height } = page.viewportSize()!
  await page.mouse.move(4, height / 2)
  await expect
    .poll(
      async () => {
        await page.mouse.wheel(0, 400)
        return footer.evaluate((el) => el.getBoundingClientRect().top < window.innerHeight)
      },
      { timeout: 10_000 },
    )
    .toBe(true)
})

test('E-Mail- und Telefon-Link', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#kontakt a[href="mailto:info@smartflow.bayern"]')).toHaveCount(1)
  await expect(page.locator('footer a[href^="tel:"]')).toHaveCount(1)
})
