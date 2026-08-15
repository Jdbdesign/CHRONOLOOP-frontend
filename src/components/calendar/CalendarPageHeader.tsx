import { CalendarDays, LayoutGrid, Calendar, List, Plus } from 'lucide-react'
import type { CalendarView } from '../../types/calendar'
import { Button } from '../ui/Button'
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
  return (
    <div className={styles.header}>
      <div>
        <div className={styles.breadcrumb}>ChronoLoop / Calendar</div>
        <div className={styles.heading}>Calendar</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className={styles.viewSwitcher}>
          {VIEW_BUTTONS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              className={`${styles.viewBtn}${view === id ? ` ${styles.active}` : ''}`}
              onClick={() => onViewChange(id)}
              aria-pressed={view === id}
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </div>
        <Button variant="primary" onClick={onNewEvent}>
          <Plus size={14} /> New Event
        </Button>
      </div>
    </div>
  )
}
