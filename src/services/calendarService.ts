import type { CalendarEvent, NewCalendarEventInput } from '../types/calendar'

const TYPE_COLORS: Record<string, string> = {
  task: '#4A90FF',
  project: '#A855F7',
  sprint: '#00D4AA',
  meeting: '#FF8C42',
}

export function buildNewCalendarEvent(input: NewCalendarEventInput): Promise<CalendarEvent> {
  return Promise.resolve({
    id: 'user-' + Date.now(),
    type: input.type,
    title: input.title,
    date: input.date,
    startDate: input.date,
    endDate: input.endDate || input.date,
    time: input.time,
    duration: 60,
    project: input.project,
    assignee: input.assignee,
    priority: input.priority,
    status: 'todo',
    color: TYPE_COLORS[input.type] || '#4A90FF',
    progress: 0,
    notes: input.notes,
    isMultiDay: !!(input.endDate && input.endDate !== input.date),
  })
}
