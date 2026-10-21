export type StationId = 'gehaeuse' | 'mainboard' | 'cpu' | 'ram' | 'gpu' | 'ssd' | 'kontakt'

export const STATION_IDS: readonly StationId[] = [
  'gehaeuse',
  'mainboard',
  'cpu',
  'ram',
  'gpu',
  'ssd',
  'kontakt',
]

export interface SiteContent {
  locale: 'de' | 'en'
  meta: { title: string; description: string }
  nav: { labels: Record<StationId, string>; cta: string; homeLabel: string; stationsLabel: string }
  station0: { sentence: string; scrollHint: string }
  station1: { claim: string; labels: [string, string, string, string, string] }
  about: { heading: string; sentences: string[] } // 2–3 Sätze
  cpu: { title: string; intro: string; examples: { branch: string; text: string }[] } // genau 3
  ram: { title: string; intro: string; sticks: string[] } // genau 3
  gpu: {
    title: string
    intro: string
    beforeLabel: string
    afterLabel: string
    before: string[]
    after: string[]
  } // je 3
  ssd: {
    title: string
    blocks: { name: string; happens: string; deliverable: string; duration: string }[] // genau 4
  }
  contact: {
    title: string
    text: string
    calCta: string
    calConsent: string
    calTitle: string
    calOpenNewTab: string
  }
  footer: {
    legal: { label: string; href: string }[]
    languageSwitch: { label: string; href: string }
    legalLabel: string
  }
}
