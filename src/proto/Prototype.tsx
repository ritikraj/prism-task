// Prism prototype: Home, then one change end to end. Own component system (proto.css), separate from the deck.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import './proto.css'
import {
  admin, bucketSamples, buckets, change, company, dashboard, facts, lanes, merge, pastChanges, retire, retireSamples, scan,
  sellersAtRisk, today, type Bucket,
} from '../data/ledgerly'
import {
  useProto, notHere, groups, judgment, GUIDE, ORDER, allDone, bucketDone, CHANGE_ROUTES, LIBRARY_ROUTES, MODAL_ROUTES, CLAIM_ROUTES, scanLinked,
  type Route,
} from './store'
import { Conf, Head, Ic, Sheet, Stats } from './ui'
import { Asset, Claim, Claims, Library, Merge, Scan } from './Screens3'

const SCREENS: Record<Route, () => JSX.Element> = {
  home: Home, impact: Home, review: Home,
  scan: Home, merge: Home, claims: Claims, claim: Claim, library: Library, asset: Asset,
}
const RAIL: [string, string, Route | null][] = [
  ['Home', 'M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z', 'home'],
  ['Claims', 'M4 9h16M4 15h16M10 3L8 21M16 3l-2 18', 'claims'],
  ['Library', 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'library'],
]

export default function Prototype() {
  const { route, base, guide, toast, claim, allOpen, go, set, reset } = useProto()
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
  const page = MODAL_ROUTES.includes(route) ? base : route
  const Screen = SCREENS[page]
  const section: Route = LIBRARY_ROUTES.includes(page) ? 'library' : CLAIM_ROUTES.includes(route) ? 'claims' : 'home'
  const CRUMBS: Record<Route, string[]> = {
    home: ['Home'], impact: ['Home'], review: ['Home'],
    library: ['Library'], asset: ['Library', 'Ledgerly pricing overview v7'], scan: ['Library', 'Scan results'],
    merge: ['Library', 'Duplicates'], claims: ['Claims'], claim: ['Claims', claim],
  }
  const crumbs = CRUMBS[page]
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
            <main className={`p-main ${page === 'library' ? 'fixed' : ''}`}><div className="p-container"><Screen /></div></main>
          </div>
        </div>
        {inChange && <ChangeSheet />}
        {route === 'scan' && <Sheet title="Scan results" onClose={() => go(base)}><Scan /></Sheet>}
        {route === 'merge' && <Sheet title={`${merge.versions} versions of ${merge.asset}`} onClose={() => go(base)}><Merge /></Sheet>}
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

// The annual discount change. No tabs: urgency cards, then one bucket at a time. Approving publishes.
function ChangeSheet() {
  const s = useProto()
  return (
    <Sheet title={change.title} sub={`${change.source} · ${change.synced[0].toUpperCase()}${change.synced.slice(1)}`} onClose={() => s.go(s.base)}>
      {s.route === 'review' ? <BucketView /> : <Overview />}
    </Sheet>
  )
}

const statusA = (s: Parameters<typeof allDone>[0] & { live: boolean }) => (allDone(s) ? 'Published' : s.live ? 'Partly published' : '')

// 1. Home: what needs attention (a scrolling row of cards), then the library at a glance.
function Home() {
  const s = useProto()
  const { go, set, live, merged, scanDone } = s
  const a = statusA(s)
  const total = useAllRows().length
  const cards = [
    <article key="a" className="p-change-card" onClick={() => go('impact')}>
      <div className="p-card-top"><span className="p-chip">1 fact changed</span><span className="p-grow" />{a && <span className={`p-chip ${a === 'Published' ? 'ok' : ''}`}>{a}</span>}</div>
      <h2>{change.title}</h2>
      <p className="p-muted p-small">{change.source} sync, {change.synced}.</p>
      <Stats items={[[<b>{change.places}</b>, 'places'], [<b>{buckets[0].places}</b>, 'urgent']]} />
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
      <section className="p-sec">
        <div className="p-row p-table-head"><span className="p-card-title p-grow">Needs attention</span><button className="p-link" onClick={() => set({ allOpen: true })}>View all ({total})</button></div>
        <Carousel>{cards}</Carousel>
      </section>
      <Dashboard />
      <Skeleton />
      <SkeletonCards />
      <SkeletonCharts />
    </>
  )
}

// A single row of cards that scrolls sideways. The dots show how many, and where you are.
function Carousel({ children }: { children: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState(0)
  const [over, setOver] = useState(false)
  useEffect(() => {
    const el = ref.current!
    const ro = new ResizeObserver(() => setOver(el.scrollWidth > el.clientWidth + 1))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const step = () => (ref.current!.firstElementChild as HTMLElement).offsetWidth + 16
  const onScroll = () => {
    const el = ref.current!
    setAt(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2 ? children.length - 1 : Math.round(el.scrollLeft / step()))
  }
  return (
    <>
      <div ref={ref} className="p-carousel" onScroll={onScroll}>{children}</div>
      {over && <div className="p-cdots">{children.map((_, i) => (
        <button key={i} aria-label={`Card ${i + 1} of ${children.length}`} className={i === at ? 'on' : ''} onClick={() => ref.current!.scrollTo({ left: i * step(), behavior: 'smooth' })} />
      ))}</div>}
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
    <section className="p-sec">
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

// Placeholder blocks: the rest of a real home page, not designed here.
function Skeleton() {
  return (
    <section className="p-skel-grid" aria-hidden="true">
      <div className="p-card">{bar('30%', 12)}{[92, 78, 85, 70, 88].map((w, i) => <div key={i} className="p-skel-row">{bar('28px', 28)}<span className="p-grow">{bar(`${w}%`)}{bar(`${w - 30}%`, 8)}</span>{bar('48px')}</div>)}</div>
      <div className="p-card">{bar('40%', 12)}<span className="p-skel" style={{ height: 120 }} />{bar('90%')}{bar('70%')}{bar('80%')}</div>
    </section>
  )
}

const bar = (w: string | number, h = 10) => <span className="p-skel" style={{ width: w, height: h }} />
function SkeletonCards() {
  return (
    <section className="p-sec" aria-hidden="true">
      {bar(140, 10)}
      <div className="p-skel-cards">{[0, 1, 2].map(i => (
        <div key={i} className="p-card">{bar(64, 18)}{bar('80%', 14)}{bar('95%')}{bar('60%')}<div className="p-skel-row">{bar(48, 18)}{bar(48, 18)}{bar(48, 18)}</div></div>
      ))}</div>
    </section>
  )
}
function SkeletonCharts() {
  const h = [40, 62, 48, 80, 56, 92, 70, 84, 60, 74, 50, 88]
  return (
    <section className="p-sec" aria-hidden="true">
      {bar(160, 10)}
      <div className="p-skel-grid">
        <div className="p-card">{bar('25%', 12)}<div className="p-skel-bars">{h.map((v, i) => <span key={i} className="p-skel" style={{ height: `${v}%` }} />)}</div></div>
        <div className="p-card">{bar('45%', 12)}<span className="p-skel p-skel-ring" />{bar('80%')}{bar('65%')}</div>
      </div>
    </section>
  )
}

// Everything: open changes, the scan, duplicates, then closed changes. Home's "View all (n)" counts these.
type Row = [string, string, string, number | string, () => void]
function useAllRows(): Row[] {
  const s = useProto()
  return [
    [change.title, '1 fact changed', statusA(s), change.places, () => s.go('impact')],
    [`AI found ${scan.total} spots that could become tokens`, 'Scan result', Object.keys(s.scanDone).length > 0 ? 'In progress' : '', scan.total, () => s.go('scan')],
    [`${merge.versions} versions of ${merge.asset}`, 'Duplicates', s.merged ? 'Merged' : '', '—', () => s.go('merge')],
    ...pastChanges.map(([t, k, p]): Row => [t, k, 'Closed', p, notHere]),
  ]
}

// The full list lives in a side modal, not a page.
function AllChanges() {
  const set = useProto(s => s.set)
  const rows = useAllRows()
  return (
    <Sheet title={`All (${rows.length})`} onClose={() => set({ allOpen: false })}>
      <table className="p-table">
        <thead><tr><th>Item</th><th>Type</th><th>Status</th><th>Places</th></tr></thead>
        <tbody>{rows.map(([t, k, st, p, open]) => (
          <tr key={t} onClick={open}><td><b>{t}</b></td><td><span className="p-chip">{k}</span></td><td>{st && <span className={`p-chip ${st === 'Published' || st === 'Merged' ? 'ok' : ''}`}>{st}</span>}</td><td>{p}</td></tr>
        ))}</tbody>
      </table>
    </Sheet>
  )
}

// Step 1: what is left, by urgency. Each card says why its places sit there.
function Overview() {
  const s = useProto()
  const open = (id: Bucket) => { s.set({ bucket: id }); s.go('review') }
  return (
    <>
      <div className="p-done-strip"><Ic d="M5 12l5 5 9-11" /><span><b>{lanes.tokens} places already updated</b> by tokens when {change.owner} confirmed {change.to}.</span></div>
      <div className="p-sec">
        <div className="p-buckets">{buckets.map((b, bi) => {
          const done = b.id === 'Low' ? (s.retired ? b.places : 0) : bucketDone(s, bi)
          return (
            <div key={b.id} className={`p-bucket ${done === b.places ? 'done' : ''}`} onClick={() => open(b.id)}>
              <span className="p-row"><Urg u={b.id} /><span className="p-grow" />{done === b.places && <span className="p-chip ok">{b.id === 'Low' ? 'Retired' : 'Published'}</span>}</span>
              <b className="p-big">{b.places - done}</b>
              <span className="p-muted p-small">{done ? `of ${b.places} places left` : 'places'}</span>
              <span className="p-small">{b.reason}</span>
              <span className="p-meter"><span style={{ width: `${(done / b.places) * 100}%` }} /></span>
              <button className="p-btn tertiary" onClick={e => { e.stopPropagation(); open(b.id) }}>
                {done === b.places ? 'View' : done ? 'Continue' : b.id === 'Low' ? 'Retire' : 'Review'}
              </button>
            </div>
          )
        })}</div>
      </div>
    </>
  )
}

const Urg = ({ u }: { u: Bucket }) => <span className={`p-chip urg-${u.toLowerCase()}`}>{u}</span>

// Step 2: one bucket. Identical sentences approve and publish together; judgment items one by one.
function BucketView() {
  const s = useProto()
  const { bucket, pub, narrow, jDone, alerted, retired, set, say, go } = s
  const [confirm, setConfirm] = useState(false)
  const bi = ORDER.indexOf(bucket)
  const b = buckets.find(x => x.id === bucket)!
  const next = buckets[buckets.indexOf(b) + 1]
  const nav = (
    <div className="p-row p-bucket-nav">
      <button className="p-link" onClick={() => go('impact')}>← All urgency levels</button><span className="p-grow" />
      {next && <button className="p-btn" onClick={() => set({ bucket: next.id })}>Next: {next.id} · {next.places}</button>}
    </div>
  )
  const head = (
    <div className="p-head">
      <div className="p-grow"><h1 className="p-row"><Urg u={b.id} /> {b.places} places</h1><p className="p-muted p-sub-line">{b.reason}.</p></div>
    </div>
  )
  if (bi < 0) return (
    <>
      {nav}{head}
      <div className="p-card">
        {retireSamples.map(([a, why]) => <div key={a} className="p-row"><b>{a}</b><span className="p-grow p-muted">{why}</span></div>)}
        <p className="p-muted p-small">Showing 3 of {retire.assets} assets. Owners can object for 14 days, and undo stays available.</p>
        <div className="p-actions">
          {retired ? <span className="p-chip ok">{retire.assets} assets retired</span>
            : confirm ? <span className="p-confirm">Retire {retire.places} places in {retire.assets} assets?
                <button className="p-btn primary" onClick={() => { set({ retired: true }); setConfirm(false); say(`${retire.assets} assets retired. Owners have 14 days to object.`) }}>Retire</button>
                <button className="p-btn" onClick={() => setConfirm(false)}>Cancel</button></span>
            : <button className="p-btn primary" onClick={() => setConfirm(true)}>Retire {retire.assets} assets</button>}
        </div>
      </div>
    </>
  )
  const mine = groups.filter(g => g.split[bi] > 0)
  const open = mine.filter(g => !pub[`${g.id}:${bi}`])
  const items = judgment.filter(j => j.bucket === bi)
  // Publish groups here, and in the other buckets too unless that group was narrowed to this one.
  const publish = (gs: typeof groups) => {
    const next = { ...pub }
    let n = 0
    gs.forEach(g => g.split.forEach((k, i) => {
      const key = `${g.id}:${i}`
      if (k > 0 && !next[key] && (i === bi || !narrow.includes(g.id))) { next[key] = true; n += k }
    }))
    set({ pub: next, live: true })
    say(s.live ? `Published ${n} places.` : `Published ${n} places. ${sellersAtRisk.withMeetings} sellers with meetings this week get one alert.`)
  }
  const decide = (id: string, v: 'ok' | 'sent') => {
    set({ jDone: { ...jDone, [id]: v }, live: s.live || v === 'ok' })
    say(v === 'ok' ? 'Published.' : 'Sent to Product marketing.')
  }
  return (
    <>
      {nav}{head}
      <section className="p-sec">
        <div className="p-row p-table-head">
          <span className="p-card-title p-grow ai-label"><span className="ai-ic" /><span className="ai-text">Same sentence, found by AI · {mine.length} groups</span></span>
          {open.length > 0 ? <button className="p-btn primary" onClick={() => publish(open)}>Approve & Publish all {open.length}</button> : <span className="p-chip ok">All published</span>}
        </div>
        {mine.map(g => {
          const here = g.split[bi]
          const elsewhere = g.split.reduce((n, k, i) => n + (i !== bi && !pub[`${g.id}:${i}`] ? k : 0), 0)
          const done = pub[`${g.id}:${bi}`]
          return (
            <div key={g.id} className={`p-card ${done ? 'done' : ''}`}>
              <div className="p-row">
                <div className="p-grow">
                  <div className="p-diff"><s>{g.old}</s><span>{g.next}</span></div>
                  <div className="p-muted p-small">{here} places here · e.g. {bucketSamples[bi][Number(g.id.slice(1)) % 3][0]}: {bucketSamples[bi][Number(g.id.slice(1)) % 3][1]}</div>
                </div>
                {done ? <span className="p-chip ok">Published</span> : <button className="p-btn" onClick={() => publish([g])}>Approve & Publish {here}</button>}
              </div>
              {!done && elsewhere > 0 && (
                <label className="p-check p-small">
                  <input type="checkbox" checked={!narrow.includes(g.id)} onChange={e => set({ narrow: e.target.checked ? narrow.filter(x => x !== g.id) : [...narrow, g.id] })} />
                  Also publish the {elsewhere} places in other urgency levels with this sentence
                </label>
              )}
            </div>
          )
        })}
      </section>
      <section className="p-sec">
        <div className="p-card-title">Decide one by one · {items.filter(j => !jDone[j.id]).length} of {items.length} left</div>
        {items.map(j => (
          <div key={j.id} className={`p-card p-judge ${jDone[j.id] ? 'done' : ''}`}>
            <div className="p-row"><span className="p-muted p-small p-grow">{j.kind} · {j.where}</span><Conf c={j.confidence} /></div>
            <div className="p-diff"><s>{j.old}</s><span>{j.next}</span></div>
            {j.working && <div className="p-working"><span className="p-small ai-label"><span className="ai-ic" /><span className="ai-text">How AI got here</span></span>{j.working}</div>}
            <div className="p-actions">
              {jDone[j.id] ? <span className="p-chip ok">{jDone[j.id] === 'ok' ? 'Published' : 'Sent to Product marketing'}</span> : <>
                <button className={`p-btn ${j.route === 'Admin' ? 'primary' : ''}`} onClick={() => decide(j.id, 'ok')}>Approve & Publish</button>
                <button className={`p-btn ${j.route === 'Admin' ? '' : 'primary'}`} onClick={() => decide(j.id, 'sent')}>Send to Product marketing</button>
              </>}
            </div>
          </div>
        ))}
      </section>
      <section className="p-sec">
        <div className="p-card-title">Copies sellers already sent · {b.copies}</div>
        <div className="p-card p-row">
          <span className="p-grow">{b.copies} copies are in buyer inboxes and cannot be edited. {b.sellers.join(', ')} get a note with the updated file.</span>
          {alerted.includes(b.id) ? <span className="p-chip ok">Alerted</span>
            : <button className="p-btn" onClick={() => { set({ alerted: [...alerted, b.id] }); say(`${b.sellers.length} sellers alerted.`) }}>Alert {b.sellers.length} sellers</button>}
        </div>
      </section>
    </>
  )
}
