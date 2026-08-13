import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskGroup } from './TaskGroup'
import { MOCK_TASKS } from '../../data/mockTasks'

const todoTasks = MOCK_TASKS.filter((t) => t.status === 'todo')

describe('TaskGroup', () => {
  it('renders the status label, count, and every task row in the group', () => {
    render(<TaskGroup status="todo" tasks={todoTasks} onOpenDetail={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText(String(todoTasks.length))).toBeInTheDocument()
    todoTasks.forEach((t) => expect(screen.getByText(t.title)).toBeInTheDocument())
  })

  it('collapses and expands when the header is clicked, without opening any row\'s detail view', async () => {
    const onOpenDetail = vi.fn()
    render(<TaskGroup status="todo" tasks={todoTasks} onOpenDetail={onOpenDetail} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByText('To Do'))
    expect(screen.queryByText(todoTasks[0].title)).not.toBeInTheDocument()
    await userEvent.click(screen.getByText('To Do'))
    expect(screen.getByText(todoTasks[0].title)).toBeInTheDocument()
    expect(onOpenDetail).not.toHaveBeenCalled()
  })

  it('the group Add button opens the create-task modal without toggling collapse', async () => {
    render(<TaskGroup status="todo" tasks={todoTasks} onOpenDetail={vi.fn()} onDelete={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /add/i }))
    expect(screen.getByText(todoTasks[0].title)).toBeInTheDocument()
  })
})
