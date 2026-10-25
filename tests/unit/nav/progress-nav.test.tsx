import { render } from '@testing-library/react'
import { act } from 'react'
import { describe, expect, it } from 'vitest'
import { ContentProvider } from '@/components/content/ContentProvider'
import { ProgressNav } from '@/components/nav/ProgressNav'
import { de } from '@/content/de'
import { activeSceneStore } from '@/lib/scroll/progress'

describe('ProgressNav', () => {
  it('zeigt sechs nummerierte Einträge und markiert die aktive Szene, Über zählt zu Wachstum', () => {
    const { container } = render(<ContentProvider content={de}><ProgressNav /></ContentProvider>)
    const items = container.querySelectorAll('ol li a')
    expect(items).toHaveLength(6)
    expect(items[0].textContent).toContain('01')
    act(() => activeSceneStore.set(5))
    expect(container.querySelector('[aria-current="step"]')?.getAttribute('href')).toBe('#wachstum')
    act(() => activeSceneStore.set(0))
  })
})
