import { useEffect, useMemo, useState } from 'react'
import { CAREERS, type Project } from '../types'
import { getProjects } from '../lib/projects'
import { CURRENT } from '../lib/editions'
import { CAREER_COLORS, SLOTS } from '../lib/floor-plan'
import Layout from '../components/Layout'
import PinGate from '../components/PinGate'
import FloorMap from '../components/FloorMap'
import { Printer, MapPin, Loader2 } from 'lucide-react'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

export default function Distribution() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProjects()
      .then((p) => setProjects(p))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [])

  // Build slot.id → display number (1-indexed per career, same logic as FloorMap)
  const numberMap = useMemo(() => {
    const map = new Map<string, number>()
    const byCareer: Record<string, typeof SLOTS> = {}
    SLOTS.forEach((s) => {
      if (!byCareer[s.career]) byCareer[s.career] = []
      byCareer[s.career].push(s)
    })
    Object.values(byCareer).forEach((arr) => {
      arr.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
      arr.forEach((s, i) => map.set(s.id, i + 1))
    })
    return map
  }, [])

  const projectsBySlot = useMemo(() => {
    const map = new Map<string, Project>()
    projects.forEach((p) => { if (p.slotId) map.set(p.slotId, p) })
    return map
  }, [projects])

  const projectsByCareer = useMemo(() => {
    return CAREERS.map((c) => {
      const careerSlots = SLOTS.filter((s) => s.career === c.key).sort((a, b) =>
        a.id.localeCompare(b.id, undefined, { numeric: true }),
      )
      const rows = careerSlots.map((s) => ({
        slotId: s.id,
        number: numberMap.get(s.id) ?? 0,
        project: projectsBySlot.get(s.id),
      }))
      return { ...c, rows, total: careerSlots.length, taken: rows.filter((r) => r.project).length }
    }).filter((c) => c.total > 0)
  }, [projectsBySlot, numberMap])

  if (loading) {
    return (
      <Layout showBack>
        <div className="flex items-center justify-center min-h-[60dvh]">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </Layout>
    )
  }

  return (
    <PinGate label="Distribución del Evento" pin="3000">
      <Layout showBack showFooter={false}>
        <div className="max-w-5xl mx-auto p-4 pb-8 distribution-print">
          {/* Header */}
          <div className="flex items-start justify-between mt-4 mb-6 no-print">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Distribución</h1>
              <p className="text-udem-black/60 text-sm mt-1">
                Plano del evento con los lugares numerados y los proyectos asignados.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 bg-udem-black text-white font-bold text-sm shadow-lg"
              style={{ transition: `transform 160ms ${EASE_OUT}` }}
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
          </div>

          {/* Print-only title */}
          <div className="hidden print-only mb-4">
            <h1 className="text-2xl font-black">Ticket to Fly {CURRENT.label} — Distribución del Evento</h1>
            <p className="text-xs text-gray-600 mt-1">{CURRENT.event.day ? `${CURRENT.event.day} · ` : ''}6to piso, Centro Roberto Garza Sada · UDEM</p>
          </div>

          {/* Map */}
          <div className="bg-white border border-gray-100 p-4 mb-6 print-card">
            <h2 className="font-bold text-sm flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4" /> Plano
              <span className="text-gray-400 text-xs ml-auto tabular-nums">
                {projects.filter((p) => p.slotId).length}/{SLOTS.length} ocupados
              </span>
            </h2>
            <FloorMap
              projects={projects}
              showLegend={true}
              showLabels={true}
              showSlotNumbers={true}
            />
          </div>

          {/* Project lists by career */}
          <div className="grid gap-4 sm:grid-cols-2">
            {projectsByCareer.map((c) => {
              const colors = CAREER_COLORS[c.key]
              return (
                <section key={c.key} className="bg-white border border-gray-100 p-4 print-card break-inside-avoid">
                  <header className="flex items-center gap-2 mb-3">
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full"
                      style={{ background: colors.fill, color: colors.stroke, border: `1.5px solid ${colors.stroke}` }}
                    >
                      {colors.label}
                    </span>
                    <span className="font-bold text-sm">{c.name}</span>
                    <span className="text-gray-400 text-xs ml-auto tabular-nums">
                      {c.taken}/{c.total}
                    </span>
                  </header>
                  <ol className="space-y-1.5">
                    {c.rows.map((row) => (
                      <li key={row.slotId} className="flex items-start gap-2.5 text-sm">
                        <span
                          className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-md font-black text-[11px] tabular-nums"
                          style={{ background: colors.fill, color: colors.stroke, border: `1px solid ${colors.stroke}` }}
                        >
                          {row.number}
                        </span>
                        <div className="flex-1 min-w-0 pt-0.5">
                          {row.project ? (
                            <>
                              <p className="font-semibold leading-tight truncate">{row.project.projectName}</p>
                              <p className="text-xs text-gray-500 truncate">{row.project.teamName}</p>
                            </>
                          ) : (
                            <p className="text-gray-400 italic text-xs pt-0.5">Sin asignar</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              )
            })}
          </div>
        </div>

        {/* Print styles */}
        <style>{`
          .print-only { display: none; }
          @media print {
            @page { size: A4 landscape; margin: 12mm; }
            html, body { background: white !important; }
            .no-print, header, footer { display: none !important; }
            .print-only { display: block !important; }
            .distribution-print { padding: 0 !important; max-width: 100% !important; }
            .print-card { box-shadow: none !important; border-color: #ddd !important; break-inside: avoid; }
          }
        `}</style>
      </Layout>
    </PinGate>
  )
}
