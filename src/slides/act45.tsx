// Act 4 (slides 22–23) and Act 5: Close (slides 25–27).
import { Frame, Reveal, Steps, useStep } from '../deck/blocks'
import { Svg, Node, Line, on } from '../deck/svg'
import { sellersAtRisk } from '../data/ledgerly'

export function SystemModel() {
  const step = useStep()
  return (
    <Frame eyebrow="System model" title="The data the prototype runs on.">
      <div className="fill">
        <Svg w={1600} h={640}>
          <path d="M1030 330L1220 200M1030 370L1220 480" className="link" />
          <Node x={900} y={350} w={260} h={110} label={'Claim\n(fact or message)'} strong />
          <Node x={1360} y={180} w={280} label="Asset" strong={step >= 2} />
          <Node x={1360} y={500} w={280} h={110} label={'Copy in\ncirculation'} strong={step >= 2} />
          <g className={`fade${on(step >= 1)}`}>
            <Node x={150} y={350} w={220} label="Source" strong />
            <Node x={500} y={350} w={260} label="Change event" strong />
          </g>
          <Line d="M260 350H368" show={step >= 1} arrow />
          <Line d="M630 350H768" show={step >= 1} arrow />
          <g className={`fade${on(step >= 2)}`}><Node x={900} y={90} w={260} label="Owner approves" strong /></g>
          <Line d="M900 132V293" show={step >= 2} arrow />
          <Line d="M1030 320L1218 205" show={step >= 2} arrow className="thick" />
          <Line d="M1030 380L1218 475" show={step >= 2} arrow className="thick" />
        </Svg>
      </div>
    </Frame>
  )
}

const FLOW: [string, string][] = [
  ['Home', 'Changes arrive from their source, sorted by deals at risk.'],
  ['Impact', 'Where the claim lives, ranked by upcoming meetings.'],
  ['Review', 'In three lanes: tokens, same wording groups, judgment.'],
  ['Go live', `Approved edits go live. Only the ${sellersAtRisk.withMeetings} sellers who need it are told.`],
  ['Tracking', 'Who saw it, and copies already in buyer inboxes.'],
  ['Library', 'Scans and merges make the next change smaller.'],
]
export function Flow() {
  return (
    <Frame eyebrow="The flow" title="What the prototype walks through.">
      <ol className="flow">
        {FLOW.map(([t, d], i) => (
          <Reveal key={t} as="li" at={i + 1}>
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <b>{t}</b>
            <span className="muted">{d}</span>
          </Reveal>
        ))}
      </ol>
    </Frame>
  )
}

export function Measure() {
  return (
    <Frame eyebrow="What I would measure" title="Outcomes, without crediting deals to single assets.">
      <Steps items={[
        'Sellers who saw the update before their meeting.',
        'Stale copies still in use.',
        'Time from change to fixed.',
        'Size of the judgment lane over time.',
      ]} />
    </Frame>
  )
}

export function Validate() {
  return (
    <Frame eyebrow="How I would validate and ship it">
      <div className="cols3">
        <Reveal at={1} className="col">
          <h2>Validate first.</h2>
          <p>Five admin interviews and a library audit at one customer, testing two assumptions: how much selling content is ordinary rather than templated, and whether admins trust grouped approval.</p>
        </Reveal>
        <Reveal at={2} className="col">
          <h2>Ship in phases.</h2>
          <ol className="phases">
            <li><span className="eyebrow">Phase 1</span>Claim library and tokens for pricing.</li>
            <li><span className="eyebrow">Phase 2</span>Change intake and the three lanes.</li>
            <li><span className="eyebrow">Phase 3</span>Seller alerts and sent copies.</li>
            <li><span className="eyebrow">Phase 4</span>Narrative changes from messaging briefs.</li>
          </ol>
        </Reveal>
        <Reveal at={3} className="col">
          <h2>Who it needs.</h2>
          <p>Finance, Product marketing and Security as claim owners from day one.</p>
          <p>Engineering on matching accuracy, since a wrong match breaks trust faster than a slow one.</p>
        </Reveal>
      </div>
    </Frame>
  )
}

export function Next() {
  return (
    <Frame eyebrow="What is next, and what I left out">
      <div className="statement">
        <Reveal at={1}><p>Next: narrative changes at scale. Claims inside video.</p></Reveal>
        <Reveal at={2}><p className="muted">Left out on purpose: targeting, attribution, seller search, monitoring calls.</p></Reveal>
      </div>
      <Reveal at={2}>
        <div className="end-row">
          <span className="lead">Thank you.</span>
          <a className="end-link" href="#/prototype/0">Open the prototype</a>
        </div>
      </Reveal>
    </Frame>
  )
}
