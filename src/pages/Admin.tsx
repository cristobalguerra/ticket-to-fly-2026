import { useState, useEffect } from 'react'
import { CAREERS, type Project, type Vote } from '../types'
import { getProjects } from '../lib/projects'
import { getVotes, resetAllVotes, tallyVotes } from '../lib/votes'
import { onVotingStatusChange, setVotingOpen } from '../lib/settings'
import Layout from '../components/Layout'
import PinGate from '../components/PinGate'
import { Link } from 'react-router-dom'
import { RefreshCw, Trash2, Trophy, Users, Presentation, ToggleLeft, ToggleRight } from 'lucide-react'

export default function Admin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [votingOpen, setVotingOpenState] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
    const unsub = onVotingStatusChange(setVotingOpenState)
    return unsub
  }, [])

  async function loadData() {
    setLoading(true)
    const [p, v] = await Promise.all([getProjects(), getVotes()])
    setProjects(p)
    setVotes(v)
    setLoading(false)
  }

  async function toggleVoting() {
    await setVotingOpen(!votingOpen)
  }

  async function handleReset() {
    if (!confirm('Borrar TODOS los votos? Esta accion no se puede deshacer.')) return
    if (!confirm('Estas seguro? Se eliminaran todos los votos registrados.')) return
    await resetAllVotes()
    await loadData()
  }

  const projectsMap = new Map(projects.map((p) => [p.id, { projectName: p.projectName, career: p.career }]))
  const { careerTallies, generalTally, totalVoters } = tallyVotes(votes, projectsMap)

  function getWinner(tally: Record<string, number> | undefined) {
    if (!tally) return null
    const entries = Object.entries(tally)
    if (entries.length === 0) return null
    entries.sort((a, b) => b[1] - a[1])
    return entries[0]
  }

  return (
    <PinGate label="Panel de Administracion">
      <Layout showBack>
        <div className="max-w-2xl mx-auto p-4 pb-8">
          <div className="flex items-center justify-between mt-4 mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button onClick={loadData} className="p-2 text-gray-400 hover:text-udem-black transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={toggleVoting}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-sm transition-all ${
                votingOpen
                  ? 'bg-green-100 text-green-800 border-2 border-green-300'
                  : 'bg-red-100 text-red-800 border-2 border-red-300'
              }`}
            >
              {votingOpen ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              Votacion {votingOpen ? 'Abierta' : 'Cerrada'}
            </button>

            <Link
              to="/ceremony"
              className="flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-sm bg-ead-indigo text-white hover:brightness-110 transition-all"
            >
              <Presentation className="w-5 h-5" />
              Ceremony Mode
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <Users className="w-6 h-6 text-ead-teal mx-auto mb-1" />
              <p className="text-2xl font-bold">{totalVoters}</p>
              <p className="text-xs text-gray-500">Profesores votaron</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <Trophy className="w-6 h-6 text-udem-yellow mx-auto mb-1" />
              <p className="text-2xl font-bold">{projects.length}</p>
              <p className="text-xs text-gray-500">Proyectos registrados</p>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-8">Cargando...</p>
          ) : (
            <>
              {/* Career results */}
              {CAREERS.map((c) => {
                const tally = careerTallies[c.key]
                const careerProjects = projects.filter((p) => p.career === c.key)
                const winner = getWinner(tally)
                const totalCareerVotes = tally ? Object.values(tally).reduce((a, b) => a + b, 0) : 0

                return (
                  <div key={c.key} className="mb-6">
                    <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
                      <span className="bg-ead-teal text-white px-2 py-0.5 rounded text-xs">{c.key}</span>
                      {c.name}
                      <span className="text-gray-400 text-xs ml-auto">{totalCareerVotes} votos</span>
                    </h3>
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                      {careerProjects.length === 0 ? (
                        <p className="p-3 text-gray-400 text-sm">Sin proyectos</p>
                      ) : (
                        careerProjects.map((p) => {
                          const count = tally?.[p.id] || 0
                          const pct = totalCareerVotes > 0 ? Math.round((count / totalCareerVotes) * 100) : 0
                          const isWinner = winner?.[0] === p.id && count > 0

                          return (
                            <div
                              key={p.id}
                              className={`flex items-center gap-3 p-3 border-b border-gray-50 last:border-0 ${
                                isWinner ? 'bg-yellow-50' : ''
                              }`}
                            >
                              {isWinner && <Trophy className="w-4 h-4 text-udem-yellow shrink-0" />}
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm truncate ${isWinner ? 'font-bold' : ''}`}>{p.projectName}</p>
                                <p className="text-xs text-gray-400 truncate">{p.teamName}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-bold text-sm">{count}</p>
                                <p className="text-xs text-gray-400">{pct}%</p>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                )
              })}

              {/* General result */}
              <div className="mb-6">
                <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
                  <span className="bg-ead-indigo text-white px-2 py-0.5 rounded text-xs">GENERAL</span>
                  Mejor Proyecto EAD
                </h3>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  {Object.keys(generalTally).length === 0 ? (
                    <p className="p-3 text-gray-400 text-sm">Sin votos aun</p>
                  ) : (
                    (() => {
                      const totalGen = Object.values(generalTally).reduce((a, b) => a + b, 0)
                      const sorted = Object.entries(generalTally).sort((a, b) => b[1] - a[1])
                      return sorted.map(([pid, count]) => {
                        const p = projectsMap.get(pid)
                        const pct = totalGen > 0 ? Math.round((count / totalGen) * 100) : 0
                        const isWinner = sorted[0][0] === pid
                        return (
                          <div
                            key={pid}
                            className={`flex items-center gap-3 p-3 border-b border-gray-50 last:border-0 ${isWinner ? 'bg-yellow-50' : ''}`}
                          >
                            {isWinner && <Trophy className="w-4 h-4 text-udem-yellow shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${isWinner ? 'font-bold' : ''}`}>
                                {p?.projectName || pid}
                              </p>
                              <p className="text-xs text-gray-400">{p?.career}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-sm">{count}</p>
                              <p className="text-xs text-gray-400">{pct}%</p>
                            </div>
                          </div>
                        )
                      })
                    })()
                  )}
                </div>
              </div>
            </>
          )}

          {/* Danger zone */}
          <div className="mt-8 border-2 border-red-200 rounded-xl p-4">
            <h3 className="font-bold text-red-600 text-sm mb-3">Zona de peligro</h3>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 w-full bg-red-100 text-red-700 font-bold py-3 rounded-xl hover:bg-red-200 transition-all text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Resetear todos los votos
            </button>
          </div>
        </div>
      </Layout>
    </PinGate>
  )
}
