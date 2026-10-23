'use client'

import { Wordmark } from '@/components/brand/Wordmark'
import { useContent } from '@/components/content/ContentProvider'
import { scrollToScene } from '@/components/scroll/ScrollProvider'
import { wordmarkVariant } from '@/lib/brand/tokens'
import { progressStore, useActiveScene } from '@/lib/scroll/progress'
import { SCENES, sceneAt } from '@/scene/process/scenes'

/** Fokus auf die Kontakt-Überschrift, sobald die Fahrt in der Kontakt-Szene angekommen ist. Höchstens 3 s. */
function focusOnArrival(elementId: string): void {
  const until = performance.now() + 3000
  const step = () => {
    const target = document.getElementById(elementId)
    if (target && sceneAt(progressStore.get()).id === 'kontakt') {
      target.focus({ preventScroll: true })
      return
    }
    if (performance.now() < until) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

export function SiteNav() {
  const content = useContent()
  const activeId = (SCENES[useActiveScene()] ?? SCENES[0]).id
  return (
    <header className="nav-bar">
      <a
        href="#start"
        aria-label={content.nav.homeLabel}
        className="nav-link nav-brand"
        onClick={(event) => {
          event.preventDefault()
          scrollToScene('komplexitaet')
          history.replaceState(null, '', '#start')
        }}
      >
        <Wordmark variant={wordmarkVariant} size={24} decorative />
      </a>
      <nav aria-label={content.nav.scenesLabel} className="nav-scenes">
        {SCENES.map(({ id, slug }) => (
          <a
            key={id}
            href={`#${slug}`}
            aria-current={id === activeId ? 'true' : undefined}
            className="nav-link nav-scene"
            onClick={(event) => {
              event.preventDefault()
              scrollToScene(id)
              history.replaceState(null, '', `#${slug}`)
            }}
          >
            {content.nav.labels[id]}
          </a>
        ))}
      </nav>
      <a
        className="btn nav-cta"
        href="#kontakt"
        onClick={(event) => {
          event.preventDefault()
          scrollToScene('kontakt')
          history.replaceState(null, '', '#kontakt')
          focusOnArrival('kontakt-title')
        }}
      >
        {content.nav.cta}
      </a>
    </header>
  )
}
