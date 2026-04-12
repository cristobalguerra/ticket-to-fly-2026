import { useState, useEffect } from 'react'
import { CAREERS, type Career, type Project } from '../types'
import { addProject, getProjects, deleteProject, updateProject } from '../lib/projects'
import Layout from '../components/Layout'
import PinGate from '../components/PinGate'
import { Trash2, ImagePlus, Loader2, Pencil, X } from 'lucide-react'

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

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    const p = await getProjects()
    setProjects(p)
  }

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

  function startEditing(p: Project) {
    setEditingId(p.id)
    setCareer(p.career)
    setProjectName(p.projectName)
    setTeamName(p.teamName)
    setDescription(p.description)
    setImageFile(null)
    setImagePreview(p.coverUrl || null)
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
        }, imageFile || undefined)
        setMsg('Proyecto actualizado')
        cancelEditing()
      } else {
        await addProject({ career, projectName: projectName.trim(), teamName: teamName.trim(), description: description.trim() }, imageFile!)
        setProjectName('')
        setTeamName('')
        setDescription('')
        setImageFile(null)
        setImagePreview(null)
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
    if (!confirm(`Eliminar "${p.projectName}"?`)) return
    await deleteProject(p.id)
    if (editingId === p.id) cancelEditing()
    await loadProjects()
  }

  return (
    <PinGate label="Subir Proyectos">
      <Layout showBack>
        <div className="max-w-lg mx-auto p-4 pb-8">
          <h1 className="text-2xl font-bold mt-4 mb-6">
            {editingId ? 'Editar Proyecto' : 'Subir Proyecto'}
          </h1>

          {editingId && (
            <button
              onClick={cancelEditing}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-udem-black mb-4 transition-colors"
            >
              <X className="w-4 h-4" /> Cancelar edición
            </button>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Carrera</label>
              <select
                value={career}
                onChange={(e) => setCareer(e.target.value as Career)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-udem-black/40 outline-none"
              >
                {CAREERS.map((c) => (
                  <option key={c.key} value={c.key}>{c.key} — {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Nombre del Proyecto</label>
              <input
                type="text"
                maxLength={100}
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-udem-black/40 outline-none"
                placeholder="Mi proyecto"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Alumno / Equipo</label>
              <input
                type="text"
                maxLength={150}
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-udem-black/40 outline-none"
                placeholder="Nombre del alumno o equipo"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Descripción ({description.length}/280)</label>
              <textarea
                maxLength={280}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-udem-black/40 outline-none resize-none h-24"
                placeholder="Breve descripción del proyecto"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Imagen de Cover {editingId && <span className="text-gray-400 font-normal">(opcional, deja vacío para mantener la actual)</span>}
              </label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-udem-black/30 transition-colors">
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

            {msg && (
              <p className={`text-sm font-medium ${msg.includes('Error') || msg.includes('debe') || msg.includes('Selecciona') || msg.includes('Ingresa') ? 'text-red-500' : 'text-green-600'}`}>
                {msg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-udem-black text-white font-bold py-3 rounded-xl hover:brightness-95 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Agregar Proyecto'}
            </button>
          </form>

          {/* Existing projects */}
          <div className="mt-10">
            <h2 className="text-lg font-bold mb-4">Proyectos Cargados ({projects.length})</h2>
            {projects.length === 0 && <p className="text-gray-400 text-sm">No hay proyectos aún.</p>}
            <div className="space-y-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border transition-colors ${
                    editingId === p.id ? 'border-udem-black' : 'border-gray-100'
                  }`}
                >
                  {p.coverUrl && (
                    <img src={p.coverUrl} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-udem-black">{p.career}</span>
                    <p className="font-semibold text-sm truncate">{p.projectName}</p>
                    <p className="text-xs text-gray-400 truncate">{p.teamName}</p>
                  </div>
                  <button
                    onClick={() => startEditing(p)}
                    className="p-2 text-gray-300 hover:text-udem-black transition-colors shrink-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors shrink-0"
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
