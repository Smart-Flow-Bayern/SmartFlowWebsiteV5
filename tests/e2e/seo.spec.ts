import { expect, test } from '@playwright/test'
import { de } from '../../content/de'
import { en } from '../../content/en'

type LD = { '@type': string; url?: string }

async function jsonLd(page: import('@playwright/test').Page) {
  const texts = await page.locator('script[type="application/ld+json"]').allTextContents()
  return texts.flatMap((t) => JSON.parse(t) as LD[])
}

test.describe('SEO', () => {
  test('/ has title, description, og:image, parsable JSON-LD', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(de.meta.title)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', de.meta.description)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/opengraph-image(\?.*)?$/)
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'de_DE')
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
    const objs = await jsonLd(page)
    expect(objs.filter((o) => o['@type'] === 'LocalBusiness')).toHaveLength(1)
    expect(objs.filter((o) => o['@type'] === 'Service')).toHaveLength(3)
  })

  test('/en has English metadata and JSON-LD', async ({ page }) => {
    await page.goto('/en')
    await expect(page).toHaveTitle(en.meta.title)
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/opengraph-image(\?.*)?$/)
    const lb = (await jsonLd(page)).find((o) => o['@type'] === 'LocalBusiness')
    expect(lb?.url).toMatch(/\/en$/)
  })

  test('sitemap lists / and /en only', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.ok()).toBe(true)
    const xml = await res.text()
    expect(xml).toMatch(/<loc>https:\/\/smartflow\.bayern\/?<\/loc>/)
    expect(xml).toContain('<loc>https://smartflow.bayern/en</loc>')
    expect(xml).not.toContain('/brand')
    expect(xml).not.toContain('/dev/')
  })

  test('robots disallows /dev/ and /brand', async ({ request }) => {
    const txt = await (await request.get('/robots.txt')).text()
    expect(txt).toContain('Allow: /')
    expect(txt).toContain('Disallow: /dev/')
    expect(txt).toContain('Disallow: /brand')
    expect(txt).toContain('Sitemap: https://smartflow.bayern/sitemap.xml')
  })

  test('manifest is served', async ({ request }) => {
    const res = await request.get('/manifest.webmanifest')
    expect(res.ok()).toBe(true)
    const m = await res.json()
    expect(m.theme_color).toBe('#050607')
    expect(m.name).toBe('Smart Flow')
  })

  for (const path of ['/brand', '/dev/model']) {
    test(`${path} is noindex`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
    })
  }
})
