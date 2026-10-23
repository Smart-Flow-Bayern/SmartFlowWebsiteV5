import { describe, expect, it } from 'vitest'
import sitemap from '@/app/sitemap'

describe('sitemap', () => {
  it('enthält nur die Startseite ohne Sprachalternativen', () => {
    const s = sitemap()
    expect(s).toHaveLength(1)
    expect(s[0].url).toBe('https://smartflow.bayern/')
    expect(s[0]).not.toHaveProperty('alternates')
  })
})
