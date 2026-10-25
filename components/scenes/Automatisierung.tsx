import { CONTENT } from '@/content'
import { Kicker, SceneSection } from '@/components/scenes/SceneSection'

export function Automatisierung() {
  const s = CONTENT.scenes.automatisierung
  return (
    <SceneSection id="automatisierung" index={3} side="right">
      <Kicker number={s.number} kicker={s.kicker} />
      <h2 id="automatisierung-title">{s.title}</h2>
      <div className="prose">
        <p>{s.text}</p>
        <ul className="examples">
          {s.examples.map((example) => (
            <li key={example}>{example}</li>
          ))}
        </ul>
      </div>
    </SceneSection>
  )
}
