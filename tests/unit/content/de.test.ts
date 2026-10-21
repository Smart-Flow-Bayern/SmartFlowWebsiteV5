import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { de } from '@/content/de'
import legacy from '@/content/legacy-sentences.json'
import { STATION_IDS } from '@/content/types'
import { alleTexte, pruefeInhalt } from '@/lib/content/check'

/** Antwort-Spalte aus docs/content/briefing-antworten.md (nur nicht-leere Zellen). */
function briefingAntworten(): string[] {
  const md = readFileSync(resolve(__dirname, '../../../docs/content/briefing-antworten.md'), 'utf8')
  return md
    .split('\n')
    .filter((zeile) => /^\|\s*\d+\s*\|/.test(zeile))
    .map((zeile) => zeile.split('|')[3]?.trim() ?? '')
    .filter(Boolean)
}

describe('de', () => {
  it('besteht die Inhaltsprüfung ohne Befunde', () => {
    expect(pruefeInhalt(de, legacy as string[])).toEqual({ floskeln: [], legacy: [], struktur: [] })
  })

  it('hat locale de', () => {
    expect(de.locale).toBe('de')
  })

  it('enthält keine Emojis', () => {
    const treffer = alleTexte(de).filter((t) => /\p{Extended_Pictographic}/u.test(t))
    expect(treffer).toEqual([])
  })

  it('bleibt in der Sie-Form', () => {
    const treffer = alleTexte(de).filter((t) => /(?<![\p{L}\p{N}])(du |dein)/iu.test(t))
    expect(treffer).toEqual([])
  })

  it('hat Nav-Labels für alle sieben Stationen', () => {
    expect(Object.keys(de.nav.labels).sort()).toEqual([...STATION_IDS].sort())
    for (const id of STATION_IDS) expect(de.nav.labels[id].trim()).not.toBe('')
  })

  it('hält die Längengrenzen ein', () => {
    expect(de.station0.sentence.length).toBeLessThanOrEqual(90)
    expect(de.station1.claim.length).toBeLessThanOrEqual(60)
    expect(de.about.sentences.length).toBeGreaterThanOrEqual(2)
    expect(de.about.sentences.length).toBeLessThanOrEqual(3)
  })

  it('leitet jedes CPU-Beispiel mit „Beispiel:“ ein', () => {
    for (const ex of de.cpu.examples) expect(ex.text.startsWith('Beispiel:'), ex.branch).toBe(true)
  })

  it('erfindet keine Dauern', () => {
    const erlaubt = briefingAntworten()
    for (const block of de.ssd.blocks) {
      const ok = block.duration === 'nach Absprache' || erlaubt.includes(block.duration)
      expect(ok, `duration "${block.duration}"`).toBe(true)
    }
  })
})
