// Act 4 (the prototype) and Act 5: Close.
import { Frame, Reveal, Steps, useStep } from '../deck/blocks'

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
