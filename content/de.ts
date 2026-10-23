import type { SiteContent } from '@/content/types'

/** Entwurf nach Spec 5.3 (Rebranding V2), Leon korrigiert. */
export const de: SiteContent = {
  locale: 'de',
  meta: {
    title: 'Smart Flow Regensburg – Abläufe ordnen, digitalisieren, automatisieren',
    description:
      'Smart Flow aus Regensburg macht aus Zetteln, Anrufen und doppelten Eingaben einen Ablauf, den jeder im Betrieb versteht.',
  },
  nav: {
    labels: {
      komplexitaet: 'Start',
      analyse: 'Analyse',
      struktur: 'Struktur',
      automatisierung: 'Automatisierung',
      wachstum: 'Wachstum',
      ueber: 'Über',
      kontakt: 'Kontakt',
    },
    cta: 'Erstgespräch',
    homeLabel: 'Smart Flow – zum Anfang',
    scenesLabel: 'Abschnitte',
    progressLabel: 'Fortschritt',
    skipLabel: 'Zum Inhalt springen',
  },
  claim: {
    text: 'Structure. Automation. Growth.',
    subtitle: 'Erst Ordnung, dann Entlastung, dann Wachstum.',
  },
  scenes: {
    komplexitaet: {
      number: '01',
      kicker: 'Komplexität',
      title: 'Anfragen auf Zetteln, Termine im Kopf, Rechnungen am Wochenende.',
      text: 'In vielen Betrieben wächst die Arbeit schneller als die Ordnung. Wir machen daraus einen Ablauf, den jeder im Betrieb versteht.',
      scrollHint: 'Scrollen',
    },
    analyse: {
      number: '02',
      kicker: 'Analyse',
      title: 'Erst verstehen, wie die Arbeit bei Ihnen läuft.',
      text: 'Wir gehen Ihren Arbeitstag mit den Leuten durch, die täglich damit arbeiten. So wird sichtbar, wo Anfragen liegen bleiben und was doppelt passiert. Das Vorgehen ist immer gleich: erst verstehen, dann planen, dann umbauen, dann nachbessern.',
    },
    struktur: {
      number: '03',
      kicker: 'Struktur',
      title: 'Jede Angabe wird einmal erfasst und liegt an einer Stelle.',
      text: 'Ein Auftrag wird einmal aufgenommen, und alle arbeiten mit denselben Angaben. Für jeden Schritt ist klar, wer zuständig ist. Dafür setzen wir an drei Stellen an.',
    },
    automatisierung: {
      number: '04',
      kicker: 'Automatisierung',
      title: 'Was sich ständig wiederholt, läuft von selbst.',
      text: 'Manches muss niemand mehr anfassen. Es läuft im Hintergrund, während Ihr Team arbeitet. Drei Beispiele aus dem Alltag:',
      examples: [
        'Die Rechnung geht raus, sobald der Auftrag als erledigt markiert ist.',
        'Kunden wählen ihren Termin selbst und bekommen vorher eine Erinnerung.',
        'Offene Angebote werden nach festem Plan nachgefasst, ohne dass jemand daran denken muss.',
      ],
    },
    wachstum: {
      number: '05',
      kicker: 'Wachstum',
      title: 'Mehr Aufträge schaffen, ohne mehr Durcheinander.',
      text: 'Wenn Abläufe klar sind, trägt der Betrieb mehr Arbeit, ohne dass alle länger bleiben. Neue Leute finden sich zurecht, weil jeder Schritt nachvollziehbar ist.',
      fields: [
        { name: 'Effizienz', text: 'Weniger Suchen, weniger Rückfragen, keine doppelte Eingabe.' },
        { name: 'Skalierbarkeit', text: 'Der Ablauf hält auch dann, wenn mehr Anfragen kommen.' },
        { name: 'Produktivität', text: 'Ihr Team arbeitet am Auftrag statt an der Ablage.' },
      ],
    },
    kontakt: {
      number: '06',
      kicker: 'Kontakt',
      title: 'Reden wir über Ihren Betrieb.',
      text: 'Erzählen Sie, wo es bei Ihnen hakt. Sie hören danach klar, ob wir helfen können und womit wir anfangen würden.',
      calCta: 'Termin wählen',
      calConsent:
        'Der Kalender von Cal.com erscheint erst, wenn Sie klicken. Dann gehen Daten an Cal.com; mehr dazu in der Datenschutzerklärung.',
      calTitle: 'Terminbuchung bei Cal.com',
      calOpenNewTab: 'Kalender in neuem Tab öffnen',
      emailCta: 'E-Mail schreiben',
    },
  },
  services: [
    {
      name: 'Prozessoptimierung',
      text: 'Wir ordnen Abläufe so, dass nichts doppelt passiert und jeder weiß, was als Nächstes kommt.',
    },
    {
      name: 'Digitalisierung',
      text: 'Wir wählen passende Programme aus und verbinden sie, damit nichts zweimal eingetippt wird.',
    },
    {
      name: 'Automatisierung',
      text: 'Was sich ständig wiederholt, wie Rechnung, Erinnerung und Nachfass, läuft im Hintergrund.',
    },
  ],
  about: {
    number: '',
    kicker: 'Wer dahintersteht',
    heading: 'Ein Ansprechpartner aus Regensburg.',
    sentences: [
      'Smart Flow ist Leon Heinrich aus Regensburg.',
      'Ihr Ansprechpartner bleibt vom ersten Gespräch bis zum laufenden Ablauf derselbe.',
      'Die Frage ist jedes Mal: Was spart Ihrem Betrieb Arbeit, und was ist nur laut?',
    ],
    photoAlt: 'Leon Heinrich',
    initials: 'LH',
  },
  footer: {
    legal: [
      { label: 'Impressum', href: '/impressum.html' },
      { label: 'Datenschutz', href: '/datenschutz.html' },
      { label: 'AGB', href: '/agb.html' },
    ],
    legalLabel: 'Rechtliches',
  },
}
