import { useState } from 'react'
import { GRID, SLOTS, TABLES, CAREER_COLORS, type Slot, type SlotCareer } from '../lib/floor-plan'
import type { Project } from '../types'

interface Props {
  projects?: Project[]
  selectedSlotId?: string | null
  filterCareer?: SlotCareer | null
  takenSlotIds?: Set<string>
  onSlotClick?: (slot: Slot) => void
  showLegend?: boolean
  showLabels?: boolean
  highlightOwnSlot?: string
}

const CELL = 18 // pixels per grid cell

export default function FloorMap({
  projects = [],
  selectedSlotId,
  filterCareer,
  takenSlotIds,
  onSlotClick,
  showLegend = true,
  showLabels = true,
  highlightOwnSlot,
}: Props) {
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null)

  const width = GRID.cols * CELL
  const height = GRID.rows * CELL
  const projectsBySlotId = new Map<string, Project>()
  projects.forEach((p) => { if (p.slotId) projectsBySlotId.set(p.slotId, p) })

  const sectionLabels = [
    { num: 7,  col: 32.5, row: 0.5 },
    { num: 9,  col: 25.5, row: 0.5 },
    { num: 11, col: 18.5, row: 0.5 },
    { num: 13, col: 11.5, row: 0.5 },
    { num: 15, col: 4.5,  row: 0.5 },
    { num: 18, col: 4.5,  row: 20.5 },
    { num: 16, col: 11.5, row: 20.5 },
    { num: 14, col: 18.5, row: 20.5 },
    { num: 12, col: 25.5, row: 20.5 },
    { num: 10, col: 32.5, row: 20.5 },
  ]

  const careersUsed = Array.from(new Set(SLOTS.map((s) => s.career))) as SlotCareer[]

  return (
    <div className="w-full">
      <div className="overflow-x-auto -mx-4 px-4 pb-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[800px] mx-auto block"
          style={{ minWidth: '600px' }}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grid background */}
          <rect x={0} y={0} width={width} height={height} fill="#F3F4F6" />

          {/* Building outline (heavy black border) */}
          <rect
            x={CELL * 0.5}
            y={CELL * 1}
            width={width - CELL * 1}
            height={height - CELL * 2}
            fill="#E5E7EB"
            stroke="#111"
            strokeWidth={3}
          />

          {/* Stage area (white interior) */}
          <rect
            x={GRID.stage.col * CELL}
            y={GRID.stage.row * CELL}
            width={GRID.stage.width * CELL}
            height={GRID.stage.height * CELL}
            fill="#FFFFFF"
            stroke="#111"
            strokeWidth={2.5}
          />

          {/* Stairs (dark gray block on right of stage) */}
          <rect
            x={GRID.stairs.col * CELL}
            y={GRID.stairs.row * CELL}
            width={GRID.stairs.width * CELL}
            height={GRID.stairs.height * CELL}
            fill="#9CA3AF"
            stroke="#6B7280"
            strokeWidth={1}
          />

          {/* Tables (empty cells) */}
          {TABLES.map((t, i) => (
            <g key={`table-${i}`}>
              <rect
                x={t.col * CELL}
                y={t.row * CELL}
                width={t.width * CELL}
                height={CELL}
                fill="white"
                stroke="#9CA3AF"
                strokeWidth={0.5}
              />
              {/* Cell dividers */}
              {Array.from({ length: t.width - 1 }).map((_, j) => (
                <line
                  key={j}
                  x1={(t.col + j + 1) * CELL}
                  y1={t.row * CELL}
                  x2={(t.col + j + 1) * CELL}
                  y2={(t.row + 1) * CELL}
                  stroke="#D1D5DB"
                  strokeWidth={0.5}
                />
              ))}
            </g>
          ))}

          {/* Slots */}
          {SLOTS.map((slot) => {
            const project = projectsBySlotId.get(slot.id)
            const taken = takenSlotIds?.has(slot.id) ?? !!project
            const isFiltered = filterCareer && slot.career !== filterCareer
            const isSelected = selectedSlotId === slot.id
            const isHovered = hoveredSlot === slot.id
            const isOwnHighlight = highlightOwnSlot === slot.id
            const colors = CAREER_COLORS[slot.career]

            const baseFill = taken ? colors.fill : 'white'
            const opacity = isFiltered ? 0.25 : 1
            const isInteractive = onSlotClick && !taken && !isFiltered

            return (
              <g
                key={slot.id}
                style={{ cursor: isInteractive ? 'pointer' : 'default' }}
                onClick={() => isInteractive && onSlotClick?.(slot)}
                onMouseEnter={() => setHoveredSlot(slot.id)}
                onMouseLeave={() => setHoveredSlot(null)}
              >
                <rect
                  x={slot.col * CELL + 0.5}
                  y={slot.row * CELL + 0.5}
                  width={CELL - 1}
                  height={CELL - 1}
                  fill={isSelected ? colors.stroke : baseFill}
                  stroke={isSelected || isOwnHighlight ? '#111' : colors.stroke}
                  strokeWidth={isSelected || isOwnHighlight ? 2 : 1}
                  opacity={opacity}
                  style={{
                    transition: 'fill 200ms cubic-bezier(0.23, 1, 0.32, 1), stroke-width 160ms cubic-bezier(0.23, 1, 0.32, 1)',
                  }}
                />
                {isInteractive && isHovered && (
                  <rect
                    x={slot.col * CELL + 0.5}
                    y={slot.row * CELL + 0.5}
                    width={CELL - 1}
                    height={CELL - 1}
                    fill={colors.fill}
                    opacity={0.6}
                    pointerEvents="none"
                  />
                )}
                {isOwnHighlight && (
                  <circle
                    cx={slot.col * CELL + CELL / 2}
                    cy={slot.row * CELL + CELL / 2}
                    r={CELL * 0.7}
                    fill="none"
                    stroke="#111"
                    strokeWidth={1.5}
                    opacity={0.4}
                    style={{ transformOrigin: 'center', animation: 'ownPulse 1.6s cubic-bezier(0.23, 1, 0.32, 1) infinite' }}
                  />
                )}
              </g>
            )
          })}

          {/* Section labels (numbers above/below building) */}
          {showLabels && sectionLabels.map((s) => (
            <text
              key={`section-${s.num}`}
              x={s.col * CELL}
              y={s.row * CELL + 4}
              textAnchor="middle"
              fontSize={CELL * 0.7}
              fontWeight="900"
              fill="#111"
              fontFamily="Raleway, sans-serif"
            >
              {s.num}
            </text>
          ))}
        </svg>
      </div>

      {/* Tooltip-style info for hovered/selected slot */}
      {(hoveredSlot || selectedSlotId) && (() => {
        const slotId = hoveredSlot || selectedSlotId
        const slot = SLOTS.find((s) => s.id === slotId)
        if (!slot) return null
        const project = projectsBySlotId.get(slot.id)
        const colors = CAREER_COLORS[slot.career]
        return (
          <div className="mt-2 mx-auto max-w-[600px] flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm">
            <span
              className="w-3 h-3 rounded-sm shrink-0"
              style={{ background: colors.fill, border: `1.5px solid ${colors.stroke}` }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold tabular-nums">{slot.id}</p>
              {project ? (
                <p className="text-xs text-gray-500 truncate">{project.projectName} — {project.teamName}</p>
              ) : (
                <p className="text-xs text-gray-400">Disponible</p>
              )}
            </div>
            <span className="text-xs font-bold text-gray-400 shrink-0">{colors.label}</span>
          </div>
        )
      })()}

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {careersUsed.map((c) => {
            const count = SLOTS.filter((s) => s.career === c).length
            const taken = projects.filter((p) => p.slotId && SLOTS.find((s) => s.id === p.slotId)?.career === c).length
            const colors = CAREER_COLORS[c]
            return (
              <div
                key={c}
                className="flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-white border border-gray-200"
              >
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ background: colors.fill, border: `1.5px solid ${colors.stroke}` }}
                />
                <span className="font-bold">{colors.label}</span>
                <span className="text-gray-400 tabular-nums">{taken}/{count}</span>
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes ownPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
      `}</style>
    </div>
  )
}
