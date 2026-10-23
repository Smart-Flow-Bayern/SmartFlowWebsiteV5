// Layout-Daten der Prozessgrafik: reine Geometrie, keine DOM- oder Farb-Abhängigkeit.
// Werte stammen aus docs/rebranding-v2/mockups/konzepte.html (Script-Block).

export const NODE_NAMES = [
  'Anfrage', 'Angebot', 'Auftrag', 'Termin', 'Material', 'Einsatz', 'Stunden',
  'Rechnung', 'Zahlung', 'Nachfass', 'Kunde', 'Team', 'Ablage', 'Rückfrage',
] as const

export const VIEWBOX = { width: 1000, height: 600 } as const

export type Point = readonly [number, number]
export type Edge = readonly [number, number]

export interface Layout {
  nodes: readonly Point[]
  edges: readonly Edge[]
  dashed: boolean
  curved: boolean
  shift: number
  scale: number
  labels: boolean
  packets: boolean
  zones: boolean
  groups: readonly (readonly number[])[]
}

const COUNT = NODE_NAMES.length

/** Deterministische Pseudozufallsfunktion wie im Mockup. */
const seed = (i: number, k: number): number => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export const GROUPS = [[0, 1, 10, 13], [2, 3, 4, 5, 11], [6, 7, 8, 9, 12]] as const
export const COLUMNS = {
  eingang: [0, 10, 13],
  bearbeitung: [1, 2, 3, 4, 5, 11],
  entscheidung: [12],
  ausgang: [6, 7, 8, 9],
} as const

const indices = Array.from({ length: COUNT }, (_, i) => i)

// Zustand 0: verstreut, nur in x 350..870, damit die Knoten nach Verschiebung (+170) und Skalierung (0.8)
// bei x ≥ 550 liegen und die große Überschrift links frei bleibt.
const S0: Point[] = indices.map((i) => [350 + seed(i, 1) * 520, 60 + seed(i, 2) * 480])

// Zustand 1: drei Gruppen
const CENTERS = [[230, 300], [520, 300], [800, 300]] as const
const S1: Point[] = indices.map(() => [0, 0] as Point)
GROUPS.forEach((g, gi) =>
  g.forEach((n, j) => {
    const a = (j / g.length) * Math.PI * 2
    const r = 60 + (j % 2) * 30
    S1[n] = [CENTERS[gi][0] + Math.cos(a) * r, CENTERS[gi][1] + Math.sin(a) * r * 0.8]
  }),
)

// Zustand 2 und 3: Spaltenarchitektur
const S2: Point[] = indices.map(() => [0, 0] as Point)
const col = (ids: readonly number[], x: number) =>
  ids.forEach((n, j) => {
    S2[n] = [x, 300 + (j - (ids.length - 1) / 2) * 90]
  })
col(COLUMNS.eingang, 230)
col(COLUMNS.bearbeitung, 430)
col(COLUMNS.entscheidung, 600)
col(COLUMNS.ausgang, 770)
const S3: Point[] = S2.map((p) => [p[0], p[1]] as Point)

// Zustand 4: verdichteter Kreislauf
const S4: Point[] = indices.map((i) => {
  const a = (i / COUNT) * Math.PI * 2 - Math.PI / 2
  return [500 + Math.cos(a) * 230, 300 + Math.sin(a) * 160]
})

// Zustand 5: Bündelung in einer zentrierten Zeile im unteren Band (unter dem Kontakttext)
const S5: Point[] = indices.map((i) => [500 + (i - 6.5) * 26, 570])

// Kanten je Zustand
const E1: Edge[] = [[0, 1], [1, 10], [10, 13], [2, 3], [3, 4], [4, 5], [5, 11], [11, 2], [6, 7], [7, 8], [8, 9], [9, 12], [12, 6]]
const E2: Edge[] = [[0, 1], [10, 1], [13, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [11, 5], [5, 12], [12, 6], [12, 7], [7, 8], [8, 9], [6, 7]]
const E4: Edge[] = [...indices.map((i): Edge => [i, (i + 1) % COUNT]), [0, 7], [2, 9], [4, 11]]
const E5: Edge[] = indices.slice(0, -1).map((i): Edge => [i, i + 1])

const base = { dashed: false, curved: false, labels: false, packets: false, zones: false, groups: [] as readonly (readonly number[])[] }

export const LAYOUTS: readonly Layout[] = Object.freeze([
  { ...base, nodes: S0, edges: [], shift: 170, scale: 0.8 },
  { ...base, nodes: S1, edges: E1, shift: -190, scale: 0.8, dashed: true, labels: true, groups: GROUPS },
  { ...base, nodes: S2, edges: E2, shift: 290, scale: 0.58, curved: true, labels: true },
  { ...base, nodes: S3, edges: E2, shift: -290, scale: 0.58, curved: true, labels: true, packets: true },
  { ...base, nodes: S4, edges: E4, shift: 190, scale: 0.8, zones: true },
  { ...base, nodes: S5, edges: E5, shift: 0, scale: 0.8 },
])

export interface Fragment { x: number; y: number; angle: number; len: number }

export const FRAGMENTS: readonly Fragment[] = Object.freeze(
  Array.from({ length: 26 }, (_, i) => ({
    x: seed(i, 7) * VIEWBOX.width,
    y: seed(i, 8) * VIEWBOX.height,
    angle: seed(i, 9) * Math.PI,
    len: 10 + seed(i, 10) * 30,
  })),
)
export const FRAGMENTS_MOBILE = 12

export const CENTER: Point = [500, 300]

export const ZONES: readonly { label: string; rx: number; ry: number }[] = [
  { label: 'Effizienz', rx: 300, ry: 200 },
  { label: 'Skalierbarkeit', rx: 380, ry: 260 },
  { label: 'Produktivität', rx: 460, ry: 320 },
]

export const PACKETS_DESKTOP = 9
export const PACKETS_MOBILE = 5

export const NODE_RADIUS = { default: 9, compact: 7 } as const
