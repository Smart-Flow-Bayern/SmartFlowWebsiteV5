import { gzipSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import { scriptsFromHtml, sumGzip } from '../../../scripts/check-budget.mjs'

describe('sumGzip', () => {
  it('summiert die gzip-Größen der Dateien', () => {
    const files: Record<string, string> = {
      'a.js': 'a'.repeat(5000),
      'b.js': 'console.log("b");'.repeat(300),
    }
    const expected = Object.values(files).reduce((n, c) => n + gzipSync(Buffer.from(c)).length, 0)
    const total = sumGzip(Object.keys(files), (f: string) => Buffer.from(files[f]))
    expect(total).toBe(expected)
    expect(total).toBeGreaterThan(0)
  })

  it('zählt doppelte Dateien nur einmal und ignoriert Nicht-JS', () => {
    const read = (f: string) => Buffer.from(f + 'x'.repeat(100))
    expect(sumGzip(['a.js', 'a.js', 'x.css'], read)).toBe(sumGzip(['a.js'], read))
  })
})

describe('scriptsFromHtml', () => {
  it('liefert [] ohne script-src', () => {
    expect(scriptsFromHtml('<html><body><script>var a=1</script></body></html>')).toEqual([])
  })

  it('liefert Modul-Skripte und lässt noModule-Polyfills aus', () => {
    const html =
      '<script src="/_next/static/chunks/a.js" async=""></script>' +
      '<script src="/_next/static/chunks/poly.js" noModule=""></script>'
    expect(scriptsFromHtml(html)).toEqual(['static/chunks/a.js'])
  })
})
