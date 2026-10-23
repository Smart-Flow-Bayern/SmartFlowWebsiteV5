import { describe, expect, it } from 'vitest'
import { FRAGMENTS, LAYOUTS, NODE_NAMES, VIEWBOX, ZONES } from '@/scene/process/layouts'

const key = ([a, b]: readonly [number, number]) => (a < b ? `${a}-${b}` : `${b}-${a}`)

describe('LAYOUTS', () => {
  it('hat 14 Knoten in fester Reihenfolge', () => {
    expect(NODE_NAMES).toEqual(['Anfrage','Angebot','Auftrag','Termin','Material','Einsatz','Stunden','Rechnung','Zahlung','Nachfass','Kunde','Team','Ablage','Rückfrage'])
  })
  it('hat sechs Zustände mit je 14 Knoten innerhalb der ViewBox', () => {
    expect(LAYOUTS).toHaveLength(6)
    for (const l of LAYOUTS) {
      expect(l.nodes).toHaveLength(14)
      for (const [x, y] of l.nodes) {
        expect(x).toBeGreaterThanOrEqual(0); expect(x).toBeLessThanOrEqual(VIEWBOX.width)
        expect(y).toBeGreaterThanOrEqual(0); expect(y).toBeLessThanOrEqual(VIEWBOX.height)
      }
    }
  })
  it('Kanten zeigen auf gültige Knoten und kommen je Zustand nur einmal vor', () => {
    for (const l of LAYOUTS) {
      const keys = l.edges.map(key)
      expect(new Set(keys).size).toBe(keys.length)
      for (const [a, b] of l.edges) { expect(a).not.toBe(b); expect(a).toBeLessThan(14); expect(b).toBeLessThan(14) }
    }
  })
  it('setzt die Zustandsmerkmale wie im Storyboard', () => {
    expect(LAYOUTS.map((l) => l.edges.length)).toEqual([0, 13, 15, 15, 17, 13])
    expect(LAYOUTS.map((l) => l.dashed)).toEqual([false, true, false, false, false, false])
    expect(LAYOUTS.map((l) => l.curved)).toEqual([false, false, true, true, false, false])
    expect(LAYOUTS.map((l) => l.shift)).toEqual([170, -190, 290, -290, 190, 0])
    expect(LAYOUTS.map((l) => l.scale)).toEqual([0.8, 0.8, 0.58, 0.58, 0.8, 0.8])
    expect(LAYOUTS.map((l) => l.packets)).toEqual([false, false, false, true, false, false])
    expect(LAYOUTS.map((l) => l.zones)).toEqual([false, false, false, false, true, false])
    expect(LAYOUTS[1].groups.flat().sort((a, b) => a - b)).toEqual([...Array(14).keys()])
    expect(LAYOUTS[3].nodes).toEqual(LAYOUTS[2].nodes)
  })
  it('Zustand 2 ist eine Spaltenarchitektur mit vier x-Werten', () => {
    const xs = new Set(LAYOUTS[2].nodes.map(([x]) => x))
    expect([...xs].sort((a, b) => a - b)).toEqual([230, 430, 600, 770])
  })
  it('Zustand 5 ist eine zentrierte Zeile im unteren Band', () => {
    const ys = new Set(LAYOUTS[5].nodes.map(([, y]) => y))
    expect(ys.size).toBe(1)
    expect([...ys][0]).toBeGreaterThanOrEqual(520)
    const xs = LAYOUTS[5].nodes.map(([x]) => x)
    expect((Math.min(...xs) + Math.max(...xs)) / 2).toBeCloseTo(500)
  })
  it('Zustand 0 liegt nach Verschiebung und Skalierung rechts (x ≥ 520), Text links bleibt frei', () => {
    const { shift, scale } = LAYOUTS[0]
    for (const [x] of LAYOUTS[0].nodes) {
      const shown = 500 + shift + (x - 500) * scale
      expect(shown).toBeGreaterThanOrEqual(520)
      expect(shown).toBeLessThanOrEqual(VIEWBOX.width)
    }
  })
  it('liefert 26 deterministische Fragmente und drei Nutzenfelder', () => {
    expect(FRAGMENTS).toHaveLength(26)
    for (const f of FRAGMENTS) { expect(f.x).toBeLessThanOrEqual(VIEWBOX.width); expect(f.len).toBeGreaterThanOrEqual(10) }
    expect(ZONES.map((z) => z.label)).toEqual(['Effizienz', 'Skalierbarkeit', 'Produktivität'])
  })
})
