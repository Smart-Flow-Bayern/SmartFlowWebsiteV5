'use client'

import { Wordmark } from '@/components/brand/Wordmark'
import { scrollToStation } from '@/components/scroll/ScrollProvider'
import { de } from '@/content/de'
import { wordmarkVariant } from '@/lib/brand/tokens'
import { useProgressSelector } from '@/lib/scroll/progress'
import { STATIONS, stationAt } from '@/scene/stations'

const SCROLLED_AFTER = 0.05

export function SiteNav() {
  const activeId = useProgressSelector((p) => stationAt(p).id)
  const scrolled = useProgressSelector((p) => p > SCROLLED_AFTER)

  return (
    <header className="nav-bar" data-scrolled={scrolled}>
      <a
        href="#start"
        aria-label="Smart Flow – zum Anfang"
        className="nav-link nav-brand"
        onClick={(event) => {
          event.preventDefault()
          scrollToStation('gehaeuse')
          history.replaceState(null, '', '#start')
        }}
      >
        <Wordmark variant={wordmarkVariant} size={24} decorative />
      </a>
      <nav aria-label="Stationen" className="nav-stations">
        {STATIONS.map(({ id, slug }) => (
          <a
            key={id}
            href={`#${slug}`}
            aria-label={de.nav.labels[id]}
            aria-current={id === activeId ? 'true' : undefined}
            className="nav-link nav-station"
            onClick={(event) => {
              event.preventDefault()
              scrollToStation(id)
              history.replaceState(null, '', `#${slug}`)
            }}
          >
            <span className="nav-dot" aria-hidden="true" />
            <span className="nav-label" aria-hidden="true">
              {de.nav.labels[id]}
            </span>
          </a>
        ))}
      </nav>
      <button type="button" className="nav-link nav-cta" onClick={() => scrollToStation('kontakt')}>
        {de.nav.cta}
      </button>
    </header>
  )
}
