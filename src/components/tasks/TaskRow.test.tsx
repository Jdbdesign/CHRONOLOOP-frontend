import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskRow } from './TaskRow'
import { useTaskModalStore } from '../../store/taskModalStore'
import { useTasksStore } from '../../store/tasksStore'
import { useToastStore } from '../../store/toastStore'
import { MOCK_TASKS } from '../../data/mockTasks'
import type { Task } from '../../types/task'

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

  it('shows a "marked complete" success toast when the checkbox transitions todo/in-progress to done', async () => {
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
    useToastStore.setState({ toasts: [] })
    render(<TaskRow task={task} onOpenDetail={vi.fn()} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByRole('checkbox'))
    const toast = useToastStore.getState().toasts.at(-1)
    expect(toast).toMatchObject({ message: `"${task.title.substring(0, 30)}…" marked complete`, variant: 'success' })
  })

  it('does not show a toast when the checkbox transitions done back to not-done', async () => {
    const doneTask: Task = { ...task, status: 'done' }
    useTasksStore.setState({ tasks: MOCK_TASKS.map((t) => (t.id === task.id ? doneTask : t)), todoKpiOverride: null })
    useToastStore.setState({ toasts: [] })
    render(<TaskRow task={doneTask} onOpenDetail={vi.fn()} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByRole('checkbox'))
    expect(useTasksStore.getState().tasks.find((t) => t.id === task.id)?.status).toBe('todo')
    expect(useToastStore.getState().toasts).toHaveLength(0)
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
