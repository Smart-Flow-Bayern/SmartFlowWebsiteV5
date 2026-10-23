import { CONTENT } from '@/content'
import { Claim, Kicker, SceneSection } from '@/components/scenes/SceneSection'

export function Komplexitaet() {
  const s = CONTENT.scenes.komplexitaet
  return (
    <SceneSection id="komplexitaet" index={0} side="left">
      <Kicker number={s.number} kicker={s.kicker} />
      <h1 id="komplexitaet-title">{s.title}</h1>
      <div className="prose">
        <p>{s.text}</p>
      </div>
      <Claim />
      <p className="scroll-hint">{s.scrollHint}</p>
    </SceneSection>
  )
}
