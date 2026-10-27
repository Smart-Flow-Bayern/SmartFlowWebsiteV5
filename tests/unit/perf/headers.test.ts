import { describe, expect, it } from 'vitest'
import nextConfig from '../../../next.config'
import { CSP } from '../../../lib/security/csp'

describe('Auslieferung über GitHub Pages', () => {
  it('baut einen statischen Export ohne Header- und Weiterleitungsregeln, die Pages nicht kennt', () => {
    expect(nextConfig.output).toBe('export')
    expect(nextConfig.headers).toBeUndefined()
    expect(nextConfig.redirects).toBeUndefined()
  })

  it('CSP erlaubt Cal.com nur für Frames und Verbindungen und sperrt Objekte', () => {
    const directives = Object.fromEntries(
      CSP.split(';').map((d) => {
        const [name, ...values] = d.trim().split(/\s+/)
        return [name, values]
      }),
    )
    expect(directives['frame-src']).toEqual(['https://cal.com', 'https://*.cal.com'])
    expect(directives['connect-src']).toEqual(["'self'", 'https://cal.com', 'https://*.cal.com'])
    expect(directives['script-src']).toEqual(["'self'", "'unsafe-inline'"])
    expect(directives['img-src']).not.toContain('blob:')
    expect(directives['worker-src']).toEqual(["'self'"])
    expect(directives['script-src']).not.toContain("'unsafe-eval'")
    expect(directives['object-src']).toEqual(["'none'"])
    // Im <meta>-Tag wirkungslos, Browser melden es als Fehler
    expect(directives['frame-ancestors']).toBeUndefined()
    expect(CSP).not.toMatch(/\*\s*(;|$)/)
  })
})
