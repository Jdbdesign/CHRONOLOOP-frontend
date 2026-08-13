import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskBoardCard } from './TaskBoardCard'
import { MOCK_TASKS } from '../../data/mockTasks'

const task = MOCK_TASKS[0]

describe('TaskBoardCard', () => {
  it('renders the title and project', () => {
    render(<TaskBoardCard task={task} onOpenDetail={vi.fn()} />)
    expect(screen.getByText(task.title)).toBeInTheDocument()
    expect(screen.getByText(task.project)).toBeInTheDocument()
  })

  it('calls onOpenDetail with the task id when clicked', async () => {
    const onOpenDetail = vi.fn()
    render(<TaskBoardCard task={task} onOpenDetail={onOpenDetail} />)
    await userEvent.click(screen.getByText(task.title))
    expect(onOpenDetail).toHaveBeenCalledWith(task.id)
  })
})
