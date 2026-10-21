import { describe, expect, it } from 'vitest'
import { resolveStationSlug } from '../../../lib/scroll/hash'

describe('resolveStationSlug', () => {
  it('löst aktuelle Station-Slugs auf', () => {
    expect(resolveStationSlug('kontakt')?.id).toBe('kontakt')
    expect(resolveStationSlug('start')?.id).toBe('gehaeuse')
  })

  it('bildet alte v3-Anker auf Stationen ab', () => {
    expect(resolveStationSlug('contact')?.slug).toBe('kontakt')
    expect(resolveStationSlug('services')?.slug).toBe('ablaeufe')
    expect(resolveStationSlug('process')?.slug).toBe('ablauf')
    expect(resolveStationSlug('about')?.slug).toBe('ueberblick')
  })

  it('lässt alte Anker ohne Ziel und unbekannte Slugs ins Leere laufen', () => {
    for (const s of ['hero', 'pains', 'audiences', 'faq', 'gibts-nicht', '', 'constructor', '__proto__']) {
      expect(resolveStationSlug(s), s).toBeUndefined()
    }
  })
})
