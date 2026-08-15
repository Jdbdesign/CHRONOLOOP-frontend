import { describe, it, expect } from 'vitest'
import {
  calToISO,
  calFmtTime,
  calWeekStart,
  calPeriodTitle,
  calNavigate,
  parseCalDate,
  getCalendarEvents,
  expandEventsToDateMap,
  getAgendaDefaultRange,
} from './calendarHelpers'
import type { Task } from '../types/task'
import type { Project } from '../types/project'
import type { Sprint } from '../types/sprint'
import type { CalendarEvent } from '../types/calendar'

describe('calToISO', () => {
  it('converts a Date to YYYY-MM-DD', () => {
    expect(calToISO(new Date(2024, 10, 4))).toBe('2024-11-04')
  })

  it('pads single-digit months and days', () => {
    expect(calToISO(new Date(2024, 0, 1))).toBe('2024-01-01')
  })
})

describe('calFmtTime', () => {
  it('formats morning time without minutes', () => {
    expect(calFmtTime('09:00')).toBe('9am')
  })

  it('formats afternoon time with minutes', () => {
    expect(calFmtTime('14:30')).toBe('2:30pm')
  })

  it('formats noon correctly', () => {
    expect(calFmtTime('12:00')).toBe('12pm')
  })

  it('formats midnight as 12am', () => {
    expect(calFmtTime('00:00')).toBe('12am')
  })

  it('returns empty string for undefined', () => {
    expect(calFmtTime(undefined)).toBe('')
  })
})

describe('calWeekStart', () => {
  it('returns Monday for a Wednesday', () => {
    // Nov 6, 2024 is a Wednesday
    const result = calWeekStart(new Date(2024, 10, 6))
    expect(result.getDay()).toBe(1) // Monday
    expect(result.getDate()).toBe(4)
  })

  it('returns Monday for a Sunday', () => {
    // Nov 3, 2024 is a Sunday
    const result = calWeekStart(new Date(2024, 10, 3))
    expect(result.getDay()).toBe(1) // Monday
    expect(result.getDate()).toBe(28) // Oct 28
  })

  it('returns same day for a Monday', () => {
    // Nov 4, 2024 is a Monday
    const result = calWeekStart(new Date(2024, 10, 4))
    expect(result.getDate()).toBe(4)
  })
})

describe('calPeriodTitle', () => {
  const nov1 = new Date(2024, 10, 1)

  it('month view: "November 2024"', () => {
    expect(calPeriodTitle('month', nov1)).toBe('November 2024')
  })

  it('week view same month: "November 4 – 10, 2024"', () => {
    const nov4 = new Date(2024, 10, 4)
    expect(calPeriodTitle('week', nov4)).toBe('November 4 – 10, 2024')
  })

  it('week view cross-month: "October 28 – November 3"', () => {
    // Oct 30 is a Wednesday, week starts Oct 28 Mon, ends Nov 3 Sun
    const oct30 = new Date(2024, 9, 30)
    expect(calPeriodTitle('week', oct30)).toBe('October 28 – November 3')
  })

  it('day view: "Friday, November 1"', () => {
    expect(calPeriodTitle('day', nov1)).toBe('Friday, November 1')
  })

  it('agenda view: "Agenda · November 2024"', () => {
    expect(calPeriodTitle('agenda', nov1)).toBe('Agenda · November 2024')
  })
})

describe('calNavigate', () => {
  const nov1 = new Date(2024, 10, 1)

  it('month: advances by 1 month', () => {
    const result = calNavigate('month', nov1, 1)
    expect(result.getMonth()).toBe(11) // December
  })

  it('month: retreats by 1 month', () => {
    const result = calNavigate('month', nov1, -1)
    expect(result.getMonth()).toBe(9) // October
  })

  it('week: advances by 7 days', () => {
    const result = calNavigate('week', nov1, 1)
    expect(result.getDate()).toBe(8)
  })

  it('day: advances by 1 day', () => {
    const result = calNavigate('day', nov1, 1)
    expect(result.getDate()).toBe(2)
  })

  it('agenda: advances by 1 month (same as month)', () => {
    const result = calNavigate('agenda', nov1, 1)
    expect(result.getMonth()).toBe(11)
  })
})

describe('parseCalDate', () => {
  it('parses ISO format', () => {
    const d = parseCalDate('2024-11-04', 'iso')
    expect(d.getFullYear()).toBe(2024)
    expect(d.getMonth()).toBe(10)
    expect(d.getDate()).toBe(4)
  })

  it('parses readable format', () => {
    const d = parseCalDate('Nov 20, 2024', 'readable')
    expect(d.getFullYear()).toBe(2024)
    expect(d.getMonth()).toBe(10)
    expect(d.getDate()).toBe(20)
  })

  it('parses readable format with single-digit day', () => {
    const d = parseCalDate('Oct 1, 2024', 'readable')
    expect(d.getFullYear()).toBe(2024)
    expect(d.getMonth()).toBe(9)
    expect(d.getDate()).toBe(1)
  })
})

describe('getCalendarEvents', () => {
  const mockTask: Task = {
    id: 1, title: 'Test Task', project: 'Proj', assignee: 'AS',
    aColor: '#000', priority: 'high', status: 'in-progress', due: '2024-11-04',
    tags: [], subtasks: [], comments: [], attachments: [], description: 'desc',
  }

  const mockProject: Project = {
    id: 'p1', name: 'Test Proj', client: 'C', category: 'Dev',
    status: 'active', priority: 'high', progress: 45, color: '#4A90FF',
    tasksTotal: 10, tasksDone: 5, dueDays: -1, dueDate: 'Nov 20, 2024',
    desc: 'desc', team: [{ i: 'AS', c: '#4A90FF', n: 'A' }], milestones: [],
  }

  const mockSprint: Sprint = {
    id: 's1', number: 'SPRINT 01', name: 'Test Sprint', goal: 'goal',
    status: 'active', startDate: 'Oct 1, 2024', endDate: 'Oct 14, 2024',
    daysLeft: 0, progress: 100, storyPoints: 42, completedPoints: 42,
    tasksTotal: 12, tasksDone: 12, inProgress: 0, todo: 0,
    color: '#22C55E', project: 'Proj', velocity: 42,
    team: [{ i: 'AS', c: '#4A90FF' }], burndown: [], sprintTasks: [],
  }

  const mockMeeting: CalendarEvent = {
    id: 'm1', type: 'meeting', title: 'Meeting', date: '2024-11-04',
    time: '10:00', duration: 60, project: 'Proj', assignee: 'AS', color: '#FF8C42',
  }

  it('aggregates events from all sources', () => {
    const events = getCalendarEvents([mockTask], [mockProject], [mockSprint], [mockMeeting], [], 'all')
    expect(events).toHaveLength(4)
    expect(events.map((e) => e.type)).toEqual(['task', 'project', 'sprint', 'meeting'])
  })

  it('filters by type', () => {
    const events = getCalendarEvents([mockTask], [mockProject], [mockSprint], [mockMeeting], [], 'task')
    expect(events).toHaveLength(1)
    expect(events[0].type).toBe('task')
  })

  it('assigns correct color for task statuses', () => {
    const doneTask = { ...mockTask, status: 'done' as const }
    const overdueTask = { ...mockTask, id: 2, status: 'overdue' as const }
    const events = getCalendarEvents([doneTask, overdueTask], [], [], [], [], 'all')
    expect(events[0].color).toBe('#22C55E')
    expect(events[1].color).toBe('#FF4D4D')
  })

  it('creates multi-day events for projects', () => {
    const events = getCalendarEvents([], [mockProject], [], [], [], 'all')
    expect(events[0].isMultiDay).toBe(true)
    expect(events[0].startDate).toBeDefined()
    expect(events[0].endDate).toBe('2024-11-20')
  })

  it('creates multi-day events for sprints', () => {
    const events = getCalendarEvents([], [], [mockSprint], [], [], 'all')
    expect(events[0].isMultiDay).toBe(true)
    expect(events[0].startDate).toBe('2024-10-01')
    expect(events[0].endDate).toBe('2024-10-14')
    expect(events[0].color).toBe('#00D4AA')
  })

  it('includes user events', () => {
    const userEvent: CalendarEvent = {
      id: 'user-1', type: 'task', title: 'Custom', date: '2024-11-10',
      color: '#4A90FF',
    }
    const events = getCalendarEvents([], [], [], [], [userEvent], 'all')
    expect(events).toHaveLength(1)
    expect(events[0].title).toBe('Custom')
  })
})

describe('expandEventsToDateMap', () => {
  it('expands multi-day events into per-day entries', () => {
    const ev: CalendarEvent = {
      id: 'x', type: 'sprint', title: 'S', date: '2024-11-01',
      startDate: '2024-11-01', endDate: '2024-11-03',
      isMultiDay: true, color: '#000',
    }
    const map = expandEventsToDateMap([ev])
    expect(Object.keys(map)).toHaveLength(3)
    expect(map['2024-11-01']).toHaveLength(1)
    expect(map['2024-11-02']).toHaveLength(1)
    expect(map['2024-11-03']).toHaveLength(1)
  })

  it('places single-day events on their date only', () => {
    const ev: CalendarEvent = {
      id: 'y', type: 'task', title: 'T', date: '2024-11-05', color: '#000',
    }
    const map = expandEventsToDateMap([ev])
    expect(Object.keys(map)).toEqual(['2024-11-05'])
  })
})

describe('getAgendaDefaultRange', () => {
  it('returns start of month to end of month + 2', () => {
    const nov1 = new Date(2024, 10, 1)
    const { start, end } = getAgendaDefaultRange(nov1)
    expect(start.getDate()).toBe(1)
    expect(start.getMonth()).toBe(10)
    expect(end.getMonth()).toBe(0) // January 2025
    expect(end.getDate()).toBe(31)
  })
})
