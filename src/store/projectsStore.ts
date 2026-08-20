import { create } from 'zustand'
import type { NewProjectInput, Project } from '../types/project'
import { MOCK_PROJECTS } from '../data/mockProjects'
import * as projectService from '../services/projectService'

interface ProjectsState {
  projects: Project[]
  addProject: (input: NewProjectInput) => Promise<void>
  removeProject: (id: string) => Promise<void>
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: MOCK_PROJECTS,
  addProject: async (input) => {
    const newProject = await projectService.buildNewProject(input)
    set((state) => ({ projects: [newProject, ...state.projects] }))
  },
  removeProject: async (id) => {
    await projectService.withoutProject(get().projects, id)
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }))
  },
}))
