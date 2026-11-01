// Prototype data + in-memory state. "Reset demo" (or a page refresh) restores everything.
import { create } from 'zustand'
import { change, derived, facts, lanes, merge, scan, wordingGroups } from '../data/ledgerly'

const POOL_SCAN = [
  'Starter plan one-pager, page 1', 'Mid-market proposal template, page 4', 'Onboarding deck, slide 8', 'Security overview, slide 2',
  'Annual billing FAQ, section 5', 'Renewal email template', 'Rivalset battlecard, section 1', 'Clearwater pricing deck, slide 11',
  'Partner pricing guide, page 2', 'Trust and uptime one-pager', 'Enterprise proposal template, page 7', 'Halden renewal proposal, page 5',
]

export type Confidence = 'High' | 'Medium' | 'Low'
export type Route = 'home' | 'batch' | 'impact' | 'review' | 'golive' | 'tracking' | 'scan' | 'merge' | 'claims' | 'claim' | 'library' | 'asset'
export const CHANGE_ROUTES: Route[] = ['impact', 'review', 'golive', 'tracking']
export const LIBRARY_ROUTES: Route[] = ['library', 'asset', 'scan', 'merge']
export const CLAIM_ROUTES: Route[] = ['claims', 'claim']

// The guided path, in order.
export const GUIDE: { route: Route; caption: string }[] = [
  { route: 'home', caption: 'Changes arrive from their source, sorted by how many live deals they touch.' },
  { route: 'impact', caption: `${change.places} places, ranked by who is about to use them. Retire what nobody opens.` },
  { route: 'review', caption: `${change.places} edits became ${lanes.decisions} decisions, in three lanes.` },
  { route: 'golive', caption: 'What is approved goes live. The rest carries a warning. Only 63 sellers are told.' },
  { route: 'tracking', caption: 'After go live: who saw it, and which copies are still out.' },
  { route: 'scan', caption: `${scan.total} spots could hold tokens. Link them now and the next change updates them by itself.` },
  { route: 'library', caption: 'Every asset shows its health: current, outdated, or in review.' },
  { route: 'asset', caption: 'Claims are marked in place. Any file can be scanned on demand.' },
  { route: 'merge', caption: `${merge.versions} versions become ${merge.keep}. Future changes touch ${merge.keep} assets here, not ${merge.versions}.` },
]

// Scan results: 3 sample spots per pattern.
export const scanSpots = scan.patterns.map((_, i) => [0, 1, 2].map(k => POOL_SCAN[(i * 3 + k) % POOL_SCAN.length]))

const POOL = [
  'Ledgerly pricing overview v7, slide 4', 'Annual billing FAQ, section 2', 'Clearwater pricing deck, slide 9',
  'Mid-market proposal template, page 2', 'Renewal email template', 'Starter plan one-pager',
  'Partner pricing guide, page 6', 'Onboarding deck, slide 12', 'Q4 promo battlecard', 'Halden renewal proposal, page 3',
]
export const groups = wordingGroups.map(([old, places], i) => ({
  id: `g${i}`, old, next: old.replace('20%', change.to), places,
  samples: [0, 1, 2].map(k => POOL[(i * 3 + k) % POOL.length]),
}))

export type JItem = { id: string; kind: string; where: string; old: string; next: string; working?: string; confidence: Confidence; route: 'Admin' | 'Product marketing' }
const starter = Number(facts[1].value.match(/\d+/)![0])
const detailed: JItem[] = [
  {
    id: 'j1', kind: 'Derived number', where: 'Norvik ROI one-pager, page 2', confidence: 'High', route: 'Admin',
    old: `"${derived.text} $${derived.before.toLocaleString('en-US')} a year."`,
    next: `"${derived.text} $${derived.after.toLocaleString('en-US')} a year."`,
    working: `${derived.seats} seats × $${starter} × 12 months × 15% = $${derived.after.toLocaleString('en-US')}. Uses {starter_price} and {annual_discount}.`,
  },
  {
    id: 'j2', kind: 'Claim built on a fact', where: 'Competitive overview deck, slide 5', confidence: 'Medium', route: 'Product marketing',
    old: '"The best annual discount in our category."', next: 'Remove the claim. Suggest "Save 15% with annual billing."',
    working: 'Rivalset offers 18% on annual plans. This is positioning, so Product marketing decides.',
  },
  {
    id: 'j3', kind: 'Chart', where: 'Ledgerly pricing overview v7, slide 7', confidence: 'Low', route: 'Admin',
    old: 'Chart "Monthly vs annual cost" shows 20% saved.', next: 'Flag: replace the chart image.',
    working: 'The number is inside an image. Prism read it with text recognition.',
  },
  {
    id: 'j4', kind: 'Video', where: 'Q3 customer webinar, 14:20', confidence: 'Low', route: 'Admin',
    old: 'Presenter says "20% off".', next: 'Flag: add an on-screen correction, or retire the clip.',
    working: 'Found in the transcript. A person decides if the clip is still worth keeping.',
  },
]
const KINDS = ['Derived number', 'Claim built on a fact', 'Chart', 'Video']
const CONF: Confidence[] = ['Medium', 'High', 'Low']
// 28 in total: 8 routed to Product marketing (j2 + 7 more), 20 to the admin.
export const judgment: JItem[] = [
  ...detailed,
  ...Array.from({ length: lanes.judgment - detailed.length }, (_, i): JItem => ({
    id: `j${i + 5}`, kind: KINDS[i % 4], where: POOL[(i + 3) % POOL.length], confidence: CONF[i % 3],
    route: i < 7 ? 'Product marketing' : 'Admin', old: 'Mentions the 20% annual discount.', next: 'Update to 15%.',
  })),
]
export const DETAILED = detailed.length

type S = {
  route: Route
  guide: boolean
  toast: string | null
  retired: boolean
  groupsOk: string[]
  excluded: Record<string, number[]>
  jDone: Record<string, 'ok' | 'sent'>
  jIndex: number
  live: boolean
  closed: boolean
  split: boolean
  scheduled: boolean
  draft: boolean
  nudged: boolean
  claim: string
  scanDone: Record<number, 'ok' | 'no'>
  spotsOff: Record<number, number[]>
  uptimeOwner: string | null
  flagged: boolean
  fileScanned: boolean
  fileLinked: boolean
  v6Asked: boolean
  merged: boolean
  notDup: boolean
  go: (r: Route) => void
  set: (p: Partial<S>) => void
  say: (msg: string) => void
  reset: () => void
}
const initial = {
  route: 'home' as Route, guide: true, toast: null, retired: false, groupsOk: [], excluded: {}, jDone: {}, jIndex: 0,
  live: false, closed: false, split: false, scheduled: false, draft: false, nudged: false,
  claim: 'annual_discount', scanDone: {}, spotsOff: {}, uptimeOwner: null, flagged: false,
  fileScanned: false, fileLinked: false, v6Asked: false, merged: false, notDup: false,
}
let timer = 0
export const useProto = create<S>(set => ({
  ...initial,
  // Jumping to tracking (from the guide) implies the change went live.
  go: route => set(s => ({ route, toast: null, live: s.live || route === 'tracking' })),
  set: p => set(p),
  say: toast => { clearTimeout(timer); set({ toast }); timer = window.setTimeout(() => set({ toast: null }), 2400) },
  reset: () => set({ ...initial }),
}))
export const notHere = () => useProto.getState().say('Not in this prototype yet.')

export const decisionsLeft = (s: Pick<S, 'groupsOk' | 'jDone'>) => lanes.decisions - s.groupsOk.length - Object.keys(s.jDone).length
// Spots linked by the scan, per token (feeds the claim library's linked counts).
export const scanLinked = (s: Pick<S, 'scanDone' | 'spotsOff'>, token: string) =>
  scan.patterns.reduce((n, p, i) => n + ((p.token ?? p.newFact?.token) === token && s.scanDone[i] === 'ok' ? p.spots - (s.spotsOff[i]?.length ?? 0) : 0), 0)
export const spotsLeft = (s: Pick<S, 'scanDone'>) => scan.patterns.reduce((n, p, i) => n - (s.scanDone[i] ? p.spots : 0), scan.total)

export const placesApproved =(s: Pick<S, 'groupsOk' | 'excluded'>) =>
  groups.filter(g => s.groupsOk.includes(g.id)).reduce((n, g) => n + g.places - (s.excluded[g.id]?.length ?? 0), 0)
