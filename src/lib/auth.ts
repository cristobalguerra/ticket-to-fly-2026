import { useEffect, useState } from 'react'
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged, type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { app, db } from '../firebase'

export const auth = getAuth(app)
export const DOMAIN = 'udem.edu'

export function isUdem(user: User | null): user is User {
  return !!user && user.emailVerified && (user.email ?? '').toLowerCase().endsWith(`@${DOMAIN}`)
}

/** Abre la ventana de Google. Solo acepta cuentas institucionales. */
export async function signIn(): Promise<User> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ hd: DOMAIN, prompt: 'select_account' })
  const { user } = await signInWithPopup(auth, provider)
  if (!isUdem(user)) {
    await fbSignOut(auth)
    throw new Error(`Entra con tu cuenta @${DOMAIN}.`)
  }
  return user
}

export function signOut() {
  return fbSignOut(auth)
}

/** Los administradores se dan de alta en Firestore: colección `admins`, id = correo. */
export async function checkAdmin(user: User): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, 'admins', (user.email ?? '').toLowerCase()))
    return snap.exists()
  } catch {
    return false
  }
}

export interface Session {
  user: User | null
  admin: boolean
  loading: boolean
}

export function useSession(): Session {
  const [session, setSession] = useState<Session>({ user: null, admin: false, loading: true })

  useEffect(
    () =>
      onAuthStateChanged(auth, async (u) => {
        if (!isUdem(u)) {
          setSession({ user: null, admin: false, loading: false })
          return
        }
        const admin = await checkAdmin(u)
        setSession({ user: u, admin, loading: false })
      }),
    [],
  )

  return session
}
