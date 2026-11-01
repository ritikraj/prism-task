// Act 2: What exists (slides 7–9).
import { Cards, Frame, Grid2x2, Reveal, useStep } from '../deck/blocks'

export function Solved() {
  return (
    <Frame eyebrow="What is already solved" title="A lot of this is solved.">
      <Cards items={[
        { at: 1, title: 'Old files', body: 'Expiry dates, usage reports, AI that archives what nobody opens.', meta: 'Highspot, Showpad' },
        { at: 2, title: 'Templated documents', body: 'Variables filled from the CRM.', meta: 'Seismic LiveDocs, Highspot AutoDocs, Mindtickle AI Custom Docs' },
        { at: 3, title: 'Competitor facts', body: 'Battlecard tools push current cards into the library.', meta: 'Klue, Crayon' },
      ]} />
    </Frame>
  )
}

export function StillOpen() {
  const step = useStep()
  return (
    <Frame eyebrow="What is still open">
      <Grid2x2
        cols={['Templates and battlecards', 'The long tail: ordinary decks, proposals, FAQs, seller copies']}
        rows={['Numbers change', 'Narrative changes']}
        cell={(_, c) => c === 0
          ? <Reveal at={1}>Covered.</Reveal>
          : <div className={step >= 2 ? 'lit-wrap' : ''}><Reveal at={2}>Not reached.</Reveal></div>}
      />
      <Reveal at={2}><p className="caption">Change reaches templates. It does not reach the long tail, where most selling content lives.</p></Reveal>
    </Frame>
  )
}

const ASSUMPTIONS = [
  'Most selling content is ordinary decks and documents, not templates.',
  'Admins will not trust silent AI edits.',
  'Every claim can have one owner.',
  'CRM and calendar data is available.',
  'Sellers act on short alerts, not change logs.',
]
export function Assumptions() {
  return (
    <Frame eyebrow="Assumptions" title="What I assumed, and did not test.">
      <ul className="assumptions">
        {ASSUMPTIONS.map(a => <li key={a}><span className="tag">assumption</span><span>{a}</span></li>)}
      </ul>
    </Frame>
  )
}
