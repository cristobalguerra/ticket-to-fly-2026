import {
  collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, where, serverTimestamp, updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Project, Career } from '../types'

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
    coverUrl,
    createdAt: serverTimestamp(),
  })

  return docRef.id
}

export async function getProjects(): Promise<Project[]> {
  const snap = await getDocs(query(col, orderBy('createdAt', 'asc')))
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
  })) as Project[]
}

export async function getProjectsByCareer(career: Career): Promise<Project[]> {
  const snap = await getDocs(
    query(col, where('career', '==', career)),
  )
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
  })) as Project[]
}

export async function updateProject(
  id: string,
  data: Partial<Pick<Project, 'career' | 'projectName' | 'teamName' | 'description'>>,
  imageFile?: File,
) {
  const updates: Record<string, unknown> = { ...data }
  if (imageFile) {
    updates.coverUrl = await resizeImage(imageFile)
  }
  await updateDoc(doc(db, 'projects', id), updates)
}

export async function deleteProject(id: string) {
  await deleteDoc(doc(db, 'projects', id))
}
