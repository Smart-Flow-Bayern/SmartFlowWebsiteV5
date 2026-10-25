import { readFileSync } from 'node:fs'
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Abhängigkeiten', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
  const all = { ...pkg.dependencies, ...pkg.devDependencies }
  it('kennt kein Three.js und keine Modell-Pipeline mehr', () => {
    for (const d of ['three', '@react-three/fiber', '@react-three/drei', '@types/three', '@gltf-transform/cli']) expect(all).not.toHaveProperty(d)
    expect(pkg.scripts).not.toHaveProperty('model:export')
    expect(pkg.scripts).not.toHaveProperty('stations:render')
    expect(existsSync('public/models')).toBe(false)
    expect(existsSync('public/stations')).toBe(false)
  })
  it('behält GSAP, Lenis, Next, React', () => {
    for (const d of ['gsap', 'lenis', 'next', 'react', 'react-dom']) expect(all).toHaveProperty(d)
  })
})
