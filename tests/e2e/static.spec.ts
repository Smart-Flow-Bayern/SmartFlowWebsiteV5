import { expect, test } from '@playwright/test'
import { de } from '../../content/de'

const STATION_IDS = ['gehaeuse', 'mainboard', 'cpu', 'ram', 'gpu', 'ssd', 'kontakt']

test.describe('Statischer Modus', () => {
  test('reduzierte Bewegung zeigt Standbilder und alle Texte im Dokumentfluss', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'static')
    await expect(page.locator('canvas')).toHaveCount(0)
    for (const id of STATION_IDS) await expect(page.locator(`section#${id}`)).toHaveCount(1)

    const titles: Array<[string, string]> = [
      ['#gehaeuse h1', de.station0.sentence],
      ['#mainboard h2', de.station1.claim],
      ['#cpu h2', de.cpu.title],
      ['#ram h2', de.ram.title],
      ['#gpu h2', de.gpu.title],
      ['#ssd h2', de.ssd.title],
      ['#kontakt h2', de.contact.title],
    ]
    for (const [selector, text] of titles) {
      const heading = page.locator(selector)
      await heading.scrollIntoViewIfNeeded()
      await expect(heading).toHaveText(text)
      await expect(heading).toBeVisible()
    }

    for (const [i] of STATION_IDS.entries()) {
      const img = page.locator(`img[src="/stations/station-${i}.webp"]`)
      await img.scrollIntoViewIfNeeded()
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
        .toBe(true)
    }

    await page.locator('#cpu').scrollIntoViewIfNeeded()
    for (const li of await page.locator('#cpu li').all()) await expect(li).toBeVisible()
    await page.locator('#ssd').scrollIntoViewIfNeeded()
    await expect(page.locator('#ssd li')).toHaveCount(4)
    for (const li of await page.locator('#ssd li').all()) await expect(li).toBeVisible()
  })

  test('Ladefehler des Modells schaltet auf den statischen Modus', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.route('**/models/computer.glb', (route) => route.abort())
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    const requested = page.waitForRequest('**/computer.glb')
    await page.evaluate(() =>
      window.scrollTo(0, 0.05 * (document.documentElement.scrollHeight - window.innerHeight)),
    )
    await requested
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'static', { timeout: 3000 })
    await expect(page.locator('#cpu h2')).toHaveText(de.cpu.title)
    expect(errors).toEqual([])
  })

  test('?fallback=1 zeigt Station 0 ohne Canvas', async ({ page }) => {
    await page.goto('/?fallback=1')
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'static')
    await expect(page.locator('canvas')).toHaveCount(0)
    await expect(page.locator('h1')).toHaveText(de.station0.sentence)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('Navigation springt per Anker', async ({ page }) => {
    await page.goto('/?fallback=1')
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'static')
    await page.getByRole('link', { name: de.nav.labels.cpu }).click()
    await expect(page).toHaveURL(/#ablaeufe$/)
    await expect(page.locator('#cpu h2')).toBeInViewport()
  })
})
