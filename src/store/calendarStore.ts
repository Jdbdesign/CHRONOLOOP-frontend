import { create } from 'zustand'
import type { CalendarEvent, CalendarFilter, CalendarView, NewCalendarEventInput } from '../types/calendar'
import { calNavigate } from '../lib/calendarHelpers'
import * as calendarService from '../services/calendarService'

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
  addUserEvent: (input: NewCalendarEventInput) => Promise<void>
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

  addUserEvent: async (input) => {
    const newEvent = await calendarService.buildNewCalendarEvent(input)
    set((state) => ({ userEvents: [...state.userEvents, newEvent] }))
  },
}))
