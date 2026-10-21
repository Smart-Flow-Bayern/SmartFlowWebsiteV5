export type OverlayState = 'hidden' | 'entering' | 'visible' | 'leaving'

export interface ProgressWindow {
  start: number
  end: number
}

/** Erst nach der Kamera-Ankunft (30 % des Fensters) einblenden, 10 % vor dem Ende ausblenden. */
export function overlayState(progress: number, w: ProgressWindow): OverlayState {
  const len = w.end - w.start
  if (progress < w.start + 0.3 * len || progress >= w.end) return 'hidden'
  if (progress < w.start + 0.4 * len) return 'entering'
  if (progress < w.end - 0.1 * len) return 'visible'
  return 'leaving'
}

/** Wie viele von `count` Teil-Elementen sichtbar sind: 0 vor 35 %, alle ab 85 % des Fensters. */
export function revealIndex(progress: number, w: ProgressWindow, count: number): number {
  const len = w.end - w.start
  const from = w.start + 0.35 * len
  const to = w.end - 0.15 * len
  const t = Math.min(1, Math.max(0, (progress - from) / (to - from)))
  return Math.min(count, Math.ceil(t * count))
}
