import { expect, test } from '@playwright/test'
import { de } from '@/content/de'

test('Startseite lädt ohne Konsolenfehler', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('h1')).toHaveText(de.scenes.komplexitaet.title)
  await expect(page.locator('svg.process-stage')).toHaveCount(1)
  await page.waitForLoadState('networkidle')
  expect(errors).toEqual([])
})
