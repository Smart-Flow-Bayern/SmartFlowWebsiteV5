import type { ReactNode } from 'react'
import { CONTENT } from '@/content'
import type { SceneId } from '@/content/types'

export type SceneSide = 'left' | 'right' | 'center'

/** Einzige Stelle für das Section-Markup einer Szene. Überschrift trägt die id `{id}-title`. */
export function SceneSection({
  id,
  index,
  side,
  children,
}: {
  id: SceneId
  index: number
  side: SceneSide
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scene" data-scene={index} data-side={side}>
      <div className="scene-text">{children}</div>
    </section>
  )
}

/** Nummer und Stichwort über der Überschrift; ohne Nummer nur das Stichwort. */
export function Kicker({ number, kicker }: { number: string; kicker: string }) {
  return (
    <p className="kicker">
      {number ? (
        <>
          <b>{number}</b>{' '}
        </>
      ) : null}
      {kicker}
    </p>
  )
}

/**
 * Der englische Claim (Szene 01 und 06). Den deutschen Untertitel trägt nur Szene 01 (Spec Abschnitt 4);
 * in Kontakt stünde derselbe Satz sonst ein zweites Mal auf der Seite.
 */
export function Claim({ subtitle = true }: { subtitle?: boolean }) {
  const { claim } = CONTENT
  return (
    <>
      <p className="claim" lang="en">
        {claim.text}
      </p>
      {subtitle ? <p className="claim-sub">{claim.subtitle}</p> : null}
    </>
  )
}
