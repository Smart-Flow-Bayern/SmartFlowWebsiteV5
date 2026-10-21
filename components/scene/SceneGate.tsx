'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { readDeviceSignals, shouldUseStaticFallback } from '@/lib/device/fallback'
import { modeStore, useMode } from '@/lib/device/mode'

const Scene = dynamic(() => import('./Scene'), { ssr: false })

/** Entscheidet einmal beim Mount zwischen 3D-Szene und statischem Modus; spätere Wechsel kommen über switchToStatic(). */
export default function SceneGate() {
  const mode = useMode()

  useEffect(() => {
    modeStore.set(shouldUseStaticFallback(readDeviceSignals()) ? 'static' : '3d')
  }, [])

  return mode === '3d' ? <Scene /> : null
}
