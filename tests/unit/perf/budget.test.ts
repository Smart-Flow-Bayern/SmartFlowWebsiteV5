import { gzipSync } from 'node:zlib'
import { describe, expect, it } from 'vitest'
import { sumGzip } from '../../../scripts/check-budget.mjs'

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
