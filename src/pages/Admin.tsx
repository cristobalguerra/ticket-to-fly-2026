import { useState, useEffect } from 'react'
import { CAREERS, type Project, type Vote } from '../types'
import { getProjects } from '../lib/projects'
import { getVotes, resetAllVotes, tallyVotes } from '../lib/votes'
import { onVotingStatusChange, setVotingOpen } from '../lib/settings'
import Layout from '../components/Layout'
import PinGate from '../components/PinGate'
import FloorMap from '../components/FloorMap'
import { Link } from 'react-router-dom'
import { RefreshCw, Trash2, Trophy, Users, Presentation, ToggleLeft, ToggleRight, MapPin, Edit3 } from 'lucide-react'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

export default function Admin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [votingOpen, setVotingOpenState] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadData()
    const unsub = onVotingStatusChange(setVotingOpenState)
    return unsub
  }, [])

  async function loadData() {
    setRefreshing(true)
    const [p, v] = await Promise.all([getProjects(), getVotes()])
    setProjects(p)
    setVotes(v)
    setLoading(false)
    setRefreshing(false)
  }

  async function toggleVoting() {
    await setVotingOpen(!votingOpen)
  }

  async function handleReset() {
    if (!confirm('¿Borrar TODOS los votos? Esta acción no se puede deshacer.')) return
    if (!confirm('¿Estás seguro? Se eliminarán todos los votos registrados.')) return
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
    <PinGate label="Panel de Administración" pin="3000">
      <Layout showBack>
        <div className="max-w-2xl mx-auto p-4 pb-8">
          <div className="flex items-center justify-between mt-4 mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <button
              onClick={loadData}
              aria-label="Recargar"
              className="p-2 text-gray-400 hover:text-udem-black"
              style={{ transition: `color 180ms ${EASE_OUT}, transform 160ms ${EASE_OUT}` }}
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={toggleVoting}
              className={`flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-sm border-2 ${
                votingOpen
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-red-100 text-red-800 border-red-300'
              }`}
              style={{ transition: `background-color 220ms ${EASE_OUT}, border-color 220ms ${EASE_OUT}, color 220ms ${EASE_OUT}, transform 160ms ${EASE_OUT}` }}
            >
              {votingOpen ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              Votación {votingOpen ? 'Abierta' : 'Cerrada'}
            </button>

            <Link
              to="/ceremony"
              className="flex items-center justify-center gap-2 p-4 rounded-xl font-bold text-sm bg-ead-indigo text-white hover:brightness-110"
              style={{ transition: `filter 200ms ${EASE_OUT}, transform 160ms ${EASE_OUT}` }}
            >
              <Presentation className="w-5 h-5" />
              Ceremony Mode
            </Link>
          </div>

          {/* Map editor link */}
          <Link
            to="/map-editor"
            className="flex items-center justify-center gap-2 p-3 rounded-xl font-bold text-sm bg-white border-2 border-udem-black/10 text-udem-black mb-6 hover:bg-gray-50"
            style={{ transition: `background-color 200ms ${EASE_OUT}, transform 160ms ${EASE_OUT}` }}
          >
            <Edit3 className="w-4 h-4" />
            Editor del Plano
          </Link>

          {/* Floor plan */}
          <div className="mb-6 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4" />
              Plano del Evento
              <span className="text-gray-400 text-xs ml-auto tabular-nums">
                {projects.filter((p) => p.slotId).length}/{projects.length} con lugar
              </span>
            </h3>
            <FloorMap projects={projects} showLegend={true} showLabels={true} />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <Users className="w-6 h-6 text-ead-teal mx-auto mb-1" />
              <p className="text-2xl font-bold tabular-nums">{totalVoters}</p>
              <p className="text-xs text-gray-500">Profesores votaron</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
              <Trophy className="w-6 h-6 text-udem-yellow mx-auto mb-1" />
              <p className="text-2xl font-bold tabular-nums">{projects.length}</p>
              <p className="text-xs text-gray-500">Proyectos registrados</p>
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-400 py-8">Cargando...</p>
          ) : (
            <>
              {/* Career results */}
              {CAREERS.map((c, ci) => {
                const tally = careerTallies[c.key]
                const careerProjects = projects.filter((p) => p.career === c.key)
                const winner = getWinner(tally)
                const totalCareerVotes = tally ? Object.values(tally).reduce((a, b) => a + b, 0) : 0

                return (
                  <div key={c.key} className="stagger-in mb-6" data-i={Math.min(ci, 7)}>
                    <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
                      <span className="bg-ead-teal text-white px-2 py-0.5 rounded text-xs">{c.key}</span>
                      {c.name}
                      <span className="text-gray-400 text-xs ml-auto tabular-nums">{totalCareerVotes} votos</span>
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
                              className={`relative flex items-center gap-3 p-3 border-b border-gray-50 last:border-0 ${
                                isWinner ? 'bg-yellow-50' : ''
                              }`}
                              style={{ transition: `background-color 240ms ${EASE_OUT}` }}
                            >
                              {/* Vote bar */}
                              <div
                                className="absolute inset-y-0 left-0 bg-udem-black/[0.03] pointer-events-none"
                                style={{
                                  width: `${pct}%`,
                                  transition: `width 600ms ${EASE_OUT}`,
                                }}
                              />
                              {isWinner && <Trophy className="w-4 h-4 text-udem-yellow shrink-0 relative" />}
                              <div className="flex-1 min-w-0 relative">
                                <p className={`text-sm truncate ${isWinner ? 'font-bold' : ''}`}>{p.projectName}</p>
                                <p className="text-xs text-gray-400 truncate">{p.teamName}</p>
                              </div>
                              <div className="text-right shrink-0 relative">
                                <p className="font-bold text-sm tabular-nums">{count}</p>
                                <p className="text-xs text-gray-400 tabular-nums">{pct}%</p>
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
              <div className="stagger-in mb-6" data-i="7">
                <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
                  <span className="bg-ead-indigo text-white px-2 py-0.5 rounded text-xs">GENERAL</span>
                  Mejor Proyecto EAD
                </h3>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  {Object.keys(generalTally).length === 0 ? (
                    <p className="p-3 text-gray-400 text-sm">Sin votos aún</p>
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
                            className={`relative flex items-center gap-3 p-3 border-b border-gray-50 last:border-0 ${isWinner ? 'bg-yellow-50' : ''}`}
                            style={{ transition: `background-color 240ms ${EASE_OUT}` }}
                          >
                            <div
                              className="absolute inset-y-0 left-0 bg-udem-black/[0.03] pointer-events-none"
                              style={{ width: `${pct}%`, transition: `width 600ms ${EASE_OUT}` }}
                            />
                            {isWinner && <Trophy className="w-4 h-4 text-udem-yellow shrink-0 relative" />}
                            <div className="flex-1 min-w-0 relative">
                              <p className={`text-sm truncate ${isWinner ? 'font-bold' : ''}`}>
                                {p?.projectName || pid}
                              </p>
                              <p className="text-xs text-gray-400">{p?.career}</p>
                            </div>
                            <div className="text-right shrink-0 relative">
                              <p className="font-bold text-sm tabular-nums">{count}</p>
                              <p className="text-xs text-gray-400 tabular-nums">{pct}%</p>
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
              className="flex items-center justify-center gap-2 w-full bg-red-100 text-red-700 font-bold py-3 rounded-xl hover:bg-red-200 text-sm"
              style={{ transition: `background-color 200ms ${EASE_OUT}, transform 160ms ${EASE_OUT}` }}
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
