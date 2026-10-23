import { CONTENT } from '@/content'
import { Kicker, SceneSection } from '@/components/scenes/SceneSection'

export function Wachstum() {
  const s = CONTENT.scenes.wachstum
  return (
    <SceneSection id="wachstum" index={4} side="left">
      <Kicker number={s.number} kicker={s.kicker} />
      <h2 id="wachstum-title">{s.title}</h2>
      <div className="prose">
        <p>{s.text}</p>
        <ul className="fields">
          {s.fields.map((field) => (
            <li key={field.name}>
              <h3>{field.name}</h3>
              <p>{field.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </SceneSection>
  )
}
