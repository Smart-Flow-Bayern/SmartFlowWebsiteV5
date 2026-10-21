import { expect, test, type Page } from '@playwright/test'
import { de } from '../../content/de'

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 })

async function scrollToProgress(page: Page, p: number) {
  await page.evaluate(
    (target) =>
      window.scrollTo(0, target * (document.documentElement.scrollHeight - window.innerHeight)),
    p,
  )
  await expect
    .poll(() => page.evaluate((target) => Math.abs((window.__sf?.progress ?? 0) - target), p), { timeout: 10_000 })
    .toBeLessThan(0.01)
  await page.waitForTimeout(400)
}

const progress = (page: Page) => page.evaluate(() => window.__sf?.progress ?? -1)

async function openCpu(page: Page) {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
  await scrollToProgress(page, 0.35)
  await expect(page.locator('#cpu')).toHaveAttribute('data-state', 'visible')
}

test.describe('Mobil 390x844', () => {
  test('Station 0, CPU-Overlay und kein Überlauf', async ({ page }, testInfo) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
    await expect(page.locator('h1')).toHaveText(de.station0.sentence)
    await expect(page.locator('h1')).toBeVisible()
    await scrollToProgress(page, 0.35)
    await expect(page.locator('#cpu')).toHaveAttribute('data-state', 'visible')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
    const box = await page.locator('#cpu .station-overlay-body').boundingBox()
    expect(box!.width).toBeLessThanOrEqual(390 - 32)
    expect((await page.locator('.nav-bar').boundingBox())!.height).toBe(84)
    await page.screenshot({ path: testInfo.outputPath('t20-mobile-cpu.png') })
  })

  test('Höhe 844 auf 760: kein Refresh, kein Sprung', async ({ page }) => {
    await openCpu(page)
    const before = await progress(page)
    await page.setViewportSize({ width: 390, height: 760 })
    await page.waitForTimeout(400)
    const after = await progress(page)
    expect(after).toBeGreaterThanOrEqual(0.28)
    expect(after).toBeLessThanOrEqual(0.42)
    expect(Math.abs(after - before)).toBeLessThan(0.005)
  })

  test('Breite 390 auf 414: Progress bleibt', async ({ page }) => {
    await openCpu(page)
    const before = await progress(page)
    await page.setViewportSize({ width: 414, height: 896 })
    await page.waitForTimeout(400)
    expect(Math.abs((await progress(page)) - before)).toBeLessThan(0.01)
  })
})

test.describe('Mobil 320x568', () => {
  test.use({ viewport: { width: 320, height: 568 } })
  test('CPU-Text wird nicht abgeschnitten', async ({ page }, testInfo) => {
    await openCpu(page)
    const m = await page.locator('#cpu .station-overlay-body').evaluate((el) => ({
      sh: el.scrollHeight,
      ch: el.clientHeight,
      w: el.getBoundingClientRect().width,
      nav: document.querySelector('.nav-bar')?.getBoundingClientRect().height ?? null,
      sw: document.documentElement.scrollWidth,
    }))
    expect(m.sh).toBeLessThanOrEqual(m.ch + 1)
    expect(m.w).toBeLessThanOrEqual(320 - 32)
    expect(m.sw).toBe(320)
    expect(m.nav).toBe(84)
    const brand = (await page.locator('.nav-brand svg').boundingBox())!
    const cta = (await page.locator('.nav-cta').boundingBox())!
    expect(brand.y).toBeGreaterThanOrEqual(0)
    expect(cta.y + cta.height).toBeLessThanOrEqual(84)
    expect(cta.height).toBeGreaterThanOrEqual(44)
    expect(Math.abs(brand.y + brand.height / 2 - (cta.y + cta.height / 2))).toBeLessThan(4)
    await page.screenshot({ path: testInfo.outputPath('t20-mobile-320.png') })
  })
})
