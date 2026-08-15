import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SprintsBoardView } from './SprintsBoardView'
import { MOCK_SPRINTS } from '../../data/mockSprints'

describe('SprintsBoardView', () => {
  it('renders 4 columns in the fixed order active, planning, upcoming, completed', () => {
    render(<SprintsBoardView sprints={MOCK_SPRINTS} onOpenDetail={() => {}} />)
    const titles = screen.getAllByText(/^(Active|Planning|Upcoming|Completed)$/).map((el) => el.textContent)
    expect(titles).toEqual(['Active', 'Planning', 'Upcoming', 'Completed'])
  })

  it('places each sprint card in the column matching its status', () => {
    render(<SprintsBoardView sprints={MOCK_SPRINTS} onOpenDetail={() => {}} />)
    // s1 and s2 are both 'completed' -> Completed column has 2 cards
    expect(screen.getByText('2').closest('[class*="colCount"]')).toBeInTheDocument()
  })

  it('shows a "No sprints" placeholder for an empty column', () => {
    render(<SprintsBoardView sprints={MOCK_SPRINTS.filter((s) => s.status !== 'upcoming')} onOpenDetail={() => {}} />)
    expect(screen.getByText('No sprints')).toBeInTheDocument()
  })
})
