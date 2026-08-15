import { describe, it, expect } from 'vitest'
import { SPRINT_STATUS_CONFIG, sprintSortComparator } from './sprintFormatters'
import type { Sprint } from '../types/sprint'

const s = (over: Partial<Sprint>): Sprint => ({
  id: 'x', number: 'SPRINT 0X', name: 'A', goal: '', status: 'planning',
  startDate: '', endDate: '', daysLeft: 0, progress: 0, storyPoints: 0, completedPoints: 0,
  tasksTotal: 0, tasksDone: 0, inProgress: 0, todo: 0, color: '#000', project: '',
  velocity: null, team: [], burndown: [], sprintTasks: [], ...over,
})

describe('SPRINT_STATUS_CONFIG', () => {
  it('has a label and icon for every status', () => {
    expect(SPRINT_STATUS_CONFIG.active.label).toBe('Active')
    expect(SPRINT_STATUS_CONFIG.completed.label).toBe('Completed')
    expect(SPRINT_STATUS_CONFIG.planning.label).toBe('Planning')
    expect(SPRINT_STATUS_CONFIG.upcoming.label).toBe('Upcoming')
  })
})

describe('sprintSortComparator', () => {
  it('sorts by name A-Z', () => {
    const list = [s({ id: 'b', name: 'Beta' }), s({ id: 'a', name: 'Alpha' })]
    expect(list.sort(sprintSortComparator('name')).map((x) => x.id)).toEqual(['a', 'b'])
  })

  it('sorts by progress descending', () => {
    const list = [s({ id: 'low', progress: 10 }), s({ id: 'high', progress: 90 })]
    expect(list.sort(sprintSortComparator('progress')).map((x) => x.id)).toEqual(['high', 'low'])
  })

  it('sorts by story points descending', () => {
    const list = [s({ id: 'small', storyPoints: 10 }), s({ id: 'big', storyPoints: 50 })]
    expect(list.sort(sprintSortComparator('storyPts')).map((x) => x.id)).toEqual(['big', 'small'])
  })

  it('falls back to id order for "number" (and any other) sort mode, matching index.html:7985', () => {
    const list = [s({ id: 's3' }), s({ id: 's1' }), s({ id: 's2' })]
    expect(list.sort(sprintSortComparator('number')).map((x) => x.id)).toEqual(['s1', 's2', 's3'])
  })
})
