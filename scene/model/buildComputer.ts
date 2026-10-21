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
  RingGeometry,
  TorusGeometry,
} from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { colors } from '../../lib/brand/tokens.ts'
import { BOARD, BOARD_FRONT, CPU, IMPULSE_TRACE, SSD, TRACE_Z, ssdTrace } from './layout.ts'
import type { PartName } from './parts.ts'

export { IMPULSE_TRACE }

// Einheiten in Metern. Gehäuse 0.45 × 0.45 × 0.20 (x × y × z), zentriert im Ursprung.
// Die offene Seite liegt bei z = +0.10 (Seitenwand), das Mainboard bei z = −0.08; die Kamera blickt entlang −z hinein.
const CASE = { width: 0.45, height: 0.45, depth: 0.2 }
const WALL = 0.004
const CASE_COLOR = '#0B0D0F'

const SOCKET_THICKNESS = 0.003

const caseMaterial = new MeshStandardMaterial({ name: 'case', color: CASE_COLOR, roughness: 0.6, metalness: 0.4 })
const surfaceMaterial = new MeshStandardMaterial({ name: 'surface', color: colors.surface, roughness: 0.7, metalness: 0.2 })
/** Etwas hellere Gehäusevariante für Lüftungsschlitze und Gitter; leuchtet nicht. */
const ventMaterial = new MeshStandardMaterial({ name: 'caseVent', color: '#141618', roughness: 0.6, metalness: 0.4 })
/** Kontaktleiste der GPU in Gedimmt; leuchtet nicht. */
const contactMaterial = new MeshStandardMaterial({ name: 'contacts', color: colors.muted, roughness: 0.5, metalness: 0.6 })

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

/** Quader mit gefasten Kanten (flaches Shading bleibt), verschoben auf (x, y, z). Radius wird auf die Hälfte der kleinsten Kante begrenzt. */
function roundedBox(sx: number, sy: number, sz: number, x: number, y: number, z: number, radius = 0.004): BufferGeometry {
  const geometry = new RoundedBoxGeometry(sx, sy, sz, 2, radius)
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
    roundedBox(w, h, WALL, 0, 0, -d / 2 + WALL / 2), // Rückwand
    roundedBox(WALL, h, d, -w / 2 + WALL / 2, 0, 0), // links
    roundedBox(WALL, h, d, w / 2 - WALL / 2, 0, 0), // rechts
    roundedBox(w, WALL, d, 0, h / 2 - WALL / 2, 0), // Deckel
    roundedBox(w, WALL, d, 0, -h / 2 + WALL / 2, 0), // Boden
  ]
  const body = mesh('case', mergeGeometries(plates), caseMaterial)
  // 6 Lüftungsschlitze auf dem Deckel
  for (let i = 0; i < 6; i++) {
    body.add(mesh(`caseVent_${i}`, box(0.2, 0.002, 0.012, 0, h / 2 + 0.001, -0.07 + i * 0.024), ventMaterial))
  }
  return body
}

function buildSidePanel(): Mesh {
  return mesh('sidePanel', roundedBox(CASE.width, CASE.height, WALL, 0, 0, CASE.depth / 2 - WALL / 2), caseMaterial)
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
  // VRM-Kühlblock über der CPU
  board.add(mesh('vrmBlock', box(0.09, 0.02, 0.012, CPU.x, CPU.y + 0.06, BOARD_FRONT + 0.006), surfaceMaterial))
  // 8 Kondensatoren in einer Reihe oberhalb des VRM
  for (let i = 0; i < 8; i++) {
    const cap = new CylinderGeometry(0.003, 0.003, 0.008, 12)
    cap.rotateX(Math.PI / 2)
    cap.translate(CPU.x - 0.046 + i * 0.013, 0.186, BOARD_FRONT + 0.004)
    board.add(mesh(`cap_${i}`, cap, surfaceMaterial))
  }
  // 24-Pin-Stecker am rechten Rand
  board.add(mesh('atxConnector', box(0.012, 0.05, 0.012, 0.105, CPU.y, BOARD_FRONT + 0.006), surfaceMaterial))
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

/**
 * CPU-Kühler als Gruppe mit Ursprung an der Grundplatte (Rückseite, direkt vor der CPU), damit
 * `cpuCooler.position.z += d` ihn später nach vorn abhebt. Er verdeckt die CPU.
 */
const COOLER = { size: 0.07, baseThickness: 0.008, finCount: 12, finThickness: 0.0015, finDepth: 0.06 }

function buildCpuCooler(): Group {
  const { size, baseThickness, finCount, finThickness, finDepth } = COOLER
  const cooler = new Group()
  cooler.name = 'cpuCooler'
  cooler.position.set(CPU.x, CPU.y, CPU_FRONT)
  cooler.add(mesh('coolerBase', box(size, size, baseThickness, 0, 0, baseThickness / 2), surfaceMaterial))
  const finFront = baseThickness + finDepth
  const pitch = (size - finThickness) / (finCount - 1)
  for (let i = 0; i < finCount; i++) {
    const y = -size / 2 + finThickness / 2 + i * pitch
    cooler.add(mesh(`coolerFin_${i}`, box(size, finThickness, finDepth, 0, y, baseThickness + finDepth / 2), surfaceMaterial))
  }
  // Heatpipes: Achse z, durch alle Lamellen
  const pipeLength = 0.07
  for (let i = 0; i < 4; i++) {
    const pipe = new CylinderGeometry(0.003, 0.003, pipeLength, 10)
    pipe.rotateX(Math.PI / 2)
    pipe.translate(i % 2 === 0 ? -0.015 : 0.015, i < 2 ? -0.015 : 0.015, baseThickness + pipeLength / 2)
    cooler.add(mesh(`heatpipe_${i}`, pipe, surfaceMaterial))
  }
  const ring = new TorusGeometry(0.03, 0.003, 8, 32)
  ring.translate(0, 0, finFront + 0.003)
  cooler.add(mesh('coolerFanRing', ring, surfaceMaterial))
  return cooler
}

/** RAM-Riegel: 0.13 lang (y), 0.03 hoch (z), 0.004 dick (x). */
function buildRam(index: number): Mesh {
  const name = `ram_${index}` as PartName
  const length = 0.13
  const height = 0.03
  const x = 0.02 + index * 0.012
  // Kerbe: zwei Hälften mit 4 mm Lücke in der Mitte, gemergt zu einem Objekt
  const gap = 0.004
  const half = (length - gap) / 2
  const z = BOARD_FRONT + height / 2
  const halves = [
    roundedBox(0.004, half, height, x, CPU.y - (gap + half) / 2, z, 0.002),
    roundedBox(0.004, half, height, x, CPU.y + (gap + half) / 2, z, 0.002),
  ]
  return mesh(name, mergeGeometries(halves), emissiveMaterial(name))
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
  const gpu = mesh('gpu', roundedBox(GPU.width, GPU.height, GPU.thickness, 0, 0, 0), emissiveMaterial('gpu'))
  gpu.position.set(GPU.x, GPU.y, BOARD_FRONT + GPU.standoff + GPU.thickness / 2)
  gpu.add(buildFan(0, -0.055), buildFan(1, 0.055))
  // Backplate hinter der Karte
  gpu.add(mesh('gpuBackplate', box(GPU.width, GPU.height, 0.002, 0, 0, -GPU.thickness / 2 - 0.001), surfaceMaterial))
  // Lüfterringe um die Lüfter
  for (const [i, x] of [-0.055, 0.055].entries()) {
    const ring = new TorusGeometry(0.037, 0.002, 6, 32)
    ring.translate(x, 0, GPU.thickness / 2 + 0.001)
    gpu.add(mesh(`gpuFanRing_${i}`, ring, surfaceMaterial))
  }
  // PCIe-Kontaktleiste an der Unterkante
  gpu.add(mesh('gpuContacts', box(0.1, 0.004, 0.003, -0.03, -GPU.height / 2 - 0.002, 0), contactMaterial))
  return gpu
}

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
  const top = y + height / 2
  const psu = mesh('psu', roundedBox(0.16, height, 0.15, 0.06, y, 0), surfaceMaterial)
  // Lüftergitter auf der Oberseite
  const grille = new RingGeometry(0.02, 0.045, 24)
  grille.rotateX(-Math.PI / 2)
  grille.translate(0.06, top + 0.0005, 0)
  psu.add(mesh('psuGrille', grille, ventMaterial))
  // 3 Kabel Richtung Mainboard-Stecker
  const cableBottom = top
  const cableTop = CPU.y - 0.025
  for (let i = 0; i < 3; i++) {
    const cable = new CylinderGeometry(0.0025, 0.0025, cableTop - cableBottom, 8)
    cable.translate(0.1 + i * 0.005, (cableTop + cableBottom) / 2, BOARD_FRONT + 0.004)
    psu.add(mesh(`psuCable_${i}`, cable, caseMaterial))
  }
  return psu
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
  const z = TRACE_Z
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
    polyline(ssdTrace(i)) // zur SSD
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
