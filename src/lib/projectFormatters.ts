import { PlayCircle, Loader2, CheckCircle2, AlertCircle, PauseCircle } from 'lucide-react'
import type { ProjectPriority, ProjectStatus } from '../types/project'

export const PROJECT_STATUS_CONFIG = {
  active: { label: 'Active', icon: PlayCircle },
  'in-progress': { label: 'In Progress', icon: Loader2 },
  completed: { label: 'Completed', icon: CheckCircle2 },
  overdue: { label: 'Overdue', icon: AlertCircle },
  'on-hold': { label: 'On Hold', icon: PauseCircle },
} as const satisfies Record<ProjectStatus, { label: string; icon: unknown }>

export function priorityLabel(priority: ProjectPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1)
}

export function getProjDueClass(dueDays: number): 'normal' | 'soon' | 'overdue' {
  if (dueDays < 0) return 'overdue'
  if (dueDays <= 7) return 'soon'
  return 'normal'
}
