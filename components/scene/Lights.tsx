'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import {
  Color,
  LineBasicMaterial,
  MathUtils,
  MeshStandardMaterial,
  Vector3,
  type AmbientLight,
  type Group,
  type Mesh,
  type Object3D,
  type PointLight,
} from 'three'
import { colors } from '@/lib/brand/tokens'
import { mainboardLabelIndex, ssdBlocksWritten } from '@/scene/animations'
import { EMISSIVE_PEAK, activePart, ambientAt, backgroundAt, partEmissive } from '@/scene/lighting'
import { EMISSIVE_PARTS, type PartName } from '@/scene/model/parts'
import { progressStore } from '@/lib/scroll/progress'

const LAMBDA = 6
/** Geteilte Materialien ohne eigene Emission; sie werden nie angefasst. */
const SHARED_MATERIALS = new Set(['surface', 'case'])
const ACCENT_HEX = colors.accent.slice(1).toLowerCase()
const ACCENT_OFFSET_Z = 0.12
const ACCENT_INTENSITY = 0.02
const KEY_INTENSITY = 8
/** Reihenfolge, in der der Mainboard-Sweep die Bauteile kurz aufleuchten lässt (Index aus mainboardLabelIndex). */
const SWEEP_PARTS: readonly PartName[] = ['cpu', 'ram_0', 'gpu', 'ssd', 'ioPanel']
/** Zusatz auf die Grundleuchtstärke des Sweep-Teils; der Brief-Wert 2.0 übersteuert unter ACES. */
const LABEL_FLASH = 2 * EMISSIVE_PEAK
/** Beschriebener SSD-Block: deutlich hell, bleibt aber grün statt weiß. */
const SSD_BLOCK_ON = 0.8
const SSD_BLOCK_OFF = 0.05
const SSD_BLOCK_PREFIX = 'ssdBlock_'
const SSD_BLOCK_COUNT = 4

interface Driven {
  part: PartName
  materials: MeshStandardMaterial[]
  lines: LineBasicMaterial[]
}

function collect(root: Object3D, seen: Set<unknown>): Pick<Driven, 'materials' | 'lines'> {
  const materials: MeshStandardMaterial[] = []
  const lines: LineBasicMaterial[] = []
  root.traverse((object) => {
    const raw = (object as Object3D & { material?: unknown }).material
    for (const material of Array.isArray(raw) ? raw : raw ? [raw] : []) {
      if (seen.has(material)) continue
      if (
        material instanceof MeshStandardMaterial &&
        !SHARED_MATERIALS.has(material.name) &&
        !material.name.startsWith(SSD_BLOCK_PREFIX) &&
        material.emissive.getHexString() === ACCENT_HEX
      ) {
        seen.add(material)
        materials.push(material)
      } else if (material instanceof LineBasicMaterial) {
        seen.add(material)
        material.transparent = true
        lines.push(material)
      }
    }
  })
  return { materials, lines }
}

function dampEmissive(driven: readonly Driven[], progress: number, delta: number) {
  const sweepPart = SWEEP_PARTS[mainboardLabelIndex(progress)]
  for (const { part, materials, lines } of driven) {
    const goal = partEmissive(part, progress) + (part === sweepPart ? LABEL_FLASH : 0)
    for (const material of materials) {
      material.emissiveIntensity = MathUtils.damp(material.emissiveIntensity, goal, LAMBDA, delta)
    }
    for (const material of lines) {
      material.opacity = Math.min(1, MathUtils.damp(material.opacity, goal, LAMBDA, delta))
    }
  }
}

function dampSsdBlocks(blocks: readonly MeshStandardMaterial[], progress: number, delta: number) {
  const written = ssdBlocksWritten(progress)
  blocks.forEach((material, i) => {
    const goal = i < written ? SSD_BLOCK_ON : SSD_BLOCK_OFF
    material.emissiveIntensity = MathUtils.damp(material.emissiveIntensity, goal, LAMBDA, delta)
  })
}

/** Licht-Dramaturgie: Hintergrund, Umgebungslicht, Akzentlicht am aktiven Teil, Leuchtstärke der Teile. */
export default function Lights({ computer }: { computer: Group }) {
  const ambient = useRef<AmbientLight>(null)
  const accent = useRef<PointLight>(null)
  const accentPlaced = useRef(false)
  const background = useMemo(() => new Color(colors.bg), [])
  const world = useMemo(() => new Vector3(), [])

  const driven = useMemo<Driven[]>(() => {
    const seen = new Set<unknown>()
    return EMISSIVE_PARTS.map((part) => {
      const found = computer.getObjectByName(part)
      return { part, ...(found ? collect(found, seen) : { materials: [], lines: [] }) }
    })
  }, [computer])

  const ssdBlocks = useMemo(() => {
    const blocks: MeshStandardMaterial[] = []
    for (let i = 0; i < SSD_BLOCK_COUNT; i++) {
      const material = (computer.getObjectByName(`${SSD_BLOCK_PREFIX}${i}`) as Mesh | undefined)?.material
      if (material instanceof MeshStandardMaterial) blocks.push(material)
    }
    return blocks
  }, [computer])

  useFrame((frame, delta) => {
    const p = progressStore.get()
    frame.scene.background = background.set(backgroundAt(p))
    if (ambient.current) ambient.current.intensity = ambientAt(p)

    const active = activePart(p)
    const target = active ? computer.getObjectByName(active) : null
    if (accent.current && target) {
      target.getWorldPosition(world)
      const light = accent.current.position
      if (!accentPlaced.current) {
        light.set(world.x, world.y, world.z + ACCENT_OFFSET_Z)
        accentPlaced.current = true
      } else {
        light.set(
          MathUtils.damp(light.x, world.x, LAMBDA, delta),
          MathUtils.damp(light.y, world.y, LAMBDA, delta),
          MathUtils.damp(light.z, world.z + ACCENT_OFFSET_Z, LAMBDA, delta),
        )
      }
    }

    dampEmissive(driven, p, delta)
    dampSsdBlocks(ssdBlocks, p, delta)
  })

  return (
    <>
      <ambientLight ref={ambient} intensity={ambientAt(0)} />
      <directionalLight position={[0.3, 0.6, 1]} intensity={KEY_INTENSITY} color={colors.text} />
      <pointLight ref={accent} color={colors.accent} intensity={ACCENT_INTENSITY} distance={0.6} decay={2} />
    </>
  )
}
