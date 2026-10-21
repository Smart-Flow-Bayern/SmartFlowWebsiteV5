import { Box3, BufferGeometry, LineBasicMaterial, Mesh, MeshStandardMaterial, Object3D, Vector3 } from 'three'
import { describe, expect, it } from 'vitest'
import { STATION_IDS } from '@/content/types'
import { buildComputer } from '@/scene/model/buildComputer'
import { EMISSIVE_PARTS, PART_NAMES, STATION_PART } from '@/scene/model/parts'

const group = buildComputer()

/** Material des Teils selbst; ist das Teil ein reiner Container, das des ersten Mesh-Nachfahren. */
function partMaterial(part: Object3D): unknown {
  if ('material' in part) return part.material
  let found: unknown
  part.traverse((o) => {
    if (found === undefined && o instanceof Mesh) found = o.material
  })
  return found
}

describe('buildComputer', () => {
  it('contains every part name exactly once', () => {
    for (const name of PART_NAMES) {
      const found: Object3D[] = []
      group.traverse((o) => {
        if (o.name === name) found.push(o)
      })
      expect(found, name).toHaveLength(1)
    }
  })

  it('has every part except the gpu fans as a direct child; the fans sit on the gpu', () => {
    for (const name of PART_NAMES) {
      const parent = name.startsWith('gpuFan_') ? group.getObjectByName('gpu') : group
      expect(group.getObjectByName(name)!.parent, name).toBe(parent)
    }
  })

  it('has named ssd blocks and the cable slot', () => {
    const ssd = group.getObjectByName('ssd')!
    for (let i = 0; i < 4; i++) expect(ssd.getObjectByName(`ssdBlock_${i}`), `ssdBlock_${i}`).toBeDefined()
    expect(group.getObjectByName('ioPanel')!.getObjectByName('ioSlot_cable')).toBeDefined()
  })

  it('fits the 0.45 × 0.45 × 0.20 m case, centred at the origin', () => {
    const box = new Box3().setFromObject(group)
    const size = box.getSize(new Vector3())
    expect(size.x).toBeGreaterThanOrEqual(0.4)
    expect(size.x).toBeLessThanOrEqual(0.5)
    expect(size.y).toBeGreaterThanOrEqual(0.4)
    expect(size.y).toBeLessThanOrEqual(0.5)
    expect(size.z).toBeGreaterThanOrEqual(0.18)
    expect(size.z).toBeLessThanOrEqual(0.24)
    expect(box.getCenter(new Vector3()).length()).toBeLessThan(0.01)
  })

  // Die 0.20-m-Tiefe liegt auf z (Größentest oben), daher Seitenwand bei z = +0.10 und Mainboard bei z = −0.08
  it('places the side panel at z = +0.10 and the mainboard at z = -0.08', () => {
    const at = (name: string) => new Box3().setFromObject(group.getObjectByName(name)!).getCenter(new Vector3())
    expect(at('sidePanel').z).toBeCloseTo(0.1, 2)
    expect(at('mainboard').z).toBeCloseTo(-0.08, 2)
  })

  it('gives every emissive part an accent emissive starting at intensity 0', () => {
    for (const name of EMISSIVE_PARTS) {
      const material = partMaterial(group.getObjectByName(name)!)
      if (name === 'traces') {
        // traces ist LineSegments mit LineBasicMaterial (kein emissive): geprüft wird die Farbe
        expect(material).toBeInstanceOf(LineBasicMaterial)
        expect((material as LineBasicMaterial).color.getHexString()).toBe('ddff4d')
        continue
      }
      expect(material, name).toBeInstanceOf(MeshStandardMaterial)
      const standard = material as MeshStandardMaterial
      expect(standard.emissive.getHexString(), name).toBe('ddff4d')
      expect(standard.emissiveIntensity, name).toBe(0)
    }
  })

  it('draws at least 40 trace segments', () => {
    const traces = group.getObjectByName('traces') as Object3D & { geometry: BufferGeometry }
    expect(traces.geometry.getAttribute('position').count / 2).toBeGreaterThanOrEqual(40)
  })

  it('stays under 60 000 triangles', () => {
    let triangles = 0
    group.traverse((o) => {
      if (!(o instanceof Mesh)) return
      const geometry = o.geometry as BufferGeometry
      triangles += (geometry.index ? geometry.index.count : geometry.getAttribute('position').count) / 3
    })
    expect(triangles).toBeLessThan(60_000)
  })
})

describe('STATION_PART', () => {
  it('maps every station to an existing part', () => {
    for (const id of STATION_IDS) {
      const part = STATION_PART[id]
      expect(part === null || PART_NAMES.includes(part), id).toBe(true)
    }
    expect(STATION_PART.kontakt).toBe('ioPanel')
  })
})
