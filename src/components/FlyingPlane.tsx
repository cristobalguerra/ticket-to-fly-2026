import { useEffect, useId, useState } from 'react'

// Avión de papel que navega en profundidad alrededor del título (la
// trayectoria vive en index.css). La silueta es siempre la misma; lo que
// cambia, al azar y a destellos, es cómo está construida: plano, contorno,
// trama de puntos, mapa de bits, rayado o bloque amarillo.

const W = 1000
const H = 570

const SILHOUETTE = 'M4 195 999 3 568 524 438 448 232 565 235 323Z'
const FACETS = {
  top: 'M4 195 999 3 235 323Z',
  fold: 'M235 323 999 3 346 380 232 565Z',
  under: 'M346 380 438 448 232 565Z',
  right: 'M999 3 568 524 346 380Z',
}

const OUTLINE: [number, number][] = [[4, 195], [999, 3], [568, 524], [438, 448], [232, 565], [235, 323]]

function inside(x: number, y: number) {
  let hit = false
  for (let i = 0, j = OUTLINE.length - 1; i < OUTLINE.length; j = i++) {
    const [xi, yi] = OUTLINE[i]
    const [xj, yj] = OUTLINE[j]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

// Mapa de bits: celdas de la retícula cuyo centro cae dentro de la silueta.
const CELL = 58
const PIXELS: [number, number][] = []
for (let y = 0; y < H; y += CELL) {
  for (let x = 0; x < W; x += CELL) {
    if (inside(x + CELL / 2, y + CELL / 2)) PIXELS.push([x, y])
  }
}

const STYLES = ['solid', 'outline', 'dots', 'pixels', 'lines', 'yellow'] as const
type Style = (typeof STYLES)[number]

function nextStyle(current: Style): Style {
  const others = STYLES.filter((s) => s !== current)
  return others[Math.floor(Math.random() * others.length)]
}

export default function FlyingPlane() {
  const id = useId()
  const [style, setStyle] = useState<Style>('solid')
  const [lit, setLit] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let timer = 0
    const hold = () => 350 + Math.random() * 1100

    function change() {
      setStyle((s) => nextStyle(s))
      // A veces el cambio tartamudea: dos o tres estilos muy rápidos con un
      // apagón entre ellos, como un tablero que busca la letra correcta.
      if (Math.random() < 0.45) {
        let flickers = 2 + Math.floor(Math.random() * 3)
        const stutter = () => {
          setLit(false)
          timer = window.setTimeout(() => {
            setStyle((s) => nextStyle(s))
            setLit(true)
            flickers -= 1
            timer = window.setTimeout(flickers > 0 ? stutter : change, flickers > 0 ? 70 : hold())
          }, 45)
        }
        timer = window.setTimeout(stutter, 90)
      } else {
        timer = window.setTimeout(change, hold())
      }
    }

    timer = window.setTimeout(change, hold())
    return () => window.clearTimeout(timer)
  }, [])

  const dots = `${id}-dots`
  const lines = `${id}-lines`

  return (
    <div className="flight" aria-hidden>
      <div className="flight-path" data-style={style}>
        <svg className="flight-plane" viewBox={`0 0 ${W} ${H}`} style={{ opacity: lit ? 1 : 0 }}>
          <defs>
            <pattern id={dots} width="64" height="64" patternUnits="userSpaceOnUse">
              <circle cx="32" cy="32" r="21" fill="#fff" />
            </pattern>
            <pattern id={lines} width="54" height="54" patternUnits="userSpaceOnUse">
              <rect width="54" height="24" fill="#fff" />
            </pattern>
          </defs>

          {style === 'solid' && (
            <>
              <path fill="#fff" d={FACETS.top} />
              <path fill="#8f8f8f" d={FACETS.fold} />
              <path fill="#3d3d3d" d={FACETS.under} />
              <path fill="#fff" d={FACETS.right} />
            </>
          )}

          {style === 'outline' && (
            <g fill="none" stroke="#fff" strokeWidth="20" strokeLinejoin="round">
              <path d={FACETS.top} />
              <path d={FACETS.fold} />
              <path d={FACETS.right} />
            </g>
          )}

          {style === 'dots' && <path fill={`url(#${dots})`} d={SILHOUETTE} />}

          {style === 'pixels' &&
            PIXELS.map(([x, y]) => <rect key={`${x}-${y}`} x={x} y={y} width={CELL - 6} height={CELL - 6} fill="#fff" />)}

          {style === 'lines' && <path fill={`url(#${lines})`} d={SILHOUETTE} />}

          {style === 'yellow' && <path fill="#FFF500" d={SILHOUETTE} />}
        </svg>
      </div>
    </div>
  )
}
