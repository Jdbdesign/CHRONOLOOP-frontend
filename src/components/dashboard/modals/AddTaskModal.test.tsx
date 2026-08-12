import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddTaskModal } from './AddTaskModal'
import { useDashboardUiStore } from '../../../store/dashboardUiStore'
import { useTasksStore } from '../../../store/tasksStore'
import { useToastStore } from '../../../store/toastStore'
import { MOCK_TASKS } from '../../../data/mockTasks'

describe('AddTaskModal', () => {
  beforeEach(() => {
    useDashboardUiStore.setState({ activeModal: 'addTask' })
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
    useToastStore.setState({ toasts: [] })
  })

  it('is not rendered when addTask is not the active modal', () => {
    useDashboardUiStore.setState({ activeModal: null })
    render(<AddTaskModal />)
    expect(screen.queryByText('Add New Task')).not.toBeInTheDocument()
  })

  it('submitting the form adds a task, shows a success toast, and closes', async () => {
    render(<AddTaskModal />)
    await userEvent.type(screen.getByLabelText(/task name/i), 'Ship Phase 3')
    await userEvent.click(screen.getByRole('button', { name: 'Add Task' }))

    expect(useTasksStore.getState().tasks.at(-1)).toMatchObject({ title: 'Ship Phase 3', status: 'todo' })
    expect(useToastStore.getState().toasts.at(-1)?.message).toBe('"Ship Phase 3" added to To Do!')
    expect(useDashboardUiStore.getState().activeModal).toBeNull()
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
})
