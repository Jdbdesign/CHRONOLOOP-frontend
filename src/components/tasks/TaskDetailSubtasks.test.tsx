import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskDetailSubtasks } from './TaskDetailSubtasks'

const SUBTASKS = [
  { t: 'Build hero section', done: true },
  { t: 'Add CTA buttons', done: false },
]

describe('TaskDetailSubtasks', () => {
  it('shows the done/total count and computed percentage', () => {
    render(<TaskDetailSubtasks subtasks={SUBTASKS} onToggle={vi.fn()} onAdd={vi.fn()} />)
    expect(screen.getByText('Sub-tasks (1/2)')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('shows 0% with no divide-by-zero when there are no subtasks', () => {
    render(<TaskDetailSubtasks subtasks={[]} onToggle={vi.fn()} onAdd={vi.fn()} />)
    expect(screen.getByText('Sub-tasks (0/0)')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('clicking a subtask checkbox calls onToggle with its index', async () => {
    const onToggle = vi.fn()
    render(<TaskDetailSubtasks subtasks={SUBTASKS} onToggle={onToggle} onAdd={vi.fn()} />)
    await userEvent.click(screen.getByRole('checkbox', { name: /reopen/i }))
    expect(onToggle).toHaveBeenCalledWith(0)
  })

  it('typing text and pressing Enter calls onAdd and clears the input', async () => {
    const onAdd = vi.fn()
    render(<TaskDetailSubtasks subtasks={SUBTASKS} onToggle={vi.fn()} onAdd={onAdd} />)
    const input = screen.getByPlaceholderText('Add a subtask...')
    await userEvent.type(input, 'New subtask{Enter}')
    expect(onAdd).toHaveBeenCalledWith('New subtask')
    expect(input).toHaveValue('')
  })

  it('clicking the add button with empty input does not call onAdd', async () => {
    const onAdd = vi.fn()
    render(<TaskDetailSubtasks subtasks={SUBTASKS} onToggle={vi.fn()} onAdd={onAdd} />)
    await userEvent.click(screen.getByLabelText('Add subtask'))
    expect(onAdd).not.toHaveBeenCalled()
  })
})
