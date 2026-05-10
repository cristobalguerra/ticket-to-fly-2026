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

export const GRID = {
  cols: 50,
  rows: 30,
  building: { col: 0, row: 2, width: 50, height: 26 },
  // Stage: heavy black border, white interior with gray stairs INSIDE on the right
  stage: { col: 11, row: 7, width: 27, height: 13 },
  // Stairs gray block — INSIDE the stage, no protrusion
  stairs: { col: 32, row: 7, width: 6, height: 13 },
}

// All tables on the floor (5-cell wide, 1-cell tall) — empty cells visible for spatial context
export const TABLES: Table[] = [
  // Top tables, row 1 (row 4) — sections 15, 13, 11, 9, 7
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

  // Left side, top half (rows 7-8)
  { col: 3, row: 7, width: 5 },
  { col: 3, row: 8, width: 5 },
  // Left side, bottom half (rows 17-18)
  { col: 3, row: 17, width: 5 },
  { col: 3, row: 18, width: 5 },

  // Right side, top half (rows 7-8)
  { col: 39, row: 7, width: 5 },
  { col: 39, row: 8, width: 5 },
  // Right side, bottom half (rows 17-18)
  { col: 39, row: 17, width: 5 },
  { col: 39, row: 18, width: 5 },

  // Bottom tables, row 1 (row 21) — sections 18, 16, 14, 12, 10
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
  // Bottom tables, row 3 (row 23)
  { col: 3, row: 23, width: 5 },
  { col: 12, row: 23, width: 5 },
  { col: 21, row: 23, width: 5 },
  { col: 30, row: 23, width: 5 },
  { col: 39, row: 23, width: 5 },
]

// 58 slots, spaced (no horizontally adjacent slots within the same row)
export const SLOTS: Slot[] = [
  // ─── LDI: 5 (sec 15) — alternating ───
  // Row 4 (top tables row 1): _, LDI, _, LDI, _
  { id: 'LDI-1', career: 'LDI', col: 4, row: 4 },
  { id: 'LDI-2', career: 'LDI', col: 6, row: 4 },
  // Row 5: LDI, _, LDI, _, LDI
  { id: 'LDI-3', career: 'LDI', col: 3, row: 5 },
  { id: 'LDI-4', career: 'LDI', col: 5, row: 5 },
  { id: 'LDI-5', career: 'LDI', col: 7, row: 5 },

  // ─── Arte (LA): 7 (sec 13 + 11) — alternating ───
  // Sec 13 row 5: LA, _, LA, _, LA
  { id: 'LA-1', career: 'LA', col: 12, row: 5 },
  { id: 'LA-2', career: 'LA', col: 14, row: 5 },
  { id: 'LA-3', career: 'LA', col: 16, row: 5 },
  // Sec 11 row 4: _, LA, _, _, _ (1 stagger)
  { id: 'LA-4', career: 'LA', col: 22, row: 4 },
  // Sec 11 row 5: LA, _, LA, _, LA
  { id: 'LA-5', career: 'LA', col: 21, row: 5 },
  { id: 'LA-6', career: 'LA', col: 23, row: 5 },
  { id: 'LA-7', career: 'LA', col: 25, row: 5 },

  // ─── LINT: 17 (sec 9 + 7) — alternating, uses both rows densely ───
  // Sec 9 row 4: _, LINT, _, LINT, _
  { id: 'LINT-1', career: 'LINT', col: 31, row: 4 },
  { id: 'LINT-2', career: 'LINT', col: 33, row: 4 },
  // Sec 9 row 5: LINT, _, LINT, _, LINT
  { id: 'LINT-3', career: 'LINT', col: 30, row: 5 },
  { id: 'LINT-4', career: 'LINT', col: 32, row: 5 },
  { id: 'LINT-5', career: 'LINT', col: 34, row: 5 },
  // Sec 7 row 4: LINT, _, LINT, _, LINT
  { id: 'LINT-6', career: 'LINT', col: 39, row: 4 },
  { id: 'LINT-7', career: 'LINT', col: 41, row: 4 },
  { id: 'LINT-8', career: 'LINT', col: 43, row: 4 },
  // Sec 7 row 5: _, LINT, _, LINT, _
  { id: 'LINT-9',  career: 'LINT', col: 40, row: 5 },
  { id: 'LINT-10', career: 'LINT', col: 42, row: 5 },
  // Need 7 more LINT — spread to side tables top (rows 7-8) right of stage
  // Right top row 7: LINT, _, LINT, _, LINT
  { id: 'LINT-11', career: 'LINT', col: 39, row: 7 },
  { id: 'LINT-12', career: 'LINT', col: 41, row: 7 },
  { id: 'LINT-13', career: 'LINT', col: 43, row: 7 },
  // Right top row 8: _, LINT, _, LINT, _
  { id: 'LINT-14', career: 'LINT', col: 40, row: 8 },
  { id: 'LINT-15', career: 'LINT', col: 42, row: 8 },
  // Sec 9 row 4 col 34 (extra)
  { id: 'LINT-16', career: 'LINT', col: 34, row: 4 },
  // Sec 9 row 4 col 30 (extra at start)
  { id: 'LINT-17', career: 'LINT', col: 30, row: 4 },

  // ─── LDM (Moda): 17 — left side + 1 in section near right ───
  // Left top, row 7: LDM, _, LDM, _, LDM
  { id: 'LDM-1', career: 'LDM', col: 3, row: 7 },
  { id: 'LDM-2', career: 'LDM', col: 5, row: 7 },
  { id: 'LDM-3', career: 'LDM', col: 7, row: 7 },
  // Left top, row 8: _, LDM, _, LDM, _
  { id: 'LDM-4', career: 'LDM', col: 4, row: 8 },
  { id: 'LDM-5', career: 'LDM', col: 6, row: 8 },
  // Left bottom, row 17: LDM, _, LDM, _, LDM
  { id: 'LDM-6', career: 'LDM', col: 3, row: 17 },
  { id: 'LDM-7', career: 'LDM', col: 5, row: 17 },
  { id: 'LDM-8', career: 'LDM', col: 7, row: 17 },
  // Left bottom, row 18: _, LDM, _, LDM, _
  { id: 'LDM-9',  career: 'LDM', col: 4, row: 18 },
  { id: 'LDM-10', career: 'LDM', col: 6, row: 18 },
  // Right bottom, row 17: LDM, _, LDM, _, LDM
  { id: 'LDM-11', career: 'LDM', col: 39, row: 17 },
  { id: 'LDM-12', career: 'LDM', col: 41, row: 17 },
  { id: 'LDM-13', career: 'LDM', col: 43, row: 17 },
  // Right bottom, row 18: _, LDM, _, LDM, _
  { id: 'LDM-14', career: 'LDM', col: 40, row: 18 },
  { id: 'LDM-15', career: 'LDM', col: 42, row: 18 },
  // Sec 7 row 4 col 39 — wait that's LINT. Move to row 5 col 39 instead
  // Actually we need 2 more. Add to sec 11 row 4 _, _, _, _, LDM (col 25)? No that's Arte area.
  // Let me put 2 more LDM in sec 11 row 4 col 25 — no that's near LA-7
  // Use right top row 7 left side or somewhere else. Already used rows 7-8.
  // Need 2 more total. Add to left bottom row 18 cols 3, 7? Currently empty there. Yes.
  { id: 'LDM-16', career: 'LDM', col: 3, row: 18 },
  { id: 'LDM-17', career: 'LDM', col: 7, row: 18 },

  // ─── LAED: 2 (sec 18 row 21) — spaced ───
  { id: 'LAED-1', career: 'LAED', col: 4, row: 21 },
  { id: 'LAED-2', career: 'LAED', col: 6, row: 21 },

  // ─── POSG: 3 (sec 16) — spaced ───
  // Row 21: _, POSG, _, _, POSG
  { id: 'POSG-1', career: 'POSG', col: 13, row: 21 },
  { id: 'POSG-2', career: 'POSG', col: 16, row: 21 },
  // Row 22: _, _, POSG, _, _
  { id: 'POSG-3', career: 'POSG', col: 14, row: 22 },

  // ─── LDG: 7 (sec 10) — spaced across 3 rows ───
  // Row 21: _, LDG, _, LDG, _
  { id: 'LDG-1', career: 'LDG', col: 40, row: 21 },
  { id: 'LDG-2', career: 'LDG', col: 42, row: 21 },
  // Row 22: LDG, _, LDG, _, LDG
  { id: 'LDG-3', career: 'LDG', col: 39, row: 22 },
  { id: 'LDG-4', career: 'LDG', col: 41, row: 22 },
  { id: 'LDG-5', career: 'LDG', col: 43, row: 22 },
  // Row 23: _, LDG, _, LDG, _
  { id: 'LDG-6', career: 'LDG', col: 40, row: 23 },
  { id: 'LDG-7', career: 'LDG', col: 42, row: 23 },
]

export const SECTION_LABELS = [
  // Top labels
  { num: 7,  col: 41.5, row: 1 },
  { num: 9,  col: 32.5, row: 1 },
  { num: 11, col: 23.5, row: 1 },
  { num: 13, col: 14.5, row: 1 },
  { num: 15, col: 5.5,  row: 1 },
  // Bottom labels
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
  if (slot.row <= 5) {
    if (slot.col <= 8) return 15
    if (slot.col <= 17) return 13
    if (slot.col <= 26) return 11
    if (slot.col <= 35) return 9
    return 7
  }
  if (slot.row >= 21) {
    if (slot.col <= 8) return 18
    if (slot.col <= 17) return 16
    if (slot.col <= 26) return 14
    if (slot.col <= 35) return 12
    return 10
  }
  return null
}
