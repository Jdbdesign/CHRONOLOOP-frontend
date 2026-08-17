import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamPerfLeaderboard } from './TeamPerfLeaderboard'
import { TEAM_MEMBERS } from '../../data/mockTeamMembers'

describe('TeamPerfLeaderboard', () => {
  it('renders the title', () => {
    render(<TeamPerfLeaderboard members={TEAM_MEMBERS} />)
    expect(screen.getByText('Performance Leaderboard')).toBeInTheDocument()
  })

  it('shows rank #1 for highest completion member (Ryan at 96%)', () => {
    render(<TeamPerfLeaderboard members={TEAM_MEMBERS} />)
    expect(screen.getByText('96%')).toBeInTheDocument()
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('renders all 8 members', () => {
    const { container } = render(<TeamPerfLeaderboard members={TEAM_MEMBERS} />)
    const rows = container.querySelectorAll('[class*="row"]')
    expect(rows).toHaveLength(8)
  })
})
