import { create } from 'zustand'

interface ProjectDetailState {
  openProjectId: string | null
  open: (id: string) => void
  close: () => void
}

export const useProjectDetailStore = create<ProjectDetailState>((set) => ({
  openProjectId: null,
  open: (id) => set({ openProjectId: id }),
  close: () => set({ openProjectId: null }),
}))
