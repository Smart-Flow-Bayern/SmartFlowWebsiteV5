import { expect, test } from '@playwright/test'
import { de } from '../../content/de'

test.describe('Station 0', () => {
  test('zeigt Satz, KI-Lärm und Wortmarke ohne Scrollen', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('h1')).toHaveText(de.station0.sentence)
    expect(await page.locator('[data-noise]').count()).toBeGreaterThanOrEqual(40)
    await expect(page.getByRole('img', { name: /Smart Flow/ }).first()).toBeVisible()
  })

  test('lädt das 3D-Modell nicht in den ersten 500 ms', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (r) => requests.push(r.url()))
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(500)
    expect(requests.filter((u) => u.includes('/models/computer.glb'))).toHaveLength(0)
  })

  test('Partikel haben bei reduzierter Bewegung keine Animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const name = await page
      .locator('[data-noise]')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName)
    expect(name).toBe('none')
  })
})
