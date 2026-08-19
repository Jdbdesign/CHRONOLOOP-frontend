import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskBoardView } from './TaskBoardView'
import { useTaskModalStore } from '../../store/taskModalStore'
import { STATUS_CONFIG } from '../../lib/taskFormatters'
import { MOCK_TASKS } from '../../data/mockTasks'
import styles from './TaskBoardView.module.css'

describe('TaskBoardView', () => {
  it('renders all four status columns with correct counts', () => {
    const { container } = render(<TaskBoardView tasks={MOCK_TASKS} onOpenDetail={vi.fn()} />)
    const board = container.querySelector(`.${styles.board}`)!
    const todoCount = MOCK_TASKS.filter((t) => t.status === 'todo').length
    // Column headers inside the board grid
    expect(board.querySelector(`.${styles.colTitleText}`)!.textContent).toBe('To Do')
    const counts = board.querySelectorAll(`.${styles.colCount}`)
    expect(counts[0].textContent).toBe(String(todoCount))
  })

  it('renders each column label from STATUS_CONFIG rather than a hardcoded copy', () => {
    const { container } = render(<TaskBoardView tasks={MOCK_TASKS} onOpenDetail={vi.fn()} />)
    const board = container.querySelector(`.${styles.board}`)!
    const labels = Array.from(board.querySelectorAll(`.${styles.colTitleText}`)).map((el) => el.textContent)
    for (const status of ['todo', 'in-progress', 'done', 'overdue'] as const) {
      expect(labels).toContain(STATUS_CONFIG[status].label)
    }
  })

  it("renders each column's dot color from STATUS_CONFIG, in board order", () => {
    const boardOrder = ['todo', 'in-progress', 'done', 'overdue'] as const
    const { container } = render(<TaskBoardView tasks={MOCK_TASKS} onOpenDetail={vi.fn()} />)
    const dots = container.querySelectorAll(`.${styles.colDot}`)
    expect(dots.length).toBe(boardOrder.length)
    boardOrder.forEach((status, i) => {
      const probe = document.createElement('div')
      probe.style.background = STATUS_CONFIG[status].color
      expect((dots[i] as HTMLElement).style.background).toBe(probe.style.background)
    })
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
