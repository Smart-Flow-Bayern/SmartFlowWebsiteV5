import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
} from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { colors } from '../../lib/brand/tokens.ts'
import type { PartName } from './parts.ts'

// Einheiten in Metern. Gehäuse 0.45 × 0.45 × 0.20 (x × y × z), zentriert im Ursprung.
// Die offene Seite liegt bei z = +0.10 (Seitenwand), das Mainboard bei z = −0.08; die Kamera blickt entlang −z hinein.
const CASE = { width: 0.45, height: 0.45, depth: 0.2 }
const WALL = 0.004
const CASE_COLOR = '#0B0D0F'

const BOARD = { x: -0.03, y: 0.03, z: -0.08, width: 0.3, height: 0.34, thickness: 0.003 }
/** Vorderfläche des Mainboards (z), auf der alle Bauteile sitzen. */
const BOARD_FRONT = BOARD.z + BOARD.thickness / 2
const CPU = { x: -0.05, y: 0.1, size: 0.04, thickness: 0.006 }
const SOCKET_THICKNESS = 0.003

const caseMaterial = new MeshStandardMaterial({ name: 'case', color: CASE_COLOR, roughness: 0.6, metalness: 0.4 })
const surfaceMaterial = new MeshStandardMaterial({ name: 'surface', color: colors.surface, roughness: 0.7, metalness: 0.2 })

/** Eigene Materialinstanz je Emissionsteil, damit jedes Teil getrennt aufleuchten kann. */
function emissiveMaterial(name: string): MeshStandardMaterial {
  return new MeshStandardMaterial({
    name,
    color: colors.surface,
    emissive: colors.accent,
    emissiveIntensity: 0,
    roughness: 0.6,
    metalness: 0.2,
  })
}

/** Quader mit Größe (sx, sy, sz), verschoben auf (x, y, z). */
function box(sx: number, sy: number, sz: number, x: number, y: number, z: number): BoxGeometry {
  const geometry = new BoxGeometry(sx, sy, sz)
  geometry.translate(x, y, z)
  return geometry
}

function mesh(name: string, geometry: BufferGeometry, material: MeshStandardMaterial): Mesh {
  const result = new Mesh(geometry, material)
  result.name = name
  return result
}

/** Fünf Gehäuseplatten; die sechste (+z) ist die abnehmbare Seitenwand. */
function buildCase(): Mesh {
  const { width: w, height: h, depth: d } = CASE
  const plates = [
    box(w, h, WALL, 0, 0, -d / 2 + WALL / 2), // Rückwand
    box(WALL, h, d, -w / 2 + WALL / 2, 0, 0), // links
    box(WALL, h, d, w / 2 - WALL / 2, 0, 0), // rechts
    box(w, WALL, d, 0, h / 2 - WALL / 2, 0), // Deckel
    box(w, WALL, d, 0, -h / 2 + WALL / 2, 0), // Boden
  ]
  return mesh('case', mergeGeometries(plates), caseMaterial)
}

function buildSidePanel(): Mesh {
  return mesh('sidePanel', box(CASE.width, CASE.height, WALL, 0, 0, CASE.depth / 2 - WALL / 2), caseMaterial)
}

function buildMainboard(): Mesh {
  const board = mesh(
    'mainboard',
    box(BOARD.width, BOARD.height, BOARD.thickness, BOARD.x, BOARD.y, BOARD.z),
    emissiveMaterial('mainboard'),
  )
  const socketSize = CPU.size + 0.01
  board.add(
    mesh('cpuSocket', box(socketSize, socketSize, SOCKET_THICKNESS, CPU.x, CPU.y, BOARD_FRONT + SOCKET_THICKNESS / 2), surfaceMaterial),
  )
  return board
}

const CPU_FRONT = BOARD_FRONT + SOCKET_THICKNESS + CPU.thickness

function buildCpu(): Mesh {
  return mesh(
    'cpu',
    box(CPU.size, CPU.size, CPU.thickness, CPU.x, CPU.y, CPU_FRONT - CPU.thickness / 2),
    emissiveMaterial('cpu'),
  )
}

/** Kühlerturm: Grundplatte und 8 Lamellen. Kleiner als die CPU und leicht abgehoben, damit ihr Rand sichtbar leuchtet. */
const COOLER = { size: 0.028, lift: 0.003 }

function buildCpuCooler(): Mesh {
  const size = COOLER.size
  const baseThickness = 0.008
  const finDepth = 0.07
  const finThickness = 0.002
  const finCount = 8
  const baseBack = CPU_FRONT + COOLER.lift
  const baseFront = baseBack + baseThickness
  const parts = [box(size, size, baseThickness, CPU.x, CPU.y, baseBack + baseThickness / 2)]
  const pitch = (size - finThickness) / (finCount - 1)
  for (let i = 0; i < finCount; i++) {
    const y = CPU.y - size / 2 + finThickness / 2 + i * pitch
    parts.push(box(size, finThickness, finDepth, CPU.x, y, baseFront + finDepth / 2))
  }
  return mesh('cpuCooler', mergeGeometries(parts), surfaceMaterial)
}

/** RAM-Riegel: 0.13 lang (y), 0.03 hoch (z), 0.004 dick (x). */
function buildRam(index: number): Mesh {
  const name = `ram_${index}` as PartName
  const length = 0.13
  const height = 0.03
  const x = 0.02 + index * 0.012
  return mesh(name, box(0.004, length, height, x, CPU.y, BOARD_FRONT + height / 2), emissiveMaterial(name))
}

const GPU = { x: -0.03, y: -0.03, width: 0.24, height: 0.09, thickness: 0.02, standoff: 0.01 }

/** Lüfter: Nabe (Zylinder, Achse lokal y) mit 7 flachen Blättern; dreht später um die lokale y-Achse. */
function buildFan(index: number, x: number): Mesh {
  const hubRadius = 0.012
  const bladeLength = 0.023
  const fan = mesh(`gpuFan_${index}`, new CylinderGeometry(hubRadius, hubRadius, 0.006, 16), surfaceMaterial)
  fan.position.set(x, 0, GPU.thickness / 2 + 0.003)
  fan.rotation.x = Math.PI / 2 // Achse lokal y zeigt nach +z, zur Kamera
  for (let i = 0; i < 7; i++) {
    const blade = mesh(`gpuFan_${index}_blade_${i}`, box(bladeLength, 0.002, 0.009, hubRadius + bladeLength / 2, 0, 0), surfaceMaterial)
    blade.rotation.set(0.35, (i / 7) * Math.PI * 2, 0, 'YXZ') // angestellt wie ein Propellerblatt
    fan.add(blade)
  }
  return fan
}

function buildGpu(): Mesh {
  const gpu = mesh('gpu', new BoxGeometry(GPU.width, GPU.height, GPU.thickness), emissiveMaterial('gpu'))
  gpu.position.set(GPU.x, GPU.y, BOARD_FRONT + GPU.standoff + GPU.thickness / 2)
  gpu.add(buildFan(0, -0.055), buildFan(1, 0.055))
  return gpu
}

const SSD = { x: -0.05, y: -0.105, width: 0.08, height: 0.022, thickness: 0.003 }

function buildSsd(): Mesh {
  const material = emissiveMaterial('ssd')
  const ssd = mesh('ssd', new BoxGeometry(SSD.width, SSD.height, SSD.thickness), material)
  ssd.position.set(SSD.x, SSD.y, BOARD_FRONT + SSD.thickness / 2)
  const blockSize = 0.014
  for (let i = 0; i < 4; i++) {
    const x = -SSD.width / 2 + 0.013 + i * 0.018
    // Eigene Materialinstanz je Block (gleiche Werte), damit die Blöcke später einzeln aufleuchten können
    const name = `ssdBlock_${i}`
    ssd.add(mesh(name, box(blockSize, blockSize, 0.002, x, 0, SSD.thickness / 2 + 0.001), emissiveMaterial(name)))
  }
  return ssd
}

function buildPsu(): Mesh {
  const height = 0.07
  const y = -CASE.height / 2 + WALL + height / 2
  return mesh('psu', box(0.16, height, 0.15, 0.06, y, 0), surfaceMaterial)
}

/** Anschlussleiste an der linken Gehäusewand, 6 Vertiefungen zeigen ins Gehäuse (+x). */
function buildIoPanel(): Mesh {
  const thickness = 0.003
  const panel = mesh('ioPanel', new BoxGeometry(thickness, 0.12, 0.05), emissiveMaterial('ioPanel'))
  panel.position.set(-CASE.width / 2 + WALL + thickness / 2, 0.13, -0.05)
  for (let i = 0; i < 6; i++) {
    const row = Math.floor(i / 2)
    const column = i % 2
    const name = i === 0 ? 'ioSlot_cable' : `ioSlot_${i}`
    panel.add(mesh(name, box(0.002, 0.025, 0.012, thickness / 2 + 0.001, -0.035 + row * 0.035, column === 0 ? -0.012 : 0.012), caseMaterial))
  }
  return panel
}

/** Leiterbahnen auf der Mainboard-Fläche: Busse von der CPU zu RAM, GPU und SSD. */
function buildTraces(): LineSegments {
  const z = BOARD_FRONT + 0.0005
  const half = CPU.size / 2
  const vertices: number[] = []
  const polyline = (points: [number, number][]) => {
    for (let i = 0; i < points.length - 1; i++) vertices.push(...points[i], z, ...points[i + 1], z)
  }
  for (let i = 0; i < 10; i++) {
    const y = CPU.y - 0.0225 + i * 0.005
    polyline([[CPU.x + half, y], [0.018, y]]) // zu den RAM-Riegeln
    const x = CPU.x - 0.0225 + i * 0.005
    polyline([[x, CPU.y - half], [x, GPU.y + GPU.height / 2]]) // zur GPU
  }
  for (let i = 0; i < 8; i++) {
    const y = CPU.y - 0.0175 + i * 0.005
    const x = CPU.x - half - 0.07 - i * 0.005
    const ssdY = SSD.y - 0.0035 + i * 0.001
    polyline([[CPU.x - half, y], [x, y], [x, ssdY], [SSD.x - SSD.width / 2, ssdY]]) // zur SSD
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  const traces = new LineSegments(geometry, new LineBasicMaterial({ name: 'traces', color: colors.accent }))
  traces.name = 'traces'
  return traces
}

/** Stilisierter Computer; jedes Teil aus `PART_NAMES` ist ein direktes Kind mit diesem Namen. */
export function buildComputer(): Group {
  const group = new Group()
  group.name = 'computer'
  group.add(
    buildCase(),
    buildSidePanel(),
    buildMainboard(),
    buildCpu(),
    buildCpuCooler(),
    ...[0, 1, 2, 3].map(buildRam),
    buildGpu(),
    buildSsd(),
    buildPsu(),
    buildIoPanel(),
    buildTraces(),
  )
  return group
}
