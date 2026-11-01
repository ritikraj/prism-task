// Reusable slide building blocks. Each reads the step from context via Reveal, so any step renders directly.
import { useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Reveal, StepCtx, Illustrative } from './Reveal'

export { Reveal, Illustrative }

// Standard slide frame: eyebrow + title + body.
export function Frame({ eyebrow, title, illustrative, center, children }: {
  eyebrow?: string; title?: ReactNode; illustrative?: boolean; center?: boolean; children?: ReactNode
}) {
  return (
    <div className={`slide ${center ? 'center' : ''}`}>
      {(eyebrow || illustrative) && <div className="eyebrow row-gap">{eyebrow}{illustrative && <Illustrative />}</div>}
      {title && <h1>{title}</h1>}
      {children}
    </div>
  )
}

// Big statement lines, one per step (line i appears at step `from + i`).
export function Statement({ lines, from = 0 }: { lines: ReactNode[]; from?: number }) {
  return <div className="statement">{lines.map((l, i) => <Reveal key={i} at={from + i}><p>{l}</p></Reveal>)}</div>
}

export type CardData = { title: ReactNode; body?: ReactNode; meta?: ReactNode; at?: number; dim?: boolean; tone?: 'strong' }
export function Cards({ items, cols }: { items: CardData[]; cols?: number }) {
  return (
    <div className="cards" style={{ gridTemplateColumns: `repeat(${cols ?? items.length}, 1fr)` }}>
      {items.map((c, i) => (
        <Reveal key={i} at={c.at ?? 0} className={`card ${c.dim ? 'dim' : ''} ${c.tone ?? ''}`}>
          <div className="card-title">{c.title}</div>
          {c.body && <div className="card-body">{c.body}</div>}
          {c.meta && <div className="card-meta">{c.meta}</div>}
        </Reveal>
      ))}
    </div>
  )
}

// 2x2 grid with column + row headers; cell(r, c) returns content.
export function Grid2x2({ cols, rows, cell }: { cols: [ReactNode, ReactNode]; rows: [ReactNode, ReactNode]; cell: (r: number, c: number) => ReactNode }) {
  return (
    <div className="grid2x2">
      <div />{cols.map((c, i) => <div key={i} className="eyebrow g-head">{c}</div>)}
      {rows.map((r, ri) => [
        <div key={`r${ri}`} className="eyebrow g-row">{r}</div>,
        ...cols.map((_, ci) => <div key={`${ri}-${ci}`} className="g-cell">{cell(ri, ci)}</div>),
      ])}
    </div>
  )
}

// Before / after rows, row i appears at step `from + i`.
export function BeforeAfter({ rows, from = 1, labels = ['Before', 'After'] }: { rows: [ReactNode, ReactNode][]; from?: number; labels?: [string, string] }) {
  return (
    <div className="ba">
      <div className="eyebrow">{labels[0]}</div><div /><div className="eyebrow">{labels[1]}</div>
      {rows.map(([b, a], i) => (
        <Reveal key={i} at={from + i} className="ba-row"><span className="muted">{b}</span><span className="arrow">→</span><span>{a}</span></Reveal>
      ))}
    </div>
  )
}

// Numbered list, item i appears at step `from + i`.
export function Steps({ items, from = 1 }: { items: ReactNode[]; from?: number }) {
  return (
    <ol className="steps-list">
      {items.map((t, i) => <Reveal key={i} as="li" at={from + i}><span className="num">{String(i + 1).padStart(2, '0')}</span><span>{t}</span></Reveal>)}
    </ol>
  )
}

// Animated number: tweens to `value` whenever it changes. Instant with reduced motion.
export function Counter({ value, ms = 600 }: { value: number; ms?: number }) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(value); from.current = value; return }
    const start = performance.now(), a = from.current
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / ms)
      const v = Math.round(a + (value - a) * (1 - Math.pow(1 - k, 3)))
      setShown(v); from.current = v
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, ms])
  return <span className="counter-num">{shown.toLocaleString('en-US')}</span>
}

// Current step, for slides that need logic beyond Reveal.
export const useStep = () => useContext(StepCtx)
