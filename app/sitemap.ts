import type { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/lib/seo/site'

const languages = { de: `${SITE_ORIGIN}/`, en: `${SITE_ORIGIN}/en` }

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_ORIGIN}/`, alternates: { languages } },
    { url: `${SITE_ORIGIN}/en`, alternates: { languages } },
  ]
}
