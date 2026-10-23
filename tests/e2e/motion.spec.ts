import { expect, test } from '@playwright/test'
import { de } from '@/content/de'
import { SCENES } from '@/scene/process/scenes'

/** Überschrift je Szene; Über hat ihre eigene in `de.about`. */
const titleOf = (id: (typeof SCENES)[number]['id']) => (id === 'ueber' ? de.about.heading : de.scenes[id].title)

test.describe('Reduzierte Bewegung', () => {
  test('Standbild ohne Scroll-Kopplung, Seite bis zum Footer scrollbar', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'reduced')
    const stage = page.locator('svg.process-stage')
    await expect(stage).toHaveAttribute('data-state', '2')

    const scenes = page.locator('section.scene')
    await expect(scenes).toHaveCount(SCENES.length)
    for (const { id } of SCENES) {
      const section = page.locator(`section.scene#${id}`)
      await section.scrollIntoViewIfNeeded()
      await expect(section).toBeVisible()
      await expect(stage).toHaveAttribute('data-state', '2')
    }

    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer).toBeInViewport()
    await expect(stage).toHaveAttribute('data-state', '2')
  })
})

test.describe('Ohne JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('Grafik und alle Überschriften stehen im HTML', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('svg.process-stage .node')).toHaveCount(14)

    // Standbild ohne Verschiebung über den Rand: alle 14 Labels innerhalb der Grafik und des Bildschirms
    // (mobil zentriert mit Skalierung 1, Desktop wie bisher).
    const outside = await page.evaluate(() => {
      const svg = document.querySelector('svg.process-stage')!.getBoundingClientRect()
      const left = Math.max(0, svg.left), right = Math.min(window.innerWidth, svg.right)
      const top = Math.max(0, svg.top), bottom = Math.min(window.innerHeight, svg.bottom)
      return [...document.querySelectorAll('svg.process-stage .label')]
        .filter((el) => {
          const r = el.getBoundingClientRect()
          return r.width === 0 || r.left < left - 0.5 || r.right > right + 0.5 || r.top < top - 0.5 || r.bottom > bottom + 0.5
        })
        .map((el) => el.textContent)
    })
    expect(await page.locator('svg.process-stage .label').count()).toBe(14)
    expect(outside).toEqual([])

    // Mobil (unter 720 px): keine Desktop-Verschiebung, keine Skalierung unter 1 (Spec 5.5).
    if (page.viewportSize()!.width < 720) {
      const { offset, width, transform } = await page.evaluate(() => {
        const svg = document.querySelector('svg.process-stage')!.getBoundingClientRect()
        const nodes = [...document.querySelectorAll('svg.process-stage .node')].map((el) => el.getBoundingClientRect())
        const center = (Math.min(...nodes.map((n) => n.left)) + Math.max(...nodes.map((n) => n.right))) / 2
        return {
          offset: Math.abs(center - (svg.left + svg.right) / 2),
          width: svg.width,
          transform: getComputedStyle(document.querySelector('svg.process-stage g.root')!).transform,
        }
      })
      expect(offset).toBeLessThan(width * 0.03)
      expect(transform).toBe('matrix(1, 0, 0, 1, 0, 0)')
    }

    for (const { id } of SCENES) {
      const heading = page.locator(`#${id}-title`)
      await expect(heading).toHaveText(titleOf(id))
      await heading.scrollIntoViewIfNeeded()
      await expect(heading).toBeVisible()
    }
  })
})
