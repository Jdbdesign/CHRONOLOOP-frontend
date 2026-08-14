import { describe, it, expect } from 'vitest'
import { PROJECT_STATUS_CONFIG, priorityLabel, getProjDueClass } from './projectFormatters'

describe('projectFormatters', () => {
  it('has a label for every project status', () => {
    expect(PROJECT_STATUS_CONFIG.active.label).toBe('Active')
    expect(PROJECT_STATUS_CONFIG['in-progress'].label).toBe('In Progress')
    expect(PROJECT_STATUS_CONFIG.completed.label).toBe('Completed')
    expect(PROJECT_STATUS_CONFIG.overdue.label).toBe('Overdue')
    expect(PROJECT_STATUS_CONFIG['on-hold'].label).toBe('On Hold')
  })

  it('priorityLabel capitalizes the first letter', () => {
    expect(priorityLabel('high')).toBe('High')
    expect(priorityLabel('medium')).toBe('Medium')
    expect(priorityLabel('low')).toBe('Low')
  })

  it('getProjDueClass buckets by dueDays: negative is overdue, 0-7 is soon, above is normal', () => {
    expect(getProjDueClass(-1)).toBe('overdue')
    expect(getProjDueClass(0)).toBe('soon')
    expect(getProjDueClass(7)).toBe('soon')
    expect(getProjDueClass(8)).toBe('normal')
  })
})
