import { CONTENT } from '@/content'
import { Kicker, SceneSection } from '@/components/scenes/SceneSection'

export function Analyse() {
  const s = CONTENT.scenes.analyse
  return (
    <SceneSection id="analyse" index={1} side="right">
      <Kicker number={s.number} kicker={s.kicker} />
      <h2 id="analyse-title">{s.title}</h2>
      <div className="prose">
        <p>{s.text}</p>
      </div>
    </SceneSection>
  )
}
