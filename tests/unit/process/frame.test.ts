import { describe, expect, it } from 'vitest'
import { EDGE_KEYS, STILL_PROGRESS, bezierPoint, ease, edgePath, frame } from '@/scene/process/frame'
import { LAYOUTS } from '@/scene/process/layouts'

const desktop = { mobile: false, reduced: false }
const mobile = { mobile: true, reduced: false }

describe('ease', () => {
  it('ist an den Rändern 0 und 1 und in der Mitte 0,5', () => {
    expect(ease(0)).toBe(0); expect(ease(1)).toBe(1); expect(ease(0.5)).toBeCloseTo(0.5)
  })
})

describe('frame', () => {
  it('liegt bei ganzzahligem Fortschritt und time 0 exakt auf dem Layout', () => {
    for (let s = 0; s <= 5; s++) {
      const f = frame(s, 0, desktop)
      expect(f.state).toBe(s)
      f.nodes.forEach((n, i) => { expect(n.x).toBeCloseTo(LAYOUTS[s].nodes[i][0]); expect(n.y).toBeCloseTo(LAYOUTS[s].nodes[i][1]) })
    }
  })
  it('klemmt den Fortschritt auf 0 bis 5', () => {
    expect(frame(-1, 0, desktop).state).toBe(0)
    expect(frame(9, 0, desktop).state).toBe(5)
    expect(frame(9, 0, desktop).t).toBe(0)
  })
  it('interpoliert Knoten in der Mitte eines Übergangs', () => {
    const f = frame(1.5, 0, desktop)
    const [ax, ay] = LAYOUTS[1].nodes[0], [bx, by] = LAYOUTS[2].nodes[0]
    expect(f.nodes[0].x).toBeCloseTo((ax + bx) / 2); expect(f.nodes[0].y).toBeCloseTo((ay + by) / 2)
  })
  it('blendet Kanten über den Übergang und zieht neue Kanten', () => {
    const f = frame(1.5, 0, desktop)
    const only1 = f.edges.find((e) => e.a === 10 && e.b === 13)   // in E1, nicht in E2
    const only2 = f.edges.find((e) => e.a === 1 && e.b === 2)     // in E2, nicht in E1
    expect(only1!.opacity).toBeCloseTo(0.5)
    expect(only2!.opacity).toBe(1); expect(only2!.drawn).toBeCloseTo(0.5)
    expect(frame(1, 0, desktop).edges.every((e) => e.drawn === 1)).toBe(true)
  })
  it('Kanten sind gestrichelt nur in Zustand 1 und kräftig ab Zustand 2', () => {
    expect(frame(1, 0, desktop).edges.some((e) => e.dashed && e.opacity > 0)).toBe(true)
    expect(frame(2, 0, desktop).edges.some((e) => e.dashed)).toBe(false)
    expect(frame(2, 0, desktop).edges.filter((e) => e.opacity > 0).every((e) => e.strong)).toBe(true)
  })
  it('Fragmente nur in Zustand 0, Zonen in Zustand 4, Pakete in Zustand 3', () => {
    expect(frame(0, 0, desktop).fragments).toBe(1)
    expect(frame(0.5, 0, desktop).fragments).toBeCloseTo(0.5)
    expect(frame(1, 0, desktop).fragments).toBe(0)
    expect(frame(4, 0, desktop).zones).toEqual([0, 0, 0])
    expect(frame(4.5, 0, desktop).zones.map((z) => +z.toFixed(2))).toEqual([1, 0.5, 0])
    expect(frame(3, 1, desktop).packets).toHaveLength(9)
    expect(frame(3, 1, desktop).packets.every((p) => p.opacity === 1)).toBe(true)
    expect(frame(3, 1, mobile).packets).toHaveLength(5)
    expect(frame(1, 1, desktop).packets.every((p) => p.opacity === 0)).toBe(true)
  })
  it('alle Knoten sind am Ende aktiv, in Zustand 1 gruppenweise', () => {
    expect(frame(5, 0, desktop).nodes.every((n) => n.active)).toBe(true)
    const g0 = frame(1.1, 0, desktop).nodes.filter((n) => n.active).length
    expect(g0).toBe(LAYOUTS[1].groups[0].length)
  })
  it('aktiviert alle Knoten ab der zweiten Hälfte des Übergangs 4 nach 5', () => {
    expect(frame(4.75, 0, desktop).nodes.every((n) => n.active)).toBe(true)
    expect(frame(4.25, 0, desktop).nodes.every((n) => n.active)).toBe(false)
  })
  it('verschiebt und skaliert nur auf dem Desktop', () => {
    expect(frame(2, 0, desktop).transform).toBe('translate(790 300) scale(0.58) translate(-500 -300)')
    expect(frame(2, 0, mobile).transform).toBe('translate(500 300) scale(1) translate(-500 -300)')
  })
  it('hellt den Hintergrund mit dem Fortschritt auf', () => {
    expect(frame(0, 0, desktop).background).toBe('color-mix(in srgb, var(--color-ground) 100%, var(--color-ground-end))')
    expect(frame(5, 0, desktop).background).toBe('color-mix(in srgb, var(--color-ground) 30%, var(--color-ground-end))')
  })
  it('liefert bei reduced immer das Standbild Zustand 3 ohne Pakete und ohne Treiben', () => {
    const a = frame(0, 0, { mobile: false, reduced: true })
    const b = frame(4.7, 12.3, { mobile: false, reduced: true })
    expect(a).toEqual(b)
    expect(a.state).toBe(STILL_PROGRESS)
    expect(a.packets.every((p) => p.opacity === 0)).toBe(true)
  })
  it('Idle-Versatz bleibt unter 7,2 Einheiten', () => {
    const f = frame(0, 3.3, desktop)
    f.nodes.forEach((n, i) => { expect(Math.abs(n.x - LAYOUTS[0].nodes[i][0])).toBeLessThanOrEqual(7.2) })
  })
  it('edgePath und bezierPoint passen zusammen', () => {
    expect(edgePath([0, 0], [10, 20], 0)).toBe('M0 0L10 20')
    expect(edgePath([0, 0], [10, 20], 1)).toBe('M0 0C5 0 5 20 10 20')
    expect(bezierPoint([0, 0], [10, 20], 0, 1)).toEqual([0, 0])
    expect(bezierPoint([0, 0], [10, 20], 1, 1)).toEqual([10, 20])
  })
  it('Kurvenfaktor blendet gerade und Bezier stetig über', () => {
    // halber Faktor: Kontrollpunkte auf halbem Weg zwischen Endpunkt und voller Bezier-Lage
    expect(edgePath([0, 0], [10, 20], 0.5)).toBe('M0 0C2.5 0 7.5 20 10 20')
    // Faktor 0 als Kurve ist die Gerade: Punkte liegen auf der Strecke
    const [x, y] = bezierPoint([0, 0], [10, 20], 0.5, 0)
    expect(y).toBeCloseTo(2 * x)
    expect(bezierPoint([0, 0], [10, 20], 0.5, 1)).toEqual([5, 10])
  })
  it('Kantenform springt nicht an den Grenzen gerader und gebogener Zustände', () => {
    const coords = (d: string) => (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number)
    for (const p of [2, 4]) {
      const before = frame(p - 1e-6, 0, desktop).edges, after = frame(p, 0, desktop).edges
      const at = (es: typeof before) => es.find((e) => e.a === 1 && e.b === 2)!
      // Vergleich als Kubik: ein gerades 'L' entspricht C mit Kontrollpunkten auf den Endpunkten
      const asCubic = (d: string) => {
        const c = coords(d)
        return c.length === 4 ? [c[0], c[1], c[0], c[1], c[2], c[3], c[2], c[3]] : c
      }
      const a = asCubic(at(before).d), b = asCubic(at(after).d)
      a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 2))
    }
  })
  it('Zonen sind in Zustand 5 aus und laufen stetig dorthin', () => {
    expect(frame(5, 0, desktop).zones).toEqual([0, 0, 0])
    frame(5 - 1e-6, 0, desktop).zones.forEach((z) => expect(z).toBeCloseTo(0, 3))
  })
  it('mobil keine Labels in Zustand 1, Desktop unverändert', () => {
    expect(frame(1, 0, mobile).nodes.every((n) => n.label === 0)).toBe(true)
    expect(frame(1.25, 0, mobile).nodes.every((n) => n.label === 0)).toBe(true)
    expect(frame(2, 0, mobile).nodes.every((n) => n.label === 1)).toBe(true)
    expect(frame(1.5, 0, desktop).nodes.every((n) => n.label === 1)).toBe(true)
  })
  it('EDGE_KEYS ist die Vereinigung aller Kanten in fester Reihenfolge', () => {
    expect(EDGE_KEYS.length).toBe(new Set(EDGE_KEYS).size)
    expect(frame(0, 0, desktop).edges.map((e) => `${e.a}-${e.b}`)).toEqual([...EDGE_KEYS])
  })
})
