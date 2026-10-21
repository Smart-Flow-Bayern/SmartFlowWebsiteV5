import { ScrollProvider } from '@/components/scroll/ScrollProvider'
import SceneGate from '@/components/scene/SceneGate'
import { Station0 } from '@/components/stations/Station0'
import { SCROLL_HEIGHTS } from '@/scene/stations'

export default function Home() {
  return (
    <ScrollProvider>
      <main id="stage" style={{ height: '100svh', position: 'relative', zIndex: 1 }}>
        <Station0 />
      </main>
      <div aria-hidden style={{ height: `calc(${SCROLL_HEIGHTS - 1} * 100svh)` }} />
      {/* Nach #stage: ScrollTrigger hüllt #stage beim Pinnen um, Einfügen davor bräche React. */}
      <SceneGate />
    </ScrollProvider>
  )
}
