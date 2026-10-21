import { expect, test, type Page } from '@playwright/test'
import { de } from '../../content/de'
import { CONTACT } from '../../content/contact'

async function gotoContact(page: Page) {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect
    .poll(() => page.evaluate(() => window.__sf?.progress ?? 0), { timeout: 10_000 })
    .toBeGreaterThan(0.99)
  await expect(page.locator('#kontakt')).toHaveAttribute('data-state', 'visible')
}

test.describe('Kontakt', () => {
  test('Cal.com lädt erst nach Klick, Kontaktdaten und Footer sind da', async ({ page }) => {
    const calRequests: string[] = []
    page.on('request', (r) => {
      if (new URL(r.url()).hostname.includes('cal.com')) calRequests.push(r.url())
    })
    await gotoContact(page)
    const section = page.locator('#kontakt')
    await expect(section.locator('h2')).toHaveText(de.contact.title)
    await expect(page.locator('iframe')).toHaveCount(0)
    await page.waitForTimeout(500)
    expect(calRequests).toEqual([])

    await expect(page.locator(`a[href="mailto:${CONTACT.email}"]`)).toBeVisible()
    await expect(page.locator(`a[href="${CONTACT.phoneHref}"]`)).toBeVisible()
    await expect(section.locator('footer')).toContainText('Arnulfsplatz 2')
    await expect(section.locator('footer')).toContainText('93047 Regensburg')
    await expect(section.locator('footer')).toContainText(`© ${new Date().getFullYear()} Smart Flow`)

    await section.getByRole('button', { name: de.contact.calCta }).click()
    const frame = page.locator('iframe[title="Terminbuchung bei Cal.com"]')
    await expect(frame).toBeVisible()
    await expect(frame).toHaveAttribute('src', `${CONTACT.calUrl}?embed=true&theme=dark`)
    await expect(section.getByRole('link', { name: 'Kalender in neuem Tab öffnen' })).toHaveAttribute(
      'href',
      CONTACT.calUrl,
    )
  })

  test('Tastatur: Nav-CTA, Cal-Button, Mail, Telefon, Footer-Links', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await page.getByRole('button', { name: de.nav.cta }).click()
    await expect(page.locator('#kontakt-title')).toBeFocused({ timeout: 5000 })
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: de.contact.calCta })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Kalender in neuem Tab öffnen' })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.locator(`a[href="mailto:${CONTACT.email}"]`)).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.locator(`a[href="${CONTACT.phoneHref}"]`)).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(page.locator('#kontakt footer a').first()).toBeFocused()
  })

  test('Rechtstexte antworten mit 200', async ({ request }) => {
    for (const path of [
      '/impressum.html',
      '/datenschutz.html',
      '/agb.html',
      '/en/legal-notice.html',
      '/en/privacy-policy.html',
      '/en/terms.html',
    ]) {
      const res = await request.get(path)
      expect(res.status(), path).toBe(200)
      expect(await res.text(), path).toMatch(/Smart ?Flow/)
    }
  })
})
