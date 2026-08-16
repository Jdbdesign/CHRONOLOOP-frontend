import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamWorkloadPanel } from './TeamWorkloadPanel'
import { TEAM_MEMBERS } from '../../data/mockTeamMembers'

describe('TeamWorkloadPanel', () => {
  it('renders the title and legend', () => {
    render(<TeamWorkloadPanel members={TEAM_MEMBERS} />)
    expect(screen.getByText('Workload Distribution')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('To Do')).toBeInTheDocument()
  })

  it('renders a row for each member showing first name', () => {
    render(<TeamWorkloadPanel members={TEAM_MEMBERS} />)
    expect(screen.getByText('Aspen')).toBeInTheDocument()
    expect(screen.getByText('Marcus')).toBeInTheDocument()
  })
})
