import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { CAREERS, type Project } from '../types'
import { getProjects } from '../lib/projects'
import { CURRENT } from '../lib/editions'
import { getVotes, tallyVotes } from '../lib/votes'
import AuthGate from '../components/AuthGate'

// Modo ceremonia: una pantalla por premio, pensada para proyectarse.
// Avanza con clic, espacio, Enter o →; retrocede con ←.

interface WinnerInfo {
  project: Project
  votes: number
  /** Clave de carrera, o «EAD» para el premio general */
  label: string
  sublabel: string
  general: boolean
}

const COLORS = ['#FFF500', '#ffffff', '#8f8f8f']

export default function Ceremony() {
  return (
    <AuthGate label="Ceremonia" admin>
      <Stage />
    </AuthGate>
  )
}

function pickWinners(projects: Project[], tally: Record<string, number> | undefined): { project: Project; votes: number } | null {
  const sorted = Object.entries(tally ?? {}).sort((a, b) => b[1] - a[1])
  if (sorted.length === 0) return null
  const project = projects.find((p) => p.id === sorted[0][0])
  return project ? { project, votes: sorted[0][1] } : null
}

function Stage() {
  const [winners, setWinners] = useState<WinnerInfo[] | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  // Ensayo: sin votos todavía, recorre un proyecto por carrera para probar la proyección.
  const [rehearsal, setRehearsal] = useState(false)
  const [failed, setFailed] = useState(false)
  // -1 = portada
  const [idx, setIdx] = useState(-1)

  useEffect(() => {
    let alive = true
    Promise.allSettled([getProjects(), getVotes()]).then(([p, v]) => {
      if (!alive) return
      const projects = p.status === 'fulfilled' ? p.value : []
      setProjects(projects)
      if (v.status === 'rejected') {
        console.error(v.reason)
        setFailed(true)
        return
      }
      const map = new Map(projects.map((x) => [x.id, { projectName: x.projectName, career: x.career }]))
      const { careerTallies, generalTally } = tallyVotes(v.value, map)
      const result: WinnerInfo[] = []
      for (const c of CAREERS) {
        const w = pickWinners(projects, careerTallies[c.key])
        if (w) result.push({ ...w, label: c.key, sublabel: c.name, general: false })
      }
      const g = pickWinners(projects, generalTally)
      if (g) result.push({ ...g, label: 'EAD', sublabel: 'Mejor proyecto de la Escuela', general: true })
      setWinners(result)
    })
    return () => { alive = false }
  }, [])

  const celebrate = useCallback((big: boolean) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    confetti({ particleCount: big ? 220 : 110, spread: big ? 110 : 75, origin: { y: 0.6 }, colors: COLORS, gravity: 0.8, ticks: big ? 320 : 200 })
    if (!big) return
    const end = Date.now() + 3500
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0 }, colors: COLORS, gravity: 0.7 })
      confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1 }, colors: COLORS, gravity: 0.7 })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  const total = winners?.length ?? 0

  function startRehearsal() {
    const sample: WinnerInfo[] = []
    for (const c of CAREERS) {
      const project = projects.find((p) => p.career === c.key)
      if (project) sample.push({ project, votes: 0, label: c.key, sublabel: c.name, general: false })
    }
    if (sample.length > 0) {
      sample.push({ ...sample[0], label: 'EAD', sublabel: 'Mejor proyecto de la Escuela', general: true })
    }
    setRehearsal(true)
    setFailed(false)
    setWinners(sample)
    setIdx(-1)
  }

  const go = useCallback((next: number) => {
    if (!winners || next < -1 || next >= winners.length) return
    setIdx(next)
    if (next >= 0) window.setTimeout(() => celebrate(winners[next].general), 450)
  }, [winners, celebrate])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); go(idx + 1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, idx])

  const current = idx >= 0 && winners ? winners[idx] : null

  return (
    <div
      className="board min-h-dvh flex flex-col px-5 md:px-10 pt-5 md:pt-8 pb-6 md:pb-8 cursor-pointer select-none"
      onClick={() => go(idx + 1)}
    >
      <header className="flex items-start justify-between gap-6 code text-[13px] md:text-[15px] text-white/70">
        <p>
          Ticket to Fly <span className="text-udem-yellow">{CURRENT.label}</span>
          <br />
          {rehearsal ? <span className="bg-udem-yellow text-black px-1.5">Ensayo · no son resultados</span> : 'Premiación'}
        </p>
        <p className="tabular-nums text-right">
          {idx >= 0 && total > 0 && <>{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</>}
          <br />
          <Link to="/admin" onClick={(e) => e.stopPropagation()} className="text-white/60 hover:text-white outline-none focus-visible:text-white">
            Salir
          </Link>
        </p>
      </header>

      {failed ? (
        <Message title="Sin datos" text="No se pudieron cargar los votos. Comprueba que tu cuenta sea administradora y recarga.">
          {projects.length > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); startRehearsal() }}
              className="code text-[13px] md:text-sm bg-udem-yellow text-black px-5 py-3.5 mt-8 self-start hover:bg-white focus-visible:bg-white outline-none"
            >
              → Ensayar con proyectos de ejemplo
            </button>
          )}
        </Message>
      ) : !winners ? (
        <Message title="Cargando" text="" />
      ) : total === 0 ? (
        <Message title="Sin votos" text={`Todavía no hay votos registrados en ${CURRENT.label}.`}>
          {projects.length > 0 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); startRehearsal() }}
              className="code text-[13px] md:text-sm bg-udem-yellow text-black px-5 py-3.5 mt-8 self-start hover:bg-white focus-visible:bg-white outline-none"
            >
              → Ensayar con proyectos de ejemplo
            </button>
          )}
        </Message>
      ) : !current ? (
        <div className="ceremony-reveal flex-1 flex flex-col justify-end">
          <h1 className="cond board-title -ml-[0.015em] whitespace-nowrap">
            Ticket <br className="md:hidden" />to Fly
          </h1>
          <p className="code text-[13px] md:text-[15px] text-white/70 mt-8">
            {total} {total === 1 ? 'premio' : 'premios'} · Clic o → para comenzar
          </p>
        </div>
      ) : (
        <div key={idx} className="ceremony-reveal flex-1 grid md:grid-cols-12 gap-x-10 gap-y-8 items-end mt-8">
          <div className={`md:order-1 order-2 ${current.project.coverUrl ? 'md:col-span-7' : 'md:col-span-12'}`}>
            <p className="code text-[15px] md:text-xl">
              <span className={current.general ? 'bg-udem-yellow text-black px-2 py-1' : 'text-udem-yellow'}>
                {current.label}
              </span>
              <span className="text-white/70 ml-4">{current.sublabel}</span>
            </p>
            <h2
              className={`cond mt-6 -ml-[0.015em] break-words ${current.general ? 'text-udem-yellow' : 'text-white'}`}
              style={{ fontSize: 'clamp(3.5rem, 11vw, 12rem)' }}
            >
              {current.project.projectName.split(':')[0].trim()}
            </h2>
            <p className="text-xl md:text-3xl font-bold leading-snug mt-6 max-w-[34ch]">{current.project.teamName}</p>
            {!rehearsal && (
              <p className="code text-[13px] md:text-[15px] text-white/70 mt-6 tabular-nums">
                {current.votes} {current.votes === 1 ? 'voto' : 'votos'}
              </p>
            )}
          </div>
          {/* Sin imagen no se repite el nombre en una carátula: el texto ocupa todo el ancho. */}
          {current.project.coverUrl && (
            <div className="md:col-span-5 md:order-2 order-1 aspect-[4/3] overflow-hidden bg-white/5">
              <img src={current.project.coverUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Message({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col justify-end">
      <p className="cond text-[18vw] md:text-[12rem] -ml-[0.015em]">{title}</p>
      {text && <p className="text-lg md:text-xl text-white/80 mt-6 max-w-[40ch]">{text}</p>}
      {children}
    </div>
  )
}
