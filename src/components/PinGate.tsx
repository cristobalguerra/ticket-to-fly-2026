import { useState } from 'react'
import { Lock } from 'lucide-react'

const CORRECT_PIN = '2026'

interface Props {
  children: React.ReactNode
  label?: string
}

export default function PinGate({ children, label = 'Acceso restringido' }: Props) {
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return <>{children}</>

  return (
    <div className="home-bg min-h-dvh flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl shadow-black/10 border border-white/50">
        <div className="w-16 h-16 bg-udem-black rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-black mb-1 text-udem-black">{label}</h2>
        <p className="text-sm text-udem-black/50 mb-6">Ingresa el PIN para continuar</p>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(false) }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (pin === CORRECT_PIN) setUnlocked(true)
              else setError(true)
            }
          }}
          placeholder="PIN"
          className={`w-full text-center text-2xl tracking-[0.5em] border-2 rounded-2xl p-4 outline-none transition-colors bg-white/70 ${
            error ? 'border-red-400 bg-red-50' : 'border-udem-black/10 focus:border-udem-black/40'
          }`}
        />
        {error && <p className="text-red-500 text-sm mt-2">PIN incorrecto</p>}
        <button
          onClick={() => {
            if (pin === CORRECT_PIN) setUnlocked(true)
            else setError(true)
          }}
          className="mt-4 w-full bg-udem-black text-white font-bold py-3.5 rounded-2xl hover:bg-udem-black/90 transition-all active:scale-[0.98] shadow-lg"
        >
          Entrar
        </button>
      </div>
    </div>
  )
}
