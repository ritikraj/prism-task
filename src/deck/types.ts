import type { ComponentType } from 'react'

export type Mode = 'present' | 'read'
export type SlideProps = { step: number; mode: Mode }
export type SlideDef = {
  id: string
  act: string
  title: string
  steps: number | ((mode: Mode) => number) // build steps after step 0
  Component: ComponentType<SlideProps>
  prototype?: boolean // arrow keys belong to the slide while it has focus
}
export const stepsOf = (s: SlideDef, mode: Mode) => (typeof s.steps === 'function' ? s.steps(mode) : s.steps)
