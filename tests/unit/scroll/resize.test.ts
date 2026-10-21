import { describe, expect, it } from 'vitest'
import { shouldRefresh } from '@/lib/scroll/resize'

describe('shouldRefresh', () => {
  const prev = { w: 390, h: 844 }
  it('ignoriert Adressleisten-Höhe', () => {
    expect(shouldRefresh(prev, { w: 390, h: 760 })).toBe(false)
  })
  it('große Höhenänderung', () => {
    expect(shouldRefresh(prev, { w: 390, h: 700 })).toBe(true)
  })
  it('Breitenänderung', () => {
    expect(shouldRefresh(prev, { w: 414, h: 896 })).toBe(true)
  })
  it('identisch', () => {
    expect(shouldRefresh(prev, prev)).toBe(false)
  })
})
