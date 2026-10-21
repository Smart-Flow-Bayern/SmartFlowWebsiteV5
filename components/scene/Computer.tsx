'use client'

import { useFrame } from '@react-three/fiber'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import {
  CurvePath,
  CylinderGeometry,
  LineCurve3,
  Mesh,
  MathUtils,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  Vector3,
  type Material,
  type Object3D,
} from 'three'
import { colors } from '@/lib/brand/tokens'
import { progressStore } from '@/lib/scroll/progress'
import { cableInsert, coolerLift, fanSpeed, sidePanelOffset, traceImpulse } from '@/scene/animations'
import { useComputer } from '@/scene/loadComputer'
import { IMPULSE_TRACE } from '@/scene/model/layout'
import Lights from './Lights'

const FADE_SECONDS = 0.6
/** Der erste Frame nach dem Laden hat ein großes delta; ohne Klemme wäre die Einblendung übersprungen. */
const MAX_FADE_STEP = 0.1

const COOLER_LIFT_Z = 0.04
const COOLER_LIFT_Y = 0.12
const CABLE_LENGTH = 0.25
const CABLE_START_OFFSET = 0.3
/** Das Kabel steckt nicht in der Mitte des Slots, sondern an dessen Öffnung (+x). */
const CABLE_X_OFFSET = 0.004
const IMPULSE_RADIUS = 0.004

/** Größter Schritt der Lüfter-Integration; ein Tab-Wechsel soll die Lüfter nicht springen lassen. */
const MAX_FAN_STEP = 0.1

/**
 * Ruheposition eines Teils. Das glb-Modell ist zwischen Mounts geteilt (HMR, Moduswechsel) und bereits
 * verschoben; deshalb wird die Ruhe einmal in `userData.rest` abgelegt und danach von dort gelesen.
 */
function rest(object: Object3D | undefined) {
  if (!object) return { object, x: 0, y: 0, z: 0 }
  const saved = (object.userData.rest ??= { x: object.position.x, y: object.position.y, z: object.position.z }) as {
    x: number
    y: number
    z: number
  }
  return { object, ...saved }
}

/** Kabel (Zylinder auf z) samt Stecker, Ziel ist `ioSlot_cable`; Slot-Position aus den lokalen Koordinaten, ohne Weltmatrix. */
function buildCable(scene: Object3D) {
  const slot = scene.getObjectByName('ioSlot_cable')
  const panel = scene.getObjectByName('ioPanel')
  const geometry = new CylinderGeometry(0.003, 0.003, CABLE_LENGTH, 12)
  geometry.rotateX(Math.PI / 2)
  const cable = new Mesh(geometry, new MeshStandardMaterial({ name: 'cable', color: colors.surface, roughness: 0.6, metalness: 0.3 }))
  cable.name = 'cable'
  cable.visible = false
  const plugGeometry = new CylinderGeometry(0.0045, 0.0045, 0.012, 12)
  plugGeometry.rotateX(Math.PI / 2)
  plugGeometry.translate(0, 0, -CABLE_LENGTH / 2 + 0.006)
  cable.add(new Mesh(plugGeometry, new MeshStandardMaterial({ name: 'cablePlug', color: colors.accent, roughness: 0.5 })))
  const origin = new Vector3(
    (panel?.position.x ?? 0) + (slot?.position.x ?? 0) + CABLE_X_OFFSET,
    (panel?.position.y ?? 0) + (slot?.position.y ?? 0),
    (panel?.position.z ?? 0) + (slot?.position.z ?? 0) + CABLE_LENGTH / 2,
  )
  cable.position.copy(origin)
  return { cable, origin }
}

function buildImpulse() {
  const curve = new CurvePath<Vector3>()
  for (let i = 0; i < IMPULSE_TRACE.length - 1; i++) {
    curve.add(new LineCurve3(new Vector3(...IMPULSE_TRACE[i]), new Vector3(...IMPULSE_TRACE[i + 1])))
  }
  const sphere = new Mesh(
    new SphereGeometry(IMPULSE_RADIUS, 12, 8),
    new MeshBasicMaterial({ color: colors.accent, toneMapped: false }),
  )
  sphere.name = 'impulse'
  sphere.visible = false
  return { curve, sphere }
}

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

interface Rig {
  sidePanel: ReturnType<typeof rest>
  cooler: ReturnType<typeof rest>
  fans: Object3D[]
  fanAngle: number
  cable: Mesh
  cableZ: number
  curve: CurvePath<Vector3>
  sphere: Mesh
  scratch: Vector3
}

function buildRig(scene: Object3D): Rig {
  const { cable, origin } = buildCable(scene)
  return {
    sidePanel: rest(scene.getObjectByName('sidePanel')),
    cooler: rest(scene.getObjectByName('cpuCooler')),
    fans: [0, 1].flatMap((i) => scene.getObjectByName(`gpuFan_${i}`) ?? []),
    fanAngle: scene.getObjectByName('gpuFan_0')?.rotation.y ?? 0,
    cable,
    cableZ: origin.z,
    ...buildImpulse(),
    scratch: new Vector3(),
  }
}

/** Setzt alle scrollgetriebenen Bauteile auf den Zustand zu `progress`. Läuft pro Frame, ohne Allokation. */
function animate(rig: Rig, progress: number, delta: number, impulseVisible: boolean) {
  const { sidePanel, cooler, fans, cable, curve, sphere } = rig
  if (sidePanel.object) sidePanel.object.position.x = sidePanel.x + sidePanelOffset(progress)
  if (cooler.object) {
    const lift = coolerLift(progress)
    cooler.object.position.z = cooler.z + COOLER_LIFT_Z * lift
    cooler.object.position.y = cooler.y + COOLER_LIFT_Y * lift
  }
  rig.fanAngle += fanSpeed(progress) * Math.min(delta, MAX_FAN_STEP)
  for (const fan of fans) fan.rotation.y = rig.fanAngle
  const insert = cableInsert(progress)
  cable.visible = insert > 0
  cable.position.z = rig.cableZ + MathUtils.lerp(CABLE_START_OFFSET, 0, insert)
  sphere.position.copy(curve.getPointAt(traceImpulse(progress), rig.scratch))
  sphere.visible = impulseVisible
}

/** Das Modell blendet beim ersten Frame nach dem Laden über 600 ms ein. */
export default function Computer() {
  const { scene } = useComputer()
  const fade = useRef(0)
  const targets = useMemo(() => fadeTargets(scene), [scene])

  useLayoutEffect(() => {
    setFade(targets, 0)
  }, [targets])

  const rig = useMemo(() => buildRig(scene), [scene])

  useFrame((_, delta) => {
    animate(rig, progressStore.get(), delta, fade.current >= 1)

    if (fade.current >= 1) return
    fade.current = Math.min(1, fade.current + Math.min(delta, MAX_FADE_STEP) / FADE_SECONDS)
    setFade(targets, MathUtils.smoothstep(fade.current, 0, 1))
  })

  useEffect(() => {
    const { cable, sphere } = rig
    return () => {
      for (const mesh of [cable, ...cable.children, sphere] as Mesh[]) {
        mesh.geometry.dispose()
        ;(mesh.material as Material).dispose()
      }
    }
  }, [rig])

  useEffect(() => {
    if (window.__sf) window.__sf.modelLoaded = true
  }, [])

  return (
    <>
      <primitive object={scene} />
      <primitive object={rig.cable} />
      <primitive object={rig.sphere} />
      <Lights computer={scene} />
    </>
  )
}
