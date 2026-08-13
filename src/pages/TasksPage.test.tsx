// src/pages/TasksPage.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TasksPage } from './TasksPage'
import { useTasksStore } from '../store/tasksStore'
import { MOCK_TASKS } from '../data/mockTasks'

describe('TasksPage', () => {
  beforeEach(() => {
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
  })

  it('renders the header, stat chips, toolbar, and the list view by default', () => {
    render(<TasksPage />)
    expect(screen.getByText('My Tasks')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument()
    // "To Do" renders twice by design: once as the stat chip label (TaskStatsRow)
    // and once as the list-view group header (TaskGroup) — both use STATUS_CONFIG's
    // shared label text, so this must use getAllByText rather than getByText.
    expect(screen.getAllByText('To Do').length).toBeGreaterThan(0)
  })

  it('switching to Board view renders the kanban columns instead of the grouped list', async () => {
    render(<TasksPage />)
    await userEvent.click(screen.getByRole('button', { name: /board/i }))
    expect(screen.getAllByText('To Do').length).toBeGreaterThan(0)
    expect(screen.queryByText(MOCK_TASKS.find((t) => t.status === 'overdue')!.title)).toBeInTheDocument()
  })

  it('clicking a stat chip filters the visible tasks to that status', async () => {
    render(<TasksPage />)
    const doneTask = MOCK_TASKS.find((t) => t.status === 'done')!
    const otherStatusTask = MOCK_TASKS.find((t) => t.status === 'todo')!
    await userEvent.click(screen.getByText('Completed').closest('div')!)
    expect(screen.getByText(doneTask.title)).toBeInTheDocument()
    expect(screen.queryByText(otherStatusTask.title)).not.toBeInTheDocument()
  })

  it('typing in search filters by title', async () => {
    render(<TasksPage />)
    const target = MOCK_TASKS[0]
    const other = MOCK_TASKS[1]
    await userEvent.type(screen.getByPlaceholderText('Search tasks...'), target.title.slice(0, 8))
    expect(screen.getByText(target.title)).toBeInTheDocument()
    expect(screen.queryByText(other.title)).not.toBeInTheDocument()
  })
})
