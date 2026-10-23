import { describe, expect, it } from 'vitest'
import { de } from '@/content/de'
import legacy from '@/content/legacy-sentences.json'
import { SCENE_IDS } from '@/content/types'
import { alleTexte, pruefeInhalt } from '@/lib/content/check'

const ohneClaim = () => alleTexte(de).filter((t) => t !== de.claim.text)

describe('de', () => {
  it('besteht die Inhaltsprüfung ohne Befunde', () => {
    expect(pruefeInhalt(de, legacy as string[])).toEqual({ floskeln: [], legacy: [], struktur: [], anglizismen: [] })
  })
  it('enthält keine Emojis', () => {
    expect(alleTexte(de).filter((t) => /\p{Extended_Pictographic}/u.test(t))).toEqual([])
  })
  it('bleibt in der Sie-Form', () => {
    expect(alleTexte(de).filter((t) => /(?<![\p{L}\p{N}])(du |dein)/iu.test(t))).toEqual([])
  })
  it('hat Nav-Labels für alle sieben Szenen', () => {
    expect(Object.keys(de.nav.labels).sort()).toEqual([...SCENE_IDS].sort())
  })
  it('trägt den Claim exakt und nur dort Englisch', () => {
    expect(de.claim.text).toBe('Structure. Automation. Growth.')
    expect(de.claim.subtitle.trim()).not.toBe('')
  })
  it('hält die Längengrenzen für Lesbarkeit ein', () => {
    expect(de.scenes.komplexitaet.title.length).toBeLessThanOrEqual(90)
    for (const s of Object.values(de.scenes)) expect(s.title.length).toBeLessThanOrEqual(70)
    expect(de.about.sentences.length).toBeGreaterThanOrEqual(2)
    expect(de.about.sentences.length).toBeLessThanOrEqual(3)
  })
  it('Sätze sind im Schnitt höchstens 20 Wörter lang', () => {
    const saetze = ohneClaim().flatMap((t) => t.match(/[^.!?]+[.!?]+/g) ?? [])
    const woerter = saetze.reduce((n, s) => n + s.trim().split(/\s+/).length, 0)
    expect(woerter / saetze.length).toBeLessThanOrEqual(20)
  })
  it('verspricht keine Zahlen', () => {
    expect(ohneClaim().filter((t) => /\d+\s?%|\d+\s?(Prozent|Stunden|Minuten)/.test(t))).toEqual([])
  })
  it('nummeriert die Szenen 01 bis 06 und Über ohne Nummer', () => {
    expect(Object.values(de.scenes).map((s) => s.number)).toEqual(['01', '02', '03', '04', '05', '06'])
    expect(de.about.initials).toBe('LH')
  })
})
