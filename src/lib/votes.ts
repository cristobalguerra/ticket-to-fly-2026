import {
  collection, doc, getDoc, getDocs, query, where, serverTimestamp, writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Career, Vote } from '../types'
import { CURRENT, type Edition } from './editions'

const col = collection(db, 'votes')

export interface Voter {
  uid: string
  name: string
  email: string
}

// Un documento por cuenta y categoría, con id fijo: así una misma cuenta no
// puede votar dos veces en la misma edición (las reglas impiden sobrescribir).
function voteRef(uid: string, category: string) {
  return doc(db, 'votes', `${CURRENT.key}_${uid}_${category}`)
}

export async function hasAlreadyVoted(uid: string): Promise<boolean> {
  const snap = await getDoc(voteRef(uid, 'general'))
  return snap.exists()
}

export async function submitAllVotes(
  voter: Voter,
  careerVotes: Partial<Record<Career, string>>,
  generalVoteProjectId: string,
) {
  if (await hasAlreadyVoted(voter.uid)) throw new Error('Ya has votado.')

  const base = {
    voterUid: voter.uid,
    voterName: voter.name,
    voterEmail: voter.email,
    edition: CURRENT.key,
    createdAt: serverTimestamp(),
  }
  const batch = writeBatch(db)
  for (const [career, projectId] of Object.entries(careerVotes)) {
    batch.set(voteRef(voter.uid, career), { ...base, career, projectId, voteType: 'career' })
  }
  batch.set(voteRef(voter.uid, 'general'), { ...base, career: 'general', projectId: generalVoteProjectId, voteType: 'general' })
  await batch.commit()
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
    voters.add(v.voterUid ?? v.voterName)
    if (v.voteType === 'career') {
      if (!careerTallies[v.career]) careerTallies[v.career] = {}
      careerTallies[v.career][v.projectId] = (careerTallies[v.career][v.projectId] || 0) + 1
    } else {
      generalTally[v.projectId] = (generalTally[v.projectId] || 0) + 1
    }
  }

  return { careerTallies, generalTally, totalVoters: voters.size }
}
