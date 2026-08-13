import { create } from 'zustand'

interface TaskModalState {
  isOpen: boolean
  editingTaskId: number | null
  openCreate: () => void
  openEdit: (id: number) => void
  close: () => void
}

export const useTaskModalStore = create<TaskModalState>((set) => ({
  isOpen: false,
  editingTaskId: null,
  openCreate: () => set({ isOpen: true, editingTaskId: null }),
  openEdit: (id) => set({ isOpen: true, editingTaskId: id }),
  close: () => set({ isOpen: false, editingTaskId: null }),
}))
