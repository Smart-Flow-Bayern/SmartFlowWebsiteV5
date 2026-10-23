import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { progress, waitForScroll } from './helpers'

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze()
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => ({ id: v.id, impact: v.impact, targets: v.nodes.map((n) => n.target.join(' ')) }))
}

test('keine schweren axe-Verstöße bei Scroll 0', async ({ page }) => {
  await page.goto('/')
  await waitForScroll(page)
  expect(await seriousViolations(page)).toEqual([])
})

test('keine schweren axe-Verstöße bei #kontakt', async ({ page }) => {
  await page.goto('/#kontakt')
  await waitForScroll(page)
  await expect.poll(() => progress(page), { timeout: 10_000 }).toBeGreaterThan(0.995)
  expect(await seriousViolations(page)).toEqual([])
})

test('Fokusring nach Tab sichtbar', async ({ page }) => {
  await page.goto('/')
  await waitForScroll(page)
  await page.keyboard.press('Tab')
  const outline = await page.evaluate(() => {
    const el = document.activeElement
    return el && el !== document.body ? getComputedStyle(el).outlineStyle : 'none'
  })
  expect(outline).not.toBe('none')
})
