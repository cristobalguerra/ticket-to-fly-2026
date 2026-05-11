import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import type { Slot, Table, SlotCareer } from './floor-plan'

export interface FloorPlanData {
  tables: Table[]
  slots: Slot[]
  // Cells representing the building/stage/stairs (each cell rendered as gray)
  stageCells: { col: number; row: number }[]   // light gray (stage interior)
  stairsCells: { col: number; row: number }[]  // dark gray (stairs)
  // Section labels (numbers shown above/below building)
  topLabels: { num: number; col: number; row: number }[]
  bottomLabels: { num: number; col: number; row: number }[]
  // Building outline (top/bottom heavy black lines)
  buildingTopRow?: number
  buildingBottomRow?: number
}

const ref = doc(db, 'settings', 'floorPlan')

export async function getFloorPlan(): Promise<FloorPlanData | null> {
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return snap.data() as FloorPlanData
}

export async function saveFloorPlan(data: FloorPlanData) {
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() })
}

export function onFloorPlanChange(callback: (data: FloorPlanData | null) => void) {
  return onSnapshot(ref, (snap) => {
    callback(snap.exists() ? (snap.data() as FloorPlanData) : null)
  })
}

// Convert the default hardcoded data into FloorPlanData format
export function buildDefaultFloorPlan(
  tables: Table[],
  slots: Slot[],
  topLabels: { num: number; col: number; row: number }[],
  bottomLabels: { num: number; col: number; row: number }[],
  stage: { col: number; row: number; width: number; height: number },
  stairsTop: { col: number; row: number; width: number; height: number },
  stairsMain: { col: number; row: number; width: number; height: number },
): FloorPlanData {
  const stageCells: { col: number; row: number }[] = []
  for (let r = stage.row; r < stage.row + stage.height; r++) {
    for (let c = stage.col; c < stage.col + stage.width; c++) {
      stageCells.push({ col: c, row: r })
    }
  }
  const stairsCells: { col: number; row: number }[] = []
  for (let r = stairsTop.row; r < stairsTop.row + stairsTop.height; r++) {
    for (let c = stairsTop.col; c < stairsTop.col + stairsTop.width; c++) {
      stairsCells.push({ col: c, row: r })
    }
  }
  for (let r = stairsMain.row; r < stairsMain.row + stairsMain.height; r++) {
    for (let c = stairsMain.col; c < stairsMain.col + stairsMain.width; c++) {
      if (!stairsCells.some((s) => s.col === c && s.row === r)) {
        stairsCells.push({ col: c, row: r })
      }
    }
  }
  return { tables, slots, stageCells, stairsCells, topLabels, bottomLabels, buildingTopRow: 1, buildingBottomRow: 26 }
}

export type CellType = 'empty' | 'table' | 'stage' | 'stairs' | 'slot'
export type CellState = { type: CellType; career?: SlotCareer; slotId?: string }

// Auto-position section labels over clusters of tables
// nums: section numbers in the order they should appear (left to right)
export function autoPositionLabels(
  tables: Table[],
  nums: number[],
  position: 'top' | 'bottom',
): { num: number; col: number; row: number }[] {
  if (tables.length === 0 || nums.length === 0) return []

  const sorted = [...tables].sort((a, b) => a.col - b.col)
  const minCol = sorted[0].col
  const maxCol = Math.max(...sorted.map((t) => t.col + t.width))
  const range = maxCol - minCol
  const step = range / nums.length

  // Find row for label placement
  const topRow = Math.min(...tables.map((t) => t.row))
  const bottomRow = Math.max(...tables.map((t) => t.row))
  const labelRow = position === 'top' ? Math.max(0, topRow - 2) : bottomRow + 2

  return nums.map((num, i) => {
    const sectionStart = minCol + i * step
    const sectionEnd = minCol + (i + 1) * step
    // Find tables whose horizontal center falls in this column slice
    const inRange = sorted.filter((t) => {
      const center = t.col + t.width / 2
      return center >= sectionStart && center < sectionEnd
    })
    // If no tables in this slice, use the geometric center of the slice
    const labelCol = inRange.length > 0
      ? inRange.reduce((sum, t) => sum + t.col + t.width / 2, 0) / inRange.length
      : sectionStart + step / 2
    return { num, col: labelCol, row: labelRow }
  })
}
