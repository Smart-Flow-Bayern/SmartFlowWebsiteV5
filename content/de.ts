import type { SiteContent } from '@/content/types'

/** Entwurf nach Spec 5.3 (Rebranding V2), Leon korrigiert. */
export const de: SiteContent = {
  locale: 'de',
  meta: {
    title: 'Smart Flow Regensburg – Abläufe ordnen, digitalisieren, automatisieren',
    description:
      'Smart Flow aus Regensburg hilft kleinen und mittleren Betrieben, ihre Büroarbeit vom Zettel in einen festen Ablauf zu bringen.',
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
      text: 'In vielen Handwerksbetrieben, Praxen und Hausverwaltungen wächst die Arbeit schneller als die Ordnung. Ich mache daraus einen Ablauf, den Ihr ganzes Team versteht.',
      scrollHint: 'Scrollen',
    },
    analyse: {
      number: '02',
      kicker: 'Analyse',
      title: 'Erst verstehen, wie die Arbeit bei Ihnen läuft.',
      text: 'Ich gehe Ihren Arbeitstag mit den Leuten durch, die ihn kennen. So wird sichtbar, wo Anfragen liegen bleiben und was doppelt passiert. Danach plane ich den Umbau und bessere so lange nach, bis er im Alltag sitzt.',
    },
    struktur: {
      number: '03',
      kicker: 'Struktur',
      title: 'Jede Angabe wird einmal erfasst und liegt an einer Stelle.',
      text: 'Wer einen Auftrag annimmt, legt ihn an, und ab da arbeiten alle mit denselben Daten. Für jeden Schritt steht fest, wer zuständig ist. Dafür setze ich an drei Stellen an.',
    },
    automatisierung: {
      number: '04',
      kicker: 'Automatisierung',
      title: 'Was sich ständig wiederholt, läuft von selbst.',
      text: 'Manche Handgriffe muss niemand mehr machen. Ihr Team sieht nur noch das Ergebnis. Zum Beispiel:',
      examples: [
        'Im Handwerksbetrieb geht die Rechnung raus, sobald der Auftrag als erledigt markiert ist.',
        'In der Praxis wählen Patienten ihren Termin selbst und bekommen vorher eine Erinnerung.',
        'In der Hausverwaltung landet jede Schadensmeldung mit Fotos beim richtigen Objekt und bei der zuständigen Person.',
      ],
    },
    wachstum: {
      number: '05',
      kicker: 'Wachstum',
      title: 'Mehr Aufträge schaffen, ohne mehr Durcheinander.',
      text: 'Ist geregelt, wer was wann macht, schafft der Betrieb mehr Arbeit in derselben Zeit. Neue Leute finden sich schnell zurecht, weil sie jeden Schritt nachvollziehen können.',
      fields: [
        { name: 'Weniger Suchen', text: 'Was einmal eingegeben ist, steht überall. Niemand muss mehr nachfragen.' },
        { name: 'Mehr Anfragen, gleiches Team', text: 'Der Ablauf hält auch dann, wenn mehr Anfragen kommen.' },
        { name: 'Zeit für den Auftrag', text: 'Ihr Team arbeitet am Auftrag statt an der Ablage.' },
      ],
    },
    kontakt: {
      number: '06',
      kicker: 'Kontakt',
      title: 'Reden wir über Ihren Betrieb.',
      text: 'Erzählen Sie, wo es bei Ihnen hakt. Danach sage ich Ihnen offen, ob ich helfen kann und womit ich anfangen würde.',
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
      text: 'Ich ordne die Arbeit so, dass jeder weiß, was als Nächstes kommt.',
    },
    {
      name: 'Digitalisierung',
      text: 'Ich wähle passende Programme aus und verbinde sie, damit nichts zweimal eingetippt wird.',
    },
    {
      name: 'Automatisierung',
      text: 'Routinearbeit wie Rechnungen und Terminerinnerungen übernimmt das System.',
    },
  ],
  about: {
    number: '',
    kicker: 'Wer dahintersteht',
    heading: 'Ein Ansprechpartner aus Regensburg.',
    sentences: [
      'Smart Flow ist Leon Heinrich aus Regensburg und arbeitet für Betriebe in ganz Bayern.',
      'Vom ersten Gespräch bis zum fertigen Umbau haben Sie denselben Ansprechpartner.',
      'Die Frage ist jedes Mal: Was spart Ihrem Betrieb Arbeit, und was ist nur laut?',
    ],
    photoAlt: 'Leon Heinrich',
    initials: 'LH',
  },
  faq: {
    kicker: 'Häufige Fragen',
    heading: 'Was Betriebe vor dem ersten Gespräch wissen wollen.',
    items: [
      {
        question: 'Muss mein Team dafür viel Neues lernen?',
        answer:
          'Nein. Ich entwickle den Ablauf mit den Leuten, die die Arbeit heute machen. Danach bessere ich nach, bis er im Alltag sitzt.',
      },
      {
        question: 'Was, wenn meine Mitarbeiter nicht mitziehen?',
        answer: 'Wer die Arbeit macht, gestaltet den neuen Ablauf mit. Deshalb fühlt er sich nicht wie eine Vorgabe von oben an.',
      },
      {
        question: 'Müssen wir neue Programme kaufen?',
        answer:
          'Nicht unbedingt. Zuerst sehe ich mir an, was Sie schon nutzen und was davon gut läuft. Neues kommt nur dazu, wenn es Ihnen Arbeit spart.',
      },
      {
        question: 'Geht das neben dem Tagesgeschäft?',
        answer: 'Ja. Ich stelle Schritt für Schritt um, nicht alles an einem Tag. Ihr Betrieb läuft dabei weiter.',
      },
      {
        question: 'Was passiert mit unseren Daten?',
        answer: 'Ihre Daten liegen in eigenen Datenbanken.',
      },
    ],
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
