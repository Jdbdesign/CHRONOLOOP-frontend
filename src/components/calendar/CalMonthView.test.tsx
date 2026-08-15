import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalMonthView } from './CalMonthView'
import type { CalendarEvent } from '../../types/calendar'

describe('CalMonthView', () => {
  const nov2024 = new Date(2024, 10, 1)
  const defaultProps = {
    events: [] as CalendarEvent[],
    currentDate: nov2024,
    onDayClick: vi.fn(),
    onEventClick: vi.fn(),
  }

  it('renders 7 day-of-week headers starting with Mon', () => {
    render(<CalMonthView {...defaultProps} />)
    const headers = screen.getAllByText(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/)
    expect(headers).toHaveLength(7)
    expect(headers[0]).toHaveTextContent('Mon')
    expect(headers[6]).toHaveTextContent('Sun')
  })

  it('renders 42 day cells', () => {
    const { container } = render(<CalMonthView {...defaultProps} />)
    const cells = container.querySelectorAll('[data-date]')
    expect(cells).toHaveLength(42)
  })

  it('marks cells from adjacent months as other-month', () => {
    const { container } = render(<CalMonthView {...defaultProps} />)
    // Nov 2024 starts on Friday, so Mon-Thu (Oct 28-31) are other-month
    const oct28Cell = container.querySelector('[data-date="2024-10-28"]')
    expect(oct28Cell?.className).toContain('otherMonth')
  })

  it('calls onDayClick when a day cell is clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<CalMonthView {...defaultProps} />)
    const cell = container.querySelector('[data-date="2024-11-05"]')!
    await user.click(cell)
    expect(defaultProps.onDayClick).toHaveBeenCalledWith('2024-11-05')
  })

  it('renders up to 3 event pills per day', () => {
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'task', title: 'Task A', date: '2024-11-04', color: '#4A90FF' },
      { id: 'e2', type: 'task', title: 'Task B', date: '2024-11-04', color: '#4A90FF' },
      { id: 'e3', type: 'task', title: 'Task C', date: '2024-11-04', color: '#4A90FF' },
      { id: 'e4', type: 'task', title: 'Task D', date: '2024-11-04', color: '#4A90FF' },
    ]
    render(<CalMonthView {...defaultProps} events={events} />)
    expect(screen.getByText('Task A')).toBeInTheDocument()
    expect(screen.getByText('Task B')).toBeInTheDocument()
    expect(screen.getByText('Task C')).toBeInTheDocument()
    expect(screen.queryByText('Task D')).not.toBeInTheDocument()
  })

  it('shows +N more button when >3 events on a day', () => {
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'task', title: 'A', date: '2024-11-04', color: '#000' },
      { id: 'e2', type: 'task', title: 'B', date: '2024-11-04', color: '#000' },
      { id: 'e3', type: 'task', title: 'C', date: '2024-11-04', color: '#000' },
      { id: 'e4', type: 'task', title: 'D', date: '2024-11-04', color: '#000' },
      { id: 'e5', type: 'task', title: 'E', date: '2024-11-04', color: '#000' },
    ]
    render(<CalMonthView {...defaultProps} events={events} />)
    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })

  it('+N more button calls onDayClick (jump to day)', async () => {
    const user = userEvent.setup()
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'task', title: 'A', date: '2024-11-04', color: '#000' },
      { id: 'e2', type: 'task', title: 'B', date: '2024-11-04', color: '#000' },
      { id: 'e3', type: 'task', title: 'C', date: '2024-11-04', color: '#000' },
      { id: 'e4', type: 'task', title: 'D', date: '2024-11-04', color: '#000' },
    ]
    render(<CalMonthView {...defaultProps} events={events} />)
    await user.click(screen.getByText('+1 more'))
    expect(defaultProps.onDayClick).toHaveBeenCalledWith('2024-11-04')
  })

  it('calls onEventClick when a pill is clicked without triggering onDayClick', async () => {
    const user = userEvent.setup()
    const onDayClick = vi.fn()
    const onEventClick = vi.fn()
    const events: CalendarEvent[] = [
      { id: 'ev1', type: 'meeting', title: 'Meeting X', date: '2024-11-04', color: '#FF8C42' },
    ]
    render(<CalMonthView {...defaultProps} events={events} onDayClick={onDayClick} onEventClick={onEventClick} />)
    await user.click(screen.getByText('Meeting X'))
    expect(onEventClick).toHaveBeenCalledWith('ev1')
    expect(onDayClick).not.toHaveBeenCalled()
  })

  it('expands multi-day events across multiple cells', () => {
    const events: CalendarEvent[] = [
      {
        id: 'multi', type: 'sprint', title: 'Sprint X', date: '2024-11-04',
        startDate: '2024-11-04', endDate: '2024-11-06', isMultiDay: true, color: '#00D4AA',
      },
    ]
    render(<CalMonthView {...defaultProps} events={events} />)
    // Should appear in Nov 4, 5, and 6
    const pills = screen.getAllByText('Sprint X')
    expect(pills).toHaveLength(3)
  })
})
