// src/data/mockDashboardCalendar.ts
export interface CalendarDay {
  name: string
  date: number
}

export interface DashboardCalendarTask {
  label: string
  color: string
  start: number
  end: number
  row: number
  badge: string
  assignee: string
  due: string
}

export const CAL_DAYS: CalendarDay[] = [
  { name: 'Fri', date: 1 }, { name: 'Sat', date: 2 }, { name: 'Sun', date: 3 }, { name: 'Mon', date: 4 }, { name: 'Tue', date: 5 },
  { name: 'Wed', date: 6 }, { name: 'Thu', date: 7 }, { name: 'Fri', date: 8 }, { name: 'Sat', date: 9 }, { name: 'Sun', date: 10 },
  { name: 'Mon', date: 11 }, { name: 'Tue', date: 12 }, { name: 'Wed', date: 13 }, { name: 'Thu', date: 14 }, { name: 'Fri', date: 15 },
  { name: 'Sat', date: 16 }, { name: 'Sun', date: 17 }, { name: 'Mon', date: 18 }, { name: 'Tue', date: 19 },
]

export const CAL_TASKS: DashboardCalendarTask[] = [
  { label: 'Homepage for CareyCare App', color: '#FF8C42', start: 1, end: 2, row: 0, badge: 'Task 1', assignee: 'Aspen H.', due: 'Nov 2' },
  { label: 'Prepare Marketing Assets for ChronoLoop Launch', color: '#4A90FF', start: 8, end: 15, row: 0, badge: 'Task 3', assignee: 'Roger D.', due: 'Nov 15' },
  { label: 'Develop Landing Page for Eatz Website', color: '#FF4D4D', start: 5, end: 7, row: 1, badge: 'Task 2', assignee: 'Marley V.', due: 'Nov 7' },
  { label: 'Integrate Payment Gateway for E-commerce App', color: '#06B6D4', start: 15, end: 19, row: 1, badge: 'Task 5', assignee: 'Ryan C.', due: 'Nov 19' },
  { label: 'Finalize User Onboarding Flow', color: '#EC4899', start: 5, end: 9, row: 2, badge: 'Task 4', assignee: 'Aspen H.', due: 'Nov 9' },
]
