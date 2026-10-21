import { SITE_ORIGIN } from '@/lib/seo/site'
import type { Metadata } from 'next'
import { CONTENT } from '@/content'
import { alternates, type Locale } from '@/lib/i18n'

// Die Datei-Konvention app/opengraph-image.tsx greift nicht, weil beide Layouts in Route Groups liegen
// und app/ kein eigenes Root-Layout hat; das Bild wird deshalb explizit gesetzt.
export function siteMetadata(locale: Locale): Metadata {
  const { meta } = CONTENT[locale]
  const url = locale === 'de' ? '/' : '/en'
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: meta.title,
    description: meta.description,
    alternates: alternates(locale),
    openGraph: {
      type: 'website',
      siteName: 'Smart Flow',
      locale: locale === 'de' ? 'de_DE' : 'en_US',
      url,
      title: meta.title,
      description: meta.description,
      images: ['/opengraph-image'],
    },
    twitter: { card: 'summary_large_image', images: ['/opengraph-image'] },
  }
}
