import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TasksPageHeader } from './TasksPageHeader'
import { useTaskModalStore } from '../../store/taskModalStore'

describe('TasksPageHeader', () => {
  it('renders the breadcrumb and heading', () => {
    render(<TasksPageHeader view="list" onViewChange={vi.fn()} />)
    expect(screen.getByText('Overview / Tasks')).toBeInTheDocument()
    expect(screen.getByText('My Tasks')).toBeInTheDocument()
  })

  it('opens the create-task modal when Add Task is clicked', async () => {
    useTaskModalStore.setState({ isOpen: false, editingTaskId: null })
    render(<TasksPageHeader view="list" onViewChange={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /add task/i }))
    expect(useTaskModalStore.getState()).toMatchObject({ isOpen: true, editingTaskId: null })
  })

  it('calls onViewChange with the clicked view', async () => {
    const onViewChange = vi.fn()
    render(<TasksPageHeader view="list" onViewChange={onViewChange} />)
    await userEvent.click(screen.getByRole('button', { name: /board/i }))
    expect(onViewChange).toHaveBeenCalledWith('board')
  })

  it('marks the active view button', () => {
    render(<TasksPageHeader view="board" onViewChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: /board/i })).toHaveAttribute('data-active', 'true')
    expect(screen.getByRole('button', { name: /^list/i })).toHaveAttribute('data-active', 'false')
  })
})
