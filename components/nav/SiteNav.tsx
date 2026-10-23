'use client'

import { Wordmark } from '@/components/brand/Wordmark'
import { useContent } from '@/components/content/ContentProvider'
import { SCENE_IDS, type SceneId } from '@/content/types'
import { wordmarkVariant } from '@/lib/brand/tokens'

/** Anker je Szene: die erste Szene heißt in der URL `#start`, alle anderen wie ihre ID. */
const slugOf = (id: SceneId): string => (id === 'komplexitaet' ? 'start' : id)

/** Zwischenstand bis Task 5: reine Anker-Links, keine Scroll-Logik. */
export function SiteNav() {
  const content = useContent()
  return (
    <header className="nav-bar">
      <a href="#start" aria-label={content.nav.homeLabel} className="nav-link nav-brand">
        <Wordmark variant={wordmarkVariant} size={24} decorative />
      </a>
      <nav aria-label={content.nav.scenesLabel} className="nav-scenes">
        {SCENE_IDS.map((id) => (
          <a key={id} href={`#${slugOf(id)}`} className="nav-link nav-scene">
            {content.nav.labels[id]}
          </a>
        ))}
      </nav>
      <a className="btn" href="#kontakt">
        {content.nav.cta}
      </a>
    </header>
  )
}
