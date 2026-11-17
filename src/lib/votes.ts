import {
  collection, addDoc, getDocs, query, where, serverTimestamp, writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Career, Vote } from '../types'
import { CURRENT, inEdition, type Edition } from './editions'

const col = collection(db, 'votes')

function normalize(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

// Un profesor que votó en una edición pasada puede votar en la actual.
export async function hasAlreadyVoted(voterName: string): Promise<boolean> {
  const snap = await getDocs(
    query(col, where('voterName', '==', normalize(voterName))),
  )
  return snap.docs.some((d) => {
    const at: Date | undefined = d.data().createdAt?.toDate?.()
    return at ? inEdition(at, CURRENT) : true
  })
}

export async function submitAllVotes(
  voterName: string,
  careerVotes: Record<Career, string>,
  generalVoteProjectId: string,
) {
  const normalized = normalize(voterName)

  const already = await hasAlreadyVoted(voterName)
  if (already) throw new Error('Ya has votado.')

  const promises: Promise<unknown>[] = []

  for (const [career, projectId] of Object.entries(careerVotes)) {
    promises.push(
      addDoc(col, {
        voterName: normalized,
        career,
        projectId,
        voteType: 'career',
        edition: CURRENT.key,
        createdAt: serverTimestamp(),
      }),
    )
  }

  promises.push(
    addDoc(col, {
      voterName: normalized,
      career: 'general',
      projectId: generalVoteProjectId,
      voteType: 'general',
      edition: CURRENT.key,
      createdAt: serverTimestamp(),
    }),
  )

  await Promise.all(promises)
}

function editionQuery(edition: Edition) {
  const bounds = [where('createdAt', '>=', edition.from)]
  if (edition.to) bounds.push(where('createdAt', '<', edition.to))
  return query(col, ...bounds)
}

export async function getVotes(edition: Edition = CURRENT): Promise<Vote[]> {
  const snap = await getDocs(editionQuery(edition))
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
  })) as Vote[]
}

// Borra únicamente los votos de la edición en curso. Los de ediciones
// anteriores quedan intactos.
export async function resetAllVotes() {
  const snap = await getDocs(editionQuery(CURRENT))
  for (let i = 0; i < snap.docs.length; i += 400) {
    const batch = writeBatch(db)
    snap.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref))
    await batch.commit()
  }
}

export function tallyVotes(votes: Vote[], _projectsMap: Map<string, { projectName: string; career: Career }>) {
  const careerTallies: Record<string, Record<string, number>> = {}
  const generalTally: Record<string, number> = {}
  const voters = new Set<string>()

  for (const v of votes) {
    voters.add(v.voterName)
    if (v.voteType === 'career') {
      if (!careerTallies[v.career]) careerTallies[v.career] = {}
      careerTallies[v.career][v.projectId] = (careerTallies[v.career][v.projectId] || 0) + 1
    } else {
      generalTally[v.projectId] = (generalTally[v.projectId] || 0) + 1
    }
  }

  return { careerTallies, generalTally, totalVoters: voters.size }
}
