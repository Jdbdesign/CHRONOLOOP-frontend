import { CalendarDays, LayoutGrid, Calendar, List, Plus } from 'lucide-react'
import type { CalendarView } from '../../types/calendar'
import { Button } from '../ui/Button'
import { useIsMobile } from '../../hooks/useIsMobile'
import styles from './CalendarPageHeader.module.css'

interface Props {
  view: CalendarView
  onViewChange: (v: CalendarView) => void
  onNewEvent: () => void
}

const VIEW_BUTTONS: { id: CalendarView; icon: typeof CalendarDays; label: string }[] = [
  { id: 'month', icon: CalendarDays, label: 'Month' },
  { id: 'week', icon: LayoutGrid, label: 'Week' },
  { id: 'day', icon: Calendar, label: 'Day' },
  { id: 'agenda', icon: List, label: 'Agenda' },
]

export function CalendarPageHeader({ view, onViewChange, onNewEvent }: Props) {
  const isMobile = useIsMobile()

  const handleViewChange = (v: CalendarView) => {
    // Intercept: don't allow 'week' on mobile
    if (isMobile && v === 'week') {
      onViewChange('day')
      return
    }
    onViewChange(v)
  }

  return (
    <div className={styles.header}>
      <div>
        <div className={styles.breadcrumb}>ChronoLoop / Calendar</div>
        <h1 className={styles.heading}>Calendar</h1>
      </div>
      <div className={styles.actions}>
        <div className={styles.viewSwitcher}>
          {VIEW_BUTTONS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              className={`${styles.viewBtn}${view === id ? ` ${styles.active}` : ''}${id === 'week' ? ` ${styles.weekBtn}` : ''}`}
              onClick={() => handleViewChange(id)}
              aria-pressed={view === id}
            >
              <Icon />
              <span className={styles.viewLabel}>{label}</span>
            </button>
          ))}
        </div>
        <Button variant="primary" onClick={onNewEvent}>
          <Plus size={14} /> <span className={styles.newEventLabel}>New Event</span>
        </Button>
      </div>
    </div>
  )
}
