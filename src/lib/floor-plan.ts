import type { Career } from '../types'

export type SlotCareer = Career | 'POSG'

export interface Slot {
  id: string
  career: SlotCareer
  col: number
  row: number
}

export interface Table {
  col: number
  row: number
  width: number
}

// Career colors (matching the floor plan image)
export const CAREER_COLORS: Record<SlotCareer, { fill: string; stroke: string; label: string }> = {
  LDG:  { fill: '#FBCFE8', stroke: '#DB2777', label: 'LDG' },
  LAED: { fill: '#FED7AA', stroke: '#EA580C', label: 'LAED' },
  LINT: { fill: '#FEF3C7', stroke: '#CA8A04', label: 'LINT' },
  LDI:  { fill: '#BBF7D0', stroke: '#16A34A', label: 'LDI' },
  LA:   { fill: '#BFDBFE', stroke: '#2563EB', label: 'Arte' },
  LDM:  { fill: '#DDD6FE', stroke: '#7C3AED', label: 'Moda' },
  POSG: { fill: '#FCA5A5', stroke: '#B91C1C', label: 'Posgrados' },
}

// Floor plan grid (units = cells)
export const GRID = {
  cols: 36,
  rows: 22,
  // Stage area (inner white box)
  stage: { col: 8, row: 5, width: 18, height: 11 },
  // Stairs (dark gray block on right of stage)
  stairs: { col: 21, row: 5, width: 4, height: 11 },
  // Center walkway
  walkway: { col: 8, row: 5, width: 18, height: 11 },
}

// All tables on the floor — 5 cells wide each
export const TABLES: Table[] = [
  // Top, row 1 (sections 15, 13, 11, 9, 7 → left to right)
  { col: 2, row: 2, width: 5 },
  { col: 9, row: 2, width: 5 },
  { col: 16, row: 2, width: 5 },
  { col: 23, row: 2, width: 5 },
  { col: 30, row: 2, width: 5 },
  // Top, row 2
  { col: 2, row: 3, width: 5 },
  { col: 9, row: 3, width: 5 },
  { col: 16, row: 3, width: 5 },
  { col: 23, row: 3, width: 5 },
  { col: 30, row: 3, width: 5 },

  // Left side, top tables (between top tables and middle of stage)
  { col: 2, row: 5, width: 5 },
  { col: 2, row: 6, width: 5 },
  // Left side, bottom tables
  { col: 2, row: 13, width: 5 },
  { col: 2, row: 14, width: 5 },

  // Right side, top tables
  { col: 30, row: 5, width: 5 },
  { col: 30, row: 6, width: 5 },
  // Right side, bottom tables
  { col: 30, row: 13, width: 5 },
  { col: 30, row: 14, width: 5 },

  // Bottom row 1 (sections 18, 16, 14, 12, 10 → left to right)
  { col: 2, row: 17, width: 5 },
  { col: 9, row: 17, width: 5 },
  { col: 16, row: 17, width: 5 },
  { col: 23, row: 17, width: 5 },
  { col: 30, row: 17, width: 5 },
  // Bottom row 2
  { col: 2, row: 18, width: 5 },
  { col: 9, row: 18, width: 5 },
  { col: 16, row: 18, width: 5 },
  { col: 23, row: 18, width: 5 },
  { col: 30, row: 18, width: 5 },
]

// 58 slots distributed by career, matching the floor plan image
// Each slot has a unique id and grid coordinates
export const SLOTS: Slot[] = [
  // ─── LDI: 5 slots (top-left, section 15, bottom row of top) ───
  { id: 'LDI-1', career: 'LDI', col: 2, row: 3 },
  { id: 'LDI-2', career: 'LDI', col: 3, row: 3 },
  { id: 'LDI-3', career: 'LDI', col: 4, row: 3 },
  { id: 'LDI-4', career: 'LDI', col: 5, row: 3 },
  { id: 'LDI-5', career: 'LDI', col: 6, row: 3 },

  // ─── Arte (LA): 7 slots (top, sections 13 + 11) ───
  // Section 13, row 2: 4 cells
  { id: 'LA-1', career: 'LA', col: 9, row: 3 },
  { id: 'LA-2', career: 'LA', col: 11, row: 3 },
  { id: 'LA-3', career: 'LA', col: 13, row: 3 },
  // Section 11, row 2: 4 cells
  { id: 'LA-4', career: 'LA', col: 16, row: 3 },
  { id: 'LA-5', career: 'LA', col: 18, row: 3 },
  { id: 'LA-6', career: 'LA', col: 20, row: 3 },
  { id: 'LA-7', career: 'LA', col: 17, row: 3 },

  // ─── LINT: 17 slots (top-right, sections 9 + 7) ───
  // Section 9 row 1
  { id: 'LINT-1',  career: 'LINT', col: 23, row: 2 },
  { id: 'LINT-2',  career: 'LINT', col: 24, row: 2 },
  { id: 'LINT-3',  career: 'LINT', col: 25, row: 2 },
  { id: 'LINT-4',  career: 'LINT', col: 26, row: 2 },
  { id: 'LINT-5',  career: 'LINT', col: 27, row: 2 },
  // Section 9 row 2
  { id: 'LINT-6',  career: 'LINT', col: 23, row: 3 },
  { id: 'LINT-7',  career: 'LINT', col: 24, row: 3 },
  { id: 'LINT-8',  career: 'LINT', col: 25, row: 3 },
  // Section 7 row 1
  { id: 'LINT-9',  career: 'LINT', col: 30, row: 2 },
  { id: 'LINT-10', career: 'LINT', col: 31, row: 2 },
  { id: 'LINT-11', career: 'LINT', col: 32, row: 2 },
  { id: 'LINT-12', career: 'LINT', col: 33, row: 2 },
  { id: 'LINT-13', career: 'LINT', col: 34, row: 2 },
  // Section 7 row 2
  { id: 'LINT-14', career: 'LINT', col: 30, row: 3 },
  { id: 'LINT-15', career: 'LINT', col: 31, row: 3 },
  { id: 'LINT-16', career: 'LINT', col: 32, row: 3 },
  { id: 'LINT-17', career: 'LINT', col: 33, row: 3 },

  // ─── LDM (Moda): 17 slots (left + right sides + 1 in section 7) ───
  // Right top (next to LINT-17)
  { id: 'LDM-1',  career: 'LDM', col: 34, row: 3 },
  // Left side top
  { id: 'LDM-2',  career: 'LDM', col: 3, row: 5 },
  { id: 'LDM-3',  career: 'LDM', col: 4, row: 5 },
  { id: 'LDM-4',  career: 'LDM', col: 5, row: 5 },
  { id: 'LDM-5',  career: 'LDM', col: 3, row: 6 },
  { id: 'LDM-6',  career: 'LDM', col: 4, row: 6 },
  { id: 'LDM-7',  career: 'LDM', col: 5, row: 6 },
  // Left side bottom
  { id: 'LDM-8',  career: 'LDM', col: 2, row: 13 },
  { id: 'LDM-9',  career: 'LDM', col: 4, row: 13 },
  { id: 'LDM-10', career: 'LDM', col: 6, row: 13 },
  // Right side top
  { id: 'LDM-11', career: 'LDM', col: 30, row: 5 },
  { id: 'LDM-12', career: 'LDM', col: 32, row: 5 },
  { id: 'LDM-13', career: 'LDM', col: 34, row: 5 },
  // Right side bottom
  { id: 'LDM-14', career: 'LDM', col: 30, row: 13 },
  { id: 'LDM-15', career: 'LDM', col: 31, row: 13 },
  { id: 'LDM-16', career: 'LDM', col: 33, row: 13 },
  { id: 'LDM-17', career: 'LDM', col: 34, row: 13 },

  // ─── LAED: 2 slots (bottom-left, section 18) ───
  { id: 'LAED-1', career: 'LAED', col: 2, row: 17 },
  { id: 'LAED-2', career: 'LAED', col: 4, row: 17 },

  // ─── POSG (Posgrados): 3 slots (section 16) ───
  { id: 'POSG-1', career: 'POSG', col: 9, row: 17 },
  { id: 'POSG-2', career: 'POSG', col: 11, row: 17 },
  { id: 'POSG-3', career: 'POSG', col: 10, row: 18 },

  // ─── LDG: 7 slots (bottom-right, section 10) ───
  { id: 'LDG-1', career: 'LDG', col: 30, row: 17 },
  { id: 'LDG-2', career: 'LDG', col: 32, row: 17 },
  { id: 'LDG-3', career: 'LDG', col: 34, row: 17 },
  { id: 'LDG-4', career: 'LDG', col: 30, row: 18 },
  { id: 'LDG-5', career: 'LDG', col: 32, row: 18 },
  { id: 'LDG-6', career: 'LDG', col: 33, row: 18 },
  { id: 'LDG-7', career: 'LDG', col: 34, row: 18 },
]

export function getSlotsByCareer(career: Career): Slot[] {
  // Map LA / LDM / etc. — Career enum already matches SlotCareer except POSG isn't a Career
  return SLOTS.filter((s) => s.career === career)
}

export function getSlotById(id: string): Slot | undefined {
  return SLOTS.find((s) => s.id === id)
}

// Get the section number (7-18) a slot belongs to based on its row position
export function getSlotSection(slot: Slot): number | null {
  // Top sections: rows 2-3
  if (slot.row <= 3) {
    if (slot.col <= 6) return 15
    if (slot.col <= 13) return 13
    if (slot.col <= 20) return 11
    if (slot.col <= 27) return 9
    return 7
  }
  // Bottom sections: rows 17-18
  if (slot.row >= 17) {
    if (slot.col <= 6) return 18
    if (slot.col <= 13) return 16
    if (slot.col <= 20) return 14
    if (slot.col <= 27) return 12
    return 10
  }
  // Side tables — return null (not numbered in the original map)
  return null
}
