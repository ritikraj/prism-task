// Stroke icons matching ritikraj.in (1.5px stroke, round caps).
const I = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
)
export const ChevronLeft = () => <I d="M15 5l-7 7 7 7" size={20} />
export const ChevronRight = () => <I d="M9 5l7 7-7 7" size={20} />
export const Menu = () => <I d="M4 7h16M4 12h16M4 17h16" />
export const Close = () => <I d="M6 6l12 12M18 6L6 18" />
export const Moon = () => <I d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" size={16} />
export const Sun = () => <I d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66l1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14l-1.41-1.41M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={16} />
