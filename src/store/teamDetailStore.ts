import { create } from 'zustand'

interface TeamDetailState {
  openMemberId: string | null
  open: (id: string) => void
  close: () => void
}

export const useTeamDetailStore = create<TeamDetailState>((set) => ({
  openMemberId: null,
  open: (id) => set({ openMemberId: id }),
  close: () => set({ openMemberId: null }),
}))
