import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditSprintModal } from './EditSprintModal'
import { useSprintModalStore } from '../../../store/sprintModalStore'
import { useSprintsStore } from '../../../store/sprintsStore'
import { MOCK_SPRINTS } from '../../../data/mockSprints'

describe('EditSprintModal', () => {
  beforeEach(() => {
    useSprintsStore.setState({ sprints: MOCK_SPRINTS })
    useSprintModalStore.setState({ editingSprintId: null })
  })

  it('is not rendered as open when editingSprintId is null', () => {
    render(<EditSprintModal />)
    expect(screen.queryByText('Edit Sprint')).not.toBeInTheDocument()
  })

  it('pre-fills the form from the sprint being edited', () => {
    useSprintModalStore.setState({ editingSprintId: 's4' })
    render(<EditSprintModal />)
    expect(screen.getByLabelText('Sprint Name *')).toHaveValue('Testing & Hardening')
    expect(screen.getByLabelText('Story Point Capacity')).toHaveValue(38)
    expect(screen.getByLabelText('Status')).toHaveValue('planning')
  })

  it('saves the edited fields and closes', async () => {
    const user = userEvent.setup()
    useSprintModalStore.setState({ editingSprintId: 's4' })
    render(<EditSprintModal />)
    await user.clear(screen.getByLabelText('Sprint Name *'))
    await user.type(screen.getByLabelText('Sprint Name *'), 'Hardening Sprint')
    await user.click(screen.getByText('Save Changes'))
    expect(useSprintsStore.getState().sprints.find((s) => s.id === 's4')?.name).toBe('Hardening Sprint')
    expect(useSprintModalStore.getState().editingSprintId).toBeNull()
  })

  it('rejects a save with a blank name', async () => {
    const user = userEvent.setup()
    useSprintModalStore.setState({ editingSprintId: 's4' })
    render(<EditSprintModal />)
    await user.clear(screen.getByLabelText('Sprint Name *'))
    await user.click(screen.getByText('Save Changes'))
    expect(useSprintsStore.getState().sprints.find((s) => s.id === 's4')?.name).toBe('Testing & Hardening')
  })

  it('setting status to completed forces progress to 100', async () => {
    const user = userEvent.setup()
    useSprintModalStore.setState({ editingSprintId: 's4' })
    render(<EditSprintModal />)
    await user.selectOptions(screen.getByLabelText('Status'), 'completed')
    await user.click(screen.getByText('Save Changes'))
    expect(useSprintsStore.getState().sprints.find((s) => s.id === 's4')?.progress).toBe(100)
  })
})
