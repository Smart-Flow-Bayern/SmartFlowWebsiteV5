'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import type { StationId } from '@/content/types'
import { progressStore } from '@/lib/scroll/progress'
import { activePart } from '@/scene/lighting'
import { preloadComputer } from '@/scene/loadComputer'
import type { PartName } from '@/scene/model/parts'
import { stationAt } from '@/scene/stations'
import CameraRig from './CameraRig'
import Computer from './Computer'

declare global {
  interface Window {
    /** Nur außerhalb der Produktion: Zustand der Szene für Tests. */
    __sf?: {
      progress: number
      activePart: PartName | null
      station: StationId | null
      modelLoaded: boolean
    }
  }
}

const PRELOAD_PROGRESS = 0.02
const IDLE_TIMEOUT_MS = 2500
const IDLE_FALLBACK_MS = 1500
/** Schonfrist vor der Idle-Anfrage; Station 0 bleibt so mindestens diese Zeit ohne glb-Request. */
export const IDLE_GRACE_MS = 800

function syncDebug(modelLoaded: boolean) {
  const p = progressStore.get()
  window.__sf = { progress: p, activePart: activePart(p), station: stationAt(p).id, modelLoaded }
}

/** Streamt das Modell nach Idle oder sobald gescrollt wird (nie im Modul-Scope). */
function usePreload(): boolean {
  const [streaming, setStreaming] = useState(false)
  useEffect(() => {
    let done = false
    const run = () => {
      if (done) return
      done = true
      preloadComputer()
      setStreaming(true)
    }
    const idle = typeof window.requestIdleCallback === 'function'
    let handle = 0
    // Station 0 bleibt zuerst frei: Idle-Anfrage erst nach kurzer Schonfrist.
    const grace = window.setTimeout(() => {
      handle = idle
        ? window.requestIdleCallback(run, { timeout: IDLE_TIMEOUT_MS })
        : window.setTimeout(run, IDLE_FALLBACK_MS)
    }, IDLE_GRACE_MS)
    const unsubscribe = progressStore.subscribe(() => {
      if (progressStore.get() > PRELOAD_PROGRESS) run()
    })
    if (progressStore.get() > PRELOAD_PROGRESS) run()
    return () => {
      unsubscribe()
      window.clearTimeout(grace)
      if (idle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
    }
  }, [])
  return streaming
}

function useDebugState() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return
    syncDebug(false)
    const unsubscribe = progressStore.subscribe(() => {
      if (window.__sf) syncDebug(window.__sf.modelLoaded)
    })
    return () => {
      unsubscribe()
      delete window.__sf
    }
  }, [])
}

export default function Scene() {
  // Computer suspendiert sofort beim Mount, daher erst nach dem Preload-Trigger rendern.
  const streaming = usePreload()
  useDebugState()

  return (
    <Canvas
      aria-hidden
      onCreated={({ gl }) => gl.domElement.setAttribute('aria-hidden', 'true')}
      frameloop="always"
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      camera={{ fov: 40, near: 0.01, far: 20 }}
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    >
      <CameraRig />
      <Suspense fallback={null}>{streaming && <Computer />}</Suspense>
    </Canvas>
  )
}
