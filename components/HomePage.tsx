'use client'

import { SiteNav } from '@/components/nav/SiteNav'
import { ScrollProvider } from '@/components/scroll/ScrollProvider'
import SceneGate from '@/components/scene/SceneGate'
import { StaticStations } from '@/components/static/StaticStations'
import { About } from '@/components/stations/About'
import { Station0 } from '@/components/stations/Station0'
import { Station1Mainboard } from '@/components/stations/Station1Mainboard'
import { StationCpu } from '@/components/stations/StationCpu'
import { StationGpu } from '@/components/stations/StationGpu'
import { StationRam } from '@/components/stations/StationRam'
import { StationContact } from '@/components/stations/StationContact'
import { StationSsd } from '@/components/stations/StationSsd'
import { useMode } from '@/lib/device/mode'
import { SCROLL_HEIGHTS } from '@/scene/stations'

/**
 * ScrollTrigger hüllt #stage beim Pinnen in einen Pin-Spacer. Der Wrapper-div ist deshalb das Element,
 * das React beim Umschalten in den statischen Modus entfernt (sonst wirft removeChild).
 */
function ScrollLayout() {
  return (
    <div>
      <ScrollProvider>
        <main id="stage" style={{ height: '100svh', position: 'relative', zIndex: 1 }}>
          <Station0 />
          <Station1Mainboard />
          <About />
          <StationCpu />
          <StationRam />
          <StationGpu />
          <StationSsd />
          <StationContact />
        </main>
        <div aria-hidden style={{ height: `calc(${SCROLL_HEIGHTS - 1} * 100svh)` }} />
      </ScrollProvider>
    </div>
  )
}

export function HomePage() {
  const mode = useMode()
  return (
    <>
      {/* Zuerst im DOM: Tab-Reihenfolge beginnt in der Navigation (fixed, optisch unverändert). */}
      <SiteNav />
      {mode === 'static' ? <StaticStations /> : <ScrollLayout />}
      {/* Nach #stage: ScrollTrigger hüllt #stage beim Pinnen um, Einfügen davor bräche React. */}
      <SceneGate />
    </>
  )
}
