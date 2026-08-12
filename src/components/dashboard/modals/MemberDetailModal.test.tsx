import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemberDetailModal } from './MemberDetailModal'
import { useDashboardUiStore } from '../../../store/dashboardUiStore'

describe('MemberDetailModal', () => {
  it('renders the selected member\'s name, role, real email, and active task count', () => {
    useDashboardUiStore.setState({ activeModal: 'member', selectedMemberId: 'MV' })
    render(<MemberDetailModal />)
    expect(screen.getByText('Marley Vaccaro')).toBeInTheDocument()
    expect(screen.getByText('UI/UX Designer')).toBeInTheDocument()
    expect(screen.getByText('marley@example.com')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('renders nothing when no member is selected', () => {
    useDashboardUiStore.setState({ activeModal: 'member', selectedMemberId: null })
    render(<MemberDetailModal />)
    expect(screen.queryByText('Team Member')).not.toBeInTheDocument()
  })
})
