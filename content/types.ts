export type SceneId = 'komplexitaet' | 'analyse' | 'struktur' | 'automatisierung' | 'wachstum' | 'ueber' | 'kontakt'

/** Reihenfolge der Szenen auf der Seite. */
export const SCENE_IDS: readonly SceneId[] = [
  'komplexitaet',
  'analyse',
  'struktur',
  'automatisierung',
  'wachstum',
  'ueber',
  'kontakt',
]

/** Gemeinsamer Text einer nummerierten Szene. `number` '01'..'06', `kicker` z. B. 'Komplexität'. */
export interface SceneText {
  number: string
  kicker: string
  title: string
  text: string
}

export interface SiteContent {
  locale: 'de'
  meta: { title: string; description: string }
  nav: {
    labels: Record<SceneId, string>
    cta: string
    homeLabel: string
    scenesLabel: string
    progressLabel: string
  }
  claim: { text: string; subtitle: string } // text exakt 'Structure. Automation. Growth.'
  scenes: {
    komplexitaet: SceneText & { scrollHint: string } // title ist die H1, ≤ 90 Zeichen
    analyse: SceneText
    struktur: SceneText // die drei Punkte kommen aus services
    automatisierung: SceneText & { examples: string[] } // genau 3
    wachstum: SceneText & { fields: { name: string; text: string }[] } // genau 3: Effizienz, Skalierbarkeit, Produktivität
    kontakt: SceneText & {
      calCta: string
      calConsent: string
      calTitle: string
      calOpenNewTab: string
      emailCta: string
    }
  }
  services: { name: string; text: string }[] // genau 3: Prozessoptimierung, Digitalisierung, Automatisierung
  about: {
    number: string
    kicker: string
    heading: string
    sentences: string[] // 2–3 Sätze
    photoAlt: string
    initials: string // 'LH'
  }
  footer: { legal: { label: string; href: string }[]; legalLabel: string }
}
