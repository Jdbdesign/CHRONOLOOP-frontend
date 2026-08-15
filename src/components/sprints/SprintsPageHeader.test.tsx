import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SprintsPageHeader } from './SprintsPageHeader'

describe('SprintsPageHeader', () => {
  it('renders breadcrumb, heading, and both view-toggle buttons', () => {
    render(<SprintsPageHeader view="list" onViewChange={() => {}} onApplyStatusFilters={() => {}} onNewSprint={() => {}} />)
    expect(screen.getByText('Overview / Sprints')).toBeInTheDocument()
    expect(screen.getByText('Sprints')).toBeInTheDocument()
    expect(screen.getByText('List')).toBeInTheDocument()
    expect(screen.getByText('Board')).toBeInTheDocument()
  })

  it('calls onViewChange when the Board button is clicked', async () => {
    const user = userEvent.setup()
    const onViewChange = vi.fn()
    render(<SprintsPageHeader view="list" onViewChange={onViewChange} onApplyStatusFilters={() => {}} onNewSprint={() => {}} />)
    await user.click(screen.getByText('Board'))
    expect(onViewChange).toHaveBeenCalledWith('board')
  })

  it('calls onNewSprint when New Sprint is clicked', async () => {
    const user = userEvent.setup()
    const onNewSprint = vi.fn()
    render(<SprintsPageHeader view="list" onViewChange={() => {}} onApplyStatusFilters={() => {}} onNewSprint={onNewSprint} />)
    await user.click(screen.getByText('New Sprint'))
    expect(onNewSprint).toHaveBeenCalled()
  })

  it('Apply calls onApplyStatusFilters with the checked status keys, or null when all 4 remain checked', async () => {
    const user = userEvent.setup()
    const onApplyStatusFilters = vi.fn()
    render(<SprintsPageHeader view="list" onViewChange={() => {}} onApplyStatusFilters={onApplyStatusFilters} onNewSprint={() => {}} />)
    await user.click(screen.getByText('Filter'))
    await user.click(screen.getByLabelText('Active'))
    await user.click(screen.getByText('Apply'))
    expect(onApplyStatusFilters).toHaveBeenCalledWith(['planning', 'upcoming', 'completed'])
  })

  it('Clear resets all status checkboxes and calls onApplyStatusFilters(null)', async () => {
    const user = userEvent.setup()
    const onApplyStatusFilters = vi.fn()
    render(<SprintsPageHeader view="list" onViewChange={() => {}} onApplyStatusFilters={onApplyStatusFilters} onNewSprint={() => {}} />)
    await user.click(screen.getByText('Filter'))
    await user.click(screen.getByLabelText('Active'))
    await user.click(screen.getByText('Clear'))
    expect(onApplyStatusFilters).toHaveBeenCalledWith(null)
    expect(screen.getByLabelText('Active')).toBeChecked()
  })

  it('Project checkboxes are decorative and never reach onApplyStatusFilters', async () => {
    const user = userEvent.setup()
    const onApplyStatusFilters = vi.fn()
    render(<SprintsPageHeader view="list" onViewChange={() => {}} onApplyStatusFilters={onApplyStatusFilters} onNewSprint={() => {}} />)
    await user.click(screen.getByText('Filter'))
    await user.click(screen.getByLabelText('Web 3 App for Fxtrade'))
    await user.click(screen.getByText('Apply'))
    expect(onApplyStatusFilters).toHaveBeenCalledWith(null) // all 4 statuses still checked; project group is decorative
  })
})
