'use client'

import dynamic from 'next/dynamic'
import type { StationId } from '@/content/types'

// `ssr: false` ist nur in Client-Komponenten erlaubt; WebGL gibt es erst im Browser.
const PoseViewer = dynamic(() => import('./PoseViewer'), { ssr: false })

export function PoseViewerClient({ station }: { station: StationId }) {
  return <PoseViewer station={station} />
}
