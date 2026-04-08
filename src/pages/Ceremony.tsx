import { useState, useEffect, useCallback } from 'react'
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

export default function Ceremony() {
  const [winners, setWinners] = useState<WinnerInfo[]>([])
  const [currentIdx, setCurrentIdx] = useState(-1) // -1 = intro
  const [loading, setLoading] = useState(true)

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
        result.push({
          project,
          votes: count,
          label: c.key,
          sublabel: c.name,
        })
      }
    }

    // General winner
    const genSorted = Object.entries(generalTally).sort((a, b) => b[1] - a[1])
    if (genSorted.length > 0) {
      const [pid, count] = genSorted[0]
      const project = projects.find((p) => p.id === pid)
      if (project) {
        result.push({
          project,
          votes: count,
          label: 'EAD',
          sublabel: 'Mejor Proyecto General',
        })
      }
    }

    setWinners(result)
    setLoading(false)
  }

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FFF500', '#00646c', '#363363', '#ffffff'],
    })
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 60,
        origin: { x: 0 },
        colors: ['#FFF500', '#00646c'],
      })
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 60,
        origin: { x: 1 },
        colors: ['#FFF500', '#363363'],
      })
    }, 300)
  }, [])

  const fireBigConfetti = useCallback(() => {
    const duration = 3000
    const end = Date.now() + duration
    const colors = ['#FFF500', '#00646c', '#363363', '#ffffff']
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors })
      confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [])

  function advance() {
    const nextIdx = currentIdx + 1
    if (nextIdx >= winners.length) return
    setCurrentIdx(nextIdx)
    // Is it the general winner (last one)?
    if (nextIdx === winners.length - 1) {
      setTimeout(fireBigConfetti, 400)
    } else {
      setTimeout(fireConfetti, 400)
    }
  }

  // Keyboard support
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
        Cargando resultados...
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
        {isIntro ? (
          <div className="text-center ceremony-reveal">
            <div className="w-24 h-24 bg-udem-yellow rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-yellow-500/30">
              <Plane className="w-12 h-12 text-udem-black" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black ceremony-title text-udem-yellow">
              Ticket to Fly
            </h1>
            <p className="text-xl text-white/60 mt-4 font-light tracking-widest">2026</p>
            <p className="text-white/40 mt-8 text-sm flex items-center gap-2 justify-center">
              Click o presiona espacio para comenzar <ChevronRight className="w-4 h-4" />
            </p>
          </div>
        ) : current ? (
          <div key={currentIdx} className="text-center ceremony-reveal max-w-lg w-full">
            <div className="mb-6">
              <span className={`inline-block text-sm font-bold px-4 py-1.5 rounded-full ${
                isGeneral ? 'bg-udem-yellow text-udem-black' : 'bg-ead-teal text-white'
              }`}>
                {isGeneral ? 'MEJOR PROYECTO EAD' : `${current.label} — ${current.sublabel}`}
              </span>
            </div>

            <div className="relative">
              {current.project.coverUrl && (
                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-black/50 mb-6 border-2 border-white/10">
                  <img
                    src={current.project.coverUrl}
                    alt={current.project.projectName}
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              )}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                  isGeneral ? 'bg-udem-yellow' : 'bg-ead-teal'
                }`}>
                  <Trophy className={`w-6 h-6 ${isGeneral ? 'text-udem-black' : 'text-white'}`} />
                </div>
              </div>
            </div>

            <h2 className={`text-3xl md:text-4xl font-black mt-8 ${isGeneral ? 'ceremony-title text-udem-yellow' : ''}`}>
              {current.project.projectName}
            </h2>
            <p className="text-white/60 text-lg mt-2">{current.project.teamName}</p>
            <p className="text-white/30 text-sm mt-4">{current.votes} votos</p>

            {!isDone && (
              <p className="text-white/20 mt-12 text-xs flex items-center gap-1 justify-center">
                Siguiente <ChevronRight className="w-3 h-3" />
              </p>
            )}
          </div>
        ) : null}
      </div>
    </PinGate>
  )
}
