import {
  collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, where, serverTimestamp, updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Project, Career } from '../types'
import { CURRENT, type Edition } from './editions'

const col = collection(db, 'projects')

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function resizeImage(file: File, maxWidth = 800): Promise<string> {
  const base64 = await fileToBase64(file)
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      let w = img.width
      let h = img.height
      if (w > maxWidth) {
        h = (h * maxWidth) / w
        w = maxWidth
      }
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    }
    img.src = base64
  })
}

export async function addProject(
  data: Omit<Project, 'id' | 'coverUrl' | 'createdAt'>,
  imageFile: File,
): Promise<string> {
  const coverUrl = await resizeImage(imageFile)

  const docRef = await addDoc(col, {
    career: data.career,
    projectName: data.projectName,
    teamName: data.teamName,
    description: data.description,
    slotId: data.slotId ?? null,
    coverUrl,
    edition: CURRENT.key,
    createdAt: serverTimestamp(),
  })

  byCareerCache = null
  return docRef.id
}

// Los proyectos de cada edición se separan por fecha de creación, sin migrar
// ni modificar documentos de semestres anteriores.
export async function getProjects(edition: Edition = CURRENT): Promise<Project[]> {
  const bounds = [where('createdAt', '>=', edition.from)]
  if (edition.to) bounds.push(where('createdAt', '<', edition.to))

  const snap = await getDocs(query(col, ...bounds, orderBy('createdAt', 'asc')))
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
  })) as Project[]
}

// La votación pide los proyectos carrera por carrera; se descarga la edición
// una sola vez y se reparte en memoria.
let byCareerCache: { key: string; at: number; promise: Promise<Project[]> } | null = null

export async function getProjectsByCareer(career: Career, edition: Edition = CURRENT): Promise<Project[]> {
  if (!byCareerCache || byCareerCache.key !== edition.key || Date.now() - byCareerCache.at > 60_000) {
    const promise = getProjects(edition)
    promise.catch(() => { byCareerCache = null })
    byCareerCache = { key: edition.key, at: Date.now(), promise }
  }
  return (await byCareerCache.promise).filter((p) => p.career === career)
}

export async function updateProject(
  id: string,
  data: Partial<Pick<Project, 'career' | 'projectName' | 'teamName' | 'description' | 'slotId'>>,
  imageFile?: File,
) {
  const updates: Record<string, unknown> = { ...data }
  if (imageFile) {
    updates.coverUrl = await resizeImage(imageFile)
  }
  await updateDoc(doc(db, 'projects', id), updates)
  byCareerCache = null
}

export async function deleteProject(id: string) {
  await deleteDoc(doc(db, 'projects', id))
  byCareerCache = null
}
