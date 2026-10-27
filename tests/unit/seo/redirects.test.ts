import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Weiterleitungen', () => {
  it('/en leitet per meta refresh auf / um', () => {
    const page = readFileSync('app/en/page.tsx', 'utf8')
    expect(page).toContain('httpEquiv="refresh" content="0; url=/"')
  })
  it('keine Vercel-Konfiguration und keine alten englischen Seiten mehr', () => {
    expect(existsSync('vercel.json')).toBe(false)
    expect(existsSync('public/en')).toBe(false)
  })
})
