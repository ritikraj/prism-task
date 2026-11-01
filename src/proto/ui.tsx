// Small shared pieces of the prototype's component system.
import { useEffect, useRef, type ReactNode } from 'react'
import type { Confidence } from './store'

export const Conf = ({ c }: { c: Confidence }) => <span className={`p-chip conf-${c.toLowerCase()}`}>{c} confidence</span>
export const Pri = ({ p }: { p: string }) => <span className={`p-chip pri-${p.toLowerCase()}`}>{p}</span>
export const Head = ({ title, sub, children }: { title?: string; sub?: ReactNode; children?: ReactNode }) => (
  <div className="p-head">
    <div className="p-grow">{title && <h1>{title}</h1>}{sub && <p className="p-muted p-sub-line">{sub}</p>}</div>
    {children}
  </div>
)
export const Stats = ({ items }: { items: [ReactNode, string][] }) => (
  <div className="p-stats">{items.map(([n, l], i) => <span key={i}>{n} {l}</span>)}</div>
)

export const Ic = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
)

// One big side modal (single changes, batches, long lists). Esc closes only the topmost one.
export function Sheet({ title, sub, tabs, onClose, children }: { title: string; sub: ReactNode; tabs?: ReactNode; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const all = document.querySelectorAll('.p-sheet')
      if (e.key === 'Escape' && all[all.length - 1] === ref.current) onClose()
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [onClose])
  return (
    <div className="p-scrim" onClick={onClose}>
      <section ref={ref} className="p-sheet" role="dialog" aria-label={title} onClick={e => e.stopPropagation()}>
        <header className="p-sheet-head">
          <div className="p-head">
            <div className="p-grow"><h1>{title}</h1><p className="p-muted p-sub-line">{sub}</p></div>
            <button className="p-icon" aria-label="Close" title="Close" onClick={onClose}><Ic d="M6 6l12 12M18 6L6 18" /></button>
          </div>
          {tabs}
        </header>
        <div className="p-sheet-body">{children}</div>
      </section>
    </div>
  )
}
