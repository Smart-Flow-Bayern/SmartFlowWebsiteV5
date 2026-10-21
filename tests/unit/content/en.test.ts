import { describe, expect, it } from 'vitest'
import { de } from '@/content/de'
import { en } from '@/content/en'
import { FLOSKELN_EN, findeFloskeln } from '@/content/floskeln'
import legacy from '@/content/legacy-sentences.json'
import { STATION_IDS } from '@/content/types'
import { alleTexte, pruefeInhalt } from '@/lib/content/check'

describe('en', () => {
  it('besteht die Inhaltsprüfung ohne Befunde', () => {
    expect(pruefeInhalt(en, legacy as string[])).toEqual({ floskeln: [], legacy: [], struktur: [] })
  })

  it('hat locale en', () => {
    expect(en.locale).toBe('en')
  })

  it('hat null Treffer in der englischen Sperrliste', () => {
    const treffer = alleTexte(en)
      .map((text) => ({ text, treffer: findeFloskeln(text, FLOSKELN_EN) }))
      .filter((f) => f.treffer.length > 0)
    expect(treffer).toEqual([])
  })

  it('erkennt Einträge der englischen Sperrliste, auch Singular', () => {
    expect(findeFloskeln('A tailored solution for synergies', FLOSKELN_EN)).toEqual([
      'tailored',
      'solutions',
      'synergies',
    ])
    expect(findeFloskeln('In times of change', FLOSKELN_EN)).toEqual(['in times of'])
  })

  it('hat dieselbe Struktur wie de', () => {
    expect(alleTexte(en).length).toBe(alleTexte(de).length)
  })

  it('übernimmt keinen deutschen Text (mindestens zwei Wörter)', () => {
    const d = alleTexte(de)
    const e = alleTexte(en)
    const gleich = d
      .map((text, i) => ({ text, i }))
      .filter(({ text, i }) => text.trim().split(/\s+/).length >= 2 && e[i] === text)
      .map(({ text }) => text)
    expect(gleich).toEqual([])
  })

  it('enthält keine Emojis', () => {
    expect(alleTexte(en).filter((t) => /\p{Extended_Pictographic}/u.test(t))).toEqual([])
  })

  it('hat Nav-Labels für alle sieben Stationen', () => {
    expect(Object.keys(en.nav.labels).sort()).toEqual([...STATION_IDS].sort())
    for (const id of STATION_IDS) expect(en.nav.labels[id].trim()).not.toBe('')
  })

  it('spiegelt die Nav-Labels in den Mainboard-Labels', () => {
    expect(en.station1.labels).toEqual([
      en.nav.labels.cpu,
      en.nav.labels.ram,
      en.nav.labels.gpu,
      en.nav.labels.ssd,
      en.nav.labels.kontakt,
    ])
  })

  it('hält die Längengrenzen ein', () => {
    expect(en.station0.sentence.length).toBeLessThanOrEqual(90)
    expect(en.station1.claim.length).toBeLessThanOrEqual(60)
    expect(en.meta.title.length).toBeLessThanOrEqual(70)
    expect(en.about.sentences.length).toBeGreaterThanOrEqual(2)
    expect(en.about.sentences.length).toBeLessThanOrEqual(3)
    expect(en.cpu.examples).toHaveLength(3)
    expect(en.ram.sticks).toHaveLength(3)
    expect(en.gpu.before).toHaveLength(3)
    expect(en.gpu.after).toHaveLength(3)
    expect(en.ssd.blocks).toHaveLength(4)
  })

  it('leitet jedes CPU-Beispiel mit „Example:“ ein', () => {
    for (const ex of en.cpu.examples) expect(ex.text.startsWith('Example:'), ex.branch).toBe(true)
  })

  it('erfindet keine Dauern', () => {
    for (const block of en.ssd.blocks) expect(block.duration).toBe('to be agreed')
  })

  it('hat englische Footer-Links und Sprachwechsel auf Deutsch', () => {
    expect(en.footer.legal).toEqual([
      { label: 'Legal notice', href: '/en/legal-notice.html' },
      { label: 'Privacy policy', href: '/en/privacy-policy.html' },
      { label: 'Terms', href: '/en/terms.html' },
    ])
    expect(en.footer.languageSwitch).toEqual({ label: 'Deutsch', href: '/' })
    expect(en.footer.legalLabel).toBe('Legal')
  })
})
