import { create } from 'zustand'

interface TaskDetailState {
  openTaskId: number | null
  open: (id: number) => void
  close: () => void
}

export const useTaskDetailStore = create<TaskDetailState>((set) => ({
  openTaskId: null,
  open: (id) => set({ openTaskId: id }),
  close: () => set({ openTaskId: null }),
}))
