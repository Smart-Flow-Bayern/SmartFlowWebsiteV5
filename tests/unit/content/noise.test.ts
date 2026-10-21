import { describe, expect, it } from 'vitest'
import { NOISE_TERMS } from '@/content/noise'

describe('NOISE_TERMS', () => {
  it('hat mindestens 48 Einträge', () => {
    expect(NOISE_TERMS.length).toBeGreaterThanOrEqual(48)
  })

  it('enthält die Pflichtbegriffe', () => {
    for (const t of ['ChatGPT', 'Agenten', 'n8n', 'neues Modell']) expect(NOISE_TERMS).toContain(t)
  })

  it('hat keinen Eintrag über 18 Zeichen', () => {
    expect(NOISE_TERMS.filter((t) => t.length > 18)).toEqual([])
  })

  it('hat keine Duplikate', () => {
    expect(new Set(NOISE_TERMS).size).toBe(NOISE_TERMS.length)
  })
})
