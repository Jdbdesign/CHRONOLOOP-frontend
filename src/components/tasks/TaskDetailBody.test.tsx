import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskDetailBody } from './TaskDetailBody'
import { useTasksStore } from '../../store/tasksStore'
import { MOCK_TASKS } from '../../data/mockTasks'

describe('TaskDetailBody', () => {
  beforeEach(() => {
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
  })

  it('renders title, resolved assignee name, due date, priority, and project', () => {
    const task = MOCK_TASKS.find((t) => t.id === 1)!
    render(<TaskDetailBody task={task} />)
    expect(screen.getByText(task.title)).toBeInTheDocument()
    expect(screen.getByText('Aspen Herwitz')).toBeInTheDocument()
    expect(screen.getByText('Nov 2')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText(task.project)).toBeInTheDocument()
  })

  it('falls back to the raw assignee code when it has no name mapping', () => {
    const task = { ...MOCK_TASKS[0], assignee: 'ZZ' }
    render(<TaskDetailBody task={task} />)
    expect(screen.getAllByText('ZZ').length).toBeGreaterThan(0)
  })

  it('renders every tag with no truncation', () => {
    const task = { ...MOCK_TASKS[0], tags: ['One', 'Two', 'Three'] }
    render(<TaskDetailBody task={task} />)
    expect(screen.getByText('One')).toBeInTheDocument()
    expect(screen.getByText('Two')).toBeInTheDocument()
    expect(screen.getByText('Three')).toBeInTheDocument()
  })

  it('shows placeholder text as content when description is empty, and saves whatever is present on blur', () => {
    const task = { ...MOCK_TASKS[0], description: '' }
    render(<TaskDetailBody task={task} />)
    const desc = screen.getByText('Click to add a description...')
    fireEvent.blur(desc)
    expect(useTasksStore.getState().tasks.find((t) => t.id === task.id)?.description).toBe(
      'Click to add a description...',
    )
  })

  it('saves edited description text on blur', () => {
    const task = MOCK_TASKS.find((t) => t.id === 3)!
    render(<TaskDetailBody task={task} />)
    const desc = screen.getByText(task.description)
    desc.textContent = 'Edited description'
    fireEvent.blur(desc)
    expect(useTasksStore.getState().tasks.find((t) => t.id === 3)?.description).toBe('Edited description')
  })
})
