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
    <div className="min-h-dvh flex items-center justify-center bg-udem-black p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-xl">
        <div className="w-16 h-16 bg-udem-yellow rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-udem-black" />
        </div>
        <h2 className="text-xl font-bold mb-1">{label}</h2>
        <p className="text-sm text-gray-500 mb-6">Ingresa el PIN para continuar</p>
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
          className={`w-full text-center text-2xl tracking-[0.5em] border-2 rounded-xl p-4 outline-none transition-colors ${
            error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-udem-yellow'
          }`}
        />
        {error && <p className="text-red-500 text-sm mt-2">PIN incorrecto</p>}
        <button
          onClick={() => {
            if (pin === CORRECT_PIN) setUnlocked(true)
            else setError(true)
          }}
          className="mt-4 w-full bg-udem-yellow text-udem-black font-bold py-3 rounded-xl hover:brightness-95 transition-all active:scale-[0.98]"
        >
          Entrar
        </button>
      </div>
    </div>
  )
}
