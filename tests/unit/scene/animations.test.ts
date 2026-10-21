import { describe, expect, it } from 'vitest'
import {
  cableInsert,
  coolerLift,
  fanAngle,
  mainboardLabelIndex,
  sidePanelOffset,
  ssdBlocksWritten,
  traceImpulse,
} from '@/scene/animations'

describe('animations', () => {
  it('sidePanelOffset: 0 bis 0.06, 0.35 ab 0.14', () => {
    expect(sidePanelOffset(0)).toBe(0)
    expect(sidePanelOffset(0.06)).toBe(0)
    expect(sidePanelOffset(0.1)).toBeGreaterThan(0)
    expect(sidePanelOffset(0.1)).toBeLessThan(0.35)
    expect(sidePanelOffset(0.14)).toBeCloseTo(0.35, 6)
    expect(sidePanelOffset(0.8)).toBeCloseTo(0.35, 6)
  })

  it('mainboardLabelIndex: -1 außerhalb, 0 bis 4 im Fenster', () => {
    expect(mainboardLabelIndex(0.05)).toBe(-1)
    expect(mainboardLabelIndex(0.1)).toBe(-1)
    expect(mainboardLabelIndex(0.135)).toBe(0)
    expect(mainboardLabelIndex(0.2)).toBe(4)
    expect(mainboardLabelIndex(0.3)).toBe(-1)
  })

  it('fanAngle: 0 außerhalb der GPU-Station, danach wächst der Winkel mit der Zeit', () => {
    expect(fanAngle(0.3, 1)).toBe(0)
    expect(fanAngle(0.75, 5)).toBe(0)
    expect(fanAngle(0.68, 1)).toBeGreaterThan(0)
    expect(fanAngle(0.68, 2)).toBeGreaterThan(fanAngle(0.68, 1))
  })

  it('fanAngle: Drehzahl erreicht 18 rad/s nach dem ersten Fensterdrittel', () => {
    expect(fanAngle(0.68, 1)).toBeCloseTo(18, 6)
    expect(fanAngle(0.56, 1)).toBe(0)
  })

  it('ssdBlocksWritten: 0 bis 4', () => {
    expect(ssdBlocksWritten(0.72)).toBe(0)
    expect(ssdBlocksWritten(0.84)).toBe(4)
  })

  it('traceImpulse liegt immer in [0, 1) und bewegt sich', () => {
    for (let i = 0; i <= 1000; i++) {
      const value = traceImpulse(i / 1000)
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
    expect(traceImpulse(0.31)).not.toBe(traceImpulse(0.3))
  })

  it('traceImpulse läuft am Mainboard schneller als sonst', () => {
    const step = (a: number, b: number) => {
      const d = traceImpulse(b) - traceImpulse(a)
      return d < 0 ? d + 1 : d
    }
    expect(step(0.12, 0.125)).toBeGreaterThan(step(0.5, 0.505))
  })

  it('cableInsert: 0 außerhalb, 1 nach dem ersten Fensterdrittel', () => {
    expect(cableInsert(0.85)).toBe(0)
    expect(cableInsert(0.95)).toBe(1)
    expect(cableInsert(0.88)).toBeGreaterThan(0)
    expect(cableInsert(0.88)).toBeLessThan(1)
  })

  it('coolerLift: hebt in cpu ab, senkt in ram wieder ab', () => {
    expect(coolerLift(0.2)).toBe(0)
    expect(coolerLift(0.33)).toBeCloseTo(1, 6)
    expect(coolerLift(0.41)).toBe(1)
    expect(coolerLift(0.5)).toBe(0)
    expect(coolerLift(0.435)).toBeGreaterThan(0)
    expect(coolerLift(0.435)).toBeLessThan(1)
  })
})
