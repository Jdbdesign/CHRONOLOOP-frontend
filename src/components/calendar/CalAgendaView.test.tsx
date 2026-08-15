import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalAgendaView } from './CalAgendaView'
import type { CalendarEvent } from '../../types/calendar'

describe('CalAgendaView', () => {
  const nov1 = new Date(2024, 10, 1)
  const defaultProps = {
    events: [] as CalendarEvent[],
    currentDate: nov1,
    rangeStart: '',
    rangeEnd: '',
    onEventClick: vi.fn(),
    onNewEvent: vi.fn(),
  }

  it('shows empty state when no events match', () => {
    render(<CalAgendaView {...defaultProps} />)
    expect(screen.getByText('No events in this range')).toBeInTheDocument()
    expect(screen.getByText(/Try adjusting/)).toBeInTheDocument()
  })

  it('empty state New Event button calls onNewEvent', async () => {
    const user = userEvent.setup()
    render(<CalAgendaView {...defaultProps} />)
    await user.click(screen.getByText('New Event').closest('button')!)
    expect(defaultProps.onNewEvent).toHaveBeenCalled()
  })

  it('renders grouped events by date with date headers', () => {
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'meeting', title: 'Standup', date: '2024-11-04', time: '09:00', duration: 30, color: '#FF8C42', project: 'Internal' },
      { id: 'e2', type: 'task', title: 'Code Review', date: '2024-11-05', time: '14:00', duration: 60, color: '#4A90FF', project: 'Proj' },
    ]
    render(<CalAgendaView {...defaultProps} events={events} />)
    expect(screen.getByText('Standup')).toBeInTheDocument()
    expect(screen.getByText('Code Review')).toBeInTheDocument()
    // Date headers
    expect(screen.getByText(/Mon, November 4, 2024/)).toBeInTheDocument()
    expect(screen.getByText(/Tue, November 5, 2024/)).toBeInTheDocument()
  })

  it('renders event type badge and project', () => {
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'meeting', title: 'Sync', date: '2024-11-04', time: '10:00', duration: 45, color: '#FF8C42', project: 'Web 3 App' },
    ]
    render(<CalAgendaView {...defaultProps} events={events} />)
    expect(screen.getByText('Meeting')).toBeInTheDocument()
    expect(screen.getByText('Web 3 App')).toBeInTheDocument()
  })

  it('calls onEventClick when an event row is clicked', async () => {
    const user = userEvent.setup()
    const onEventClick = vi.fn()
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'task', title: 'Click Me', date: '2024-11-04', time: '09:00', color: '#4A90FF' },
    ]
    render(<CalAgendaView {...defaultProps} events={events} onEventClick={onEventClick} />)
    await user.click(screen.getByText('Click Me'))
    expect(onEventClick).toHaveBeenCalledWith('e1', expect.any(HTMLElement))
  })

  it('respects rangeStart and rangeEnd props', () => {
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'task', title: 'In Range', date: '2024-11-10', time: '09:00', color: '#4A90FF' },
      { id: 'e2', type: 'task', title: 'Out of Range', date: '2024-12-15', time: '09:00', color: '#4A90FF' },
    ]
    render(<CalAgendaView {...defaultProps} events={events} rangeStart="2024-11-01" rangeEnd="2024-11-30" />)
    expect(screen.getByText('In Range')).toBeInTheDocument()
    expect(screen.queryByText('Out of Range')).not.toBeInTheDocument()
  })

  it('shows event count in date header', () => {
    const events: CalendarEvent[] = [
      { id: 'e1', type: 'task', title: 'A', date: '2024-11-04', time: '09:00', color: '#4A90FF' },
      { id: 'e2', type: 'task', title: 'B', date: '2024-11-04', time: '10:00', color: '#4A90FF' },
    ]
    render(<CalAgendaView {...defaultProps} events={events} />)
    expect(screen.getByText('2 events')).toBeInTheDocument()
  })
})
