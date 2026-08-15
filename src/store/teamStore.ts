import { create } from 'zustand'
import type { TeamMember } from '../types/teamMember'
import { TEAM_MEMBERS } from '../data/mockTeamMembers'

interface TeamState {
  members: TeamMember[]
}

export const useTeamStore = create<TeamState>(() => ({
  members: TEAM_MEMBERS,
}))
