import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContentProvider } from '@/components/content/ContentProvider'
import { Footer } from '@/components/Footer'
import { de } from '@/content/de'

describe('Footer', () => {
  it('nennt Adresse, Telefon, E-Mail und drei Rechtstexte, keinen Sprachwechsel', () => {
    render(<ContentProvider content={de}><Footer /></ContentProvider>)
    expect(screen.getByText(/Arnulfsplatz 2/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '+49 173 4487550' })).toHaveAttribute('href', 'tel:+491734487550')
    expect(screen.getByRole('link', { name: 'info@smartflow.bayern' })).toHaveAttribute('href', 'mailto:info@smartflow.bayern')
    expect(screen.getAllByRole('link').filter((a) => /\.html$/.test(a.getAttribute('href') ?? ''))).toHaveLength(3)
    expect(screen.queryByText('English')).toBeNull()
    expect(document.querySelector('[hreflang]')).toBeNull()
  })
})
