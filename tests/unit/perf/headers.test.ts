import { describe, expect, it } from 'vitest'
import nextConfig from '../../../next.config'

describe('next.config headers', () => {
  it('liefert langes immutable Caching für Modelle, Fonts und Stationsbilder', async () => {
    const rules = await nextConfig.headers!()
    for (const source of ['/models/:path*', '/fonts/:path*', '/stations/:path*']) {
      const rule = rules.find((r) => r.source === source)
      expect(rule, source).toBeDefined()
      expect(rule!.headers).toContainEqual({
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      })
    }
  })
})
