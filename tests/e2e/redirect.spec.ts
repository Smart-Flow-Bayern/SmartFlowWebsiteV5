import { test } from '@playwright/test'

test('/en landet auf /', async ({ page }) => {
  await page.goto('/en')
  await page.waitForURL((url) => url.pathname === '/')
})
