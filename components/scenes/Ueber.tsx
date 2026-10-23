import { CONTENT } from '@/content'
import { Kicker, SceneSection } from '@/components/scenes/SceneSection'

export function Ueber() {
  const a = CONTENT.about
  return (
    <SceneSection id="ueber" index={5} side="left">
      {/* Platzhalter bis Task 7 (Portrait mit Foto oder Initialen im Knotenstil). */}
      <div className="portrait" aria-hidden>
        {a.initials}
      </div>
      <Kicker number={a.number} kicker={a.kicker} />
      <h2 id="ueber-title">{a.heading}</h2>
      <div className="prose">
        <p>{a.sentences.join(' ')}</p>
      </div>
    </SceneSection>
  )
}
