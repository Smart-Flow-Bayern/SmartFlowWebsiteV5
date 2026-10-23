import { expect, test } from '@playwright/test'
import { de } from '@/content/de'
import { expectProgressNear, progress, waitForScroll } from './helpers'

const sceneNav = (page: import('@playwright/test').Page) =>
  page.getByRole('navigation', { name: de.nav.scenesLabel })

test.describe('Navigation', () => {
  test('Link „Kontakt“ fährt ans Story-Ende', async ({ page }) => {
    await page.goto('/')
    await waitForScroll(page)
    const link = sceneNav(page).getByRole('link', { name: de.nav.labels.kontakt, exact: true })
    await link.click()
    await expect.poll(() => progress(page), { timeout: 10_000 }).toBeGreaterThan(0.995)
    await expect(page).toHaveURL(/#kontakt$/)
    await expect(link).toHaveAttribute('aria-current', 'true')
  })

  test('Link „Struktur“ fährt zu 2/6', async ({ page }) => {
    await page.goto('/')
    await waitForScroll(page)
    await sceneNav(page).getByRole('link', { name: de.nav.labels.struktur, exact: true }).click()
    await expectProgressNear(page, 2 / 6)
    await expect(page.locator('#struktur')).toBeInViewport()
  })

  for (const [hash, target, expected] of [
    ['analyse', 'analyse', 1 / 6],
    ['ueber', 'ueber', 5 / 6],
    ['services', 'struktur', 2 / 6],
    ['about', 'ueber', 5 / 6],
  ] as const) {
    test(`Deep Link /#${hash} landet bei #${target}`, async ({ page }) => {
      await page.goto(`/#${hash}`)
      await waitForScroll(page)
      await expectProgressNear(page, expected)
      await expect(page.locator(`#${target}`)).toBeInViewport()
    })
  }

  test('unbekannter Hash /#%E2%82%AC wird ignoriert', async ({ page }) => {
    await page.goto('/#%E2%82%AC')
    await waitForScroll(page)
    await page.evaluate(() => document.fonts.ready)
    expect(await progress(page)).toBe(0)
    await expect(page.locator('h1')).toBeInViewport()
  })

  test('CTA „Erstgespräch“ setzt den Fokus auf die Kontakt-Überschrift', async ({ page }) => {
    await page.goto('/')
    await waitForScroll(page)
    await page.getByRole('link', { name: de.nav.cta, exact: true }).click()
    await expect(page.locator('#kontakt-title')).toBeFocused({ timeout: 10_000 })
  })

  test('Tab-Reihenfolge beginnt bei der Wortmarke', async ({ page }) => {
    await page.goto('/')
    await waitForScroll(page)
    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: de.nav.homeLabel })).toBeFocused()
  })

  test('Fortschrittsanzeige markiert bei /#ueber den Schritt Wachstum', async ({ page }) => {
    await page.goto('/#ueber')
    await waitForScroll(page)
    const steps = page.getByRole('navigation', { name: de.nav.progressLabel })
    await expect(steps.locator('a[href="#wachstum"]')).toHaveAttribute('aria-current', 'step')
    await expect(steps.locator('a[aria-current="step"]')).toHaveCount(1)
  })
})
