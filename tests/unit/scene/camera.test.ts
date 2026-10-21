import { describe, expect, it } from 'vitest'
import { cameraPose, STATION_POSES } from '@/scene/camera'
import { STATIONS } from '@/scene/stations'

describe('cameraPose', () => {
  it.each(STATIONS)('steht an der Mitte von $id auf der Stationspose', ({ id, start, end }) => {
    const pose = cameraPose((start + end) / 2)
    const expected = STATION_POSES[id]
    pose.position.forEach((v, i) => expect(v).toBeCloseTo(expected.position[i], 3))
    pose.target.forEach((v, i) => expect(v).toBeCloseTo(expected.target[i], 3))
    expect(pose.fov).toBeCloseTo(expected.fov, 3)
  })

  it('ist stetig: 200 Punkte, benachbarte Positionen näher als 0.08', () => {
    let previous = cameraPose(0).position
    for (let i = 1; i < 200; i++) {
      const current = cameraPose(i / 199).position
      expect(Math.hypot(...current.map((v, k) => v - previous[k]))).toBeLessThan(0.08)
      previous = current
    }
  })

  it('beginnt am Gehäuse und endet am Kontakt', () => {
    expect(cameraPose(0).position).toEqual(STATION_POSES.gehaeuse.position)
    const end = cameraPose(1)
    end.position.forEach((v, i) => expect(v).toBeCloseTo(STATION_POSES.kontakt.position[i], 3))
  })
})
