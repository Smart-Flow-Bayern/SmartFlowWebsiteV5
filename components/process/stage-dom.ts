// Übersetzt einen Frame der Prozessgrafik in SVG-Attributwerte (Strings, höchstens zwei
// Nachkommastellen) und schreibt sie in die DOM-Elemente der Bühne. Dieselben Werte dienen dem
// Server-Render (Standbild) und dem GSAP-Ticker, damit beide gleich formatieren.

import type { Frame } from '@/scene/process/frame'
import { FRAGMENTS, FRAGMENTS_MOBILE, PACKETS_DESKTOP } from '@/scene/process/layouts'

/** Zahl als Attributwert mit höchstens zwei Nachkommastellen (ohne -0). */
export function num(v: number): string {
  const r = Math.round(v * 100) / 100
  return String(r === 0 ? 0 : r)
}

/** Rundet alle Zahlen in einem Pfad- oder Transform-String auf höchstens zwei Nachkommastellen. */
export function roundNumbers(s: string): string {
  return s.replace(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi, (m) => num(Number(m)))
}

/** Knoten als Quadrat um die Mitte. */
export function nodePath(x: number, y: number, r: number): string {
  return `M${num(x - r)} ${num(y - r)}h${num(2 * r)}v${num(2 * r)}h${num(-2 * r)}z`
}

/**
 * Faktor für Labelgrößen, damit 13 px (mobil 12 px) auf dem Bildschirm ankommen: CSS-Pixel im SVG
 * sind ViewBox-Einheiten und schrumpfen mit der Bühne (`pxPerUnit`) und der Skalierung in `transform`.
 */
export function labelFactor(transform: string, pxPerUnit: number): string | undefined {
  const scale = Number(/scale\(([^)\s]+)\)/.exec(transform)?.[1] ?? 1)
  const k = pxPerUnit * scale
  return Number.isFinite(k) && k > 0 ? num(1 / k) : undefined
}

export interface StageAttrs {
  state: string
  transform: string
  background: string
  fragments: { opacity: string }[]
  zones: { opacity: string }[]
  edges: { d: string; opacity: string; dashoffset: string; dashed: string; strong: string }[]
  packets: { cx?: string; cy?: string; opacity: string }[]
  nodes: { d: string; active: string }[]
  labels: { x: string; y: string; opacity: string }[]
}

export function stageAttrs(f: Frame, mobile: boolean): StageAttrs {
  const fragmentOpacity = num(f.fragments)
  return {
    state: String(f.state),
    transform: roundNumbers(f.transform),
    background: roundNumbers(f.background),
    fragments: Array.from({ length: FRAGMENTS.length }, (_, i) => ({
      opacity: mobile && i >= FRAGMENTS_MOBILE ? '0' : fragmentOpacity,
    })),
    zones: f.zones.map((z) => ({ opacity: num(z) })),
    edges: f.edges.map((e) => ({
      d: roundNumbers(e.d),
      opacity: num(e.opacity),
      dashoffset: num(1 - e.drawn),
      dashed: String(e.dashed),
      strong: String(e.strong),
    })),
    // Feste Elementzahl: Pakete ohne Frame-Wert (mobil ab Index 5) bleiben unsichtbar an ihrem Platz.
    packets: Array.from({ length: PACKETS_DESKTOP }, (_, i) => {
      const p = f.packets[i]
      return p ? { cx: num(p.x), cy: num(p.y), opacity: num(p.opacity) } : { opacity: '0' }
    }),
    nodes: f.nodes.map((n) => ({ d: nodePath(n.x, n.y, n.r), active: String(n.active) })),
    labels: f.nodes.map((n) => ({ x: num(n.x + 14), y: num(n.y + 4), opacity: num(n.label) })),
  }
}

export interface StageElements {
  stage: HTMLElement
  svg: SVGSVGElement
  root: SVGGElement
  fragments: SVGElement[]
  zones: SVGElement[]
  zoneLabels: SVGElement[]
  edges: SVGElement[]
  packets: SVGElement[]
  nodes: SVGElement[]
  labels: SVGElement[]
}

/** Sammelt die Elemente der Bühne einmalig nach dem Mount. */
export function collectStage(stage: HTMLElement): StageElements {
  const all = <T extends Element>(selector: string) => [...stage.querySelectorAll<T & SVGElement>(selector)]
  return {
    stage,
    svg: stage.querySelector('svg.process-stage') as SVGSVGElement,
    root: stage.querySelector('g.root') as SVGGElement,
    fragments: all('.frag'),
    zones: all('.zone'),
    zoneLabels: all('.zone-label'),
    edges: all('.edge'),
    packets: all('.packet'),
    nodes: all('.node'),
    labels: all('.label'),
  }
}

function set(el: Element, name: string, value: string | undefined): void {
  if (value !== undefined && el.getAttribute(name) !== value) el.setAttribute(name, value)
}

function setVar(el: HTMLElement | SVGElement, name: string, value: string | undefined): void {
  if (value !== undefined && el.style.getPropertyValue(name) !== value) el.style.setProperty(name, value)
}

/**
 * Schreibt nur geänderte Werte; keine Leseoperationen, die Layout erzwingen.
 * pxPerUnit: Bildschirmpixel je ViewBox-Einheit (außerhalb des Tickers gemessen), 0 = unbekannt.
 */
export function writeStage(els: StageElements, a: StageAttrs, pxPerUnit: number): void {
  set(els.svg, 'data-state', a.state)
  set(els.root, 'transform', a.transform)
  setVar(els.stage, '--stage-bg', a.background)
  setVar(els.svg, '--label-k', labelFactor(a.transform, pxPerUnit))
  els.fragments.forEach((el, i) => set(el, 'opacity', a.fragments[i].opacity))
  els.zones.forEach((el, i) => set(el, 'opacity', a.zones[i].opacity))
  els.zoneLabels.forEach((el, i) => set(el, 'opacity', a.zones[i].opacity))
  els.edges.forEach((el, i) => {
    const e = a.edges[i]
    set(el, 'd', e.d)
    set(el, 'opacity', e.opacity)
    set(el, 'stroke-dashoffset', e.dashoffset)
    set(el, 'data-dashed', e.dashed)
    set(el, 'data-strong', e.strong)
  })
  els.packets.forEach((el, i) => {
    const p = a.packets[i]
    set(el, 'cx', p.cx)
    set(el, 'cy', p.cy)
    set(el, 'opacity', p.opacity)
  })
  els.nodes.forEach((el, i) => {
    set(el, 'd', a.nodes[i].d)
    set(el, 'data-active', a.nodes[i].active)
  })
  els.labels.forEach((el, i) => {
    const l = a.labels[i]
    set(el, 'x', l.x)
    set(el, 'y', l.y)
    set(el, 'opacity', l.opacity)
  })
}
