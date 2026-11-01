// Phase 3 screens: scan results, duplicate merge, claim library + detail, content library + asset detail.
import { useState } from 'react'
import { change, claimHistory, facts, impactAssets, library, merge, messages, scan, v7, type LibAsset, type Part } from '../data/ledgerly'
import { useProto, notHere, scanSpots, scanLinked, spotsLeft } from './store'
import { Dropdown, Head, Sheet } from './ui'

const healthClass = (h: string) => (h === 'Current' ? 'ok' : h === 'In review' ? 'review' : 'warn')
const healthRank = (h: string) => (h === 'Current' ? 2 : h === 'In review' ? 1 : 0)

// Scan results (Card C): plain text that could become tokens.
export function Scan() {
  const s = useProto()
  const { scanDone, spotsOff, uptimeOwner, flagged, set, say } = s
  const [open, setOpen] = useState<number | null>(null)
  const [owner, setOwner] = useState('Product')
  const un = scan.untokenable, video = un.filter(u => u[1].startsWith('Video')).length
  const decide = (i: number, v: 'ok' | 'no') => set({ scanDone: { ...scanDone, [i]: v } })
  const toggleSpot = (i: number, k: number) => {
    const cur = spotsOff[i] ?? []
    set({ spotsOff: { ...spotsOff, [i]: cur.includes(k) ? cur.filter(x => x !== k) : [...cur, k] } })
  }
  return (
    <>
      <Head sub="Plain text that matches a fact. Linked spots update by themselves on the next change.">
        <span className="p-counter"><b>{spotsLeft(s)}</b> of {scan.total} spots left</span>
      </Head>
      <div className="p-stack">
        {scan.patterns.map((p, i) => {
          const done = scanDone[i]
          const off = spotsOff[i] ?? []
          const isNew = !p.token
          return (
            <div key={p.text} className={`p-card ${done ? 'done' : ''}`}>
              <div className="p-row">
                <div className="p-grow">
                  <div><b>"{p.text}"</b> <span className="p-muted">in {p.spots} spots</span></div>
                  <div className="p-muted p-small">
                    {isNew ? <>No fact holds this yet. Suggested: create <code>{`{${p.newFact!.token}}`}</code>, owned by {p.newFact!.owner}.</>
                      : <>Links to <code>{`{${p.token}}`}</code>{off.length > 0 && `, ${off.length} spots excluded`}</>}
                  </div>
                </div>
                <button className="p-link" onClick={() => setOpen(open === i ? null : i)}>{open === i ? 'Hide spots' : 'See spots'}</button>
                {done ? <span className={`p-chip ${done === 'ok' ? 'ok' : ''}`}>{done === 'ok' ? (isNew ? `Created, owner ${uptimeOwner}` : 'Linked') : 'Rejected'}</span>
                  : isNew ? <span className="p-confirm">
                      <select className="p-select" value={owner} onChange={e => setOwner(e.target.value)} aria-label="Owner">
                        {['Product', 'Security', 'Finance', 'Product marketing'].map(o => <option key={o}>{o}</option>)}
                      </select>
                      <button className="p-btn primary" onClick={() => { set({ uptimeOwner: owner }); decide(i, 'ok'); say(`{${p.newFact!.token}} created. ${owner} owns it.`) }}>Create fact and link {p.spots - off.length}</button>
                      <button className="p-btn" onClick={() => decide(i, 'no')}>Reject</button>
                    </span>
                  : <>
                      <button className="p-btn primary" onClick={() => decide(i, 'ok')}>Link {p.spots - off.length}</button>
                      <button className="p-btn" onClick={() => decide(i, 'no')}>Reject</button>
                    </>}
              </div>
              {open === i && (
                <div className="p-samples">
                  {scanSpots[i].map((w, k) => (
                    <div key={w} className={`p-sample ${off.includes(k) ? 'off' : ''}`}>
                      <span className="p-grow"><span className="p-small p-muted">{w}</span><br />…{p.text}…</span>
                      {!done && <button className="p-link" onClick={() => toggleSpot(i, k)}>{off.includes(k) ? 'Include' : 'Exclude'}</button>}
                    </div>
                  ))}
                  <span className="p-muted p-small">Showing 3 of {p.spots}.</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="p-card">
        <div className="p-row">
          <div className="p-grow"><b>{un.length} spots in PDFs and video cannot hold tokens.</b>
            <div className="p-muted p-small">{video} in video, {un.length - video} in PDFs, across {new Set(un.map(u => u[0])).size} assets. Not counted in the {scan.total}. They need a new file or a new recording.</div></div>
          {flagged && <span className="p-chip ok">Flagged</span>}
          <button className="p-btn" onClick={() => set({ untokOpen: true })}>View {un.length} spots</button>
        </div>
      </div>
      {s.untokOpen && (
        <Sheet title={`${un.length} spots that cannot hold tokens`} onClose={() => set({ untokOpen: false })}>
          <div className="p-row p-table-head"><span className="p-grow" />
            {flagged ? <span className="p-chip ok">Flagged for replacement</span> : <button className="p-btn primary" onClick={() => { set({ flagged: true }); say(`${un.length} spots flagged. Their owners get a task.`) }}>Flag all for replacement</button>}
          </div>
          <table className="p-table">
            <thead><tr><th>Asset</th><th>Where</th><th>What</th></tr></thead>
            <tbody>{un.map(([a, where, what]) => <tr key={a + where}><td><b>{a}</b></td><td>{where}</td><td className="p-muted">{what}</td></tr>)}</tbody>
          </table>
        </Sheet>
      )}
    </>
  )
}

// Duplicate merge (Card D).
export function Merge() {
  const { merged, notDup, base, set, say, go } = useProto()
  const [diffs, setDiffs] = useState(false)
  const settled = merged || notDup
  return (
    <>
      <Head sub="Found by comparing slide text and images across the library.">
        {merged ? <span className="p-chip ok">Merged</span> : notDup ? <span className="p-chip">Marked as not duplicates</span> : <>
          <button className="p-btn" onClick={() => setDiffs(d => !d)}>{diffs ? 'Hide differences' : 'Review differences'}</button>
          <button className="p-btn" onClick={() => { set({ notDup: true }); say('Kept as separate assets.') }}>Not duplicates</button>
          <button className="p-btn primary" onClick={() => { set({ merged: true }); say(`Merged. ${merge.archive} versions archived. Links still work.`) }}>Merge</button>
        </>}
      </Head>
      <table className="p-table">
        <thead><tr><th>Group</th><th>Versions</th><th>Difference</th></tr></thead>
        <tbody>{merge.groups.map(g => <tr key={g.name}><td><b>{g.name}</b></td><td>{g.versions}</td><td className="p-muted">{g.diff}</td></tr>)}</tbody>
      </table>
      {diffs && !settled && (
        <div className="p-card">
          <div className="p-card-title">Differences</div>
          <div className="p-row"><span className="p-grow">Slide 5, regional pricing</span><span className="p-muted">EMEA shows € prices · India shows ₹ prices · master shows $</span></div>
          <div className="p-row"><span className="p-grow">Cover</span><span className="p-muted">1 version uses the old logo. Content is the same.</span></div>
          <div className="p-row"><span className="p-grow">Title and date</span><span className="p-muted">11 versions differ only here</span></div>
        </div>
      )}
      <div className="p-card">
        <div className="p-card-title ai-label"><span className="ai-ic" /><span className="ai-text">AI proposal</span></div>
        <p>Keep 1 master and 2 regional variants linked to it. Archive {merge.archive}. Usage history and share links move to the master.</p>
        {merge.result.map(r => <div key={r} className="p-row"><span className="p-grow">{r}</span></div>)}
        <div className="p-banner">Future pricing changes touch {merge.keep} assets here, not {merge.versions}.</div>
      </div>
      {settled && <div className="p-foot"><button className="p-btn primary" onClick={() => go(base)}>Done</button></div>}
    </>
  )
}

// Claim library: facts and messages.
export function Claims() {
  const s = useProto()
  const [tab, setTab] = useState<'facts' | 'messages'>('facts')
  const rows = [
    ...facts,
    ...(s.uptimeOwner ? [{ token: 'uptime_sla', label: 'Uptime SLA', value: '99.9%', owner: s.uptimeOwner, source: 'Service terms', lastChecked: 'Nov 2', usedIn: 18, linked: 0 }] : []),
  ]
  return (
    <>
      <Head title="Claims" sub="Every fact and message your content repeats. Each has one owner and one source.">
        <button className="p-btn" onClick={notHere}>Add claim</button>
      </Head>
      <div className="p-tabs">
        <button className={tab === 'facts' ? 'on' : ''} onClick={() => setTab('facts')}>Facts ({rows.length})</button>
        <button className={tab === 'messages' ? 'on' : ''} onClick={() => setTab('messages')}>Messages ({messages.length})</button>
      </div>
      {tab === 'facts' ? (
        <table className="p-table">
          <thead><tr><th>Token</th><th>Value</th><th>Owner</th><th>Source</th><th>Last checked</th><th>Linked</th></tr></thead>
          <tbody>{rows.map(f => {
            const linked = f.linked + scanLinked(s, f.token)
            return (
              <tr key={f.token} onClick={() => { s.set({ claim: f.token }); s.go('claim') }}>
                <td><code>{`{${f.token}}`}</code></td>
                <td>{f.value}{f.token === change.token && !s.closed && <span className="p-chip warn">Changing to {change.to}</span>}</td>
                <td>{f.owner}</td><td>{f.source}</td><td>{f.lastChecked}</td>
                <td>{linked} of {f.usedIn} places</td>
              </tr>
            )
          })}</tbody>
        </table>
      ) : (
        <table className="p-table">
          <thead><tr><th>Message</th><th>Owner</th><th>Source</th><th>Used in</th></tr></thead>
          <tbody>{messages.map(m => <tr key={m.text} onClick={notHere}><td>{m.text}</td><td>{m.owner}</td><td>{m.source}</td><td>{m.usedIn}</td></tr>)}</tbody>
        </table>
      )}
    </>
  )
}

// Claim detail: where it is used, history, who can edit.
export function Claim() {
  const s = useProto()
  const f = facts.find(x => x.token === s.claim) ?? { token: 'uptime_sla', label: 'Uptime SLA', value: '99.9%', owner: s.uptimeOwner ?? 'Product', source: 'Service terms', lastChecked: 'Nov 2', usedIn: 18, linked: 0 }
  const linked = f.linked + scanLinked(s, f.token)
  const isDiscount = f.token === change.token
  const history = claimHistory[f.token] ?? [['Nov 2', 'Created from the library scan'], ['Oct 1', `Value checked against ${f.source}`]]
  return (
    <>
      <Head title={f.label} sub={<code>{`{${f.token}}`}</code>}>
        {isDiscount && <button className="p-btn primary" onClick={() => s.go('impact')}>Open the change</button>}
      </Head>
      <div className="p-three">
        <div className="p-card"><div className="p-card-title">Value</div><b className="p-big">{f.value}</b>{isDiscount && <span className="p-muted">Changing to {change.to}, effective {change.effective}</span>}</div>
        <div className="p-card"><div className="p-card-title">Where it is used</div><b className="p-big">{f.usedIn}</b><span className="p-muted">{linked} linked as tokens, {f.usedIn - linked} as plain text</span></div>
        <div className="p-card"><div className="p-card-title">Who can edit</div><b>{f.owner}</b><span className="p-muted">Changes sync from {f.source}. Enablement can propose a change; {f.owner} approves it.</span></div>
      </div>
      <div className="p-two">
        <div>
          <div className="p-card-title">Top assets</div>
          <table className="p-table">
            <thead><tr><th>Asset</th><th>Type</th><th>Places</th></tr></thead>
            <tbody>{impactAssets.slice(0, isDiscount ? 6 : 3).map(a => <tr key={a.name} onClick={notHere}><td>{a.name}</td><td>{a.type}</td><td>{a.places}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="p-card">
          <div className="p-card-title">History</div>
          {history.map(([d, t]) => <div key={d + t} className="p-row"><span className="p-muted p-num">{d}</span><span>{t}</span></div>)}
        </div>
      </div>
    </>
  )
}

// Content library: custom filters, real tags, health as a dot plus plain text. Sorted by health.
// The page never scrolls: the table body does, under a fixed header, with pagination below.
type Filter = 'type' | 'team' | 'creator' | 'tag'
const PAGE = 20
export function Library() {
  const { go, merged } = useProto()
  const [f, setFilters] = useState<Record<Filter, string>>({ type: 'All', team: 'All', creator: 'All', tag: 'All' })
  const [page, setPage] = useState(0)
  const setF = (v: Record<Filter, string>) => { setFilters(v); setPage(0) }
  const keys = Object.keys(f) as Filter[]
  const values = (a: LibAsset, k: Filter) => (k === 'tag' ? a.tags : [a[k]])
  const opts = (k: Filter) => ['All', ...Array.from(new Set(library.flatMap(a => values(a, k)))).sort()]
  const rows = library.filter(a => keys.every(k => f[k] === 'All' || values(a, k).includes(f[k]))).sort((x, y) => healthRank(x.health) - healthRank(y.health))
  const any = keys.some(k => f[k] !== 'All')
  const pages = Math.max(1, Math.ceil(rows.length / PAGE))
  const shown = rows.slice(page * PAGE, page * PAGE + PAGE)
  return (
    <>
      <Head title="All content" sub={`${rows.length} of 1,240 assets match. Sorted by health.`}>
        <button className="p-btn" onClick={notHere}>Upload</button>
      </Head>
      <div className="p-filters">
        {keys.map(k => <Dropdown key={k} label={k[0].toUpperCase() + k.slice(1)} value={f[k]} options={opts(k)} onChange={v => setF({ ...f, [k]: v })} />)}
        {any && <button className="p-link" onClick={() => setF({ type: 'All', team: 'All', creator: 'All', tag: 'All' })}>Clear filters</button>}
      </div>
      <div className="p-table-scroll">
        <table className="p-table">
          <thead><tr><th>Asset</th><th>Type</th><th>Team</th><th>Creator</th><th>Tags</th><th>Health</th><th>Updated</th></tr></thead>
          <tbody>{shown.map(a => {
            const live = DETAIL.includes(a.id)
            return (
              <tr key={a.id} className={live ? '' : 'static'} onClick={live ? () => (a.id === 'v7' ? go('asset') : notHere()) : undefined}>
                <td><b>{a.name}</b>{a.id === 'v7' && <span className="p-chip">{merged ? '3 linked versions' : '1 of 14 versions'}</span>}</td>
                <td>{a.type}</td><td>{a.team}</td><td>{a.creator}</td>
                <td><span className="p-tags">{a.tags.map(t => <span key={t} className="p-tag">{t}</span>)}</span></td>
                <td><span className="p-health"><i className={healthClass(a.health)} />{a.health}</span></td><td className="p-muted">{a.updated}</td>
              </tr>
            )
          })}</tbody>
        </table>
        {rows.length === 0 && <p className="p-muted">No assets match these filters.</p>}
      </div>
      <div className="p-pager">
        <span className="p-muted p-small p-grow">{rows.length ? `${page * PAGE + 1}–${page * PAGE + shown.length} of ${rows.length}` : '0 of 0'}</span>
        <button className="p-btn" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
        {Array.from({ length: pages }, (_, i) => <button key={i} className={`p-page ${i === page ? 'on' : ''}`} aria-current={i === page ? 'page' : undefined} onClick={() => setPage(i)}>{i + 1}</button>)}
        <button className="p-btn" disabled={page >= pages - 1} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </>
  )
}
const DETAIL = ['v7', 'halden', 'clear', 'norvik', 'faq', 'web', 'sec', 'rival', 'onb', 'starter']

// Asset detail: claims marked in place, copies, scan this file.
export function Asset() {
  const { fileScanned, fileLinked, v6Asked, merged, set, say, go } = useProto()
  const [scanning, setScanning] = useState(false)
  const plain = fileLinked ? 0 : 2
  const part = (p: Part, i: number) => {
    if (typeof p === 'string') return <span key={i}>{p}</span>
    if ('value' in p) return <span key={i} className="p-tok" title={`{${p.token}}`}>{p.value}</span>
    if (fileLinked) return <span key={i} className="p-tok" title={`{${p.token}}`}>{p.match}</span>
    return <span key={i} className="p-match on" title={`Plain text. Matches {${p.token}}`}>{p.match}</span>
  }
  const runScan = () => { setScanning(true); setTimeout(() => { setScanning(false); set({ fileScanned: true }) }, 900) }
  return (
    <>
      <Head title="Ledgerly pricing overview v7" sub={`Deck · Enablement · ${4 + (fileLinked ? 2 : 0)} tokens, ${plain} plain text matches`}>
        <button className="p-btn" disabled={scanning} onClick={runScan}><span className="ai-ic" /> {scanning ? 'Scanning…' : 'Scan this file'}</button>
      </Head>
      {fileScanned && !fileLinked && (
        <div className="p-banner"><span className="p-grow">Scan found 2 plain text matches on slides 6 and 8. One of them is outdated.</span>
          <button className="p-btn primary" onClick={() => { set({ fileLinked: true }); say('2 matches linked. Slide 6 now shows the current discount once the change goes live.') }}>Link both</button></div>
      )}
      <div className="p-banner">
        <span className="p-grow">{merged ? 'Master of 3 linked versions. 11 versions archived.' : '1 of 14 near-identical versions.'}</span>
        {!merged && <button className="p-link" onClick={() => go('merge')}>Review duplicates</button>}
      </div>
      <div className="p-two">
        <div className="p-stack">
          {v7.slides.map(sl => (
            <div key={sl.n} className="p-card p-slide">
              <span className="p-muted p-small">Slide {sl.n}</span>
              <b>{sl.title}</b>
              <p>{sl.parts.map(part)}</p>
            </div>
          ))}
          <p className="p-muted p-small"><span className="p-tok">Token</span> updates by itself. <span className="p-match on">Plain text</span> matches a fact but will not update.</p>
        </div>
        <div className="p-card">
          <div className="p-card-title">Copies</div>
          <p>Downloaded by <b>{v7.downloads} sellers</b>. {v7.oldCopies.length} still hold version 6.</p>
          {v7.oldCopies.map(([n, w]) => <div key={n} className="p-row"><b>{n}</b><span className="p-grow p-muted p-small">{w}</span></div>)}
          {v6Asked ? <span className="p-chip ok">Asked to switch to v7</span>
            : <button className="p-btn" onClick={() => { set({ v6Asked: true }); say(`Asked ${v7.oldCopies.length} sellers to switch to v7.`) }}>Ask them to switch to v7</button>}
        </div>
      </div>
    </>
  )
}
