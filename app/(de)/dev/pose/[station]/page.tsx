import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PoseViewerClient } from '@/components/scene/PoseViewerClient'
import { STATIONS } from '@/scene/stations'

interface Props {
  params: Promise<{ station: string }>
}

export function generateStaticParams() {
  return STATIONS.map(({ id }) => ({ station: id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { station } = await params
  return { title: `Pose ${station}`, robots: { index: false, follow: false } }
}

export default async function PosePage({ params }: Props) {
  const { station } = await params
  const found = STATIONS.find((s) => s.id === station)
  if (!found) notFound()
  return (
    <main>
      <h1 className="sr-only">Pose {found.id}</h1>
      <PoseViewerClient station={found.id} />
    </main>
  )
}
