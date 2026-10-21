import { describe, expect, it } from 'vitest'
import { buildSchema } from '@/lib/seo/schema'
import { de } from '@/content/de'
import { en } from '@/content/en'

type Obj = {
  '@context'?: string
  '@type': string
  '@id'?: string
  name?: string
  description?: string
  url?: string
  telephone?: string
  email?: string
  address?: Record<string, string>
  founder?: { '@id': string }
  worksFor?: { '@id': string }
  provider?: { '@id': string }
}
const byType = (objs: object[], t: string) => (objs as Obj[]).filter((o) => o['@type'] === t)

function keysDeep(v: unknown, out: Set<string> = new Set()): Set<string> {
  if (Array.isArray(v)) v.forEach((x) => keysDeep(x, out))
  else if (v && typeof v === 'object')
    for (const [k, x] of Object.entries(v)) {
      out.add(k)
      keysDeep(x, out)
    }
  return out
}

describe('buildSchema', () => {
  const schema = buildSchema('de', de) as Obj[]

  it('has exactly one LocalBusiness with contact data from CONTACT', () => {
    const lb = byType(schema, 'LocalBusiness')
    expect(lb).toHaveLength(1)
    expect(lb[0].name).toBe('Smart Flow')
    expect(lb[0].telephone).toBe('+49 173 4487550')
    expect(lb[0].email).toBe('info@smartflow.bayern')
    expect(lb[0].address!.streetAddress).toBe('Arnulfsplatz 2')
    expect(lb[0].address!.postalCode).toBe('93047')
    expect(lb[0].address!.addressLocality).toBe('Regensburg')
    expect(lb[0].address!.addressCountry).toBe('DE')
    expect(lb[0].url).toBe('https://smartflow.bayern/')
  })

  it('has one Person and three Services named after the station titles', () => {
    expect(byType(schema, 'Person')).toHaveLength(1)
    expect(byType(schema, 'Person')[0].name).toBe('Leon Heinrich')
    const names = byType(schema, 'Service').map((s) => s.name)
    expect(names).toEqual([de.cpu.title, de.ram.title, de.gpu.title])
    expect(byType(schema, 'Service').map((s) => s.description)).toEqual([de.cpu.intro, de.ram.intro, de.gpu.intro])
  })

  it('contains no FAQPage, Offer or AggregateRating', () => {
    for (const t of ['FAQPage', 'Offer', 'AggregateRating']) expect(byType(schema, t)).toHaveLength(0)
    const keys = keysDeep(schema)
    expect(keys.has('offers')).toBe(false)
    expect(keys.has('aggregateRating')).toBe(false)
  })

  it('omits fields without a source', () => {
    const keys = keysDeep(schema)
    for (const k of ['areaServed', 'openingHours', 'sameAs', 'foundingDate', 'priceRange', 'geo', 'image'])
      expect(keys.has(k)).toBe(false)
  })

  it('is JSON round-trip stable', () => {
    for (const s of [buildSchema('de', de), buildSchema('en', en)]) {
      const json = JSON.stringify(s)
      expect(json).not.toContain('undefined')
      expect(json).not.toContain('null')
      expect(JSON.parse(json)).toStrictEqual(s)
    }
  })

  it('every @id reference resolves to an existing @id', () => {
    for (const s of [schema, buildSchema('en', en) as Obj[]]) {
      const ids = new Set(s.map((o) => o['@id']).filter(Boolean))
      const refs = [
        ...s.filter((o) => o.founder).map((o) => o.founder!['@id']),
        ...s.filter((o) => o.worksFor).map((o) => o.worksFor!['@id']),
        ...s.filter((o) => o.provider).map((o) => o.provider!['@id']),
      ]
      expect(refs.length).toBe(5)
      for (const r of refs) expect(ids.has(r)).toBe(true)
      for (const o of s) expect(o['@context']).toBe('https://schema.org')
    }
  })

  it('English variant points to /en and uses English titles', () => {
    const s = buildSchema('en', en) as Obj[]
    expect(byType(s, 'LocalBusiness')[0].url).toBe('https://smartflow.bayern/en')
    expect(byType(s, 'Service').map((x) => x.name)).toEqual([en.cpu.title, en.ram.title, en.gpu.title])
  })
})
