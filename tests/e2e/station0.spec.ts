import { expect, test } from '@playwright/test'
import { de } from '../../content/de'
import { IDLE_GRACE_MS } from '../../scene/timing'

const GUARD_MS = 500

test.describe('Station 0', () => {
  test('zeigt Satz und Wortmarke ohne Scrollen', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('h1')).toHaveText(de.station0.sentence)
    await expect(page.getByRole('img', { name: /Smart Flow/ }).first()).toBeVisible()
  })

  test('lädt das 3D-Modell nicht in den ersten 500 ms', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (r) => requests.push(r.url()))
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    // Das Fenster muss innerhalb der Schonfrist liegen, sonst prüft der Test nichts.
    expect(GUARD_MS).toBeLessThan(IDLE_GRACE_MS)
    await page.waitForTimeout(GUARD_MS)
    expect(requests.filter((u) => u.includes('/models/computer.glb'))).toHaveLength(0)
  })

  test('bei reduzierter Bewegung läuft der statische Modus', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'static')
  })
})
