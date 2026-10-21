import { Box3, BufferGeometry, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial, Object3D, Vector3 } from 'three'
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

  it('gives each gpu fan exactly 7 blade children', () => {
    for (const name of ['gpuFan_0', 'gpuFan_1']) {
      const fan = group.getObjectByName(name)!
      expect(fan.children.filter((c) => c instanceof Mesh && c.name.startsWith(`${name}_blade_`)), name).toHaveLength(7)
    }
  })

  it('builds the cpu cooler from a base and exactly 8 fins', () => {
    // cpuCooler ist ein gemergtes Mesh: Grundplatte + 8 Lamellen = 9 Boxen à 24 Eckpunkte
    const cooler = group.getObjectByName('cpuCooler')
    expect(cooler).toBeInstanceOf(Mesh)
    expect((cooler as Mesh).geometry.getAttribute('position').count / 24 - 1).toBe(8)
  })

  it('has exactly 6 io slots, one named ioSlot_cable', () => {
    const slots = group.getObjectByName('ioPanel')!.children
    expect(slots).toHaveLength(6)
    expect(slots.every((c) => c.name.startsWith('ioSlot_'))).toBe(true)
    expect(slots.filter((c) => c.name === 'ioSlot_cable')).toHaveLength(1)
  })

  it('has exactly the ssd blocks ssdBlock_0..3', () => {
    expect(group.getObjectByName('ssd')!.children.map((c) => c.name)).toEqual(['ssdBlock_0', 'ssdBlock_1', 'ssdBlock_2', 'ssdBlock_3'])
  })

  it('has a psu mesh with geometry', () => {
    const psu = group.getObjectByName('psu')
    expect(psu).toBeInstanceOf(Mesh)
    expect((psu as Mesh).geometry.getAttribute('position').count).toBeGreaterThan(0)
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

  // Die 0.20-m-Tiefe liegt auf z (Größentest oben), daher Seitenwand bei z = +0.10 und Mainboard bei z = −0.08.
  // Mainboard-Platte ohne Kinder (Sockel), damit nur die Platte selbst zählt.
  function boardPlate(): Box3 {
    const board = group.getObjectByName('mainboard') as Mesh
    group.updateMatrixWorld(true)
    board.geometry.computeBoundingBox()
    return board.geometry.boundingBox!.clone().applyMatrix4(board.matrixWorld)
  }

  it('places the side panel at z = +0.10 and the mainboard plate at z = -0.08', () => {
    const sidePanel = new Box3().setFromObject(group.getObjectByName('sidePanel')!).getCenter(new Vector3())
    expect(Math.abs(sidePanel.z - 0.1)).toBeLessThanOrEqual(0.005)
    expect(Math.abs(boardPlate().getCenter(new Vector3()).z + 0.08)).toBeLessThanOrEqual(0.005)
  })

  it('puts cpu, ram, gpu and ssd in front of the mainboard plate and inside the case', () => {
    const boardFront = boardPlate().max.z
    const caseBox = new Box3().setFromObject(group.getObjectByName('case')!)
    for (const name of ['cpu', 'ram_0', 'ram_1', 'ram_2', 'ram_3', 'gpu', 'ssd']) {
      const box = new Box3().setFromObject(group.getObjectByName(name)!)
      expect(box.min.z, name).toBeGreaterThanOrEqual(boardFront - 0.001)
      expect(caseBox.containsBox(box), name).toBe(true)
    }
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
    const traces = group.getObjectByName('traces')
    expect(traces).toBeInstanceOf(LineSegments)
    expect((traces as LineSegments).geometry.getAttribute('position').count / 2).toBeGreaterThanOrEqual(40)
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
