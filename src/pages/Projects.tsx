import { useState, useEffect, useMemo } from 'react'
import { CAREERS, type Career, type Project } from '../types'
import { getProjects } from '../lib/projects'
import { CAREER_COLORS } from '../lib/floor-plan'
import Layout from '../components/Layout'
import { Loader2, X, MapPin, Users } from 'lucide-react'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

type Filter = Career | 'all'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [openProject, setOpenProject] = useState<Project | null>(null)

  useEffect(() => {
    getProjects()
      .then((p) => setProjects(p))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.career === filter)),
    [projects, filter],
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length }
    CAREERS.forEach((cr) => { c[cr.key] = projects.filter((p) => p.career === cr.key).length })
    return c
  }, [projects])

  return (
    <Layout showBack>
      <div className="max-w-6xl mx-auto p-4 pb-12">
        {/* Header */}
        <div className="mt-4 mb-6 stagger-in" data-i="0">
          <h1 className="text-3xl font-black tracking-tight">Proyectos</h1>
          <p className="text-udem-black/60 text-sm mt-2 max-w-xl">
            Conoce los proyectos antes del evento para emitir un voto informado.
            Filtra por programa para ver los proyectos de cada carrera.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="stagger-in flex flex-wrap gap-2 mb-6 sticky top-12 bg-gradient-to-b from-[#f0fdf4] to-[#f0fdf4]/95 backdrop-blur-sm py-2 z-20" data-i="1">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
            Todos <span className="text-gray-400 ml-1 tabular-nums">{counts.all}</span>
          </FilterButton>
          {CAREERS.map((c) => {
            const colors = CAREER_COLORS[c.key]
            return (
              <FilterButton key={c.key} active={filter === c.key} onClick={() => setFilter(c.key)}>
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: colors.fill, border: `1.5px solid ${colors.stroke}` }}
                />
                {c.key} <span className="text-gray-400 ml-0.5 tabular-nums">{counts[c.key] || 0}</span>
              </FilterButton>
            )
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">
            <p>Aún no hay proyectos en esta carrera.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <div key={p.id} className="stagger-in" data-i={Math.min(i, 7)}>
                <PreviewCard project={p} onClick={() => setOpenProject(p)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {openProject && (
        <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
      )}
    </Layout>
  )

  function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
          active ? 'border-udem-black bg-udem-black text-white' : 'border-gray-200 bg-white text-udem-black hover:border-gray-300'
        }`}
        style={{ transition: `background-color 200ms ${EASE_OUT}, border-color 200ms ${EASE_OUT}, color 200ms ${EASE_OUT}, transform 160ms ${EASE_OUT}` }}
      >
        {children}
      </button>
    )
  }
}

function PreviewCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const colors = CAREER_COLORS[project.career]
  return (
    <button
      type="button"
      onClick={onClick}
      className="project-card group relative w-full text-left bg-white rounded-2xl overflow-hidden border-2 border-transparent shadow-md shadow-black/5 cursor-pointer"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
        {project.coverUrl ? (
          <img src={project.coverUrl} alt={project.projectName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">?</div>
        )}
        <span
          className="absolute top-3 left-3 text-[10px] font-black px-2 py-0.5 rounded-full"
          style={{ background: colors.fill, color: colors.stroke, border: `1.5px solid ${colors.stroke}` }}
        >
          {colors.label}
        </span>
        {project.slotId && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-udem-black/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <MapPin className="w-2.5 h-2.5" /> {project.slotId}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-base leading-tight">{project.projectName}</h3>
        <p className="text-sm text-udem-black/50 mt-1 flex items-center gap-1">
          <Users className="w-3 h-3" /> {project.teamName}
        </p>
        {project.description && (
          <p className="text-sm text-udem-black/40 mt-2 line-clamp-2">{project.description}</p>
        )}
      </div>
    </button>
  )
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const colors = CAREER_COLORS[project.career]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
      style={{ animation: 'fadeIn 200ms cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
      <div
        className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 320ms cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        <div className="relative aspect-[4/3] bg-gray-100">
          {project.coverUrl ? (
            <img src={project.coverUrl} alt={project.projectName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-7xl">?</div>
          )}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white"
            style={{ transition: `background-color 180ms ${EASE_OUT}, transform 160ms ${EASE_OUT}` }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-full"
              style={{ background: colors.fill, color: colors.stroke, border: `1.5px solid ${colors.stroke}` }}
            >
              {colors.label}
            </span>
            {project.slotId && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-udem-black/60 bg-gray-100 px-2 py-0.5 rounded-full">
                <MapPin className="w-2.5 h-2.5" /> Lugar {project.slotId}
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black leading-tight">{project.projectName}</h2>
          <p className="text-udem-black/60 text-sm mt-2 flex items-center gap-1.5">
            <Users className="w-4 h-4" /> {project.teamName}
          </p>
          {project.description && (
            <p className="text-udem-black/75 text-sm mt-5 leading-relaxed">{project.description}</p>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  )
}
