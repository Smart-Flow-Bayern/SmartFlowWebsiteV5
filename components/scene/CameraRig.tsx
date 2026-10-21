'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils, Vector3, type PerspectiveCamera } from 'three'
import { progressStore } from '@/lib/scroll/progress'
import { cameraPose, type Pose } from '@/scene/camera'

const LAMBDA = 6
const FOV_EPSILON = 0.01

/** Führt die Kamera mit gedämpfter Folge entlang des Scrollpfads. */
export default function CameraRig() {
  const pose = useRef<Pose>({ position: [0, 0, 0], target: [0, 0, 0], fov: 0 })
  const target = useRef(new Vector3())
  const initialised = useRef(false)

  useFrame((frame, delta) => {
    const camera = frame.camera as PerspectiveCamera
    const goal = cameraPose(progressStore.get(), pose.current)
    const look = target.current
    if (!initialised.current) {
      camera.position.set(...goal.position)
      look.set(...goal.target)
      initialised.current = true
    } else {
      camera.position.set(
        MathUtils.damp(camera.position.x, goal.position[0], LAMBDA, delta),
        MathUtils.damp(camera.position.y, goal.position[1], LAMBDA, delta),
        MathUtils.damp(camera.position.z, goal.position[2], LAMBDA, delta),
      )
      look.set(
        MathUtils.damp(look.x, goal.target[0], LAMBDA, delta),
        MathUtils.damp(look.y, goal.target[1], LAMBDA, delta),
        MathUtils.damp(look.z, goal.target[2], LAMBDA, delta),
      )
    }
    camera.lookAt(look)
    const fov = initialised.current ? MathUtils.damp(camera.fov, goal.fov, LAMBDA, delta) : goal.fov
    if (Math.abs(fov - camera.fov) > FOV_EPSILON) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  })

  return null
}
