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
// Sections each 6 cells wide, with 1-cell gaps between sections
//   Sec 15: cols 3-8
//   Sec 13: cols 10-15
//   Sec 11: cols 17-22
//   Sec 9 : cols 24-29
//   Sec 7 : cols 31-36
export const GRID = {
  cols: 40,
  rows: 28,
  building: { col: 0, row: 1, width: 40, height: 25 },
  // Stage outer rectangle (heavy black border)
  stage: { col: 9, row: 6, width: 22, height: 14 },
  // L-shaped stairs (gray) inside stage:
  //   - Narrow top: 4 wide × 2 tall (top-right of stage)
  //   - Wide main: 6 wide × 12 tall (right portion of stage, extends 2 cells left)
  stairsTop: { col: 26, row: 6, width: 4, height: 2 },
  stairsMain: { col: 24, row: 8, width: 6, height: 12 },
}

// All tables visible on the floor plan (each 6 cells wide)
export const TABLES: Table[] = [
  // ─── Top tables, row 1 (row 3) — sections 15, 13, 11, 9, 7 ───
  { col: 3, row: 3, width: 6 },
  { col: 10, row: 3, width: 6 },
  { col: 17, row: 3, width: 6 },
  { col: 24, row: 3, width: 6 },
  { col: 31, row: 3, width: 6 },
  // Top tables, row 2 (row 4)
  { col: 3, row: 4, width: 6 },
  { col: 10, row: 4, width: 6 },
  { col: 17, row: 4, width: 6 },
  { col: 24, row: 4, width: 6 },
  { col: 31, row: 4, width: 6 },

  // ─── Side tables left, top half (rows 7-8) ───
  { col: 3, row: 7, width: 6 },
  { col: 3, row: 8, width: 6 },
  // Side tables left, bottom half (rows 16-17)
  { col: 3, row: 16, width: 6 },
  { col: 3, row: 17, width: 6 },

  // ─── Side tables right, top half (rows 7-8) ───
  { col: 31, row: 7, width: 6 },
  { col: 31, row: 8, width: 6 },
  // Side tables right, bottom half (rows 16-17)
  { col: 31, row: 16, width: 6 },
  { col: 31, row: 17, width: 6 },

  // ─── Bottom tables, row 1 (row 20) — sections 18, 16, 14, 12, 10 ───
  { col: 3, row: 20, width: 6 },
  { col: 10, row: 20, width: 6 },
  { col: 17, row: 20, width: 6 },
  { col: 24, row: 20, width: 6 },
  { col: 31, row: 20, width: 6 },
  // Bottom tables, row 2 (row 21)
  { col: 3, row: 21, width: 6 },
  { col: 10, row: 21, width: 6 },
  { col: 17, row: 21, width: 6 },
  { col: 24, row: 21, width: 6 },
  { col: 31, row: 21, width: 6 },
  // Bottom tables, row 3 (row 23) — small gap before this
  { col: 3, row: 23, width: 6 },
  { col: 10, row: 23, width: 6 },
  { col: 17, row: 23, width: 6 },
  { col: 24, row: 23, width: 6 },
  { col: 31, row: 23, width: 6 },
]

// 58 slots placed to match the PDF floor plan
export const SLOTS: Slot[] = [
  // ─── LDI: 5 (sec 15 row 4) — cols 3-8 with 1 empty in middle ───
  // Pattern: G G G _ G G (cols 3, 4, 5, 7, 8)
  { id: 'LDI-1', career: 'LDI', col: 3, row: 4 },
  { id: 'LDI-2', career: 'LDI', col: 4, row: 4 },
  { id: 'LDI-3', career: 'LDI', col: 5, row: 4 },
  { id: 'LDI-4', career: 'LDI', col: 7, row: 4 },
  { id: 'LDI-5', career: 'LDI', col: 8, row: 4 },

  // ─── Arte (LA): 7 (sec 13 + 11) ───
  // Sec 13 row 4 (cols 10-15): _ B _ B B _ (3 at cols 11, 13, 14)
  { id: 'LA-1', career: 'LA', col: 11, row: 4 },
  { id: 'LA-2', career: 'LA', col: 13, row: 4 },
  { id: 'LA-3', career: 'LA', col: 14, row: 4 },
  // Sec 11 row 4 (cols 17-22): B _ B _ _ B (3 at cols 17, 19, 22)
  { id: 'LA-4', career: 'LA', col: 17, row: 4 },
  { id: 'LA-5', career: 'LA', col: 19, row: 4 },
  { id: 'LA-6', career: 'LA', col: 22, row: 4 },
  // Sec 11 row 3 (extra): _ B _ _ _ _ (1 at col 18)
  { id: 'LA-7', career: 'LA', col: 18, row: 3 },

  // ─── LINT: 17 (sec 9 + 7) ───
  // Sec 9 row 3 (cols 24-29): _ Y Y _ Y Y (4 at cols 25, 26, 28, 29)
  { id: 'LINT-1', career: 'LINT', col: 25, row: 3 },
  { id: 'LINT-2', career: 'LINT', col: 26, row: 3 },
  { id: 'LINT-3', career: 'LINT', col: 28, row: 3 },
  { id: 'LINT-4', career: 'LINT', col: 29, row: 3 },
  // Sec 9 row 4: Y Y _ Y Y Y (5 at cols 24, 25, 27, 28, 29)
  { id: 'LINT-5', career: 'LINT', col: 24, row: 4 },
  { id: 'LINT-6', career: 'LINT', col: 25, row: 4 },
  { id: 'LINT-7', career: 'LINT', col: 27, row: 4 },
  { id: 'LINT-8', career: 'LINT', col: 28, row: 4 },
  { id: 'LINT-9', career: 'LINT', col: 29, row: 4 },
  // Sec 7 row 3 (cols 31-36): Y Y _ Y Y Y (5 at cols 31, 32, 34, 35, 36)
  { id: 'LINT-10', career: 'LINT', col: 31, row: 3 },
  { id: 'LINT-11', career: 'LINT', col: 32, row: 3 },
  { id: 'LINT-12', career: 'LINT', col: 34, row: 3 },
  { id: 'LINT-13', career: 'LINT', col: 35, row: 3 },
  { id: 'LINT-14', career: 'LINT', col: 36, row: 3 },
  // Sec 7 row 4: Y Y _ Y M _ (3 LINT at cols 31, 32, 34 + 1 LDM at col 35)
  { id: 'LINT-15', career: 'LINT', col: 31, row: 4 },
  { id: 'LINT-16', career: 'LINT', col: 32, row: 4 },
  { id: 'LINT-17', career: 'LINT', col: 34, row: 4 },

  // ─── LDM (Moda): 17 ───
  // Sec 7 row 4 col 35 (1)
  { id: 'LDM-1', career: 'LDM', col: 35, row: 4 },
  // Left top side (rows 7-8, cols 3-8) — 4 LDM in row 8 with pattern _ M M _ M M (4 at cols 4, 5, 7, 8)
  { id: 'LDM-2', career: 'LDM', col: 4, row: 8 },
  { id: 'LDM-3', career: 'LDM', col: 5, row: 8 },
  { id: 'LDM-4', career: 'LDM', col: 7, row: 8 },
  { id: 'LDM-5', career: 'LDM', col: 8, row: 8 },
  // Left bottom side (rows 16-17, cols 3-8) — 4 LDM
  { id: 'LDM-6', career: 'LDM', col: 4, row: 16 },
  { id: 'LDM-7', career: 'LDM', col: 5, row: 16 },
  { id: 'LDM-8', career: 'LDM', col: 7, row: 16 },
  { id: 'LDM-9', career: 'LDM', col: 8, row: 16 },
  // Right top side (rows 7-8, cols 31-36) — 4 LDM
  { id: 'LDM-10', career: 'LDM', col: 32, row: 8 },
  { id: 'LDM-11', career: 'LDM', col: 33, row: 8 },
  { id: 'LDM-12', career: 'LDM', col: 35, row: 8 },
  { id: 'LDM-13', career: 'LDM', col: 36, row: 8 },
  // Right bottom side (rows 16-17, cols 31-36) — 4 LDM
  { id: 'LDM-14', career: 'LDM', col: 32, row: 16 },
  { id: 'LDM-15', career: 'LDM', col: 33, row: 16 },
  { id: 'LDM-16', career: 'LDM', col: 35, row: 16 },
  { id: 'LDM-17', career: 'LDM', col: 36, row: 16 },

  // ─── LAED: 2 (sec 18 row 20) — pattern _ O _ O _ _ ───
  { id: 'LAED-1', career: 'LAED', col: 4, row: 20 },
  { id: 'LAED-2', career: 'LAED', col: 6, row: 20 },

  // ─── POSG: 3 (sec 16) ───
  // Row 20 (cols 10-15): _ R _ _ R _ (2 at cols 11, 14)
  { id: 'POSG-1', career: 'POSG', col: 11, row: 20 },
  { id: 'POSG-2', career: 'POSG', col: 14, row: 20 },
  // Row 21: _ _ R _ _ _ (1 at col 12)
  { id: 'POSG-3', career: 'POSG', col: 12, row: 21 },

  // ─── LDG: 7 (sec 10) ───
  // Row 20 (cols 31-36): _ P P P P _ (4 contiguous at cols 32, 33, 34, 35)
  { id: 'LDG-1', career: 'LDG', col: 32, row: 20 },
  { id: 'LDG-2', career: 'LDG', col: 33, row: 20 },
  { id: 'LDG-3', career: 'LDG', col: 34, row: 20 },
  { id: 'LDG-4', career: 'LDG', col: 35, row: 20 },
  // Row 23: _ _ P _ P P _ (3 at cols 33, 35, 36)
  { id: 'LDG-5', career: 'LDG', col: 33, row: 23 },
  { id: 'LDG-6', career: 'LDG', col: 35, row: 23 },
  { id: 'LDG-7', career: 'LDG', col: 36, row: 23 },
]

export const SECTION_LABELS = [
  // Top labels — left to right: 15, 13, 11, 9, 7
  { num: 15, col: 5.5,  row: 0 },
  { num: 13, col: 12.5, row: 0 },
  { num: 11, col: 19.5, row: 0 },
  { num: 9,  col: 26.5, row: 0 },
  { num: 7,  col: 33.5, row: 0 },
  // Bottom labels — left to right: 18, 16, 14, 12, 10
  { num: 18, col: 5.5,  row: 26 },
  { num: 16, col: 12.5, row: 26 },
  { num: 14, col: 19.5, row: 26 },
  { num: 12, col: 26.5, row: 26 },
  { num: 10, col: 33.5, row: 26 },
]

export function getSlotsByCareer(career: Career): Slot[] {
  return SLOTS.filter((s) => s.career === career)
}

export function getSlotById(id: string): Slot | undefined {
  return SLOTS.find((s) => s.id === id)
}

export function getSlotSection(slot: Slot): number | null {
  if (slot.row <= 4) {
    if (slot.col <= 9)  return 15
    if (slot.col <= 16) return 13
    if (slot.col <= 23) return 11
    if (slot.col <= 30) return 9
    return 7
  }
  if (slot.row >= 20) {
    if (slot.col <= 9)  return 18
    if (slot.col <= 16) return 16
    if (slot.col <= 23) return 14
    if (slot.col <= 30) return 12
    return 10
  }
  return null
}
