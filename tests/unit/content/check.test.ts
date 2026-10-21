import { describe, expect, it } from 'vitest'
import { alleTexte, pruefeInhalt } from '@/lib/content/check'
import { STATION_IDS, type SiteContent } from '@/content/types'

function fixture(): SiteContent {
  const labels = Object.fromEntries(STATION_IDS.map((id) => [id, id])) as SiteContent['nav']['labels']
  return {
    locale: 'de',
    meta: { title: 'Titel', description: 'Beschreibung' },
    nav: { labels, cta: 'Gespräch buchen', homeLabel: 'Start', stationsLabel: 'Stationen' },
    station0: { sentence: 'Wir räumen Abläufe auf.', scrollHint: 'Scrollen' },
    station1: { claim: 'Fünf Bausteine.', labels: ['a', 'b', 'c', 'd', 'e'] },
    about: { heading: 'Über', sentences: ['Erster Satz.', 'Zweiter Satz.'] },
    cpu: {
      title: 'CPU',
      intro: 'Intro',
      examples: [
        { branch: 'A', text: 'Text A' },
        { branch: 'B', text: 'Text B' },
        { branch: 'C', text: 'Text C' },
      ],
    },
    ram: { title: 'RAM', intro: 'Intro', sticks: ['eins', 'zwei', 'drei'] },
    gpu: {
      title: 'GPU',
      intro: 'Intro',
      beforeLabel: 'Vorher',
      afterLabel: 'Nachher',
      before: ['v1', 'v2', 'v3'], after: ['n1', 'n2', 'n3'],
    },
    ssd: {
      title: 'SSD',
      blocks: [1, 2, 3, 4].map((n) => ({
        name: `Block ${n}`,
        happens: `passiert ${n}`,
        deliverable: `Ergebnis ${n}`,
        duration: `${n} Tage`,
      })),
    },
    contact: {
      title: 'Kontakt',
      text: 'Text',
      calCta: 'Termin', calConsent: 'Einwilligung',
      calTitle: 'Kalender',
      calOpenNewTab: 'Neuer Tab',
    },
    footer: {
      legal: [{ label: 'Impressum', href: '/impressum' }],
      languageSwitch: { label: 'English', href: '/en' },
      legalLabel: 'Rechtliches',
    },
  }
}

describe('alleTexte', () => {
  it('sammelt jeden String-Wert rekursiv', () => {
    const texte = alleTexte(fixture())
    expect(texte).toContain('Wir räumen Abläufe auf.')
    expect(texte).toContain('Text C')
    expect(texte).toContain('4 Tage')
    expect(texte).toContain('Impressum')
  })
})

describe('pruefeInhalt', () => {
  it('meldet ein sauberes Fixture ohne Befunde', () => {
    expect(pruefeInhalt(fixture(), ['ein ganz anderer satz aus der altlast'])).toEqual({
      floskeln: [],
      legacy: [],
      struktur: [],
    })
  })

  it('meldet falsche Array-Längen', () => {
    const c = fixture()
    c.cpu.examples = c.cpu.examples.slice(0, 2)
    expect(pruefeInhalt(c, []).struktur).toContain('cpu.examples: 2 statt 3')
  })

  it('meldet Sätze aus der Altlast', () => {
    const c = fixture()
    c.about.sentences = ['Wir digitalisieren Ihren Betrieb Schritt für Schritt!', 'Zweiter Satz.']
    const r = pruefeInhalt(c, ['Wir digitalisieren Ihren Betrieb Schritt für Schritt.'])
    expect(r.legacy).toEqual(['Wir digitalisieren Ihren Betrieb Schritt für Schritt!'])
  })

  it('findet lange Altlast-Sätze auch als Teilstring', () => {
    const c = fixture()
    c.station0.sentence = 'Vorweg: Wir digitalisieren Ihren Betrieb Schritt für Schritt, ohne Stillstand.'
    const r = pruefeInhalt(c, ['wir digitalisieren ihren betrieb schritt für schritt'])
    expect(r.legacy).toHaveLength(1)
  })

  it('meldet kurze Altlast-Sätze nur bei exakter Gleichheit', () => {
    const c = fixture()
    c.station0.sentence = 'Wir räumen Abläufe auf und mehr.'
    expect(pruefeInhalt(c, ['Wir räumen Abläufe auf']).legacy).toEqual([])
  })

  it('meldet Floskeln mit Text und Treffern', () => {
    const c = fixture()
    c.contact.text = 'Maßgeschneiderte Lösungen'
    expect(pruefeInhalt(c, []).floskeln).toEqual([
      { text: 'Maßgeschneiderte Lösungen', treffer: ['maßgeschneidert', 'lösungen'] },
    ])
  })
})
