import { create } from 'zustand'
import type { CalendarEvent, CalendarFilter, CalendarView, NewCalendarEventInput } from '../types/calendar'
import { calNavigate } from '../lib/calendarHelpers'

interface CalendarState {
  view: CalendarView
  currentDate: Date
  filter: CalendarFilter
  userEvents: CalendarEvent[]
  setView: (v: CalendarView) => void
  setFilter: (f: CalendarFilter) => void
  navigate: (dir: 1 | -1) => void
  goToday: () => void
  setCurrentDate: (d: Date) => void
  addUserEvent: (input: NewCalendarEventInput) => void
}

const TYPE_COLORS: Record<string, string> = {
  task: '#4A90FF',
  project: '#A855F7',
  sprint: '#00D4AA',
  meeting: '#FF8C42',
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  view: 'month',
  currentDate: new Date(2024, 10, 1), // Nov 1, 2024
  filter: 'all',
  userEvents: [],

  setView: (v) => set({ view: v }),
  setFilter: (f) => set({ filter: f }),
  navigate: (dir) => {
    const { view, currentDate } = get()
    set({ currentDate: calNavigate(view, currentDate, dir) })
  },
  goToday: () => set({ currentDate: new Date() }),
  setCurrentDate: (d) => set({ currentDate: d }),

  addUserEvent: (input) => {
    set((state) => {
      const newEvent: CalendarEvent = {
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
      }
      return { userEvents: [...state.userEvents, newEvent] }
    })
  },
}))
