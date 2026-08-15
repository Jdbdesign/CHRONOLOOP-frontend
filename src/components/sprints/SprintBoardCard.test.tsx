import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SprintBoardCard } from './SprintBoardCard'
import { MOCK_SPRINTS } from '../../data/mockSprints'

const sprint = MOCK_SPRINTS[2] // s3, 4-person team

describe('SprintBoardCard', () => {
  it('renders number, name, goal, and points', () => {
    render(<SprintBoardCard sprint={sprint} onOpenDetail={() => {}} />)
    expect(screen.getByText('SPRINT 03')).toBeInTheDocument()
    expect(screen.getByText('UX Polish & Integrations')).toBeInTheDocument()
    expect(screen.getByText('26/45 pts')).toBeInTheDocument()
  })

  it('shows only 2 team avatars with no overflow indicator, unlike the list row', () => {
    render(<SprintBoardCard sprint={sprint} onOpenDetail={() => {}} />)
    expect(screen.queryByText('+2')).not.toBeInTheDocument()
    expect(screen.queryByText(/^\+\d/)).not.toBeInTheDocument()
  })

  it('calls onOpenDetail when clicked', async () => {
    const user = userEvent.setup()
    const onOpenDetail = vi.fn()
    render(<SprintBoardCard sprint={sprint} onOpenDetail={onOpenDetail} />)
    await user.click(screen.getByText('UX Polish & Integrations'))
    expect(onOpenDetail).toHaveBeenCalledWith('s3')
  })
})
