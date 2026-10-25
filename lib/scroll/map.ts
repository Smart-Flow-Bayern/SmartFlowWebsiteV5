/**
 * Fortschritt aus gemessenen Section-Oberkanten (Seitenpixel, Szenenreihenfolge, 7 Werte).
 * Zwischen Oberkante i und i+1 läuft der Fortschritt linear von i/6 nach (i+1)/6, ab Kontakt ist er 1.
 * So bleiben die konstanten Szenenfenster (scene/process/scenes.ts) mit dem Text synchron,
 * auch wenn Sections höher als ein Bildschirm sind.
 */
const STEPS = 6

export function progressFromTops(y: number, tops: readonly number[]): number {
  if (tops.length !== STEPS + 1) return 0
  if (y >= tops[STEPS]) return 1
  let i = -1
  for (let k = 0; k < STEPS; k++) if (tops[k] <= y) i = k
  if (i < 0) return 0
  const span = tops[i + 1] - tops[i]
  const within = span > 0 ? (y - tops[i]) / span : 0
  return Math.min(1, Math.max(0, (i + within) / STEPS))
}

/** Umkehrung: Scrollposition für einen Fortschritt (Fortschritt halten bei Resize und Font-Wechsel). */
export function scrollFromProgress(p: number, tops: readonly number[]): number {
  if (tops.length !== STEPS + 1) return 0
  const w = Math.min(1, Math.max(0, p)) * STEPS
  if (w >= STEPS) return tops[STEPS]
  const i = Math.floor(w)
  return tops[i] + (w - i) * (tops[i + 1] - tops[i])
}

/** Index der letzten Section, deren Oberkante bei oder oberhalb von `y` liegt (0, wenn keine). */
export function sceneIndexAt(y: number, tops: readonly number[]): number {
  let i = 0
  for (let k = 0; k < tops.length; k++) if (tops[k] <= y) i = k
  return i
}
