import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TeamDeptTabs } from './TeamDeptTabs'

describe('TeamDeptTabs', () => {
  const defaultProps = {
    activeFilter: 'all',
    onFilterChange: vi.fn(),
    view: 'grid' as const,
    onViewChange: vi.fn(),
    memberCounts: { all: 8, development: 4, design: 2, management: 1, marketing: 1 },
  }

  it('renders all 5 department tabs with counts', () => {
    render(<TeamDeptTabs {...defaultProps} />)
    expect(screen.getByText('All Members')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
  })

  it('calls onFilterChange when a tab is clicked', async () => {
    const user = userEvent.setup()
    render(<TeamDeptTabs {...defaultProps} />)
    await user.click(screen.getByText('Design'))
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith('design')
  })

  it('renders Grid and List view buttons', () => {
    render(<TeamDeptTabs {...defaultProps} />)
    expect(screen.getByText('Grid')).toBeInTheDocument()
    expect(screen.getByText('List')).toBeInTheDocument()
  })
})
