// Act 1: The problem (slides 1–6).
import { Frame, Reveal, Statement, useStep } from '../deck/blocks'
import { Svg, Node, Line, on } from '../deck/svg'
import { change, company } from '../data/ledgerly'

export function Title() {
  return (
    <Frame center>
      <h1 className="xl">Prism</h1>
      <p className="lead">When the business changes, the field changes with it.</p>
      <p className="muted">Ritik Raj</p>
      <div className="keys-hint">
        <p><kbd>←</kbd><kbd>→</kbd> move through the deck</p>
        <p><kbd>Shift</kbd> + arrows - move through slide</p>
      </div>
    </Frame>
  )
}

const COLS = 26, ROWS = 20 // 520 sellers
export function Setup() {
  const step = useStep()
  return (
    <Frame eyebrow="The setup">
      <div className="split">
        <Statement lines={['500+ sellers.', 'One enablement team.', 'Thousands of decks, PDFs and videos between them.']} />
        <div className="fill">
          <Svg w={1200} h={700}>
            <g className="fade in">
              {Array.from({ length: COLS * ROWS }, (_, i) => (
                <circle key={i} className="dot" cx={560 + (i % COLS) * 24} cy={122 + Math.floor(i / COLS) * 24} r={6} />
              ))}
            </g>
            <g className={`fade${on(step >= 1)}`}>
              {Array.from({ length: company.enablementTeam }, (_, i) => (
                <circle key={i} className="dot team" cx={110 + (i % 3) * 30} cy={335 + Math.floor(i / 3) * 30} r={10} />
              ))}
            </g>
            {step >= 2 && Array.from({ length: 8 }, (_, i) => (
              <rect key={i} className="doc" x={200} y={300 + ((i * 37) % 100)} width={18} height={24}
                style={{ ['--dx' as string]: '330px', animationDelay: `${i * 0.3}s` }} />
            ))}
          </Svg>
        </div>
      </div>
    </Frame>
  )
}

// Four problems from the brief, connected as a loop.
const MAP = { manage: [220, 140], target: [680, 140], current: [220, 460], measure: [680, 460] } as const
function ProblemMap({ arrows, focus, broken }: { arrows: boolean; focus?: boolean; broken?: boolean }) {
  const dim = (k: string) => (focus && k !== 'current' ? `dim${broken ? ' broken' : ''}` : '')
  return (
    <>
      <Node x={MAP.manage[0]} y={MAP.manage[1]} label="Manage" className={dim('manage')} strong={arrows} />
      <Node x={MAP.target[0]} y={MAP.target[1]} label="Target" className={dim('target')} strong={arrows} />
      <Node x={MAP.current[0]} y={MAP.current[1]} label="Keep current" strong={arrows || focus} />
      <Node x={MAP.measure[0]} y={MAP.measure[1]} label="Measure" className={dim('measure')} strong={arrows} />
      <g className={focus ? 'dim' : ''}>
        <Line d="M350 140H550" show={arrows} arrow />
        <Line d="M680 182V418" show={arrows} arrow />
        <Line d="M550 460H350" show={arrows} arrow />
        <Line d="M220 418V182" show={arrows} arrow />
      </g>
    </>
  )
}

// Problem map + chosen path in one slide: the map builds centered, then slides left and Keep current is chosen.
export function ProblemMapSlide() {
  const step = useStep()
  const chosen = step >= 3
  return (
    <Frame eyebrow={chosen ? 'The chosen path' : 'The problem map'}>
      <div className="fill">
        <Svg w={1600} h={600}>
          <g className="map-shift" style={{ transform: chosen ? 'none' : 'translateX(345px)' }}>
            <ProblemMap arrows={step >= 1} focus={chosen} broken={step >= 5} />
          </g>
          <g className={`fade${on(step >= 4)}`}>
            <Node x={1250} y={140} w={440} label="Stale content" strong />
            <Node x={1250} y={300} w={440} label="Sellers stop trusting the library" strong />
            <Node x={1250} y={460} w={440} label="They build their own decks" strong />
          </g>
          <Line d="M220 502V560H980V140H1026" show={step >= 4} arrow />
          <Line d="M1250 182V258" show={step >= 4} arrow />
          <Line d="M1250 342V418" show={step >= 4} arrow />
        </Svg>
      </div>
      <p className="lead">
        {step >= 5 ? 'Shadow decks break managing, targeting and measuring.' : step >= 3 ? 'Keeping content current sits upstream of the rest.' : step >= 2 ? 'Four problems. One system.' : '\u00a0'}
      </p>
    </Frame>
  )
}

export function Story() {
  return (
    <Frame eyebrow="The story" illustrative>
      <div className="story">
        <Reveal at={0}><span className="eyebrow day">Monday</span><p>Finance cuts the annual discount from {change.from} to {change.to}.</p></Reveal>
        <Reveal at={1}><span className="eyebrow day">Wednesday</span><p>Enablement hears about it.</p></Reveal>
        <Reveal at={2}><span className="eyebrow day">Thursday</span><p>Priya quotes {change.from} to Halden Logistics. In writing.</p></Reveal>
      </div>
    </Frame>
  )
}

// The number's real home is Finance's pricing sheet, outside the library. Copies spread from there.
export function Fanout() {
  const step = useStep()
  const inside: [number, number, string][] = [[560, 170, 'FAQ'], [1040, 170, 'Decks'], [560, 530, 'Demo video'], [1040, 530, 'Proposals']]
  const outside: [number, number, string, string][] = [
    [1560, 210, "Seller's\nedited copy", 'M1220 210H1428'],
    [1560, 490, "PDF in a\nbuyer's inbox", 'M1220 490H1428'],
  ]
  return (
    <Frame eyebrow="One change, many places">
      <div className="fill">
        <Svg w={1800} h={700}>
          <rect x={380} y={60} width={840} height={580} className="frame-rect" />
          <text x={404} y={618} className="svg-eyebrow">LIBRARY</text>
          {inside.map(([x, y, l]) => (
            <g key={l}>
              <Line d={`M330 350L${x - 110} ${y}`} show={step >= 1} arrow />
              <g className={`fade${on(step >= 1)}`}><Node x={x} y={y} w={220} label={l} strong /></g>
            </g>
          ))}
          {outside.map(([x, y, l, d]) => (
            <g key={l}>
              <Line d={d} show={step >= 2} arrow />
              <g className={`fade${on(step >= 2)}`}><Node x={x} y={y} w={260} h={110} label={l} strong /></g>
            </g>
          ))}
          <Node x={175} y={350} w={310} h={150} label={`Pricing sheet · Finance\nAnnual discount:\n${change.from}`} strong />
        </Svg>
      </div>
      <Reveal at={2}><p className="caption">One number lives in many places, some outside the library.</p></Reveal>
    </Frame>
  )
}
