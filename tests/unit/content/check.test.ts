import { describe, expect, it } from 'vitest'
import { alleTexte, findeAnglizismen, pruefeInhalt } from '@/lib/content/check'
import { SCENE_IDS, type SiteContent } from '@/content/types'

function fixture(): SiteContent {
  const labels = Object.fromEntries(SCENE_IDS.map((id) => [id, id])) as SiteContent['nav']['labels']
  const szene = (number: string, kicker: string) => ({ number, kicker, title: `Titel ${kicker}`, text: `Text ${kicker}` })
  return {
    locale: 'de',
    meta: { title: 'Titel', description: 'Beschreibung' },
    nav: { labels, cta: 'Gespräch buchen', homeLabel: 'Start', scenesLabel: 'Abschnitte', progressLabel: 'Fortschritt', skipLabel: 'Zum Inhalt springen' },
    claim: { text: 'Structure. Automation. Growth.', subtitle: 'Ordnung, Entlastung, Wachstum.' },
    scenes: {
      komplexitaet: { ...szene('01', 'Komplexität'), title: 'Wir räumen Abläufe auf.', scrollHint: 'Scrollen' },
      analyse: szene('02', 'Analyse'),
      struktur: szene('03', 'Struktur'),
      automatisierung: { ...szene('04', 'Automatisierung'), examples: ['Beispiel A', 'Beispiel B', 'Text C'] },
      wachstum: {
        ...szene('05', 'Wachstum'),
        fields: [
          { name: 'Effizienz', text: 'e' },
          { name: 'Skalierbarkeit', text: 's' },
          { name: 'Produktivität', text: '4 Tage' },
        ],
      },
      kontakt: {
        ...szene('06', 'Kontakt'),
        calCta: 'Termin',
        calConsent: 'Einwilligung',
        calTitle: 'Kalender',
        calOpenNewTab: 'Neuer Tab',
        emailCta: 'E-Mail',
      },
    },
    services: [
      { name: 'Eins', text: 'Erster Dienst.' },
      { name: 'Zwei', text: 'Zweiter Dienst.' },
      { name: 'Drei', text: 'Dritter Dienst.' },
    ],
    about: {
      number: '',
      kicker: 'Wer dahintersteht',
      heading: 'Über',
      sentences: ['Erster Satz.', 'Zweiter Satz.'],
      photoAlt: 'Foto',
      initials: 'LH',
    },
    faq: {
      kicker: 'Fragen',
      heading: 'Häufige Fragen',
      items: [{ question: 'Erste Frage?', answer: 'Erste Antwort.' }],
    },
    footer: {
      legal: [{ label: 'Impressum', href: '/impressum' }],
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

describe('findeAnglizismen', () => {
  it('findet Anglizismen in der Reihenfolge der Liste', () => {
    expect(findeAnglizismen('Ein Tool für den Workflow')).toEqual(['workflow', 'tool'])
  })

  it('findet Mehrteiler und lässt deutsche Wörter durch', () => {
    expect(findeAnglizismen('KI-gestützte Auswertung im Dashboard')).toEqual(['dashboard', 'ki-gestützt'])
    expect(findeAnglizismen('Ein Ablauf, den jeder versteht.')).toEqual([])
  })
})

describe('pruefeInhalt', () => {
  it('meldet ein sauberes Fixture ohne Befunde', () => {
    expect(pruefeInhalt(fixture(), ['ein ganz anderer satz aus der altlast'])).toEqual({
      floskeln: [],
      legacy: [],
      struktur: [],
      anglizismen: [],
    })
  })

  it('meldet falsche Array-Längen', () => {
    const c = fixture()
    c.services = c.services.slice(0, 2)
    expect(pruefeInhalt(c, []).struktur).toContain('services: 2 statt 3')
  })

  it('prüft Beispiele, Felder und Über-Sätze', () => {
    const c = fixture()
    c.scenes.automatisierung.examples = ['a']
    c.scenes.wachstum.fields = []
    c.about.sentences = ['a', 'b', 'c', 'd']
    expect(pruefeInhalt(c, []).struktur).toEqual([
      'scenes.automatisierung.examples: 1 statt 3',
      'scenes.wachstum.fields: 0 statt 3',
      'about.sentences: 4 statt 2–3',
    ])
  })

  it('meldet Sätze aus der Altlast', () => {
    const c = fixture()
    c.about.sentences = ['Wir digitalisieren Ihren Betrieb Schritt für Schritt!', 'Zweiter Satz.']
    const r = pruefeInhalt(c, ['Wir digitalisieren Ihren Betrieb Schritt für Schritt.'])
    expect(r.legacy).toEqual(['Wir digitalisieren Ihren Betrieb Schritt für Schritt!'])
  })

  it('findet lange Altlast-Sätze auch als Teilstring', () => {
    const c = fixture()
    c.scenes.komplexitaet.title = 'Vorweg: Wir digitalisieren Ihren Betrieb Schritt für Schritt, ohne Stillstand.'
    const r = pruefeInhalt(c, ['wir digitalisieren ihren betrieb schritt für schritt'])
    expect(r.legacy).toHaveLength(1)
  })

  it('meldet kurze Altlast-Sätze nur bei exakter Gleichheit', () => {
    const c = fixture()
    c.scenes.komplexitaet.title = 'Wir räumen Abläufe auf und mehr.'
    expect(pruefeInhalt(c, ['Wir räumen Abläufe auf']).legacy).toEqual([])
  })

  it('meldet Floskeln mit Text und Treffern', () => {
    const c = fixture()
    c.scenes.kontakt.text = 'Maßgeschneiderte Lösungen'
    expect(pruefeInhalt(c, []).floskeln).toEqual([
      { text: 'Maßgeschneiderte Lösungen', treffer: ['maßgeschneidert', 'lösungen'] },
    ])
  })

  it('meldet Anglizismen mit Text und Treffern, aber nicht im Claim', () => {
    const c = fixture()
    c.scenes.analyse.text = 'Wir prüfen jedes Tool.'
    c.claim.text = 'Workflow. Tool. Growth.'
    expect(pruefeInhalt(c, []).anglizismen).toEqual([{ text: 'Wir prüfen jedes Tool.', treffer: ['tool'] }])
  })
})
