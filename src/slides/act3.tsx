// Act 3: The idea (slides 10–21).
import type { ReactNode } from 'react'
import { BeforeAfter, Cards, Counter, Frame, Reveal, Statement, Steps, useStep } from '../deck/blocks'
import { chain, change, derived, facts, lanes } from '../data/ledgerly'

const discount = facts[0]

// A seller-facing deck slide, drawn as a mock.
function MockSlide({ children, label = 'Ledgerly pricing · slide 4' }: { children: ReactNode; label?: string }) {
  return (
    <div className="mock-slide">
      <div className="mock-label">{label}</div>
      {children}
    </div>
  )
}
const Token = ({ name, value }: { name: string; value?: string }) => (
  <span className="token">{`{${name}}`}{value && <b> {value}</b>}</span>
)

export function Reframe() {
  return <Frame center><Statement lines={["Files don't go stale.", 'Claims do.']} /></Frame>
}

export function TwoKinds() {
  return (
    <Frame eyebrow="Two kinds of change">
      <Cards items={[
        { at: 0, title: 'Numbers', body: `Annual discount: ${change.from} to ${change.to}.` },
        { at: 1, title: 'Narrative', body: 'Stop leading with price. Lead with compliance.' },
      ]} />
      <Reveal at={2}><p className="lead">Tokens can carry numbers. Only reading for meaning can carry narrative.</p></Reveal>
    </Frame>
  )
}

// Exploded view: the flat slide tilts and its layers lift apart, one per step.
export function Anatomy() {
  const step = useStep()
  const layer = (i: number, name: string, body: ReactNode) => (
    <div className={`ex-layer ${step >= i ? 'lifted' : ''} ${i === 3 && step >= 3 ? 'strong' : ''}`} style={{ ['--z' as string]: step >= i ? `${i * 90}px` : '0px' }}>
      {body}
      <span className={`ex-name eyebrow ${step >= i ? 'in' : ''}`}>{name}</span>
    </div>
  )
  return (
    <Frame eyebrow="Anatomy of content">
      <div className="ex-wrap">
        <div className={`ex-stack ${step >= 1 ? 'tilted' : ''}`}>
          <div className="ex-layer base"><span className="mock-label">Mock · Ledgerly pricing slide</span></div>
          {layer(1, 'Text', <div className="ex-text"><h3>Pricing that grows with you</h3><p>Save <span className="ghost">20%</span> with annual billing.</p><p><span className="ghost">Built for audited teams.</span></p></div>)}
          {layer(2, 'Media', <div className="ex-media"><div className="mock-media">chart</div></div>)}
          {layer(3, 'Claims', <div className="ex-claims">
            <span className="claim-fact"><Token name={discount.token} /><span className="hidden-val">{discount.value}</span></span>
            <span className="claim-msg">message: built for audited teams</span>
          </div>)}
        </div>
      </div>
      <Reveal at={3}><p className="caption">Content is text, media and claims. Claims are what go out of date.</p></Reveal>
    </Frame>
  )
}

export function ClaimHome() {
  return (
    <Frame eyebrow="A claim has a home" illustrative>
      <div className="claim-card">
        <Token name={discount.token} />
        <div className="claim-value">{discount.value}</div>
        <dl>
          <dt>Owner</dt><dd>{discount.owner}</dd>
          <dt>Source</dt><dd>{discount.source}</dd>
          <dt>Last checked</dt><dd>{discount.lastChecked}</dd>
        </dl>
        <Reveal at={1}><div className="claim-used">Used in {discount.usedIn} places</div></Reveal>
      </div>
    </Frame>
  )
}

export function GettingThere() {
  const step = useStep()
  return (
    <Frame eyebrow="Getting there">
      <MockSlide label="An existing deck, as it is today">
        <p className="mock-big">
          Save{' '}
          {step >= 2 ? <Token name={discount.token} value={change.from} /> : (
            <span className={`ai-mark ${step >= 1 ? 'on' : ''}`}>
              {change.from}
              {step >= 1 && <span className="ai-tip">This is the annual discount. Link it?</span>}
            </span>
          )}{' '}
          with annual billing.
        </p>
      </MockSlide>
      <Reveal at={2}><p className="caption">AI reads the library you already have and builds the claim library. Nothing is rebuilt as a template.</p></Reveal>
    </Frame>
  )
}

export function WhereItStops() {
  return (
    <Frame eyebrow="Where it stops" title="Where tokens stop working.">
      <Cards cols={4} items={[
        { at: 1, title: 'A claim built on a fact', body: '"The best discount in the market."', meta: 'Judgment lane' },
        { at: 2, title: 'A number derived from it', body: `"Saves a ${derived.seats} seat team $${derived.before.toLocaleString('en-US')} a year."`, meta: 'Judgment lane' },
        { at: 3, title: 'Charts, images and video', body: 'The number is in pixels, not text.', meta: 'Judgment lane' },
        { at: 4, title: 'PDFs already sent', body: 'The copy is in a buyer\'s inbox.', meta: 'Seller alert' },
      ]} />
    </Frame>
  )
}

export function OneChange() {
  const step = useStep()
  return (
    <Frame eyebrow="One change" illustrative center>
      <p className="lead">Finance changes {change.from} to {change.to}.</p>
      <div className="big-num"><Counter value={step >= 1 ? chain[0].left : 0} ms={1200} /></div>
      <Reveal at={1}><p className="lead">Places to fix. Now what?</p></Reveal>
    </Frame>
  )
}

export function ThreeLanes() {
  const step = useStep()
  const max = lanes.tokens
  const lane = (at: number, name: string, count: number, unit: string, text: string) => (
    <div className="lane">
      <div className="eyebrow">{name}</div>
      <div className="lane-track">
        <div className="lane-bar" style={{ height: step >= at ? `${(count / max) * 100}%` : 0 }} />
      </div>
      <Reveal at={at}><div className="lane-count">{count} {unit}</div><p>{text}</p></Reveal>
    </div>
  )
  return (
    <Frame eyebrow="Three lanes" illustrative>
      <div className="lanes">
        {lane(1, 'Token', lanes.tokens, 'edits', 'Updates when the owner approves.')}
        {lane(2, 'Same wording', lanes.groupedMatches, 'matches', 'Grouped. Approve once.')}
        {lane(3, 'Judgment', lanes.judgment, 'items', 'Read for meaning. Decided by a person.')}
      </div>
    </Frame>
  )
}

export function Shrink() {
  const step = useStep()
  return (
    <Frame eyebrow="Shrink the queue" illustrative>
      <div className="split">
        <div>
          <div className="big-num"><Counter value={chain[Math.min(step, 4)].left} /></div>
          <Reveal at={4}><p className="lead"><b>{chain[0].left} edits. {lanes.decisions} decisions.</b></p><p className="caption">Review the claim once, not the file {chain[0].left} times.</p></Reveal>
        </div>
        <ol className="chain">
          {chain.slice(1).map((c, i) => (
            <Reveal key={i} as="li" at={i + 1}>
              <span>{c.move}</span><span className="muted">−{c.removes}</span><b>{c.left}</b>
            </Reveal>
          ))}
        </ol>
      </div>
    </Frame>
  )
}

export function SafeWhileDrains() {
  const step = useStep()
  return (
    <Frame eyebrow="Safe while it drains">
      <p className="caption">A seller opens a deck nobody has fixed yet.</p>
      <MockSlide>
        {step >= 1 && <div className="outdated">Pricing on this slide is outdated. Current annual discount: {change.to}.</div>}
        <h3>Pricing that grows with you</h3>
        <p className="mock-big">Save {change.from} with annual billing.</p>
      </MockSlide>
    </Frame>
  )
}

export function AdminJob() {
  return (
    <Frame eyebrow="How AI changes the admin's job">
      <BeforeAfter rows={[
        ['Search', 'Review'],
        ['Rewrite', 'Approve'],
        ['Announce to everyone', 'Alert the sellers who need it'],
      ]} />
    </Frame>
  )
}

export function Principles() {
  return (
    <Frame eyebrow="Principles" title="The rules behind every screen.">
      <Steps items={['AI proposes. A person approves.', 'Every edit shows its source.', 'Urgency follows seller exposure.']} />
    </Frame>
  )
}

