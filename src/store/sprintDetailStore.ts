import { create } from 'zustand'

interface SprintDetailState {
  openSprintId: string | null
  open: (id: string) => void
  close: () => void
}

export const useSprintDetailStore = create<SprintDetailState>((set) => ({
  openSprintId: null,
  open: (id) => set({ openSprintId: id }),
  close: () => set({ openSprintId: null }),
}))
