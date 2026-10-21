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
import { STATIONS } from '@/scene/stations'

function StationImage({ index }: { index: number }) {
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={`/stations/station-${index}-mobile.webp`} />
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
    if (!station) return
    const slug = STATIONS.find((s) => s.id === station)?.slug
    if (slug) document.getElementById(slug)?.scrollIntoView({ block: 'start' })
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
        <div key={id} id={slug} className="static-station">
          <StationImage index={index} />
          <div className="static-station-text">{bodies[index]}</div>
        </div>
      ))}
    </main>
  )
}
