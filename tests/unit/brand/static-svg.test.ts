import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

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
  it('app/icon.svg ist 32×32 auf #050607', () => {
    const svg = readFileSync(join(root, 'app/icon.svg'), 'utf8')
    expect(svg).toContain('viewBox="0 0 32 32"')
    expect(svg).toMatch(/<rect[^>]*fill="#050607"/)
    expect(svg).toContain('<path')
  })

  it('app/apple-icon.png ist ein PNG mit 180×180 Pixeln', () => {
    const png = readFileSync(join(root, 'app/apple-icon.png'))
    expect(png.subarray(1, 4).toString('ascii')).toBe('PNG')
    expect(png.readUInt32BE(16)).toBe(180)
    expect(png.readUInt32BE(20)).toBe(180)
  })
})
