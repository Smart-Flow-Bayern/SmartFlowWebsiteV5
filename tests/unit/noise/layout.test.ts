import { describe, expect, it } from 'vitest'
import { NOISE_TERMS } from '@/content/noise'
import { layoutNoise, noiseOpacity } from '@/lib/noise/layout'

describe('layoutNoise', () => {
  const particles = layoutNoise(NOISE_TERMS, 60, 1)

  it('liefert die angeforderte Anzahl', () => {
    expect(particles).toHaveLength(60)
  })

  it('ist deterministisch', () => {
    expect(layoutNoise(NOISE_TERMS, 60, 1)).toEqual(particles)
  })

  it('hält die Mittelzone frei', () => {
    for (const p of particles) {
      expect(p.x >= 35 && p.x <= 65 && p.y >= 35 && p.y <= 65).toBe(false)
    }
  })

  it('nutzt nur Begriffe aus NOISE_TERMS und Wertebereiche der Vorgabe', () => {
    for (const p of particles) {
      expect(NOISE_TERMS).toContain(p.term)
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(100)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(100)
      expect(p.duration).toBeGreaterThanOrEqual(1.2)
      expect(p.duration).toBeLessThanOrEqual(3.5)
      expect(p.size).toBeGreaterThanOrEqual(11)
      expect(p.size).toBeLessThanOrEqual(16)
    }
  })
})

describe('noiseOpacity', () => {
  it('blendet linear aus', () => {
    expect(noiseOpacity(0)).toBe(1)
    expect(noiseOpacity(0.12)).toBeCloseTo(0.04, 5)
    expect(noiseOpacity(0.3)).toBe(0)
  })
})
