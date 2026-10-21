export type Locale = 'de' | 'en'

/** Next-Metadata `alternates`: kanonische URL der Sprache plus hreflang-Links. */
export function alternates(locale: Locale) {
  return {
    canonical: locale === 'de' ? '/' : '/en',
    languages: { de: '/', en: '/en' },
  }
}
