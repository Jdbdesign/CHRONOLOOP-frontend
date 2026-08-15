export type CalendarView = 'month' | 'week' | 'day' | 'agenda'
export type CalendarFilter = 'all' | 'task' | 'project' | 'sprint' | 'meeting'
export type CalendarEventType = 'task' | 'project' | 'sprint' | 'meeting'

export interface CalendarEvent {
  id: string
  type: CalendarEventType
  title: string
  date: string // ISO YYYY-MM-DD (primary/start date)
  startDate?: string // ISO — for multi-day spans
  endDate?: string // ISO — for multi-day spans
  time?: string // HH:mm
  duration?: number // minutes
  project?: string
  assignee?: string
  priority?: string
  status?: string
  color: string
  progress?: number
  notes?: string
  sourceId?: string | number
  isMultiDay?: boolean
  sprintNum?: string
  subtasks?: { t: string; done: boolean }[]
}

export interface NewCalendarEventInput {
  type: CalendarEventType
  title: string
  date: string // ISO
  time: string // HH:mm
  endDate?: string // ISO, optional for multi-day
  project: string
  priority: string
  assignee: string
  notes: string
}
