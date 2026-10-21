import { ScrollProvider } from '@/components/scroll/ScrollProvider'
import { Station0 } from '@/components/stations/Station0'
import { SCROLL_HEIGHTS } from '@/scene/stations'

export default function Home() {
  return (
    <ScrollProvider>
      <main id="stage" style={{ height: '100svh' }}>
        <Station0 />
      </main>
      <div aria-hidden style={{ height: `calc(${SCROLL_HEIGHTS - 1} * 100svh)` }} />
    </ScrollProvider>
  )
}
