import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TeamPageHeader } from './TeamPageHeader'

describe('TeamPageHeader', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    sortMode: 'name',
    onSortChange: vi.fn(),
    onInvite: vi.fn(),
  }

  it('renders breadcrumb, heading, and search', () => {
    render(<TeamPageHeader {...defaultProps} />)
    expect(screen.getByText('Overview / Team')).toBeInTheDocument()
    expect(screen.getByText('Team')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search members...')).toBeInTheDocument()
  })

  it('calls onSearchChange when typing in search', async () => {
    const user = userEvent.setup()
    render(<TeamPageHeader {...defaultProps} />)
    await user.type(screen.getByPlaceholderText('Search members...'), 'dev')
    expect(defaultProps.onSearchChange).toHaveBeenCalled()
  })

  it('calls onInvite when Add Member is clicked', async () => {
    const user = userEvent.setup()
    render(<TeamPageHeader {...defaultProps} />)
    await user.click(screen.getByText('Add Member').closest('button')!)
    expect(defaultProps.onInvite).toHaveBeenCalled()
  })
})
