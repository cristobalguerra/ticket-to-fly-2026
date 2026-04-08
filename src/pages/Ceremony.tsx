import { useState, useEffect, useCallback, useMemo } from 'react'
import { CAREERS, type Project } from '../types'
import { getProjects } from '../lib/projects'
import { getVotes, tallyVotes } from '../lib/votes'
import PinGate from '../components/PinGate'
import confetti from 'canvas-confetti'
import { Trophy, Plane, ChevronRight } from 'lucide-react'

interface WinnerInfo {
  project: Project
  votes: number
  label: string
  sublabel: string
}

const DEMO_WINNERS: WinnerInfo[] = CAREERS.map((c, i) => ({
  project: {
    id: `demo-${i}`,
    career: c.key,
    projectName: ['Oneiro', 'Metamorfosis', 'Hilos del Tiempo', 'Casa Origen', 'Flujo Urbano', 'Ecos'][i],
    teamName: ['Sofia Martinez', 'Diego Lopez', 'Ana Garza', 'Carlos Reyes', 'Mariana Torres', 'Luis Hernandez'][i],
    description: '',
    coverUrl: '',
    createdAt: new Date(),
  },
  votes: [12, 9, 11, 8, 10, 7][i],
  label: c.key,
  sublabel: c.name,
})).concat({
  project: {
    id: 'demo-general',
    career: 'LDG',
    projectName: 'Oneiro',
    teamName: 'Sofia Martinez',
    description: '',
    coverUrl: '',
    createdAt: new Date(),
  },
  votes: 15,
  label: 'EAD',
  sublabel: 'Mejor Proyecto General',
})

function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${8 + Math.random() * 12}s`,
      size: `${2 + Math.random() * 3}px`,
      opacity: 0.1 + Math.random() * 0.2,
    })), [])

  return (
    <div className="ceremony-particles">
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}

export default function Ceremony() {
  const [winners, setWinners] = useState<WinnerInfo[]>([])
  const [currentIdx, setCurrentIdx] = useState(-1)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    loadResults()
  }, [])

  async function loadResults() {
    const [projects, votes] = await Promise.all([getProjects(), getVotes()])
    const projectsMap = new Map(projects.map((p) => [p.id, { projectName: p.projectName, career: p.career }]))
    const { careerTallies, generalTally } = tallyVotes(votes, projectsMap)

    const result: WinnerInfo[] = []

    for (const c of CAREERS) {
      const tally = careerTallies[c.key]
      if (!tally) continue
      const sorted = Object.entries(tally).sort((a, b) => b[1] - a[1])
      if (sorted.length === 0) continue
      const [pid, count] = sorted[0]
      const project = projects.find((p) => p.id === pid)
      if (project) {
        result.push({ project, votes: count, label: c.key, sublabel: c.name })
      }
    }

    const genSorted = Object.entries(generalTally).sort((a, b) => b[1] - a[1])
    if (genSorted.length > 0) {
      const [pid, count] = genSorted[0]
      const project = projects.find((p) => p.id === pid)
      if (project) {
        result.push({ project, votes: count, label: 'EAD', sublabel: 'Mejor Proyecto General' })
      }
    }

    if (result.length > 0) {
      setWinners(result)
    } else {
      setWinners(DEMO_WINNERS)
      setIsDemo(true)
    }
    setLoading(false)
  }

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFF500', '#00646c', '#363363', '#ffffff'],
      gravity: 0.8,
      drift: 0,
      ticks: 200,
    })
    setTimeout(() => {
      confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors: ['#FFF500', '#00646c'] })
      confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors: ['#FFF500', '#363363'] })
    }, 250)
  }, [])

  const fireBigConfetti = useCallback(() => {
    // Initial burst
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#FFF500', '#00646c', '#363363', '#fff'], gravity: 0.6, ticks: 300 })

    const duration = 4000
    const end = Date.now() + duration
    const colors = ['#FFF500', '#00646c', '#363363', '#ffffff']
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 60, origin: { x: 0 }, colors, gravity: 0.7 })
      confetti({ particleCount: 3, angle: 120, spread: 60, origin: { x: 1 }, colors, gravity: 0.7 })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  function advance() {
    const nextIdx = currentIdx + 1
    if (nextIdx >= winners.length) return
    setCurrentIdx(nextIdx)
    if (nextIdx === winners.length - 1) {
      setTimeout(fireBigConfetti, 500)
    } else {
      setTimeout(fireConfetti, 500)
    }
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        advance()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  if (loading) {
    return (
      <div className="ceremony-bg min-h-dvh flex items-center justify-center text-white">
        <div className="ceremony-orb-accent" />
        <Particles />
        <p className="text-white/40 text-sm">Cargando resultados...</p>
      </div>
    )
  }

  const current = currentIdx >= 0 ? winners[currentIdx] : null
  const isGeneral = currentIdx === winners.length - 1
  const isIntro = currentIdx === -1
  const isDone = currentIdx >= winners.length - 1 && currentIdx >= 0

  return (
    <PinGate label="Ceremony Mode">
      <div
        className="ceremony-bg min-h-dvh flex flex-col items-center justify-center p-6 text-white cursor-pointer select-none"
        onClick={advance}
      >
        <div className="ceremony-orb-accent" />
        <Particles />

        {isDemo && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 glass-pill text-white/50 text-xs px-5 py-2 z-50 tracking-wider uppercase">
            Modo Demo
          </div>
        )}

        {isIntro ? (
          <div className="text-center ceremony-reveal relative z-10">
            <div className="logo-ring w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-10">
              <Plane className="w-12 h-12 text-udem-black relative z-10" />
            </div>
            <h1 className="text-5xl md:text-8xl font-black ceremony-title text-udem-yellow tracking-tight">
              Ticket to Fly
            </h1>
            <p className="text-xl text-white/30 mt-4 font-light tracking-[0.3em] uppercase">2026</p>
            <p className="text-white/20 mt-16 text-xs flex items-center gap-2 justify-center tracking-wider">
              Toca para comenzar <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        ) : current ? (
          <div key={currentIdx} className="text-center ceremony-reveal max-w-md w-full relative z-10">
            {/* Career badge */}
            <div className="mb-8">
              <span className={`glass-pill inline-block text-sm font-semibold px-6 py-2 tracking-wider ${
                isGeneral ? 'text-udem-yellow' : 'text-white/80'
              }`}>
                {isGeneral ? 'MEJOR PROYECTO EAD' : `${current.label} — ${current.sublabel}`}
              </span>
            </div>

            {/* Glass card with project */}
            <div className="glass-card glass-shimmer p-1.5">
              {current.project.coverUrl ? (
                <div className="rounded-[20px] overflow-hidden">
                  <img
                    src={current.project.coverUrl}
                    alt={current.project.projectName}
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-[20px] aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-white/5 to-white/[0.02]">
                  <Trophy className={`w-24 h-24 ${isGeneral ? 'text-udem-yellow/60' : 'text-ead-teal/60'}`} />
                </div>
              )}
            </div>

            {/* Trophy badge */}
            <div className="relative -mt-6 mb-2">
              <div className={`trophy-pulse absolute left-1/2 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl ${
                isGeneral
                  ? 'bg-gradient-to-br from-udem-yellow to-yellow-400 shadow-yellow-500/30'
                  : 'bg-gradient-to-br from-ead-teal to-teal-500 shadow-teal-500/30'
              }`}>
                <Trophy className={`w-7 h-7 ${isGeneral ? 'text-udem-black' : 'text-white'}`} />
              </div>
            </div>

            {/* Project info */}
            <div className="mt-12">
              <h2 className={`text-3xl md:text-5xl font-black leading-tight ${
                isGeneral ? 'ceremony-title text-udem-yellow' : 'text-white'
              }`}>
                {current.project.projectName}
              </h2>
              <p className="text-white/40 text-lg mt-3 font-light">{current.project.teamName}</p>
              <p className="vote-count text-white/20 text-sm mt-5 tracking-wider">
                {current.votes} votos
              </p>
            </div>

            {!isDone && (
              <p className="text-white/10 mt-16 text-xs flex items-center gap-1 justify-center tracking-widest uppercase">
                Siguiente <ChevronRight className="w-3 h-3" />
              </p>
            )}

            {isDone && (
              <div className="mt-16 ceremony-reveal">
                <p className="text-white/20 text-xs tracking-widest uppercase">
                  Felicidades a todos los ganadores
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </PinGate>
  )
}
