export type ProjectStatus = 'active' | 'in-progress' | 'completed' | 'overdue' | 'on-hold'
export type ProjectPriority = 'high' | 'medium' | 'low'

export interface ProjectTeamMember {
  i: string
  c: string
  n: string
}

export interface ProjectMilestone {
  l: string
  done: boolean
  d: string
}

export interface Project {
  id: string
  name: string
  client: string
  category: string
  status: ProjectStatus
  priority: ProjectPriority
  progress: number
  color: string
  tasksTotal: number
  tasksDone: number
  dueDays: number
  dueDate: string
  desc: string
  team: ProjectTeamMember[]
  milestones: ProjectMilestone[]
}

export interface NewProjectInput {
  name: string
  client: string
  category: string
  priority: ProjectPriority
  dueDate: string
  color: string
  desc: string
}
