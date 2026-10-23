import { describe, expect, it } from 'vitest'
import { contrastRatio } from '@/lib/brand/contrast'
import { colors } from '@/lib/brand/tokens'

describe('contrastRatio', () => {
  it('liefert 21 für Schwarz auf Weiß und 1 für gleiche Farben', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBe(21)
    expect(contrastRatio('#ddff4d', '#ddff4d')).toBe(1)
  })
  it('Tinte auf Grund erreicht 7:1', () => {
    expect(contrastRatio(colors.ink, colors.ground)).toBeGreaterThanOrEqual(7)
  })
  it('Gedimmt auf Grund erreicht 4,5:1 (nur ab 16 px einsetzen)', () => {
    expect(contrastRatio(colors.muted, colors.ground)).toBeGreaterThanOrEqual(4.5)
  })
  it('Akzent-Tinte auf Akzent erreicht 7:1', () => {
    expect(contrastRatio(colors.accentInk, colors.accent)).toBeGreaterThanOrEqual(7)
  })
  it('Knotenkontur auf Grund erreicht 3:1 (Grafik)', () => {
    expect(contrastRatio(colors.nodeStroke, colors.ground)).toBeGreaterThanOrEqual(3)
  })
})
