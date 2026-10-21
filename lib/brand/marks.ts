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

// B · impulse: „smart“, dann die Bildmarke in der Zelle des Unterstrichs (Index 5), dann „flow“.
// Lücke zwischen „t“ (Tinte bis 4 × 560 + 527 = 2767) und „f“ (Tinte ab 6 × 560 + 55 = 3415),
// Mitte 3091. Bildmarke mit Strich 4 (Tinte x 0..32, y 8..22) auf 16 skaliert: 512 breit,
// 224 hoch, mittig in der Lücke, Unterkante auf der Grundlinie.
export const IMPULSE_IN_WORDMARK = {
  scale: 16,
  stroke: 4,
  translateX: 2835,
  translateY: -352,
} as const

export const IMPULSE_WORDMARK = {
  // Das Leerzeichen hält die Zelle frei, in der die Bildmarke sitzt.
  text: 'smart flow',
  textX: 0,
  box: { x: 72, y: -730, width: 5544, height: 730 },
} as const

export const UNDERSCORE_VIEWBOX = viewBox(UNDERSCORE.box)
export const IMPULSE_WORDMARK_VIEWBOX = viewBox(IMPULSE_WORDMARK.box)
export const IMPULSE_TRANSFORM = `translate(${IMPULSE_IN_WORDMARK.translateX} ${IMPULSE_IN_WORDMARK.translateY}) scale(${IMPULSE_IN_WORDMARK.scale})`
