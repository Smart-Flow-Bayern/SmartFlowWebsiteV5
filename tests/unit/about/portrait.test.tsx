import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Portrait } from '@/components/about/Portrait'
import { PORTRAIT } from '@/lib/brand/portrait'

describe('Portrait', () => {
  it('zeigt ohne Foto die Initialen als beschriftete Fläche, kein img', () => {
    expect(PORTRAIT).toBeNull()
    render(<Portrait initials="LH" alt="Leon Heinrich" />)
    expect(screen.getByRole('img', { name: 'Leon Heinrich' })).toHaveTextContent('LH')
    expect(document.querySelector('img')).toBeNull()
  })
})
