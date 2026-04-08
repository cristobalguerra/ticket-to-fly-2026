import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA1m0QV_Ky9_5WXcgA_p8vc85edVkBWErE",
  authDomain: "ticket-to-fly-ead.firebaseapp.com",
  projectId: "ticket-to-fly-ead",
  storageBucket: "ticket-to-fly-ead.firebasestorage.app",
  messagingSenderId: "15945526072",
  appId: "1:15945526072:web:f2b7cbe19ea4beec3f2fcd",
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const db = getFirestore(app)
