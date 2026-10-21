import type { StationId } from '@/content/types'

export interface StationWindow {
  id: StationId
  slug: string
  /** Anteile 0–1 des Gesamtwegs */
  start: number
  end: number
}

export const STATIONS: readonly StationWindow[] = [
  { id: 'gehaeuse', slug: 'start', start: 0.0, end: 0.08 },
  { id: 'mainboard', slug: 'ueberblick', start: 0.08, end: 0.22 },
  { id: 'cpu', slug: 'ablaeufe', start: 0.28, end: 0.42 },
  { id: 'ram', slug: 'werkzeuge', start: 0.42, end: 0.56 },
  { id: 'gpu', slug: 'automatik', start: 0.56, end: 0.7 },
  { id: 'ssd', slug: 'ablauf', start: 0.7, end: 0.86 },
  { id: 'kontakt', slug: 'kontakt', start: 0.86, end: 1.0 },
]

export const ABOUT_WINDOW = { start: 0.22, end: 0.28 } as const

/** Gesamter Scrollweg der Fahrt in Bildschirmhöhen */
export const SCROLL_HEIGHTS = 10

/** Station zum Fortschritt; die About-Lücke zählt zur vorherigen Station. */
export function stationAt(progress: number): StationWindow {
  let current = STATIONS[0]
  for (const station of STATIONS) {
    if (progress >= station.start) current = station
  }
  return current
}

/** 0–1 innerhalb des Fensters, geklemmt. */
export function localProgress(progress: number, w: { start: number; end: number }): number {
  const t = (progress - w.start) / (w.end - w.start)
  return Math.min(1, Math.max(0, t))
}
