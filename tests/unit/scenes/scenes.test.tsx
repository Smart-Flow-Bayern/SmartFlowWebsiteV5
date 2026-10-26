import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContentProvider } from '@/components/content/ContentProvider'
import { Scenes } from '@/components/scenes/Scenes'
import { de } from '@/content/de'
import { SCENE_IDS } from '@/content/types'

const Story = () => <ContentProvider content={de}><main id="story"><Scenes /></main></ContentProvider>

describe('Scenes (Szenen als HTML)', () => {
  it('rendert sieben Abschnitte mit Überschrift, in Reihenfolge, genau eine H1', () => {
    const { container } = render(<Story />)
    const sections = [...container.querySelectorAll('main#story section.scene')]
    expect(sections.map((s) => s.id)).toEqual([...SCENE_IDS])
    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(de.scenes.komplexitaet.title)
    for (const id of SCENE_IDS) expect(container.querySelector(`#${id}-title`)).not.toBeNull()
  })
  it('setzt den Claim mit lang="en" und sonst kein Englisch-Attribut', () => {
    const { container } = render(<Story />)
    const en = [...container.querySelectorAll('[lang="en"]')]
    expect(en.length).toBe(1)
    for (const el of en) expect(el.textContent).toBe(de.claim.text)
  })
  it('Struktur listet die drei Leistungen, Kontakt bietet Termin und E-Mail', () => {
    const { container } = render(<Story />)
    expect(container.querySelectorAll('#struktur ol li')).toHaveLength(3)
    expect(screen.getByRole('button', { name: de.scenes.kontakt.calCta })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: de.scenes.kontakt.emailCta })).toHaveAttribute('href', 'mailto:info@smartflow.bayern')
  })
  it('zeigt die häufigen Fragen zwischen Über und Kontakt, ohne als Szene zu zählen', () => {
    const { container } = render(<Story />)
    const fragen = container.querySelector('#fragen')!
    expect(fragen.classList.contains('scene')).toBe(false)
    expect(fragen.previousElementSibling?.id).toBe('ueber')
    expect(fragen.nextElementSibling?.id).toBe('kontakt')
    expect([...fragen.querySelectorAll('h3')].map((h) => h.textContent)).toEqual(de.faq.items.map((i) => i.question))
  })
})
