import { create } from 'zustand'
import type { EditSprintInput, NewSprintInput, Sprint } from '../types/sprint'
import { MOCK_SPRINTS } from '../data/mockSprints'
import * as sprintService from '../services/sprintService'

interface SprintsState {
  sprints: Sprint[]
  addSprint: (input: NewSprintInput) => Promise<void>
  updateSprint: (id: string, input: EditSprintInput) => Promise<void>
  removeSprint: (id: string) => Promise<void>
  markComplete: (id: string) => Promise<void>
}

export const useSprintsStore = create<SprintsState>((set, get) => ({
  sprints: MOCK_SPRINTS,
  addSprint: async (input) => {
    const { sprints } = get()
    const newSprint = await sprintService.buildNewSprint(sprints, input)
    set((state) => ({ sprints: [newSprint, ...state.sprints] }))
  },
  updateSprint: async (id, input) => {
    const { sprints } = get()
    const target = sprints.find((s) => s.id === id)
    if (!target) return
    const edited = await sprintService.applySprintEdit(target, input)
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === id ? edited : s)),
    }))
  },
  removeSprint: async (id) => {
    await sprintService.withoutSprint(get().sprints, id)
    set((state) => ({ sprints: state.sprints.filter((s) => s.id !== id) }))
  },
  markComplete: async (id) => {
    const { sprints } = get()
    const target = sprints.find((s) => s.id === id)
    if (!target) return
    const completed = await sprintService.completeSprint(target)
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === id ? completed : s)),
    }))
  },
}))
