import { create } from 'zustand'

interface SprintModalState {
  isNewOpen: boolean
  editingSprintId: string | null
  openNew: () => void
  closeNew: () => void
  openEdit: (id: string) => void
  closeEdit: () => void
}

export const useSprintModalStore = create<SprintModalState>((set) => ({
  isNewOpen: false,
  editingSprintId: null,
  openNew: () => set({ isNewOpen: true }),
  closeNew: () => set({ isNewOpen: false }),
  openEdit: (id) => set({ editingSprintId: id }),
  closeEdit: () => set({ editingSprintId: null }),
}))
