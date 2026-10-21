'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { readDeviceSignals, shouldUseStaticFallback } from '@/lib/device/fallback'

const Scene = dynamic(() => import('./Scene'), { ssr: false })

type Mode = '3d' | 'static'

/** Entscheidet einmal beim Mount zwischen 3D-Szene und statischem Modus (StaticStations folgt in Task 19). */
export default function SceneGate() {
  const [mode, setMode] = useState<Mode | null>(null)

  useEffect(() => {
    const next: Mode = shouldUseStaticFallback(readDeviceSignals()) ? 'static' : '3d'
    document.documentElement.dataset.mode = next
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Geräte-Signale sind erst im Browser lesbar
    setMode(next)
  }, [])

  return mode === '3d' ? <Scene /> : null
}
