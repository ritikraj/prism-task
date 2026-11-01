// Build-step primitive: children appear once the slide reaches step `at`.
// Pure function of step, so any step renders directly (no playback needed).
import { createContext, useContext, type ReactNode } from 'react'

export const StepCtx = createContext(0)

export function Reveal({ at, children, as: Tag = 'div', className = '' }: {
  at: number; children: ReactNode; as?: 'div' | 'span' | 'li'; className?: string
}) {
  const step = useContext(StepCtx)
  return <Tag className={`reveal ${step >= at ? 'in' : ''} ${className}`}>{children}</Tag>
}

export const Illustrative = () => <span className="illustrative">assumption</span>
