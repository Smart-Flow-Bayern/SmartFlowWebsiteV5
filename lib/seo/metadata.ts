import { SITE_ORIGIN } from '@/lib/seo/site'
import type { Metadata } from 'next'
import { CONTENT } from '@/content'

// Die Datei-Konvention app/opengraph-image.tsx greift nicht, weil das Layout in einer Route Group liegt
// und app/ kein eigenes Root-Layout hat; das Bild wird deshalb explizit gesetzt.
export function siteMetadata(): Metadata {
  const { meta } = CONTENT
  return {
    metadataBase: new URL(SITE_ORIGIN),
    title: meta.title,
    description: meta.description,
    openGraph: {
      type: 'website',
      siteName: 'Smart Flow',
      locale: 'de_DE',
      url: '/',
      title: meta.title,
      description: meta.description,
      images: ['/opengraph-image'],
    },
    twitter: { card: 'summary_large_image', images: ['/opengraph-image'] },
  }
}
