import { expect, test } from '@playwright/test'
import { PART_NAMES } from '../../scene/model/parts'

test.describe('/dev/model', () => {
  test('zeigt das Modell mit Teileliste und Hervorhebung', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))

    const response = await page.goto('/dev/model')
    expect(response?.status()).toBe(200)

    await expect(page.locator('canvas')).toBeVisible()
    // Erst prüfen, wenn das glb geladen ist
    await expect(page.locator('[data-loaded="true"]')).toBeVisible({ timeout: 20_000 })

    const buttons = page.getByRole('list', { name: 'Teile' }).getByRole('button')
    await expect(buttons).toHaveText([...PART_NAMES])

    const cpu = page.getByRole('button', { name: 'cpu', exact: true })
    await expect(cpu).toHaveAttribute('aria-pressed', 'false')
    await cpu.click()
    await expect(cpu).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', { name: 'gpu', exact: true })).toHaveAttribute(
      'aria-pressed',
      'false',
    )

    const sidePanel = page.getByRole('button', { name: 'Seitenwand', exact: true })
    await expect(sidePanel).toHaveAttribute('aria-pressed', 'false')
    await sidePanel.click()
    await expect(sidePanel).toHaveAttribute('aria-pressed', 'true')

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
    expect(errors).toEqual([])
  })
})
