// Act 3: The idea (slides 10–21).
import type { ReactNode } from 'react'
import { BeforeAfter, Cards, Counter, Frame, Reveal, Statement, Steps, useStep } from '../deck/blocks'
import { chain, change, derived, facts, lanes, messages, retire } from '../data/ledgerly'

const discount = facts[0]

// The chart baked into the pricing slide: the number lives in pixels.
export function PricingChart({ pct = 20 }: { pct?: number }) {
  const top = 40, h = 110, cut = (h * pct) / 100
  return (
    <svg className="mini-chart" viewBox="0 0 260 172" role="img" aria-label={`Chart: monthly vs annual cost, ${pct}% saved`}>
      <text x="0" y="14" className="mc-title">Monthly vs annual cost</text>
      <rect x="20" y={top} width="80" height={h} className="mc-bar" />
      <rect x="150" y={top + cut} width="80" height={h - cut} className="mc-bar strong" />
      <line x1="0" x2="260" y1={top + h} y2={top + h} className="mc-axis" />
      <text x="60" y="168" textAnchor="middle" className="mc-lab">Monthly</text>
      <text x="190" y="168" textAnchor="middle" className="mc-lab">Annual</text>
      <text x="190" y={top + cut - 10} textAnchor="middle" className="mc-tag">{pct}% saved</text>
    </svg>
  )
}

// One seller-facing slide, reused wherever the deck shows content: headline, discount line, chart, compliance line.
function PricingSlide({ discount = change.from, banner, label = 'Mock · Ledgerly pricing, slide 4' }: { discount?: ReactNode; banner?: ReactNode; label?: string }) {
  return (
    <div className="mock-slide pricing">
      <div className="mock-label">{label}</div>
      {banner}
      <div className="ps-text">
        <h3>Pricing that grows with you</h3>
        <p className="mock-big">Save {discount} with annual billing.</p>
        <p className="muted">Built for audited teams. SOC 2 Type II.</p>
      </div>
      <PricingChart />
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
          <div className="ex-layer base"><span className="mock-label">Mock · Ledgerly pricing, slide 4</span></div>
          {layer(1, 'Text', <div className="ex-text"><h3>Pricing that grows with you</h3><p>Save <span className="ghost">20%</span> with annual billing.</p><p className="muted"><span className="ghost">Built for audited teams.</span> SOC 2 Type II.</p></div>)}
          {layer(2, 'Media', <div className="ex-media"><PricingChart /></div>)}
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
      <PricingSlide label="Mock · an existing deck, as it is today" discount={step >= 2 ? <Token name={discount.token} value={change.from} /> : (
        <span className={`ai-mark ${step >= 1 ? 'on' : ''}`}>
          {change.from}
          {step >= 1 && <span className="ai-tip">This is the annual discount. Link it?</span>}
        </span>
      )} />
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
              {i === 0 && <span className="chain-why">{retire.places} places in {retire.assets} assets. Why each goes: not opened in 6 months, in no deal room, or a newer version exists. Owners can object for 14 days.</span>}
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
      <PricingSlide banner={step >= 1 && <div className="outdated">Pricing on this slide is outdated. Current annual discount: {change.to}.</div>} />
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


export function OwnerConfirm() {
  const step = useStep()
  return (
    <Frame eyebrow="The owner confirms" illustrative>
      <div className="split">
        <div>
          <p className="lead">A change starts where the fact lives. {change.owner} confirms it once, for every asset.</p>
          <Reveal at={2}><p className="caption">Nothing in sales content moves until the owner says so.</p></Reveal>
        </div>
        <div className="mock-panel">
          <div className="mock-label">Mock · {change.owner}, in Prism</div>
          <div className="eyebrow">{change.source} changed</div>
          <div className="mp-diff"><s>{change.from}</s> → {change.to}</div>
          <dl>
            <dt>Token</dt><dd><Token name={change.token} /></dd>
            <dt>Effective</dt><dd>{change.effective}, {change.regions.toLowerCase()}</dd>
            <dt>Used in</dt><dd>{change.places} places</dd>
          </dl>
          <div className="mp-actions">
            <span className={`mp-btn primary`}>{step >= 1 ? 'Confirmed' : 'Confirm for sales content'}</span>
            {step < 1 && <span className="mp-btn">Not yet</span>}
          </div>
        </div>
      </div>
    </Frame>
  )
}

export function UploadCheck() {
  const rows: [string, string, string, string][] = [
    ['Slide 5', '"Save 20% with annual billing"', `Outdated. Current: ${change.to}`, 'Fix and link'],
    ['Slide 8', '"$29 per seat per month"', 'Matches {starter_price}', 'Link'],
    ['Slide 12', '"SOC 2 Type II"', 'Matches {soc2_status}', 'Link'],
  ]
  return (
    <Frame eyebrow="Upload check" title="New files can't bring old claims back.">
      <div className="mock-panel wide">
        <div className="mock-label">Mock · uploading Q4 partner deck.pptx</div>
        <div className="mp-head"><span>Checked 24 slides.</span><Reveal at={1} as="span"><b>3 claims found.</b></Reveal></div>
        {rows.map(([where, text, verdict, act], i) => (
          <Reveal key={where} at={1} className={`mp-row ${i === 0 ? 'hot' : ''}`}>
            <span className="muted">{where}</span><span>{text}</span><span className={i === 0 ? '' : 'muted'}>{verdict}</span><span className="mp-btn">{act}</span>
          </Reveal>
        ))}
        <Reveal at={2} className="mp-actions"><span className="mp-btn primary">Fix 1, link 3, upload</span><span className="mp-btn">Upload as is</span></Reveal>
      </div>
      <Reveal at={2}><p className="caption">The library stops growing new places to fix.</p></Reveal>
    </Frame>
  )
}

export function NarrativeChange() {
  const m = messages[0]
  return (
    <Frame eyebrow="When the story changes" illustrative>
      <div className="split">
        <div className="claim-card">
          <div className="eyebrow">Message</div>
          <div className="msg-value">{m.text}</div>
          <dl>
            <dt>Owner</dt><dd>{m.owner}</dd>
            <dt>Source</dt><dd>{m.source}</dd>
            <dt>Used in</dt><dd>{m.usedIn} places</dd>
          </dl>
        </div>
        <div>
          <Reveal at={1}>
            <div className="eyebrow">AI proposes, place by place</div>
            <div className="msg-diff"><s>Pricing that grows with you</s><span>Built for audited teams</span></div>
            <p className="caption">Headline of the pricing overview, slide 4.</p>
          </Reveal>
          <Reveal at={2}><p className="lead">No token can carry a story. Every narrative edit goes to the judgment lane, and {m.owner} approves it.</p></Reveal>
        </div>
      </div>
    </Frame>
  )
}
