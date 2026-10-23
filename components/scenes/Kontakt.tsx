import { CalEmbed } from '@/components/contact/CalEmbed'
import { CONTENT } from '@/content'
import { CONTACT } from '@/content/contact'
import { Claim, Kicker, SceneSection } from '@/components/scenes/SceneSection'

export function Kontakt() {
  const s = CONTENT.scenes.kontakt
  return (
    <SceneSection id="kontakt" index={6} side="center">
      <Kicker number={s.number} kicker={s.kicker} />
      <Claim />
      <h2 id="kontakt-title" tabIndex={-1}>
        {s.title}
      </h2>
      <div className="prose">
        <p>{s.text}</p>
      </div>
      <div className="contact-actions">
        <CalEmbed />
        <a className="btn btn-ghost" href={`mailto:${CONTACT.email}`}>
          {s.emailCta}
        </a>
      </div>
    </SceneSection>
  )
}
