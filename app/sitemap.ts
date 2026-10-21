import type { MetadataRoute } from 'next'

const languages = { de: 'https://smartflow.bayern/', en: 'https://smartflow.bayern/en' }

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://smartflow.bayern/', alternates: { languages } },
    { url: 'https://smartflow.bayern/en', alternates: { languages } },
  ]
}
