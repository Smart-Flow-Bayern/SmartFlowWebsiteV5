import { SITE_ORIGIN } from '@/lib/seo/site'
import type { Metadata } from 'next'
import { CONTENT } from '@/content'

/** Vorschaubild aller Seiten, erzeugt von der Route app/og.png/route.tsx in genau diesen Maßen. */
export const OG_IMAGE = { url: '/og.png', width: 1200, height: 630, alt: 'Smart Flow' } as const

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
