import { ScrollProvider } from '@/components/scroll/ScrollProvider'
import { SCROLL_HEIGHTS } from '@/scene/stations'

export default function Home() {
  return (
    <ScrollProvider>
      <main id="stage" style={{ height: '100svh' }} />
      <div aria-hidden style={{ height: `calc(${SCROLL_HEIGHTS - 1} * 100svh)` }} />
    </ScrollProvider>
  )
}
