import { useState, useEffect } from 'react'
import { GRID, SLOTS as DEFAULT_SLOTS, TABLES as DEFAULT_TABLES, SECTION_LABELS as DEFAULT_LABELS, CAREER_COLORS, type Slot, type SlotCareer } from '../lib/floor-plan'
import { onFloorPlanChange, buildDefaultFloorPlan, autoPositionLabels, type FloorPlanData } from '../lib/floor-plan-storage'
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

const CELL = 18

const DEFAULT_PLAN: FloorPlanData = buildDefaultFloorPlan(
  DEFAULT_TABLES,
  DEFAULT_SLOTS,
  DEFAULT_LABELS.filter((l) => l.row === 0),
  DEFAULT_LABELS.filter((l) => l.row === 26),
  GRID.stage,
  GRID.stairsTop,
  GRID.stairsMain,
)

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
  const [plan, setPlan] = useState<FloorPlanData>(DEFAULT_PLAN)

  useEffect(() => {
    const unsub = onFloorPlanChange((data) => {
      if (data) setPlan(data)
    })
    return unsub
  }, [])

  // Determine grid dimensions from plan content
  const maxCol = Math.max(
    ...plan.tables.map((t) => t.col + t.width),
    ...plan.slots.map((s) => s.col + 1),
    ...plan.stageCells.map((c) => c.col + 1),
    ...plan.stairsCells.map((c) => c.col + 1),
    GRID.cols,
  )
  const maxRow = Math.max(
    ...plan.tables.map((t) => t.row + 1),
    ...plan.slots.map((s) => s.row + 1),
    ...plan.stageCells.map((c) => c.row + 1),
    ...plan.stairsCells.map((c) => c.row + 1),
    GRID.rows,
  )

  const width = maxCol * CELL
  const height = maxRow * CELL
  const projectsBySlotId = new Map<string, Project>()
  projects.forEach((p) => { if (p.slotId) projectsBySlotId.set(p.slotId, p) })

  const careersUsed = Array.from(new Set(plan.slots.map((s) => s.career))) as SlotCareer[]

  return (
    <div className="w-full">
      <div className="w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full block"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outside / building background */}
          <rect x={0} y={0} width={width} height={height} fill="#F3F4F6" />

          <defs>
            <pattern id="grid" width={CELL} height={CELL} patternUnits="userSpaceOnUse">
              <rect width={CELL} height={CELL} fill="none" stroke="#E5E7EB" strokeWidth={0.5} />
            </pattern>
          </defs>
          <rect x={0} y={0} width={width} height={height} fill="url(#grid)" />

          {/* Building heavy black border lines top/bottom */}
          {plan.buildingTopRow != null && (
            <line
              x1={0}
              y1={plan.buildingTopRow * CELL}
              x2={width}
              y2={plan.buildingTopRow * CELL}
              stroke="#111"
              strokeWidth={3}
            />
          )}
          {plan.buildingBottomRow != null && (
            <line
              x1={0}
              y1={plan.buildingBottomRow * CELL}
              x2={width}
              y2={plan.buildingBottomRow * CELL}
              stroke="#111"
              strokeWidth={3}
            />
          )}

          {/* Stage cells (light gray) */}
          {plan.stageCells.map((c, i) => (
            <rect
              key={`stage-${i}`}
              x={c.col * CELL}
              y={c.row * CELL}
              width={CELL}
              height={CELL}
              fill="#FFFFFF"
              stroke="#9CA3AF"
              strokeWidth={0.3}
            />
          ))}

          {/* Stairs cells (dark gray) */}
          {plan.stairsCells.map((c, i) => (
            <rect
              key={`stairs-${i}`}
              x={c.col * CELL}
              y={c.row * CELL}
              width={CELL}
              height={CELL}
              fill="#9CA3AF"
              stroke="#6B7280"
              strokeWidth={0.3}
            />
          ))}

          {/* Stage outline (heavy black border around stage area) */}
          {plan.stageCells.length > 0 && (() => {
            const cols = plan.stageCells.map((c) => c.col)
            const rows = plan.stageCells.map((c) => c.row)
            const minC = Math.min(...cols), maxC = Math.max(...cols)
            const minR = Math.min(...rows), maxR = Math.max(...rows)
            return (
              <rect
                x={minC * CELL}
                y={minR * CELL}
                width={(maxC - minC + 1) * CELL}
                height={(maxR - minR + 1) * CELL}
                fill="none"
                stroke="#111"
                strokeWidth={2.5}
              />
            )
          })()}

          {/* Tables (empty cells visible for spatial context) */}
          {plan.tables.map((t, i) => (
            <g key={`table-${i}`}>
              <rect
                x={t.col * CELL}
                y={t.row * CELL}
                width={t.width * CELL}
                height={CELL}
                fill="white"
                stroke="#9CA3AF"
                strokeWidth={0.7}
              />
              {Array.from({ length: t.width - 1 }).map((_, j) => (
                <line
                  key={j}
                  x1={(t.col + j + 1) * CELL}
                  y1={t.row * CELL}
                  x2={(t.col + j + 1) * CELL}
                  y2={(t.row + 1) * CELL}
                  stroke="#9CA3AF"
                  strokeWidth={0.5}
                />
              ))}
            </g>
          ))}

          {/* Slots (colored cells) */}
          {plan.slots.map((slot) => {
            const project = projectsBySlotId.get(slot.id)
            const taken = takenSlotIds?.has(slot.id) ?? !!project
            const isFiltered = filterCareer && slot.career !== filterCareer
            const isSelected = selectedSlotId === slot.id
            const isHovered = hoveredSlot === slot.id
            const isOwnHighlight = highlightOwnSlot === slot.id
            const colors = CAREER_COLORS[slot.career]

            const opacity = isFiltered ? 0.4 : 1
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
                  fill={isSelected ? colors.stroke : colors.fill}
                  stroke={isSelected || isOwnHighlight ? '#111' : colors.stroke}
                  strokeWidth={isSelected || isOwnHighlight ? 2 : 0.7}
                  opacity={opacity}
                  style={{ transition: 'fill 200ms cubic-bezier(0.23, 1, 0.32, 1), stroke-width 160ms cubic-bezier(0.23, 1, 0.32, 1)' }}
                />
                {isInteractive && isHovered && (
                  <rect
                    x={slot.col * CELL + 0.5}
                    y={slot.row * CELL + 0.5}
                    width={CELL - 1}
                    height={CELL - 1}
                    fill={colors.stroke}
                    opacity={0.3}
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

          {/* Section labels — auto-positioned over table clusters */}
          {showLabels && (() => {
            const midRow = (plan.buildingTopRow ?? 1) + ((plan.buildingBottomRow ?? 26) - (plan.buildingTopRow ?? 1)) / 2
            const topTables = plan.tables.filter((t) => t.row < midRow)
            const bottomTables = plan.tables.filter((t) => t.row >= midRow)
            const topNums = plan.topLabels.map((l) => l.num)
            const bottomNums = plan.bottomLabels.map((l) => l.num)
            const top = autoPositionLabels(topTables, topNums, 'top')
            const bottom = autoPositionLabels(bottomTables, bottomNums, 'bottom')
            return [...top, ...bottom].map((s, i) => (
              <text
                key={`label-${i}`}
                x={s.col * CELL}
                y={s.row * CELL + CELL * 0.85}
                textAnchor="middle"
                fontSize={CELL * 0.95}
                fontWeight="900"
                fill="#111"
                fontFamily="Raleway, sans-serif"
              >
                {s.num}
              </text>
            ))
          })()}
        </svg>
      </div>

      {/* Hovered/selected info */}
      {(hoveredSlot || selectedSlotId) && (() => {
        const slotId = hoveredSlot || selectedSlotId
        const slot = plan.slots.find((s) => s.id === slotId)
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
            const count = plan.slots.filter((s) => s.career === c).length
            const taken = projects.filter((p) => p.slotId && plan.slots.find((s) => s.id === p.slotId)?.career === c).length
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
