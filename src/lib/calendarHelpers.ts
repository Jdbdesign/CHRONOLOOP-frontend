import { parse, format, addMonths, addDays, startOfMonth, endOfMonth } from 'date-fns'
import type { CalendarEvent, CalendarEventType, CalendarFilter, CalendarView } from '../types/calendar'
import type { Task } from '../types/task'
import type { Project } from '../types/project'
import type { Sprint } from '../types/sprint'

// ---- Date parsing helpers ----

/**
 * Parse a date string with an explicit format.
 * Tasks use ISO 'yyyy-MM-dd'; projects/sprints use 'MMM d, yyyy'.
 */
export function parseCalDate(dateStr: string, fmt: 'iso' | 'readable'): Date {
  if (fmt === 'iso') return parse(dateStr, 'yyyy-MM-dd', new Date())
  return parse(dateStr, 'MMM d, yyyy', new Date())
}

/** Convert a Date to ISO string YYYY-MM-DD */
export function calToISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Format time string "HH:mm" to display format like "10am", "2:30pm" */
export function calFmtTime(t: string | undefined): string {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ap = h >= 12 ? 'pm' : 'am'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return h12 + (m > 0 ? ':' + String(m).padStart(2, '0') : '') + ap
}

/** Get the Monday of the week containing the given date */
export function calWeekStart(d: Date): Date {
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.getFullYear(), d.getMonth(), diff)
}

/** Compute the period title for the given view and date */
export function calPeriodTitle(view: CalendarView, d: Date): string {
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  if (view === 'month') return MONTHS[d.getMonth()] + ' ' + d.getFullYear()
  if (view === 'week') {
    const ws = calWeekStart(d)
    const we = new Date(ws.getTime() + 6 * 86400000)
    if (ws.getMonth() === we.getMonth()) {
      return MONTHS[ws.getMonth()] + ' ' + ws.getDate() + ' – ' + we.getDate() + ', ' + ws.getFullYear()
    }
    return MONTHS[ws.getMonth()] + ' ' + ws.getDate() + ' – ' + MONTHS[we.getMonth()] + ' ' + we.getDate()
  }
  if (view === 'day') return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate()
  return 'Agenda · ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear()
}

/** Compute the next currentDate after navigation */
export function calNavigate(view: CalendarView, current: Date, dir: 1 | -1): Date {
  if (view === 'month' || view === 'agenda') return addMonths(current, dir)
  if (view === 'week') return addDays(current, dir * 7)
  return addDays(current, dir)
}

// ---- Event aggregation ----

const TIME_MAP: Record<number, string> = {
  1: '09:00', 2: '10:00', 3: '11:00', 4: '13:00', 5: '14:00',
  6: '15:00', 7: '16:00', 8: '09:30', 9: '10:30', 10: '11:30',
  11: '13:30', 12: '14:30', 13: '15:30', 14: '16:30', 15: '17:00',
}

function taskStatusColor(status: string): string {
  if (status === 'done') return '#22C55E'
  if (status === 'overdue') return '#FF4D4D'
  if (status === 'in-progress') return '#EAB308'
  return '#4A90FF'
}

export function getCalendarEvents(
  tasks: Task[],
  projects: Project[],
  sprints: Sprint[],
  meetings: CalendarEvent[],
  userEvents: CalendarEvent[],
  filter: CalendarFilter,
): CalendarEvent[] {
  const events: CalendarEvent[] = []

  // Tasks
  tasks.forEach((t) => {
    events.push({
      id: 'task-' + t.id,
      type: 'task',
      title: t.title,
      date: t.due,
      time: TIME_MAP[t.id] || '10:00',
      duration: 60,
      project: t.project,
      assignee: t.assignee,
      priority: t.priority,
      status: t.status,
      color: taskStatusColor(t.status),
      progress: t.status === 'done' ? 100 : t.status === 'in-progress' ? 50 : 0,
      subtasks: t.subtasks,
      notes: t.description,
      sourceId: t.id,
    })
  })

  // Projects
  projects.forEach((p) => {
    const dueDate = parseCalDate(p.dueDate, 'readable')
    const startDate = addDays(dueDate, -28)
    events.push({
      id: 'proj-' + p.id,
      type: 'project',
      title: p.name,
      date: calToISO(dueDate),
      startDate: calToISO(startDate),
      endDate: calToISO(dueDate),
      time: '12:00',
      duration: 120,
      project: p.name,
      assignee: p.team[0]?.i || 'AS',
      priority: p.priority,
      status: p.status,
      color: p.color,
      progress: p.progress,
      notes: p.desc,
      sourceId: p.id,
      isMultiDay: true,
    })
  })

  // Sprints
  sprints.forEach((s) => {
    const start = parseCalDate(s.startDate, 'readable')
    const end = parseCalDate(s.endDate, 'readable')
    events.push({
      id: 'sprint-' + s.id,
      type: 'sprint',
      title: s.name,
      date: calToISO(start),
      startDate: calToISO(start),
      endDate: calToISO(end),
      time: '08:00',
      duration: 480,
      project: s.project,
      assignee: s.team[0]?.i || 'AS',
      status: s.status,
      color: '#00D4AA',
      progress: s.progress,
      notes: s.goal,
      sourceId: s.id,
      isMultiDay: true,
      sprintNum: s.number,
    })
  })

  // Meetings
  meetings.forEach((m) => events.push(m))

  // User events
  userEvents.forEach((e) => events.push(e))

  // Apply filter
  if (filter !== 'all') return events.filter((e) => e.type === filter)
  return events
}

// ---- Multi-day expansion for views that need per-day entries ----

/** Expand multi-day events into per-day entries for a given date range */
export function expandEventsToDateMap(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  const map: Record<string, CalendarEvent[]> = {}

  const addToMap = (ds: string, ev: CalendarEvent) => {
    if (!map[ds]) map[ds] = []
    map[ds].push(ev)
  }

  events.forEach((ev) => {
    if (ev.isMultiDay && ev.startDate && ev.endDate) {
      let cur = new Date(ev.startDate)
      const end = new Date(ev.endDate)
      while (cur <= end) {
        addToMap(calToISO(cur), ev)
        cur = addDays(cur, 1)
      }
    } else {
      addToMap(ev.date, ev)
    }
  })

  return map
}

/** Get the default agenda date range: month start → +3 months */
export function getAgendaDefaultRange(currentDate: Date): { start: Date; end: Date } {
  const start = startOfMonth(currentDate)
  const end = endOfMonth(addMonths(currentDate, 2))
  return { start, end }
}

/** Type color maps used in day/agenda views */
export const TYPE_COLORS: Record<CalendarEventType, string> = {
  task: 'rgba(74,144,255,0.12)',
  project: 'rgba(168,85,247,0.12)',
  sprint: 'rgba(0,212,170,0.12)',
  meeting: 'rgba(255,140,66,0.12)',
}

export const TYPE_TEXT_COLORS: Record<CalendarEventType, string> = {
  task: 'var(--accent-blue)',
  project: 'var(--accent-purple)',
  sprint: 'var(--accent-teal)',
  meeting: 'var(--accent-orange)',
}
