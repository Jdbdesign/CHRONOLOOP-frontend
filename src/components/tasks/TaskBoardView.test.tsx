import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskBoardView } from './TaskBoardView'
import { useTaskModalStore } from '../../store/taskModalStore'
import { MOCK_TASKS } from '../../data/mockTasks'

describe('TaskBoardView', () => {
  it('renders all four status columns with correct counts', () => {
    render(<TaskBoardView tasks={MOCK_TASKS} onOpenDetail={vi.fn()} />)
    const todoCount = MOCK_TASKS.filter((t) => t.status === 'todo').length
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText(String(todoCount))).toBeInTheDocument()
  })

  it('shows a "No tasks" placeholder for an empty column', () => {
    const noneOverdue = MOCK_TASKS.filter((t) => t.status !== 'overdue')
    render(<TaskBoardView tasks={noneOverdue} onOpenDetail={vi.fn()} />)
    expect(screen.getAllByText('No tasks').length).toBeGreaterThan(0)
  })

  it('each column\'s + button opens the create-task modal', async () => {
    useTaskModalStore.setState({ isOpen: false, editingTaskId: null })
    render(<TaskBoardView tasks={MOCK_TASKS} onOpenDetail={vi.fn()} />)
    await userEvent.click(screen.getAllByRole('button', { name: /add task to column/i })[0])
    expect(useTaskModalStore.getState()).toMatchObject({ isOpen: true, editingTaskId: null })
  })
})
