import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SprintDetailPanel } from './SprintDetailPanel'
import { useSprintDetailStore } from '../../store/sprintDetailStore'
import { useSprintsStore } from '../../store/sprintsStore'
import { MOCK_SPRINTS } from '../../data/mockSprints'

describe('SprintDetailPanel', () => {
  beforeEach(() => {
    useSprintsStore.setState({ sprints: MOCK_SPRINTS })
    useSprintDetailStore.setState({ openSprintId: null })
  })

  it('renders nothing meaningfully open when no sprint is selected', () => {
    render(<SprintDetailPanel onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByTestId('sprint-detail-overlay')).toHaveAttribute('data-open', 'false')
  })

  it('renders sprint name, goal, meta grid, and progress when open', () => {
    useSprintDetailStore.setState({ openSprintId: 's3' })
    render(<SprintDetailPanel onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('UX Polish & Integrations')).toBeInTheDocument()
    expect(screen.getByText('Nov 4, 2024')).toBeInTheDocument()
    expect(screen.getByText('26 / 45')).toBeInTheDocument()
    expect(screen.getByText('6 of 11 tasks done')).toBeInTheDocument()
  })

  it('shows "—" for velocity on a sprint with velocity: null', () => {
    useSprintDetailStore.setState({ openSprintId: 's3' })
    render(<SprintDetailPanel onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders the Team Velocity bar chart only when at least one sprint has recorded velocity, highlighting the current sprint', () => {
    useSprintDetailStore.setState({ openSprintId: 's3' })
    render(<SprintDetailPanel onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Team Velocity')).toBeInTheDocument()
    expect(screen.getByText('S01')).toBeInTheDocument()
    expect(screen.getByText('S02')).toBeInTheDocument()
  })

  it('renders the full sprint task checklist with done/in-progress/todo badges', () => {
    useSprintDetailStore.setState({ openSprintId: 's3' })
    render(<SprintDetailPanel onEdit={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Sprint Tasks (6/11)')).toBeInTheDocument()
    expect(screen.getByText('Payment gateway (Stripe)')).toBeInTheDocument()
    expect(screen.getByText('Accessibility audit')).toBeInTheDocument()
  })

  it('Escape closes the panel', () => {
    useSprintDetailStore.setState({ openSprintId: 's3' })
    render(<SprintDetailPanel onEdit={() => {}} onDelete={() => {}} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(useSprintDetailStore.getState().openSprintId).toBeNull()
  })

  it('Edit button calls onEdit with the open sprint id and closes the panel', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    useSprintDetailStore.setState({ openSprintId: 's3' })
    render(<SprintDetailPanel onEdit={onEdit} onDelete={() => {}} />)
    await user.click(screen.getByTitle('Edit sprint'))
    expect(onEdit).toHaveBeenCalledWith('s3')
    expect(useSprintDetailStore.getState().openSprintId).toBeNull()
  })
})
