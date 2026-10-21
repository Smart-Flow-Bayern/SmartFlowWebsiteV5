import { ScrollProvider } from '@/components/scroll/ScrollProvider'
import SceneGate from '@/components/scene/SceneGate'
import { About } from '@/components/stations/About'
import { Station0 } from '@/components/stations/Station0'
import { Station1Mainboard } from '@/components/stations/Station1Mainboard'
import { StationCpu } from '@/components/stations/StationCpu'
import { StationGpu } from '@/components/stations/StationGpu'
import { StationRam } from '@/components/stations/StationRam'
import { StationSsd } from '@/components/stations/StationSsd'
import { SCROLL_HEIGHTS } from '@/scene/stations'

export default function Home() {
  return (
    <ScrollProvider>
      <main id="stage" style={{ height: '100svh', position: 'relative', zIndex: 1 }}>
        <Station0 />
        <Station1Mainboard />
        <About />
        <StationCpu />
        <StationRam />
        <StationGpu />
        <StationSsd />
      </main>
      <div aria-hidden style={{ height: `calc(${SCROLL_HEIGHTS - 1} * 100svh)` }} />
      {/* Nach #stage: ScrollTrigger hüllt #stage beim Pinnen um, Einfügen davor bräche React. */}
      <SceneGate />
    </ScrollProvider>
  )
}
