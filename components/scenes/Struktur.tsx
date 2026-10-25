import { CONTENT } from '@/content'
import { Kicker, SceneSection } from '@/components/scenes/SceneSection'

export function Struktur() {
  const s = CONTENT.scenes.struktur
  return (
    <SceneSection id="struktur" index={2} side="left">
      <Kicker number={s.number} kicker={s.kicker} />
      <h2 id="struktur-title">{s.title}</h2>
      <div className="prose">
        <p>{s.text}</p>
        <ol className="services">
          {CONTENT.services.map((service) => (
            <li key={service.name}>
              <h3>{service.name}</h3>
              <p>{service.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </SceneSection>
  )
}
