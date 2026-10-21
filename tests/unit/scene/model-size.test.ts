import { existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const glb = join(process.cwd(), 'public/models/computer.glb')

describe('public/models/computer.glb', () => {
  it('exists and is smaller than 3 MB', () => {
    expect(existsSync(glb)).toBe(true)
    expect(statSync(glb).size).toBeLessThan(3_000_000)
  })
})
