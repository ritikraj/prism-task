// Act 3: The idea (slides 10–21).
import type { ReactNode } from 'react'
import { BeforeAfter, Cards, Counter, Frame, Reveal, Statement, Steps, useStep } from '../deck/blocks'
import { chain, change, company, derived, drift, facts, lanes, messages, retire, sellersAtRisk } from '../data/ledgerly'

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

// The mock pricing slide in slide 11's card: base, text and media. Shared by Anatomy and Getting there.
const MockBase = ({ label }: { label: string }) => (
  <>
    <span className="mock-label">{label}</span>
    <span className="ex-brand">Ledgerly</span>
    <div className="ex-foot"><span>Pricing overview v7</span><span>Confidential · 4</span></div>
  </>
)
const MockText = ({ discount }: { discount: ReactNode }) => (
  <div className="ex-text">
    <h3>Pricing that grows with you</h3>
    <p>Starter from <span className="ghost">$29 per seat per month</span>.</p>
    <p>Save {discount} with annual billing.</p>
    <p className="muted"><span className="ghost">Built for audited teams.</span> <span className="ghost">SOC 2 Type II</span>.</p>
  </div>
)
const MockMedia = () => (
  <>
    <div className="ex-media"><PricingChart /></div>
    <div className="ex-logos"><span className="eyebrow">Trusted by</span>{['Halden', 'Norvik', 'Clearwater'].map(n => <span key={n} className="ex-logo">{n}</span>)}</div>
  </>
)

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
          <div className="ex-layer base"><MockBase label="Mock · Ledgerly pricing, slide 4" /></div>
          {layer(1, 'Text', <MockText discount={<span className="ghost">{discount.value}</span>} />)}
          {layer(2, 'Media', <MockMedia />)}
          {layer(3, 'Claims', <div className="ex-text ex-claims">
            <h3 className="ex-spacer">Pricing that grows with you</h3>
            <p><Token name="starter_price" /></p>
            <p><span className="claim-fact"><Token name={discount.token} /><span className="hidden-val">{discount.value}</span></span></p>
            <p className="ex-claim-row"><span className="claim-msg">message: built for audited teams</span><Token name="soc2_status" /></p>
          </div>)}
        </div>
      </div>
      <Reveal at={3}><p className="caption">Content is text, media and claims. Claims are what go out of date.</p></Reveal>
    </Frame>
  )
}

// The claim library as a table: every claim has one home. Our 20% is one row of many.
export function ClaimHome() {
  const step = useStep()
  const rows: [string, string, string, string, string][] = [
    ...['starter_price', 'rivalset_price', 'annual_discount', 'soc2_status'].map(t => facts.find(f => f.token === t)!).map(f => [f.token, 'Fact', f.value, f.owner, f.source] as [string, string, string, string, string]),
    ...messages.map(m => [m.text, 'Message', '', m.owner, m.source] as [string, string, string, string, string]),
  ]
  return (
    <Frame eyebrow="A claim has a home" title="Every claim lives in one place." illustrative>
      <table className="claim-table">
        <thead><tr><th>Claim</th><th>Type</th><th>Value</th><th>Owner</th><th>Source</th></tr></thead>
        <tbody>{rows.map(([name, type, value, owner, source]) => {
          const hl = name === discount.token
          return (
            <tr key={name} className={step >= 1 ? (hl ? 'hl' : 'dim') : ''}>
              <td>{type === 'Fact' ? <Token name={name} /> : name}</td>
              <td className="muted">{type}</td><td>{value}</td><td>{owner}</td><td className="muted">{source}</td>
            </tr>
          )
        })}</tbody>
      </table>
    </Frame>
  )
}

export function GettingThere() {
  const step = useStep()
  const value = step >= 2 ? (
    <span className="claim-link" tabIndex={0}>
      {change.from}
      <span className="claim-pop" role="tooltip">
        <Token name={discount.token} />
        <dl>
          <dt>Type</dt><dd>Fact</dd>
          <dt>Value</dt><dd>{discount.value}</dd>
          <dt>Owner</dt><dd>{discount.owner}</dd>
          <dt>Source</dt><dd>{discount.source}</dd>
        </dl>
      </span>
    </span>
  ) : (
    <span className={`ai-mark ${step >= 1 ? 'on' : ''}`}>
      {change.from}
      {step >= 1 && <span className="ai-tip"><span className="ai-ic" />This is the annual discount. Link it?</span>}
    </span>
  )
  return (
    <Frame eyebrow="Getting there">
      <div className="ex-wrap">
        <div className="ex-stack flat">
          <div className="ex-layer base"><MockBase label="Mock · an existing deck, as it is today" /></div>
          <div className="ex-layer" style={{ ['--z' as string]: '1px' }}><MockText discount={value} /></div>
          <div className="ex-layer"><MockMedia /></div>
        </div>
      </div>
      <Reveal at={2}><p className="caption"><span className="ai-ic" /> AI reads the library you already have and builds the claim library. Nothing is rebuilt as a template.</p></Reveal>
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

// The four ways a place gets fixed, matching the prototype's change modal. 336 = 456 minus the 120 retired.
export function FourLanes() {
  const step = useStep()
  const max = lanes.tokens
  const lane = (at: number, name: ReactNode, count: number, unit: string, text: string, ai = false) => (
    <div className="lane">
      <div className="eyebrow">{name}</div>
      <div className="lane-track">
        <div className={`lane-bar ${ai ? 'ai' : ''}`} style={{ height: step >= at ? `${(count / max) * 100}%` : 0 }} />
      </div>
      <Reveal at={at}><div className="lane-count">{count} {unit}</div><p>{text}</p></Reveal>
    </div>
  )
  return (
    <Frame eyebrow="Four lanes" illustrative>
      <div className="lanes">
        {lane(1, 'Token', lanes.tokens, 'places', 'Already updated when Finance confirmed. Nobody reviews them.')}
        {lane(2, <span className="ai-label"><span className="ai-ic" /><span className="ai-text">Same sentence</span></span>, lanes.groupedMatches, 'places', `AI finds them and writes the new sentence. Approve & Publish once per group, ${lanes.groups} groups.`, true)}
        {lane(3, 'One by one', lanes.judgment, 'items', 'Read for meaning. Approve & Publish, or send to Product marketing.')}
        {lane(4, 'Already sent', sellersAtRisk.copies, 'copies', 'In buyer inboxes, so not editable. The seller gets the updated file.')}
      </div>
      <p className="caption">{chain[1].left} places once the {retire.places} unused ones are retired. Urgency decides the order; the lane decides the work.</p>
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
              {i === 2 ? <span className="ai-label"><span className="ai-ic" /><span className="ai-text">{c.move}</span></span> : <span>{c.move}</span>}
              <span className="muted">−{c.removes}</span><b>{c.left}</b>
              {i === 0 && <span className="chain-why">{retire.places} places in {retire.assets} assets. Why each goes: not opened in 6 months, in no deal room, or a newer version exists. Owners can object for 14 days.</span>}
              {i === 2 && <span className="chain-why">AI finds the discount written as plain text, proposes the new sentence, and groups identical ones. You approve each group once.</span>}
            </Reveal>
          ))}
        </ol>
      </div>
    </Frame>
  )
}

// The queue is a moving target: other teams keep adding old-value content. Gate both ends.
const Gate = ({ top, bottom, shut, ai }: { top?: ReactNode; bottom?: ReactNode; shut: boolean; ai?: boolean }) => (
  <div className="gate">
    <div className="gate-top">{top}</div>
    <div className="gate-arrow">{shut && <span className={`gate-bar ${ai ? 'ai' : ''}`} />}</div>
    <div className="gate-bottom">{bottom}</div>
  </div>
)
export function GateBothSides() {
  const step = useStep()
  return (
    <Frame eyebrow="Gate both sides" title={`${change.places} is not a fixed number.`}>
      <div className="gates">
        <div className="gate-node">
          <div className="eyebrow">Creators</div>
          <p>Other teams keep making content while you review.</p>
          <Reveal at={1}><ul className="gate-list">{drift.sources.map(([team, what, n]) => <li key={team}><b>+{n}</b> {team}: {what}</li>)}</ul></Reveal>
        </div>
        <Gate shut={step >= 2} ai
          top={<Reveal at={1}><b>+{drift.week} places this week</b> still say {change.from}</Reveal>}
          bottom={<Reveal at={2}><div className="ai-label"><span className="ai-ic" /><span className="ai-text">On upload and save</span></div><p>AI spots {change.from} in new content and offers the token.</p></Reveal>} />
        <div className="gate-node lib">
          <div className="eyebrow">Library</div>
          <div className="gate-num"><Counter value={change.places + (step >= 1 ? drift.week : 0)} /></div>
          <p>{step >= 2 ? 'places to fix, and no longer growing' : `places say ${change.from}`}</p>
        </div>
        <Gate shut={step >= 2}
          top={<Reveal at={1}><b>{sellersAtRisk.withMeetings} sellers</b> with meetings can open them today</Reveal>}
          bottom={<Reveal at={2}><div>On open and share</div><p>A notification and a banner show {change.to}.</p></Reveal>} />
        <div className="gate-node">
          <div className="eyebrow">Sellers</div>
          <p>{company.sellers} sellers open, download and send content to buyers.</p>
        </div>
      </div>
      <Reveal at={2}><p className="lead">Nothing new gets in with {change.from}. Nothing old reaches a buyer without a warning.</p></Reveal>
    </Frame>
  )
}

export function SafeWhileDrains() {
  const step = useStep()
  return (
    <Frame eyebrow="Safe while it drains">
      <div className="ex-wrap">
        <div className="ex-stack flat">
          <div className="ex-layer base"><MockBase label="Mock · Ledgerly pricing, slide 4" /></div>
          <div className="ex-layer"><MockText discount={change.from} /></div>
          <div className="ex-layer"><MockMedia /></div>
          <div className="ex-layer" style={{ ['--z' as string]: '2px' }}>
            {step >= 1 && <div className="outdated">Pricing on this slide is outdated. Current annual discount: {change.to}.</div>}
          </div>
        </div>
      </div>
      <p className="caption">A seller opens a deck nobody has fixed yet.</p>
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
        <div className="mp-head"><span>Checked 24 slides.</span><Reveal at={1} as="span"><b className="ai-label"><span className="ai-ic" /><span className="ai-text">3 claims found.</span></b></Reveal></div>
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
            <div className="eyebrow ai-label"><span className="ai-ic" /><span className="ai-text">AI proposes, place by place</span></div>
            <div className="msg-diff"><s>Pricing that grows with you</s><span>Built for audited teams</span></div>
            <p className="caption">Headline of the pricing overview, slide 4.</p>
          </Reveal>
          <Reveal at={2}><p className="lead">No token can carry a story. Every narrative edit goes to the judgment lane, and {m.owner} approves it.</p></Reveal>
        </div>
      </div>
    </Frame>
  )
}
