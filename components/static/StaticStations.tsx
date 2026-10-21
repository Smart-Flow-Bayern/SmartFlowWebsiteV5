'use client'

import { Fragment, useEffect, type ReactNode } from 'react'
import { Wordmark } from '@/components/brand/Wordmark'
import { useContent } from '@/components/content/ContentProvider'
import { About } from '@/components/stations/About'
import { Station1Mainboard } from '@/components/stations/Station1Mainboard'
import { StationContact } from '@/components/stations/StationContact'
import { StationCpu } from '@/components/stations/StationCpu'
import { StationGpu } from '@/components/stations/StationGpu'
import { StationRam } from '@/components/stations/StationRam'
import { StationSsd } from '@/components/stations/StationSsd'
import { wordmarkVariant } from '@/lib/brand/tokens'
import { lastStation } from '@/lib/device/mode'
import { resolveStationSlug } from '@/lib/scroll/hash'
import { CaseSilhouette } from '@/components/stations/CaseSilhouette'
import { STATIONS } from '@/scene/stations'

function StationImage({ index }: { index: number }) {
  return (
    <picture>
      <source media="(max-width: 768px)" width={800} height={1200} srcSet={`/stations/station-${index}-mobile.webp`} />
      <img
        src={`/stations/station-${index}.webp`}
        width={1600}
        height={1000}
        alt=""
        loading={index === 0 ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  )
}

function Intro() {
  const content = useContent()
  return (
    <section id="gehaeuse" aria-labelledby="station0-title" className="station-static station-static--intro">
      <div className="station-overlay-body">
        <Wordmark variant={wordmarkVariant} size={32} />
        <h1 id="station0-title" className="station-title">
          {content.station0.sentence}
        </h1>
      </div>
    </section>
  )
}

/** Statischer Modus: gerenderte Standbilder und dieselben Station-Texte im normalen Dokumentfluss. */
export function StaticStations() {
  useEffect(() => {
    const station = lastStation()
    let id: string | undefined
    if (station) {
      id = STATIONS.find((s) => s.id === station)?.slug
    } else if (location.hash.length > 1) {
      // Deep Link: SSR rendert das Scroll-Layout, der Browser findet den Anker erst nach dem Umschalten.
      try {
        const decoded = decodeURIComponent(location.hash.slice(1))
        // Alte v3-Anker (#contact usw.) wie im 3D-Modus auf die Station abbilden.
        id = resolveStationSlug(decoded)?.slug ?? decoded
      } catch {
        return
      }
    }
    if (id) document.getElementById(id)?.scrollIntoView({ block: 'start' })
  }, [])

  const bodies: ReactNode[] = [
    <Intro key="gehaeuse" />,
    <Fragment key="mainboard">
      <Station1Mainboard />
      <About />
    </Fragment>,
    <StationCpu key="cpu" />,
    <StationRam key="ram" />,
    <StationGpu key="gpu" />,
    <StationSsd key="ssd" />,
    <StationContact key="kontakt" />,
  ]

  return (
    <main className="static-stations">
      {STATIONS.map(({ id, slug }, index) => (
        // Bei slug === id (kontakt) trägt schon die Sektion den Anker; doppelte ids vermeiden.
        <div key={id} id={slug === id ? undefined : slug} className="static-station">
          {index === 0 ? (
            <div className="static-silhouette" aria-hidden="true">
              <CaseSilhouette />
            </div>
          ) : (
            <StationImage index={index} />
          )}
          <div className="static-station-text">{bodies[index]}</div>
        </div>
      ))}
    </main>
  )
}
