'use client'

import { useContent } from '@/components/content/ContentProvider'
import { scrollToScene } from '@/components/scroll/ScrollProvider'
import type { SceneId } from '@/content/types'
import { useProgressSelector } from '@/lib/scroll/progress'
import { SCENES, sceneAt } from '@/scene/process/scenes'

type NumberedId = Exclude<SceneId, 'ueber'>

/** Die sechs nummerierten Szenen; Über hat keine Nummer und zählt in der Anzeige zu Wachstum. */
const STEPS = SCENES.filter((s): s is (typeof SCENES)[number] & { id: NumberedId } => s.id !== 'ueber')

const activeStep = (p: number): NumberedId => {
  const id = sceneAt(p).id
  return id === 'ueber' ? 'wachstum' : id
}

export function ProgressNav() {
  const content = useContent()
  const active = useProgressSelector(activeStep)
  return (
    <nav aria-label={content.nav.progressLabel} className="progress-nav">
      <ol>
        {STEPS.map(({ id, slug }) => {
          const scene = content.scenes[id]
          return (
            <li key={id}>
              <a
                href={`#${slug}`}
                aria-current={id === active ? 'step' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  scrollToScene(id)
                  history.replaceState(null, '', `#${slug}`)
                }}
              >
                <b>{scene.number}</b> {scene.kicker}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
