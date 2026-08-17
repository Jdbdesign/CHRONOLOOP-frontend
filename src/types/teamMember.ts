export interface TeamProject {
  name: string
  color: string
}

export interface TeamActivity {
  text: string
  time: string
  dot: string
}

export interface TeamMember {
  id: string
  name: string
  initials: string
  role: string
  dept: string
  email: string
  color: string
  online: boolean
  activeTasks: number
  completedTasks: number
  velocity: number
  completion: number
  todoTasks: number
  inProgressTasks: number
  projects: TeamProject[]
  timezone: string
  joinDate: string
  location: string
  activity: TeamActivity[]
}
