import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { CAREERS, type Project, type Vote } from '../types'
import { getProjects } from '../lib/projects'
import { CURRENT } from '../lib/editions'
import { getVotes, resetAllVotes, deleteVotes, tallyVotes } from '../lib/votes'
import { onVotingStatusChange, setVotingOpen } from '../lib/settings'
import Layout from '../components/Layout'
import AuthGate from '../components/AuthGate'

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'
const LABEL = 'code text-[13px] md:text-sm text-udem-black/70'
const ACTION =
  'code text-[13px] md:text-sm bg-udem-black text-white px-5 py-3.5 hover:bg-udem-yellow hover:text-black focus-visible:bg-udem-yellow focus-visible:text-black outline-none disabled:opacity-50'
const ACTION_STYLE = { transition: `background-color 160ms ${EASE}, color 160ms ${EASE}` }

export default function Admin() {
  return (
    <AuthGate label="Admin" admin>
      <Dashboard />
    </AuthGate>
  )
}

const LOAD_ERROR = 'No se pudieron cargar los votos. Comprueba que tu cuenta sea administradora y recarga.'

// Proyectos y votos se piden por separado: si los votos fallan, los
// proyectos se muestran igual.
async function fetchAll() {
  const [p, v] = await Promise.allSettled([getProjects(), getVotes()])
  if (p.status === 'rejected') console.error(p.reason)
  if (v.status === 'rejected') console.error(v.reason)
  return {
    projects: p.status === 'fulfilled' ? p.value : [],
    votes: v.status === 'fulfilled' ? v.value : [],
    failed: p.status === 'rejected' || v.status === 'rejected',
  }
}

interface Voter {
  key: string
  name: string
  email: string
  voteIds: string[]
}

// Se monta solo cuando la cuenta ya pasó como administradora: antes de eso
// las reglas no dejan leer los votos.
function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [votingOpen, setVotingOpenState] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  const loadData = useCallback(async () => {
    setRefreshing(true)
    const data = await fetchAll()
    setProjects(data.projects)
    setVotes(data.votes)
    setError(data.failed ? LOAD_ERROR : '')
    setLoading(false)
    setRefreshing(false)
  }, [])

  useEffect(() => {
    let alive = true
    fetchAll().then((data) => {
      if (!alive) return
      setProjects(data.projects)
      setVotes(data.votes)
      setError(data.failed ? LOAD_ERROR : '')
      setLoading(false)
    })
    const unsub = onVotingStatusChange(setVotingOpenState)
    return () => { alive = false; unsub() }
  }, [])

  async function toggleVoting() {
    if (votingOpen === null) return
    const next = !votingOpen
    if (!confirm(next ? '¿Abrir la votación ahora?' : '¿Cerrar la votación ahora?')) return
    await setVotingOpen(next)
  }

  async function handleReset() {
    if (!confirm(`¿Borrar todos los votos de ${CURRENT.label}? Esta acción no se puede deshacer.`)) return
    if (!confirm(`¿Estás seguro? Se eliminarán los votos de ${CURRENT.label}. Los de ediciones anteriores no se tocan.`)) return
    await resetAllVotes()
    await loadData()
  }

  async function handleAnnul(voter: Voter) {
    if (!confirm(`¿Anular los ${voter.voteIds.length} votos de ${voter.name}${voter.email ? ` (${voter.email})` : ''}? No se puede deshacer.`)) return
    await deleteVotes(voter.voteIds)
    await loadData()
  }

  const projectsMap = new Map(projects.map((p) => [p.id, { projectName: p.projectName, career: p.career }]))
  const { careerTallies, generalTally, totalVoters } = tallyVotes(votes, projectsMap)

  const votersMap = new Map<string, Voter>()
  for (const v of votes) {
    const key = v.voterUid ?? v.voterName
    const entry = votersMap.get(key) ?? { key, name: v.voterName, email: v.voterEmail ?? '', voteIds: [] }
    entry.voteIds.push(v.id)
    votersMap.set(key, entry)
  }
  const voters = [...votersMap.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'))

  const generalRows = Object.entries(generalTally)
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => ({ id, count, name: projectsMap.get(id)?.projectName ?? id, detail: projectsMap.get(id)?.career ?? '' }))

  return (
    <Layout showBack>
      <div className="px-4 md:px-8 pb-20">
        <div className="pt-8 md:pt-10 stagger-in flex flex-wrap items-end justify-between gap-x-8 gap-y-3" data-i="0">
          <h1 className="cond text-[22vw] sm:text-[8.5rem] md:text-[11rem] -ml-[0.015em]">Admin</h1>
          <p className="code text-[13px] md:text-[15px] leading-[1.7] pb-2 md:pb-4">{CURRENT.label}</p>
        </div>

        <dl className="stagger-in grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 mt-10 md:mt-14" data-i="1">
          <Fact value={votingOpen === null ? '—' : votingOpen ? 'Abierta' : 'Cerrada'} label="Votación" accent={votingOpen === true} />
          <Fact value={String(totalVoters)} label="Cuentas que votaron" />
          <Fact value={String(votes.length)} label="Votos registrados" />
          <Fact value={String(projects.length)} label="Proyectos" />
        </dl>

        <div className="stagger-in flex flex-wrap gap-2 mt-10" data-i="2">
          <button type="button" onClick={toggleVoting} disabled={votingOpen === null} className={ACTION} style={ACTION_STYLE}>
            → {votingOpen ? 'Cerrar votación' : 'Abrir votación'}
          </button>
          <Link to="/ceremony" className={ACTION} style={ACTION_STYLE}>→ Ceremonia</Link>
          <Link to="/upload" className={ACTION} style={ACTION_STYLE}>→ Editar proyectos</Link>
          <button type="button" onClick={loadData} disabled={refreshing} className={ACTION} style={ACTION_STYLE}>
            {refreshing ? 'Actualizando…' : '→ Actualizar'}
          </button>
        </div>

        <p aria-live="polite" className="text-sm text-red-700 mt-4 min-h-5">{error}</p>

        {loading ? (
          <p className={`${LABEL} mt-16`}>Cargando…</p>
        ) : (
          <>
            <Row label="Mejor proyecto EAD" note={`${generalRows.reduce((a, r) => a + r.count, 0)} votos`}>
              <Results rows={generalRows} empty="Sin votos aún" />
            </Row>

            {CAREERS.map((c) => {
              const tally = careerTallies[c.key] ?? {}
              const rows = projects
                .filter((p) => p.career === c.key)
                .map((p) => ({ id: p.id, count: tally[p.id] ?? 0, name: p.projectName, detail: p.teamName }))
                .sort((a, b) => b.count - a.count)
              if (rows.length === 0) return null
              return (
                <Row key={c.key} label={`${c.key} · ${c.name}`} note={`${rows.reduce((a, r) => a + r.count, 0)} votos`}>
                  <Results rows={rows} empty="Sin proyectos" />
                </Row>
              )
            })}

            <Row label="Quién votó" note={`${voters.length} cuentas`}>
              {voters.length === 0 ? (
                <p className="text-base text-udem-black/65">Nadie ha votado todavía.</p>
              ) : (
                <ul className="max-w-4xl space-y-1">
                  {voters.map((v) => (
                    <li key={v.key} className="bg-white flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3">
                      <span className="font-bold text-base">{v.name}</span>
                      <span className="code text-[13px] text-udem-black/70 normal-case">{v.email}</span>
                      <button
                        type="button"
                        onClick={() => handleAnnul(v)}
                        className="code text-[13px] ml-auto underline underline-offset-4 hover:text-red-700 focus-visible:text-red-700 outline-none"
                      >
                        Anular sus votos
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Row>

            <Row label="Borrar votos">
              <p className="text-base md:text-[17px] leading-[1.6] text-udem-black/85 max-w-[62ch]">
                Elimina todos los votos de {CURRENT.label}. Los de ediciones anteriores no se tocan. No se puede deshacer.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="code text-[13px] md:text-sm mt-5 border-2 border-red-700 text-red-700 px-5 py-3 hover:bg-red-700 hover:text-white focus-visible:bg-red-700 focus-visible:text-white outline-none"
                style={ACTION_STYLE}
              >
                Borrar votos de {CURRENT.label}
              </button>
            </Row>
          </>
        )}
      </div>
    </Layout>
  )
}

function Fact({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col-reverse justify-end">
      <dt className={`${LABEL} mt-3`}>{label}</dt>
      <dd className="cond text-[13vw] sm:text-6xl lg:text-7xl tabular-nums whitespace-nowrap">
        <span className={accent ? 'bg-udem-yellow px-[0.08em] -ml-[0.08em]' : undefined}>{value}</span>
      </dd>
    </div>
  )
}

function Row({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="grid md:grid-cols-12 gap-x-8 gap-y-4 mt-14 md:mt-20">
      <div className="md:col-span-3">
        <h2 className={LABEL}>{label}</h2>
        {note && <p className="code text-[13px] text-udem-black/50 mt-1 tabular-nums">{note}</p>}
      </div>
      <div className="md:col-span-9">{children}</div>
    </section>
  )
}

interface ResultRow {
  id: string
  count: number
  name: string
  detail: string
}

function Results({ rows, empty }: { rows: ResultRow[]; empty: string }) {
  if (rows.length === 0) return <p className="text-base text-udem-black/65">{empty}</p>
  const total = rows.reduce((a, r) => a + r.count, 0)
  const top = rows[0].count
  return (
    <ol className="max-w-4xl space-y-1">
      {rows.map((r) => {
        const pct = total > 0 ? Math.round((r.count / total) * 100) : 0
        // Puede haber empate: todos los que igualan el máximo van marcados.
        const leading = r.count > 0 && r.count === top
        return (
          <li key={r.id} className="relative bg-white flex items-center gap-4 px-4 py-3 overflow-hidden">
            <span
              className={`absolute inset-y-0 left-0 ${leading ? 'bg-udem-yellow' : 'bg-udem-black/[0.07]'}`}
              style={{ width: `${pct}%`, transition: `width 600ms ${EASE}` }}
              aria-hidden
            />
            <div className="relative flex-1 min-w-0">
              <p className={`text-base leading-snug truncate ${leading ? 'font-bold' : ''}`}>{r.name}</p>
              <p className="text-sm text-udem-black/65 truncate">{r.detail}</p>
            </div>
            <p className="relative cond text-4xl tabular-nums shrink-0">{r.count}</p>
            <p className="relative code text-[13px] text-udem-black/70 tabular-nums w-10 text-right shrink-0">{pct}%</p>
          </li>
        )
      })}
    </ol>
  )
}
