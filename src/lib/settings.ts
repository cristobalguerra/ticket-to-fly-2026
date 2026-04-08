import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const settingsRef = doc(db, 'settings', 'voting')

export async function isVotingOpen(): Promise<boolean> {
  const snap = await getDoc(settingsRef)
  if (!snap.exists()) return false
  return snap.data().votingOpen === true
}

export async function setVotingOpen(open: boolean) {
  await setDoc(settingsRef, { votingOpen: open, updatedAt: serverTimestamp() }, { merge: true })
}

export function onVotingStatusChange(callback: (open: boolean) => void) {
  return onSnapshot(settingsRef, (snap) => {
    callback(snap.exists() ? snap.data().votingOpen === true : false)
  })
}
