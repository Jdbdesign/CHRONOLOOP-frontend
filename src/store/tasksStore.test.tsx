import { describe, it, expect, beforeEach } from 'vitest'
import { useTasksStore } from './tasksStore'
import { MOCK_TASKS } from '../data/mockTasks'

describe('tasksStore', () => {
  beforeEach(() => {
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
  })

  it('seeds from MOCK_TASKS and starts with no KPI override', () => {
    const state = useTasksStore.getState()
    expect(state.tasks).toHaveLength(15)
    expect(state.todoKpiOverride).toBeNull()
  })

  it('addTask appends a task with a new id and sets the todo KPI override to the live todo count', () => {
    const before = useTasksStore.getState().tasks.filter((t) => t.status === 'todo').length
    useTasksStore.getState().addTask({
      title: 'Write release notes',
      project: 'ChronoLoop Launch',
      assignee: 'RC',
      due: '2024-12-01',
      priority: 'medium',
      description: '',
    })
    const state = useTasksStore.getState()
    expect(state.tasks).toHaveLength(16)
    expect(state.tasks.at(-1)).toMatchObject({ title: 'Write release notes', status: 'todo' })
    expect(state.todoKpiOverride).toBe(before + 1)
  })

  it('assigns sequential ids one higher than the current max', () => {
    useTasksStore.getState().addTask({
      title: 'Second new task',
      project: 'ChronoLoop Launch',
      assignee: 'RC',
      due: '2024-12-02',
      priority: 'low',
      description: '',
    })
    const maxId = Math.max(...useTasksStore.getState().tasks.map((t) => t.id))
    expect(useTasksStore.getState().tasks.at(-1)?.id).toBe(maxId)
  })
})
