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

  it('addTask appends a task with a new id and sets the todo KPI override to the live todo count', async () => {
    const before = useTasksStore.getState().tasks.filter((t) => t.status === 'todo').length
    await useTasksStore.getState().addTask({
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

  it('assigns sequential ids one higher than the current max', async () => {
    await useTasksStore.getState().addTask({
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

describe('tasksStore — Phase 3.2 extensions', () => {
  beforeEach(() => {
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
  })

  it('updateTask replaces the matching task\'s editable fields in place, preserving id/status/tags/subtasks/comments/attachments', async () => {
    const before = useTasksStore.getState().tasks.find((t) => t.id === 1)!
    await useTasksStore.getState().updateTask(1, {
      title: 'Renamed task',
      project: 'ChronoLoop Launch',
      assignee: 'RC',
      due: '2024-12-25',
      priority: 'low',
      description: 'updated description',
    })
    const after = useTasksStore.getState().tasks.find((t) => t.id === 1)!
    expect(after).toMatchObject({
      id: 1,
      title: 'Renamed task',
      project: 'ChronoLoop Launch',
      assignee: 'RC',
      aColor: 'linear-gradient(135deg,#00D4AA,#059669)',
      due: '2024-12-25',
      priority: 'low',
      description: 'updated description',
      status: before.status,
      tags: before.tags,
      subtasks: before.subtasks,
    })
  })

  it('removeTask removes the task and returns it with its original index; restoreTask re-inserts it at that index', () => {
    const before = useTasksStore.getState().tasks
    const removed = useTasksStore.getState().removeTask(3)
    expect(removed?.task.id).toBe(3)
    expect(removed?.index).toBe(2)
    expect(useTasksStore.getState().tasks.find((t) => t.id === 3)).toBeUndefined()
    expect(useTasksStore.getState().tasks).toHaveLength(before.length - 1)

    useTasksStore.getState().restoreTask(removed!.task, removed!.index)
    expect(useTasksStore.getState().tasks).toHaveLength(before.length)
    expect(useTasksStore.getState().tasks[2].id).toBe(3)
  })

  it('removeTask returns null for an id that does not exist', () => {
    expect(useTasksStore.getState().removeTask(9999)).toBeNull()
  })

  it('setTaskStatus toggles a task to done or back to todo, never to any other prior status', async () => {
    await useTasksStore.getState().setTaskStatus(1, 'done')
    expect(useTasksStore.getState().tasks.find((t) => t.id === 1)?.status).toBe('done')
    await useTasksStore.getState().setTaskStatus(1, 'todo')
    expect(useTasksStore.getState().tasks.find((t) => t.id === 1)?.status).toBe('todo')
  })
})

describe('tasksStore — Phase 3.3 extensions', () => {
  beforeEach(() => {
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
  })

  it('addSubtask appends a new, not-done subtask to the given task', async () => {
    const before = useTasksStore.getState().tasks.find((t) => t.id === 3)!.subtasks.length
    await useTasksStore.getState().addSubtask(3, 'New subtask')
    const after = useTasksStore.getState().tasks.find((t) => t.id === 3)!.subtasks
    expect(after).toHaveLength(before + 1)
    expect(after.at(-1)).toEqual({ t: 'New subtask', done: false })
  })

  it('toggleSubtask flips the done flag at the given index, leaving other subtasks untouched', async () => {
    await useTasksStore.getState().toggleSubtask(1, 2)
    const subtasks = useTasksStore.getState().tasks.find((t) => t.id === 1)!.subtasks
    expect(subtasks[2].done).toBe(true)
    expect(subtasks[0].done).toBe(true)
    expect(subtasks[1].done).toBe(true)
    await useTasksStore.getState().toggleSubtask(1, 2)
    expect(useTasksStore.getState().tasks.find((t) => t.id === 1)!.subtasks[2].done).toBe(false)
  })

  it('updateTaskDescription replaces only the description field', async () => {
    await useTasksStore.getState().updateTaskDescription(2, 'Updated description text')
    const task = useTasksStore.getState().tasks.find((t) => t.id === 2)!
    expect(task.description).toBe('Updated description text')
    expect(task.title).toBe('Develop Landing Page for Eatz Website')
  })

  it('addComment appends a comment authored by "You" with time "Just now"', async () => {
    const before = useTasksStore.getState().tasks.find((t) => t.id === 3)!.comments.length
    await useTasksStore.getState().addComment(3, 'Looks good')
    const comments = useTasksStore.getState().tasks.find((t) => t.id === 3)!.comments
    expect(comments).toHaveLength(before + 1)
    expect(comments.at(-1)).toEqual({ author: 'You', text: 'Looks good', time: 'Just now' })
  })
})
