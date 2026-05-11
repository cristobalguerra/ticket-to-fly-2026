import { useState, useEffect, useMemo } from 'react'
import Layout from '../components/Layout'
import PinGate from '../components/PinGate'
import { CAREER_COLORS, GRID, SLOTS as DEFAULT_SLOTS, TABLES as DEFAULT_TABLES, SECTION_LABELS as DEFAULT_LABELS, type SlotCareer } from '../lib/floor-plan'
import { getFloorPlan, saveFloorPlan, buildDefaultFloorPlan, autoPositionLabels, type FloorPlanData } from '../lib/floor-plan-storage'
import { Save, RotateCcw, Eraser, Square, Trash2, Tag, Loader2 } from 'lucide-react'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'
const CELL = 22

type Tool =
  | { kind: 'erase' }
  | { kind: 'table' }
  | { kind: 'stage' }
  | { kind: 'stairs' }
  | { kind: 'slot'; career: SlotCareer }

const CAREERS_LIST: SlotCareer[] = ['LDG', 'LAED', 'LINT', 'LDI', 'LA', 'LDM', 'POSG']

const DEFAULT_DATA = buildDefaultFloorPlan(
  DEFAULT_TABLES,
  DEFAULT_SLOTS,
  DEFAULT_LABELS.filter((l) => l.row === 0),
  DEFAULT_LABELS.filter((l) => l.row === 26),
  GRID.stage,
  GRID.stairsTop,
  GRID.stairsMain,
)

export default function MapEditor() {
  const [data, setData] = useState<FloorPlanData>(DEFAULT_DATA)
  const [tool, setTool] = useState<Tool>({ kind: 'slot', career: 'LDG' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [gridCols, setGridCols] = useState(GRID.cols)
  const [gridRows, setGridRows] = useState(GRID.rows)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    getFloorPlan()
      .then((d) => { if (d) setData(d) })
      .catch((e) => { console.warn('No se pudo cargar plano remoto, usando default', e) })
      .finally(() => setLoading(false))
  }, [])

  // Compute slot counts per career
  const slotCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    data.slots.forEach((s) => { counts[s.career] = (counts[s.career] || 0) + 1 })
    return counts
  }, [data.slots])

  // Build a map of (col,row) → what's there for quick rendering
  const cellMap = useMemo(() => {
    const m = new Map<string, { type: 'table' | 'stage' | 'stairs' | 'slot'; career?: SlotCareer; slotId?: string }>()
    data.tables.forEach((t) => {
      for (let i = 0; i < t.width; i++) {
        m.set(`${t.col + i},${t.row}`, { type: 'table' })
      }
    })
    data.stageCells.forEach((c) => { m.set(`${c.col},${c.row}`, { type: 'stage' }) })
    data.stairsCells.forEach((c) => { m.set(`${c.col},${c.row}`, { type: 'stairs' }) })
    data.slots.forEach((s) => { m.set(`${s.col},${s.row}`, { type: 'slot', career: s.career, slotId: s.id }) })
    return m
  }, [data])

  function applyTool(col: number, row: number) {
    if (col < 0 || col >= gridCols || row < 0 || row >= gridRows) return
    setData((prev) => {
      const next: FloorPlanData = {
        ...prev,
        tables: prev.tables.filter((t) => !(row === t.row && col >= t.col && col < t.col + t.width)),
        slots: prev.slots.filter((s) => !(s.col === col && s.row === row)),
        stageCells: prev.stageCells.filter((c) => !(c.col === col && c.row === row)),
        stairsCells: prev.stairsCells.filter((c) => !(c.col === col && c.row === row)),
      }
      // Re-add other slots from tables that we just removed
      // (since removing a table also removes its cells, but slots that weren't on this cell are kept by filter above)

      if (tool.kind === 'erase') {
        return next
      }
      if (tool.kind === 'table') {
        // Add a 1-cell table at this position (user can extend by clicking adjacent cells)
        next.tables = [...next.tables, { col, row, width: 1 }]
        return next
      }
      if (tool.kind === 'stage') {
        next.stageCells = [...next.stageCells, { col, row }]
        return next
      }
      if (tool.kind === 'stairs') {
        next.stairsCells = [...next.stairsCells, { col, row }]
        return next
      }
      if (tool.kind === 'slot') {
        // Generate a unique slot ID for the career
        const careerSlots = next.slots.filter((s) => s.career === tool.career)
        const maxNum = careerSlots.reduce((max, s) => {
          const m = s.id.match(/-(\d+)$/)
          const n = m ? parseInt(m[1]) : 0
          return Math.max(max, n)
        }, 0)
        const id = `${tool.career}-${maxNum + 1}`
        next.slots = [...next.slots, { id, career: tool.career, col, row }]
      }
      return next
    })
  }

  async function handleSave() {
    setSaving(true)
    setMsg('')
    try {
      await saveFloorPlan(data)
      setMsg('Plano guardado')
    } catch (err) {
      console.error(err)
      setMsg('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    if (!confirm('¿Restablecer al plano por defecto?')) return
    setData(DEFAULT_DATA)
    setMsg('Restablecido al default (no guardado aún)')
  }

  if (loading) {
    return (
      <Layout showBack showFooter={false}>
        <div className="flex items-center justify-center min-h-[60dvh]">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </Layout>
    )
  }

  const width = gridCols * CELL
  const height = gridRows * CELL

  return (
    <PinGate label="Editor del Plano">
      <Layout showBack showFooter={false}>
        <div className="max-w-[1200px] mx-auto p-4 pb-8">
          <div className="flex items-center justify-between mt-4 mb-4">
            <h1 className="text-2xl font-bold">Editor del Plano</h1>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:text-udem-black"
                style={{ transition: `color 180ms ${EASE_OUT}, transform 160ms ${EASE_OUT}` }}
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-udem-black text-white text-sm font-bold shadow-lg disabled:opacity-50"
                style={{ transition: `transform 160ms ${EASE_OUT}, opacity 200ms ${EASE_OUT}` }}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar
              </button>
            </div>
          </div>

          {msg && (
            <p className={`mb-3 text-sm font-medium ${msg.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
              {msg}
            </p>
          )}

          {/* Toolbar */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4 shadow-sm">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Pincel:</span>

              <ToolButton active={tool.kind === 'erase'} onClick={() => setTool({ kind: 'erase' })}>
                <Eraser className="w-3.5 h-3.5" /> Borrar
              </ToolButton>

              <ToolButton active={tool.kind === 'table'} onClick={() => setTool({ kind: 'table' })}>
                <Square className="w-3.5 h-3.5" /> Mesa vacía
              </ToolButton>

              <ToolButton active={tool.kind === 'stage'} onClick={() => setTool({ kind: 'stage' })}>
                <span className="w-3 h-3 bg-gray-200 border border-gray-400 rounded-sm" /> Escenario
              </ToolButton>

              <ToolButton active={tool.kind === 'stairs'} onClick={() => setTool({ kind: 'stairs' })}>
                <span className="w-3 h-3 bg-gray-500 rounded-sm" /> Escaleras
              </ToolButton>

              <div className="h-6 w-px bg-gray-200 mx-1" />

              {CAREERS_LIST.map((c) => {
                const colors = CAREER_COLORS[c]
                const active = tool.kind === 'slot' && tool.career === c
                return (
                  <ToolButton key={c} active={active} onClick={() => setTool({ kind: 'slot', career: c })}>
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ background: colors.fill, border: `1.5px solid ${colors.stroke}` }}
                    />
                    {colors.label}
                    <span className="text-gray-400 text-[10px] tabular-nums">
                      {slotCounts[c] || 0}
                    </span>
                  </ToolButton>
                )
              })}
            </div>

            <div className="flex gap-3 items-center mt-3 pt-3 border-t border-gray-100 text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider">Grid:</span>
              <label className="flex items-center gap-1.5">
                Cols
                <input
                  type="number"
                  min={10}
                  max={80}
                  value={gridCols}
                  onChange={(e) => setGridCols(Math.max(10, Math.min(80, parseInt(e.target.value) || 40)))}
                  className="w-16 px-2 py-1 rounded border border-gray-200 tabular-nums"
                />
              </label>
              <label className="flex items-center gap-1.5">
                Rows
                <input
                  type="number"
                  min={10}
                  max={60}
                  value={gridRows}
                  onChange={(e) => setGridRows(Math.max(10, Math.min(60, parseInt(e.target.value) || 28)))}
                  className="w-16 px-2 py-1 rounded border border-gray-200 tabular-nums"
                />
              </label>
              <span className="text-gray-400 ml-auto">Click o arrastra para pintar</span>
            </div>
          </div>

          {/* Grid editor */}
          <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="block mx-auto select-none w-full"
              preserveAspectRatio="xMidYMid meet"
              onMouseDown={(e) => { setDragging(true); handleSvgClick(e) }}
              onMouseUp={() => setDragging(false)}
              onMouseLeave={() => setDragging(false)}
              onMouseMove={(e) => { if (dragging) handleSvgClick(e) }}
              onTouchStart={(e) => { setDragging(true); handleTouch(e) }}
              onTouchEnd={() => setDragging(false)}
              onTouchMove={(e) => { if (dragging) handleTouch(e) }}
            >
              {/* Background grid */}
              {Array.from({ length: gridRows }).map((_, r) =>
                Array.from({ length: gridCols }).map((_, c) => (
                  <rect
                    key={`bg-${c}-${r}`}
                    x={c * CELL}
                    y={r * CELL}
                    width={CELL}
                    height={CELL}
                    fill="#FAFAFA"
                    stroke="#E5E7EB"
                    strokeWidth={0.5}
                  />
                )),
              )}

              {/* Render cells based on type */}
              {Array.from(cellMap.entries()).map(([key, cell]) => {
                const [col, row] = key.split(',').map(Number)
                if (col >= gridCols || row >= gridRows) return null
                let fill = '#FAFAFA'
                let stroke = '#E5E7EB'
                let strokeWidth = 0.5
                if (cell.type === 'table') {
                  fill = 'white'
                  stroke = '#9CA3AF'
                  strokeWidth = 0.7
                }
                if (cell.type === 'stage') {
                  fill = '#E5E7EB'
                  stroke = '#9CA3AF'
                  strokeWidth = 0.5
                }
                if (cell.type === 'stairs') {
                  fill = '#9CA3AF'
                  stroke = '#6B7280'
                  strokeWidth = 0.5
                }
                if (cell.type === 'slot' && cell.career) {
                  const colors = CAREER_COLORS[cell.career]
                  fill = colors.fill
                  stroke = colors.stroke
                  strokeWidth = 0.8
                }
                return (
                  <rect
                    key={`cell-${key}`}
                    x={col * CELL + 0.5}
                    y={row * CELL + 0.5}
                    width={CELL - 1}
                    height={CELL - 1}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    pointerEvents="none"
                  />
                )
              })}

              {/* Section labels — auto-centered over table clusters */}
              {(() => {
                const midRow = gridRows / 2
                const topTables = data.tables.filter((t) => t.row < midRow)
                const bottomTables = data.tables.filter((t) => t.row >= midRow)
                const topNums = data.topLabels.map((l) => l.num)
                const bottomNums = data.bottomLabels.map((l) => l.num)
                const top = autoPositionLabels(topTables, topNums, 'top')
                const bottom = autoPositionLabels(bottomTables, bottomNums, 'bottom')
                return [...top, ...bottom].map((l, i) => (
                  <text
                    key={`label-${i}`}
                    x={l.col * CELL}
                    y={l.row * CELL + CELL * 0.8}
                    textAnchor="middle"
                    fontSize={CELL * 0.7}
                    fontWeight="900"
                    fill="#111"
                    fontFamily="Raleway, sans-serif"
                    pointerEvents="none"
                  >
                    {l.num}
                  </text>
                ))
              })()}
            </svg>
          </div>

          {/* Slot list */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Slots actuales
              <span className="text-gray-400 ml-1 tabular-nums">({data.slots.length})</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {data.slots.map((s) => {
                const colors = CAREER_COLORS[s.career]
                return (
                  <div
                    key={s.id}
                    className="flex items-center gap-1.5 px-2 py-1 rounded text-xs"
                    style={{ background: colors.fill, border: `1px solid ${colors.stroke}` }}
                  >
                    <span className="font-bold tabular-nums">{s.id}</span>
                    <span className="text-gray-500 tabular-nums">({s.col},{s.row})</span>
                    <button
                      onClick={() => setData((prev) => ({ ...prev, slots: prev.slots.filter((x) => x.id !== s.id) }))}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Layout>
    </PinGate>
  )

  function handleSvgClick(e: React.MouseEvent<SVGSVGElement>) {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * width
    const y = ((e.clientY - rect.top) / rect.height) * height
    const col = Math.floor(x / CELL)
    const row = Math.floor(y / CELL)
    applyTool(col, row)
  }

  function handleTouch(e: React.TouchEvent<SVGSVGElement>) {
    const t = e.touches[0]
    if (!t) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((t.clientX - rect.left) / rect.width) * width
    const y = ((t.clientY - rect.top) / rect.height) * height
    const col = Math.floor(x / CELL)
    const row = Math.floor(y / CELL)
    applyTool(col, row)
  }
}

function ToolButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border-2 ${
        active ? 'border-udem-black bg-udem-black/5' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      style={{ transition: `border-color 180ms ${EASE_OUT}, background-color 180ms ${EASE_OUT}, transform 160ms ${EASE_OUT}` }}
    >
      {children}
    </button>
  )
}
