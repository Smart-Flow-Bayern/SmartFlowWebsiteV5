import { describe, expect, it } from 'vitest'
import { overlayState, revealIndex } from '@/lib/scroll/visibility'

const w = { start: 0.28, end: 0.42 }

describe('overlayState', () => {
  it('ist außerhalb des Fensters hidden', () => {
    expect(overlayState(0.29, w)).toBe('hidden')
    expect(overlayState(0.5, w)).toBe('hidden')
    expect(overlayState(0.1, w)).toBe('hidden')
  })

  it('läuft entering, visible, leaving durch', () => {
    expect(overlayState(0.33, w)).toBe('entering')
    expect(overlayState(0.38, w)).toBe('visible')
    expect(overlayState(0.415, w)).toBe('leaving')
  })

  it('hat an den Grenzen keine Lücke', () => {
    expect(overlayState(0.28 + 0.3 * 0.14, w)).toBe('entering')
    expect(overlayState(0.28 + 0.4 * 0.14 + 0.001, w)).toBe('visible')
    expect(overlayState(0.42 - 0.1 * 0.14 + 0.001, w)).toBe('leaving')
    expect(overlayState(0.42, w)).toBe('hidden')
  })
})

describe('overlayState im letzten Fenster (end = 1)', () => {
  const last = { start: 0.86, end: 1 }

  it('bleibt bis einschließlich progress 1 sichtbar', () => {
    expect(overlayState(0.99, last)).toBe('visible')
    expect(overlayState(1, last)).toBe('visible')
  })

  it('blendet am Anfang weiter erst nach der Kamera-Ankunft ein', () => {
    expect(overlayState(0.87, last)).toBe('hidden')
    expect(overlayState(0.86 + 0.35 * 0.14, last)).toBe('entering')
  })

  it('ein inneres Fenster ist bei p = end weiter hidden', () => {
    expect(overlayState(0.42, w)).toBe('hidden')
  })
})

describe('revealIndex', () => {
  it('zeigt vor start + 0.35·len nichts und am Ende alles', () => {
    expect(revealIndex(0.3, w, 4)).toBe(0)
    expect(revealIndex(0.4, w, 4)).toBe(4)
    expect(revealIndex(0.9, w, 4)).toBe(4)
  })

  it('ist monoton und deckt jede Zahl dazwischen ab', () => {
    let last = 0
    const seen = new Set<number>()
    for (let p = 0.28; p <= 0.42; p += 0.001) {
      const n = revealIndex(p, w, 4)
      expect(n).toBeGreaterThanOrEqual(last)
      last = n
      seen.add(n)
    }
    expect([...seen]).toEqual([0, 1, 2, 3, 4])
  })
})
