import { useSyncExternalStore } from 'react'

type Listener = () => void

let value = 0
const listeners = new Set<Listener>()

export const progressStore = {
  get(): number {
    return value
  },
  set(p: number): void {
    const next = Math.min(1, Math.max(0, p))
    if (next === value) return
    value = next
    listeners.forEach((fn) => fn())
  },
  subscribe(fn: Listener): () => void {
    listeners.add(fn)
    return () => {
      listeners.delete(fn)
    }
  },
}

/** Abonniert nur den gewählten Wert; liefert `select` einen Primitivwert, rendert React nur bei Änderung neu. */
export function useProgressSelector<T>(select: (p: number) => T): T {
  return useSyncExternalStore(
    progressStore.subscribe,
    () => select(progressStore.get()),
    () => select(0),
  )
}

export function useProgress(): number {
  return useSyncExternalStore(progressStore.subscribe, progressStore.get, () => 0)
}

/**
 * Index der Szene (0..6), deren Oberkante zuletzt die Viewport-Mitte überquert hat. Quelle der Hervorhebung in
 * SiteNav und ProgressNav: Der Fortschritt wechselt erst, wenn eine Section oben ankommt, die Navigation soll
 * schon wechseln, sobald die Section den Bildschirm überwiegend füllt.
 */
let activeIndex = 0
const activeListeners = new Set<Listener>()

export const activeSceneStore = {
  get(): number {
    return activeIndex
  },
  set(i: number): void {
    if (i === activeIndex) return
    activeIndex = i
    activeListeners.forEach((fn) => fn())
  },
  subscribe(fn: Listener): () => void {
    activeListeners.add(fn)
    return () => {
      activeListeners.delete(fn)
    }
  },
}

export function useActiveScene(): number {
  return useSyncExternalStore(activeSceneStore.subscribe, activeSceneStore.get, () => 0)
}
