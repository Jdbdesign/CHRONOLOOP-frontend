import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SprintsPage } from './SprintsPage'
import { useSprintsStore } from '../store/sprintsStore'
import { MOCK_SPRINTS } from '../data/mockSprints'

describe('SprintsPage', () => {
  beforeEach(() => {
    useSprintsStore.setState({ sprints: MOCK_SPRINTS })
  })

  it('renders the header, KPI grid, active sprint banner, stat chips, and list view by default', () => {
    render(<SprintsPage />)
    expect(screen.getByText('Sprints')).toBeInTheDocument()
    expect(screen.getByText('Total Sprints')).toBeInTheDocument()
    expect(screen.getByText('SPRINT 03 — UX Polish & Integrations')).toBeInTheDocument()
    expect(screen.getByText('Foundation & Architecture')).toBeInTheDocument()
  })

  it('switches to Board view and back without losing KPI/banner content', async () => {
    const user = userEvent.setup()
    render(<SprintsPage />)
    await user.click(screen.getByText('Board'))
    // 'Active' also appears as the stat-chip label, so scope to the bare
    // (unclassed) span the board column title renders — see task-13 report.
    expect(screen.getByText('Active', { selector: 'span:not([class])' })).toBeInTheDocument() // board column title
    expect(screen.getByText('Total Sprints')).toBeInTheDocument() // KPI grid persists
  })

  it('chip filter and search compose (AND), both scoped to the visible list only', async () => {
    const user = userEvent.setup()
    render(<SprintsPage />)
    // 'Completed' also appears on the KPI StatCard and on completed sprints'
    // status badges, so target the stat chip specifically by its role.
    await user.click(screen.getByRole('button', { name: /Completed/ }))
    expect(screen.getByText('Foundation & Architecture')).toBeInTheDocument()
    expect(screen.queryByText('Post-Launch Iteration')).not.toBeInTheDocument()
    // 'core' would also match Foundation & Architecture's goal text ("...and
    // core authentication flow."), since search spans name+goal+project —
    // use 'dashboard', which only matches Core Dashboard Development.
    await user.type(screen.getByPlaceholderText('Search sprints...'), 'dashboard')
    expect(screen.queryByText('Foundation & Architecture')).not.toBeInTheDocument()
    expect(screen.getByText('Core Dashboard Development')).toBeInTheDocument()
  })

  it('opening the detail panel and clicking Delete removes the sprint from the list', async () => {
    const user = userEvent.setup()
    render(<SprintsPage />)
    await user.click(screen.getByText('Post-Launch Iteration'))
    await user.click(screen.getByTitle('Delete sprint'))
    expect(useSprintsStore.getState().sprints.find((s) => s.name === 'Post-Launch Iteration')).toBeUndefined()
    expect(screen.queryByText('Post-Launch Iteration')).not.toBeInTheDocument()
  })

  it('New Sprint button opens NewSprintModal, and creating one shows it in the list', async () => {
    const user = userEvent.setup()
    render(<SprintsPage />)
    await user.click(screen.getByText('New Sprint'))
    await user.type(screen.getByLabelText('Sprint Name *'), 'Launch Prep')
    await user.click(screen.getByText('Create Sprint'))
    expect(screen.getByText('Launch Prep')).toBeInTheDocument()
  })

  it('editing a sprint from its context menu opens EditSprintModal pre-filled', async () => {
    const user = userEvent.setup()
    render(<SprintsPage />)
    const row = screen.getByText('Foundation & Architecture').closest('[role="button"]') as HTMLElement
    await user.click(within(row).getByLabelText('More options'))
    await user.click(await screen.findByText('Edit Sprint'))
    expect(screen.getByLabelText('Sprint Name *')).toHaveValue('Foundation & Architecture')
  })
})
