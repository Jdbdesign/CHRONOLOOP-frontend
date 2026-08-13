import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddTaskModal } from './AddTaskModal'
import { useTaskModalStore } from '../../../store/taskModalStore'
import { useTasksStore } from '../../../store/tasksStore'
import { useToastStore } from '../../../store/toastStore'
import { MOCK_TASKS } from '../../../data/mockTasks'

describe('AddTaskModal', () => {
  beforeEach(() => {
    useTaskModalStore.setState({ isOpen: true, editingTaskId: null })
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
    useToastStore.setState({ toasts: [] })
  })

  it('is not rendered when addTask is not the active modal', () => {
    useTaskModalStore.setState({ isOpen: false, editingTaskId: null })
    render(<AddTaskModal />)
    expect(screen.queryByText('Add New Task')).not.toBeInTheDocument()
  })

  it('submitting the form adds a task, shows a success toast, and closes', async () => {
    render(<AddTaskModal />)
    await userEvent.type(screen.getByLabelText(/task name/i), 'Ship Phase 3')
    await userEvent.click(screen.getByRole('button', { name: 'Add Task' }))

    expect(useTasksStore.getState().tasks.at(-1)).toMatchObject({ title: 'Ship Phase 3', status: 'todo' })
    expect(useToastStore.getState().toasts.at(-1)?.message).toBe('"Ship Phase 3" added to To Do!')
    expect(useTaskModalStore.getState().isOpen).toBe(false)
  })

  it('does not submit when the task name is empty', async () => {
    render(<AddTaskModal />)
    const before = useTasksStore.getState().tasks.length
    await userEvent.click(screen.getByRole('button', { name: 'Add Task' }))
    expect(useTasksStore.getState().tasks.length).toBe(before)
  })

  it('lets the user pick a priority pill', async () => {
    render(<AddTaskModal />)
    const high = screen.getByRole('button', { name: 'High' })
    await userEvent.click(high)
    expect(high).toHaveAttribute('data-selected', 'true')
  })

  it('opens pre-filled when editing an existing task, and calls updateTask (not addTask) on submit', async () => {
    useTaskModalStore.setState({ isOpen: true, editingTaskId: 1 })
    render(<AddTaskModal />)
    expect(screen.getByText('Edit Task')).toBeInTheDocument()
    expect(screen.getByLabelText(/task name/i)).toHaveValue('Homepage for CareyCare App')
    await userEvent.clear(screen.getByLabelText(/task name/i))
    await userEvent.type(screen.getByLabelText(/task name/i), 'Renamed')
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))
    expect(useTasksStore.getState().tasks.find((t) => t.id === 1)?.title).toBe('Renamed')
    expect(useTasksStore.getState().tasks).toHaveLength(15)
    expect(useToastStore.getState().toasts.at(-1)?.message).toBe('Task updated!')
  })
})
