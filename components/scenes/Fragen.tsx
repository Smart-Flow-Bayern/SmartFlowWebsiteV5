import { CONTENT } from '@/content'
import { Kicker } from '@/components/scenes/SceneSection'

/** Häufige Fragen zwischen Über und Kontakt. Bewusst ohne `.scene`: zählt nicht für Fortschritt und Navigation. */
export function Fragen() {
  const f = CONTENT.faq
  return (
    <section id="fragen" aria-labelledby="fragen-title" className="faq">
      <div className="scene-text">
        <Kicker number="" kicker={f.kicker} />
        <h2 id="fragen-title">{f.heading}</h2>
        <div className="faq-items">
          {f.items.map((item) => (
            <div key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
