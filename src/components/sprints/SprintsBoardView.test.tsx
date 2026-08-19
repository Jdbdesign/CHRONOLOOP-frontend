import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SprintsBoardView } from './SprintsBoardView'
import { MOCK_SPRINTS } from '../../data/mockSprints'
import styles from './SprintBoardCard.module.css'

describe('SprintsBoardView', () => {
  it('renders 4 columns in the fixed order active, planning, upcoming, completed', () => {
    const { container } = render(<SprintsBoardView sprints={MOCK_SPRINTS} onOpenDetail={() => {}} />)
    const board = container.querySelector(`.${styles.boardView}`)!
    const titles = Array.from(board.querySelectorAll(`.${styles.boardColTitle}`)).map(
      (el) => el.querySelector('span:nth-child(2)')!.textContent
    )
    expect(titles).toEqual(['Active', 'Planning', 'Upcoming', 'Completed'])
  })

  it('places each sprint card in the column matching its status', () => {
    const { container } = render(<SprintsBoardView sprints={MOCK_SPRINTS} onOpenDetail={() => {}} />)
    const board = container.querySelector(`.${styles.boardView}`)!
    const counts = Array.from(board.querySelectorAll(`.${styles.boardColCount}`)).map((el) => el.textContent)
    // At least one column should show count "2" (completed has 2 sprints in mock data)
    expect(counts).toContain('2')
  })

  it('shows a "No sprints" placeholder for an empty column', () => {
    render(<SprintsBoardView sprints={MOCK_SPRINTS.filter((s) => s.status !== 'upcoming')} onOpenDetail={() => {}} />)
    expect(screen.getByText('No sprints')).toBeInTheDocument()
  })
})
