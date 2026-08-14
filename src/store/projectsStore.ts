import { create } from 'zustand'
import type { NewProjectInput, Project } from '../types/project'
import { MOCK_PROJECTS } from '../data/mockProjects'

interface ProjectsState {
  projects: Project[]
  addProject: (input: NewProjectInput) => void
  removeProject: (id: string) => void
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: MOCK_PROJECTS,
  addProject: (input) => {
    set((state) => ({
      projects: [
        {
          id: `p_new_${Date.now()}`,
          name: input.name,
          client: input.client || 'No client',
          category: input.category,
          status: 'active',
          priority: input.priority,
          progress: 0,
          color: input.color,
          tasksTotal: 0,
          tasksDone: 0,
          // Hardcoded to 30 regardless of the chosen due date — matches the
          // original's own btn-create-project handler (index.html:8498),
          // which never computes a real day-delta from proj-due-input.
          dueDays: 30,
          dueDate: input.dueDate,
          desc: input.desc || 'No description provided.',
          team: [{ i: 'JA', c: '#4A90FF', n: 'Jacobs A.' }],
          milestones: [],
        },
        ...state.projects,
      ],
    }))
  },
  removeProject: (id) => {
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }))
  },
}))
