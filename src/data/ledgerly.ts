// Shared mock data: one source for every number on slides and in the prototype. All illustrative.

export const today = 'Mon, Nov 2, 2026'
export const company = { name: 'Ledgerly', sellers: 520, regions: ['North America', 'EMEA', 'India'], enablementTeam: 6 }
export const rival = 'Rivalset'
export const buyer = 'Halden Logistics'
export const admin = { name: 'Meera Iyer', initials: 'MI', role: 'Enablement admin' }

export const sellers = [
  { name: 'Priya Nair', region: 'India', meeting: 'Thu Nov 5, 11:00', account: 'Halden Logistics', note: 'renewal' },
  { name: 'Tom Becker', region: 'EMEA', meeting: 'Wed Nov 4, 15:00', account: 'Norvik Freight', note: '' },
  { name: 'Ana Ruiz', region: 'North America', meeting: 'Tue Nov 3, 10:30', account: 'Clearwater Health', note: '' },
]

// usedIn = every place the claim appears; linked = places already holding the token.
export type Fact = { token: string; label: string; value: string; next?: string; owner: string; source: string; lastChecked: string; usedIn: number; linked: number }
export const facts: Fact[] = [
  { token: 'annual_discount', label: 'Annual discount', value: '20%', next: '15%', owner: 'Finance', source: 'Pricing sheet', lastChecked: 'Oct 28', usedIn: 456, linked: 160 },
  { token: 'starter_price', label: 'Starter price', value: '$29 per seat per month', owner: 'Finance', source: 'Pricing sheet', lastChecked: 'Oct 28', usedIn: 212, linked: 174 },
  { token: 'rivalset_price', label: 'Rivalset price', value: '$35 per seat per month', owner: 'Product marketing', source: 'Competitor tracker', lastChecked: 'Oct 20', usedIn: 64, linked: 52 },
  { token: 'soc2_status', label: 'SOC 2 status', value: 'SOC 2 Type II', owner: 'Security', source: 'Trust page', lastChecked: 'Aug 14', usedIn: 121, linked: 100 },
  { token: 'sso_support', label: 'SSO support', value: 'All plans', owner: 'Product', source: 'Feature list', lastChecked: 'Oct 02', usedIn: 97, linked: 97 },
]

export type Message = { text: string; owner: string; source: string; usedIn: number }
export const messages: Message[] = [
  { text: 'Lead with compliance and audit trails', owner: 'Product marketing', source: 'Q4 messaging brief', usedIn: 88 },
  { text: 'Rivalset costs less, but has no SOC 2', owner: 'Product marketing', source: 'Competitor tracker', usedIn: 41 },
]

// Card B, the main path. Effective yesterday: the content is wrong today.
export const change = {
  token: 'annual_discount', from: '20%', to: '15%', owner: 'Finance', source: 'Pricing sheet',
  title: 'Annual discount: 20% to 15%', synced: 'today 07:40', effective: 'Nov 1', regions: 'All regions',
  places: 456, assets: 118, p0: 11, p1: 47, staleCopies: 18,
}
export const retire = { places: 120, assets: 41 }

// From 456 edits to 37 decisions. Each row: the move, what it removes, what is left.
export const chain = [
  { move: 'Places where the discount appears', removes: 0, left: 456 },
  { move: 'Retire assets nobody opened in 6 months', removes: 120, left: 336 },
  { move: 'Fact tokens update once Finance approves', removes: 160, left: 176 },
  { move: '130 same wording matches collapse into 9 groups', removes: 121, left: 55 },
  { move: '18 copies outside the library become seller alerts', removes: 18, left: 37 },
]
export const lanes = {
  tokens: 160,
  groups: 9, groupedMatches: 130,
  judgment: 28,
  decisions: 37,
  outsideCopies: 18,
  retired: 120,
  routing: { enablement: { groups: 9, judgment: 20 }, productMarketing: { judgment: 8 } },
}

// 63 sellers alerted; 14 of them also hold the 18 stale copies.
export const sellersAtRisk = { withMeetings: 63, days: 7, holdingCopies: 14, copies: 18 }

export const priorityRules = [
  ['P0', 'Shared with, or in the deal room of, an account with a meeting in the next 7 days'],
  ['P1', 'Shared, downloaded or viewed in the last 30 days by a seller with a meeting in the next 7 days'],
  ['P2', 'Used by anyone in the last 90 days'],
  ['P3', 'Not opened in 6 months. These are the 120 places to retire.'],
] as const

export type Priority = 'P0' | 'P1' | 'P2'
export const impactAssets: { name: string; type: string; priority: Priority; why: string; places: number }[] = [
  { name: 'Halden renewal proposal', type: 'Doc', priority: 'P0', why: 'Shared with Halden, meeting Thu 11:00 (Priya)', places: 3 },
  { name: 'Clearwater pricing deck', type: 'Deck', priority: 'P0', why: 'In Clearwater deal room, meeting Tue 10:30 (Ana)', places: 5 },
  { name: 'Norvik ROI one-pager', type: 'PDF', priority: 'P0', why: 'Shared with Norvik, meeting Wed 15:00 (Tom)', places: 2 },
  { name: 'Ledgerly pricing overview v7', type: 'Deck', priority: 'P1', why: 'Downloaded by 12 sellers with meetings', places: 6 },
  { name: 'Annual billing FAQ', type: 'Doc', priority: 'P1', why: 'Viewed by 21 sellers with meetings', places: 4 },
  { name: 'Q3 customer webinar', type: 'Video', priority: 'P2', why: 'Used in the last 90 days', places: 1 },
]

// Same wording lane: 9 groups, 130 places.
export const wordingGroups: [string, number][] = [
  ['Save 20% with annual billing', 41],
  ['20% off when you pay yearly', 22],
  ['Annual plans: 20% discount', 18],
  ['Get 20% back by going annual', 12],
  ['20% annual savings', 11],
  ['Pay yearly, save 20%', 9],
  ['A 20% annual discount applies', 7],
  ['Annual billing: 20% off', 6],
  ['20% lower than monthly', 4],
]

// Derived number for the judgment lane: 50 seats x $29 x 12 months x discount
export const derived = { seats: 50, before: 3480, after: 2610, text: 'Annual billing saves a 50 seat team' }

// Card C and D (screens arrive in phase 3)
export const scan = {
  total: 89,
  patterns: [
    { text: '$29 per seat per month', token: 'starter_price', spots: 38 },
    { text: 'SOC 2 Type II', token: 'soc2_status', spots: 21 },
    { text: 'Rivalset at $35 per seat', token: 'rivalset_price', spots: 12 },
    { text: '99.9% uptime', token: null, spots: 18, newFact: { token: 'uptime_sla', owner: 'Product' } },
  ],
  untokenable: [
    ['Q3 customer webinar', 'Video, 14:20', 'Presenter says "20% off"'],
    ['Q3 customer webinar', 'Video, 31:05', 'Slide on screen shows "$29 per seat"'],
    ['Security overview', 'PDF, page 3', 'Scanned image of the SOC 2 report cover'],
    ['Rivalset battlecard', 'PDF, page 1', 'Price table pasted as an image'],
    ['Partner pricing guide', 'PDF, page 6', 'Price table pasted as an image'],
    ['Onboarding video', 'Video, 02:40', 'Narrator says "99.9% uptime"'],
  ] as [string, string, string][],
}
export const merge = {
  asset: 'Ledgerly pricing overview', versions: 14, keep: 3, archive: 11,
  groups: [
    { name: 'Identical except title and date', versions: 11, diff: 'None in content' },
    { name: 'Regional pricing slide', versions: 2, diff: 'EMEA and India pricing slide' },
    { name: 'Old logo', versions: 1, diff: 'Same content, old brand' },
  ],
  result: ['Ledgerly pricing overview v7 (master)', 'Ledgerly pricing overview, EMEA (linked variant)', 'Ledgerly pricing overview, India (linked variant)'],
}

// Content library. Health: Current, N outdated claims, or In review.
export type LibAsset = { id: string; name: string; type: string; team: string; creator: string; tags: string[]; health: string; updated: string }
export const library: LibAsset[] = [
  { id: 'v7', name: 'Ledgerly pricing overview v7', type: 'Deck', team: 'Enablement', creator: 'Meera Iyer', tags: ['Pricing', 'Annual billing'], health: '2 outdated claims', updated: 'Oct 14' },
  { id: 'halden', name: 'Halden renewal proposal', type: 'Doc', team: 'Sales', creator: 'Priya Nair', tags: ['Proposals', 'Renewals', 'NA'], health: '1 outdated claim', updated: 'Oct 12' },
  { id: 'clear', name: 'Clearwater pricing deck', type: 'Deck', team: 'Sales', creator: 'Ana Ruiz', tags: ['Pricing', 'Deal room'], health: 'In review', updated: 'Oct 30' },
  { id: 'norvik', name: 'Norvik ROI one-pager', type: 'PDF', team: 'Product marketing', creator: 'Jonas Weber', tags: ['ROI', 'Customer story'], health: '1 outdated claim', updated: 'Oct 9' },
  { id: 'faq', name: 'Annual billing FAQ', type: 'Doc', team: 'Enablement', creator: 'Meera Iyer', tags: ['Pricing', 'Annual billing', 'FAQ'], health: '3 outdated claims', updated: 'Sep 22' },
  { id: 'web', name: 'Q3 customer webinar', type: 'Video', team: 'Product marketing', creator: 'Jonas Weber', tags: ['Webinars', 'Pricing'], health: '1 outdated claim', updated: 'Sep 18' },
  { id: 'sec', name: 'Security overview', type: 'Deck', team: 'Security', creator: 'Lena Park', tags: ['Compliance', 'Security'], health: 'Current', updated: 'Oct 21' },
  { id: 'rival', name: 'Rivalset battlecard', type: 'Doc', team: 'Product marketing', creator: 'Jonas Weber', tags: ['Competitive', 'Rivalset'], health: 'Current', updated: 'Oct 20' },
  { id: 'onb', name: 'Onboarding deck', type: 'Deck', team: 'Enablement', creator: 'Meera Iyer', tags: ['Onboarding', 'New hires'], health: 'Current', updated: 'Aug 30' },
  { id: 'starter', name: 'Starter plan one-pager', type: 'PDF', team: 'Product marketing', creator: 'Jonas Weber', tags: ['Pricing', 'Starter'], health: 'Current', updated: 'Oct 3' },
]

// 50 more assets so the library reads like a real one. Not clickable.
const MORE = [
  'Mid-market proposal template', 'Enterprise proposal template', 'Renewal email template', 'Partner pricing guide', 'Discovery call guide',
  'Objection handling guide', 'Halden case study', 'Norvik case study', 'Clearwater case study', 'Product tour script',
  'Pricing calculator', 'Integrations overview', 'Security questionnaire answers', 'Data processing addendum', 'Implementation plan template',
  'QBR deck template', 'Customer success playbook', 'Champion kit', 'Mobile app one-pager', 'API overview',
  'Payroll module one-pager', 'Expense module datasheet', 'Invoicing demo script', 'Cold email sequence', 'LinkedIn outreach scripts',
]
const VARIANT = [' (EMEA)', ' (India)', ' v2', ' short version', ' (NA)']
const TEAMS: [string, string][] = [['Sales', 'Ana Ruiz'], ['Enablement', 'Meera Iyer'], ['Product marketing', 'Jonas Weber'], ['Customer success', 'Sam Okafor'], ['Security', 'Lena Park'], ['Sales', 'Priya Nair']]
const TAGS = ['Pricing', 'Proposals', 'Templates', 'Case study', 'Discovery', 'Competitive', 'Renewals', 'Product', 'EMEA', 'India', 'Onboarding', 'Security']
const DATES = ['Oct 29', 'Oct 24', 'Oct 17', 'Oct 8', 'Sep 30', 'Sep 15', 'Aug 27', 'Aug 11', 'Jul 22']
library.push(...Array.from({ length: 50 }, (_, i): LibAsset => {
  const [team, creator] = TEAMS[i % TEAMS.length]
  return {
    id: `m${i}`, name: MORE[i % 25] + (i < 25 ? '' : VARIANT[i % 5]), type: ['Deck', 'Doc', 'PDF', 'Doc', 'Deck', 'Video'][i % 6], team, creator,
    tags: [TAGS[i % 12], TAGS[(i * 5 + 3) % 12], TAGS[(i * 7 + 1) % 12]].slice(0, 1 + (i % 3)).filter((t, k, a) => a.indexOf(t) === k),
    health: i % 9 === 4 ? '1 outdated claim' : i % 7 === 3 ? 'In review' : 'Current', updated: DATES[i % DATES.length],
  }
}))

// Asset detail: pricing overview v7. 4 tokens, 2 plain text matches.
export type Part = string | { token: string; value: string } | { match: string; token: string; outdated?: boolean }
export const v7 = {
  downloads: 12,
  oldCopies: [['Tom Becker', 'Downloaded v6 on Sep 2'], ['Ana Ruiz', 'Downloaded v6 on Sep 9'], ['Ravi Menon', 'Downloaded v6 on Sep 15']] as [string, string][],
  slides: [
    { n: 3, title: 'Plans', parts: ['Starter is ', { token: 'starter_price', value: '$29 per seat per month' }, '.'] },
    { n: 4, title: 'Pricing that grows with you', parts: ['Save ', { token: 'annual_discount', value: '20%' }, ' with annual billing.'] },
    { n: 6, title: 'Billing options', parts: [{ match: '20% off when you pay yearly', token: 'annual_discount', outdated: true }, '. Cancel any time.'] },
    { n: 7, title: 'Monthly vs annual cost', parts: ['[Chart image: shows 20% saved. Flagged in the judgment lane.]'] },
    { n: 8, title: 'Why not Rivalset', parts: [{ match: 'Rivalset at $35 per seat', token: 'rivalset_price' }, ' costs more and has no SOC 2.'] },
    { n: 9, title: 'Built for audited teams', parts: [{ token: 'soc2_status', value: 'SOC 2 Type II' }, ' certified. SSO on ', { token: 'sso_support', value: 'All plans' }, '.'] },
  ] as { n: number; title: string; parts: Part[] }[],
}

export const claimHistory: Record<string, [string, string][]> = {
  annual_discount: [['Nov 2', 'Finance changed 20% to 15%'], ['Mar 1', 'Finance set 20%'], ['Jan 10', 'Created from the pricing sheet']],
}

export const priya = {
  name: 'Priya Nair', role: 'Account executive', city: 'Mumbai',
  meeting: 'Renewal call with Halden Logistics', day: 'Thursday',
  sentCopy: 'Proposal PDF emailed to Halden on Oct 12, says 20%',
}
export const sellerAlert = [
  'Annual discount is now 15% (was 20%).',
  'Say: "Annual billing saves 15%."',
  'Updated for you: Halden renewal proposal.',
  'You emailed Halden the 20% version on Oct 12.',
]

// Snapshot two days after go live.
export const tracking = { alerted: 63, opened: 41, staleOut: 11, staleTotal: 18, buyerNotes: 5, inReview: 6 }
export const staleHolders = [
  { seller: 'Priya Nair', copy: 'Halden renewal proposal, PDF', status: 'Buyer note sent' },
  { seller: 'Tom Becker', copy: 'Norvik ROI one-pager, PDF', status: 'Not yet' },
  { seller: 'Ana Ruiz', copy: 'Clearwater pricing deck, PDF export', status: 'Opened alert' },
]

// Home dashboard. Assumed numbers.
export const dashboard = {
  assets: 1240,
  health: [['Current', 1084], ['Outdated', 118], ['Update scheduled', 38]] as [string, number][],
  weeks: [['Sep 14', 2], ['Sep 21', 1], ['Sep 28', 3], ['Oct 5', 2], ['Oct 12', 4], ['Oct 19', 2], ['Oct 26', 3], ['Nov 2', 2]] as [string, number][],
  sellersTrend: [12, 9, 14, 11, 8, 63],
}
// Earlier changes, already closed (for "View all").
export const pastChanges: [string, string, number][] = [
  ['Starter price: $27 to $29', '1 fact changed', 188],
  ['SOC 2 Type II renewed', '1 fact changed', 96],
  ['SSO on all plans', '1 fact changed', 84],
  ['Q3 APAC pricing update', '9 facts changed', 142],
]

// Annual discount change, by urgency. 160 token places are already updated; these four hold the other 296.
// Urgent + High + Medium = 130 same-wording places + 28 judgment items + 18 copies sellers already sent.
export type Bucket = 'Urgent' | 'High' | 'Medium' | 'Low'
export const buckets: { id: Bucket; reason: string; places: number; copies: number; sellers: string[] }[] = [
  { id: 'Urgent', reason: 'In the deal room of, or shared with, an account that meets in the next 7 days', places: 31, copies: 5, sellers: ['Priya Nair', 'Tom Becker', 'Ana Ruiz'] },
  { id: 'High', reason: 'Used this month by a seller who has a meeting in the next 7 days', places: 64, copies: 8, sellers: ['Leo Martin', 'Sara Kim', 'Ravi Shah', 'Emma Clarke', 'Jon Ortiz', 'Mia Laurent'] },
  { id: 'Medium', reason: 'Used by anyone in the last 90 days', places: 81, copies: 5, sellers: ['Arjun Mehta', 'Chloe Dupont', 'Omar Haddad', 'Lisa Novak', 'Ben Carter'] },
  { id: 'Low', reason: 'Not opened in 6 months, in no deal room, or a newer version exists', places: 120, copies: 0, sellers: [] },
]
// How each same-wording group's places split across Urgent, High, Medium (rows sum to the group, columns to 21 / 47 / 62).
export const groupSplit = [[10, 14, 17], [5, 8, 9], [3, 6, 9], [2, 5, 5], [1, 4, 6], [0, 4, 5], [0, 3, 4], [0, 2, 4], [0, 1, 3]]
// Judgment items per bucket: 5 / 9 / 14 = 28.
export const judgmentSplit = [5, 9, 14]
// Sample places and why each sits in its bucket.
export const bucketSamples: [string, string][][] = [
  [['Halden renewal proposal', 'Shared with Halden, meeting Thu 11:00 (Priya)'], ['Clearwater pricing deck', 'In the Clearwater deal room, meeting Tue (Ana)'], ['Norvik ROI one-pager', 'Shared with Norvik, meeting Wed (Tom)']],
  [['Ledgerly pricing overview v7', 'Downloaded by 12 sellers with meetings'], ['Annual billing FAQ', 'Viewed by 21 sellers this month'], ['Mid-market proposal template', 'Used in 9 proposals this month']],
  [['Onboarding deck', 'Opened 14 times in 90 days'], ['Partner pricing guide', 'Opened 6 times in 90 days'], ['Renewal email template', 'Sent 11 times in 90 days']],
]
export const retireSamples: [string, string][] = [
  ['Q2 pricing deck', 'Not opened in 7 months'], ['EMEA promo one-pager 2025', 'A newer version exists'], ['Webinar recap, March', 'Not opened in 6 months, in no deal room'],
]

// While the change drains, other teams keep making content with the old value. Assumed, one week.
export const drift = {
  week: 7,
  sources: [['Sales', 'copied the old Halden proposal for a new account', 4], ['Product marketing', 'a new partner one-pager', 2], ['Customer success', 'a renewal email template', 1]] as [string, string, number][],
}
