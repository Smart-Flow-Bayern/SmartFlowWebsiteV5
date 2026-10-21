'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useLayoutEffect } from 'react'
import type { StationId } from '@/content/types'
import { progressStore } from '@/lib/scroll/progress'
import { backgroundAt } from '@/scene/lighting'
import { preloadComputer } from '@/scene/loadComputer'
import { stationWindow } from '@/scene/stations'
import CameraRig from './CameraRig'
import Computer from './Computer'
import { useDebugState } from './Scene'

/** Ende des Parkfensters: Kamera steht exakt, alle Reveals und Animationen sind im Endzustand. */
function poseProgress(station: StationId): number {
  const { start, end } = stationWindow(station)
  return start + 0.85 * (end - start)
}

/** Dev-Seite für scripts/render-stations.ts: Szene stehend in der Pose einer Station, ohne Overlays. */
export default function PoseViewer({ station }: { station: StationId }) {
  const progress = poseProgress(station)
  useLayoutEffect(() => {
    progressStore.set(progress)
    preloadComputer()
  }, [progress])
  useDebugState()

  return (
    <div style={{ position: 'fixed', inset: 0, background: backgroundAt(progress) }}>
      <Canvas
        aria-hidden
        frameloop="always"
        dpr={1}
        gl={{ alpha: true, antialias: true }}
        camera={{ fov: 40, near: 0.01, far: 20 }}
      >
        <CameraRig />
        <Suspense fallback={null}>
          <Computer />
        </Suspense>
      </Canvas>
    </div>
  )
}
