import { Portrait } from '@/components/about/Portrait'
import { CONTENT } from '@/content'
import { Kicker, SceneSection } from '@/components/scenes/SceneSection'

export function Ueber() {
  const a = CONTENT.about
  return (
    <SceneSection id="ueber" index={5} side="left">
      <Portrait initials={a.initials} alt={a.photoAlt} />
      <Kicker number={a.number} kicker={a.kicker} />
      <h2 id="ueber-title">{a.heading}</h2>
      <div className="prose">
        <p>{a.sentences.join(' ')}</p>
      </div>
    </SceneSection>
  )
}
