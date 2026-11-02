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

// What the closer look proposes: a new sentence (edit), or a decision about the old one.
export type Act = 'edit' | 'keep' | 'flag' | 'remove' | 'rewrite'
export type JItem = { id: string; bucket: number; kind: string; where: string; old: string; act: Act; next: string; working?: string; confidence: Confidence; route: 'Admin' | 'Product marketing' }
const starter = Number(facts[1].value.match(/\d+/)![0])
const save = (seats: number, pct: number) => `$${(seats * starter * 12 * pct / 100).toLocaleString('en-US')}`
// "Needs a closer look": places where the 20% shows up but no rule can swap it safely.
// The kind is the reason: math to redo, a claim that may no longer be true, a number baked into an image
// or video, signed terms, a translation, wording that hides the number, or a 20% that is not the discount at all.
// next is the new sentence for an edit, and a short note for every other act.
// 28 in total, in urgency order (5 Urgent, 9 High, 14 Medium). 8 go to Product marketing, 20 stay with the admin.
type Seed = [kind: string, where: string, old: string, act: Act, next: string, working: string, confidence: Confidence, pmm?: boolean]
const SEEDS: Seed[] = [
  // Urgent
  ['Math', 'Norvik ROI one-pager, page 2', `"${derived.text} $${derived.before.toLocaleString('en-US')} a year."`, 'edit', `"${derived.text} $${derived.after.toLocaleString('en-US')} a year."`,
    `${derived.seats} seats × $${starter} × 12 months × 15% = $${derived.after.toLocaleString('en-US')}. Uses {starter_price} and {annual_discount}.`, 'High'],
  ['Claim', 'Competitive overview deck, slide 5', '"The best annual discount in our category."', 'edit', '"Save 15% with annual billing."',
    'Rivalset offers 18% on annual plans, so "best" is no longer true. This is positioning, so Product marketing decides.', 'Medium', true],
  ['Contract', 'Halden renewal proposal, page 5', '"Your renewal includes 20% off annual billing, as agreed on Oct 12."', 'keep', 'Halden signed at 20% until the March renewal.',
    'Matched to a signed order form in the CRM. Changing it would break a commitment.', 'High'],
  ['Image', 'Clearwater pricing deck, slide 11', 'Chart "Monthly vs annual cost" shows 20% saved.', 'flag', 'Redesign the chart. The number is in the image.',
    'The number is inside an image, read with text recognition. No token can reach it.', 'Low'],
  ['Video', 'Q3 customer webinar, 14:20', 'Presenter says "20% off".', 'flag', 'Add an on-screen correction, or retire the clip.',
    'Found in the transcript. A person decides if the clip is still worth keeping.', 'Low'],
  // High
  ['Math', 'Mid-market proposal template, page 4', `"A 20-seat team saves ${save(20, 20)} a year."`, 'edit', `"A 20-seat team saves ${save(20, 15)} a year."`,
    `20 seats × $${starter} × 12 months × 15% = ${save(20, 15)}.`, 'High'],
  ['Not the discount', 'Onboarding deck, slide 12', '"Teams onboard 20% faster with guided setup."', 'keep', 'This 20% is onboarding speed, not price.',
    'Same number, different fact. Nothing in the sentence is about price.', 'High'],
  ['Claim', 'Rivalset battlecard, section 2', '"Our annual discount beats Rivalset by 2 points."', 'remove', 'No longer true. Rivalset gives 18%, we give 15%.',
    'The comparison flipped. {rivalset_price} lists 18% annual. The battlecard needs a new angle.', 'Medium', true],
  ['Translation', 'Pricing overview, EMEA (German), slide 4', '"20 % Rabatt bei jährlicher Zahlung."', 'edit', '"15 % Rabatt bei jährlicher Zahlung."',
    'German copy of the EMEA variant. A native reader should confirm the wording.', 'Medium'],
  ['Wording', 'Annual billing FAQ, section 2', '"Pay yearly and get one fifth off."', 'edit', '"Pay yearly and save 15%."',
    '"One fifth" is 20% written in words, so the token match missed it.', 'Medium'],
  ['Claim', 'Q4 promo battlecard', '"Biggest discount of the year: 20% off annual plans."', 'rewrite', 'At 15% this is not the "biggest" offer. The hook needs a new angle.',
    'A campaign headline built on the old number. Product marketing owns campaign copy.', 'Medium', true],
  ['Image', 'Partner pricing guide, page 6', 'Price table image shows "Annual: 20% off".', 'flag', 'Redesign the price table.',
    'Pasted as a picture, so no token can reach it.', 'Low'],
  ['Contract', 'Enterprise order form template, clause 4.2', '"Customer receives a 20% discount for annual prepayment."', 'edit', '"Customer receives a 15% discount for annual prepayment."',
    'Template for new deals only. Signed order forms are left alone.', 'High'],
  ['Video', 'Product tour video, 03:10', 'Narrator says "save 20% on annual".', 'flag', 'Re-record the line or trim the clip.',
    'Found in the transcript. Re-recording costs more than trimming, so a person decides.', 'Low'],
  // Medium
  ['Math', 'Renewal email template', `"Switch to annual and keep ${save(10, 20)} a year."`, 'edit', `"Switch to annual and keep ${save(10, 15)} a year."`,
    `10 seats × $${starter} × 12 months × 15% = ${save(10, 15)}.`, 'High'],
  ['Claim', 'Website comparison page, hero', '"Twice the savings of Rivalset."', 'remove', 'Not true at 15% against 18%.',
    'A claim that depends on two facts that both changed. Product marketing writes the new line.', 'Medium', true],
  ['Not the discount', 'Security overview, slide 3', '"20% fewer access reviews with SSO."', 'keep', 'This 20% is about access reviews, not price.',
    'Same number, different fact. Nothing in the sentence is about price.', 'High'],
  ['Translation', 'Pricing overview, EMEA (French), slide 4', '"20 % de remise sur l’abonnement annuel."', 'edit', '"15 % de remise sur l’abonnement annuel."',
    'French copy of the EMEA variant. A native reader should confirm the wording.', 'Medium'],
  ['Wording', 'Starter plan one-pager', '"Annual plans: 2 months free."', 'edit', '"Annual plans: save 15%."',
    '"2 months free" was a rounded way to say 20%. At 15% it is under 2 months, so the phrase no longer works.', 'Medium'],
  ['Claim', 'Customer story: Norvik, quote', 'Quote: "The 20% annual discount sealed it for us."', 'keep', 'A customer’s own words. Add "Pricing at time of purchase."',
    'Customer quotes cannot be edited. Product marketing decides whether the story still runs.', 'Medium', true],
  ['Image', 'Webinar slides PDF, slide 18', 'Screenshot of the pricing page shows 20%.', 'flag', 'Replace the screenshot.',
    'The number is inside a screenshot, read with text recognition.', 'Low'],
  ['Math', 'Annual billing FAQ, section 5', '"Most teams save around $700 a year."', 'edit', '"Most teams save around $520 a year."',
    `Rounded from the 10-seat example: ${save(10, 15)} at 15%.`, 'Medium'],
  ['Contract', 'Partner reseller agreement, schedule B', '"Partners may pass on up to 20% annual discount."', 'keep', 'Stays until Finance updates partner terms.',
    'Partner terms change on their own schedule. This only flags the gap.', 'Medium'],
  ['Claim', 'Sales talk track, objection handling', '"If they push on price, lead with the 20% annual discount."', 'rewrite', 'Lead with compliance and audit trails instead.',
    'The Q4 messaging brief says lead with compliance, not price.', 'Medium', true],
  ['Video', 'Sales kickoff recording, 41:05', 'VP says "20% is our best lever".', 'flag', 'Internal only. Add a note in the description.',
    'Internal recording. A note is enough, nobody re-records a kickoff.', 'Low'],
  ['Claim', 'LinkedIn ad copy, variant B', '"Save 20%. Only on annual."', 'edit', '"Save 15% on annual billing."',
    'Paid campaign copy. Product marketing approves ad changes.', 'Medium', true],
  ['Wording', 'Help center: Billing basics', '"Annual subscribers get 20 percent off."', 'edit', '"Annual subscribers get 15 percent off."',
    '"20 percent" is spelled out, so the token match missed it.', 'High'],
  ['Claim', 'Analyst briefing deck, slide 9', '"Most generous annual pricing in the mid-market."', 'remove', 'Needs a fresh market check before it goes out again.',
    'A market claim. Product marketing should re-check it before it goes out.', 'Low', true],
]
const bucketOf = (i: number) => (i < judgmentSplit[0] ? 0 : i < judgmentSplit[0] + judgmentSplit[1] ? 1 : 2)
export const judgment: JItem[] = SEEDS.map(([kind, where, old, act, next, working, confidence, pmm], i) => ({
  id: `j${i + 1}`, bucket: bucketOf(i), kind, where, old, act, next, working, confidence, route: pmm ? 'Product marketing' : 'Admin',
}))

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
