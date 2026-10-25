import { describe, expect, it } from 'vitest'
import { SCENES, SCROLL_HEIGHTS, sceneAt, sceneFromSlug, sceneOffset, stateProgress } from '@/scene/process/scenes'

describe('SCENES', () => {
  it('hat sechs Fenster zu je einem Sechstel und Kontakt am Ende', () => {
    expect(SCENES).toHaveLength(7); expect(SCROLL_HEIGHTS).toBe(7)
    SCENES.slice(0, 6).forEach((s, i) => { expect(s.start).toBeCloseTo(i / 6); expect(s.end).toBeCloseTo((i + 1) / 6) })
    expect(SCENES[6]).toMatchObject({ id: 'kontakt', start: 1, end: 1 })
    expect(SCENES.map((s) => s.state)).toEqual([0, 1, 2, 3, 4, 4, 5])
    expect(SCENES.map((s) => s.slug)).toEqual(['start', 'analyse', 'struktur', 'automatisierung', 'wachstum', 'ueber', 'kontakt'])
  })
})
describe('stateProgress', () => {
  it('bildet Fensteranfänge auf Zustände ab und hält bei Über den Zustand 4', () => {
    expect(stateProgress(0)).toBe(0)
    expect(stateProgress(1 / 6)).toBeCloseTo(1)
    expect(stateProgress(4 / 6)).toBeCloseTo(4)
    expect(stateProgress(4.5 / 6)).toBeCloseTo(4)
    expect(stateProgress(5 / 6)).toBeCloseTo(4)
    expect(stateProgress(5.5 / 6)).toBeCloseTo(4.5)
    expect(stateProgress(1)).toBe(5)
    expect(stateProgress(-3)).toBe(0); expect(stateProgress(7)).toBe(5)
  })
})
describe('sceneAt / sceneOffset / sceneFromSlug', () => {
  it('findet das Fenster und rundet Offsets nach oben', () => {
    expect(sceneAt(0).id).toBe('komplexitaet')
    expect(sceneAt(5 / 6 + 0.01).id).toBe('ueber')
    expect(sceneAt(1).id).toBe('kontakt')
    expect(sceneOffset('komplexitaet', 6000)).toBe(0)
    expect(sceneOffset('analyse', 6000)).toBe(1000)
    expect(sceneOffset('kontakt', 6000)).toBe(6000)
    expect(sceneFromSlug('ueber')?.id).toBe('ueber')
    expect(sceneFromSlug('nope')).toBeUndefined()
  })
})
