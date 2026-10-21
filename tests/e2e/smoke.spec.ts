import { expect, test } from '@playwright/test'

test('Startseite lädt', async ({ page }) => {
  await page.goto('/')
  // Die Titel-Prüfung (/Smart Flow/) kommt mit Task 2, sobald der Titel gesetzt ist.
  await expect(page.locator('body')).toBeVisible()
})
