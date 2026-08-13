import type { TaskPriority, TaskStatus } from '../types/task'

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; dotColor: string }> = {
  todo: { label: 'To Do', color: '#4A90FF', dotColor: 'var(--accent-blue)' },
  'in-progress': { label: 'In Progress', color: '#EAB308', dotColor: 'var(--accent-yellow)' },
  done: { label: 'Done', color: '#22C55E', dotColor: 'var(--accent-green)' },
  overdue: { label: 'Overdue', color: '#FF4D4D', dotColor: 'var(--accent-red)' },
}

export const PRIORITY_ORDER: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 }
export const STATUS_ORDER: Record<TaskStatus, number> = { overdue: 0, 'in-progress': 1, todo: 2, done: 3 }

export function getDueClass(due: string, status: TaskStatus): 'normal' | 'soon' | 'overdue-chip' {
  if (status === 'done') return 'normal'
  const diffDays = (new Date(due).getTime() - Date.now()) / 86400000
  if (diffDays < 0) return 'overdue-chip'
  if (diffDays <= 3) return 'soon'
  return 'normal'
}

export function formatDue(due: string): string {
  return new Date(due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
