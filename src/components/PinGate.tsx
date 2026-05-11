import { useState } from 'react'
import { Lock } from 'lucide-react'

const DEFAULT_PIN = '2026'

interface Props {
  children: React.ReactNode
  label?: string
  pin?: string
}

export default function PinGate({ children, label = 'Acceso restringido', pin: correctPin = DEFAULT_PIN }: Props) {
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return <>{children}</>

  function tryUnlock() {
    if (pin === correctPin) setUnlocked(true)
    else setError(true)
  }

  return (
    <div className="home-bg min-h-dvh flex items-center justify-center p-4">
      <div className="page-enter bg-white/90 backdrop-blur-xl rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl shadow-black/10 border border-white/50">
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
          onKeyDown={(e) => { if (e.key === 'Enter') tryUnlock() }}
          placeholder="PIN"
          autoFocus
          className={`w-full text-center text-2xl tracking-[0.5em] border-2 rounded-2xl p-4 outline-none bg-white/70 ${
            error ? 'border-red-400 bg-red-50 animate-[shake_320ms_cubic-bezier(0.36,0.07,0.19,0.97)]' : 'border-udem-black/10'
          }`}
          style={{ transition: 'border-color 200ms cubic-bezier(0.23, 1, 0.32, 1), background-color 200ms cubic-bezier(0.23, 1, 0.32, 1)' }}
        />
        <p
          aria-live="polite"
          className={`text-red-500 text-sm overflow-hidden ${error ? 'mt-2 max-h-6 opacity-100' : 'mt-0 max-h-0 opacity-0'}`}
          style={{ transition: 'max-height 220ms cubic-bezier(0.23, 1, 0.32, 1), opacity 180ms cubic-bezier(0.23, 1, 0.32, 1), margin-top 220ms cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          PIN incorrecto
        </p>
        <button
          onClick={tryUnlock}
          className="mt-4 w-full bg-udem-black text-white font-bold py-3.5 rounded-2xl shadow-lg"
          style={{ transition: 'background-color 200ms cubic-bezier(0.23, 1, 0.32, 1), transform 160ms cubic-bezier(0.23, 1, 0.32, 1)' }}
        >
          Entrar
        </button>
      </div>
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-3px); }
          40%, 60% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  )
}
