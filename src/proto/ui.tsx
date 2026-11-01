// Small shared pieces of the prototype's component system.
import type { ReactNode } from 'react'
import type { Confidence } from './store'

export const Conf = ({ c }: { c: Confidence }) => <span className={`p-chip conf-${c.toLowerCase()}`}>{c} confidence</span>
export const Pri = ({ p }: { p: string }) => <span className={`p-chip pri-${p.toLowerCase()}`}>{p}</span>
export const Head = ({ title, sub, children }: { title: string; sub?: ReactNode; children?: ReactNode }) => (
  <div className="p-head">
    <div className="p-grow"><h1>{title}</h1>{sub && <p className="p-muted p-sub-line">{sub}</p>}</div>
    {children}
  </div>
)
export const Stats = ({ items }: { items: [ReactNode, string][] }) => (
  <div className="p-stats">{items.map(([n, l], i) => <span key={i}>{n} {l}</span>)}</div>
)

export const Ic = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
)
