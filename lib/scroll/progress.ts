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
