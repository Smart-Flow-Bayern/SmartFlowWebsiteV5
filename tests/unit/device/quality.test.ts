import { describe, expect, it } from 'vitest'
import { qualityFor } from '@/lib/device/quality'

describe('qualityFor', () => {
  it('mobil bei schmalem Fenster', () => {
    const q = qualityFor(390, 4)
    expect(q.dpr).toEqual([1, 1.25])
    expect(q.pointLights).toBe(1)
  })
  it('desktop mit viel Speicher', () => {
    const q = qualityFor(1440, 16)
    expect(q.dpr).toEqual([1, 1.75])
    expect(q.pointLights).toBe(2)
  })
  it('wenig Speicher senkt auch am Desktop', () => {
    expect(qualityFor(1440, 4).dpr[1]).toBe(1.25)
  })
  it('Grenze bei 768 px (einschließlich, wie das CSS)', () => {
    expect(qualityFor(768, undefined).pointLights).toBe(1)
    expect(qualityFor(769, undefined).pointLights).toBe(2)
  })
  it('Schatten immer aus', () => {
    expect(qualityFor(390, 4).shadows).toBe(false)
    expect(qualityFor(1440, 16).shadows).toBe(false)
  })
})
