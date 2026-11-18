import { useState, useEffect, useRef } from 'react'
import { CAREERS, type Career, type Project } from '../types'
import { addProject, getProjects, deleteProject, updateProject, parseEditors, canEdit } from '../lib/projects'
import Layout from '../components/Layout'
import AuthGate from '../components/AuthGate'
import { useSession, signOut } from '../lib/auth'
import { useSearchParams } from 'react-router-dom'
import { ImagePlus, Loader2 } from 'lucide-react'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'
const LABEL = 'code text-[13px] md:text-sm text-udem-black/70'
const ACTION =
  'code text-[13px] md:text-sm bg-udem-black text-white px-5 py-3 hover:bg-udem-yellow hover:text-black focus-visible:bg-udem-yellow focus-visible:text-black outline-none'
const ACTION_STYLE = { transition: `background-color 160ms ${EASE_OUT}, color 160ms ${EASE_OUT}` }

export default function Upload() {
  // Solo administración puede borrar proyectos. Editar: administración o
  // quien tenga su correo en el proyecto.
  const { admin, user } = useSession()
  const email = (user?.email ?? '').toLowerCase()
  const [editors, setEditors] = useState('')
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

  const formRef = useRef<HTMLElement>(null)
  const [params, setParams] = useSearchParams()

  useEffect(() => { loadProjects() }, [])

  // Llegada desde el botón «Editar» del detalle de un proyecto: /upload?edit=ID
  const editParam = params.get('edit')
  useEffect(() => {
    if (!editParam || projects.length === 0) return
    const target = projects.find((p) => p.id === editParam)
    if (target && canEdit(target, email, admin)) startEditing(target)
    setParams({}, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editParam, projects, email, admin])

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

  function handleCareerChange(c: Career) {
    setCareer(c)
  }

  function startEditing(p: Project) {
    setEditingId(p.id)
    setCareer(p.career)
    setProjectName(p.projectName)
    setTeamName(p.teamName)
    setDescription(p.description)
    setImageFile(null)
    setImagePreview(p.coverUrl || null)
    setEditors((p.editors ?? []).join('\n'))
    setMsg('')
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function cancelEditing() {
    setEditingId(null)
    setCareer('LDG')
    setProjectName('')
    setTeamName('')
    setDescription('')
    setImageFile(null)
    setImagePreview(null)
    setEditors('')
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
          // Solo administración cambia quién puede editar.
          ...(admin ? { editors: parseEditors(editors) } : {}),
        }, imageFile || undefined)
        setMsg('Proyecto actualizado')
        cancelEditing()
      } else {
        await addProject({
          career,
          projectName: projectName.trim(),
          teamName: teamName.trim(),
          description: description.trim(),
          editors: admin ? parseEditors(editors) : [email],
        }, imageFile!)
        setProjectName('')
        setTeamName('')
        setDescription('')
        setImageFile(null)
        setImagePreview(null)
        setEditors('')
        setMsg('Proyecto agregado')
      }
      await loadProjects()
    } catch (err) {
      const denied = (err as { code?: string }).code === 'permission-denied'
      setMsg(denied ? 'Tu cuenta no tiene permiso para editar este proyecto' : 'Error al guardar el proyecto')
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

  // Solo se listan los proyectos que esta cuenta puede editar.
  const mine = projects.filter((p) => canEdit(p, email, admin))

  const inputBase = 'w-full border-2 border-gray-200 p-3 outline-none bg-white'
  const inputStyle = { transition: `border-color 200ms ${EASE_OUT}, box-shadow 200ms ${EASE_OUT}` }

  return (
    <AuthGate label="Subir proyecto">
      <Layout showBack>
        <div className="px-4 md:px-8 pb-20">
          <div className="pt-8 md:pt-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <h1 className="cond text-[15vw] sm:text-[7rem] md:text-[9rem] -ml-[0.015em]">Tu proyecto</h1>
            <p className="code text-[13px] md:text-[15px] leading-[1.7] pb-2 md:pb-4 md:text-right normal-case">
              <span className="uppercase">{admin ? 'Administración' : 'Sesión'}</span>
              <br />
              {email}
              <br />
              <button type="button" onClick={() => signOut()} className="uppercase underline underline-offset-4 hover:text-udem-black/60">
                Cambiar de cuenta
              </button>
            </p>
          </div>

          {/* Lo primero: los proyectos que esta cuenta puede editar */}
          <section className="grid md:grid-cols-12 gap-x-8 gap-y-4 mt-12 md:mt-16">
            <div className="md:col-span-3">
              <h2 className={LABEL}>{admin ? 'Todos los proyectos' : 'Proyectos que puedes editar'}</h2>
              <p className="code text-[13px] text-udem-black/50 mt-1 tabular-nums">{mine.length}</p>
            </div>
            <div className="md:col-span-9">
              {mine.length === 0 ? (
                <p className="text-base md:text-[17px] leading-[1.6] text-udem-black/85 max-w-[62ch]">
                  La cuenta <strong className="font-bold">{email}</strong> no está asignada a ningún proyecto. Si tu proyecto ya aparece en Proyectos, pide a coordinación que agregue tu correo; si todavía no existe, créalo abajo.
                </p>
              ) : (
                <ul className="max-w-4xl space-y-1">
                  {mine.map((p) => (
                    <li
                      key={p.id}
                      className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 ${editingId === p.id ? 'bg-udem-yellow' : 'bg-white'}`}
                    >
                      {p.coverUrl && <img src={p.coverUrl} alt="" className="w-14 h-14 object-cover shrink-0" />}
                      <div className="flex-1 min-w-[12rem]">
                        <p className="code text-[13px] text-udem-black/70">
                          {p.career}
                          {!p.coverUrl && <span className="ml-3">Sin imagen</span>}
                          {!p.description && <span className="ml-3">Sin descripción</span>}
                        </p>
                        <p className="font-bold text-base leading-snug mt-0.5">{p.projectName}</p>
                        <p className="text-sm text-udem-black/65">{p.teamName}</p>
                      </div>
                      <button type="button" onClick={() => startEditing(p)} className={ACTION} style={ACTION_STYLE}>
                        → Editar
                      </button>
                      {admin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(p)}
                          className="code text-[13px] underline underline-offset-4 hover:text-red-700 focus-visible:text-red-700 outline-none"
                        >
                          Borrar
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section ref={formRef} className="grid md:grid-cols-12 gap-x-8 gap-y-4 mt-14 md:mt-20 scroll-mt-20">
            <div className="md:col-span-3">
              <h2 className={LABEL}>{editingId ? 'Editando' : 'Proyecto nuevo'}</h2>
              {editingId && (
                <button type="button" onClick={cancelEditing} className="code text-[13px] underline underline-offset-4 mt-2">
                  Cancelar edición
                </button>
              )}
            </div>
            <div className="md:col-span-9 max-w-2xl">
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

            {admin && (
              <div className="stagger-in" data-i="4">
                <label className="block text-sm font-semibold mb-1" htmlFor="editors">
                  Correos que pueden editar <span className="text-gray-400 font-normal">(@udem.edu, uno por línea)</span>
                </label>
                <textarea
                  id="editors"
                  value={editors}
                  onChange={(e) => setEditors(e.target.value)}
                  className={`${inputBase} resize-none h-24 font-mono text-sm`}
                  style={inputStyle}
                  placeholder="nombre.apellido@udem.edu"
                  spellCheck={false}
                />
              </div>
            )}

            <div className="stagger-in" data-i="4">
              <label className="block text-sm font-semibold mb-1">
                Imagen de Cover {editingId && <span className="text-gray-400 font-normal">(opcional)</span>}
              </label>
              <label
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 cursor-pointer hover:border-udem-black/30 hover:bg-gray-50/50"
                style={{ transition: `border-color 200ms ${EASE_OUT}, background-color 200ms ${EASE_OUT}` }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-48 object-contain" />
                ) : (
                  <>
                    <ImagePlus className="w-10 h-10 text-gray-300 mb-2" />
                    <span className="text-sm text-gray-400">JPG o PNG, max 5MB</span>
                  </>
                )}
                <input type="file" accept="image/jpeg,image/png" onChange={handleImageChange} className="hidden" />
              </label>
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
              className="w-full bg-udem-black text-white font-bold py-3 disabled:opacity-40 flex items-center justify-center gap-2"
              style={{ transition: `transform 160ms ${EASE_OUT}, opacity 200ms ${EASE_OUT}, background-color 200ms ${EASE_OUT}` }}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Agregar Proyecto'}
            </button>
          </form>

            </div>
          </section>
        </div>
      </Layout>
    </AuthGate>
  )
}
