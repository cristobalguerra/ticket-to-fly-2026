import { useState, useEffect, useMemo } from 'react'
import { CAREERS, type Career, type Project } from '../types'
import { addProject, getProjects, deleteProject, updateProject } from '../lib/projects'
import { SLOTS, getSlotById } from '../lib/floor-plan'
import Layout from '../components/Layout'
import PinGate from '../components/PinGate'
import FloorMap from '../components/FloorMap'
import { Trash2, ImagePlus, Loader2, Pencil, X, MapPin, AlertCircle } from 'lucide-react'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

export default function Upload() {
  const [career, setCareer] = useState<Career>('LDG')
  const [projectName, setProjectName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [msg, setMsg] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [slotId, setSlotId] = useState<string | null>(null)

  useEffect(() => { loadProjects() }, [])

  async function loadProjects() {
    const p = await getProjects()
    setProjects(p)
  }

  // Slots already taken (excluding the project being edited)
  const takenSlotIds = useMemo(() => {
    const taken = new Set<string>()
    projects.forEach((p) => {
      if (p.slotId && p.id !== editingId) taken.add(p.slotId)
    })
    return taken
  }, [projects, editingId])

  // Available slot count for current career
  const careerSlotsTotal = useMemo(() => SLOTS.filter((s) => s.career === career).length, [career])
  const careerSlotsTaken = useMemo(
    () => SLOTS.filter((s) => s.career === career && takenSlotIds.has(s.id)).length,
    [career, takenSlotIds],
  )
  const careerFull = careerSlotsTotal > 0 && careerSlotsTaken >= careerSlotsTotal

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setMsg('La imagen debe ser menor a 5MB')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleCareerChange(c: Career) {
    setCareer(c)
    // Clear slot if it doesn't belong to the new career
    if (slotId) {
      const slot = getSlotById(slotId)
      if (slot && slot.career !== c) setSlotId(null)
    }
  }

  function startEditing(p: Project) {
    setEditingId(p.id)
    setCareer(p.career)
    setProjectName(p.projectName)
    setTeamName(p.teamName)
    setDescription(p.description)
    setImageFile(null)
    setImagePreview(p.coverUrl || null)
    setSlotId(p.slotId ?? null)
    setMsg('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEditing() {
    setEditingId(null)
    setCareer('LDG')
    setProjectName('')
    setTeamName('')
    setDescription('')
    setImageFile(null)
    setImagePreview(null)
    setSlotId(null)
    setMsg('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId && !imageFile) { setMsg('Selecciona una imagen'); return }
    if (!projectName.trim()) { setMsg('Ingresa el nombre del proyecto'); return }

    setLoading(true)
    setMsg('')
    try {
      if (editingId) {
        await updateProject(editingId, {
          career,
          projectName: projectName.trim(),
          teamName: teamName.trim(),
          description: description.trim(),
          slotId: slotId ?? undefined,
        }, imageFile || undefined)
        setMsg('Proyecto actualizado')
        cancelEditing()
      } else {
        await addProject({
          career,
          projectName: projectName.trim(),
          teamName: teamName.trim(),
          description: description.trim(),
          slotId: slotId ?? undefined,
        }, imageFile!)
        setProjectName('')
        setTeamName('')
        setDescription('')
        setImageFile(null)
        setImagePreview(null)
        setSlotId(null)
        setMsg('Proyecto agregado')
      }
      await loadProjects()
    } catch (err) {
      setMsg('Error al guardar el proyecto')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(p: Project) {
    if (!confirm(`¿Eliminar "${p.projectName}"?`)) return
    await deleteProject(p.id)
    if (editingId === p.id) cancelEditing()
    await loadProjects()
  }

  const inputBase = 'w-full border-2 border-gray-200 rounded-xl p-3 outline-none bg-white'
  const inputStyle = { transition: `border-color 200ms ${EASE_OUT}, box-shadow 200ms ${EASE_OUT}` }

  return (
    <PinGate label="Subir Proyectos">
      <Layout showBack>
        <div className="max-w-2xl mx-auto p-4 pb-8">
          <div className="flex items-center justify-between mt-4 mb-6">
            <h1 className="text-2xl font-bold">
              {editingId ? 'Editar Proyecto' : 'Subir Proyecto'}
            </h1>
            <button
              onClick={cancelEditing}
              className={`flex items-center gap-1 text-sm text-gray-500 hover:text-udem-black overflow-hidden ${
                editingId ? 'opacity-100 max-w-[140px]' : 'opacity-0 max-w-0 pointer-events-none'
              }`}
              style={{ transition: `opacity 200ms ${EASE_OUT}, max-width 280ms ${EASE_OUT}, color 180ms ${EASE_OUT}` }}
            >
              <X className="w-4 h-4 shrink-0" /> Cancelar edición
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="stagger-in" data-i="0">
              <label className="block text-sm font-semibold mb-1">Carrera</label>
              <select
                value={career}
                onChange={(e) => handleCareerChange(e.target.value as Career)}
                className={inputBase}
                style={inputStyle}
              >
                {CAREERS.map((c) => (
                  <option key={c.key} value={c.key}>{c.key} — {c.name}</option>
                ))}
              </select>
            </div>

            <div className="stagger-in" data-i="1">
              <label className="block text-sm font-semibold mb-1">Nombre del Proyecto</label>
              <input
                type="text"
                maxLength={100}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className={inputBase}
                style={inputStyle}
                placeholder="Mi proyecto"
              />
            </div>

            <div className="stagger-in" data-i="2">
              <label className="block text-sm font-semibold mb-1">Alumno / Equipo</label>
              <input
                type="text"
                maxLength={150}
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className={inputBase}
                style={inputStyle}
                placeholder="Nombre del alumno o equipo"
              />
            </div>

            <div className="stagger-in" data-i="3">
              <label className="block text-sm font-semibold mb-1">
                Descripción <span className="text-gray-400 font-normal tabular-nums">({description.length}/280)</span>
              </label>
              <textarea
                maxLength={280}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputBase} resize-none h-24`}
                style={inputStyle}
                placeholder="Breve descripción del proyecto"
              />
            </div>

            <div className="stagger-in" data-i="4">
              <label className="block text-sm font-semibold mb-1">
                Imagen de Cover {editingId && <span className="text-gray-400 font-normal">(opcional)</span>}
              </label>
              <label
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-udem-black/30 hover:bg-gray-50/50"
                style={{ transition: `border-color 200ms ${EASE_OUT}, background-color 200ms ${EASE_OUT}` }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
                ) : (
                  <>
                    <ImagePlus className="w-10 h-10 text-gray-300 mb-2" />
                    <span className="text-sm text-gray-400">JPG o PNG, max 5MB</span>
                  </>
                )}
                <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            {/* ─── Floor plan slot selector ─── */}
            <div className="stagger-in" data-i="5">
              <div className="flex items-baseline justify-between mb-1">
                <label className="block text-sm font-semibold">
                  <MapPin className="inline w-4 h-4 mb-0.5 mr-1" />
                  Lugar en el plano
                </label>
                <span className="text-xs text-gray-400 tabular-nums">
                  {careerSlotsTaken}/{careerSlotsTotal} ocupados
                </span>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-3" style={inputStyle}>
                {careerFull && !slotId ? (
                  <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-orange-800">Carrera llena</p>
                      <p className="text-xs text-orange-700 mt-0.5">
                        Todos los lugares para esta carrera están ocupados. Puedes registrar el proyecto sin lugar y el admin lo asignará después.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mb-3 text-center">
                    {slotId
                      ? <>Lugar seleccionado: <strong className="text-udem-black">{slotId}</strong></>
                      : 'Toca un lugar disponible en el plano para asignarlo'}
                  </p>
                )}

                <FloorMap
                  projects={projects.filter((p) => p.id !== editingId)}
                  selectedSlotId={slotId}
                  filterCareer={career}
                  takenSlotIds={takenSlotIds}
                  onSlotClick={(s) => setSlotId(s.id === slotId ? null : s.id)}
                  showLegend={false}
                  showLabels={true}
                />

                {slotId && (
                  <button
                    type="button"
                    onClick={() => setSlotId(null)}
                    className="mt-2 text-xs text-gray-500 hover:text-udem-black flex items-center gap-1 mx-auto"
                  >
                    <X className="w-3 h-3" /> Quitar lugar
                  </button>
                )}
              </div>
            </div>

            <p
              aria-live="polite"
              className={`text-sm font-medium overflow-hidden ${
                msg ? 'max-h-6 opacity-100' : 'max-h-0 opacity-0'
              } ${msg.includes('Error') || msg.includes('debe') || msg.includes('Selecciona') || msg.includes('Ingresa') ? 'text-red-500' : 'text-green-600'}`}
              style={{ transition: `max-height 220ms ${EASE_OUT}, opacity 180ms ${EASE_OUT}` }}
            >
              {msg || ' '}
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-udem-black text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-40 flex items-center justify-center gap-2"
              style={{ transition: `transform 160ms ${EASE_OUT}, opacity 200ms ${EASE_OUT}, background-color 200ms ${EASE_OUT}` }}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Agregar Proyecto'}
            </button>
          </form>

          <div className="mt-10">
            <h2 className="text-lg font-bold mb-4">
              Proyectos Cargados <span className="text-gray-400 tabular-nums">({projects.length})</span>
            </h2>
            {projects.length === 0 && <p className="text-gray-400 text-sm">No hay proyectos aún.</p>}
            <div className="space-y-3">
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  className={`stagger-in flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border ${
                    editingId === p.id ? 'border-udem-black' : 'border-gray-100'
                  }`}
                  style={{ transition: `border-color 200ms ${EASE_OUT}, box-shadow 200ms ${EASE_OUT}` }}
                  data-i={Math.min(i, 7)}
                >
                  {p.coverUrl && (
                    <img src={p.coverUrl} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-udem-black">{p.career}</span>
                      {p.slotId && (
                        <span className="text-[10px] font-semibold text-udem-black/60 bg-gray-100 px-1.5 py-0.5 rounded tabular-nums flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" /> {p.slotId}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-sm truncate">{p.projectName}</p>
                    <p className="text-xs text-gray-400 truncate">{p.teamName}</p>
                  </div>
                  <button
                    onClick={() => startEditing(p)}
                    aria-label="Editar"
                    className="p-2 text-gray-300 hover:text-udem-black shrink-0"
                    style={{ transition: `color 180ms ${EASE_OUT}, transform 160ms ${EASE_OUT}` }}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    aria-label="Eliminar"
                    className="p-2 text-gray-300 hover:text-red-500 shrink-0"
                    style={{ transition: `color 180ms ${EASE_OUT}, transform 160ms ${EASE_OUT}` }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </PinGate>
  )
}
