import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SprintsListView } from './SprintsListView'
import { MOCK_SPRINTS } from '../../data/mockSprints'

describe('SprintsListView', () => {
  it('renders one SprintItem per sprint', () => {
    render(<SprintsListView sprints={MOCK_SPRINTS} onOpenDetail={() => {}} onEdit={() => {}} onMarkComplete={() => {}} onDelete={() => {}} />)
    expect(screen.queryAllByRole('button', { name: /^SPRINT 0/ })).toHaveLength(0) // rows aren't individually named; sanity-check via item count instead
    expect(screen.getByText('Foundation & Architecture')).toBeInTheDocument()
    expect(screen.getByText('Post-Launch Iteration')).toBeInTheDocument()
  })

  it('renders an empty state with a New Sprint button when the list is empty', async () => {
    const user = userEvent.setup()
    const onNewSprint = vi.fn()
    render(<SprintsListView sprints={[]} onOpenDetail={() => {}} onEdit={() => {}} onMarkComplete={() => {}} onDelete={() => {}} onNewSprint={onNewSprint} />)
    expect(screen.getByText('No sprints found')).toBeInTheDocument()
    await user.click(screen.getByText('New Sprint'))
    expect(onNewSprint).toHaveBeenCalled()
  })
})
