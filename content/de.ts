import type { SiteContent } from '@/content/types'

export const de: SiteContent = {
  locale: 'de',
  meta: {
    title: 'Smart Flow – Abläufe, Digitalisierung, Automatisierung | Regensburg',
    description:
      'Smart Flow aus Regensburg ordnet Abläufe in kleinen Betrieben, wählt passende Software aus und automatisiert, was sich ständig wiederholt.',
  },
  nav: {
    labels: {
      gehaeuse: 'Start',
      mainboard: 'Überblick',
      cpu: 'Abläufe',
      ram: 'Werkzeuge',
      gpu: 'Automatik',
      ssd: 'Vorgehen',
      kontakt: 'Kontakt',
    },
    cta: 'Erstgespräch',
  },
  station0: {
    sentence: 'Jede Woche ein neues Werkzeug. Dabei soll Ihr Betrieb einfach laufen.',
    scrollHint: 'Scrollen',
  },
  station1: {
    claim: 'Weniger Lärm. Abläufe, die laufen.',
    labels: ['Abläufe', 'Werkzeuge', 'Automatik', 'Zusammenarbeit', 'Kontakt'],
  },
  about: {
    heading: 'Wer dahinter steht',
    sentences: [
      'Smart Flow ist Leon Heinrich aus Regensburg.',
      'Sie sprechen vom ersten Gespräch bis zum laufenden Ablauf mit derselben Person.',
      'Die Frage dabei ist immer dieselbe: Was spart Ihrem Betrieb Arbeit, und was ist nur laut?',
    ],
  },
  cpu: {
    title: 'Prozessoptimierung',
    intro:
      'Erst verstehen, dann ändern. Wir sehen uns an, wie die Arbeit bei Ihnen wirklich läuft. Wo es staut, wird umgebaut. Was doppelt passiert, fällt weg.',
    examples: [
      {
        branch: 'Handwerk',
        text: 'Beispiel: Ein Auftrag wird im Büro aufgenommen, auf der Baustelle neu notiert und abends für die Rechnung noch einmal abgetippt. Danach gibt es eine Erfassung, und alle arbeiten mit denselben Angaben.',
      },
      {
        branch: 'Praxis',
        text: 'Beispiel: Das Telefon klingelt während der Behandlung, Terminwünsche landen auf Zetteln. Danach kommen Anfragen an einer festen Stelle an, und das Team ruft gesammelt zurück.',
      },
      {
        branch: 'Hausverwaltung',
        text: 'Beispiel: Eine Schadensmeldung wandert durch mehrere Postfächer, bis sich jemand zuständig fühlt. Danach ist klar, wer sie bekommt und wann der Mieter Bescheid hört.',
      },
    ],
  },
  ram: {
    title: 'Digitalisierung',
    intro:
      'Software soll Arbeit abnehmen, nicht neue machen. Wir sorgen dafür, dass Ihre Werkzeuge zu Ihrem Betrieb passen.',
    sticks: [
      'Die passende Software auswählen, nicht die lauteste.',
      'Daten aus Ordnern, Zetteln und Tabellen dorthin holen, wo alle sie finden.',
      'Programme verbinden, damit nichts zweimal eingetippt wird.',
    ],
  },
  gpu: {
    title: 'Automatisierung',
    intro: 'Manches muss niemand mehr anfassen. Es läuft im Hintergrund, während Sie arbeiten.',
    before: [
      'Rechnungen werden am Monatsende nachgeschrieben.',
      'Termine werden am Telefon hin und her geschoben.',
      'Bei Angeboten wird nachgefasst, wenn jemand daran denkt.',
    ],
    after: [
      'Rechnungen gehen raus, sobald der Auftrag abgeschlossen ist.',
      'Kunden buchen selbst und bekommen vorher eine Erinnerung.',
      'Offene Angebote werden nach festem Plan nachgefasst.',
    ],
  },
  ssd: {
    title: 'Vier Schritte',
    blocks: [
      {
        name: 'Analyse',
        happens:
          'Wir sehen uns Ihre Abläufe an, vor Ort oder per Video, und sprechen mit den Leuten, die sie täglich machen.',
        deliverable: 'Eine Übersicht, wo Zeit verloren geht und was zuerst drankommt.',
        duration: 'nach Absprache',
      },
      {
        name: 'Konzept',
        happens: 'Wir legen fest, wie es künftig laufen soll und welche Werkzeuge dafür nötig sind.',
        deliverable: 'Ein Plan in verständlicher Sprache, mit Reihenfolge und Aufwand je Schritt.',
        duration: 'nach Absprache',
      },
      {
        name: 'Umsetzung',
        happens: 'Wir richten ein, verbinden und testen. Ihr Team wird eingewiesen, bevor umgestellt wird.',
        deliverable: 'Abläufe, die im Alltag funktionieren und die Ihr Team selbst bedienen kann.',
        duration: 'nach Absprache',
      },
      {
        name: 'Optimierung',
        happens: 'Nach dem Start prüfen wir, was im Alltag hakt, und stellen nach.',
        deliverable: 'Ein Ablauf, der sich im Betrieb bewährt hat, nicht nur auf dem Papier.',
        duration: 'nach Absprache',
      },
    ],
  },
  contact: {
    title: 'Reden wir über Ihren Betrieb.',
    text: 'Erzählen Sie, wo es bei Ihnen hakt. Sie bekommen eine klare Antwort, ob und wie wir helfen können.',
    calCta: 'Termin wählen',
    calConsent:
      'Ein Klick lädt den Buchungskalender von Cal.com. Dabei werden Daten an Cal.com übertragen; Einzelheiten stehen in der Datenschutzerklärung.',
  },
  footer: {
    legal: [
      { label: 'Impressum', href: '/impressum.html' },
      { label: 'Datenschutz', href: '/datenschutz.html' },
      { label: 'AGB', href: '/agb.html' },
    ],
    languageSwitch: { label: 'English', href: '/en' },
  },
}
