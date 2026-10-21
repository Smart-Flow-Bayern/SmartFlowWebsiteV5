import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Impulse } from '@/components/brand/Impulse'
import { Wordmark } from '@/components/brand/Wordmark'

const ACCENT = '#ddff4d'

function accentUses(svg: Element): number {
  const nodes = [svg, ...Array.from(svg.querySelectorAll('*'))]
  let count = 0
  for (const node of nodes) {
    for (const attr of ['fill', 'stroke']) {
      if (node.getAttribute(attr)?.toLowerCase() === ACCENT) count++
    }
  }
  // Gegenprobe über das gesamte Markup: keine weitere Fundstelle, z. B. in style-Attributen
  expect(svg.outerHTML.toLowerCase().split(ACCENT).length - 1).toBe(count)
  return count
}

describe('Wordmark', () => {
  it.each(['underscore', 'impulse'] as const)(
    'Variante %s ist ein Bild mit dem Namen „Smart Flow“',
    (variant) => {
      render(<Wordmark variant={variant} />)
      const svg = screen.getByRole('img', { name: 'Smart Flow' })
      expect(svg.tagName.toLowerCase()).toBe('svg')
      expect(svg).toHaveAttribute('aria-label', 'Smart Flow')
    },
  )

  it('Variante underscore enthält den Text smart_flow', () => {
    render(<Wordmark variant="underscore" />)
    expect(screen.getByRole('img', { name: 'Smart Flow' }).textContent).toContain('smart_flow')
  })

  it('Variante impulse setzt die Bildmarke in die Zelle zwischen smart und flow', () => {
    render(<Wordmark variant="impulse" />)
    const svg = screen.getByRole('img', { name: 'Smart Flow' })
    // Ein Leerzeichen hält die sechste Zelle frei, in der der Pfad der Bildmarke sitzt
    expect(svg.textContent).toContain('smart flow')
    const path = svg.querySelector('path')
    expect(path).not.toBeNull()
    expect(path).toHaveAttribute('transform', 'translate(2835 -352) scale(16)')
    expect(path).toHaveAttribute('stroke-width', '4')
  })

  it.each(['underscore', 'impulse'] as const)(
    'Variante %s nutzt den Akzent genau einmal als fill oder stroke',
    (variant) => {
      render(<Wordmark variant={variant} />)
      expect(accentUses(screen.getByRole('img', { name: 'Smart Flow' }))).toBe(1)
    },
  )

  it('size setzt die Höhe in Pixeln, Standard 32', () => {
    const { rerender } = render(<Wordmark variant="underscore" />)
    expect(screen.getByRole('img', { name: 'Smart Flow' })).toHaveAttribute('height', '32')
    rerender(<Wordmark variant="underscore" size={120} />)
    expect(screen.getByRole('img', { name: 'Smart Flow' })).toHaveAttribute('height', '120')
  })
})

describe('Impulse', () => {
  it('ist ein Bild mit genau einem Akzent-Strich', () => {
    render(<Impulse />)
    const svg = screen.getByRole('img', { name: 'Smart Flow' })
    expect(svg).toHaveAttribute('viewBox', '0 0 32 32')
    expect(svg).toHaveAttribute('width', '32')
    expect(accentUses(svg)).toBe(1)
  })

  it('läuft nur mit animated', () => {
    const { rerender } = render(<Impulse size={64} />)
    const svg = screen.getByRole('img', { name: 'Smart Flow' })
    expect(svg).toHaveAttribute('width', '64')
    expect(svg.querySelector('.impulse-run')).toBeNull()
    rerender(<Impulse size={64} animated />)
    expect(svg.querySelector('.impulse-run')).not.toBeNull()
    expect(accentUses(svg)).toBe(1)
  })
})
