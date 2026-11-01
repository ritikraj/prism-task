// SVG diagram helpers. Diagrams use a viewBox, so they scale with the stage.
import { useEffect, useState, type ReactNode } from 'react'

export const on = (cond: boolean) => (cond ? ' in' : '')

export function Svg({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return (
    <svg className="dia" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10" className="arrowhead" />
        </marker>
      </defs>
      {children}
    </svg>
  )
}

// Box with centered label; "\n" splits lines.
export function Node({ x, y, w = 260, h = 84, label, className = '', strong }: {
  x: number; y: number; w?: number; h?: number; label: string; className?: string; strong?: boolean
}) {
  const lines = label.split('\n')
  return (
    <g className={`node ${strong ? 'strong' : ''} ${className}`}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} />
      <text textAnchor="middle">
        {lines.map((l, i) => <tspan key={i} x={x} y={y + (i - (lines.length - 1) / 2) * 34} dominantBaseline="central">{l}</tspan>)}
      </text>
    </g>
  )
}

// Line that draws itself when `show` turns true. The arrowhead waits until the line has finished drawing.
export function Line({ d, show, arrow, dashed, className = '' }: { d: string; show: boolean; arrow?: boolean; dashed?: boolean; className?: string }) {
  const [head, setHead] = useState(show)
  useEffect(() => {
    if (!show) { setHead(false); return }
    const t = setTimeout(() => setHead(true), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500)
    return () => clearTimeout(t)
  }, [show])
  return <path d={d} pathLength={1} className={`line${dashed ? ' dashed' : ''}${on(show)} ${className}`} markerEnd={arrow && head ? 'url(#arrow)' : undefined} />
}
