'use client'

import dynamic from 'next/dynamic'

// `ssr: false` ist nur in Client-Komponenten erlaubt; WebGL gibt es erst im Browser.
const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false })

export function ModelViewerClient() {
  return <ModelViewer />
}
