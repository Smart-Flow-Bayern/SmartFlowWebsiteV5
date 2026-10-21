import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const glb = join(process.cwd(), 'public/models/computer.glb')

/** JSON-Chunk einer glb: 12 Byte Header, dann Chunk-Länge (uint32), Chunk-Typ, JSON. */
function readGltfJson(path: string): { asset: { generator?: string }; extensionsRequired?: string[] } {
  const buffer = readFileSync(path)
  expect(buffer.toString('ascii', 0, 4)).toBe('glTF')
  const chunkLength = buffer.readUInt32LE(12)
  expect(buffer.toString('ascii', 16, 20)).toBe('JSON')
  return JSON.parse(buffer.toString('utf8', 20, 20 + chunkLength))
}

describe('public/models/computer.glb', () => {
  it('exists and is smaller than 3 MB', () => {
    expect(existsSync(glb)).toBe(true)
    expect(statSync(glb).size).toBeLessThan(3_000_000)
  })

  it('is meshopt-compressed and names its generator', () => {
    const json = readGltfJson(glb)
    expect(json.extensionsRequired).toContain('EXT_meshopt_compression')
    expect(json.asset.generator).toBeTruthy()
  })
})
