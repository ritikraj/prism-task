// Small shared pieces of the prototype's component system.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Confidence } from './store'

export const Conf = ({ c }: { c: Confidence }) => <span className={`p-chip conf-${c.toLowerCase()}`}>{c} confidence</span>
// AI-made content is marked by this badge, so the copy itself can say "we".
export const AiBadge = ({ label = 'AI' }: { label?: string }) => <span className="p-chip ai"><span className="ai-ic" />{label}</span>
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

// Floating side panel: back + title + meta + close, a scrolling body, and an optional fixed footer
// that holds the panel's actions. Esc closes only the topmost one.
export function Sheet({ title, sub, tabs, onBack, footer, onClose, children }: {
  title: string; sub?: ReactNode; tabs?: ReactNode; onBack?: () => void; footer?: ReactNode; onClose: () => void; children: ReactNode
}) {
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
          <div className="p-sheet-bar">
            {onBack && <button className="p-ibtn" aria-label="Back" title="Back" onClick={onBack}><Ic d="M15 6l-6 6 6 6" size={18} /></button>}
            <div className="p-grow"><h1>{title}</h1>{sub && <p className="p-sheet-sub">{sub}</p>}</div>
            <button className="p-ibtn" aria-label="Close" title="Close" onClick={onClose}><Ic d="M6 6l12 12M18 6L6 18" size={18} /></button>
          </div>
          {tabs}
        </header>
        <div className="p-sheet-body">{children}</div>
        {footer && <footer className="p-sheet-foot">{footer}</footer>}
      </section>
    </div>
  )
}

// Section heading inside a panel: a bold line with an optional tag, and a grey meta line under it.
export const SecHead = ({ title, tag, meta }: { title: ReactNode; tag?: ReactNode; meta?: ReactNode }) => (
  <div className="p-sec-head"><h2>{title}{tag}</h2>{meta && <p>{meta}</p>}</div>
)

// Custom dropdown (no native select). Closes on outside click or Esc.
export function Dropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const click = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', click)
    window.addEventListener('keydown', key)
    return () => { document.removeEventListener('mousedown', click); window.removeEventListener('keydown', key) }
  }, [open])
  return (
    <div className="p-dd" ref={ref}>
      <button className={`p-dd-btn ${value !== 'All' ? 'set' : ''}`} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="p-muted">{label}</span>{value}<Ic d="M6 9l6 6 6-6" size={14} />
      </button>
      {open && (
        <div className="p-dd-menu" role="listbox" aria-label={label}>
          {options.map(o => (
            <button key={o} role="option" aria-selected={o === value} className={o === value ? 'on' : ''} onClick={() => { onChange(o); setOpen(false) }}>
              <span className="p-grow">{o}</span>{o === value && <Ic d="M5 12l5 5 9-11" size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
