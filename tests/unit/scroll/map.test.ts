import { describe, expect, it } from 'vitest'
import { progressFromTops, scrollFromProgress } from '@/lib/scroll/map'

// Ungleich hohe Sections wie im echten Layout (Komplexität höher als ein Bildschirm).
const tops = [0, 1160, 2060, 2960, 3860, 4760, 5660]

describe('progressFromTops', () => {
  it('bildet Section-Oberkanten stückweise linear auf 0..1 ab', () => {
    expect(progressFromTops(-50, tops)).toBe(0)
    expect(progressFromTops(-50, [100, ...tops.slice(1)])).toBe(0)
    expect(progressFromTops(0, tops)).toBe(0)
    expect(progressFromTops(tops[1], tops)).toBeCloseTo(1 / 6)
    expect(progressFromTops(tops[3], tops)).toBeCloseTo(0.5)
    expect(progressFromTops((tops[1] + tops[2]) / 2, tops)).toBeCloseTo(0.25)
    expect(progressFromTops(tops[6], tops)).toBe(1)
    expect(progressFromTops(tops[6] + 500, tops)).toBe(1)
  })
  it('liefert 0 ohne vollständige Messung', () => {
    expect(progressFromTops(300, [])).toBe(0)
    expect(progressFromTops(300, [0, 100])).toBe(0)
  })
})

describe('scrollFromProgress', () => {
  it('ist die Umkehrung von progressFromTops', () => {
    for (const y of [0, 580, 1160, 1610, 2960, 5000, 5660]) {
      expect(scrollFromProgress(progressFromTops(y, tops), tops)).toBeCloseTo(y)
    }
    expect(scrollFromProgress(1, tops)).toBe(5660)
    expect(scrollFromProgress(-1, tops)).toBe(0)
  })
})
