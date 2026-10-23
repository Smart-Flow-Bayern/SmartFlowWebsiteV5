import { SITE_ORIGIN } from '@/lib/seo/site'
import type { Metadata } from 'next'
import { CONTENT } from '@/content'

// Vorschaubild explizit gesetzt (stabile URL ohne Hash). Seit das Root-Layout in app/ liegt (eigene 404),
// greift für Seiten ohne eigene openGraph-Angabe zusätzlich die Datei-Konvention app/opengraph-image.tsx.
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
