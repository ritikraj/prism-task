// Phase 3 screens: scan results, duplicate merge, claim library + detail, content library + asset detail.
import { useState } from 'react'
import { change, claimHistory, facts, impactAssets, library, merge, messages, scan, v7, type LibAsset, type Part } from '../data/ledgerly'
import { useProto, notHere, scanLinked, spotsLeft, allDone } from './store'
import { AiBadge, Avatar, BtnIc, Dropdown, FileType, Head, ICON, Ic, Meta, Sheet, Tile } from './ui'

const healthClass = (h: string) => (h === 'Current' ? 'ok' : h === 'In review' ? 'review' : 'warn')
const healthRank = (h: string) => (h === 'Current' ? 2 : h === 'In review' ? 1 : 0)

// Scan results (Card C): plain text that could become tokens. One list; each row says what links where.
export function Scan() {
  const s = useProto()
  const { scanDone, flagged, set, say } = s
  const un = scan.untokenable, video = un.filter(u => u[1].startsWith('Video')).length
  const decide = (i: number, v: 'ok' | 'no' | 'sent') => set({ scanDone: { ...scanDone, [i]: v } })
  const sum = (v: string) => scan.patterns.reduce((n, p, i) => n + (scanDone[i] === v ? p.spots : 0), 0)
  const seg: [string, number, string][] = [['Linked', sum('ok'), 'pub'], ['Owner notified', sum('sent'), 'sent'], ['Rejected', sum('no'), 'ret'], ['Left', spotsLeft(s), 'left']]
  const handled = scan.total - spotsLeft(s)
  const footer = <><span className="p-muted">Linked spots update by themselves on the next change.</span><span className="p-grow" /><button className="p-btn primary" onClick={() => s.go(s.base)}>Done</button></>
  return (
    <Sheet title="Scan results" sub={<Meta items={[[ICON.folder, 'Library'], [ICON.clock, 'Scanned today 06:00'], [ICON.doc, '1,240 assets']]} />} onClose={() => s.go(s.base)} footer={footer}>
      <div className="p-progress">
        <div className="p-progress-top"><b className="p-big">{handled}</b><span className="p-muted">of {scan.total} spots handled</span></div>
        <div className="p-seg">{seg.map(([l, n, k]) => n > 0 && <span key={k} className={k} style={{ flexGrow: n }} title={`${l}: ${n}`} />)}</div>
        <div className="p-seg-legend">{seg.map(([l, n, k]) => <span key={k}><i className={k} />{l} <b>{n}</b></span>)}</div>
      </div>
      <section className="p-sec">
        <div className="p-sec-row"><h2 className="ai-label"><AiBadge />We found plain text that matches a fact</h2></div>
        <div className="p-lbox">{scan.patterns.map((p, i) => {
          const done = scanDone[i]
          const isNew = !p.token
          return (
            <div key={p.text} className={`p-lrow ${done ? 'done' : ''}`}>
              <div className="p-count"><b>{p.spots}</b><span>spots</span></div>
              <div className="p-grow">
                <div className="p-quote">“{p.text}”</div>
                <div className="p-lmeta">
                  {isNew ? <><span>No fact yet</span><span>Suggested <code>{`{${p.newFact!.token}}`}</code></span></>
                    : <span className="p-linkto"><Ic d={ICON.link} size={12} />Links to <code>{`{${p.token}}`}</code></span>}
                  {/* A diff of each spot needs real content, so this stays a placeholder. */}
                  <button className="p-why" disabled title="Needs real content to show each spot">See spots</button>
                </div>
              </div>
              <div className="p-lside">
                {done ? <span className={`p-donetag ${done === 'no' ? 'off' : ''}`}><Ic d={done === 'no' ? 'M6 6l12 12M18 6L6 18' : done === 'sent' ? ICON.bell : ICON.check} size={13} />
                    {done === 'ok' ? 'Linked' : done === 'sent' ? `${p.newFact!.owner} notified` : 'Rejected'}</span>
                  : isNew ? <button className="p-btn sm" onClick={() => { decide(i, 'sent'); say(`${p.newFact!.owner} asked to create {${p.newFact!.token}}.`) }}><BtnIc d={ICON.bell}>Notify {p.newFact!.owner}</BtnIc></button>
                  : <>
                      <button className="p-btn sm ghost" title="Reject" aria-label="Reject" onClick={() => decide(i, 'no')}><Ic d="M6 6l12 12M18 6L6 18" size={15} /></button>
                      <button className="p-btn sm" onClick={() => decide(i, 'ok')}><BtnIc d={ICON.link}>Link {p.spots}</BtnIc></button>
                    </>}
              </div>
            </div>
          )
        })}</div>
      </section>
      <section className="p-sec">
        <div className="p-sec-row"><h2>Not counted</h2></div>
        <div className="p-lbox">
          <div className="p-lrow">
            <Tile d={ICON.film} tone="muted" />
            <div className="p-grow">
              <div className="p-ltitle">{un.length} spots in PDFs and video cannot hold tokens</div>
              <div className="p-lmeta"><span>{video} in video</span><span>{un.length - video} in PDFs</span><span>{new Set(un.map(u => u[0])).size} assets</span><span>Need a new file or recording</span></div>
            </div>
            <div className="p-lside">
              {flagged && <span className="p-donetag"><Ic d={ICON.flag} size={13} />Flagged</span>}
              <button className="p-btn sm" onClick={() => set({ untokOpen: true })}>View {un.length}<Ic d={ICON.chevron} size={14} /></button>
            </div>
          </div>
        </div>
      </section>
      {s.untokOpen && (
        <Sheet title={`${un.length} spots that cannot hold tokens`} sub={<Meta items={[[ICON.pdf, 'PDFs'], [ICON.film, 'Video']]} />} onBack={() => set({ untokOpen: false })} onClose={() => set({ untokOpen: false })}
          footer={<><span className="p-grow" />{flagged ? <span className="p-chip ok">Flagged for replacement</span> : <button className="p-btn primary" onClick={() => { set({ flagged: true }); say(`${un.length} spots flagged. Their owners get a task.`) }}><BtnIc d={ICON.flag}>Flag all for replacement</BtnIc></button>}</>}>
          <table className="p-table">
            <thead><tr><th>Asset</th><th>Where</th><th>What</th></tr></thead>
            <tbody>{un.map(([a, where, what]) => <tr key={a + where} className="static"><td><b>{a}</b></td><td>{where}</td><td className="p-muted">{what}</td></tr>)}</tbody>
          </table>
        </Sheet>
      )}
    </Sheet>
  )
}

// Duplicate merge (Card D): what we found, then what is left after merging. Differences sit in each row.
export function Merge() {
  const { merged, notDup, base, set, say, go } = useProto()
  const settled = merged || notDup
  const footer = settled
    ? <><span className={`p-chip ${merged ? 'ok' : ''}`}>{merged ? 'Merged' : 'Marked as not duplicates'}</span><span className="p-grow" /><button className="p-btn primary" onClick={() => go(base)}>Done</button></>
    : <>
        <button className="p-btn" onClick={() => { set({ notDup: true }); say('Kept as separate assets.') }}>Not duplicates</button>
        <span className="p-grow" />
        <button className="p-btn primary" onClick={() => { set({ merged: true }); say(`Merged. ${merge.archive} versions archived. Links still work.`) }}><BtnIc d={ICON.merge}>Merge into {merge.keep}</BtnIc></button>
      </>
  return (
    <Sheet title={`${merge.versions} versions of ${merge.asset}`} sub={<Meta items={[[ICON.folder, 'Library'], [ICON.deck, 'Deck'], [ICON.users, 'Enablement']]} />} onClose={() => go(base)} footer={footer}>
      <div className="p-progress p-merge-hero">
        <div className="p-mh"><b className="p-big">{merge.versions}</b><span>versions today</span></div>
        <span className="p-mh-arrow"><Ic d={ICON.arrow} size={20} /></span>
        <div className="p-mh"><b className="p-big">{merge.keep}</b><span>{merged ? 'assets now' : 'after merging'}</span></div>
        <span className="p-grow" />
        <span className="p-mh-note">Future pricing changes touch {merge.keep} assets here, not {merge.versions}.</span>
      </div>
      <section className="p-sec">
        <div className="p-sec-row"><h2 className="ai-label"><AiBadge />What we found</h2><span className="p-grow" /><span className="p-muted p-small">Compared slide text and images</span></div>
        <div className="p-lbox">{merge.groups.map(g => (
          <div key={g.name} className="p-lrow">
            <div className="p-count"><b>{g.versions}</b><span>{g.versions === 1 ? 'version' : 'versions'}</span></div>
            <div className="p-grow">
              <div className="p-ltitle">{g.name}</div>
              <div className="p-lmeta"><span>{g.detail}</span></div>
            </div>
            <span className="p-outcome">{g.outcome}</span>
          </div>
        ))}</div>
      </section>
      <section className="p-sec">
        <div className="p-sec-row"><h2>{merged ? 'Library now' : 'After merging'}</h2></div>
        <div className="p-lbox">
          {merge.result.map((r, i) => {
            const [name, role] = [r.replace(/ \(.*\)$/, ''), i ? 'Linked variant' : 'Master']
            return (
              <div key={r} className="p-lrow p-lrow-c">
                <span className={`p-ricon ${i ? '' : 'master'}`}><Ic d={i ? ICON.link : ICON.star} size={14} /></span>
                <span className="p-grow p-ltitle">{name}</span>
                <span className={`p-chip ${i ? '' : 'ai'}`}>{role}</span>
              </div>
            )
          })}
          <div className="p-lrow p-lrow-c">
            <span className="p-ricon"><Ic d={ICON.archive} size={14} /></span>
            <div className="p-grow"><div className="p-ltitle">{merge.archive} versions archived</div><div className="p-lmeta"><span>Usage history and share links move to the master</span></div></div>
            <span className="p-chip">Archive</span>
          </div>
        </div>
      </section>
    </Sheet>
  )
}

// Claim library: facts and messages.
export function Claims() {
  const s = useProto()
  const [tab, setTab] = useState<'facts' | 'messages'>('facts')
  const rows = facts
  return (
    <>
      <Head title="Claims" sub="Every fact and message your content repeats. Each has one owner and one source.">
        <button className="p-btn" onClick={notHere}><BtnIc d={ICON.plus}>Add claim</BtnIc></button>
      </Head>
      <div className="p-tabs">
        <button className={tab === 'facts' ? 'on' : ''} onClick={() => setTab('facts')}>Facts ({rows.length})</button>
        <button className={tab === 'messages' ? 'on' : ''} onClick={() => setTab('messages')}>Messages ({messages.length})</button>
      </div>
      {tab === 'facts' ? (
        <table className="p-table">
          <thead><tr><th>Token</th><th>Value</th><th>Owner</th><th>Source</th><th>Last checked</th><th>Linked places</th></tr></thead>
          <tbody>{rows.map(f => {
            const linked = f.linked + scanLinked(s, f.token)
            return (
              <tr key={f.token} onClick={() => { s.set({ claim: f.token }); s.go('claim') }}>
                <td><code>{`{${f.token}}`}</code></td>
                <td>{f.value}{f.token === change.token && !allDone(s) && <span className="p-chip warn">Changing to {change.to}</span>}</td>
                <td>{f.owner}</td><td>{f.source}</td><td>{f.lastChecked}</td>
                <td><span className="p-linked"><span className="p-meter"><span style={{ width: `${(linked / f.usedIn) * 100}%` }} /></span>{linked} of {f.usedIn}</span></td>
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
  const f = facts.find(x => x.token === s.claim) ?? facts[0]
  const linked = f.linked + scanLinked(s, f.token)
  const isDiscount = f.token === change.token
  const history = claimHistory[f.token] ?? [['Nov 2', 'Created from the library scan'], ['Oct 1', `Value checked against ${f.source}`]]
  return (
    <>
      <Head title={f.label} sub={<code>{`{${f.token}}`}</code>}>
        {isDiscount && <button className="p-btn primary" onClick={() => s.go('impact')}>Open the change<Ic d={ICON.arrow} size={15} /></button>}
      </Head>
      <div className="p-three">
        <div className="p-card"><div className="p-card-title">Value</div><b className="p-big">{f.value}</b>{isDiscount && <span className="p-muted">Changing to {change.to}</span>}</div>
        <div className="p-card"><div className="p-card-title">Where it is used</div><b className="p-big">{f.usedIn}</b><span className="p-muted">{linked} linked as tokens, {f.usedIn - linked} as plain text</span></div>
        <div className="p-card"><div className="p-card-title">Who can edit</div><b>{f.owner}</b><span className="p-muted">Changes sync from {f.source}. Enablement can propose a change; {f.owner} approves it.</span></div>
      </div>
      <div className="p-two">
        <div>
          <div className="p-card-title">Top assets</div>
          <table className="p-table">
            <thead><tr><th>Asset</th><th>Type</th><th>Places</th></tr></thead>
            <tbody>{impactAssets.slice(0, isDiscount ? 6 : 3).map(a => <tr key={a.name} onClick={notHere}><td><b>{a.name}</b></td><td><FileType type={a.type} /></td><td>{a.places}</td></tr>)}</tbody>
          </table>
        </div>
        <div className="p-card">
          <div className="p-card-title">History</div>
          <ol className="p-timeline">{history.map(([d, t]) => <li key={d + t}><span>{t}</span><span className="p-muted p-small">{d}</span></li>)}</ol>
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
        <button className="p-btn" onClick={notHere}><BtnIc d={ICON.upload}>Upload</BtnIc></button>
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
                <td><FileType type={a.type} /></td><td>{a.team}</td><td><span className="p-person"><Avatar name={a.creator} size={22} />{a.creator}</span></td>
                <td><span className="p-tags">{a.tags.slice(0, 2).map(t => <span key={t} className="p-tag">{t}</span>)}{a.tags.length > 2 && <span className="p-tag more" title={a.tags.slice(2).join(", ")}>+{a.tags.length - 2}</span>}</span></td>
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
          {v7.oldCopies.map(([n, w]) => <div key={n} className="p-row"><Avatar name={n} size={26} /><span className="p-grow"><b>{n}</b><br /><span className="p-muted p-small">{w}</span></span></div>)}
          {v6Asked ? <span className="p-chip ok">Asked to switch to v7</span>
            : <button className="p-btn" onClick={() => { set({ v6Asked: true }); say(`Asked ${v7.oldCopies.length} sellers to switch to v7.`) }}><BtnIc d={ICON.send}>Ask them to switch to v7</BtnIc></button>}
        </div>
      </div>
    </>
  )
}
