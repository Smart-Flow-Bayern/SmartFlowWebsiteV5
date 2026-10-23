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

/** Der englische Claim mit deutschem Untertitel (Szene 01 und 06). */
export function Claim() {
  const { claim } = CONTENT
  return (
    <>
      <p className="claim" lang="en">
        {claim.text}
      </p>
      <p className="claim-sub">{claim.subtitle}</p>
    </>
  )
}
