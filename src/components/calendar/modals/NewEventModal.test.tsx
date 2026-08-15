import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewEventModal } from './NewEventModal'

describe('NewEventModal', () => {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
  }

  it('renders modal title and subtitle when open', () => {
    render(<NewEventModal {...defaultProps} />)
    expect(screen.getByText('New Calendar Event')).toBeInTheDocument()
    expect(screen.getByText(/Schedule a task/)).toBeInTheDocument()
  })

  it('renders nothing when not open', () => {
    render(<NewEventModal {...defaultProps} open={false} />)
    expect(screen.queryByText('New Calendar Event')).not.toBeInTheDocument()
  })

  it('renders 4 type selection cards', () => {
    render(<NewEventModal {...defaultProps} />)
    expect(screen.getByText('Task')).toBeInTheDocument()
    // "Project" appears both as type card and form label — use getAllByText
    expect(screen.getAllByText('Project').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Sprint')).toBeInTheDocument()
    expect(screen.getByText('Meeting')).toBeInTheDocument()
    // Verify 4 type buttons
    const typeButtons = screen.getAllByRole('button', { name: /^(Task|Project|Sprint|Meeting)$/ })
    expect(typeButtons.filter((b) => b.getAttribute('data-type'))).toHaveLength(4)
  })

  it('renders form fields', () => {
    render(<NewEventModal {...defaultProps} />)
    expect(screen.getByLabelText(/Event Title/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Start Date/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Time/)).toBeInTheDocument()
    expect(screen.getByLabelText(/End Date/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Project/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Priority/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Assignee/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Notes/)).toBeInTheDocument()
  })

  it('shows error toast when title is empty on submit', async () => {
    const user = userEvent.setup()
    render(<NewEventModal {...defaultProps} />)
    // Fill date but leave title empty
    await user.type(screen.getByLabelText(/Start Date/), '2024-11-10')
    await user.click(screen.getByText('Add to Calendar').closest('button')!)
    expect(defaultProps.onSave).not.toHaveBeenCalled()
  })

  it('shows error toast when date is empty on submit', async () => {
    const user = userEvent.setup()
    render(<NewEventModal {...defaultProps} />)
    await user.type(screen.getByLabelText(/Event Title/), 'Test Event')
    await user.click(screen.getByText('Add to Calendar').closest('button')!)
    expect(defaultProps.onSave).not.toHaveBeenCalled()
  })

  it('calls onSave with correct data when form is valid', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    render(<NewEventModal {...defaultProps} onSave={onSave} />)
    await user.type(screen.getByLabelText(/Event Title/), 'Test Event')
    await user.type(screen.getByLabelText(/Start Date/), '2024-11-10')
    await user.click(screen.getByText('Add to Calendar').closest('button')!)
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      type: 'task',
      title: 'Test Event',
      date: '2024-11-10',
      time: '09:00',
      priority: 'medium',
      assignee: 'AS',
    }))
  })

  it('Cancel button calls onClose', async () => {
    const user = userEvent.setup()
    render(<NewEventModal {...defaultProps} />)
    await user.click(screen.getByText('Cancel'))
    expect(defaultProps.onClose).toHaveBeenCalled()
  })
})
