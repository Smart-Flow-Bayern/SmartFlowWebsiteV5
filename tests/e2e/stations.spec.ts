import { expect, test, type Page } from '@playwright/test'
import { de } from '../../content/de'
import { ABOUT_WINDOW, STATIONS } from '../../scene/stations'

type Slug = 'mainboard' | 'ueber' | 'cpu' | 'ram' | 'gpu' | 'ssd'

const win = (id: string) => STATIONS.find((s) => s.id === id)!
const mid = (w: { start: number; end: number }) => (w.start + w.end) / 2

const CASES: { slug: Slug; mid: number; title: string }[] = [
  { slug: 'mainboard', mid: mid(win('mainboard')), title: de.station1.claim },
  { slug: 'ueber', mid: mid(ABOUT_WINDOW), title: de.about.heading },
  { slug: 'cpu', mid: mid(win('cpu')), title: de.cpu.title },
  { slug: 'ram', mid: mid(win('ram')), title: de.ram.title },
  { slug: 'gpu', mid: mid(win('gpu')), title: de.gpu.title },
  { slug: 'ssd', mid: mid(win('ssd')), title: de.ssd.title },
]

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

const state = (page: Page, id: string) => page.locator(`#${id}`).getAttribute('data-state')

test.describe('Stationen 1 bis 5 und Über', () => {
  for (const c of CASES) {
    test(`${c.slug}: nur dieses Overlay ist in der Fenstermitte sichtbar`, async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
      await scrollToProgress(page, c.mid)
      const section = page.locator(`section#${c.slug}`)
      await expect(section).toHaveAttribute('data-state', 'visible')
      await expect(section.locator('h2').first()).toHaveText(c.title)
      for (const other of CASES.filter((o) => o.slug !== c.slug)) {
        expect(await state(page, other.slug)).toBe('hidden')
      }
      await expect(page.locator('#station0')).toHaveAttribute('data-state', 'hidden')
    })
  }

  test('Station 0 ist bei progress 0 sichtbar und verschwindet mit der Fahrt', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#station0')).toHaveAttribute('data-state', 'visible')
    await scrollToProgress(page, 0.5)
    await expect(page.locator('#station0')).toHaveAttribute('data-state', 'hidden')
    await expect(page.locator('#station0')).toHaveAttribute('inert', '')
  })

  test('hidden-Overlays sind inert', async ({ page }) => {
    await page.goto('/')
    await scrollToProgress(page, mid(win('cpu')))
    await expect(page.locator('section#ram')).toHaveAttribute('inert', '')
    await expect(page.locator('section#cpu')).not.toHaveAttribute('inert', '')
  })

  test('Mainboard blendet die fünf Labels nacheinander ein', async ({ page }) => {
    await page.goto('/')
    const w = win('mainboard')
    const len = w.end - w.start
    await scrollToProgress(page, w.start + 0.3 * len)
    const revealed = page.locator('#mainboard [data-revealed="true"]')
    expect(await revealed.count()).toBe(0)
    await scrollToProgress(page, w.end - 0.12 * len)
    await expect(revealed).toHaveCount(de.station1.labels.length)
  })

  test('SSD zeigt in der Mitte mindestens zwei Blöcke und am Ende alle vier', async ({ page }) => {
    await page.goto('/')
    const w = win('ssd')
    await scrollToProgress(page, mid(w) + 0.01)
    const revealed = page.locator('#ssd [data-revealed="true"]')
    await expect
      .poll(() => revealed.count(), { message: 'mindestens zwei Blöcke in der Fenstermitte' })
      .toBeGreaterThanOrEqual(2)
    await scrollToProgress(page, w.end - 0.12 * (w.end - w.start))
    await expect(revealed).toHaveCount(4)
    await expect(page.locator('#ssd')).toBeVisible()
    for (const b of de.ssd.blocks) {
      await expect(page.locator('#ssd')).toContainText(b.name)
      await expect(page.locator('#ssd')).toContainText(b.deliverable)
    }
  })

  test('GPU zeigt Vorher und Nachher', async ({ page }) => {
    await page.goto('/')
    await scrollToProgress(page, mid(win('gpu')))
    const gpu = page.locator('#gpu')
    await expect(gpu).toBeVisible()
    await expect(gpu).toContainText('Vorher')
    await expect(gpu).toContainText('Nachher')
    await expect(gpu).toContainText(de.gpu.before[0])
    await expect(gpu).toContainText(de.gpu.after[2])
  })

  test.describe('Mobil 320x568', () => {
    test.use({ viewport: { width: 320, height: 568 } })
    for (const slug of ['cpu', 'gpu', 'ssd'] as const) {
      test(`${slug}: kein horizontales Scrollen, jeder Eintrag passt in den Rahmen`, async ({ page }) => {
        await page.goto('/')
        await expect(page.locator('html')).toHaveAttribute('data-mode', '3d')
        const w = win(slug)
        const len = w.end - w.start
        // Positionen im Fenster, in denen jeweils ein anderer Eintrag der Reihe aktuell ist.
        for (const t of [0.45, 0.6, 0.75, 0.85]) {
          await scrollToProgress(page, w.start + t * len)
          const section = page.locator(`section#${slug}[data-state="visible"]`)
          await expect(section).toBeVisible()
          expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
          const m = await section.evaluate((el) => ({
            need: (el.firstElementChild as HTMLElement).scrollHeight,
            avail: el.clientHeight - 24,
          }))
          expect(m.need, `${slug} @${t}`).toBeLessThanOrEqual(m.avail)
        }
      })
    }
  })
})
