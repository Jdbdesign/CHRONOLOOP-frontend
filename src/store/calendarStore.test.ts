import { describe, it, expect, beforeEach } from 'vitest'
import { useCalendarStore } from './calendarStore'

describe('calendarStore', () => {
  beforeEach(() => {
    useCalendarStore.setState({
      view: 'month',
      currentDate: new Date(2024, 10, 1),
      filter: 'all',
      userEvents: [],
    })
  })

  it('starts with month view, Nov 2024, all filter', () => {
    const { view, currentDate, filter } = useCalendarStore.getState()
    expect(view).toBe('month')
    expect(currentDate.getMonth()).toBe(10)
    expect(currentDate.getFullYear()).toBe(2024)
    expect(filter).toBe('all')
  })

  it('setView changes the view', () => {
    useCalendarStore.getState().setView('week')
    expect(useCalendarStore.getState().view).toBe('week')
  })

  it('setFilter changes the filter', () => {
    useCalendarStore.getState().setFilter('task')
    expect(useCalendarStore.getState().filter).toBe('task')
  })

  it('navigate(1) in month view advances by 1 month', () => {
    useCalendarStore.getState().navigate(1)
    expect(useCalendarStore.getState().currentDate.getMonth()).toBe(11)
  })

  it('navigate(-1) in month view retreats by 1 month', () => {
    useCalendarStore.getState().navigate(-1)
    expect(useCalendarStore.getState().currentDate.getMonth()).toBe(9)
  })

  it('navigate in week view advances by 7 days', () => {
    useCalendarStore.getState().setView('week')
    useCalendarStore.getState().navigate(1)
    expect(useCalendarStore.getState().currentDate.getDate()).toBe(8)
  })

  it('navigate in day view advances by 1 day', () => {
    useCalendarStore.getState().setView('day')
    useCalendarStore.getState().navigate(1)
    expect(useCalendarStore.getState().currentDate.getDate()).toBe(2)
  })

  it('goToday sets currentDate to today', () => {
    useCalendarStore.getState().goToday()
    const today = new Date()
    const { currentDate } = useCalendarStore.getState()
    expect(currentDate.getDate()).toBe(today.getDate())
    expect(currentDate.getMonth()).toBe(today.getMonth())
  })

  it('setCurrentDate sets a specific date', () => {
    useCalendarStore.getState().setCurrentDate(new Date(2025, 0, 15))
    expect(useCalendarStore.getState().currentDate.getMonth()).toBe(0)
    expect(useCalendarStore.getState().currentDate.getDate()).toBe(15)
  })

  it('addUserEvent adds a new event to userEvents', async () => {
    await useCalendarStore.getState().addUserEvent({
      type: 'meeting',
      title: 'Team Sync',
      date: '2024-11-10',
      time: '14:00',
      project: 'Internal',
      priority: 'medium',
      assignee: 'AS',
      notes: 'Weekly sync',
    })
    const { userEvents } = useCalendarStore.getState()
    expect(userEvents).toHaveLength(1)
    expect(userEvents[0].title).toBe('Team Sync')
    expect(userEvents[0].type).toBe('meeting')
    expect(userEvents[0].color).toBe('#FF8C42')
    expect(userEvents[0].isMultiDay).toBe(false)
  })

  it('addUserEvent with endDate creates multi-day event', async () => {
    await useCalendarStore.getState().addUserEvent({
      type: 'project',
      title: 'Multi-day',
      date: '2024-11-10',
      time: '09:00',
      endDate: '2024-11-15',
      project: 'Proj',
      priority: 'high',
      assignee: 'MV',
      notes: '',
    })
    const { userEvents } = useCalendarStore.getState()
    expect(userEvents[0].isMultiDay).toBe(true)
    expect(userEvents[0].endDate).toBe('2024-11-15')
  })
})
