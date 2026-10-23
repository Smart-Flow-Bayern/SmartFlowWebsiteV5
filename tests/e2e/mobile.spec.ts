import { expect, test, type Page } from '@playwright/test'

// Läuft im Projekt `mobile` (iPhone 13, 390×844) und zusätzlich in den hier gesetzten Viewports.
const VIEWPORTS = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
] as const

async function checkLayout(page: Page) {
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  const { width } = page.viewportSize()!
  const portrait = width < 720

  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)

  // Mobile Hochformat: Bühne oben, Text darunter. Querformat ab 720 px nutzt das Desktop-Layout.
  if (portrait) {
    const stage = (await page.locator('svg.process-stage').boundingBox())!
    const h1 = (await page.locator('h1').boundingBox())!
    expect(stage.y + stage.height).toBeLessThanOrEqual(h1.y)
  }

  // Szenen-Links in einer Zeile, alle Links der Kopfzeile mindestens 44 px hoch.
  const sceneLinks = page.locator('header .nav-scene')
  const tops = await sceneLinks.evaluateAll((els) => els.map((el) => Math.round(el.getBoundingClientRect().top)))
  expect(new Set(tops).size).toBe(1)
  const heights = await page
    .locator('header a')
    .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().height))
  for (const h of heights) expect(h).toBeGreaterThanOrEqual(44)

  if (!portrait) {
    await expect(page.locator('h1')).toBeInViewport()
    expect(await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight)).toBe(true)
  }

  await expect(page.locator('.progress-nav')).toBeHidden()
}

test('Layout im Gerät des Projekts', async ({ page }) => {
  await checkLayout(page)
})

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.width}×${viewport.height}`, () => {
    test.use({ viewport })
    test('Layout', async ({ page }) => {
      await checkLayout(page)
    })
  })
}
