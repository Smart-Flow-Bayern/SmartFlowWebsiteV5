import { readFileSync } from 'node:fs'
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import nextConfig from '../../../next.config'

describe('Weiterleitungen', () => {
  it('leitet /en und alles darunter dauerhaft auf / um', async () => {
    const r = await nextConfig.redirects!()
    expect(r).toContainEqual({ source: '/en', destination: '/', permanent: true })
    expect(r).toContainEqual({ source: '/en/:path*', destination: '/', permanent: true })
  })
  it('vercel.json kennt keinen /en-Eintrag mehr und public/en ist weg', () => {
    const v = JSON.parse(readFileSync('vercel.json', 'utf8'))
    expect(v.redirects.some((x: { source: string }) => x.source.startsWith('/en'))).toBe(false)
    expect(existsSync('public/en')).toBe(false)
  })
})
