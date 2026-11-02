// Prototype data + in-memory state. "Reset demo" (or a page refresh) restores everything.
import { create } from 'zustand'
import { buckets, change, derived, facts, groupSplit, judgmentSplit, merge, scan, wordingGroups, type Bucket } from '../data/ledgerly'

export type Confidence = 'High' | 'Medium' | 'Low'
export type Route = 'home' | 'impact' | 'review' | 'scan' | 'merge' | 'claims' | 'claim' | 'library' | 'asset'
// impact: the four urgency cards; review: inside one of them.
export const CHANGE_ROUTES: Route[] = ['impact', 'review']
export const LIBRARY_ROUTES: Route[] = ['library', 'asset']
// These open as side modals over the page you came from (base).
export const MODAL_ROUTES: Route[] = [...CHANGE_ROUTES, 'scan', 'merge']
export const CLAIM_ROUTES: Route[] = ['claims', 'claim']

// The guided path, in order.
export const GUIDE: { route: Route; caption: string }[] = [
  { route: 'home', caption: 'Changes arrive from their source, sorted by how many live deals they touch.' },
  { route: 'impact', caption: `${change.places} places. 160 already updated by tokens. The other 296 sorted by urgency, each with its reason.` },
  { route: 'review', caption: 'Urgent first. Identical sentences approve and publish together. The rest one by one.' },
  { route: 'scan', caption: `${scan.total} spots could hold tokens. Link them now and the next change updates them by itself.` },
  { route: 'library', caption: 'Every asset shows its health: current, outdated, or in review.' },
  { route: 'asset', caption: 'Claims are marked in place. Any file can be scanned on demand.' },
  { route: 'merge', caption: `${merge.versions} versions become ${merge.keep}. Future changes touch ${merge.keep} assets here, not ${merge.versions}.` },
]


const POOL = [
  'Ledgerly pricing overview v7, slide 4', 'Annual billing FAQ, section 2', 'Clearwater pricing deck, slide 9',
  'Mid-market proposal template, page 2', 'Renewal email template', 'Starter plan one-pager',
  'Partner pricing guide, page 6', 'Onboarding deck, slide 12', 'Q4 promo battlecard', 'Halden renewal proposal, page 3',
]
export const groups = wordingGroups.map(([old, places], i) => ({
  id: `g${i}`, old, next: old.replace('20%', change.to), places, split: groupSplit[i],
  samples: [0, 1, 2].map(k => POOL[(i * 3 + k) % POOL.length]),
}))

export type JItem = { id: string; bucket: number; kind: string; where: string; old: string; next: string; working?: string; confidence: Confidence; route: 'Admin' | 'Product marketing' }
const starter = Number(facts[1].value.match(/\d+/)![0])
const detailed: Omit<JItem, 'bucket'>[] = [
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
const bucketOf = (i: number) => (i < judgmentSplit[0] ? 0 : i < judgmentSplit[0] + judgmentSplit[1] ? 1 : 2)
export const judgment: JItem[] = [
  ...detailed,
  ...Array.from({ length: judgmentSplit.reduce((a, b) => a + b) - detailed.length }, (_, i): Omit<JItem, 'bucket'> => ({
    id: `j${i + 5}`, kind: KINDS[i % 4], where: POOL[(i + 3) % POOL.length], confidence: CONF[i % 3],
    route: i < 7 ? 'Product marketing' : 'Admin', old: 'Mentions the 20% annual discount.', next: 'Update to 15%.',
  })),
].map((j, i) => ({ ...j, bucket: bucketOf(i) }))
export const DETAILED = detailed.length

type S = {
  route: Route
  base: Route
  guide: boolean
  toast: string | null
  retired: boolean
  bucket: Bucket
  pub: Record<string, true>
  jDone: Record<string, 'ok' | 'sent'>
  alerted: Bucket[]
  live: boolean
  allOpen: boolean
  untokOpen: boolean
  claim: string
  // ok = linked, no = rejected, sent = the owner was asked to create the fact
  scanDone: Record<number, 'ok' | 'no' | 'sent'>
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
  route: 'home' as Route, base: 'home' as Route, guide: true, toast: null, retired: false, bucket: 'Urgent' as Bucket, pub: {}, jDone: {}, alerted: [],
  live: false, allOpen: false, untokOpen: false,
  claim: 'annual_discount', scanDone: {}, flagged: false,
  fileScanned: false, fileLinked: false, v6Asked: false, merged: false, notDup: false,
}
let timer = 0
export const useProto = create<S>(set => ({
  ...initial,
  // Jumping to tracking (from the guide) implies the change went live.
  go: route => set(s => ({
    route, base: MODAL_ROUTES.includes(route) ? (MODAL_ROUTES.includes(s.route) ? s.base : s.route) : route, toast: null, allOpen: false, untokOpen: false })),
  set: p => set(p),
  say: toast => { clearTimeout(timer); set({ toast }); timer = window.setTimeout(() => set({ toast: null }), 2400) },
  reset: () => set({ ...initial }),
}))
export const notHere = () => useProto.getState().say('Not in this prototype yet.')

// Places handled in a bucket (0 Urgent, 1 High, 2 Medium): published groups, decided items, alerted copies.
export const ORDER: Bucket[] = ['Urgent', 'High', 'Medium']
export const bucketDone = (s: Pick<S, 'pub' | 'jDone' | 'alerted'>, bi: number) =>
  groups.reduce((n, g) => n + (s.pub[`${g.id}:${bi}`] ? g.split[bi] : 0), 0)
  + judgment.filter(j => j.bucket === bi && s.jDone[j.id]).length
  + (s.alerted.includes(ORDER[bi]) ? buckets[bi].copies : 0)
export const allDone = (s: Pick<S, 'pub' | 'jDone' | 'alerted' | 'retired'>) =>
  s.retired && ORDER.every((_, bi) => bucketDone(s, bi) === buckets[bi].places)

// Spots linked by the scan, per token (feeds the claim library's linked counts).
export const scanLinked = (s: Pick<S, 'scanDone'>, token: string) =>
  scan.patterns.reduce((n, p, i) => n + (p.token === token && s.scanDone[i] === 'ok' ? p.spots : 0), 0)
export const spotsLeft = (s: Pick<S, 'scanDone'>) => scan.patterns.reduce((n, p, i) => n - (s.scanDone[i] ? p.spots : 0), scan.total)
