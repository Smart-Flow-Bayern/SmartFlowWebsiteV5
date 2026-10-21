import { expect, test } from '@playwright/test'
import { de } from '../../content/de'

test.describe('Szene', () => {
  test('behält Scrollposition und aktives Teil, wenn das Modell nachlädt', async ({ page }) => {
    await page.route('**/models/computer.glb', async (route) => {
      await new Promise((r) => setTimeout(r, 2000))
      await route.continue()
    })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await expect(page.locator('canvas')).toHaveCount(1)
    await page.evaluate(() =>
      window.scrollTo(0, 0.35 * (document.documentElement.scrollHeight - window.innerHeight)),
    )
    await expect.poll(() => page.evaluate(() => window.__sf?.progress ?? 0)).toBeGreaterThan(0.3)
    expect(await page.evaluate(() => window.__sf?.modelLoaded)).toBe(false)
    // Der Text steht, bevor das Modell ankommt.
    await expect(page.locator('section#cpu[data-state="visible"] h2')).toHaveText(de.cpu.title)
    expect(await page.evaluate(() => window.__sf?.modelLoaded)).toBe(false)
    await expect.poll(() => page.evaluate(() => window.__sf?.modelLoaded), { timeout: 20_000 }).toBe(true)
    const sf = await page.evaluate(() => window.__sf)
    expect(Math.abs((sf?.progress ?? 0) - 0.35)).toBeLessThan(0.02)
    expect(sf?.activePart).toBe('cpu')
  })

  test('?fallback=1 setzt den statischen Modus ohne Canvas', async ({ page }) => {
    await page.goto('/?fallback=1')
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'static')
    await expect(page.locator('canvas')).toHaveCount(0)
  })
})
