import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamMemberGrid } from './TeamMemberGrid'
import { TEAM_MEMBERS } from '../../data/mockTeamMembers'

describe('TeamMemberGrid', () => {
  it('renders all members as cards', () => {
    render(<TeamMemberGrid members={TEAM_MEMBERS} view="grid" onOpenDetail={vi.fn()} />)
    expect(screen.getByText('Aspen Herwitz')).toBeInTheDocument()
    expect(screen.getByText('Marcus Webb')).toBeInTheDocument()
  })

  it('shows empty state when no members', () => {
    render(<TeamMemberGrid members={[]} view="grid" onOpenDetail={vi.fn()} />)
    expect(screen.getByText('No members found')).toBeInTheDocument()
  })
})
