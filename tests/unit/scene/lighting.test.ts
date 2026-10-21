import { describe, expect, it } from 'vitest'
import { EMISSIVE_PEAK, EMISSIVE_SIBLING, activePart, ambientAt, backgroundAt, partEmissive } from '@/scene/lighting'

describe('lighting', () => {
  it('Hintergrund läuft von #050607 nach #1a1d20', () => {
    expect(backgroundAt(0)).toBe('#050607')
    expect(backgroundAt(1).toLowerCase()).toBe('#1a1d20')
  })

  it('ambientAt steigt monoton', () => {
    let previous = ambientAt(0)
    for (let i = 1; i <= 100; i++) {
      const value = ambientAt(i / 100)
      expect(value).toBeGreaterThan(previous)
      previous = value
    }
  })

  it('aktives Teil leuchtet am stärksten, andere kaum', () => {
    expect(partEmissive('cpu', 0.35)).toBe(EMISSIVE_PEAK)
    expect(partEmissive('gpu', 0.35)).toBe(0.05)
  })

  it('RAM-Geschwister leuchten mit 0.7 der Spitze', () => {
    expect(activePart(0.5)).toBe('ram_0')
    expect(partEmissive('ram_2', 0.5)).toBe(EMISSIVE_SIBLING)
  })

  it('traces: 0.25 Grundwert, 0.75 am Mainboard', () => {
    expect(partEmissive('traces', 0.35)).toBe(0.25)
    expect(partEmissive('traces', 0.15)).toBe(0.75)
  })
})
