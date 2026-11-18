import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import Layout from './Layout'
import { signIn, signOut, useSession, DOMAIN } from '../lib/auth'

interface Props {
  children: React.ReactNode
  label: string
  /** Exige además que la cuenta esté dada de alta como administradora. */
  admin?: boolean
}

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)'
const BUTTON =
  'code text-[13px] md:text-sm bg-udem-black text-white px-5 py-3.5 hover:bg-udem-yellow hover:text-black focus-visible:bg-udem-yellow focus-visible:text-black outline-none disabled:opacity-50'

export default function AuthGate({ children, label, admin = false }: Props) {
  const session = useSession()

  // Solo en desarrollo local: ?nogate permite revisar el diseño sin iniciar
  // sesión. No existe en el build publicado, y las reglas de la base siguen
  // siendo las que protegen los datos.
  if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('nogate')) return <>{children}</>

  if (!session.loading && session.user && (!admin || session.admin)) return <>{children}</>

  return (
    <Layout showBack showFooter={false}>
      <div className="px-4 md:px-8 pt-10 md:pt-14 pb-16 max-w-xl">
        <h1 className="cond text-6xl md:text-7xl -ml-[0.015em]">{label}</h1>
        {session.loading ? (
          <Loader2 className="w-6 h-6 animate-spin text-udem-black/40 mt-8" />
        ) : session.user ? (
          <Denied email={session.user.email ?? ''} />
        ) : (
          <SignInPanel />
        )}
      </div>
    </Layout>
  )
}

export function SignInPanel() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handle() {
    setBusy(true)
    setError('')
    try {
      await signIn()
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') setError('')
      else if (code === 'auth/popup-blocked') setError('El navegador bloqueó la ventana de Google. Permite ventanas emergentes e intenta de nuevo.')
      else if (code.startsWith('auth/')) setError('No se pudo iniciar sesión. Abre el sitio en Chrome o Safari e intenta de nuevo.')
      else setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-8">
      <p className="text-[15px] leading-[1.6] text-udem-black/85 max-w-[46ch]">
        Entra con tu cuenta institucional @{DOMAIN}.
      </p>
      <button type="button" onClick={handle} disabled={busy} className={`${BUTTON} mt-6`} style={{ transition: `background-color 160ms ${EASE}, color 160ms ${EASE}` }}>
        {busy ? 'Abriendo Google…' : '→ Entrar con Google'}
      </button>
      <p aria-live="polite" className="text-sm text-red-700 mt-4 min-h-5">{error}</p>
    </div>
  )
}

function Denied({ email }: { email: string }) {
  return (
    <div className="mt-8">
      <p className="text-[15px] leading-[1.6] text-udem-black/85 max-w-[46ch]">
        La cuenta <strong className="font-bold">{email}</strong> no tiene permisos de administración.
      </p>
      <button type="button" onClick={() => signOut()} className={`${BUTTON} mt-6`} style={{ transition: `background-color 160ms ${EASE}, color 160ms ${EASE}` }}>
        Cambiar de cuenta
      </button>
    </div>
  )
}
