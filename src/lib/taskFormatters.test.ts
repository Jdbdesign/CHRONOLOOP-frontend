import { describe, it, expect } from 'vitest'
import { getDueClass, formatDue, STATUS_CONFIG, PRIORITY_ORDER, STATUS_ORDER } from './taskFormatters'

describe('taskFormatters', () => {
  it('getDueClass returns "normal" for done tasks regardless of due date', () => {
    expect(getDueClass('2020-01-01', 'done')).toBe('normal')
  })

  it('getDueClass returns "overdue-chip" for a past due date on a non-done task', () => {
    expect(getDueClass('2000-01-01', 'todo')).toBe('overdue-chip')
  })

  it('getDueClass returns "soon" for a due date within 3 days', () => {
    const soon = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)
    expect(getDueClass(soon, 'todo')).toBe('soon')
  })

  it('formatDue renders a short month-day string', () => {
    expect(formatDue('2024-11-02')).toBe('Nov 2')
  })

  it('STATUS_CONFIG has all four statuses with the original labels', () => {
    expect(STATUS_CONFIG.todo.label).toBe('To Do')
    expect(STATUS_CONFIG['in-progress'].label).toBe('In Progress')
    expect(STATUS_CONFIG.done.label).toBe('Done')
    expect(STATUS_CONFIG.overdue.label).toBe('Overdue')
  })

  it('PRIORITY_ORDER and STATUS_ORDER match the original sort weights', () => {
    expect(PRIORITY_ORDER).toEqual({ high: 0, medium: 1, low: 2 })
    expect(STATUS_ORDER).toEqual({ overdue: 0, 'in-progress': 1, todo: 2, done: 3 })
  })
})
