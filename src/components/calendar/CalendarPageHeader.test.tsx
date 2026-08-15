import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalendarPageHeader } from './CalendarPageHeader'

describe('CalendarPageHeader', () => {
  const defaultProps = {
    view: 'month' as const,
    onViewChange: vi.fn(),
    onNewEvent: vi.fn(),
  }

  it('renders breadcrumb and heading', () => {
    render(<CalendarPageHeader {...defaultProps} />)
    expect(screen.getByText('ChronoLoop / Calendar')).toBeInTheDocument()
    expect(screen.getByText('Calendar')).toBeInTheDocument()
  })

  it('renders all four view buttons', () => {
    render(<CalendarPageHeader {...defaultProps} />)
    expect(screen.getByText('Month')).toBeInTheDocument()
    expect(screen.getByText('Week')).toBeInTheDocument()
    expect(screen.getByText('Day')).toBeInTheDocument()
    expect(screen.getByText('Agenda')).toBeInTheDocument()
  })

  it('marks active view button with aria-pressed', () => {
    render(<CalendarPageHeader {...defaultProps} view="week" />)
    expect(screen.getByText('Week').closest('button')).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Month').closest('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onViewChange when a view button is clicked', async () => {
    const user = userEvent.setup()
    render(<CalendarPageHeader {...defaultProps} />)
    await user.click(screen.getByText('Week').closest('button')!)
    expect(defaultProps.onViewChange).toHaveBeenCalledWith('week')
  })

  it('renders New Event button and calls onNewEvent on click', async () => {
    const user = userEvent.setup()
    render(<CalendarPageHeader {...defaultProps} />)
    await user.click(screen.getByText('New Event').closest('button')!)
    expect(defaultProps.onNewEvent).toHaveBeenCalled()
  })
})
