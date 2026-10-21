import { expect, test } from '@playwright/test'
import { de } from '../../content/de'
import { STATIONS, stationWindow } from '../../scene/stations'

// Kontakt: scrollToStation landet am Ende der Fahrt; die Schwelle liegt knapp vor dem Fensterstart.
const KONTAKT_START = stationWindow('kontakt').start - 0.005

const progress = (page: import('@playwright/test').Page) =>
  page.evaluate(() => window.__sf?.progress ?? 0)

test.describe('Feste Navigation', () => {
  test('Klick auf den Punkt Kontakt fährt ans Ende und setzt den Hash', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await page.getByRole('link', { name: de.nav.labels.kontakt, exact: true }).click()
    // Section #kontakt kommt in Task 17; bis dahin zählt der Fortschritt.
    await expect.poll(() => progress(page), { timeout: 2500 }).toBeGreaterThan(KONTAKT_START)
    expect(new URL(page.url()).hash).toBe('#kontakt')
    await expect(page.getByRole('link', { name: de.nav.labels.kontakt, exact: true })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })

  test('Klick auf Abläufe landet im Fenster und zeigt das Overlay', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await page.getByRole('link', { name: de.nav.labels.cpu, exact: true }).click()
    await expect(page.locator('#cpu')).toHaveAttribute('data-state', 'visible', { timeout: 3000 })
    expect(Math.abs((await progress(page)) - 0.343)).toBeLessThan(0.01)
  })

  test('Deep Link /#ablaeufe zeigt das CPU-Overlay', async ({ page }) => {
    await page.goto('/#ablaeufe')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await expect.poll(async () => Math.abs((await progress(page)) - 0.343), { timeout: 5000 }).toBeLessThan(0.01)
    await expect(page.locator('#cpu')).toHaveAttribute('data-state', 'visible', { timeout: 5000 })
  })

  test('CTA fährt zu Kontakt', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await page.getByRole('button', { name: de.nav.cta }).click()
    await expect.poll(() => progress(page), { timeout: 3000 }).toBeGreaterThan(KONTAKT_START)
  })

  test('Deep Link /#automatik landet in der Station GPU', async ({ page }) => {
    await page.goto('/#automatik')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await expect
      .poll(() => progress(page), { timeout: 5000 })
      .toBeGreaterThan(0.56)
    const p = await progress(page)
    expect(p).toBeLessThan(0.7)
    await expect(page.getByRole('link', { name: de.nav.labels.gpu, exact: true })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })

  test('unbekannter Hash wird ignoriert', async ({ page }) => {
    await page.goto('/#gibt-es-nicht')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await expect.poll(() => progress(page)).toBeLessThan(0.001)
  })

  test('kaputter Hash wirft keinen Fehler, Seite funktioniert weiter', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('/#%E0%A4%A')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await expect.poll(() => progress(page)).toBeLessThan(0.001)
    // Mount-Effekt lief durch: Navigation reagiert noch.
    await page.getByRole('link', { name: de.nav.labels.cpu, exact: true }).click()
    await expect.poll(() => progress(page), { timeout: 2500 }).toBeGreaterThan(0.27)
    expect(errors).toEqual([])
  })

  test('hashchange fährt zur Station', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await page.evaluate(() => {
      location.hash = '#werkzeuge'
    })
    await expect.poll(() => progress(page), { timeout: 2500 }).toBeGreaterThan(stationWindow('ram').start - 0.005)
    expect(await progress(page)).toBeLessThan(stationWindow('ram').end)
  })

  test('Tab erreicht Wortmarke, sieben Punkte und CTA in dieser Reihenfolge', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    const expected = [
      'Smart Flow – zum Anfang',
      ...STATIONS.map((s) => de.nav.labels[s.id]),
      de.nav.cta,
    ]
    const seen: (string | null)[] = []
    for (let i = 0; i < expected.length; i++) {
      await page.keyboard.press('Tab')
      seen.push(
        await page.evaluate(
          () =>
            document.activeElement?.getAttribute('aria-label') ??
            document.activeElement?.textContent?.trim() ??
            null,
        ),
      )
    }
    expect(seen).toEqual(expected)
  })

  test('Enter auf Werkzeuge fährt zur RAM-Station', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    const dot = page.getByRole('link', { name: de.nav.labels.ram, exact: true })
    await dot.focus()
    await page.keyboard.press('Enter')
    await expect.poll(() => progress(page), { timeout: 3000 }).toBeGreaterThan(0.42)
    await expect.poll(() => progress(page)).toBeLessThan(0.56)
    expect(new URL(page.url()).hash).toBe('#werkzeuge')
  })

  test('Linie unten erscheint erst nach 5 % Fortschritt', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    const header = page.locator('header')
    await expect(header).toHaveAttribute('data-scrolled', 'false')
    await page.getByRole('link', { name: de.nav.labels.cpu, exact: true }).click()
    await expect(header).toHaveAttribute('data-scrolled', 'true')
  })

  test('Canvas ist aria-hidden und nicht fokussierbar; nur eine Wortmarke mit role=img', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    const canvas = page.locator('canvas')
    await expect(canvas).toHaveAttribute('aria-hidden', 'true')
    expect(await canvas.getAttribute('tabindex')).toBeNull()
    await expect(page.getByRole('img', { name: 'Smart Flow' })).toHaveCount(1)
  })

  for (const [width, height, navH] of [
    [1280, 800, 64],
    [390, 844, 84],
    [320, 568, 84],
  ] as const) {
    test(`--nav-h und Leistenhöhe bei ${width}x${height} sind ${navH}px`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
      const token = await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h').trim(),
      )
      expect(token).toBe(`${navH}px`)
      const box = await page.locator('.nav-bar').boundingBox()
      expect(box?.height).toBe(navH)
    })
  }
})
