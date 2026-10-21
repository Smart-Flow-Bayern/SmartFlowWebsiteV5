import { afterEach, describe, expect, it, vi } from 'vitest'
import nextConfig from '../../../next.config'

describe('next.config headers', () => {
  afterEach(() => vi.unstubAllEnvs())

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

  it('setzt Sicherheits-Header für alle Pfade', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const rules = await nextConfig.headers!()
    const rule = rules.find((r) => r.source === '/:path*')
    expect(rule).toBeDefined()
    const byKey = Object.fromEntries(rule!.headers.map((h) => [h.key, h.value]))
    expect(byKey['X-Content-Type-Options']).toBe('nosniff')
    expect(byKey['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(byKey['Permissions-Policy']).toBe('camera=(), microphone=(), geolocation=()')
    expect(byKey['X-Frame-Options']).toBe('SAMEORIGIN')
    expect(byKey['Content-Security-Policy']).toBeDefined()
  })

  it('lässt die CSP in der Entwicklung weg, weil next dev unsafe-eval braucht', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const rules = await nextConfig.headers!()
    const rule = rules.find((r) => r.source === '/:path*')!
    expect(rule.headers.map((h) => h.key)).not.toContain('Content-Security-Policy')
    expect(rule.headers.map((h) => h.key)).toContain('X-Content-Type-Options')
  })

  it('CSP erlaubt Cal.com nur für Frames und Verbindungen und sperrt Objekte', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const rules = await nextConfig.headers!()
    const csp = rules
      .find((r) => r.source === '/:path*')!
      .headers.find((h) => h.key === 'Content-Security-Policy')!.value
    const directives = Object.fromEntries(
      csp.split(';').map((d) => {
        const [name, ...values] = d.trim().split(/\s+/)
        return [name, values]
      }),
    )
    expect(directives['frame-src']).toEqual(['https://cal.com', 'https://*.cal.com'])
    expect(directives['connect-src']).toEqual(["'self'", 'https://cal.com', 'https://*.cal.com'])
    expect(directives['script-src']).toContain("'wasm-unsafe-eval'")
    expect(directives['script-src']).not.toContain("'unsafe-eval'")
    expect(directives['object-src']).toEqual(["'none'"])
    expect(directives['frame-ancestors']).toEqual(["'self'"])
    expect(csp).not.toMatch(/\*\s*(;|$)/)
  })
})
