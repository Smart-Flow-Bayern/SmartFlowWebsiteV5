// Erzeugt public/brand/*.svg mit dem Text als Pfaden (ohne Webfont nutzbar). Neu erzeugen: pnpm brand:svg
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import opentype from 'opentype.js'
import {
  IMPULSE_PATH,
  IMPULSE_STROKE,
  IMPULSE_TRANSFORM,
  IMPULSE_VIEWBOX,
  IMPULSE_WORDMARK,
  IMPULSE_WORDMARK_VIEWBOX,
  UNDERSCORE,
  UNDERSCORE_VIEWBOX,
  WORDMARK_ADVANCE,
  WORDMARK_FONT_SIZE,
} from '../lib/brand/marks.ts'
import { colors } from '../lib/brand/tokens.ts'

const root = process.cwd()
// Statische Instanz JetBrains Mono 600 (latin), aus @fontsource/jetbrains-mono 5.3.0
const fontFile = readFileSync(join(root, 'public/fonts/jetbrains-mono-latin-600.woff'))
const font = opentype.parse(
  fontFile.buffer.slice(fontFile.byteOffset, fontFile.byteOffset + fontFile.byteLength),
)

/** Pfaddaten der Zeichen an den Positionen `indices`, Grundlinie y = 0. */
function glyphs(text: string, originX: number, indices: number[]): string {
  return indices
    .map((i) =>
      font.charToGlyph(text[i]).getPath(originX + i * WORDMARK_ADVANCE, 0, WORDMARK_FONT_SIZE).toPathData(1),
    )
    .filter(Boolean)
    .join('')
}

const range = (text: string) => [...text].map((_, i) => i)

const traceAttrs = `fill="none" stroke="${colors.accent}" stroke-width="${IMPULSE_STROKE}" stroke-linecap="square" stroke-linejoin="miter"`

function svg(viewBox: string, body: string): string {
  // Standardgröße 64 px hoch, Breite aus dem Seitenverhältnis
  const [, , w, h] = viewBox.split(' ').map(Number)
  const width = Math.round((64 * w) / h * 10) / 10
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="64" role="img" aria-label="Smart Flow">${body}</svg>\n`
}

const { text: a, accentIndex } = UNDERSCORE
const underscore = svg(
  UNDERSCORE_VIEWBOX,
  `<path fill="${colors.text}" d="${glyphs(a, UNDERSCORE.textX, range(a).filter((i) => i !== accentIndex))}"/>` +
    `<path fill="${colors.accent}" d="${glyphs(a, UNDERSCORE.textX, [accentIndex])}"/>`,
)

const b = IMPULSE_WORDMARK.text
const impulseWordmark = svg(
  IMPULSE_WORDMARK_VIEWBOX,
  `<path d="${IMPULSE_PATH}" transform="${IMPULSE_TRANSFORM}" ${traceAttrs}/>` +
    `<path fill="${colors.text}" d="${glyphs(b, IMPULSE_WORDMARK.textX, range(b))}"/>`,
)

const impulse = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${IMPULSE_VIEWBOX}" width="32" height="32" role="img" aria-label="Smart Flow"><path d="${IMPULSE_PATH}" ${traceAttrs}/></svg>\n`

for (const [name, content] of [
  ['wordmark-underscore.svg', underscore],
  ['wordmark-impulse.svg', impulseWordmark],
  ['impulse.svg', impulse],
] as const) {
  writeFileSync(join(root, 'public/brand', name), content)
  console.log(`public/brand/${name}: ${Buffer.byteLength(content)} Bytes`)
}
