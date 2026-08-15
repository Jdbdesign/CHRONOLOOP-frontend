import { create } from 'zustand'
import type { EditSprintInput, NewSprintInput, Sprint } from '../types/sprint'
import { MOCK_SPRINTS } from '../data/mockSprints'

function formatDate(raw: string): string {
  return raw
    ? new Date(`${raw}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBD'
}

interface SprintsState {
  sprints: Sprint[]
  addSprint: (input: NewSprintInput) => void
  updateSprint: (id: string, input: EditSprintInput) => void
  removeSprint: (id: string) => void
  markComplete: (id: string) => void
}

export const useSprintsStore = create<SprintsState>((set) => ({
  sprints: MOCK_SPRINTS,
  addSprint: (input) => {
    set((state) => {
      const number = `SPRINT ${String(state.sprints.length + 1).padStart(2, '0')}`
      const newSprint: Sprint = {
        id: `s_${Date.now()}`, number, name: input.name, goal: input.goal || 'No goal defined.',
        status: 'planning', startDate: formatDate(input.startRaw), endDate: formatDate(input.endRaw),
        startRaw: input.startRaw, endRaw: input.endRaw, daysLeft: 30,
        progress: 0, storyPoints: input.storyPoints, completedPoints: 0,
        tasksTotal: 0, tasksDone: 0, inProgress: 0, todo: 0,
        color: '#EAB308', project: input.project, velocity: null,
        team: [{ i: 'JA', c: '#4A90FF' }], burndown: [], sprintTasks: [],
      }
      return { sprints: [newSprint, ...state.sprints] }
    })
  },
  updateSprint: (id, input) => {
    set((state) => ({
      sprints: state.sprints.map((s) => {
        if (s.id !== id) return s
        return {
          ...s,
          name: input.name, goal: input.goal, storyPoints: input.storyPoints,
          status: input.status, project: input.project,
          startDate: input.startRaw ? formatDate(input.startRaw) : s.startDate,
          startRaw: input.startRaw || s.startRaw,
          endDate: input.endRaw ? formatDate(input.endRaw) : s.endDate,
          endRaw: input.endRaw || s.endRaw,
          progress: input.status === 'completed' ? 100 : s.progress,
        }
      }),
    }))
  },
  removeSprint: (id) => {
    set((state) => ({ sprints: state.sprints.filter((s) => s.id !== id) }))
  },
  markComplete: (id) => {
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === id ? { ...s, status: 'completed', progress: 100 } : s)),
    }))
  },
}))
