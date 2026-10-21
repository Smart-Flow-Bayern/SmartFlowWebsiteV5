import { describe, expect, it } from 'vitest'
import { STATION_IDS } from '@/content/types'
import {
  ABOUT_WINDOW,
  SCROLL_HEIGHTS,
  STATIONS,
  localProgress,
  stationAt,
} from '@/scene/stations'

describe('stations', () => {
  it('hat 7 Einträge in STATION_IDS-Reihenfolge', () => {
    expect(STATIONS).toHaveLength(7)
    expect(STATIONS.map((s) => s.id)).toEqual([...STATION_IDS])
  })

  it('beginnt bei 0 und endet bei 1', () => {
    expect(STATIONS[0].start).toBe(0)
    expect(STATIONS[STATIONS.length - 1].end).toBe(1)
  })

  it('Fenster sind lückenlos außer der About-Lücke', () => {
    for (let i = 1; i < STATIONS.length; i++) {
      if (i === 2) continue
      expect(STATIONS[i].start).toBe(STATIONS[i - 1].end)
    }
    expect(STATIONS[1].end).toBe(ABOUT_WINDOW.start)
    expect(ABOUT_WINDOW.end).toBe(STATIONS[2].start)
  })

  it('Scrollweg liegt zwischen 8 und 12 Bildschirmhöhen', () => {
    expect(SCROLL_HEIGHTS).toBeGreaterThanOrEqual(8)
    expect(SCROLL_HEIGHTS).toBeLessThanOrEqual(12)
  })

  it('stationAt ordnet die About-Lücke der vorherigen Station zu', () => {
    expect(stationAt(0.25).id).toBe('mainboard')
    expect(stationAt(0).id).toBe('gehaeuse')
    expect(stationAt(0.28).id).toBe('cpu')
    expect(stationAt(1).id).toBe('kontakt')
  })

  it('localProgress ist geklemmt', () => {
    expect(localProgress(0.35, STATIONS[2])).toBeCloseTo(0.5)
    expect(localProgress(0.9, STATIONS[2])).toBe(1)
    expect(localProgress(0.1, STATIONS[2])).toBe(0)
  })
})
