'use client'

import { useEffect, useState } from 'react'
import { useContent } from '@/components/content/ContentProvider'
import { scrollToScene } from '@/components/scroll/ScrollProvider'
import type { SceneId } from '@/content/types'
import { useActiveScene } from '@/lib/scroll/progress'
import { SCENES } from '@/scene/process/scenes'

type NumberedId = Exclude<SceneId, 'ueber'>

/** Die sechs nummerierten Szenen; Über hat keine Nummer und zählt in der Anzeige zu Wachstum. */
const STEPS = SCENES.filter((s): s is (typeof SCENES)[number] & { id: NumberedId } => s.id !== 'ueber')

const stepOf = (index: number): NumberedId => {
  const id = (SCENES[index] ?? SCENES[0]).id
  return id === 'ueber' ? 'wachstum' : id
}

/** true, solange der Footer im Viewport liegt: dann blendet die Fortschrittsanzeige aus. */
function useFooterVisible(): boolean {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const footer = document.querySelector('footer.site-footer')
    if (!footer || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])
  return visible
}

/**
 * Unter 1600 px nur Balken in der Randspalte (Beschriftung bleibt für Screenreader im DOM), ab 1600 px mit
 * sichtbarer Beschriftung (globals.css).
 */
export function ProgressNav() {
  const content = useContent()
  const active = stepOf(useActiveScene())
  const footerVisible = useFooterVisible()
  return (
    <nav aria-label={content.nav.progressLabel} className="progress-nav" data-hidden={footerVisible ? 'true' : undefined}>
      <ol>
        {STEPS.map(({ id, slug }) => {
          const scene = content.scenes[id]
          return (
            <li key={id}>
              <a
                href={`#${slug}`}
                aria-current={id === active ? 'step' : undefined}
                tabIndex={footerVisible ? -1 : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  scrollToScene(id)
                  history.replaceState(null, '', `#${slug}`)
                }}
              >
                <span className="progress-label">
                  <b>{scene.number}</b> {scene.kicker}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
