import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalDayView } from './CalDayView'
import type { CalendarEvent } from '../../types/calendar'

describe('CalDayView', () => {
  const nov4 = new Date(2024, 10, 4) // Monday
  const defaultProps = {
    events: [] as CalendarEvent[],
    currentDate: nov4,
    onEventClick: vi.fn(),
  }

  it('renders the hero section with date number and day name', () => {
    render(<CalDayView {...defaultProps} />)
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('Monday')).toBeInTheDocument()
    expect(screen.getByText('Nov 4, 2024')).toBeInTheDocument()
  })

  it('renders event count badge', () => {
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'task', title: 'A', date: '2024-11-04', time: '09:00', duration: 60, color: '#4A90FF' },
      { id: 'e2', type: 'meeting', title: 'B', date: '2024-11-04', time: '10:00', duration: 30, color: '#FF8C42' },
    ]
    render(<CalDayView {...defaultProps} events={events} />)
    expect(screen.getByText('2 events')).toBeInTheDocument()
    expect(screen.getByText('1 tasks')).toBeInTheDocument()
    expect(screen.getByText('1 meetings')).toBeInTheDocument()
  })

  it('renders 15 time labels (6am-8pm)', () => {
    render(<CalDayView {...defaultProps} />)
    expect(screen.getByText('6am')).toBeInTheDocument()
    expect(screen.getByText('12pm')).toBeInTheDocument()
    expect(screen.getByText('8pm')).toBeInTheDocument()
  })

  it('renders event blocks with title, meta, and project', () => {
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'meeting', title: 'Team Sync', date: '2024-11-04', time: '10:00', duration: 60, project: 'Internal', color: '#FF8C42' },
    ]
    render(<CalDayView {...defaultProps} events={events} />)
    expect(screen.getByText('Team Sync')).toBeInTheDocument()
    expect(screen.getByText('Internal')).toBeInTheDocument()
  })

  it('does not render events outside 6am-8pm', () => {
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'task', title: 'Too Early', date: '2024-11-04', time: '04:00', duration: 60, color: '#4A90FF' },
    ]
    render(<CalDayView {...defaultProps} events={events} />)
    expect(screen.queryByText('Too Early')).not.toBeInTheDocument()
  })

  it('calls onEventClick when event block is clicked', async () => {
    const user = userEvent.setup()
    const onEventClick = vi.fn()
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'task', title: 'Click Me', date: '2024-11-04', time: '09:00', duration: 60, color: '#4A90FF' },
    ]
    render(<CalDayView {...defaultProps} events={events} onEventClick={onEventClick} />)
    await user.click(screen.getByText('Click Me'))
    expect(onEventClick).toHaveBeenCalledWith('e1', expect.any(HTMLElement))
  })

  it('includes multi-day events that span the current day', () => {
    const events: CalendarEvent[] = [
      {
        id: 'sp1', type: 'sprint', title: 'Sprint Multi', date: '2024-11-01',
        startDate: '2024-11-01', endDate: '2024-11-10', isMultiDay: true,
        time: '08:00', duration: 480, color: '#00D4AA',
      },
    ]
    render(<CalDayView {...defaultProps} events={events} />)
    expect(screen.getByText('Sprint Multi')).toBeInTheDocument()
  })
})
