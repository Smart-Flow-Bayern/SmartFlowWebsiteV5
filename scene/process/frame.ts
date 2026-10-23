// Reine Frame-Berechnung der Prozessgrafik: Scrollfortschritt (0..5) und Zeit
// ergeben einen vollständigen, deterministischen Grafikzustand. Logik nach
// docs/rebranding-v2/mockups/konzepte.html (render()).
//
// Hinweise für die Bühne (Task 6):
// - Nicht-endlicher progress (NaN, ±Infinity) wird als 0 behandelt, sonst auf [0, 5] geklemmt.
// - Unsichtbare Kanten (opacity 0) haben d = ''; sichtbare Kanten haben immer einen Pfad.
// - reduced: Standbild frame(STILL_PROGRESS, 0); das Paket-Array behält seine volle Länge,
//   alle Pakete haben opacity 0 (stabile Elementzahl).

import {
  CENTER,
  GROUPS,
  LAYOUTS,
  NODE_NAMES,
  NODE_RADIUS,
  PACKETS_DESKTOP,
  PACKETS_MOBILE,
  ZONES,
  type Point,
} from './layouts'

export interface FrameOptions { mobile: boolean; reduced: boolean }
/** label = Deckkraft 0..1 */
export interface FrameNode { x: number; y: number; r: number; active: boolean; label: number }
/**
 * d: SVG-Pfad von Knotenmitte zu Knotenmitte (leer, solange die Kante unsichtbar ist).
 * drawn: Anteil 0..1 des gezogenen Pfads (für stroke-dashoffset mit pathLength="1"); 1 = komplett.
 */
export interface FrameEdge { a: number; b: number; d: string; opacity: number; drawn: number; dashed: boolean; strong: boolean }
export interface FramePacket { x: number; y: number; opacity: number }
export interface Frame {
  /** Zustand 0..5 */
  state: number
  /** geeaster Übergangsanteil 0..1 */
  t: number
  nodes: FrameNode[]
  edges: FrameEdge[]
  packets: FramePacket[]
  zones: number[]
  fragments: number
  background: string
  transform: string
}

/** Zustand 3 (Struktur) als Standbild. */
export const STILL_PROGRESS = 2
export const SMOOTHING = 0.12

const LAST = LAYOUTS.length - 1
const COUNT = NODE_NAMES.length

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v)
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t
const keyOf = (a: number, b: number): string => (a < b ? `${a}-${b}` : `${b}-${a}`)

/** Kubisch ein/aus, wie im Mockup. */
export function ease(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function edgePath(a: Point, b: Point, curved: boolean): string {
  if (!curved) return `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`
  const mx = (a[0] + b[0]) / 2
  return `M${a[0]} ${a[1]}C${mx} ${a[1]} ${mx} ${b[1]} ${b[0]} ${b[1]}`
}

const bez = (p0: number, p1: number, p2: number, p3: number, t: number): number => {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

/** Punkt auf der kubischen Kurve von edgePath(a, b, true). */
export function bezierPoint(a: Point, b: Point, u: number): Point {
  const mx = (a[0] + b[0]) / 2
  return [bez(a[0], mx, mx, b[0], u), bez(a[1], a[1], b[1], b[1], u)]
}

// Vereinigung aller Kanten in Reihenfolge des ersten Auftretens über die Zustände 0..5.
const edgeList: [number, number][] = []
const seen = new Set<string>()
for (const layout of LAYOUTS) {
  for (const [p, q] of layout.edges) {
    const k = keyOf(p, q)
    if (seen.has(k)) continue
    seen.add(k)
    edgeList.push(p < q ? [p, q] : [q, p])
  }
}
/** Reihenfolge von Frame.edges, Schlüssel `a-b` mit a<b. */
export const EDGE_KEYS: readonly string[] = Object.freeze(edgeList.map(([a, b]) => `${a}-${b}`))

// Pro Zustand vorab: welche Kanten (Index in EDGE_KEYS) enthalten sind.
const EDGE_IN: readonly (readonly boolean[])[] = LAYOUTS.map((layout) => {
  const keys = new Set(layout.edges.map(([p, q]) => keyOf(p, q)))
  return EDGE_KEYS.map((k) => keys.has(k))
})

// Gruppenindex je Knoten (Zustand 1), -1 ohne Gruppe.
const GROUP_OF: readonly number[] = Array.from({ length: COUNT }, (_, i) =>
  GROUPS.findIndex((g) => (g as readonly number[]).includes(i)),
)

const PACKET_EDGES = LAYOUTS[3].edges

export function frame(progress: number, time: number, opts: FrameOptions): Frame {
  if (opts.reduced) {
    const still = frame(STILL_PROGRESS, 0, { mobile: opts.mobile, reduced: false })
    for (const p of still.packets) p.opacity = 0
    return still
  }

  const p = Math.min(LAST, Math.max(0, Number.isFinite(progress) ? progress : 0))
  const state = Math.floor(p)
  const next = Math.min(state + 1, LAST)
  const t = ease(p - state)
  const A = LAYOUTS[state]
  const B = LAYOUTS[next]

  // Knoten
  const amp = time === 0 ? 0 : 1.2 + (state === 0 ? (1 - t) * 6 : 0)
  const r = state >= 4 ? NODE_RADIUS.compact : NODE_RADIUS.default
  const label = state === 1 ? Math.min(1, 2 * t) : state === 2 || state === 3 ? 1 : 0
  const group = Math.floor(3 * t)
  const nodes: FrameNode[] = new Array(COUNT)
  for (let i = 0; i < COUNT; i++) {
    const a = A.nodes[i], b = B.nodes[i]
    const active =
      (state === 1 && GROUP_OF[i] === group) ||
      (state === 3 && Math.floor(time * 2 + i) % 7 === 0) ||
      // Ab der zweiten Hälfte des Übergangs 4→5 und im Endzustand 5 sind alle Knoten aktiv
      // (in Zustand 5 selbst ist t immer 0, da es keinen Folgezustand gibt).
      (state === 4 && t > 0.5) ||
      state === LAST
    nodes[i] = {
      x: lerp(a[0], b[0], t) + (amp === 0 ? 0 : Math.sin(time * 0.7 + i) * amp),
      y: lerp(a[1], b[1], t) + (amp === 0 ? 0 : Math.cos(time * 0.5 + i * 1.3) * amp),
      r,
      active,
      label,
    }
  }

  // Kanten
  const inA = EDGE_IN[state], inB = EDGE_IN[next]
  const draws = !B.dashed && t > 0
  const strong = state >= 2
  const edges: FrameEdge[] = new Array(edgeList.length)
  for (let k = 0; k < edgeList.length; k++) {
    const [a, b] = edgeList[k]
    const ina = inA[k], inb = inB[k]
    const entering = !ina && inb
    let opacity = ina && inb ? 1 : ina ? 1 - t : inb ? t : 0
    let drawn = 1
    if (entering && draws) {
      // Neue Kante wird wie mit dem Lineal gezogen: voll deckend, Länge wächst mit t.
      opacity = 1
      drawn = t
    }
    const na = nodes[a], nb = nodes[b]
    edges[k] = {
      a,
      b,
      d: opacity > 0 ? edgePath([na.x, na.y], [nb.x, nb.y], A.curved) : '',
      opacity,
      drawn,
      dashed: ina && A.dashed,
      strong,
    }
  }

  // Pakete
  const packetCount = opts.mobile ? PACKETS_MOBILE : PACKETS_DESKTOP
  const live = state === 2 ? t : state === 3 ? 1 : state === 4 ? 1 - t : 0
  const packets: FramePacket[] = new Array(packetCount)
  for (let i = 0; i < packetCount; i++) {
    const [ea, eb] = PACKET_EDGES[(i * 2) % PACKET_EDGES.length]
    const u = (time * 0.35 + i / packetCount) % 1
    const na = nodes[ea], nb = nodes[eb]
    const [x, y] = bezierPoint([na.x, na.y], [nb.x, nb.y], u)
    packets[i] = { x, y, opacity: live }
  }

  // Zonen und Fragmente
  const zones = ZONES.map((_, i) => (state === 4 ? clamp01(3 * t - i) : state === 5 ? 1 - t : 0))
  const fragments = state === 0 ? 1 - t : 0

  // Bühne
  const dx = opts.mobile ? 0 : lerp(A.shift, B.shift, t)
  const scale = opts.mobile ? 1 : lerp(A.scale, B.scale, t)

  return {
    state,
    t,
    nodes,
    edges,
    packets,
    zones,
    fragments,
    background: `color-mix(in srgb, var(--color-ground) ${100 - p * 14}%, var(--color-ground-end))`,
    transform: `translate(${CENTER[0] + dx} ${CENTER[1]}) scale(${scale}) translate(${-CENTER[0]} ${-CENTER[1]})`,
  }
}
