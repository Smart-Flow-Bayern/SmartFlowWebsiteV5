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
export function buildSchema(locale: 'de' | 'en', content: SiteContent): object[] {
  const url = locale === 'de' ? `${ORIGIN}/` : `${ORIGIN}/en`

  const business = {
    '@context': CONTEXT,
    '@type': 'LocalBusiness',
    '@id': BUSINESS_ID,
    name: 'Smart Flow',
    url,
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

  const services = [content.cpu, content.ram, content.gpu].map((s) => ({
    '@context': CONTEXT,
    '@type': 'Service',
    name: s.title,
    description: s.intro,
    provider: { '@id': BUSINESS_ID },
  }))

  return [business, person, ...services]
}
