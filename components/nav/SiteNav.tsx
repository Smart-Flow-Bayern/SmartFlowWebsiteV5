'use client'

import { Wordmark } from '@/components/brand/Wordmark'
import { scrollToStation } from '@/components/scroll/ScrollProvider'
import { useContent } from '@/components/content/ContentProvider'
import { wordmarkVariant } from '@/lib/brand/tokens'
import { useMode } from '@/lib/device/mode'
import { useProgressSelector } from '@/lib/scroll/progress'
import { STATIONS, stationAt } from '@/scene/stations'

const SCROLLED_AFTER = 0.05

/** Fokus erst setzen, wenn die Station nicht mehr inert ist (Overlay blendet nach der Fahrt ein). Max. 3 s. */
function focusWhenReady(elementId: string, stationId = 'kontakt'): void {
  const until = performance.now() + 3000
  const step = () => {
    const station = document.getElementById(stationId)
    const target = document.getElementById(elementId)
    if (station && target && !station.hasAttribute('inert')) {
      target.focus({ preventScroll: true })
      return
    }
    if (performance.now() < until) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export function SiteNav() {
  const content = useContent()
  const activeId = useProgressSelector((p) => stationAt(p).id)
  const scrolledByProgress = useProgressSelector((p) => p > SCROLLED_AFTER)
  const staticMode = useMode() === 'static'
  const scrolled = staticMode || scrolledByProgress

  return (
    <header className="nav-bar" data-scrolled={scrolled}>
      <a
        href="#start"
        aria-label={content.nav.homeLabel}
        className="nav-link nav-brand"
        onClick={(event) => {
          if (staticMode) return
          event.preventDefault()
          scrollToStation('gehaeuse')
          history.replaceState(null, '', '#start')
        }}
      >
        <Wordmark variant={wordmarkVariant} size={24} decorative />
      </a>
      <nav aria-label={content.nav.stationsLabel} className="nav-stations">
        {STATIONS.map(({ id, slug }) => (
          <a
            key={id}
            href={`#${slug}`}
            aria-label={content.nav.labels[id]}
            aria-current={!staticMode && id === activeId ? 'true' : undefined}
            className="nav-link nav-station"
            onClick={(event) => {
              if (staticMode) return
              event.preventDefault()
              scrollToStation(id)
              history.replaceState(null, '', `#${slug}`)
            }}
          >
            <span className="nav-dot" aria-hidden="true" />
            <span className="nav-label" aria-hidden="true">
              {content.nav.labels[id]}
            </span>
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="nav-link nav-cta"
        onClick={() => {
          if (staticMode) {
            location.hash = '#kontakt'
            document.getElementById('kontakt-title')?.focus({ preventScroll: true })
            return
          }
          scrollToStation('kontakt')
          focusWhenReady('kontakt-title')
        }}
      >
        {content.nav.cta}
      </button>
    </header>
  )
}
