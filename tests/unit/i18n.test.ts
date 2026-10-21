import { describe, expect, it } from 'vitest'
import { de } from '@/content/de'
import { en } from '@/content/en'
import { CONTENT } from '@/content'
import { alternates } from '@/lib/i18n'

describe('i18n', () => {
  it('alternates für de', () => {
    expect(alternates('de')).toEqual({ canonical: '/', languages: { de: '/', en: '/en' } })
  })
  it('alternates für en', () => {
    expect(alternates('en')).toEqual({ canonical: '/en', languages: { de: '/', en: '/en' } })
  })
  it('CONTENT ordnet Sprachen zu', () => {
    expect(CONTENT.de).toBe(de)
    expect(CONTENT.en).toBe(en)
  })
})
