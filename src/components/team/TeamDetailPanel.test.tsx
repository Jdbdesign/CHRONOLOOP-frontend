import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TeamDetailPanel } from './TeamDetailPanel'
import { useTeamDetailStore } from '../../store/teamDetailStore'

describe('TeamDetailPanel', () => {
  beforeEach(() => {
    useTeamDetailStore.setState({ openMemberId: null })
  })

  it('does not show content when no member is open', () => {
    render(<TeamDetailPanel onQuickView={vi.fn()} />)
    expect(screen.queryByText('Member Profile')).toBeInTheDocument() // header always rendered
    expect(screen.queryByText('Aspen Herwitz')).not.toBeInTheDocument()
  })

  it('shows member details when a member is opened', () => {
    useTeamDetailStore.setState({ openMemberId: 'tm1' })
    render(<TeamDetailPanel onQuickView={vi.fn()} />)
    expect(screen.getByText('Aspen Herwitz')).toBeInTheDocument()
    expect(screen.getByText('Senior Developer · Development')).toBeInTheDocument()
    expect(screen.getByText('aspen.h@chronoloop.io')).toBeInTheDocument()
  })

  it('shows performance stats', () => {
    useTeamDetailStore.setState({ openMemberId: 'tm1' })
    render(<TeamDetailPanel onQuickView={vi.fn()} />)
    expect(screen.getByText('Active Tasks')).toBeInTheDocument()
    expect(screen.getByText('94%')).toBeInTheDocument()
  })
})
