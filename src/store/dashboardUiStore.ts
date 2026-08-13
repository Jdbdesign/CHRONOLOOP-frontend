import { create } from 'zustand'

export type DashboardModal = 'activity' | 'invite' | 'member' | null

interface DashboardUiState {
  activeModal: DashboardModal
  selectedMemberId: string | null
  openActivity: () => void
  openInvite: () => void
  openMember: (id: string) => void
  closeModal: () => void
}

export const useDashboardUiStore = create<DashboardUiState>((set) => ({
  activeModal: null,
  selectedMemberId: null,
  openActivity: () => set({ activeModal: 'activity' }),
  openInvite: () => set({ activeModal: 'invite' }),
  openMember: (id) => set({ activeModal: 'member', selectedMemberId: id }),
  closeModal: () => set({ activeModal: null }),
}))
