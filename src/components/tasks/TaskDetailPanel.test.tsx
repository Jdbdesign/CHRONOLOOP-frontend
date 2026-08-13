import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskDetailPanel } from './TaskDetailPanel'
import { useTaskDetailStore } from '../../store/taskDetailStore'
import { useTaskModalStore } from '../../store/taskModalStore'
import { useTasksStore } from '../../store/tasksStore'
import { MOCK_TASKS } from '../../data/mockTasks'

describe('TaskDetailPanel', () => {
  beforeEach(() => {
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
    useTaskDetailStore.setState({ openTaskId: null })
    useTaskModalStore.setState({ isOpen: false, editingTaskId: null })
  })

  it('renders nothing identifiable when no task is open', () => {
    render(<TaskDetailPanel onDelete={vi.fn()} />)
    expect(screen.queryByText(MOCK_TASKS[0].title)).not.toBeInTheDocument()
  })

  it('shows the opened task\'s title and status label', () => {
    useTaskDetailStore.setState({ openTaskId: 1 })
    render(<TaskDetailPanel onDelete={vi.fn()} />)
    expect(screen.getByText(MOCK_TASKS[0].title)).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('clicking the overlay closes the panel', async () => {
    useTaskDetailStore.setState({ openTaskId: 1 })
    render(<TaskDetailPanel onDelete={vi.fn()} />)
    await userEvent.click(screen.getByTestId('task-detail-overlay'))
    expect(useTaskDetailStore.getState().openTaskId).toBeNull()
  })

  it('pressing Escape closes the panel', async () => {
    useTaskDetailStore.setState({ openTaskId: 1 })
    render(<TaskDetailPanel onDelete={vi.fn()} />)
    await userEvent.keyboard('{Escape}')
    expect(useTaskDetailStore.getState().openTaskId).toBeNull()
  })

  it('clicking Edit closes the panel and opens the edit modal for the same task', async () => {
    useTaskDetailStore.setState({ openTaskId: 3 })
    render(<TaskDetailPanel onDelete={vi.fn()} />)
    await userEvent.click(screen.getByLabelText('Edit task'))
    expect(useTaskDetailStore.getState().openTaskId).toBeNull()
    expect(useTaskModalStore.getState()).toMatchObject({ isOpen: true, editingTaskId: 3 })
  })

  it('clicking Delete closes the panel and calls onDelete with the task id and title', async () => {
    const onDelete = vi.fn()
    useTaskDetailStore.setState({ openTaskId: 3 })
    render(<TaskDetailPanel onDelete={onDelete} />)
    await userEvent.click(screen.getByLabelText('Delete task'))
    expect(useTaskDetailStore.getState().openTaskId).toBeNull()
    expect(onDelete).toHaveBeenCalledWith(3, MOCK_TASKS.find((t) => t.id === 3)!.title)
  })

  it('typing a comment and clicking send adds it and clears the input', async () => {
    useTaskDetailStore.setState({ openTaskId: 3 })
    render(<TaskDetailPanel onDelete={vi.fn()} />)
    const input = screen.getByPlaceholderText('Add a comment...')
    await userEvent.type(input, 'Nice work')
    await userEvent.click(screen.getByLabelText('Send comment'))
    expect(useTasksStore.getState().tasks.find((t) => t.id === 3)?.comments.at(-1)).toMatchObject({
      author: 'You',
      text: 'Nice work',
    })
    expect(input).toHaveValue('')
  })
})
