import { useSyncExternalStore } from 'react'
import type { StationId } from '@/content/types'
import { progressStore } from '@/lib/scroll/progress'
import { stationAt } from '@/scene/stations'

export type Mode = '3d' | 'static'

type Listener = () => void

let value: Mode | null = null
let last: StationId | null = null
const listeners = new Set<Listener>()

export const modeStore = {
  get(): Mode | null {
    return value
  },
  set(mode: Mode, opts?: { station?: StationId }): void {
    if (opts?.station) last = opts.station
    document.documentElement.dataset.mode = mode
    if (mode === value) return
    value = mode
    listeners.forEach((fn) => fn())
  },
  subscribe(fn: Listener): () => void {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}

export function useMode(): Mode | null {
  return useSyncExternalStore(modeStore.subscribe, modeStore.get, () => null)
}

/** Station, auf der beim Umschalten in den statischen Modus gestanden wurde. */
export function lastStation(): StationId | null {
  return last
}

/** Laufzeit-Umschalten (verlorener WebGL-Kontext, Ladefehler des Modells). */
export function switchToStatic(): void {
  modeStore.set('static', { station: stationAt(progressStore.get()).id })
}
