import { SITE_ORIGIN } from '@/lib/seo/site'
import { CONTACT } from '@/content/contact'
import type { SiteContent } from '@/content/types'

const ORIGIN = SITE_ORIGIN
const BUSINESS_ID = `${ORIGIN}/#business`
const PERSON_ID = `${ORIGIN}/#leon`
const CONTEXT = 'https://schema.org'

/**
 * JSON-LD für die Startseite. Nur belegte Fakten aus CONTACT und den Inhaltsdateien;
 * fehlende Felder stehen in docs/content/seo-offen.md.
 */
export function buildSchema(content: SiteContent): object[] {
  const business = {
    '@context': CONTEXT,
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: 'Smart Flow',
    url: `${ORIGIN}/`,
    email: CONTACT.email,
    telephone: CONTACT.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.street,
      postalCode: CONTACT.zip,
      addressLocality: CONTACT.city,
      addressCountry: 'DE',
    },
    founder: { '@id': PERSON_ID },
  }

  const person = {
    '@context': CONTEXT,
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Leon Heinrich',
    worksFor: { '@id': BUSINESS_ID },
  }

  const services = content.services.map((s) => ({
    '@context': CONTEXT,
    '@type': 'Service',
    name: s.name,
    description: s.text,
    provider: { '@id': BUSINESS_ID },
  }))

  // Nur weil die Fragen sichtbar auf der Seite stehen (components/scenes/Fragen.tsx).
  const faq = {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return [business, person, ...services, faq]
}
