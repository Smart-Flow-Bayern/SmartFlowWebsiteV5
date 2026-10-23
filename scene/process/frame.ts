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

/**
 * Kontrollpunkte der Kante bei Kurvenfaktor `curve` (0 = gerade, 1 = volle Bezier):
 * sie wandern waagerecht vom jeweiligen Endpunkt zur gemeinsamen Mitte mx.
 */
function controls(a: Point, b: Point, curve: number): [number, number] {
  const mx = (a[0] + b[0]) / 2
  return [a[0] + (mx - a[0]) * curve, b[0] + (mx - b[0]) * curve]
}

/** SVG-Pfad der Kante; `curve` 0..1 blendet stetig von der Geraden zur Bezier-Kurve. */
export function edgePath(a: Point, b: Point, curve: number): string {
  if (curve <= 0) return `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`
  const [c1, c2] = controls(a, b, curve)
  return `M${a[0]} ${a[1]}C${c1} ${a[1]} ${c2} ${b[1]} ${b[0]} ${b[1]}`
}

const bez = (p0: number, p1: number, p2: number, p3: number, t: number): number => {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}

/** Punkt bei Parameter u auf der Kurve von edgePath(a, b, curve). */
export function bezierPoint(a: Point, b: Point, u: number, curve: number): Point {
  const [c1, c2] = controls(a, b, curve)
  return [bez(a[0], c1, c2, b[0], u), bez(a[1], a[1], b[1], b[1], u)]
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
  // Mobil stehen die Gruppen in Zustand 1 zu dicht für Labels: erst in der zweiten Hälfte von 1→2 einblenden.
  const label =
    state === 1 ? (opts.mobile ? clamp01(2 * t - 1) : Math.min(1, 2 * t)) : state === 2 || state === 3 ? 1 : 0
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
  // Kantenform stetig zwischen gerade (0) und Bezier (1), kein Sprung an den Zustandsgrenzen.
  const curve = lerp(A.curved ? 1 : 0, B.curved ? 1 : 0, t)
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
      d: opacity > 0 ? edgePath([na.x, na.y], [nb.x, nb.y], curve) : '',
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
    const [x, y] = bezierPoint([na.x, na.y], [nb.x, nb.y], u, curve)
    packets[i] = { x, y, opacity: live }
  }

  // Zonen und Fragmente
  // Zonen gehören zu Wachstum (Zustand 4, gehalten): Einblenden in der zweiten Hälfte von 3→4,
  // voll in Zustand 4, Ausblenden im letzten Viertel von 4→5, in Zustand 5 aus.
  const zone = state === 3 ? clamp01(2 * t - 1) : state === 4 ? clamp01(4 * (1 - t)) : 0
  const zones = ZONES.map(() => zone)
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
