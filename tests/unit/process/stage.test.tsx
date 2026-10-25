import { render } from '@testing-library/react'
import gsap from 'gsap'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ProcessStage } from '@/components/process/ProcessStage'
import { collectStage, cssTransform, screenFactor, stageAttrs, writeStage } from '@/components/process/stage-dom'
import { progressStore } from '@/lib/scroll/progress'
import { EDGE_KEYS, STILL_PROGRESS, frame } from '@/scene/process/frame'

describe('ProcessStage (SSR-Standbild)', () => {
  const html = renderToStaticMarkup(<ProcessStage />)
  it('rendert das Standbild Zustand 3 mit allen Elementen', () => {
    expect(html).toContain('data-state="2"')
    expect(html.match(/class="node"/g)).toHaveLength(14)
    expect(html.match(/class="edge"/g)).toHaveLength(EDGE_KEYS.length)
    expect(html.match(/class="label"/g)).toHaveLength(14)
    expect(html.match(/class="frag"/g)).toHaveLength(26)
    expect(html.match(/class="packet"/g)).toHaveLength(9)
    expect(html.match(/class="packet"[^>]*r="3.5"/g)).toHaveLength(9)
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('pathLength="1"')
  })
  it('die Standbild-Attribute entsprechen frame(STILL_PROGRESS)', () => {
    const still = frame(STILL_PROGRESS, 0, { mobile: false, reduced: true })
    expect(html).toContain(`transform="${still.transform}"`)
    expect(html).toContain('Anfrage')
    expect(html).not.toContain('opacity="NaN"')
  })
  it('gibt das Standbild je Breakpoint als CSS-Transform aus: mobil ohne Verschiebung, Skalierung 1', () => {
    expect(html).not.toContain('data-live')
    const desktop = cssTransform(frame(STILL_PROGRESS, 0, { mobile: false, reduced: true }).transform)
    const mobile = cssTransform(frame(STILL_PROGRESS, 0, { mobile: true, reduced: true }).transform)
    expect(html).toContain(`--root-desktop:${desktop}`)
    expect(html).toContain(`--root-mobile:${mobile}`)
    expect(mobile).toBe('translate(500px, 300px) scale(1) translate(-500px, -300px)')
  })
})

describe('cssTransform', () => {
  it('setzt Einheiten und Kommas, Skalierung bleibt', () => {
    expect(cssTransform('translate(790 300) scale(0.58) translate(-500 -300)')).toBe(
      'translate(790px, 300px) scale(0.58) translate(-500px, -300px)',
    )
  })
})

describe('stageAttrs', () => {
  it('rundet auf höchstens zwei Nachkommastellen', () => {
    const a = stageAttrs(frame(1.37, 3.21, { mobile: false, reduced: false }), false)
    const values = [
      a.transform,
      ...a.edges.map((e) => e.d + ' ' + e.opacity + ' ' + e.dashoffset),
      ...a.nodes.map((n) => n.d),
      ...a.labels.map((l) => `${l.x} ${l.y}`),
    ].join(' ')
    expect(values).not.toMatch(/\d\.\d{3}/)
    expect(values).not.toContain('NaN')
  })
  it('mobil: Fragmente ab 12 und Pakete ab 5 unsichtbar, Elementzahl bleibt', () => {
    const a = stageAttrs(frame(0.2, 1, { mobile: true, reduced: false }), true)
    expect(a.fragments).toHaveLength(26)
    expect(a.fragments.slice(12).every((f) => f.opacity === '0')).toBe(true)
    expect(a.fragments[0].opacity).not.toBe('0')
    const b = stageAttrs(frame(3, 1, { mobile: true, reduced: false }), true)
    expect(b.packets).toHaveLength(9)
    expect(b.packets.slice(5).every((p) => p.opacity === '0')).toBe(true)
    expect(b.packets[0].opacity).toBe('1')
  })
})

describe('screenFactor', () => {
  it('gleicht ViewBox-Maßstab und Bühnenskalierung aus', () => {
    expect(screenFactor('translate(790 300) scale(0.5) translate(-500 -300)', 1)).toBe(2)
    expect(screenFactor('translate(500 300) scale(1) translate(-500 -300)', 0.4)).toBe(2.5)
    expect(screenFactor('translate(500 300) scale(1) translate(-500 -300)', 0)).toBeUndefined()
  })
})

describe('Bildschirmmaße (Spec 5.2)', () => {
  const side = (d: string) => Number(/h(-?[\d.]+)/.exec(d)![1])
  it('ohne Messung (SSR) bleiben Knoten und Labels auf Layoutgröße', () => {
    const a = stageAttrs(frame(2, 0, { mobile: false, reduced: false }), false)
    expect(a.screenK).toBeUndefined()
    expect(side(a.nodes[0].d)).toBe(18)
  })
  it('mobil mindestens 12 px Knoten, Label rechts mit Abstand', () => {
    const pxPerUnit = 0.39
    const f = frame(2, 0, { mobile: true, reduced: false })
    const a = stageAttrs(f, true, pxPerUnit)
    expect(side(a.nodes[0].d) * pxPerUnit).toBeGreaterThanOrEqual(12 - 0.01)
    const right = f.nodes[0].x + side(a.nodes[0].d) / 2
    expect(Number(a.labels[0].x)).toBeGreaterThan(right)
  })
  it('Desktop Zustand 3 bleibt bei Knoten und Labelabstand unverändert', () => {
    const f = frame(2, 0, { mobile: false, reduced: false })
    const a = stageAttrs(f, false, 1.39)
    expect(side(a.nodes[0].d)).toBe(18)
    expect(Number(a.labels[0].x)).toBeCloseTo(f.nodes[0].x + 14, 1)
  })
  it('writeStage setzt --stroke-k und --label-k, abhängig von der Skalierung', () => {
    // Reduced Motion: kein Ticker, der dazwischenschreibt
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce'), media: query }))
    const { container } = render(<ProcessStage />)
    vi.unstubAllGlobals()
    const els = collectStage(container.querySelector<HTMLElement>('.stage')!)
    writeStage(els, stageAttrs(frame(2, 0, { mobile: false, reduced: false }), false, 1))
    expect(els.svg.style.getPropertyValue('--stroke-k')).toBe('1.72')
    expect(els.svg.style.getPropertyValue('--label-k')).toBe('1.72')
    writeStage(els, stageAttrs(frame(0, 0, { mobile: false, reduced: false }), false, 1))
    expect(els.svg.style.getPropertyValue('--stroke-k')).toBe('1.25')
  })
})

describe('ProcessStage (Client)', () => {
  const matchMedia = (reduce: boolean) =>
    vi.fn((query: string) => ({ matches: reduce && query.includes('reduce'), media: query }) as MediaQueryList)

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    delete document.documentElement.dataset.motion
  })

  it('hängt den Ticker an und entfernt ihn beim Unmount', () => {
    vi.stubGlobal('matchMedia', matchMedia(false))
    const add = vi.spyOn(gsap.ticker, 'add')
    const remove = vi.spyOn(gsap.ticker, 'remove')
    const { unmount } = render(<ProcessStage />)
    expect(add).toHaveBeenCalledTimes(1)
    const tick = add.mock.calls[0][0]
    unmount()
    expect(remove).toHaveBeenCalledWith(tick)
  })

  it('schreibt im Ticker Attribute ohne React-Re-Render', () => {
    vi.stubGlobal('matchMedia', matchMedia(false))
    const add = vi.spyOn(gsap.ticker, 'add')
    const { container } = render(<ProcessStage />)
    progressStore.set(0)
    add.mock.calls[0][0](1, 16, 1, 0)
    expect(container.querySelector('svg')?.getAttribute('data-state')).toBe('0')
    expect(container.querySelector('.frag')?.getAttribute('opacity')).toBe('1')
  })

  it.each([
    ['prefers-reduced-motion', () => vi.stubGlobal('matchMedia', matchMedia(true))],
    [
      'html[data-motion="reduced"]',
      () => {
        vi.stubGlobal('matchMedia', matchMedia(false))
        document.documentElement.dataset.motion = 'reduced'
      },
    ],
  ])('Reduced Motion (%s): kein Ticker, Standbild bleibt', (_, setup) => {
    setup()
    const add = vi.spyOn(gsap.ticker, 'add')
    const { container } = render(<ProcessStage />)
    expect(add).not.toHaveBeenCalled()
    expect(container.querySelector('svg')?.getAttribute('data-state')).toBe('2')
  })
})
