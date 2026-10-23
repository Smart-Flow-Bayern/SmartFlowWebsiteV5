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
    for (const { id } of SCENES) {
      const heading = page.locator(`#${id}-title`)
      await expect(heading).toHaveText(titleOf(id))
      await heading.scrollIntoViewIfNeeded()
      await expect(heading).toBeVisible()
    }
  })
})
