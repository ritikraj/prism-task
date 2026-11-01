// Deck engine: slide + build step state, Present/Read modes, keys, hash deep links, slide panel, theme.
import { useCallback, useEffect, useState } from 'react'
import { slides } from '../slides'
import { StepCtx } from './Reveal'
import { stepsOf, type Mode } from './types'
import { exportPdf } from './pdf'
import { ChevronLeft, ChevronRight, Close, Menu, Moon, Sun } from './icons'

const N = slides.length
const clampSlide = (n: number) => Math.max(0, Math.min(N - 1, n))
const full = (i: number, mode: Mode) => stepsOf(slides[i], mode)

function readUrl() {
  const mode = 'present' as Mode // always opens in Present mode; mode is not kept in the URL
  const [, s, st] = location.hash.split('/')
  // #/12/2 or #/prototype/0 (slide ids keep links stable when slides move)
  const byId = slides.findIndex(x => x.id === s)
  const slide = byId >= 0 ? byId : clampSlide((Number(s) || 1) - 1)
  const step = st !== undefined && st !== '' ? Math.max(0, Math.min(full(slide, mode), Number(st) || 0)) : mode === 'read' ? full(slide, mode) : 0
  return { slide, step, mode }
}

type Theme = 'light' | 'dark'
function initialTheme(): Theme {
  try { const t = localStorage.getItem('prism-theme'); if (t === 'light' || t === 'dark') return t } catch { /* storage blocked */ }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function Deck() {
  const [pos, setPos] = useState(readUrl)
  const [panel, setPanel] = useState(false)
  const [protoFocus, setProtoFocus] = useState(false)
  const [pdf, setPdf] = useState<string | null>(null) // null = idle, otherwise the button's progress label
  const downloadPdf = () => {
    setPdf('Preparing') // mounts the offscreen PrintView pages
    exportPdf(n => setPdf(`Building ${n} / ${N}`)).finally(() => setPdf(null))
  }
  const [theme, setTheme] = useState(initialTheme)
  const { slide, step, mode } = pos
  const total = full(slide, mode)
  const def = slides[slide]

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('prism-theme', theme) } catch { /* storage blocked */ }
  }, [theme])

  // entering a slide: Present opens at step 0, Read opens fully built
  const goSlide = useCallback((i: number) => setPos(p => {
    const s = clampSlide(i)
    return { ...p, slide: s, step: p.mode === 'read' ? full(s, p.mode) : 0 }
  }), [])
  const nextStep = useCallback(() => setPos(p => {
    if (p.step < full(p.slide, p.mode)) return { ...p, step: p.step + 1 }
    if (p.slide === N - 1) return p
    const s = p.slide + 1
    return { ...p, slide: s, step: p.mode === 'read' ? full(s, p.mode) : 0 }
  }), [])
  // Read mode moves slide by slide in both directions; Present mode un-builds step by step.
  const prevStep = useCallback(() => setPos(p => {
    if (p.step > 0 && p.mode === 'present') return { ...p, step: p.step - 1 }
    if (p.slide === 0) return p
    return { ...p, slide: p.slide - 1, step: full(p.slide - 1, p.mode) }
  }), [])
  const setMode = useCallback((mode: Mode) => setPos(p => ({ ...p, mode, step: mode === 'read' ? full(p.slide, mode) : Math.min(p.step, full(p.slide, mode)) })), [])

  useEffect(() => { setProtoFocus(false) }, [slide])

  // opening the slide panel scrolls the current slide into view
  useEffect(() => {
    if (panel) document.querySelector('.panel-item.on')?.scrollIntoView({ block: 'center' })
  }, [panel])

  // keep URL in sync without piling up history entries
  useEffect(() => {
    history.replaceState(null, '', `${location.pathname}${location.search}#/${slide + 1}/${step}`)
  }, [slide, step])
  useEffect(() => {
    const on = () => setPos(p => ({ ...readUrl(), mode: p.mode }))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setProtoFocus(false); return }
      if (protoFocus) return // prototype owns the keyboard until Esc
      if ((e.target as HTMLElement).closest('input, textarea, select')) return
      const k = e.key, sh = e.shiftKey
      const act =
        k === 'Home' ? () => goSlide(0) :
        k === 'End' ? () => goSlide(N - 1) :
        (sh && k === 'ArrowLeft') || k === 'PageUp' ? () => goSlide(slide - 1) :
        (sh && k === 'ArrowRight') || k === 'PageDown' ? () => goSlide(slide + 1) :
        k === 'ArrowLeft' ? prevStep :
        k === 'ArrowRight' || k === ' ' ? nextStep :
        k === 'm' || k === 'M' ? () => setMode(mode === 'read' ? 'present' : 'read') :
        k === 'g' || k === 'G' ? () => setPanel(v => !v) : null
      if (act) { e.preventDefault(); act() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [protoFocus, slide, mode, goSlide, nextStep, prevStep, setMode])

  const Slide = def.Component
  const atStart = slide === 0 && (step === 0 || mode === 'read')
  const atEnd = slide === N - 1 && step === total
  return (
    <>
      <div className="deck">
        <header className="topbar">
          <button className="icon-btn" aria-label={panel ? 'Hide slides' : 'Show slides'} onClick={() => setPanel(v => !v)}>{panel ? <Close /> : <Menu />}</button>
          <span className="brand">Prism</span>
          <span className="eyebrow counter">
            {String(slide + 1).padStart(2, '0')} / {N}{total > 0 && ` · step ${step} of ${total}`}
            {protoFocus && ' · Esc to return'}
          </span>
          <span className="grow" />
          <div className="segmented" role="group" aria-label="Mode">
            <button className={mode === 'read' ? 'on' : ''} onClick={() => setMode('read')}>Read</button>
            <button className={mode === 'present' ? 'on' : ''} onClick={() => setMode('present')}>Present</button>
          </div>
          <button className="icon-btn" aria-label="Switch light or dark theme" onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}>
            {theme === 'light' ? <Moon /> : <Sun />}
          </button>
        </header>
        <div className="body">
          {panel && (
            <aside className="panel">
              {slides.map((s, i) => (
                <button key={s.id} className={`panel-item ${i === slide ? 'on' : ''}`} onClick={() => goSlide(i)}>
                  <Thumb index={i} mode={mode} />
                  <span className="panel-label"><span className="num">{String(i + 1).padStart(2, '0')}</span>{s.title}</span>
                </button>
              ))}
              <div className="panel-print">
                <button className="print-btn" disabled={pdf !== null} onClick={downloadPdf}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m0 0l-4-4m4 4l4-4M5 19h14" /></svg>
                  {pdf ?? 'Download PDF'}
                </button>
              </div>
            </aside>
          )}
          <div className="stage">
            <button className="nav-btn prev" aria-label="Previous step" disabled={atStart} onClick={prevStep}><ChevronLeft /></button>
            <div className={`canvas ${def.prototype ? 'proto' : ''} ${protoFocus ? 'focused' : ''}`} onMouseDown={() => def.prototype && setProtoFocus(true)}>
              <StepCtx.Provider value={step}>
                <Slide key={def.id} step={step} mode={mode} />
              </StepCtx.Provider>
            </div>
            <button className="nav-btn next" aria-label="Next step" disabled={atEnd} onClick={nextStep}><ChevronRight /></button>
          </div>
        </div>
      </div>
      {pdf !== null && <PrintView />}
      <div className="small-screen">Prism is best viewed on a desktop. Please open it on a screen at least 1024px wide.</div>
    </>
  )
}

// Live snapshot: the slide fully built at full stage size, scaled into the panel.
const THUMB = 216
function Thumb({ index, mode }: { index: number; mode: Mode }) {
  const s = slides[index], C = s.Component, st = stepsOf(s, mode)
  const w = window.innerWidth, h = window.innerHeight - 56, k = THUMB / w
  return (
    <div className="thumb" style={{ width: THUMB, height: h * k }}>
      <div className={s.prototype ? 'canvas proto' : 'thumb-inner'} style={{ position: 'absolute', width: w, height: h, transform: `scale(${k})`, transformOrigin: '0 0' }}>
        <StepCtx.Provider value={st}><C step={st} mode={mode} /></StepCtx.Provider>
      </div>
    </div>
  )
}

// Every slide fully built, one 1366x768 page each, light theme. The prototype gets a pointer page.
function PrintView() {
  return (
    <div className="print-root">
      {slides.map(s => {
        const C = s.Component, st = stepsOf(s, 'read')
        return (
          <div key={s.id} className="print-page">
            {s.prototype ? (
              <div className="slide center">
                <h1>Prototype</h1>
                <p className="lead">The live prototype runs in the browser.</p>
                <p className="muted">{location.origin}/#/prototype/0</p>
              </div>
            ) : <StepCtx.Provider value={st}><C step={st} mode="read" /></StepCtx.Provider>}
          </div>
        )
      })}
    </div>
  )
}
