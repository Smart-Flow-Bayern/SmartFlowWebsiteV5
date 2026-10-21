import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Eager geladene Module (Stationstexte) dürfen three nicht transitiv in den Start-Chunk ziehen.
describe('three bleibt aus dem Start-Chunk', () => {
  for (const file of ['scene/animations.ts', 'scene/easing.ts', 'scene/stations.ts']) {
    it(`${file} importiert weder three noch scene/camera`, () => {
      const src = readFileSync(new URL(`../../../${file}`, import.meta.url), 'utf8')
      expect(src).not.toMatch(/from ['"]three/)
      expect(src).not.toMatch(/from ['"]\.\/camera['"]/)
    })
  }
})
