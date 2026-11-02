// Prism prototype: Home, then one change end to end. Own component system (proto.css), separate from the deck.
import { useEffect, useRef, useState, type ReactNode } from 'react'
import './proto.css'
import {
  admin, bucketSamples, buckets, change, company, dashboard, facts, lanes, merge, pastChanges, retire, retireSamples, scan,
  sellersAtRisk, today, type Bucket,
} from '../data/ledgerly'
import {
  useProto, notHere, groups, judgment, GUIDE, ORDER, allDone, bucketDone, spotsLeft, CHANGE_ROUTES, LIBRARY_ROUTES, MODAL_ROUTES, CLAIM_ROUTES, scanLinked,
  type Act, type JItem, type Route,
} from './store'
import { AiBadge, Avatar, Avatars, BtnIc, Diff, Head, ICON, Ic, Logo, Meta, SecHead, Sheet, Stats, Tile } from './ui'
import { Asset, Claim, Claims, Library, Merge, Scan } from './Screens3'

const SCREENS: Record<Route, () => JSX.Element> = {
  home: Home, impact: Home, review: Home,
  scan: Home, merge: Home, claims: Claims, claim: Claim, library: Library, asset: Asset,
}
const RAIL: [string, string, Route | null][] = [
  ['Home', 'M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z', 'home'],
  ['Library', 'M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'library'],
  ['Claims', 'M4 9h16M4 15h16M10 3L8 21M16 3l-2 18', 'claims'],
]
const GEAR = 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z'

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
          <span className="p-mark"><Logo /></span>
          {RAIL.map(([label, d, r]) => (
            <button key={label} className={`p-rail-btn ${r === section ? 'on' : ''}`} aria-label={label} onClick={() => (r ? go(r) : notHere())}>
              <span className="p-rail-ic"><Ic d={d} size={19} /></span><span className="p-rail-label">{label}</span>
            </button>
          ))}
          <div className="p-grow" />
          <button className="p-rail-btn" aria-label="Settings" title="Settings" onClick={notHere}><span className="p-rail-ic"><Ic d={GEAR} size={19} /></span></button>
          <span className="p-me" title={`${admin.name}, ${admin.role}`}><Avatar name={admin.name} size={32} /><i /></span>
        </nav>
        <div className="p-body">
          <header className="p-top">
            <div className="p-crumbs">
              {crumbs.map((c, i) => i < crumbs.length - 1
                ? <span key={c}><button className="p-crumb" onClick={() => go(section)}>{c}</button><span className="p-sep">/</span></span>
                : <span key={c} className="p-crumb-now">{c}</span>)}
            </div>
            <span className="p-grow" />
            <button className="p-search" onClick={notHere}><Ic d={ICON.search} size={15} /><span className="p-grow">Search</span><kbd>Ctrl K</kbd></button>
            <button className="p-btn p-new" onClick={notHere}><BtnIc d={ICON.plus}>New</BtnIc></button>
            <button className="p-tbtn" aria-label="Ask AI" title="Ask AI" onClick={notHere}><span className="ai-ic" /></button>
            <button className="p-tbtn" aria-label="Help" title="Help" onClick={notHere}><Ic d={ICON.help} size={18} /></button>
            <button className="p-tbtn" aria-label="Notifications" title="Notifications" onClick={notHere}><Ic d={ICON.bell} size={18} /><i className="p-dot" /></button>
          </header>
          <div className="p-panel">
            <main className={`p-main ${page === 'library' ? 'fixed' : ''}`}><div className="p-container"><Screen /></div></main>
          </div>
        </div>
        {inChange && <ChangeSheet />}
        {route === 'scan' && <Scan />}
        {route === 'merge' && <Merge />}
        {allOpen && <AllChanges />}
      </div>
      {/* The guide belongs to the presentation. Open, it is docked under the app; collapsed, it floats bottom right. */}
      <div className={`p-caption ${guide ? '' : 'mini'}`}>
        {guide && <>
          <span className="p-caption-n">{gi >= 0 ? `Step ${gi + 1} of ${GUIDE.length}` : 'Off the guided path'}</span>
          <span className="p-grow">{gi >= 0 ? GUIDE[gi].caption : 'Explore freely. Next takes you back to the guided path.'}</span>
        </>}
        <span className="p-steps">
          <button className="p-icon" aria-label="Previous step" title="Previous step" disabled={gi <= 0} onClick={() => go(GUIDE[gi - 1].route)}><Ic d="M15 6l-6 6 6 6" /></button>
          <button className="p-icon" aria-label="Next step" title="Next step" disabled={gi === GUIDE.length - 1} onClick={() => go(GUIDE[gi + 1].route)}><Ic d="M9 6l6 6-6 6" /></button>
        </span>
        {guide && <button className="p-link" onClick={reset}>Reset demo</button>}
        {fullBtn}
        {guide
          ? <button className="p-icon" aria-label="Collapse guide" title="Collapse" onClick={() => set({ guide: false })}><Ic d="M6 9l6 6 6-6" /></button>
          : <button className="p-icon" aria-label="Open guide" title="Open guide" onClick={() => set({ guide: true })}><Ic d="M6 15l6-6 6 6" /></button>}
      </div>
      {toast && <div className="p-toast">{toast}</div>}
    </div>
  )
}

// The annual discount change. No tabs: urgency cards, then one bucket at a time. Approving publishes.
function ChangeSheet() {
  const { route, bucket } = useProto()
  return route === 'review' ? <BucketView key={bucket} /> : <Overview />
}
// Every screen of the change shares one panel; each brings its own back step and footer.
function ChangeFrame({ onBack, footer, children }: { onBack?: () => void; footer?: ReactNode; children: ReactNode }) {
  const { go, base } = useProto()
  return (
    <Sheet title={change.title} sub={<Meta items={[[ICON.sheet, change.source], [ICON.clock, change.synced[0].toUpperCase() + change.synced.slice(1)], [ICON.users, `Owner: ${change.owner}`]]} />} onBack={onBack} footer={footer} onClose={() => go(base)}>
      {children}
    </Sheet>
  )
}

const statusA = (s: Parameters<typeof allDone>[0] & { live: boolean }) => (allDone(s) ? 'Published' : s.live ? 'Partly published' : '')

// A thin bar on a card's bottom border. Hidden until work starts; green when done.
const CardProgress = ({ of }: { of: number }) =>
  of > 0 ? <span className={`p-card-progress ${of >= 1 ? 'done' : ''}`} role="progressbar" aria-valuenow={Math.round(of * 100)}><span style={{ width: `${Math.min(of, 1) * 100}%` }} /></span> : null

// Everything that needs attention, then closed changes. Home shows the open ones as cards;
// "View all (n)" shows every one as a horizontal card.
type Item = {
  key: string; tile: [string, 'accent' | 'ai' | 'warn' | 'ok' | 'muted']; chip: ReactNode; title: ReactNode; meta: string
  stats: [number, string, boolean?][]; progress: number; status: string; open: () => void
}
function useItems(): Item[] {
  const s = useProto()
  const changeDone = allDone(s) ? change.places
    : lanes.tokens + ORDER.reduce((n, _, bi) => n + bucketDone(s, bi), 0) + (s.retired ? buckets[3].places : 0)
  const scanDone = (scan.total - spotsLeft(s)) / scan.total
  return [
    { key: 'change', tile: [ICON.tag, 'warn'], chip: <span className="p-chip">1 fact changed</span>, title: change.title,
      meta: `${change.source} · ${change.synced[0].toUpperCase()}${change.synced.slice(1)}`,
      stats: [[change.places, 'places'], [buckets[0].places, 'urgent', true]], progress: changeDone / change.places,
      status: statusA(s) || 'In progress', open: () => s.go('impact') },
    { key: 'scan', tile: [ICON.spark, 'ai'], chip: <AiBadge label="Scan result" />, title: `We found ${scan.total} spots that could become tokens`,
      meta: 'Library · Once linked, the next change updates them by itself',
      stats: [[spotsLeft(s), 'spots left'], [scan.patterns.length, 'patterns']], progress: scanDone,
      status: scanDone >= 1 ? 'Done' : scanDone > 0 ? 'In progress' : 'Not started', open: () => s.go('scan') },
    { key: 'merge', tile: [ICON.copies, 'muted'], chip: <span className="p-chip">Duplicates</span>, title: `${merge.versions} versions of ${merge.asset}`,
      meta: `Library · Merge them and future changes touch ${merge.keep} assets`,
      stats: [[merge.versions, 'versions'], [merge.keep, 'after merging']], progress: s.merged ? 1 : 0,
      status: s.merged ? 'Merged' : s.notDup ? 'Kept separate' : 'Not started', open: () => s.go('merge') },
    ...pastChanges.map(([t, k, p]): Item => ({ key: t, tile: [ICON.tag, 'muted'], chip: <span className="p-chip">{k}</span>, title: t,
      meta: `${change.source} · Closed`, stats: [[p, 'places']], progress: 1, status: 'Closed', open: notHere })),
  ]
}
const itemStats = (it: Item) => <Stats items={it.stats.map(([n, l, hot]) => [<b className={hot ? 'p-hot' : ''}>{n}</b>, l])} />

// 1. Home: what needs attention (a scrolling row of cards), then the library at a glance.
function Home() {
  const { set } = useProto()
  const items = useItems()
  const live = items.slice(0, 3)
  const open = live.filter(it => it.progress < 1).length
  return (
    <>
      <Head title={`Good morning, ${admin.name.split(' ')[0]}`} sub={open ? `${open} ${open === 1 ? 'thing needs' : 'things need'} you today · ${today}` : `You are all caught up · ${today}`} />
      <section className="p-sec">
        <div className="p-sec-row"><h2>Needs attention</h2><span className="p-grow" /><button className="p-link" onClick={() => set({ allOpen: true })}>View all ({items.length})</button></div>
        <Carousel>{live.map(it => (
          <article key={it.key} className="p-change-card" onClick={it.open}>
            <div className="p-card-top"><Tile d={it.tile[0]} tone={it.tile[1]} /><span className="p-grow" />{it.chip}</div>
            <h2>{it.title}</h2>
            <p className="p-meta">{it.meta}</p>
            <div className="p-card-foot">{itemStats(it)}</div>
            <CardProgress of={it.progress} />
          </article>
        ))}</Carousel>
      </section>
      <Dashboard />
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
  const jump = t[t.length - 1] - t[t.length - 2]
  return (
    <section className="p-sec">
      <div className="p-sec-row"><h2>Library at a glance</h2></div>
      <div className="p-dash">
        <div className="p-kpi">
          <div className="p-kpi-top"><span>Asset health</span></div>
          <b className="p-big">{dashboard.assets.toLocaleString('en-US')}<small>assets</small></b>
          <div className="p-hbar">{health.map(([l, n], i) => <span key={l} className={`h${i}`} style={{ flexGrow: n }} />)}</div>
          <div className="p-legend">{health.map(([l, n], i) => <span key={l}><i className={`h${i}`} />{l} <b>{n.toLocaleString('en-US')}</b></span>)}</div>
        </div>
        <div className="p-kpi">
          <div className="p-kpi-top"><span>Updates by itself</span></div>
          <b className="p-big">{pct}%</b>
          <div className="p-meter"><span style={{ width: `${pct}%` }} /></div>
          <span className="p-muted p-small">{linked} of {places} claim places hold tokens. Linking the scan raises this.</span>
        </div>
        <div className="p-kpi">
          <div className="p-kpi-top"><span>Changes synced</span></div>
          <b className="p-big">{weeks[weeks.length - 1][1]}<small>this week</small></b>
          <svg viewBox="0 0 160 56" className="p-chart" aria-label="Changes synced per week">
            {weeks.map(([w, n], i) => <rect key={w} x={i * 20 + 3} y={54 - (n / max) * 50} width={14} height={(n / max) * 50} rx={3} className={i === weeks.length - 1 ? 'on' : ''} />)}
          </svg>
          <div className="p-axis"><span>{weeks[0][0]}</span><span>This week</span></div>
        </div>
        <div className="p-kpi">
          <div className="p-kpi-top"><span>Sellers on outdated content</span><span className="p-delta up">+{jump}</span></div>
          <b className="p-big">{sellersAtRisk.withMeetings}<small>sellers</small></b>
          <svg viewBox="-4 0 168 48" className="p-chart spark" aria-label="Sellers on outdated content, last 6 weeks">
            <polyline points={line} /><circle cx={160} cy={44 - (t[t.length - 1] / top) * 40} r={3.5} />
          </svg>
          <span className="p-muted p-small">With a meeting this week. Jumped when the annual discount changed.</span>
        </div>
      </div>
    </section>
  )
}

// View all: the same cards as Home, laid out horizontally. Progress gets its own column on the right.
function AllChanges() {
  const set = useProto(s => s.set)
  const items = useItems()
  const row = (it: Item) => {
    const pct = Math.round(Math.min(it.progress, 1) * 100)
    return (
      <article key={it.key} className={`p-hcard ${it.status === 'Closed' ? 'closed' : ''}`} onClick={it.open}>
        <Tile d={it.tile[0]} tone={it.tile[1]} />
        <div className="p-hcard-main">
          <div className="p-hcard-title"><h3>{it.title}</h3>{it.chip}</div>
          <p className="p-meta">{it.meta}</p>
          {itemStats(it)}
        </div>
        <div className={`p-hcard-prog ${pct >= 100 ? 'done' : ''}`}>
          <div className="p-hcard-pct"><b>{pct}%</b><span>{it.status}</span></div>
          <span className="p-meter"><span style={{ width: `${pct}%` }} /></span>
        </div>
        <span className="p-hcard-go"><Ic d={ICON.chevron} size={16} /></span>
      </article>
    )
  }
  return (
    <Sheet title={`All (${items.length})`} sub={<Meta items={[[ICON.bolt, `${items.slice(0, 3).length} open`], [ICON.archive, `${items.length - 3} closed`]]} />} onClose={() => set({ allOpen: false })}>
      <section className="p-sec">
        <div className="p-sec-row"><h2>Open</h2></div>
        <div className="p-hcards">{items.slice(0, 3).map(row)}</div>
      </section>
      <section className="p-sec">
        <div className="p-sec-row"><h2>Closed</h2></div>
        <div className="p-hcards">{items.slice(3).map(row)}</div>
      </section>
    </Sheet>
  )
}

// Step 1: what is left, by urgency. Each card says why its places sit there.
function Overview() {
  const s = useProto()
  const open = (id: Bucket) => { s.set({ bucket: id }); s.go('review') }
  const doneIn = (b: typeof buckets[number], bi: number) => (b.id === 'Low' ? (s.retired ? b.places : 0) : bucketDone(s, bi))
  const first = buckets.find((b, bi) => doneIn(b, bi) < b.places)
  const footer = first
    ? <><span className="p-grow" /><button className="p-btn primary" onClick={() => open(first.id)}>{first.id === 'Low' ? 'Retire Low' : `Review ${first.id}`} · {first.places - doneIn(first, buckets.indexOf(first))}<Ic d={ICON.arrow} size={15} /></button></>
    : <><span className="p-grow" /><button className="p-btn primary" onClick={() => s.go(s.base)}>Done</button></>
  // Where the 456 places stand: tokens, published by hand, retired, and what is left.
  const published = ORDER.reduce((n, _, bi) => n + bucketDone(s, bi), 0)
  const retired = s.retired ? buckets[3].places : 0
  const current = lanes.tokens + published + retired
  const seg: [string, number, string][] = [['Updated by tokens', lanes.tokens, 'tok'], ['Published', published, 'pub'], ['Retired', retired, 'ret'], ['Left', change.places - current, 'left']]
  return (
    <ChangeFrame footer={footer}>
      <div className="p-progress">
        <div className="p-progress-top">
          <b className="p-big">{Math.round((current / change.places) * 100)}%</b>
          <span className="p-muted">{current} of {change.places} places show {change.to}</span>
        </div>
        <div className="p-seg">{seg.map(([l, n, k]) => n > 0 && <span key={k} className={k} style={{ flexGrow: n }} title={`${l}: ${n}`} />)}</div>
        <div className="p-seg-legend">{seg.map(([l, n, k]) => <span key={k}><i className={k} />{l} <b>{n}</b></span>)}</div>
      </div>
      <section className="p-sec">
        <div className="p-sec-row"><h2>By urgency</h2><span className="p-grow" /><span className="p-muted p-small">Urgent first. Each level says why its places sit there.</span></div>
        <div className="p-buckets">{buckets.map((b, bi) => {
          const done = doneIn(b, bi)
          const all = done === b.places
          return (
            <div key={b.id} className={`p-bucket ${all ? 'done' : ''}`} onClick={() => open(b.id)}>
              <div className="p-bucket-id"><Urg u={b.id} /></div>
              <div className="p-bucket-n"><b>{b.places - done}</b><span>{done ? `of ${b.places} left` : 'places'}</span></div>
              <div className="p-bucket-why">
                <span>{b.reason}</span>
                {done > 0 && !all && <span className="p-meter"><span style={{ width: `${(done / b.places) * 100}%` }} /></span>}
              </div>
              {all ? <span className="p-chip ok"><Ic d={ICON.check} size={11} />{b.id === 'Low' ? 'Retired' : 'Published'}</span>
                : <button className="p-btn tertiary" onClick={e => { e.stopPropagation(); open(b.id) }}>
                    {done ? 'Continue' : b.id === 'Low' ? 'Retire' : 'Review'}<Ic d={ICON.chevron} size={14} />
                  </button>}
            </div>
          )
        })}</div>
      </section>
    </ChangeFrame>
  )
}

const Urg = ({ u }: { u: Bucket }) => <span className={`p-chip urg-${u.toLowerCase()}`}>{u}</span>

// What a closer-look item proposes. Only an edit is a diff; keep, flag, remove and rewrite are decisions about the old line.
const ACT: Record<Exclude<Act, 'edit'>, [string, string]> = {
  keep: ['No change', ICON.check], flag: ['Flag', ICON.flag], remove: ['Remove', 'M6 6l12 12M18 6L6 18'],
  rewrite: ['New line needed', 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'],
}
const Proposal = ({ j }: { j: JItem }) => j.act === 'edit' ? <Diff old={j.old} next={j.next} /> : (
  <div className="p-prop">
    <div className={`p-prop-old ${j.act === 'remove' ? 'gone' : ''}`}>{j.old}</div>
    <div className={`p-prop-act ${j.act}`}><Ic d={ACT[j.act][1]} size={13} /><b>{ACT[j.act][0]}</b><span>{j.next}</span></div>
  </div>
)

// Step 2: one bucket. Tick the same-sentence groups, publish them once from the footer; judgment items one by one.
function BucketView() {
  const s = useProto()
  const { bucket, pub, jDone, alerted, retired, set, say, go } = s
  const [confirm, setConfirm] = useState(false)
  const [skip, setSkip] = useState<string[]>([])
  const [why, setWhy] = useState<string[]>([])
  const bi = ORDER.indexOf(bucket)
  const b = buckets.find(x => x.id === bucket)!
  const next = buckets[buckets.indexOf(b) + 1]
  const back = () => go('impact')
  const toNext = next && <button className="p-btn" onClick={() => set({ bucket: next.id })}>Next: {next.id} · {next.places}<Ic d={ICON.arrow} size={15} /></button>
  const head = <SecHead title={`${b.places} places`} tag={<Urg u={b.id} />} meta={`${b.reason}.`} />

  if (bi < 0) {
    const footer = retired ? <><span className="p-chip ok">{retire.assets} assets retired</span><span className="p-grow" /><button className="p-btn primary" onClick={back}>Back to all levels</button></>
      : confirm ? <><span className="p-grow">Retire {retire.places} places in {retire.assets} assets?</span>
          <button className="p-btn" onClick={() => setConfirm(false)}>Cancel</button>
          <button className="p-btn primary" onClick={() => { set({ retired: true }); setConfirm(false); say(`${retire.assets} assets retired. Owners have 14 days to object.`) }}>Retire</button></>
      : <><span className="p-grow" /><button className="p-btn primary" onClick={() => setConfirm(true)}><BtnIc d={ICON.archive}>Retire {retire.assets} assets</BtnIc></button></>
    return (
      <ChangeFrame onBack={back} footer={footer}>
        {head}
        <div className="p-card p-list">
          {retireSamples.map(([a, why]) => <div key={a} className="p-row"><b>{a}</b><span className="p-grow p-muted">{why}</span></div>)}
        </div>
        <p className="p-muted p-small">Showing 3 of {retire.assets} assets. Owners can object for 14 days, and undo stays available.</p>
      </ChangeFrame>
    )
  }

  const mine = groups.filter(g => g.split[bi] > 0)
  const open = mine.filter(g => !pub[`${g.id}:${bi}`])
  const picked = open.filter(g => !skip.includes(g.id))
  const items = judgment.filter(j => j.bucket === bi)
  // Places a publish reaches: the same sentence in every urgency level, so it is approved once.
  const reach = (gs: typeof groups) => {
    const keys: string[] = []
    let n = 0
    gs.forEach(g => g.split.forEach((k, i) => {
      const key = `${g.id}:${i}`
      if (k > 0 && !pub[key]) { keys.push(key); n += k }
    }))
    return { keys, n }
  }
  const publish = (gs: typeof groups) => {
    const { keys, n } = reach(gs)
    set({ pub: { ...pub, ...Object.fromEntries(keys.map(k => [k, true as const])) }, live: true })
    say(s.live ? `Published ${n} places.` : `Published ${n} places. ${sellersAtRisk.withMeetings} sellers with meetings this week get one alert.`)
  }
  const toggle = (id: string) => setSkip(skip.includes(id) ? skip.filter(x => x !== id) : [...skip, id])
  const decide = (id: string, v: 'ok' | 'sent') => {
    set({ jDone: { ...jDone, [id]: v }, live: s.live || v === 'ok' })
    say(v === 'ok' ? 'Approved.' : 'Sent to Product marketing.')
  }
  const footer = open.length > 0
    ? <>{toNext}<span className="p-grow" /><button className="p-btn primary" disabled={!picked.length} onClick={() => publish(picked)}>
        <Ic d={ICON.check} size={15} />Approve & Publish {picked.length} {picked.length === 1 ? 'group' : 'groups'} · {reach(picked).n} places</button></>
    : <><span className="p-chip ok">All groups published</span><span className="p-grow" />
        {next ? <button className="p-btn primary" onClick={() => set({ bucket: next.id })}>Next: {next.id} · {next.places}<Ic d={ICON.arrow} size={15} /></button>
          : <button className="p-btn primary" onClick={back}>Back to all levels</button>}</>
  return (
    <ChangeFrame onBack={back} footer={footer}>
      {head}
      <section className="p-sec">
        <div className="p-sec-row">
          <h2 className="ai-label"><AiBadge />We found the same sentence in {mine.length} groups</h2><span className="p-grow" />
          {open.length > 1 && <button className="p-link" onClick={() => setSkip(picked.length ? open.map(g => g.id) : [])}>{picked.length ? 'Clear all' : 'Select all'}</button>}
        </div>
        <div className="p-lbox">{mine.map(g => {
          const done = pub[`${g.id}:${bi}`]
          const on = !done && !skip.includes(g.id)
          const sample = bucketSamples[bi][Number(g.id.slice(1)) % 3]
          return (
            <div key={g.id} className={`p-lrow p-pick ${done ? 'done' : on ? 'on' : ''}`} onClick={() => !done && toggle(g.id)}>
              <span className={`p-box ${done || on ? 'on' : ''}`} role="checkbox" aria-checked={!!done || on} aria-disabled={!!done}>{(done || on) && <Ic d={ICON.check} size={12} />}</span>
              <div className="p-grow">
                <Diff old={g.old} next={g.next} />
                <div className="p-lmeta"><span>e.g. {sample[0]}</span></div>
              </div>
              <span className="p-lside">{done ? <span className="p-donetag"><Ic d={ICON.check} size={13} />Published</span> : <><b>{g.split[bi]}</b> {g.split[bi] === 1 ? 'place' : 'places'}</>}</span>
            </div>
          )
        })}</div>
      </section>
      <section className="p-sec">
        <div className="p-sec-row"><h2>Needs a closer look</h2><span className="p-grow" /><span className="p-muted p-small">{items.filter(j => !jDone[j.id]).length} of {items.length} left</span></div>
        <p className="p-sec-note">The 20% is here, but no rule can swap it safely. The tag says why: math to redo, a claim that may no longer be true, a number in an image or video, signed terms, a translation, or a 20% that is not the discount.</p>
        <div className="p-lbox">{items.map(j => {
          const done = jDone[j.id]
          const open = why.includes(j.id)
          // The suggested route is the main button; the other route is a quiet icon button.
          const toPmm = j.route !== 'Admin'
          return (
            <div key={j.id} className={`p-lrow p-jrow ${done ? 'done' : ''}`}>
              <Proposal j={j} />
              <div className="p-jfoot">
                <div className="p-lmeta">
                  <span className="p-kind">{j.kind}</span><span>{j.where}</span>
                  <span className={`p-conf ${j.confidence.toLowerCase()}`}><i />{j.confidence} confidence</span>
                  {j.working && <button className="p-why" aria-expanded={open} onClick={() => setWhy(open ? why.filter(x => x !== j.id) : [...why, j.id])}>
                    <span className="ai-ic" />{open ? 'Hide reasoning' : 'Why this edit'}<Ic d={open ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'} size={13} />
                  </button>}
                </div>
                <span className="p-grow" />
                <div className="p-lside">
                {done ? <span className="p-donetag"><Ic d={done === 'ok' ? ICON.check : ICON.send} size={13} />{done === 'ok' ? 'Approved' : 'Sent to Product marketing'}</span> : <>
                  <button className="p-btn sm ghost" title={toPmm ? 'Approve' : 'Send to Product marketing'} aria-label={toPmm ? 'Approve' : 'Send to Product marketing'}
                    onClick={() => decide(j.id, toPmm ? 'ok' : 'sent')}><Ic d={toPmm ? ICON.check : ICON.send} size={15} /></button>
                  <button className="p-btn sm" onClick={() => decide(j.id, toPmm ? 'sent' : 'ok')}>{toPmm ? <BtnIc d={ICON.send}>Send to Product marketing</BtnIc> : <BtnIc d={ICON.check}>Approve</BtnIc>}</button>
                </>}
                </div>
              </div>
              {open && <div className="p-whybox">{j.working}</div>}
            </div>
          )
        })}</div>
      </section>
      <section className="p-sec">
        <div className="p-sec-row"><h2>Copies sellers already sent</h2><span className="p-muted p-small">{b.copies}</span></div>
        <div className="p-card p-row">
          <Avatars names={b.sellers} />
          <span className="p-grow">{b.copies} copies are in buyer inboxes and cannot be edited. {b.sellers.join(', ')} get a note with the updated file.</span>
          {alerted.includes(b.id) ? <span className="p-chip ok">Alerted</span>
            : <button className="p-btn" onClick={() => { set({ alerted: [...alerted, b.id] }); say(`${b.sellers.length} sellers alerted.`) }}><BtnIc d={ICON.bell}>Alert {b.sellers.length} sellers</BtnIc></button>}
        </div>
      </section>
    </ChangeFrame>
  )
}
