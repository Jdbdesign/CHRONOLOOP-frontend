import { useState, useMemo, useCallback } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { useNavigate } from 'react-router-dom'
import { useCalendarStore } from '../store/calendarStore'
import { useTasksStore } from '../store/tasksStore'
import { useProjectsStore } from '../store/projectsStore'
import { useSprintsStore } from '../store/sprintsStore'
import { useToastStore } from '../store/toastStore'
import { getCalendarEvents, calPeriodTitle } from '../lib/calendarHelpers'
import { CAL_MEETINGS } from '../data/mockCalendarMeetings'
import type { CalendarEventType, NewCalendarEventInput } from '../types/calendar'
import { CalendarPageHeader } from '../components/calendar/CalendarPageHeader'
import { CalendarSubHeader } from '../components/calendar/CalendarSubHeader'
import { CalendarAgendaBar } from '../components/calendar/CalendarAgendaBar'
import { CalMonthView } from '../components/calendar/CalMonthView'
import { CalWeekView } from '../components/calendar/CalWeekView'
import { CalDayView } from '../components/calendar/CalDayView'
import { CalAgendaView } from '../components/calendar/CalAgendaView'
import { CalEventPopup } from '../components/calendar/CalEventPopup'
import { NewEventModal } from '../components/calendar/modals/NewEventModal'

export function CalendarPage() {
  const navigate = useNavigate()
  const showToast = useToastStore((s) => s.showToast)

  // Calendar store
  const view = useCalendarStore((s) => s.view)
  const currentDate = useCalendarStore((s) => s.currentDate)
  const filter = useCalendarStore((s) => s.filter)
  const userEvents = useCalendarStore((s) => s.userEvents)
  const setView = useCalendarStore((s) => s.setView)
  const setFilter = useCalendarStore((s) => s.setFilter)
  const calNavigate = useCalendarStore((s) => s.navigate)
  const goToday = useCalendarStore((s) => s.goToday)
  const setCurrentDate = useCalendarStore((s) => s.setCurrentDate)
  const addUserEvent = useCalendarStore((s) => s.addUserEvent)

  // Domain stores
  const tasks = useTasksStore((s) => s.tasks)
  const projects = useProjectsStore((s) => s.projects)
  const sprints = useSprintsStore((s) => s.sprints)

  // Local UI state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [popupEventId, setPopupEventId] = useState<string | null>(null)
  const [rangeStart, setRangeStart] = useState('')
  const [rangeEnd, setRangeEnd] = useState('')

  // Compute events
  const events = useMemo(
    () => getCalendarEvents(tasks, projects, sprints, CAL_MEETINGS, userEvents, filter),
    [tasks, projects, sprints, userEvents, filter],
  )

  const popupEvent = useMemo(
    () => events.find((e) => e.id === popupEventId) || null,
    [events, popupEventId],
  )

  const periodTitle = calPeriodTitle(view, currentDate)

  // Handlers
  const handleDayClick = useCallback(
    (isoDate: string) => {
      setCurrentDate(new Date(isoDate + 'T00:00:00'))
      setView('day')
    },
    [setCurrentDate, setView],
  )

  const handleEventClick = useCallback((evId: string) => {
    setPopupEventId(evId)
  }, [])

  const handlePopupClose = useCallback(() => {
    setPopupEventId(null)
  }, [])

  const handlePopupNavigate = useCallback(
    (type: CalendarEventType) => {
      if (type === 'task') navigate('/tasks')
      else if (type === 'project') navigate('/projects')
      else if (type === 'sprint') navigate('/sprints')
    },
    [navigate],
  )

  const handleSaveEvent = useCallback(
    (input: NewCalendarEventInput) => {
      addUserEvent(input)
      setCurrentDate(new Date(input.date + 'T00:00:00'))
      setIsModalOpen(false)
      showToast('Event added to calendar!', 'success', 2500)
    },
    [addUserEvent, setCurrentDate, showToast],
  )

  const handleResetRange = useCallback(() => {
    setRangeStart('')
    setRangeEnd('')
  }, [])

  // Render view
  const renderView = () => {
    switch (view) {
      case 'month':
        return (
          <CalMonthView
            events={events}
            currentDate={currentDate}
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
          />
        )
      case 'week':
        return (
          <CalWeekView events={events} currentDate={currentDate} onEventClick={handleEventClick} />
        )
      case 'day':
        return (
          <CalDayView events={events} currentDate={currentDate} onEventClick={handleEventClick} />
        )
      case 'agenda':
        return (
          <CalAgendaView
            events={events}
            currentDate={currentDate}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            onEventClick={handleEventClick}
            onNewEvent={() => setIsModalOpen(true)}
          />
        )
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden', height: '100%' }}>
      <CalendarPageHeader view={view} onViewChange={setView} onNewEvent={() => setIsModalOpen(true)} />
      <CalendarSubHeader
        periodTitle={periodTitle}
        filter={filter}
        onNavigate={calNavigate}
        onToday={goToday}
        onFilterChange={setFilter}
      />
      <CalendarAgendaBar
        visible={view === 'agenda'}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onRangeStartChange={setRangeStart}
        onRangeEndChange={setRangeEnd}
        onReset={handleResetRange}
      />

      <Popover.Root open={!!popupEvent} onOpenChange={(open) => { if (!open) handlePopupClose() }}>
        <Popover.Anchor style={{ position: 'absolute', top: 0, left: 0 }} />
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0, paddingTop: 12 }}>
          {renderView()}
        </div>
        {popupEvent && (
          <Popover.Portal>
            <Popover.Content
              side="right"
              sideOffset={10}
              collisionPadding={10}
              avoidCollisions
              style={{ zIndex: 450 }}
            >
              <CalEventPopup
                event={popupEvent}
                onClose={handlePopupClose}
                onNavigate={handlePopupNavigate}
              />
            </Popover.Content>
          </Popover.Portal>
        )}
      </Popover.Root>

      <NewEventModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
      />
    </div>
  )
}
