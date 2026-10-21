'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { MathUtils, MeshStandardMaterial, type Material, type Mesh } from 'three'
import { useComputer } from '@/scene/loadComputer'
import Lights from './Lights'

const FADE_SECONDS = 0.6
/** Der erste Frame nach dem Laden hat ein großes delta; ohne Klemme wäre die Einblendung übersprungen. */
const MAX_FADE_STEP = 0.1

/**
 * Nur Mesh-Materialien (MeshStandardMaterial) werden eingeblendet. Die Traces
 * (LineBasicMaterial) bleiben unangetastet: Lights treibt ihre Opacity als
 * Emissions-Ersatz und hält sie dauerhaft transparent; sie starten ohnehin nahe 0.
 */
function fadeTargets(root: Mesh['parent']): { material: MeshStandardMaterial; wasTransparent: boolean }[] {
  const found = new Map<Material, boolean>()
  root?.traverse((object) => {
    const raw = (object as Mesh).material as Material | Material[] | undefined
    for (const material of Array.isArray(raw) ? raw : raw ? [raw] : []) {
      if (material instanceof MeshStandardMaterial && !found.has(material)) {
        found.set(material, material.transparent)
      }
    }
  })
  return [...found].map(([material, wasTransparent]) => ({
    material: material as MeshStandardMaterial,
    wasTransparent,
  }))
}

function setFade(targets: ReturnType<typeof fadeTargets>, f: number) {
  for (const { material, wasTransparent } of targets) {
    material.transparent = f < 1 || wasTransparent
    material.opacity = f
    material.needsUpdate = true
  }
}

/** Das Modell blendet beim ersten Frame nach dem Laden über 600 ms ein. */
export default function Computer() {
  const { scene } = useComputer()
  const fade = useRef(0)
  const targets = useMemo(() => fadeTargets(scene), [scene])

  useEffect(() => {
    setFade(targets, 0)
  }, [targets])

  useFrame((_, delta) => {
    if (fade.current >= 1) return
    fade.current = Math.min(1, fade.current + Math.min(delta, MAX_FADE_STEP) / FADE_SECONDS)
    setFade(targets, MathUtils.smoothstep(fade.current, 0, 1))
  })

  useEffect(() => {
    if (window.__sf) window.__sf.modelLoaded = true
  }, [])

  return (
    <>
      <primitive object={scene} />
      <Lights computer={scene} />
    </>
  )
}
