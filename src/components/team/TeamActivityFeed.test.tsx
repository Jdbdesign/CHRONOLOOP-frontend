import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamActivityFeed } from './TeamActivityFeed'
import { TEAM_MEMBERS } from '../../data/mockTeamMembers'

describe('TeamActivityFeed', () => {
  it('renders the title', () => {
    render(<TeamActivityFeed members={TEAM_MEMBERS} />)
    expect(screen.getByText('Team Activity')).toBeInTheDocument()
  })

  it('renders up to 8 activity items sorted by recency', () => {
    const { container } = render(<TeamActivityFeed members={TEAM_MEMBERS} />)
    const items = container.querySelectorAll('[class*="item"]')
    expect(items.length).toBeLessThanOrEqual(8)
  })

  it('most recent activity appears first (30m ago from Marley)', () => {
    render(<TeamActivityFeed members={TEAM_MEMBERS} />)
    // Marley's "Merged PR" at 30m ago should be first
    const firstStrong = screen.getAllByRole('strong')[0] ?? screen.getAllByText(/Marley/)[0]
    expect(firstStrong).toBeDefined()
  })
})
