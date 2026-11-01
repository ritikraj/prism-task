// Prism prototype: Home, then one change end to end. Own component system (proto.css), separate from the deck.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import './proto.css'
import {
  admin, batch, change, company, dashboard, facts, impactAssets, lanes, merge, pastChanges, retire, scan, sellerAlert,
  sellersAtRisk, staleHolders, today, tracking,
} from '../data/ledgerly'
import {
  useProto, notHere, groups, judgment, DETAILED, GUIDE, CHANGE_ROUTES, LIBRARY_ROUTES, CLAIM_ROUTES, decisionsLeft, placesApproved, scanLinked, spotsLeft,
  type Route,
} from './store'
import { Conf, Head, Ic, Pri, Sheet, Stats } from './ui'
import { Asset, Claim, Claims, Library, Merge, Scan } from './Screens3'

const SCREENS: Record<Route, () => JSX.Element> = {
  home: Home, batch: Home, impact: Home, review: Home, golive: Home, tracking: Home,
  scan: Scan, merge: Merge, claims: Claims, claim: Claim, library: Library, asset: Asset,
}
const RAIL: [string, string, Route | null][] = [
  ['Home', 'M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z', 'home'],
  ['Claims', 'M4 9h16M4 15h16M10 3L8 21M16 3l-2 18', 'claims'],
  ['Library', 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'library'],
]

export default function Prototype() {
  const { route, guide, toast, claim, sheet, allOpen, go, set, reset } = useProto()
  const root = useRef<HTMLDivElement>(null)
  const [full, setFull] = useState(false)
  useEffect(() => {
    const on = () => setFull(document.fullscreenElement === root.current)
    document.addEventListener('fullscreenchange', on)
    return () => document.removeEventListener('fullscreenchange', on)
  }, [])
  const toggleFull = () => (full ? document.exitFullscreen() : root.current?.requestFullscreen())
  const fullBtn = (
    <button className="p-icon" aria-label={full ? 'Exit full screen' : 'Full screen'} title={full ? 'Exit full screen' : 'Full screen'} onClick={toggleFull}>
      {full ? <Ic d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /> : <Ic d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />}
    </button>
  )
  const gi = GUIDE.findIndex(g => g.route === route)
  const inChange = CHANGE_ROUTES.includes(route)
  // Changes open as side modals over Home; no change has a page of its own.
  const Screen = SCREENS[route]
  const section: Route = LIBRARY_ROUTES.includes(route) ? 'library' : CLAIM_ROUTES.includes(route) ? 'claims' : 'home'
  const CRUMBS: Record<Route, string[]> = {
    home: ['Home'], batch: ['Home'], impact: ['Home'], review: ['Home'], golive: ['Home'], tracking: ['Home'],
    library: ['Library', 'All content'], asset: ['Library', 'Ledgerly pricing overview v7'], scan: ['Library', 'Scan results'],
    merge: ['Library', 'Duplicates'], claims: ['Claims'], claim: ['Claims', claim],
  }
  const crumbs = CRUMBS[route]
  return (
    <div className="p-root" ref={root}>
      <div className="p-app">
        <nav className="p-rail">
          <div className="p-mark">P</div>
          {RAIL.map(([label, d, r]) => (
            <button key={label} className={`p-rail-btn ${r === section ? 'on' : ''}`} title={label} aria-label={label} onClick={() => (r ? go(r) : notHere())}><Ic d={d} size={20} /></button>
          ))}
          <div className="p-grow" />
          <button className="p-rail-btn" title="Notifications" aria-label="Notifications" onClick={notHere}><Ic d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4" size={20} /></button>
          <div className="p-avatar" title={`${admin.name}, ${admin.role}`}>{admin.initials}</div>
        </nav>
        <div className="p-body">
          <header className="p-top">
            {crumbs.map((c, i) => i < crumbs.length - 1
              ? <span key={c}><button className="p-crumb" onClick={() => go(section)}>{c}</button><span className="p-sep">/</span></span>
              : <span key={c} className="p-crumb-now">{c}</span>)}
            <span className="p-grow" /><span className="p-muted p-small">{company.name} · {today}</span>
          </header>
          <div className="p-panel">
            {section === 'library' && <LibraryNav />}
            <main className="p-main"><Screen /></main>
          </div>
        </div>
        {inChange && <ChangeSheet />}
        {route === 'batch' && <BatchSheet />}
        {route === 'batch' && sheet && <TierSheet />}
        {allOpen && <AllChanges />}
      </div>
      {guide ? (
        <div className="p-caption">
          <span className="p-caption-n">{gi >= 0 ? `Step ${gi + 1} of ${GUIDE.length}` : 'Off the guided path'}</span>
          <span className="p-grow">{gi >= 0 ? GUIDE[gi].caption : 'Explore freely. Use the dots to return to the guided path.'}</span>
          <span className="p-dots">{GUIDE.map((g, i) => <button key={g.route} aria-label={`Step ${i + 1}`} className={i === gi ? 'on' : ''} onClick={() => go(g.route)} />)}</span>
          <button className="p-link" onClick={reset}>Reset demo</button>
          {fullBtn}
          <button className="p-icon" aria-label="Collapse guide" title="Collapse" onClick={() => set({ guide: false })}><Ic d="M6 9l6 6 6-6" /></button>
        </div>
      ) : (
        <div className="p-fab">
          <button className="p-icon" aria-label="Previous step" title="Previous step" disabled={gi <= 0} onClick={() => go(GUIDE[gi - 1].route)}><Ic d="M15 6l-6 6 6 6" /></button>
          <button className="p-icon" aria-label="Next step" title="Next step" disabled={gi < 0 || gi === GUIDE.length - 1} onClick={() => go(GUIDE[gi + 1].route)}><Ic d="M9 6l6 6-6 6" /></button>
          <button className="p-icon" aria-label="Open guide" title="Open guide" onClick={() => set({ guide: true })}><Ic d="M6 15l6-6 6 6" /></button>
          {fullBtn}
        </div>
      )}
      {toast && <div className="p-toast">{toast}</div>}
    </div>
  )
}

// Inner navigation for the library.
function LibraryNav() {
  const { route, go, merged } = useProto()
  const s = useProto()
  const items: [Route, string, string][] = [
    ['library', 'All content', '1,240'], ['scan', 'Scan results', `${spotsLeft(s)} left`], ['merge', 'Duplicates', merged ? '0' : '1'],
  ]
  return (
    <aside className="p-sub">
      <div className="p-sub-title">Library</div>
      <div className="p-sub-list">
        {items.map(([r, label, meta]) => (
          <button key={r} className={`p-sub-item ${route === r || (r === 'library' && route === 'asset') ? 'on' : ''}`} onClick={() => go(r)}>
            <span className="p-grow">{label}</span><span className="p-muted p-small">{meta}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}

const TABS = { impact: Impact, review: Review, golive: GoLive, tracking: Tracking }

// The annual discount change: Impact, Review, Go live, Tracking as tabs.
function ChangeSheet() {
  const s = useProto()
  const tabs: [Route, string, boolean][] = [
    ['impact', `Impact · ${change.places} places`, false],
    ['review', `Review · ${decisionsLeft(s)} left`, false],
    ['golive', s.live ? 'Go live · Live' : 'Go live', false],
    ['tracking', 'Tracking', !s.live],
  ]
  const Body = TABS[s.route as keyof typeof TABS]
  return (
    <Sheet title={change.title} sub={`${change.source} sync, ${change.synced}. Confirmed by ${change.owner}. Effective ${change.effective}, ${change.regions.toLowerCase()}.`} onClose={() => s.go('home')}
      tabs={<div className="p-tabs">{tabs.map(([r, label, off]) => <button key={r} className={s.route === r ? 'on' : ''} disabled={off} onClick={() => s.go(r)}>{label}</button>)}</div>}>
      <Body />
    </Sheet>
  )
}

// One tier of the batch. Token only, so there is nothing to review.
function TierSheet() {
  const { sheet, scheduled, ukScheduled, set } = useProto()
  const [tier, token, from, to] = batch.tiers.find(t => t[1] === sheet)!
  const uk = tier === batch.exception.tier
  const eff = uk ? batch.exception.effective : batch.effective
  const done = uk ? ukScheduled : scheduled
  return (
    <Sheet title={`${tier} price`} sub={`${from} to ${to} · effective ${eff}. Part of ${batch.title}.`} onClose={() => set({ sheet: null })}>
      <div className="p-summary">
        <div className="p-stat"><b>{from}</b><span>now</span></div>
        <div className="p-stat"><b>{to}</b><span>new</span></div>
        <div className="p-stat"><b>{eff}</b><span>effective</span></div>
      </div>
      <div className="p-banner">Every place holding <code>{`{${token}}`}</code> updates by itself on {eff}. Nothing to rewrite or review.</div>
      <div>{done ? <span className="p-chip ok">Scheduled for {eff}</span> : <span className="p-muted p-small">Schedule it from its table on the batch page.</span>}</div>
    </Sheet>
  )
}

const statusA = (s: { live: boolean; closed: boolean }) => (s.closed ? 'Closed' : s.live ? 'Live' : 'Ready to review')
const statusB = (s: { scheduled: boolean; ukScheduled: boolean }) =>
  s.scheduled && s.ukScheduled ? 'Scheduled' : s.scheduled || s.ukScheduled ? 'Partly scheduled' : 'Ready to review'

// 1. Home: what needs attention (a scrolling row of cards), then the library at a glance.
function Home() {
  const s = useProto()
  const { go, set, live, merged, scanDone } = s
  const a = statusA(s), b = statusB(s)
  const cards = [
    <article key="a" className="p-change-card" onClick={() => go('impact')}>
      <div className="p-card-top"><span className="p-chip">Single change</span><span className="p-grow" /><span className={`p-chip ${live ? 'ok' : 'warn'}`}>{a}</span></div>
      <h2>{change.title}</h2>
      <p className="p-muted p-small">{change.source} sync, {change.synced}. Effective {change.effective}.</p>
      <Stats items={[[<b>{change.places}</b>, 'places'], [<Pri p="P0" />, `${change.p0}`], [<Pri p="P1" />, `${change.p1}`]]} />
    </article>,
    <article key="b" className="p-change-card" onClick={() => go('batch')}>
      <div className="p-card-top"><span className="p-chip">Batch change</span><span className="p-grow" /><span className={`p-chip ${b === 'Scheduled' ? 'ok' : 'warn'}`}>{b}</span></div>
      <h2>{batch.title}</h2>
      <p className="p-muted p-small">{batch.tiers.length - 1} tiers on {batch.effective}. {batch.exception.tier} on {batch.exception.effective}.</p>
      <Stats items={[[<b>{batch.places}</b>, 'places'], [<Pri p="P0" />, `${batch.p0}`], [<Pri p="P1" />, `${batch.p1}`]]} />
    </article>,
    <article key="c" className="p-change-card" onClick={() => go('scan')}>
      <div className="p-card-top"><span className="p-chip">Scan result</span><span className="p-grow" />{Object.keys(scanDone).length > 0 && <span className="p-chip">In progress</span>}</div>
      <h2><span className="ai-ic" /> AI found {scan.total} spots that could become tokens</h2>
      <p className="p-muted p-small">Once linked, the next change updates them by itself.</p>
    </article>,
    <article key="d" className="p-change-card" onClick={() => go('merge')}>
      <div className="p-card-top"><span className="p-chip">Duplicates</span><span className="p-grow" />{merged && <span className="p-chip ok">Merged</span>}</div>
      <h2>{merge.versions} versions of {merge.asset}</h2>
      <p className="p-muted p-small">Merge them and future changes touch {merge.keep} assets, not {merge.versions}.</p>
    </article>,
  ]
  return (
    <>
      <Head title={`Good morning, ${admin.name.split(' ')[0]}`} sub={`${company.name} content, ${today}.`} />
      <section>
        <div className="p-row p-table-head"><span className="p-card-title p-grow">Needs attention · {cards.length}</span><button className="p-link" onClick={() => set({ allOpen: true })}>View all changes</button></div>
        <Carousel>{cards}</Carousel>
      </section>
      <Dashboard />
    </>
  )
}

// A single row of cards that scrolls sideways. The dots show how many, and where you are.
function Carousel({ children }: { children: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState(0)
  const step = () => (ref.current!.firstElementChild as HTMLElement).offsetWidth + 16
  const onScroll = () => {
    const el = ref.current!
    setAt(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2 ? children.length - 1 : Math.round(el.scrollLeft / step()))
  }
  return (
    <>
      <div ref={ref} className="p-carousel" onScroll={onScroll}>{children}</div>
      <div className="p-cdots">{children.map((_, i) => (
        <button key={i} aria-label={`Card ${i + 1} of ${children.length}`} className={i === at ? 'on' : ''} onClick={() => ref.current!.scrollTo({ left: i * step(), behavior: 'smooth' })} />
      ))}</div>
    </>
  )
}

// Library at a glance. Mock charts on assumed numbers; token coverage is live.
function Dashboard() {
  const s = useProto()
  const places = facts.reduce((n, f) => n + f.usedIn, 0)
  const linked = facts.reduce((n, f) => n + f.linked + scanLinked(s, f.token), 0)
  const pct = Math.round((linked / places) * 100)
  const { weeks, health, sellersTrend: t } = dashboard
  const max = Math.max(...weeks.map(w => w[1])), top = Math.max(...t)
  const line = t.map((v, i) => `${(i * 160) / (t.length - 1)},${44 - (v / top) * 40}`).join(' ')
  return (
    <section>
      <div className="p-card-title">Library at a glance</div>
      <div className="p-dash">
        <div className="p-card">
          <div className="p-card-title">Asset health</div>
          <b className="p-big">{dashboard.assets.toLocaleString('en-US')}</b>
          <div className="p-hbar">{health.map(([l, n], i) => <span key={l} className={`h${i}`} style={{ flexGrow: n }} />)}</div>
          <div className="p-legend">{health.map(([l, n], i) => <span key={l}><i className={`h${i}`} />{l} <b>{n.toLocaleString('en-US')}</b></span>)}</div>
        </div>
        <div className="p-card">
          <div className="p-card-title">Updates by itself</div>
          <b className="p-big">{pct}%</b>
          <div className="p-meter"><span style={{ width: `${pct}%` }} /></div>
          <span className="p-muted p-small">{linked} of {places} claim places hold tokens. Linking the scan raises this.</span>
        </div>
        <div className="p-card">
          <div className="p-card-title">Changes synced per week</div>
          <svg viewBox="0 0 160 56" className="p-chart" aria-label="Changes synced per week">
            {weeks.map(([w, n], i) => <rect key={w} x={i * 20 + 3} y={54 - (n / max) * 50} width={14} height={(n / max) * 50} rx={2} className={i === weeks.length - 1 ? 'on' : ''} />)}
          </svg>
          <div className="p-axis"><span>{weeks[0][0]}</span><span>This week</span></div>
        </div>
        <div className="p-card">
          <div className="p-card-title">Sellers on outdated content</div>
          <b className="p-big">{sellersAtRisk.withMeetings}</b>
          <svg viewBox="-4 0 168 48" className="p-chart spark" aria-label="Sellers on outdated content, last 6 weeks">
            <polyline points={line} /><circle cx={160} cy={44 - (t[t.length - 1] / top) * 40} r={3.5} />
          </svg>
          <span className="p-muted p-small">With a meeting this week. Jumped when the annual discount changed.</span>
        </div>
      </div>
    </section>
  )
}

// Every change, current and closed. The list lives in a side modal, not a page.
function AllChanges() {
  const s = useProto()
  const rows: [string, string, string, string, number, () => void][] = [
    [change.title, 'Single change', statusA(s), change.effective, change.places, () => s.go('impact')],
    [batch.title, 'Batch change', statusB(s), batch.effective, batch.places, () => s.go('batch')],
    ...pastChanges.map(([t, k, eff, p]): [string, string, string, string, number, () => void] => [t, k, 'Closed', eff, p, notHere]),
  ]
  return (
    <Sheet title="All changes" sub="Every change synced from its source, newest first." onClose={() => s.set({ allOpen: false })}>
      <table className="p-table">
        <thead><tr><th>Change</th><th>Type</th><th>Status</th><th>Effective</th><th>Places</th></tr></thead>
        <tbody>{rows.map(([t, k, st, eff, p, open]) => (
          <tr key={t} onClick={open}><td><b>{t}</b></td><td>{k}</td><td><span className={`p-chip ${st === 'Ready to review' || st === 'Partly scheduled' ? 'warn' : st === 'Closed' ? '' : 'ok'}`}>{st}</span></td><td>{eff}</td><td>{p}</td></tr>
        ))}</tbody>
      </table>
    </Sheet>
  )
}

// Card A: a token-only batch, in a side modal. Two tables by effective date, one action each. A row opens that tier.
function BatchSheet() {
  const { scheduled, ukScheduled, set, say, go } = useProto()
  const main = batch.tiers.filter(t => t[0] !== batch.exception.tier)
  const uk = batch.tiers.filter(t => t[0] === batch.exception.tier)
  return (
    <Sheet title={batch.title} sub={`${change.source} sync, ${batch.synced}. ${batch.places} places in ${batch.assets} assets, all tokens, so nothing needs rewriting. Check the dates.`} onClose={() => go('home')}>
      <TierTable title={`Effective ${batch.effective}`} rows={main} done={scheduled} label={`Schedule ${main.length} tiers for ${batch.effective}`} eff={batch.effective}
        onGo={() => { set({ scheduled: true }); say(`${main.length} tiers scheduled for ${batch.effective}.`) }} />
      <TierTable title={`Effective ${batch.exception.effective}`} rows={uk} done={ukScheduled} label={`Schedule for ${batch.exception.effective}`} eff={batch.exception.effective}
        onGo={() => { set({ ukScheduled: true }); say(`${batch.exception.tier} scheduled for ${batch.exception.effective}.`) }} />
    </Sheet>
  )
}
function TierTable({ title, rows, done, label, eff, onGo }: { title: string; rows: [string, string, string, string][]; done: boolean; label: string; eff: string; onGo: () => void }) {
  const set = useProto(s => s.set)
  return (
    <div>
      <div className="p-row p-table-head"><span className="p-card-title p-grow">{title} · {rows.length} {rows.length === 1 ? 'tier' : 'tiers'}</span>
        {done ? <span className="p-chip ok">Scheduled for {eff}</span> : <button className="p-btn primary" onClick={onGo}>{label}</button>}
      </div>
      <table className="p-table">
        <thead><tr><th>Tier</th><th>Token</th><th>Now</th><th>New</th><th>Effective</th></tr></thead>
        <tbody>{rows.map(([tier, token, from, to]) => (
          <tr key={token} onClick={() => set({ sheet: token })}><td><b>{tier}</b></td><td><code>{`{${token}}`}</code></td><td>{from}</td><td><b>{to}</b></td><td>{eff}</td></tr>
        ))}</tbody>
      </table>
    </div>
  )
}

// 2. Impact: where the claim lives, most urgent first.
function Impact() {
  const { retired, set, go, say } = useProto()
  const [confirm, setConfirm] = useState(false)
  const assetsLeft = retired ? change.assets - retire.assets : change.assets
  return (
    <>
      <Head sub={`${change.places} places in ${change.assets} assets. Effective since ${change.effective}, so these are wrong today.`}>
        {retired ? <span className="p-chip ok">{retire.assets} assets retired</span>
          : confirm ? <span className="p-confirm">Retire {retire.places} places in {retire.assets} assets nobody opened in 6 months?
              <button className="p-btn" onClick={() => { set({ retired: true }); setConfirm(false); say(`${retire.assets} assets retired. Undo stays available.`) }}>Retire</button>
              <button className="p-btn" onClick={() => setConfirm(false)}>Cancel</button></span>
          : <button className="p-btn" onClick={() => setConfirm(true)}>Retire {retire.assets} unused assets</button>}
        <button className="p-btn primary" onClick={() => go('review')}>Start review</button>
      </Head>
      <div>
        <div className="p-card-title">Assets, most urgent first · showing {impactAssets.length} of {assetsLeft}</div>
        <table className="p-table">
          <thead><tr><th>Priority</th><th>Asset</th><th>Type</th><th>Why</th><th>Places</th></tr></thead>
          <tbody>{impactAssets.map(a => (
            <tr key={a.name} onClick={notHere}><td><Pri p={a.priority} /></td><td><b>{a.name}</b></td><td>{a.type}</td><td className="p-muted">{a.why}</td><td>{a.places}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </>
  )
}

// 3. Review in three lanes.
function Review() {
  const s = useProto()
  const { groupsOk, excluded, jDone, jIndex, set, go } = s
  const [lane, setLane] = useState<'token' | 'wording' | 'judgment'>('wording')
  const [open, setOpen] = useState<string | null>(null)
  const decide = (id: string, v: 'ok' | 'sent') => {
    const next = { ...jDone, [id]: v }
    const n = judgment.findIndex((j, i) => i < DETAILED && !next[j.id])
    set({ jDone: next, jIndex: n >= 0 ? n : jIndex })
  }
  const toggleEx = (g: string, k: number) => {
    const cur = excluded[g] ?? []
    set({ excluded: { ...excluded, [g]: cur.includes(k) ? cur.filter(x => x !== k) : [...cur, k] } })
  }
  const j = judgment[jIndex]
  return (
    <>
      <Head sub="Approve once per group. Decide judgment items one at a time. Anything left keeps an outdated banner.">
        <span className="p-counter"><b>{decisionsLeft(s)}</b> decisions left</span>
        <button className="p-btn primary" onClick={() => go('golive')}>Go live with what is approved</button>
      </Head>
      <div className="p-tabs">
        <button className={lane === 'token' ? 'on' : ''} onClick={() => setLane('token')}>Tokens · {lanes.tokens} places</button>
        <button className={lane === 'wording' ? 'on' : ''} onClick={() => setLane('wording')}>Same wording · {lanes.groups - groupsOk.length} of {lanes.groups} groups</button>
        <button className={lane === 'judgment' ? 'on' : ''} onClick={() => setLane('judgment')}>Judgment · {lanes.judgment - Object.keys(jDone).length} of {lanes.judgment}</button>
      </div>
      {lane === 'token' && (
        <div className="p-card">
          <p><b>{lanes.tokens} places</b> hold <code>{`{${change.token}}`}</code>. They update by themselves at go live.</p>
          <p className="p-muted">Read only. {change.owner} confirmed the new value, so there is nothing to decide here.</p>
        </div>
      )}
      {lane === 'wording' && (
        <div className="p-stack">
          {groups.map(g => {
            const ok = groupsOk.includes(g.id)
            const ex = excluded[g.id] ?? []
            return (
              <div key={g.id} className={`p-card ${ok ? 'done' : ''}`}>
                <div className="p-row">
                  <div className="p-grow">
                    <div className="p-diff"><s>{g.old}</s><span>{g.next}</span></div>
                    <div className="p-muted p-small">Same wording in {g.places} places{ex.length > 0 && `, ${ex.length} excluded`} · Source: {change.source} <Conf c="High" /></div>
                  </div>
                  <button className="p-link" onClick={() => setOpen(open === g.id ? null : g.id)}>{open === g.id ? 'Hide samples' : 'See samples'}</button>
                  {ok ? <span className="p-chip ok">Approved</span>
                    : <button className="p-btn" onClick={() => set({ groupsOk: [...groupsOk, g.id] })}>Approve {g.places - ex.length}</button>}
                </div>
                {open === g.id && (
                  <div className="p-samples">
                    {g.samples.map((w, k) => (
                      <div key={w} className={`p-sample ${ex.includes(k) ? 'off' : ''}`}>
                        <span className="p-grow"><span className="p-small p-muted">{w}</span><br />…{g.next}…</span>
                        {!ok && <button className="p-link" onClick={() => toggleEx(g.id, k)}>{ex.includes(k) ? 'Include' : 'Exclude'}</button>}
                      </div>
                    ))}
                    <span className="p-muted p-small">Showing 3 of {g.places}. Excluded places stay as they are and keep the banner.</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
      {lane === 'judgment' && (
        <>
          <div className="p-card p-judge">
            <div className="p-row">
              <span className="p-muted p-small p-grow">Item {jIndex + 1} of {judgment.length} · {j.kind} · {j.where}</span>
              <Conf c={j.confidence} /><span className="p-chip">Suggested: {j.route}</span>
            </div>
            <div className="p-diff big"><s>{j.old}</s><span>{j.next}</span></div>
            {j.working && <div className="p-working"><span className="p-small ai-label"><span className="ai-ic" /><span className="ai-text">How AI got here</span></span>{j.working}</div>}
            <div className="p-actions">
              {jDone[j.id] ? <span className="p-chip ok">{jDone[j.id] === 'ok' ? 'Approved' : 'Sent to Product marketing'}</span>
                : j.route === 'Product marketing' ? <>
                    <button className="p-btn primary" onClick={() => decide(j.id, 'sent')}>Send to Product marketing</button>
                    <button className="p-btn" onClick={() => decide(j.id, 'ok')}>Decide myself</button>
                  </>
                : <>
                    <button className="p-btn primary" onClick={() => decide(j.id, 'ok')}>Approve</button>
                    <button className="p-btn" onClick={notHere}>Edit</button>
                    <button className="p-btn" onClick={() => decide(j.id, 'sent')}>Send to Product marketing</button>
                  </>}
              <span className="p-grow" />
              <button className="p-btn" disabled={jIndex === 0} onClick={() => set({ jIndex: jIndex - 1 })}>Previous</button>
              <button className="p-btn" disabled={jIndex >= DETAILED - 1} onClick={() => set({ jIndex: jIndex + 1 })}>Next item</button>
            </div>
          </div>
          <div className="p-card-title p-mt">All {judgment.length} items</div>
          <table className="p-table">
            <thead><tr><th>Item</th><th>Where</th><th>Confidence</th><th>Route</th><th /></tr></thead>
            <tbody>{judgment.map((x, i) => (
              <tr key={x.id} className={i === jIndex ? 'sel' : ''} onClick={() => (i < DETAILED ? set({ jIndex: i }) : undefined)}>
                <td>{x.kind}</td><td className="p-muted">{x.where}</td><td>{x.confidence}</td><td>{x.route}</td>
                <td>{jDone[x.id] ? <span className="p-chip ok">{jDone[x.id] === 'ok' ? 'Approved' : 'Sent'}</span>
                  : i >= DETAILED && <button className="p-btn" onClick={e => { e.stopPropagation(); decide(x.id, x.route === 'Admin' ? 'ok' : 'sent') }}>{x.route === 'Admin' ? 'Approve' : 'Send'}</button>}</td>
              </tr>
            ))}</tbody>
          </table>
        </>
      )}
    </>
  )
}

// 4. Go live, with the seller banner and alert previews.
function GoLive() {
  const s = useProto()
  const { live, draft, set, go, say } = s
  const approved = placesApproved(s)
  const jOk = Object.values(s.jDone).filter(v => v === 'ok').length
  const [text, setText] = useState(`Hi team, a quick correction before Thursday. Our annual discount is now ${change.to}, not the ${change.from} in the proposal I sent on Oct 12. The updated proposal is attached. Priya`)
  return (
    <>
      <Head sub={`Effective since ${change.effective}, so there is nothing to schedule. Undo stays available for the whole change.`}>
        {live ? <><span className="p-chip ok">Live</span><button className="p-btn" onClick={() => go('tracking')}>View tracking</button></>
          : <button className="p-btn primary" onClick={() => { set({ live: true }); say(`Live. ${sellersAtRisk.withMeetings} sellers alerted.`); go('tracking') }}>Go live now</button>}
      </Head>
      <div className="p-three">
        <div className="p-card"><div className="p-card-title">Goes live now</div><b className="p-big">{lanes.tokens + approved + jOk}</b><span className="p-muted">{lanes.tokens} tokens, {approved} grouped places, {jOk} judgment items</span></div>
        <div className="p-card"><div className="p-card-title">Still in review</div><b className="p-big">{decisionsLeft(s)}</b><span className="p-muted">decisions. Their assets show sellers an outdated banner until fixed.</span></div>
        <div className="p-card"><div className="p-card-title">Who is told</div><b className="p-big">{sellersAtRisk.withMeetings}</b><span className="p-muted">sellers using P0 and P1 assets, not all {company.sellers}. {sellersAtRisk.holdingCopies} of them hold the {sellersAtRisk.copies} stale copies.</span></div>
      </div>
      <div className="p-two even">
        <div>
          <div className="p-card-title">What sellers see on an unfixed asset</div>
          <div className="p-deck">
            <div className="p-outdated">Pricing on this slide is outdated. Current annual discount: {change.to}.</div>
            <div className="p-deck-body"><b>Pricing that grows with you</b><span>Save {change.from} with annual billing.</span></div>
          </div>
        </div>
        <div>
          <div className="p-card-title">Alert preview: Priya Nair</div>
          <div className="p-chat">
            <div className="p-msg-from">Prism</div>
            {sellerAlert.map(l => <p key={l} className="p-msg-line">{l}</p>)}
            <div className="p-actions"><button className="p-btn" onClick={() => set({ draft: !draft })}>Draft a note to Halden</button></div>
            {draft && (
              <div className="p-draft">
                <textarea rows={4} value={text} onChange={e => setText(e.target.value)} />
                <span className="p-muted p-small">Suggested by Prism. Priya edits and sends it herself.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// 5. Tracking, after go live.
function Tracking() {
  const { nudged, set, go, say } = useProto()
  const [confirm, setConfirm] = useState(false)
  const m: [ReactNode, string][] = [
    [tracking.alerted, 'sellers alerted'], [tracking.opened, 'opened the alert'],
    [`${tracking.staleOut} of ${tracking.staleTotal}`, 'stale copies still out'], [tracking.buyerNotes, 'buyer notes sent'], [tracking.inReview, 'items still in review'],
  ]
  return (
    <>
      <Head sub="Two days after go live. Assumed numbers.">
        {confirm ? <span className="p-confirm">Roll back every edit in this change?
            <button className="p-btn" onClick={() => { set({ live: false }); setConfirm(false); say(`Rolled back. Content shows ${change.from} again.`); go('golive') }}>Roll back</button>
            <button className="p-btn" onClick={() => setConfirm(false)}>Cancel</button></span>
          : <button className="p-btn" onClick={() => setConfirm(true)}>Roll back</button>}
        <button className="p-btn primary" onClick={() => { set({ closed: true }); say('Change closed.'); go('home') }}>Close change</button>
      </Head>
      <div className="p-summary">{m.map(([n, l]) => <div key={l} className="p-stat"><b>{n}</b><span>{l}</span></div>)}</div>
      <div className="p-card">
        <div className="p-row"><span className="p-card-title p-grow">Stale copies still out</span>
          {nudged ? <span className="p-chip ok">Nudge sent</span> : <button className="p-btn" onClick={() => { set({ nudged: true }); say(`Nudged the sellers holding ${tracking.staleOut} copies.`) }}>Nudge stale copy holders</button>}
        </div>
        {staleHolders.map(h => (
          <div key={h.seller} className="p-row"><b>{h.seller}</b><span className="p-grow p-muted">{h.copy}</span><span className="p-chip">{h.status}</span></div>
        ))}
      </div>
    </>
  )
}

