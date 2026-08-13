import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskRow } from './TaskRow'
import { useTaskModalStore } from '../../store/taskModalStore'
import { useTasksStore } from '../../store/tasksStore'
import { MOCK_TASKS } from '../../data/mockTasks'

const task = MOCK_TASKS[0]

describe('TaskRow', () => {
  it('renders the title, project, tags, priority, assignee, and due date', () => {
    render(<TaskRow task={task} onOpenDetail={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(task.title)).toBeInTheDocument()
    expect(screen.getByText(task.project)).toBeInTheDocument()
  })

  it('clicking the row calls onOpenDetail with the task id', async () => {
    const onOpenDetail = vi.fn()
    render(<TaskRow task={task} onOpenDetail={onOpenDetail} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByText(task.title))
    expect(onOpenDetail).toHaveBeenCalledWith(task.id)
  })

  it('clicking the checkbox toggles status to done and does not open the detail view', async () => {
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
    const onOpenDetail = vi.fn()
    render(<TaskRow task={task} onOpenDetail={onOpenDetail} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(useTasksStore.getState().tasks.find((t) => t.id === task.id)?.status).toBe('done')
    expect(onOpenDetail).not.toHaveBeenCalled()
  })

  it('clicking Edit opens the edit modal for this task and does not open the detail view', async () => {
    useTaskModalStore.setState({ isOpen: false, editingTaskId: null })
    const onOpenDetail = vi.fn()
    render(<TaskRow task={task} onOpenDetail={onOpenDetail} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /edit/i }))
    expect(useTaskModalStore.getState()).toMatchObject({ isOpen: true, editingTaskId: task.id })
    expect(onOpenDetail).not.toHaveBeenCalled()
  })

  it('clicking Delete calls onDelete with the task id and does not open the detail view', async () => {
    const onDelete = vi.fn()
    const onOpenDetail = vi.fn()
    render(<TaskRow task={task} onOpenDetail={onOpenDetail} onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: /delete/i }))
    expect(onDelete).toHaveBeenCalledWith(task.id, task.title)
    expect(onOpenDetail).not.toHaveBeenCalled()
  })
})
