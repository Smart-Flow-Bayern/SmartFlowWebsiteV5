import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { colors } from '@/lib/brand/tokens'

const root = process.cwd()

describe('Statische Marken-SVGs', () => {
  it.each([
    'public/brand/wordmark-underscore.svg',
    'public/brand/wordmark-impulse.svg',
    'public/brand/impulse.svg',
  ])('%s existiert, besteht nur aus Pfaden und ist kleiner als 20 kB', (file) => {
    const path = join(root, file)
    expect(existsSync(path)).toBe(true)
    const svg = readFileSync(path, 'utf8')
    expect(svg).toContain('<path')
    expect(svg).not.toContain('<text')
    expect(svg).not.toMatch(/href=|url\(|@import/)
    expect(statSync(path).size).toBeLessThan(20 * 1024)
  })
})

describe('App-Icons', () => {
  it('app/icon.svg ist 32×32 auf dem Grund-Token mit Akzent-Strich', () => {
    const svg = readFileSync(join(root, 'app/icon.svg'), 'utf8')
    expect(svg).toContain('viewBox="0 0 32 32"')
    expect(svg).toContain(`<rect width="32" height="32" fill="${colors.ground}"/>`)
    expect(svg).toContain(`stroke="${colors.accent}"`)
    expect(svg).toContain('<path')
  })

  it('app/apple-icon.png ist ein PNG mit 180×180 Pixeln', () => {
    const png = readFileSync(join(root, 'app/apple-icon.png'))
    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
    expect(png.readUInt32BE(16)).toBe(180)
    expect(png.readUInt32BE(20)).toBe(180)
  })
})

describe('Rechtsseiten (public/legal.css)', () => {
  const css = readFileSync(join(root, 'public/legal.css'), 'utf8')
  it('deklariert die acht Blaupause-Tokens mit den Werten aus lib/brand/tokens.ts', () => {
    const vars: Record<keyof typeof colors, string> = {
      ground: '--ground',
      groundEnd: '--ground-end',
      ink: '--ink',
      muted: '--muted',
      line: '--line',
      nodeStroke: '--node-stroke',
      accent: '--accent',
      accentInk: '--accent-ink',
    }
    for (const [key, name] of Object.entries(vars)) {
      expect(css).toContain(`${name}: ${colors[key as keyof typeof colors]};`)
    }
  })
  it('nutzt Farben nur über die Variablen; Akzent einmal deklariert, nie als Textfarbe', () => {
    const literals = css.match(/#[0-9a-f]{3,8}\b|rgba?\(/gi) ?? []
    expect(literals).toHaveLength(8)
    expect(css.match(new RegExp(colors.accent, 'gi'))).toHaveLength(1)
    expect(css).not.toMatch(/(^|[^-])color:\s*var\(--accent\)/m)
  })
})
