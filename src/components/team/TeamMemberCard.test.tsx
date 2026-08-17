import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TeamMemberCard } from './TeamMemberCard'
import { TEAM_MEMBERS } from '../../data/mockTeamMembers'

describe('TeamMemberCard', () => {
  const member = TEAM_MEMBERS[0]
  const defaultProps = { member, onOpenDetail: vi.fn() }

  it('renders member name, role, and dept', () => {
    render(<TeamMemberCard {...defaultProps} />)
    expect(screen.getByText('Aspen Herwitz')).toBeInTheDocument()
    expect(screen.getByText('Senior Developer')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
  })

  it('renders stat cells with values', () => {
    render(<TeamMemberCard {...defaultProps} />)
    expect(screen.getByText('8')).toBeInTheDocument() // activeTasks
    expect(screen.getByText('24')).toBeInTheDocument() // completedTasks
    expect(screen.getByText('42')).toBeInTheDocument() // velocity
  })

  it('calls onOpenDetail when card is clicked', async () => {
    const user = userEvent.setup()
    const onOpenDetail = vi.fn()
    render(<TeamMemberCard {...defaultProps} onOpenDetail={onOpenDetail} />)
    await user.click(screen.getByText('Aspen Herwitz'))
    expect(onOpenDetail).toHaveBeenCalledWith('tm1')
  })

  it('renders completion progress bar', () => {
    render(<TeamMemberCard {...defaultProps} />)
    expect(screen.getByText('94%')).toBeInTheDocument()
  })
})
