import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewSprintModal } from './NewSprintModal'
import { useSprintModalStore } from '../../../store/sprintModalStore'
import { useSprintsStore } from '../../../store/sprintsStore'
import { MOCK_SPRINTS } from '../../../data/mockSprints'

describe('NewSprintModal', () => {
  beforeEach(() => {
    useSprintsStore.setState({ sprints: MOCK_SPRINTS })
    useSprintModalStore.setState({ isNewOpen: false })
  })

  it('is not rendered as open when isNewOpen is false', () => {
    render(<NewSprintModal />)
    expect(screen.queryByText('New Sprint')).not.toBeInTheDocument()
  })

  it('rejects submission with a blank name', async () => {
    const user = userEvent.setup()
    useSprintModalStore.setState({ isNewOpen: true })
    render(<NewSprintModal />)
    await user.click(screen.getByText('Create Sprint'))
    expect(useSprintsStore.getState().sprints).toHaveLength(5) // unchanged
  })

  it('creates a sprint and closes on valid submission', async () => {
    const user = userEvent.setup()
    useSprintModalStore.setState({ isNewOpen: true })
    render(<NewSprintModal />)
    await user.type(screen.getByLabelText('Sprint Name *'), 'Growth Experiments')
    await user.type(screen.getByLabelText('Story Point Capacity'), '35')
    await user.click(screen.getByText('Create Sprint'))
    expect(useSprintsStore.getState().sprints[0].name).toBe('Growth Experiments')
    expect(useSprintModalStore.getState().isNewOpen).toBe(false)
  })

  it('form resets after close (key-based reset, not stale on reopen)', async () => {
    const user = userEvent.setup()
    useSprintModalStore.setState({ isNewOpen: true })
    const { rerender } = render(<NewSprintModal />)
    await user.type(screen.getByLabelText('Sprint Name *'), 'Draft text')
    useSprintModalStore.setState({ isNewOpen: false })
    rerender(<NewSprintModal />)
    useSprintModalStore.setState({ isNewOpen: true })
    rerender(<NewSprintModal />)
    expect(screen.getByLabelText('Sprint Name *')).toHaveValue('')
  })
})
