'use client'

import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { collectStage, num, stageAttrs, writeStage } from '@/components/process/stage-dom'
import { progressStore } from '@/lib/scroll/progress'
import { EDGE_KEYS, SMOOTHING, STILL_PROGRESS, frame } from '@/scene/process/frame'
import { FRAGMENTS, NODE_NAMES, VIEWBOX, ZONES } from '@/scene/process/layouts'
import { stateProgress } from '@/scene/process/scenes'

/** Gleiche Grenze wie die Mobil-Regeln in globals.css (max-width: 719px). */
const MOBILE_QUERY = '(max-width: 719px)'

/** Abstand zum Ziel, ab dem die geglättete Grafik einrastet. */
const SNAP = 0.001

/** Standbild Zustand 3: Server-Render, erster Client-Render und Reduced Motion. */
const STILL = stageAttrs(frame(STILL_PROGRESS, 0, { mobile: false, reduced: true }), false)

function motionReduced(): boolean {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.dataset.motion === 'reduced'
  )
}

/** Prozessgrafik in der Sticky-Bühne; folgt dem Scrollfortschritt über den GSAP-Ticker, ohne React-Re-Renders. */
export function ProcessStage() {
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const els = collectStage(stage)
    const mobileQuery = window.matchMedia(MOBILE_QUERY)

    const reduced = motionReduced()

    // Bildschirmpixel je ViewBox-Einheit (preserveAspectRatio meet), nur bei Größenänderung gemessen.
    let pxPerUnit = 0
    const measure = () => {
      const { width, height } = els.svg.getBoundingClientRect()
      pxPerUnit = Math.min(width / VIEWBOX.width, height / VIEWBOX.height)
    }
    // Reduced Motion: kein Ticker, nur das Standbild (mobil ohne Desktop-Verschiebung), neu bei Größenänderung.
    const writeStill = () => {
      const mobile = mobileQuery.matches
      writeStage(els, stageAttrs(frame(STILL_PROGRESS, 0, { mobile, reduced: true }), mobile), pxPerUnit)
    }
    const onResize = () => {
      measure()
      if (reduced) writeStill()
    }
    onResize()
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(onResize)
    observer?.observe(els.svg)

    let shown: number | undefined
    const tick = (time: number) => {
      const target = stateProgress(progressStore.get())
      // Erster Frame springt auf den Zielzustand, danach folgt die Grafik geglättet und rastet nahe am Ziel ein,
      // damit ganzzahlige Zustände (z. B. 5 am Story-Ende) exakt erreicht werden.
      shown = shown === undefined ? target : shown + (target - shown) * SMOOTHING
      if (Math.abs(target - shown) < SNAP) shown = target
      const mobile = mobileQuery.matches
      writeStage(els, stageAttrs(frame(shown, time, { mobile, reduced: false }), mobile), pxPerUnit)
    }
    if (!reduced) gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      observer?.disconnect()
    }
  }, [])

  return (
    <div ref={stageRef} className="stage" style={{ '--stage-bg': STILL.background } as React.CSSProperties}>
      <svg
        className="process-stage"
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        aria-hidden="true"
        focusable="false"
        data-state={STILL.state}
      >
        <g className="root" transform={STILL.transform}>
          <g className="fragments">
            {FRAGMENTS.map((f, i) => (
              <line
                key={i}
                className="frag"
                x1={num(f.x)}
                y1={num(f.y)}
                x2={num(f.x + Math.cos(f.angle) * f.len)}
                y2={num(f.y + Math.sin(f.angle) * f.len)}
                opacity={STILL.fragments[i].opacity}
              />
            ))}
          </g>
          <g className="zones">
            {ZONES.map((z, i) => (
              <g key={z.label}>
                <ellipse className="zone" cx="500" cy="300" rx={z.rx} ry={z.ry} opacity={STILL.zones[i].opacity} />
                <text className="zone-label" x="500" y={300 - z.ry + 22} textAnchor="middle" opacity={STILL.zones[i].opacity}>
                  {z.label}
                </text>
              </g>
            ))}
          </g>
          <g className="edges">
            {EDGE_KEYS.map((key, i) => {
              const e = STILL.edges[i]
              return (
                <path
                  key={key}
                  className="edge"
                  pathLength={1}
                  d={e.d}
                  opacity={e.opacity}
                  strokeDashoffset={e.dashoffset}
                  data-dashed={e.dashed}
                  data-strong={e.strong}
                />
              )
            })}
          </g>
          <g className="packets">
            {STILL.packets.map((p, i) => (
              <circle key={i} className="packet" cx={p.cx} cy={p.cy} opacity={p.opacity} />
            ))}
          </g>
          <g className="nodes">
            {NODE_NAMES.map((name, i) => (
              <path key={name} className="node" d={STILL.nodes[i].d} data-active={STILL.nodes[i].active} />
            ))}
          </g>
          <g className="labels">
            {NODE_NAMES.map((name, i) => {
              const l = STILL.labels[i]
              return (
                <text key={name} className="label" x={l.x} y={l.y} opacity={l.opacity}>
                  {name}
                </text>
              )
            })}
          </g>
        </g>
      </svg>
    </div>
  )
}
