import {
  collection, addDoc, getDocs, query, where, serverTimestamp, writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Career, Vote } from '../types'

const col = collection(db, 'votes')

function normalize(name: string) {
  return name.trim().toLowerCase().replace(/\s+/g, ' ')
}

export async function hasAlreadyVoted(voterName: string): Promise<boolean> {
  const snap = await getDocs(
    query(col, where('voterName', '==', normalize(voterName))),
  )
  return !snap.empty
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
      createdAt: serverTimestamp(),
    }),
  )

  await Promise.all(promises)
}

export async function getVotes(): Promise<Vote[]> {
  const snap = await getDocs(col)
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.() ?? new Date(),
  })) as Vote[]
}

export async function resetAllVotes() {
  const snap = await getDocs(col)
  const batch = writeBatch(db)
  snap.docs.forEach((d) => batch.delete(d.ref))
  await batch.commit()
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
