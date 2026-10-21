import type { Metadata } from 'next'
import { ModelViewerClient } from '@/components/scene/ModelViewerClient'

export const metadata: Metadata = {
  title: 'Modell-Test',
  robots: { index: false, follow: false },
}

export default function DevModelPage() {
  return (
    <main className="w-full">
      <h1 className="sr-only">Modell-Test</h1>
      <ModelViewerClient />
    </main>
  )
}
