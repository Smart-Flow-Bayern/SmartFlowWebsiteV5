import { expect, test } from '@playwright/test'
import { colors } from '@/lib/brand/tokens'

test.describe('/brand', () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto('/brand')
    // Auch die 404-Seite trägt noindex, deshalb zuerst den Status prüfen
    expect(response?.status()).toBe(200)
  })

  test('zeigt die Abschnitte der Markenseite', async ({ page }) => {
    for (const name of ['Wortmarke', 'Bildmarke', 'Farben', 'Schrift']) {
      await expect(page.getByRole('heading', { level: 2, name, exact: true })).toBeVisible()
    }
  })

  test('zeigt alle fünf Farbwerte als Text', async ({ page }) => {
    for (const hex of [colors.ground, colors.groundEnd, colors.accent, colors.muted, colors.ink]) {
      await expect(page.getByText(hex, { exact: true }).first()).toBeVisible()
    }
  })

  test('ist von der Indexierung ausgenommen', async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  })
})
