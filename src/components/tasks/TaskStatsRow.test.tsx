import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskStatsRow } from './TaskStatsRow'
import { useTasksStore } from '../../store/tasksStore'
import { MOCK_TASKS } from '../../data/mockTasks'

describe('TaskStatsRow', () => {
  beforeEach(() => {
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
  })

  it('shows live counts per status derived from the task list, plus a total', () => {
    render(<TaskStatsRow activeFilter="all" onFilterChange={vi.fn()} />)
    const todoCount = MOCK_TASKS.filter((t) => t.status === 'todo').length
    expect(screen.getByText(String(MOCK_TASKS.length))).toBeInTheDocument()
    expect(screen.getByText(String(todoCount))).toBeInTheDocument()
  })

  it('calls onFilterChange with the clicked chip\'s filter key', async () => {
    const onFilterChange = vi.fn()
    render(<TaskStatsRow activeFilter="all" onFilterChange={onFilterChange} />)
    await userEvent.click(screen.getByText('Completed').closest('div')!)
    expect(onFilterChange).toHaveBeenCalledWith('done')
  })

  it('marks the active chip', () => {
    render(<TaskStatsRow activeFilter="overdue" onFilterChange={vi.fn()} />)
    expect(screen.getByText('Overdue').closest('[data-active]')).toHaveAttribute('data-active', 'true')
  })

  it('renders children inline within the same row as the chips', () => {
    render(
      <TaskStatsRow activeFilter="all" onFilterChange={vi.fn()}>
        <div data-testid="toolbar-slot">toolbar</div>
      </TaskStatsRow>,
    )
    expect(screen.getByTestId('toolbar-slot')).toBeInTheDocument()
  })
})
