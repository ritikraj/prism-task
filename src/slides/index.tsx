// Slide registry. Step counts follow the build spec.
import type { SlideDef } from '../deck/types'
import { Title, Setup, ProblemMapSlide, Story, Fanout } from './act1'
import { Solved, StillOpen, Assumptions } from './act2'
import * as A3s from './act3'
import Prototype from '../proto/Prototype'
import { SystemModel, Flow, Measure, Validate, Next } from './act45'

const A1 = 'Act 1: The problem', A2 = 'Act 2: What exists', A3 = 'Act 3: The idea', A4 = 'Act 4: The experience', A5 = 'Act 5: Close'

export const slides: SlideDef[] = [
  { id: 'title', act: A1, title: 'Title', steps: 0, Component: Title },
  { id: 'setup', act: A1, title: 'The setup', steps: 2, Component: Setup },
  { id: 'problem-map', act: A1, title: 'The problem map', steps: 5, Component: ProblemMapSlide },
  { id: 'story', act: A1, title: 'The story', steps: 2, Component: Story },
  { id: 'fanout', act: A1, title: 'One change, many places', steps: 2, Component: Fanout },
  { id: 'solved', act: A2, title: 'What is already solved', steps: 3, Component: Solved },
  { id: 'open', act: A2, title: 'What is still open', steps: 2, Component: StillOpen },
  { id: 'assumptions', act: A2, title: 'Assumptions', steps: 0, Component: Assumptions },
  { id: 'reframe', act: A3, title: 'The reframe', steps: 1, Component: A3s.Reframe },
  { id: 'two-kinds', act: A3, title: 'Two kinds of change', steps: 2, Component: A3s.TwoKinds },
  { id: 'anatomy', act: A3, title: 'Anatomy of content', steps: 3, Component: A3s.Anatomy },
  { id: 'claim-home', act: A3, title: 'A claim has a home', steps: 1, Component: A3s.ClaimHome },
  { id: 'getting-there', act: A3, title: 'Getting there', steps: 2, Component: A3s.GettingThere },
  { id: 'where-it-stops', act: A3, title: 'Where it stops', steps: 4, Component: A3s.WhereItStops },
  { id: 'one-change', act: A3, title: 'One change', steps: 1, Component: A3s.OneChange },
  { id: 'three-lanes', act: A3, title: 'Three lanes', steps: 3, Component: A3s.ThreeLanes },
  { id: 'shrink', act: A3, title: 'Shrink the queue', steps: 4, Component: A3s.Shrink },
  { id: 'safe', act: A3, title: 'Safe while it drains', steps: 1, Component: A3s.SafeWhileDrains },
  { id: 'admin-job', act: A3, title: 'How AI changes the admin\'s job', steps: 3, Component: A3s.AdminJob },
  { id: 'principles', act: A3, title: 'Principles', steps: 3, Component: A3s.Principles },
  { id: 'system-model', act: A4, title: 'System model', steps: 2, Component: SystemModel },
  { id: 'flow', act: A4, title: 'The flow', steps: 6, Component: Flow },
  { id: 'prototype', act: A4, title: 'Prototype', steps: 0, Component: Prototype, prototype: true },
  { id: 'measure', act: A5, title: 'What I would measure', steps: 4, Component: Measure },
  { id: 'validate', act: A5, title: 'How I would validate and ship it', steps: 3, Component: Validate },
  { id: 'next', act: A5, title: 'What is next, and what I left out', steps: 2, Component: Next },
]
