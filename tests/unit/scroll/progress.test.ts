import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { progressStore, useProgress, useProgressSelector } from '@/lib/scroll/progress'

describe('progressStore', () => {
  it('liefert den gesetzten Wert über den Hook und aktualisiert bei Änderung', () => {
    progressStore.set(0.4)
    const { result } = renderHook(() => useProgress())
    expect(result.current).toBe(0.4)
    act(() => progressStore.set(0.7))
    expect(result.current).toBe(0.7)
  })

  it('klemmt Werte auf 0 bis 1', () => {
    progressStore.set(1.5)
    expect(progressStore.get()).toBe(1)
    progressStore.set(-2)
    expect(progressStore.get()).toBe(0)
  })

  it('benachrichtigt Abonnenten und lässt sich abbestellen', () => {
    const fn = vi.fn()
    const unsubscribe = progressStore.subscribe(fn)
    progressStore.set(0.2)
    expect(fn).toHaveBeenCalledTimes(1)
    unsubscribe()
    progressStore.set(0.3)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('useProgressSelector', () => {
  it('rendert nur bei geänderter Auswahl neu', () => {
    progressStore.set(0)
    let renders = 0
    const select = (p: number) => (p < 0.5 ? 'a' : 'b')
    const { result } = renderHook(() => {
      renders += 1
      return useProgressSelector(select)
    })
    const initial = renders
    act(() => progressStore.set(0.2))
    act(() => progressStore.set(0.4))
    expect(renders).toBe(initial)
    expect(result.current).toBe('a')
    act(() => progressStore.set(0.6))
    expect(result.current).toBe('b')
    expect(renders).toBe(initial + 1)
  })
})
