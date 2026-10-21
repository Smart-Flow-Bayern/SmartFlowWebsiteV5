// Geometrie der Bildmarke und der Wortmarken. Gemeinsame Quelle für die
// Komponenten in components/brand und die Skripte in scripts/.

// Bildmarke im 32×32-Raster: Leiterbahn, Stufe hoch, kurz, Stufe runter, Leiterbahn.
export const IMPULSE_PATH = 'M2 20H11V10H19V20H30'
export const IMPULSE_VIEWBOX = '0 0 32 32'
export const IMPULSE_STROKE = 2

// Wortmarken in Schrift-Einheiten von JetBrains Mono (1000 pro em), Grundlinie bei y = 0.
export const WORDMARK_FONT_SIZE = 1000
// Vorschub je Zeichen: 600 (Monospace) abzüglich Laufweite −0.04em
export const WORDMARK_ADVANCE = 560
export const WORDMARK_LETTER_SPACING = '-0.04em'
export const WORDMARK_FONT_WEIGHT = 600

type Box = { x: number; y: number; width: number; height: number }

const viewBox = ({ x, y, width, height }: Box) => `${x} ${y} ${width} ${height}`

// A · underscore: Tintenkante von „s“ (72) bis „w“ (9 × 560 + 576), oben „f“/„l“ (730), unten „_“ (129)
export const UNDERSCORE = {
  text: 'smart_flow',
  accentIndex: 5,
  textX: 0,
  box: { x: 72, y: -730, width: 5544, height: 859 },
} as const

// B · impulse: Bildmarke auf 46 skaliert, Unterkante auf der Grundlinie, Oberkante auf
// x-Höhe (12 × 46 = 552), danach 300 Abstand bis zur Tintenkante von „s“
export const IMPULSE_IN_WORDMARK = {
  scale: 46,
  // lokale Tintenkante links (x = 1) auf 0, untere Strichkante (y = 21) auf die Grundlinie
  translateX: -46,
  translateY: -966,
} as const

export const IMPULSE_WORDMARK = {
  text: 'smart flow',
  textX: 1608,
  box: { x: 0, y: -730, width: 7224, height: 740 },
} as const

export const UNDERSCORE_VIEWBOX = viewBox(UNDERSCORE.box)
export const IMPULSE_WORDMARK_VIEWBOX = viewBox(IMPULSE_WORDMARK.box)
export const IMPULSE_TRANSFORM = `translate(${IMPULSE_IN_WORDMARK.translateX} ${IMPULSE_IN_WORDMARK.translateY}) scale(${IMPULSE_IN_WORDMARK.scale})`
