import { expect, test } from '@playwright/test'

for (const path of ['/en', '/en/terms.html']) {
  test(`${path} leitet dauerhaft auf / um`, async ({ request }) => {
    const res = await request.get(path, { maxRedirects: 0 })
    expect(res.status()).toBe(308)
    expect(res.headers()['location']).toBe('/')
  })
}

test('/index.html landet auf /', async ({ page }) => {
  const res = await page.goto('/index.html')
  expect(res?.status()).toBe(200)
  expect(new URL(page.url()).pathname).toBe('/')
})
