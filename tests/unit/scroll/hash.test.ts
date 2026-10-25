import { describe, expect, it } from 'vitest'
import { resolveSceneSlug } from '@/lib/scroll/hash'

describe('resolveSceneSlug', () => {
  it.each([
    ['kontakt', 'kontakt'], ['start', 'komplexitaet'], ['ueber', 'ueber'],
    ['contact', 'kontakt'], ['services', 'struktur'], ['process', 'analyse'], ['about', 'ueber'],
    ['ueberblick', 'analyse'], ['ablaeufe', 'struktur'], ['werkzeuge', 'struktur'], ['automatik', 'automatisierung'], ['ablauf', 'analyse'],
  ])('%s → %s', (slug, id) => { expect(resolveSceneSlug(slug)?.id).toBe(id) })
  it('ignoriert Unbekanntes und Prototyp-Namen', () => {
    expect(resolveSceneSlug('faq')).toBeUndefined()
    expect(resolveSceneSlug('constructor')).toBeUndefined()
    expect(resolveSceneSlug('')).toBeUndefined()
  })
})
