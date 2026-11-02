// Small shared pieces of the prototype's component system.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useProto, notHere, type Confidence } from './store'

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

// Icon paths used across screens.
export const ICON = {
  tag: 'M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9zM7.5 7.5h.01',
  copies: 'M8 8h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1zM16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3',
  spark: 'M11 2l2.3 6.7L20 11l-6.7 2.3L11 20l-2.3-6.7L2 11l6.7-2.3z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-4.3-4.3',
  check: 'M5 12l5 5 9-11',
  chevron: 'M9 6l6 6-6 6',
  deck: 'M3 4h18M4 4v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4M12 15v5M8 20h8',
  doc: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 13h6M9 17h6',
  pdf: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5',
  video: 'M4 6h11a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zM16 10l5-3v10l-5-3',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  users: 'M16 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 20v-1a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  archive: 'M3 4h18v4H3zM5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  bell: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01',
  plus: 'M12 5v14M5 12h14',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  expand: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
  sheet: 'M4 4h16v16H4zM4 10h16M10 4v16',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  folder: 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  merge: 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
  flag: 'M4 22V4M4 4h13l-2 4 2 4H4',
  upload: 'M12 16V4M7 9l5-5 5 5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2',
  film: 'M4 4h16v16H4zM8 4v16M16 4v16M4 9h4M4 15h4M16 9h4M16 15h4',
}

// A meta line: small icon + text pairs, dot-separated.
export const Meta = ({ items }: { items: [string, ReactNode][] }) => (
  <span className="p-metas">{items.map(([d, t], i) => <span key={i}><Ic d={d} size={13} />{t}</span>)}</span>
)
// A primary or secondary button label with a leading icon.
export const BtnIc = ({ d, children }: { d: string; children: ReactNode }) => <><Ic d={d} size={15} />{children}</>

// A tinted square holding an icon: the type of a card at a glance.
export const Tile = ({ d, tone = 'accent' }: { d: string; tone?: 'accent' | 'ai' | 'warn' | 'ok' | 'muted' }) => (
  <span className={`p-tile ${tone}`}>{tone === 'ai' ? <span className="ai-ic" /> : <Ic d={d} size={18} />}</span>
)

// Initials on a soft colour picked from the name, so the same person always looks the same.
const hue = (s: string) => [...s].reduce((n, c) => n + c.charCodeAt(0), 0) % 6
export const Avatar = ({ name, size = 24 }: { name: string; size?: number }) => (
  <span className={`p-av av${hue(name)}`} style={{ width: size, height: size, fontSize: size * 0.42 }} title={name}>
    {name.split(' ').map(w => w[0]).slice(0, 2).join('')}
  </span>
)
export const Avatars = ({ names, max = 4 }: { names: string[]; max?: number }) => (
  <span className="p-avs">
    {names.slice(0, max).map(n => <Avatar key={n} name={n} />)}
    {names.length > max && <span className="p-av more">+{names.length - max}</span>}
  </span>
)

// File type: a small icon and its name.
const TYPE_ICON: Record<string, string> = { Deck: ICON.deck, Doc: ICON.doc, PDF: ICON.pdf, Video: ICON.video }
export const FileType = ({ type }: { type: string }) => (
  <span className={`p-ftype ft-${type.toLowerCase()}`}><Ic d={TYPE_ICON[type] ?? ICON.doc} size={14} />{type}</span>
)

// Old sentence struck through in red, new one in green: reads as a change at a glance.
export const Diff = ({ old, next, big }: { old: ReactNode; next: ReactNode; big?: boolean }) => (
  <div className={`p-diff ${big ? 'big' : ''}`}><del>{old}</del><ins>{next}</ins></div>
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
            <span className="p-sheet-acts">
              <button className="p-ibtn" aria-label="Copy link" title="Copy link" onClick={() => useProto.getState().say('Link copied.')}><Ic d={ICON.link} size={17} /></button>
              <button className="p-ibtn" aria-label="Open as a page" title="Open as a page" onClick={notHere}><Ic d={ICON.expand} size={16} /></button>
              <button className="p-ibtn" aria-label="More actions" title="More actions" onClick={notHere}><Ic d={ICON.more} size={18} /></button>
              <i className="p-vsep" />
              <button className="p-ibtn" aria-label="Close" title="Close" onClick={onClose}><Ic d="M6 6l12 12M18 6L6 18" size={18} /></button>
            </span>
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
