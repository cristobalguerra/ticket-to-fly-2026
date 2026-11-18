import { useState, useEffect } from 'react'
import { CAREERS, type Career, type Project } from '../types'
import { getProjects } from '../lib/projects'
import { useSession, signOut } from '../lib/auth'
import { SignInPanel } from '../components/AuthGate'
import { hasAlreadyVoted, submitAllVotes } from '../lib/votes'
import { isVotingOpen } from '../lib/settings'
import { CURRENT } from '../lib/editions'
import Layout from '../components/Layout'
import ProjectCard from '../components/ProjectCard'
import { Loader2, CheckCircle2, XCircle, ChevronRight, Send, Clock } from 'lucide-react'

type Step = 'name' | Career | 'general' | 'confirm' | 'done' | 'closed' | 'already' | 'scheduled'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

// Si la edición tiene hora de apertura, la votación se desbloquea sola a esa hora.
// Si no, depende solo del interruptor de Admin.
const VOTING_OPENS_AT = CURRENT.event.votingOpensAt

export default function Vote() {
  const [step, setStep] = useState<Step>('name')
  const session = useSession()
  const voterName = session.user?.displayName || session.user?.email || ''
  const [careers, setCareers] = useState(CAREERS)
  const [careerProjects, setCareerProjects] = useState<Record<string, Project[]>>({})
  const [careerVotes, setCareerVotes] = useState<Partial<Record<Career, string>>>({})
  const [generalVote, setGeneralVote] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentCareerIdx, setCurrentCareerIdx] = useState(0)

  useEffect(() => {
    if (VOTING_OPENS_AT && Date.now() < VOTING_OPENS_AT.getTime()) {
      setStep('scheduled')
      return
    }
    isVotingOpen().then((open) => {
      if (!open) setStep('closed')
    })
  }, [])

  async function handleStart() {
    if (!session.user) return
    setLoading(true)
    setError('')
    try {
      if (await hasAlreadyVoted(session.user.uid)) { setStep('already'); return }
      // Solo se vota en las carreras que tienen proyectos en esta edición.
      const all = await getProjects()
      const grouped: Record<string, Project[]> = {}
      all.forEach((p) => { (grouped[p.career] ||= []).push(p) })
      const active = CAREERS.filter((c) => grouped[c.key]?.length)
      if (active.length === 0) { setError('Todavía no hay proyectos para votar.'); return }
      setCareerProjects(grouped)
      setCareers(active)
      setCurrentCareerIdx(0)
      setStep(active[0].key)
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function handleNextCareer() {
    const currentCareer = careers[currentCareerIdx].key
    if (!careerVotes[currentCareer]) { setError('Selecciona un proyecto'); return }
    setError('')

    const nextIdx = currentCareerIdx + 1
    if (nextIdx < careers.length) {
      setCurrentCareerIdx(nextIdx)
      setStep(careers[nextIdx].key)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setStep('general')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function handleSubmitVotes() {
    if (!generalVote) { setError('Selecciona el mejor proyecto general'); return }
    if (!session.user) { setError('Tu sesión terminó. Vuelve a entrar.'); return }
    setLoading(true)
    setError('')
    try {
      await submitAllVotes(
        { uid: session.user.uid, name: voterName, email: session.user.email ?? '' },
        careerVotes,
        generalVote,
      )
      setStep('done')
    } catch (err) {
      const denied = (err as { code?: string }).code === 'permission-denied'
      setError(denied ? 'No se pudo registrar: la votación está cerrada o ya votaste.' : (err as Error).message || 'Error al enviar votos')
    } finally {
      setLoading(false)
    }
  }

  function getSelectedProjects(): Project[] {
    const selected: Project[] = []
    for (const career of careers) {
      const projectId = careerVotes[career.key]
      if (projectId) {
        const project = careerProjects[career.key]?.find((p) => p.id === projectId)
        if (project) selected.push(project)
      }
    }
    return selected
  }

  if (step === 'scheduled' && VOTING_OPENS_AT) {
    return (
      <Layout showBack>
        <ScheduledScreen openAt={VOTING_OPENS_AT} />
      </Layout>
    )
  }

  if (step === 'closed') {
    return (
      <Layout showBack>
        <div className="step-enter flex flex-col items-center justify-center min-h-[60dvh] p-6 text-center">
          <XCircle className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-bold">La votación no está abierta</h2>
          <p className="text-gray-500 mt-2">
            {CURRENT.event.votingSoon ? CURRENT.event.votingSoon.join(' · ') : 'Espera a que el administrador abra la votación.'}
          </p>
        </div>
      </Layout>
    )
  }

  if (step === 'already') {
    return (
      <Layout showBack>
        <div className="step-enter flex flex-col items-center justify-center min-h-[60dvh] p-6 text-center">
          <CheckCircle2 className="w-16 h-16 text-ead-teal mb-4" />
          <h2 className="text-xl font-bold">Ya has votado</h2>
          <p className="text-gray-500 mt-2">
            La cuenta <strong>{session.user?.email}</strong> ya tiene votos registrados.
          </p>
        </div>
      </Layout>
    )
  }

  if (step === 'done') {
    return (
      <Layout showBack>
        <div className="step-enter flex flex-col items-center justify-center min-h-[60dvh] p-6 text-center">
          <div className="w-20 h-20 bg-udem-yellow rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-udem-black" />
          </div>
          <h2 className="text-2xl font-bold">¡Gracias, {voterName.split(' ')[0]}!</h2>
          <p className="text-gray-500 mt-2">Tu voto ha sido registrado.</p>
        </div>
      </Layout>
    )
  }

  if (step === 'name') {
    return (
      <Layout showBack>
        <div className="step-enter px-4 md:px-8 pt-10 md:pt-14 pb-16 max-w-xl">
          <h1 className="cond text-6xl md:text-7xl -ml-[0.015em]">Votación</h1>
          <p className="mt-6 bg-udem-yellow text-udem-black font-bold text-[15px] leading-[1.5] p-4 max-w-[46ch]">
            Solamente pueden votar profesores. Los proyectos quedarán descalificados si un alumno vota en cualquiera de los proyectos.
          </p>
          {session.loading ? (
            <Loader2 className="w-6 h-6 animate-spin text-udem-black/40 mt-8" />
          ) : !session.user ? (
            <SignInPanel />
          ) : (
            <div className="mt-8">
              <p className="text-[15px] leading-[1.6] text-udem-black/85">
                Vas a votar como <strong className="font-bold">{voterName}</strong>
                <br />
                <span className="text-udem-black/65">{session.user.email}</span>
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-6">
                <button
                  onClick={handleStart}
                  disabled={loading}
                  className="code text-[13px] md:text-sm bg-udem-black text-white px-5 py-3.5 hover:bg-udem-yellow hover:text-black disabled:opacity-50 flex items-center gap-2"
                  style={{ transition: `background-color 160ms ${EASE_OUT}, color 160ms ${EASE_OUT}` }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : '→ Comenzar'}
                </button>
                <button onClick={() => signOut()} className="code text-[13px] md:text-sm underline underline-offset-4">
                  Cambiar de cuenta
                </button>
              </div>
              <p aria-live="polite" className="text-sm text-red-700 mt-4 min-h-5">{error}</p>
            </div>
          )}
        </div>
      </Layout>
    )
  }

  if (step === 'general') {
    const selectedProjects = getSelectedProjects()
    return (
      <Layout showBack>
        <div className="step-enter max-w-lg mx-auto p-4 pb-32">
          <div className="text-center mb-6 mt-4">
            <span className="text-sm font-bold bg-udem-black text-white px-3 py-1 rounded-full">
              VOTO FINAL
            </span>
            <h1 className="text-xl font-bold mt-3">Mejor Proyecto EAD</h1>
            <p className="text-gray-500 text-sm mt-1">
              De tus elegidos, selecciona el mejor proyecto de toda la escuela.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {selectedProjects.map((p, i) => (
              <div key={p.id} className="stagger-in" data-i={Math.min(i, 7)}>
                <ProjectCard
                  project={p}
                  selected={generalVote === p.id}
                  onClick={() => { setGeneralVote(p.id); setError('') }}
                  showCareer
                />
              </div>
            ))}
          </div>

          <p
            aria-live="polite"
            className={`text-red-500 text-sm text-center overflow-hidden ${error ? 'mt-4 max-h-6 opacity-100' : 'mt-0 max-h-0 opacity-0'}`}
            style={{ transition: `max-height 220ms ${EASE_OUT}, opacity 180ms ${EASE_OUT}, margin-top 220ms ${EASE_OUT}` }}
          >
            {error || ' '}
          </p>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/60 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
          <button
            onClick={handleSubmitVotes}
            disabled={loading || !generalVote}
            className="w-full max-w-lg mx-auto bg-udem-black text-white font-bold py-4 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{ transition: `transform 160ms ${EASE_OUT}, opacity 200ms ${EASE_OUT}, background-color 200ms ${EASE_OUT}` }}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Enviar Votos</>}
          </button>
        </div>
      </Layout>
    )
  }

  // Career voting steps
  const currentCareer = careers[currentCareerIdx]
  const projects = careerProjects[currentCareer.key] || []

  return (
    <Layout showBack>
      <div key={currentCareer.key} className="step-enter max-w-lg mx-auto p-4 pb-32">
        <div className="text-center mb-6 mt-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            {careers.map((c, i) => {
              const done = i < currentCareerIdx
              const active = i === currentCareerIdx
              return (
                <div
                  key={c.key}
                  className="rounded-full"
                  style={{
                    width: active ? '20px' : '8px',
                    height: '8px',
                    background: done || active ? '#333' : 'rgba(51,51,51,0.18)',
                    transition: `width 280ms ${EASE_OUT}, background-color 200ms ${EASE_OUT}`,
                  }}
                />
              )
            })}
          </div>
          <span className="text-sm font-bold bg-udem-black text-white px-3 py-1 rounded-full">
            {currentCareer.key} — {currentCareerIdx + 1}/{careers.length}
          </span>
          <h1 className="text-xl font-bold mt-3">{currentCareer.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Selecciona el mejor proyecto</p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
            Cargando proyectos...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {projects.map((p, i) => (
              <div key={p.id} className="stagger-in" data-i={Math.min(i, 7)}>
                <ProjectCard
                  project={p}
                  selected={careerVotes[currentCareer.key] === p.id}
                  onClick={() => { setCareerVotes((prev) => ({ ...prev, [currentCareer.key]: p.id })); setError('') }}
                />
              </div>
            ))}
          </div>
        )}

        <p
          aria-live="polite"
          className={`text-red-500 text-sm text-center overflow-hidden ${error ? 'mt-4 max-h-6 opacity-100' : 'mt-0 max-h-0 opacity-0'}`}
          style={{ transition: `max-height 220ms ${EASE_OUT}, opacity 180ms ${EASE_OUT}, margin-top 220ms ${EASE_OUT}` }}
        >
          {error || ' '}
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200/60 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <button
          onClick={handleNextCareer}
          disabled={loading || !careerVotes[currentCareer.key]}
          className="w-full max-w-lg mx-auto bg-udem-black text-white font-bold py-4 disabled:opacity-40 flex items-center justify-center gap-2"
          style={{ transition: `transform 160ms ${EASE_OUT}, opacity 200ms ${EASE_OUT}, background-color 200ms ${EASE_OUT}` }}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              Siguiente <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </Layout>
  )
}

function ScheduledScreen({ openAt }: { openAt: Date }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const diff = Math.max(0, openAt.getTime() - now)
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)

  if (diff === 0) {
    return (
      <div className="step-enter flex flex-col items-center justify-center min-h-[60dvh] p-6 text-center">
        <p className="text-sm text-gray-500 mb-3">La votación ya abrió</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-udem-black text-white font-bold px-6 py-3"
        >
          Comenzar a votar
        </button>
      </div>
    )
  }

  const opensLabel = openAt.toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
  const timeLabel = openAt.toLocaleTimeString('es-MX', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  })

  return (
    <div className="step-enter flex flex-col items-center justify-center min-h-[70dvh] p-6 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-udem-black/5 text-udem-black/60 text-sm font-bold tracking-widest uppercase mb-6">
        <Clock className="w-3 h-3" />
        Votación programada
      </div>

      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
        La votación abre el día del evento
      </h1>
      <p className="text-udem-black/60 text-sm mb-10 max-w-md">
        {opensLabel} a las {timeLabel}. Cerrará 2 horas después.
      </p>

      {/* Countdown */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-md mb-10">
        <CountdownCell value={days} label="Días" />
        <CountdownCell value={hours} label="Horas" />
        <CountdownCell value={minutes} label="Min" />
        <CountdownCell value={seconds} label="Seg" />
      </div>

      <p className="text-sm text-udem-black/40 max-w-sm leading-relaxed">
        Mientras tanto, puedes revisar los proyectos para emitir un voto informado el día del evento.
      </p>
      <a
        href="#/projects"
        className="mt-5 inline-flex items-center gap-2 text-udem-black font-bold text-sm border-b border-udem-black/30 hover:border-udem-black pb-0.5"
        style={{ transition: `border-color 180ms ${EASE_OUT}` }}
      >
        Ver proyectos <ChevronRight className="w-4 h-4" />
      </a>
    </div>
  )
}

function CountdownCell({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, '0')
  return (
    <div className="bg-white border border-udem-black/10 py-4 px-2">
      <div className="text-4xl sm:text-5xl font-black tabular-nums text-udem-black leading-none">
        {display}
      </div>
      <div className="text-[13px] sm:text-sm uppercase tracking-widest text-udem-black/40 font-bold mt-1.5">
        {label}
      </div>
    </div>
  )
}
