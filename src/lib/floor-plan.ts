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
  LINT: { fill: '#FEF08A', stroke: '#CA8A04', label: 'LINT' },
  LDI:  { fill: '#BBF7D0', stroke: '#16A34A', label: 'LDI' },
  LA:   { fill: '#BFDBFE', stroke: '#2563EB', label: 'Arte' },
  LDM:  { fill: '#DDD6FE', stroke: '#7C3AED', label: 'Moda' },
  POSG: { fill: '#FCA5A5', stroke: '#B91C1C', label: 'Posgrados' },
}

// Floor plan grid (units = cells)
export const GRID = {
  cols: 50,
  rows: 30,
  // Building outer border
  building: { col: 0, row: 2, width: 50, height: 26 },
  // Stage outer (heavy black border) — encloses both white interior and gray stairs
  stage: { col: 11, row: 7, width: 27, height: 13 },
  // Stage white interior (left portion)
  stageWhite: { col: 11, row: 7, width: 21, height: 13 },
  // Stairs gray block (right portion of stage)
  stairs: { col: 32, row: 7, width: 6, height: 13 },
  // Small stair-top notch above stage
  stairsTop: { col: 32, row: 5, width: 4, height: 2 },
}

// All visible tables on the floor plan (5-cell wide, 1-cell tall)
// These are rendered as gridded cells whether or not they have a slot assigned
export const TABLES: Table[] = [
  // ─── Top tables, row 1 (row 4) — sections 15, 13, 11, 9, 7 ───
  { col: 3, row: 4, width: 5 },
  { col: 12, row: 4, width: 5 },
  { col: 21, row: 4, width: 5 },
  { col: 30, row: 4, width: 5 },
  { col: 39, row: 4, width: 5 },
  // Top tables, row 2 (row 5)
  { col: 3, row: 5, width: 5 },
  { col: 12, row: 5, width: 5 },
  { col: 21, row: 5, width: 5 },
  { col: 30, row: 5, width: 5 },
  { col: 39, row: 5, width: 5 },

  // ─── Side tables left, top half (between top tables and stage middle) ───
  { col: 3, row: 7, width: 5 },
  { col: 3, row: 8, width: 5 },
  // Side tables left, bottom half (between stage middle and bottom tables)
  { col: 3, row: 17, width: 5 },
  { col: 3, row: 18, width: 5 },

  // ─── Side tables right, top half ───
  { col: 39, row: 7, width: 5 },
  { col: 39, row: 8, width: 5 },
  // Side tables right, bottom half
  { col: 39, row: 17, width: 5 },
  { col: 39, row: 18, width: 5 },

  // ─── Bottom tables, row 1 (row 21) — sections 18, 16, 14, 12, 10 ───
  { col: 3, row: 21, width: 5 },
  { col: 12, row: 21, width: 5 },
  { col: 21, row: 21, width: 5 },
  { col: 30, row: 21, width: 5 },
  { col: 39, row: 21, width: 5 },
  // Bottom tables, row 2 (row 22)
  { col: 3, row: 22, width: 5 },
  { col: 12, row: 22, width: 5 },
  { col: 21, row: 22, width: 5 },
  { col: 30, row: 22, width: 5 },
  { col: 39, row: 22, width: 5 },
  // Bottom tables, row 3 (row 24) — extra row matching image
  { col: 3, row: 24, width: 5 },
  { col: 12, row: 24, width: 5 },
  { col: 21, row: 24, width: 5 },
  { col: 30, row: 24, width: 5 },
  { col: 39, row: 24, width: 5 },
]

// 58 slots distributed across 7 careers, positioned to match the floor plan image
export const SLOTS: Slot[] = [
  // ─── LDI: 5 slots (sec 15 row 2 = row 5, cols 3-7) ───
  { id: 'LDI-1', career: 'LDI', col: 3, row: 5 },
  { id: 'LDI-2', career: 'LDI', col: 4, row: 5 },
  { id: 'LDI-3', career: 'LDI', col: 5, row: 5 },
  { id: 'LDI-4', career: 'LDI', col: 6, row: 5 },
  { id: 'LDI-5', career: 'LDI', col: 7, row: 5 },

  // ─── Arte (LA): 7 slots (sec 13 + 11 row 2 = row 5) ───
  // Sec 13 row 2: cols 12-16 → empty, LA, LA, empty, LA = 3 LA
  { id: 'LA-1', career: 'LA', col: 13, row: 5 },
  { id: 'LA-2', career: 'LA', col: 14, row: 5 },
  { id: 'LA-3', career: 'LA', col: 16, row: 5 },
  // Sec 11 row 2: cols 21-25 → LA, LA, empty, LA, LA = 4 LA
  { id: 'LA-4', career: 'LA', col: 21, row: 5 },
  { id: 'LA-5', career: 'LA', col: 22, row: 5 },
  { id: 'LA-6', career: 'LA', col: 24, row: 5 },
  { id: 'LA-7', career: 'LA', col: 25, row: 5 },

  // ─── LINT: 17 slots (sec 9 + 7) ───
  // Sec 9 row 1 (row 4): empty, LINT, LINT, LINT, LINT = 4 LINT (cols 31-34)
  { id: 'LINT-1', career: 'LINT', col: 31, row: 4 },
  { id: 'LINT-2', career: 'LINT', col: 32, row: 4 },
  { id: 'LINT-3', career: 'LINT', col: 33, row: 4 },
  { id: 'LINT-4', career: 'LINT', col: 34, row: 4 },
  // Sec 9 row 2 (row 5): all 5 LINT (cols 30-34)
  { id: 'LINT-5', career: 'LINT', col: 30, row: 5 },
  { id: 'LINT-6', career: 'LINT', col: 31, row: 5 },
  { id: 'LINT-7', career: 'LINT', col: 32, row: 5 },
  { id: 'LINT-8', career: 'LINT', col: 33, row: 5 },
  { id: 'LINT-9', career: 'LINT', col: 34, row: 5 },
  // Sec 7 row 1 (row 4): all 5 LINT (cols 39-43)
  { id: 'LINT-10', career: 'LINT', col: 39, row: 4 },
  { id: 'LINT-11', career: 'LINT', col: 40, row: 4 },
  { id: 'LINT-12', career: 'LINT', col: 41, row: 4 },
  { id: 'LINT-13', career: 'LINT', col: 42, row: 4 },
  { id: 'LINT-14', career: 'LINT', col: 43, row: 4 },
  // Sec 7 row 2 (row 5): LINT, LINT, LINT, empty, LDM = 3 LINT (LDM at col 43)
  { id: 'LINT-15', career: 'LINT', col: 39, row: 5 },
  { id: 'LINT-16', career: 'LINT', col: 40, row: 5 },
  { id: 'LINT-17', career: 'LINT', col: 41, row: 5 },

  // ─── LDM (Moda): 17 slots ───
  // 1 in sec 7 row 2 (col 43)
  { id: 'LDM-1', career: 'LDM', col: 43, row: 5 },
  // Left top area (rows 7-8): 4 LDM in row 8
  // Row 7: 5 empty
  // Row 8: empty, LDM, LDM, LDM, LDM (cols 4-7)
  { id: 'LDM-2', career: 'LDM', col: 4, row: 8 },
  { id: 'LDM-3', career: 'LDM', col: 5, row: 8 },
  { id: 'LDM-4', career: 'LDM', col: 6, row: 8 },
  { id: 'LDM-5', career: 'LDM', col: 7, row: 8 },
  // Left bottom area (rows 17-18): 4 LDM
  // Row 17: empty, LDM, empty, LDM, empty (2 LDM at cols 4, 6)
  { id: 'LDM-6', career: 'LDM', col: 4, row: 17 },
  { id: 'LDM-7', career: 'LDM', col: 6, row: 17 },
  // Row 18: empty, LDM, empty, empty, LDM (2 LDM at cols 4, 7)
  { id: 'LDM-8', career: 'LDM', col: 4, row: 18 },
  { id: 'LDM-9', career: 'LDM', col: 7, row: 18 },
  // Right top area (rows 7-8): 4 LDM in row 8
  // Row 7: 5 empty
  // Row 8: LDM, LDM, empty, LDM, LDM (cols 39, 40, 42, 43)
  { id: 'LDM-10', career: 'LDM', col: 39, row: 8 },
  { id: 'LDM-11', career: 'LDM', col: 40, row: 8 },
  { id: 'LDM-12', career: 'LDM', col: 42, row: 8 },
  { id: 'LDM-13', career: 'LDM', col: 43, row: 8 },
  // Right bottom area (rows 17-18): 4 LDM
  // Row 17: LDM, empty, LDM, empty, LDM (3 LDM at cols 39, 41, 43)
  { id: 'LDM-14', career: 'LDM', col: 39, row: 17 },
  { id: 'LDM-15', career: 'LDM', col: 41, row: 17 },
  { id: 'LDM-16', career: 'LDM', col: 43, row: 17 },
  // Row 18: empty, LDM, empty, empty, empty (1 LDM at col 40)
  { id: 'LDM-17', career: 'LDM', col: 40, row: 18 },

  // ─── LAED: 2 slots (sec 18 row 1 = row 21) ───
  // empty, LAED, empty, LAED, empty (cols 4 and 6)
  { id: 'LAED-1', career: 'LAED', col: 4, row: 21 },
  { id: 'LAED-2', career: 'LAED', col: 6, row: 21 },

  // ─── POSG (Posgrados): 3 slots (sec 16) ───
  // Row 21: empty, POSG, empty, empty, POSG (cols 13, 16)
  { id: 'POSG-1', career: 'POSG', col: 13, row: 21 },
  { id: 'POSG-2', career: 'POSG', col: 16, row: 21 },
  // Row 22: empty, empty, POSG, empty, empty (col 14)
  { id: 'POSG-3', career: 'POSG', col: 14, row: 22 },

  // ─── LDG: 7 slots (sec 10) ───
  // Row 21: empty, LDG, empty, LDG, LDG (cols 40, 42, 43)
  { id: 'LDG-1', career: 'LDG', col: 40, row: 21 },
  { id: 'LDG-2', career: 'LDG', col: 42, row: 21 },
  { id: 'LDG-3', career: 'LDG', col: 43, row: 21 },
  // Row 22: LDG, empty, LDG, LDG, LDG (cols 39, 41, 42, 43)
  { id: 'LDG-4', career: 'LDG', col: 39, row: 22 },
  { id: 'LDG-5', career: 'LDG', col: 41, row: 22 },
  { id: 'LDG-6', career: 'LDG', col: 42, row: 22 },
  { id: 'LDG-7', career: 'LDG', col: 43, row: 22 },
]

// Section labels (numbers) shown above/below the building
export const SECTION_LABELS = [
  // Top labels (above building border, row 1)
  { num: 7,  col: 41.5, row: 1 },
  { num: 9,  col: 32.5, row: 1 },
  { num: 11, col: 23.5, row: 1 },
  { num: 13, col: 14.5, row: 1 },
  { num: 15, col: 5.5,  row: 1 },
  // Bottom labels (below building border, row 27)
  { num: 18, col: 5.5,  row: 27 },
  { num: 16, col: 14.5, row: 27 },
  { num: 14, col: 23.5, row: 27 },
  { num: 12, col: 32.5, row: 27 },
  { num: 10, col: 41.5, row: 27 },
]

export function getSlotsByCareer(career: Career): Slot[] {
  return SLOTS.filter((s) => s.career === career)
}

export function getSlotById(id: string): Slot | undefined {
  return SLOTS.find((s) => s.id === id)
}

export function getSlotSection(slot: Slot): number | null {
  // Top sections: rows 4-5
  if (slot.row <= 5) {
    if (slot.col <= 8) return 15
    if (slot.col <= 17) return 13
    if (slot.col <= 26) return 11
    if (slot.col <= 35) return 9
    return 7
  }
  // Bottom sections: rows 21-24
  if (slot.row >= 21) {
    if (slot.col <= 8) return 18
    if (slot.col <= 17) return 16
    if (slot.col <= 26) return 14
    if (slot.col <= 35) return 12
    return 10
  }
  return null
}
