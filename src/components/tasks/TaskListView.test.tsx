import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskListView } from './TaskListView'
import { MOCK_TASKS } from '../../data/mockTasks'

describe('TaskListView', () => {
  it('groups tasks by status in the order Overdue, In Progress, To Do, Done, skipping empty groups', () => {
    render(<TaskListView tasks={MOCK_TASKS} onOpenDetail={vi.fn()} onDelete={vi.fn()} />)
    const headings = screen.getAllByText(/^(Overdue|In Progress|To Do|Done)$/).map((el) => el.textContent)
    expect(headings).toEqual(['Overdue', 'In Progress', 'To Do', 'Done'])
  })

  it('renders nothing for a status group with zero matching tasks', () => {
    const onlyTodo = MOCK_TASKS.filter((t) => t.status === 'todo')
    render(<TaskListView tasks={onlyTodo} onOpenDetail={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText('Done')).not.toBeInTheDocument()
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })
})
