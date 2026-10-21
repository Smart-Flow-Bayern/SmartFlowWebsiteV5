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
  type Object3D,
  type PointLight,
} from 'three'
import { colors } from '@/lib/brand/tokens'
import { activePart, ambientAt, backgroundAt, partEmissive } from '@/scene/lighting'
import { EMISSIVE_PARTS, type PartName } from '@/scene/model/parts'
import { progressStore } from '@/lib/scroll/progress'

const LAMBDA = 6
/** Geteilte Materialien ohne eigene Emission; sie werden nie angefasst. */
const SHARED_MATERIALS = new Set(['surface', 'case'])
const ACCENT_HEX = colors.accent.slice(1).toLowerCase()
const ACCENT_OFFSET_Z = 0.12
const ACCENT_INTENSITY = 0.02
const KEY_INTENSITY = 8

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
  for (const { part, materials, lines } of driven) {
    const goal = partEmissive(part, progress)
    for (const material of materials) {
      material.emissiveIntensity = MathUtils.damp(material.emissiveIntensity, goal, LAMBDA, delta)
    }
    for (const material of lines) {
      material.opacity = Math.min(1, MathUtils.damp(material.opacity, goal, LAMBDA, delta))
    }
  }
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
  })

  return (
    <>
      <ambientLight ref={ambient} intensity={ambientAt(0)} />
      <directionalLight position={[0.3, 0.6, 1]} intensity={KEY_INTENSITY} color="#F4F6F5" />
      <pointLight ref={accent} color={colors.accent} intensity={ACCENT_INTENSITY} distance={0.6} decay={2} />
    </>
  )
}
