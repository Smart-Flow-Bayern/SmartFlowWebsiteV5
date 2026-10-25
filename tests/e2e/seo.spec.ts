import { expect, test } from '@playwright/test'
import { de } from '@/content/de'

test('Metadaten, JSON-LD und Vorschaubild', async ({ page, request }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(de.meta.title)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', de.meta.description)

  const ld = page.locator('script[type="application/ld+json"]')
  await expect(ld).toHaveCount(1)
  const data = JSON.parse((await ld.textContent()) ?? '') as { '@type': string }[]
  const types = data.map((d) => d['@type'])
  expect(types.filter((t) => t === 'Service')).toHaveLength(3)
  expect(types.filter((t) => t === 'LocalBusiness')).toHaveLength(1)

  // og:image zeigt auf die Produktions-Domain; geprüft wird derselbe Pfad am Testserver.
  const og = await page.locator('meta[property="og:image"]').getAttribute('content')
  expect(og).toBeTruthy()
  const { pathname, search } = new URL(og!)
  const image = await request.get(pathname + search)
  expect(image.status()).toBe(200)
  expect(image.headers()['content-type']).toBe('image/png')
  const png = await image.body()
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630])

  await expect(page.locator('link[hreflang]')).toHaveCount(0)
  // Next schreibt die Startseite ohne Schrägstrich (https://smartflow.bayern); als URL ist das dieselbe Adresse.
  const canonical = page.locator('link[rel="canonical"]')
  await expect(canonical).toHaveCount(1)
  expect(new URL((await canonical.getAttribute('href'))!).href).toBe('https://smartflow.bayern/')
})
