import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { colors, fonts } from '@/lib/brand/tokens'

const root = process.cwd()
const css = readFileSync(join(root, 'app/globals.css'), 'utf8').toLowerCase()

describe('Signal-Tokens', () => {
  it.each(Object.entries(colors))('globals.css enthält %s = %s', (_name, hex) => {
    expect(css).toContain(hex.toLowerCase())
  })

  it('verweist auf die Schrift-Variablen', () => {
    expect(fonts).toEqual({ sans: 'var(--font-sans)', mono: 'var(--font-mono)' })
    expect(css).toContain('--font-schibsted')
    expect(css).toContain('--font-jetbrains')
  })

  it('ruft keine Google Fonts ab', () => {
    expect(css).not.toContain('fonts.googleapis.com')
  })

  it.each([
    'public/fonts/schibsted-grotesk-latin-wght.woff2',
    'public/fonts/jetbrains-mono-latin-wght.woff2',
  ])('%s existiert und ist größer als 20 kB', (file) => {
    const path = join(root, file)
    expect(existsSync(path)).toBe(true)
    expect(statSync(path).size).toBeGreaterThan(20 * 1024)
  })
})
