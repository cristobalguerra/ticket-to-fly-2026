import { useState, useEffect } from 'react'
import { CAREERS, type Career, type Project } from '../types'
import { getProjectsByCareer } from '../lib/projects'
import { hasAlreadyVoted, submitAllVotes } from '../lib/votes'
import { isVotingOpen } from '../lib/settings'
import Layout from '../components/Layout'
import ProjectCard from '../components/ProjectCard'
import { Loader2, CheckCircle2, XCircle, ChevronRight, Send } from 'lucide-react'

type Step = 'name' | Career | 'general' | 'confirm' | 'done' | 'closed' | 'already'

export default function Vote() {
  const [step, setStep] = useState<Step>('name')
  const [voterName, setVoterName] = useState('')
  const [careerProjects, setCareerProjects] = useState<Record<string, Project[]>>({})
  const [careerVotes, setCareerVotes] = useState<Partial<Record<Career, string>>>({})
  const [generalVote, setGeneralVote] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentCareerIdx, setCurrentCareerIdx] = useState(0)

  // Check voting status on mount
  useEffect(() => {
    isVotingOpen().then((open) => {
      if (!open) setStep('closed')
    })
  }, [])

  async function handleNameSubmit() {
    if (!voterName.trim()) { setError('Ingresa tu nombre'); return }
    setLoading(true)
    setError('')
    try {
      const voted = await hasAlreadyVoted(voterName)
      if (voted) { setStep('already'); return }
      // Load first career projects
      await loadCareerProjects(CAREERS[0].key)
      setCurrentCareerIdx(0)
      setStep(CAREERS[0].key)
    } catch (err) {
      setError('Error de conexion. Intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function loadCareerProjects(career: Career) {
    if (careerProjects[career]) return
    const projects = await getProjectsByCareer(career)
    setCareerProjects((prev) => ({ ...prev, [career]: projects }))
  }

  async function handleNextCareer() {
    const currentCareer = CAREERS[currentCareerIdx].key
    if (!careerVotes[currentCareer]) { setError('Selecciona un proyecto'); return }
    setError('')

    const nextIdx = currentCareerIdx + 1
    if (nextIdx < CAREERS.length) {
      setLoading(true)
      await loadCareerProjects(CAREERS[nextIdx].key)
      setCurrentCareerIdx(nextIdx)
      setStep(CAREERS[nextIdx].key)
      setLoading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setStep('general')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  async function handleSubmitVotes() {
    if (!generalVote) { setError('Selecciona el mejor proyecto general'); return }
    setLoading(true)
    setError('')
    try {
      await submitAllVotes(voterName, careerVotes as Record<Career, string>, generalVote)
      setStep('done')
    } catch (err: any) {
      setError(err.message || 'Error al enviar votos')
    } finally {
      setLoading(false)
    }
  }

  // Get the 6 selected projects for the general vote
  function getSelectedProjects(): Project[] {
    const selected: Project[] = []
    for (const career of CAREERS) {
      const projectId = careerVotes[career.key]
      if (projectId) {
        const project = careerProjects[career.key]?.find((p) => p.id === projectId)
        if (project) selected.push(project)
      }
    }
    return selected
  }

  if (step === 'closed') {
    return (
      <Layout showBack>
        <div className="flex flex-col items-center justify-center min-h-[60dvh] p-6 text-center">
          <XCircle className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-bold">La votacion no esta abierta</h2>
          <p className="text-gray-500 mt-2">Espera a que el administrador abra la votacion.</p>
        </div>
      </Layout>
    )
  }

  if (step === 'already') {
    return (
      <Layout showBack>
        <div className="flex flex-col items-center justify-center min-h-[60dvh] p-6 text-center">
          <CheckCircle2 className="w-16 h-16 text-ead-teal mb-4" />
          <h2 className="text-xl font-bold">Ya has votado</h2>
          <p className="text-gray-500 mt-2">
            El nombre <strong>{voterName}</strong> ya tiene votos registrados.
          </p>
        </div>
      </Layout>
    )
  }

  if (step === 'done') {
    return (
      <Layout showBack>
        <div className="flex flex-col items-center justify-center min-h-[60dvh] p-6 text-center">
          <div className="w-20 h-20 bg-udem-yellow rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 text-udem-black" />
          </div>
          <h2 className="text-2xl font-bold">Gracias, {voterName.split(' ')[0]}!</h2>
          <p className="text-gray-500 mt-2">Tu voto ha sido registrado.</p>
        </div>
      </Layout>
    )
  }

  if (step === 'name') {
    return (
      <Layout showBack>
        <div className="flex flex-col items-center justify-center min-h-[60dvh] p-6">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold text-center mb-2">Votacion EAD</h1>
            <p className="text-gray-500 text-center text-sm mb-8">
              Ingresa tu nombre completo para comenzar
            </p>
            <input
              type="text"
              value={voterName}
              onChange={(e) => { setVoterName(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              placeholder="Nombre Completo"
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-center text-lg focus:border-udem-yellow outline-none"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            <button
              onClick={handleNameSubmit}
              disabled={loading}
              className="mt-4 w-full bg-udem-yellow text-udem-black font-bold py-4 rounded-xl hover:brightness-95 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Comenzar'}
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  if (step === 'general') {
    const selectedProjects = getSelectedProjects()
    return (
      <Layout showBack>
        <div className="max-w-lg mx-auto p-4 pb-32">
          <div className="text-center mb-6 mt-4">
            <span className="text-xs font-bold bg-ead-indigo text-white px-3 py-1 rounded-full">
              VOTO FINAL
            </span>
            <h1 className="text-xl font-bold mt-3">Mejor Proyecto EAD</h1>
            <p className="text-gray-500 text-sm mt-1">
              De tus 6 elegidos, selecciona el mejor proyecto de toda la escuela.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {selectedProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                selected={generalVote === p.id}
                onClick={() => { setGeneralVote(p.id); setError('') }}
                showCareer
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <button
            onClick={handleSubmitVotes}
            disabled={loading || !generalVote}
            className="w-full max-w-lg mx-auto bg-udem-yellow text-udem-black font-bold py-4 rounded-xl hover:brightness-95 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Enviar Votos</>}
          </button>
        </div>
      </Layout>
    )
  }

  // Career voting steps
  const currentCareer = CAREERS[currentCareerIdx]
  const projects = careerProjects[currentCareer.key] || []

  return (
    <Layout showBack>
      <div className="max-w-lg mx-auto p-4 pb-32">
        <div className="text-center mb-6 mt-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            {CAREERS.map((c, i) => (
              <div
                key={c.key}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i < currentCareerIdx ? 'bg-ead-teal' : i === currentCareerIdx ? 'bg-udem-yellow' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold bg-ead-teal text-white px-3 py-1 rounded-full">
            {currentCareer.key} — {currentCareerIdx + 1}/6
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
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                selected={careerVotes[currentCareer.key] === p.id}
                onClick={() => { setCareerVotes((prev) => ({ ...prev, [currentCareer.key]: p.id })); setError('') }}
              />
            ))}
          </div>
        )}

        {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <button
          onClick={handleNextCareer}
          disabled={loading || !careerVotes[currentCareer.key]}
          className="w-full max-w-lg mx-auto bg-udem-yellow text-udem-black font-bold py-4 rounded-xl hover:brightness-95 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
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
