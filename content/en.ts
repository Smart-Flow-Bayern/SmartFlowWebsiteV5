import type { SiteContent } from '@/content/types'

export const en: SiteContent = {
  locale: 'en',
  meta: {
    title: 'Smart Flow – Workflows, Digitization, Automation | Regensburg',
    description:
      'Smart Flow from Regensburg sorts out workflows in small businesses, picks fitting software and automates whatever keeps repeating.',
  },
  nav: {
    labels: {
      gehaeuse: 'Start',
      mainboard: 'Overview',
      cpu: 'Processes',
      ram: 'Tools',
      gpu: 'Automatic',
      ssd: 'Approach',
      kontakt: 'Contact',
    },
    cta: 'Intro call',
    homeLabel: 'Smart Flow – back to start',
    stationsLabel: 'Sections',
  },
  station0: {
    sentence: 'A new tool every week. Meanwhile, your business should simply keep running.',
    scrollHint: 'Scroll',
  },
  station1: {
    claim: 'Less noise. More done.',
    labels: ['Processes', 'Tools', 'Automatic', 'Approach', 'Contact'],
  },
  about: {
    heading: 'Who is behind it',
    sentences: [
      'Smart Flow is Leon Heinrich, based in Regensburg.',
      'You deal with the same person from the first conversation until the new workflow is running.',
      'The question each time: what saves your business work, and what is just loud?',
    ],
  },
  cpu: {
    title: 'Process optimization',
    intro:
      'Understand first, change second. We look at how the work really gets done in your business. Where things back up, we rebuild. What happens twice disappears.',
    examples: [
      {
        branch: 'Trades',
        text: 'Example: A job is taken at the office, written down again on site and retyped in the evening for the invoice. Afterward the job is entered once, and everyone works from the same details.',
      },
      {
        branch: 'Medical practice',
        text: 'Example: Appointment requests arrive by phone, note and message, and nobody knows which ones are confirmed. Afterward requests land in one fixed place, and the team returns calls in a batch.',
      },
      {
        branch: 'Property management',
        text: 'Example: A damage report travels through several inboxes until someone feels responsible. Afterward it is clear who receives it and when the tenant gets an answer.',
      },
    ],
  },
  ram: {
    title: 'Digitization',
    intro:
      'Software should take work off your plate, not create more. We make sure your tools fit your business.',
    sticks: [
      'Choose the software that fits, not the one making the most noise.',
      'Move data from folders, paper notes and spreadsheets to where everyone can find it.',
      'Connect programs so that nothing has to be typed in twice.',
    ],
  },
  gpu: {
    title: 'Automation',
    intro: 'Some things no one has to touch anymore. They run in the background while you work.',
    beforeLabel: 'Before',
    afterLabel: 'After',
    before: [
      'Invoices are written up at the end of the month.',
      'Appointments get shifted back and forth on the phone.',
      'Quotes are followed up whenever someone remembers.',
    ],
    after: [
      'Invoices go out as soon as the job is closed.',
      'Customers book on their own and get a reminder beforehand.',
      'Open quotes are followed up on a fixed schedule.',
    ],
  },
  ssd: {
    title: 'Four steps',
    blocks: [
      {
        name: 'Analysis',
        happens:
          'We walk through your workday with the people who do the work every day, on site or by video.',
        deliverable: 'A list of what holds you back most, and where we begin.',
        duration: 'to be agreed',
      },
      {
        name: 'Concept',
        happens: 'We define how things should run in the future and which tools that takes.',
        deliverable: 'A plan in plain language, with the order and effort for each step.',
        duration: 'to be agreed',
      },
      {
        name: 'Implementation',
        happens: 'We set up, connect and test. Your team gets trained before anything is switched over.',
        deliverable: 'Workflows that hold up in daily work and that your team can operate itself.',
        duration: 'to be agreed',
      },
      {
        name: 'Refinement',
        happens: 'Once everything runs, we look at where daily work still snags and adjust.',
        deliverable: 'A workflow that has proven itself in the business, not just on paper.',
        duration: 'to be agreed',
      },
    ],
  },
  contact: {
    title: 'Let us talk about your business.',
    text: 'Tell us where things snag for you. Afterward you will know clearly whether we can help and where we would start.',
    calCta: 'Pick a time',
    calConsent:
      'The Cal.com calendar only appears once you click. Data is then sent to Cal.com; see the privacy policy for details.',
    calTitle: 'Booking an appointment with Cal.com',
    calOpenNewTab: 'Open calendar in a new tab',
  },
  footer: {
    legal: [
      { label: 'Legal notice', href: '/en/legal-notice.html' },
      { label: 'Privacy policy', href: '/en/privacy-policy.html' },
      { label: 'Terms', href: '/en/terms.html' },
    ],
    languageSwitch: { label: 'Deutsch', href: '/' },
    legalLabel: 'Legal',
  },
}
