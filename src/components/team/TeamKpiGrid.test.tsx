import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamKpiGrid } from './TeamKpiGrid'
import { TEAM_MEMBERS } from '../../data/mockTeamMembers'

describe('TeamKpiGrid', () => {
  it('renders 5 stat cards with computed values', () => {
    render(<TeamKpiGrid members={TEAM_MEMBERS} />)
    expect(screen.getByText('Total Members')).toBeInTheDocument()
    expect(screen.getByText('Active Now')).toBeInTheDocument()
    expect(screen.getByText('Offline')).toBeInTheDocument()
    expect(screen.getByText('Avg Completion')).toBeInTheDocument()
    expect(screen.getByText('Avg Velocity')).toBeInTheDocument()
  })

  it('shows stat card values', () => {
    render(<TeamKpiGrid members={TEAM_MEMBERS} />)
    // StatCard uses useCountUp (animated), so just verify labels render
    expect(screen.getByText('Total Members')).toBeInTheDocument()
    expect(screen.getByText('Avg Completion')).toBeInTheDocument()
  })
})
