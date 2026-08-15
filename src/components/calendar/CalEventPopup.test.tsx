import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalEventPopup } from './CalEventPopup'
import type { CalendarEvent } from '../../types/calendar'

describe('CalEventPopup', () => {
  const baseEvent: CalendarEvent = {
    id: 'task-1',
    type: 'task',
    title: 'Homepage for CareyCare App',
    date: '2024-11-04',
    time: '09:00',
    duration: 60,
    project: 'Web 3 App for Fxtrade',
    assignee: 'AS',
    priority: 'high',
    status: 'in-progress',
    color: '#EAB308',
    progress: 50,
    notes: 'Build the homepage layout for CareyCare web application including hero section.',
    sourceId: 1,
    subtasks: [{ t: 'Build hero section', done: true }, { t: 'Add CTA buttons', done: false }],
  }

  const defaultProps = {
    event: baseEvent,
    onClose: vi.fn(),
    onNavigate: vi.fn(),
  }

  it('renders the event type badge', () => {
    render(<CalEventPopup {...defaultProps} />)
    expect(screen.getByText('Task')).toBeInTheDocument()
  })

  it('renders the event title', () => {
    render(<CalEventPopup {...defaultProps} />)
    expect(screen.getByText('Homepage for CareyCare App')).toBeInTheDocument()
  })

  it('renders project, date, time, assignee, priority, status rows', () => {
    render(<CalEventPopup {...defaultProps} />)
    expect(screen.getByText('Web 3 App for Fxtrade')).toBeInTheDocument()
    expect(screen.getByText('2024-11-04')).toBeInTheDocument()
    expect(screen.getByText(/9am · 60 min/)).toBeInTheDocument()
    expect(screen.getByText('AS')).toBeInTheDocument()
    expect(screen.getByText('high')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('renders progress bar and percentage', () => {
    render(<CalEventPopup {...defaultProps} />)
    expect(screen.getByText('50% complete')).toBeInTheDocument()
  })

  it('renders subtasks count', () => {
    render(<CalEventPopup {...defaultProps} />)
    expect(screen.getByText('1/2 done')).toBeInTheDocument()
  })

  it('renders truncated notes', () => {
    render(<CalEventPopup {...defaultProps} />)
    expect(screen.getByText(/Build the homepage/)).toBeInTheDocument()
  })

  it('renders Close button and calls onClose', async () => {
    const user = userEvent.setup()
    render(<CalEventPopup {...defaultProps} />)
    const closeButtons = screen.getAllByText('Close')
    await user.click(closeButtons[0])
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('renders View Task button for task type and calls onNavigate', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    const onClose = vi.fn()
    render(<CalEventPopup {...defaultProps} onClose={onClose} onNavigate={onNavigate} />)
    await user.click(screen.getByText('View Task'))
    expect(onClose).toHaveBeenCalled()
    expect(onNavigate).toHaveBeenCalledWith('task', 1)
  })

  it('renders View Project button for project type', () => {
    const projectEvent: CalendarEvent = {
      ...baseEvent, id: 'proj-p1', type: 'project', title: 'Project X', sourceId: 'p1',
    }
    render(<CalEventPopup {...defaultProps} event={projectEvent} />)
    expect(screen.getByText('View Project')).toBeInTheDocument()
  })

  it('renders View Sprint button for sprint type', () => {
    const sprintEvent: CalendarEvent = {
      ...baseEvent, id: 'sprint-s1', type: 'sprint', title: 'Sprint X', sourceId: 's1',
    }
    render(<CalEventPopup {...defaultProps} event={sprintEvent} />)
    expect(screen.getByText('View Sprint')).toBeInTheDocument()
  })

  it('does not render navigation button for meetings', () => {
    const meetingEvent: CalendarEvent = {
      ...baseEvent, id: 'm1', type: 'meeting', title: 'Daily', sourceId: undefined,
    }
    render(<CalEventPopup {...defaultProps} event={meetingEvent} />)
    expect(screen.queryByText('View Task')).not.toBeInTheDocument()
    expect(screen.queryByText('View Project')).not.toBeInTheDocument()
    expect(screen.queryByText('View Sprint')).not.toBeInTheDocument()
  })

  it('shows multi-day date range for multi-day events', () => {
    const multiEvent: CalendarEvent = {
      ...baseEvent, isMultiDay: true, startDate: '2024-11-04', endDate: '2024-11-10',
    }
    render(<CalEventPopup {...defaultProps} event={multiEvent} />)
    expect(screen.getByText(/2024-11-04 → 2024-11-10/)).toBeInTheDocument()
  })
})
