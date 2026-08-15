import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalendarAgendaBar } from './CalendarAgendaBar'

describe('CalendarAgendaBar', () => {
  const defaultProps = {
    visible: true,
    rangeStart: '',
    rangeEnd: '',
    onRangeStartChange: vi.fn(),
    onRangeEndChange: vi.fn(),
    onReset: vi.fn(),
  }

  it('renders nothing when not visible', () => {
    const { container } = render(<CalendarAgendaBar {...defaultProps} visible={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders From/To labels and inputs when visible', () => {
    render(<CalendarAgendaBar {...defaultProps} />)
    expect(screen.getByText('From')).toBeInTheDocument()
    expect(screen.getByText('To')).toBeInTheDocument()
    expect(screen.getByLabelText('Agenda start date')).toBeInTheDocument()
    expect(screen.getByLabelText('Agenda end date')).toBeInTheDocument()
  })

  it('renders Reset button and calls onReset on click', async () => {
    const user = userEvent.setup()
    render(<CalendarAgendaBar {...defaultProps} />)
    await user.click(screen.getByText('Reset'))
    expect(defaultProps.onReset).toHaveBeenCalled()
  })

  it('calls onRangeStartChange when start input changes', async () => {
    const user = userEvent.setup()
    render(<CalendarAgendaBar {...defaultProps} />)
    const input = screen.getByLabelText('Agenda start date')
    await user.type(input, '2024-11-01')
    expect(defaultProps.onRangeStartChange).toHaveBeenCalled()
  })
})
