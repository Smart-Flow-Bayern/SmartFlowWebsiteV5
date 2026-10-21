import { describe, expect, it } from 'vitest'
import { shouldUseStaticFallback } from '@/lib/device/fallback'

describe('shouldUseStaticFallback', () => {
  it('fällt ohne WebGL2 zurück', () => {
    expect(shouldUseStaticFallback({ webgl2: false, deviceMemory: 8, saveData: false, reducedMotion: false })).toBe(true)
  })
  it('fällt bei weniger als 4 GB Speicher zurück', () => {
    expect(shouldUseStaticFallback({ webgl2: true, deviceMemory: 2, saveData: false, reducedMotion: false })).toBe(true)
  })
  it('fällt bei Save-Data zurück', () => {
    expect(shouldUseStaticFallback({ webgl2: true, deviceMemory: 4, saveData: true, reducedMotion: false })).toBe(true)
  })
  it('bleibt bei unbekanntem Speicher in 3D', () => {
    expect(shouldUseStaticFallback({ webgl2: true, deviceMemory: undefined, saveData: false, reducedMotion: false })).toBe(false)
  })
  it('erzwingt den Fallback per forceFallback', () => {
    expect(
      shouldUseStaticFallback({ webgl2: true, deviceMemory: 8, saveData: false, reducedMotion: false, forceFallback: true }),
    ).toBe(true)
  })
  it('fällt bei reduzierter Bewegung zurück', () => {
    expect(
      shouldUseStaticFallback({ webgl2: true, deviceMemory: 8, saveData: false, reducedMotion: true }),
    ).toBe(true)
  })
})
