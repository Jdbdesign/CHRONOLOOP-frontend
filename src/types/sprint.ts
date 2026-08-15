export type SprintStatus = 'active' | 'completed' | 'planning' | 'upcoming'

export interface SprintTeamMember {
  i: string
  c: string
}

export interface SprintTask {
  title: string
  status: 'done' | 'in-progress' | 'todo'
}

export interface Sprint {
  id: string
  number: string
  name: string
  goal: string
  status: SprintStatus
  startDate: string
  endDate: string
  startRaw?: string
  endRaw?: string
  daysLeft: number
  progress: number
  storyPoints: number
  completedPoints: number
  tasksTotal: number
  tasksDone: number
  inProgress: number
  todo: number
  color: string
  project: string
  velocity: number | null
  team: SprintTeamMember[]
  burndown: (number | null)[]
  sprintTasks: SprintTask[]
}

export interface NewSprintInput {
  name: string
  goal: string
  startRaw: string
  endRaw: string
  storyPoints: number
  project: string
}

export interface EditSprintInput {
  name: string
  goal: string
  storyPoints: number
  status: SprintStatus
  project: string
  startRaw: string
  endRaw: string
}
