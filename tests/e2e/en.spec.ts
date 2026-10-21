import { expect, test, type Page } from '@playwright/test'
import { en } from '../../content/en'

// Next normalizes the root URL to the bare origin (no trailing slash); that is the same resource as "/".
const DE_ROOT = /^https:\/\/smartflow\.bayern\/?$/

async function gotoContact(page: Page) {
  await page.goto('/en')
  await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect
    .poll(() => page.evaluate(() => window.__sf?.progress ?? 0), { timeout: 10_000 })
    .toBeGreaterThan(0.99)
  await expect(page.locator('#kontakt')).toHaveAttribute('data-state', 'visible')
}

test.describe('English site', () => {
  test('/en has lang en, English h1 and hreflang alternates', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1')).toContainText(en.station0.sentence)
    await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute('href', DE_ROOT)
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/en$/)
    await expect(page).toHaveTitle(en.meta.title)
  })

  test('/ stays German with hreflang en', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'de')
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', /\/en$/)
  })

  test('/en#kontakt opens the contact station', async ({ page }) => {
    await page.goto('/en#kontakt')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await expect(page.locator('#kontakt')).toHaveAttribute('data-state', 'visible', { timeout: 8000 })
    await expect(page.locator('#kontakt h2')).toHaveText(en.contact.title)
  })

  test('footer language switch points to /', async ({ page }) => {
    await gotoContact(page)
    const link = page.locator('#kontakt footer').getByRole('link', { name: en.footer.languageSwitch.label })
    await expect(link).toHaveAttribute('href', '/')
    await expect(link).toHaveAttribute('hreflang', 'de')
    await expect(page.locator('#kontakt footer a[href="/en/legal-notice.html"]')).toHaveText('Legal notice')
  })

  test('English nav labels and cal button', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await expect(page.getByRole('link', { name: en.nav.labels.cpu, exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: en.nav.cta })).toBeVisible()
  })
})
