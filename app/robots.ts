import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/dev/', '/brand'] }],
    sitemap: 'https://smartflow.bayern/sitemap.xml',
  }
}
