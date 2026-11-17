import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CAREERS, type Career, type Project } from '../types'
import { getProjects } from '../lib/projects'
import { ARCHIVED, CURRENT, getEdition, type Edition } from '../lib/editions'
import Layout from '../components/Layout'
import { Loader2, X } from 'lucide-react'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

type Filter = Career | 'all'

/** Proyectos de la edición en curso. */
export default function Projects() {
  return <ProjectsView edition={CURRENT} />
}

/** Repositorio público de ediciones anteriores: /archivo y /archivo/PR26 */
export function Archive() {
  const { edition: key } = useParams()
  const edition = key ? getEdition(key) : ARCHIVED[0]
  if (!edition || edition.key === CURRENT.key) return <Navigate to="/projects" replace />
  return <ProjectsView key={edition.key} edition={edition} archived />
}

function ProjectsView({ edition, archived = false }: { edition: Edition; archived?: boolean }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [openProject, setOpenProject] = useState<Project | null>(null)

  useEffect(() => {
    let alive = true
    getProjects(edition)
      .then((p) => { if (alive) setProjects(p) })
      .catch((e) => { console.error(e); if (alive) setFailed(true) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [edition])

  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.career === filter)),
    [projects, filter],
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length }
    CAREERS.forEach((cr) => { c[cr.key] = projects.filter((p) => p.career === cr.key).length })
    return c
  }, [projects])

  const careers = CAREERS.filter((c) => counts[c.key] > 0)

  return (
    <Layout showBack>
      <div className="px-4 md:px-8 pb-16">
        <div className="pt-8 md:pt-10 stagger-in flex flex-wrap items-end justify-between gap-x-8 gap-y-3" data-i="0">
          <h1 className="cond text-[22vw] sm:text-[8.5rem] md:text-[11rem] -ml-[0.015em]">
            {archived ? 'Archivo' : 'Proyectos'}
          </h1>
          <div className="code text-[13px] md:text-sm leading-[1.7] pb-2 md:pb-4 md:text-right">
            <p>{edition.label}</p>
            {archived && edition.event.day && <p className="text-udem-black/60">{edition.event.day}</p>}
            {archived && ARCHIVED.length > 1 && (
              <p className="mt-2 flex flex-wrap gap-x-4 md:justify-end">
                {ARCHIVED.filter((e) => e.key !== edition.key).map((e) => (
                  <Link key={e.key} to={`/archivo/${e.key}`} className="underline underline-offset-4">
                    {e.label}
                  </Link>
                ))}
              </p>
            )}
          </div>
        </div>

        {!loading && projects.length > 0 && (
          <div
            className="stagger-in flex flex-wrap gap-x-1 gap-y-1 mt-6 mb-6 sticky top-14 bg-paper py-3 z-20 -mx-4 px-4 md:-mx-8 md:px-8"
            data-i="1"
          >
            <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="Todos" count={counts.all} />
            {careers.map((c) => (
              <FilterButton
                key={c.key}
                active={filter === c.key}
                onClick={() => setFilter(c.key)}
                label={c.key}
                title={c.name}
                count={counts[c.key]}
              />
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-7 h-7 animate-spin text-udem-black/40" />
          </div>
        ) : failed ? (
          <p className="py-24 text-udem-black/70">No se pudieron cargar los proyectos. Recarga la página.</p>
        ) : projects.length === 0 ? (
          <div className="py-20 max-w-md">
            <p className="text-lg font-bold leading-snug">Todavía no hay proyectos de {edition.label}.</p>
            {!archived && ARCHIVED[0] && (
              <Link
                to={`/archivo/${ARCHIVED[0].key}`}
                className="code text-[13px] md:text-sm inline-block mt-5 bg-udem-black text-white px-4 py-3 hover:bg-udem-yellow hover:text-black"
                style={{ transition: `background-color 160ms ${EASE_OUT}, color 160ms ${EASE_OUT}` }}
              >
                → Archivo {ARCHIVED[0].label}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10">
            {filtered.map((p, i) => (
              <div key={p.id} className="stagger-in" data-i={Math.min(i, 7)}>
                <PreviewCard project={p} showSlot={!archived} onClick={() => setOpenProject(p)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {openProject && (
        <ProjectModal project={openProject} showSlot={!archived} onClose={() => setOpenProject(null)} />
      )}
    </Layout>
  )
}

function FilterButton({
  active, onClick, label, title, count,
}: { active: boolean; onClick: () => void; label: string; title?: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={`code text-[13px] md:text-sm px-3 py-2 flex items-baseline gap-2 ${
        active ? 'bg-udem-black text-udem-yellow' : 'text-udem-black hover:bg-udem-black/10'
      }`}
      style={{ transition: `background-color 160ms ${EASE_OUT}, color 160ms ${EASE_OUT}` }}
    >
      {label}
      <span className={`tabular-nums ${active ? 'text-white/70' : 'text-udem-black/65'}`}>{count}</span>
    </button>
  )
}

function Meta({ project, showSlot }: { project: Project; showSlot: boolean }) {
  return (
    <p className="code text-[13px] md:text-sm text-udem-black/60 flex gap-3">
      <span>{project.career}</span>
      {showSlot && project.slotId && <span>Lugar {project.slotId}</span>}
    </p>
  )
}

function PreviewCard({ project, showSlot, onClick }: { project: Project; showSlot: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="group w-full text-left cursor-pointer outline-none">
      <div className="aspect-[4/3] overflow-hidden bg-black/5 outline-offset-4 group-focus-visible:outline-2 group-focus-visible:outline-udem-black">
        {project.coverUrl && (
          <img
            src={project.coverUrl}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03]"
            style={{ transition: `transform 500ms ${EASE_OUT}` }}
          />
        )}
      </div>
      <div className="pt-3">
        <Meta project={project} showSlot={showSlot} />
        <h3 className="font-bold text-lg leading-[1.15] mt-1.5 group-hover:underline underline-offset-4 decoration-2">
          {project.projectName}
        </h3>
        <p className="text-sm text-udem-black/65 mt-1">{project.teamName}</p>
      </div>
    </button>
  )
}

function ProjectModal({ project, showSlot, onClose }: { project: Project; showSlot: boolean; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal((
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
      style={{ animation: 'fadeIn 200ms cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={project.projectName}
        className="bg-paper max-w-3xl w-full max-h-[92dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 320ms cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        <div className="relative bg-black/5">
          {project.coverUrl && (
            <img src={project.coverUrl} alt={project.projectName} className="w-full h-auto block" />
          )}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            autoFocus
            className="absolute top-0 right-0 w-11 h-11 bg-udem-black text-white flex items-center justify-center hover:bg-udem-yellow hover:text-black focus-visible:bg-udem-yellow focus-visible:text-black"
            style={{ transition: `background-color 160ms ${EASE_OUT}, color 160ms ${EASE_OUT}` }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 sm:p-8">
          <Meta project={project} showSlot={showSlot} />
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-[1.05] tracking-tight mt-3">{project.projectName}</h2>
          <p className="text-udem-black/70 mt-3">{project.teamName}</p>
          {project.description && (
            <p className="text-udem-black/85 mt-6 leading-relaxed max-w-[62ch]">{project.description}</p>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  ), document.body)
}
