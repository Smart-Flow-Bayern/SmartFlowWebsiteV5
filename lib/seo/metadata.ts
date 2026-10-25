import { SITE_ORIGIN } from '@/lib/seo/site'
import type { Metadata } from 'next'
import { CONTENT } from '@/content'

/**
 * Vorschaubild für `/`: explizit gesetzt (stabile URL ohne Hash). Für `/` greift diese Angabe, nicht die
 * Datei-Konvention app/opengraph-image.tsx; die Konvention (URL mit Hash, Maße und alt aus der Datei) gilt nur
 * für Routen, die `openGraph.images` nicht selbst setzen (derzeit die 404). Maße und alt wie in
 * app/opengraph-image.tsx (`size`, `alt`).
 */
export const OG_IMAGE = { url: '/opengraph-image', width: 1200, height: 630, alt: 'Smart Flow' } as const

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
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', images: [OG_IMAGE] },
  }
}
