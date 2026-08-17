import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemberProfileModal } from './MemberProfileModal'
import { TEAM_MEMBERS } from '../../../data/mockTeamMembers'

describe('MemberProfileModal', () => {
  const member = TEAM_MEMBERS[0]

  it('renders nothing when member is null', () => {
    render(<MemberProfileModal open={true} onClose={vi.fn()} member={null} />)
    expect(screen.queryByText('Team Member')).not.toBeInTheDocument()
  })

  it('renders member name, role, email, and real completion', () => {
    render(<MemberProfileModal open={true} onClose={vi.fn()} member={member} />)
    expect(screen.getByText('Aspen Herwitz')).toBeInTheDocument()
    expect(screen.getByText('Senior Developer')).toBeInTheDocument()
    expect(screen.getByText('aspen.h@chronoloop.io')).toBeInTheDocument()
    expect(screen.getByText('94%')).toBeInTheDocument() // real completion, not hardcoded 92%
  })

  it('renders active tasks from member data', () => {
    render(<MemberProfileModal open={true} onClose={vi.fn()} member={member} />)
    expect(screen.getByText('8')).toBeInTheDocument()
  })
})
