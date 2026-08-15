import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalWeekView } from './CalWeekView'
import type { CalendarEvent } from '../../types/calendar'

describe('CalWeekView', () => {
  // Nov 4, 2024 is a Monday
  const nov4 = new Date(2024, 10, 4)
  const defaultProps = {
    events: [] as CalendarEvent[],
    currentDate: nov4,
    onEventClick: vi.fn(),
  }

  it('renders 7 day column headers with day names', () => {
    render(<CalWeekView {...defaultProps} />)
    expect(screen.getAllByText(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/)).toHaveLength(7)
  })

  it('renders day numbers for the week', () => {
    render(<CalWeekView {...defaultProps} />)
    // Nov 4-10
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('renders 14 time labels (7am-8pm)', () => {
    render(<CalWeekView {...defaultProps} />)
    expect(screen.getByText('7am')).toBeInTheDocument()
    expect(screen.getByText('12pm')).toBeInTheDocument()
    expect(screen.getByText('8pm')).toBeInTheDocument()
  })

  it('renders event blocks positioned by time', () => {
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'meeting', title: 'Standup', date: '2024-11-04', time: '09:00', duration: 30, color: '#FF8C42' },
    ]
    render(<CalWeekView {...defaultProps} events={events} />)
    expect(screen.getByText('Standup')).toBeInTheDocument()
    // "9am" appears both as a time-gutter label and in the event time
    expect(screen.getAllByText('9am').length).toBeGreaterThanOrEqual(2)
  })

  it('calls onEventClick when event block is clicked', async () => {
    const user = userEvent.setup()
    const onEventClick = vi.fn()
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'meeting', title: 'Click Me', date: '2024-11-04', time: '10:00', duration: 60, color: '#FF8C42' },
    ]
    render(<CalWeekView {...defaultProps} events={events} onEventClick={onEventClick} />)
    await user.click(screen.getByText('Click Me'))
    expect(onEventClick).toHaveBeenCalledWith('e1')
  })

  it('does not render events outside 7am-8pm range', () => {
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'task', title: 'Early', date: '2024-11-04', time: '05:00', duration: 60, color: '#4A90FF' },
    ]
    render(<CalWeekView {...defaultProps} events={events} />)
    expect(screen.queryByText('Early')).not.toBeInTheDocument()
  })

  it('shows multi-day events on all relevant days within the week', () => {
    const events: CalendarEvent[] = [
      {
        id: 'sprint1', type: 'sprint', title: 'Sprint Y', date: '2024-11-04',
        startDate: '2024-11-04', endDate: '2024-11-06', isMultiDay: true,
        time: '08:00', duration: 480, color: '#00D4AA',
      },
    ]
    render(<CalWeekView {...defaultProps} events={events} />)
    // Should appear in Mon, Tue, Wed columns
    expect(screen.getAllByText('Sprint Y')).toHaveLength(3)
  })
})
