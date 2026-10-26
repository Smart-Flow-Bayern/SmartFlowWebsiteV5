import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Portrait } from '@/components/about/Portrait'
import { PORTRAIT } from '@/lib/brand/portrait'

describe('Portrait', () => {
  it('rendert ohne Foto nichts, auch keinen Initialen-Platzhalter', () => {
    expect(PORTRAIT).toBeNull()
    const { container } = render(<Portrait alt="Leon Heinrich" />)
    expect(container).toBeEmptyDOMElement()
  })
})
