import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CalendarFilter } from '../../types/calendar'
import styles from './CalendarSubHeader.module.css'

interface Props {
  periodTitle: string
  filter: CalendarFilter
  onNavigate: (dir: 1 | -1) => void
  onToday: () => void
  onFilterChange: (f: CalendarFilter) => void
}

const FILTER_CHIPS: { id: CalendarFilter; label: string; dotColor?: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'task', label: 'Tasks', dotColor: '#4A90FF' },
  { id: 'project', label: 'Projects', dotColor: '#A855F7' },
  { id: 'sprint', label: 'Sprints', dotColor: '#00D4AA' },
  { id: 'meeting', label: 'Meetings', dotColor: '#FF8C42' },
]

export function CalendarSubHeader({ periodTitle, filter, onNavigate, onToday, onFilterChange }: Props) {
  return (
    <div className={styles.subHeader}>
      <div className={styles.navRow}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => onNavigate(-1)}
          title="Previous"
          aria-label="Previous"
        >
          <ChevronLeft />
        </button>
        <button type="button" className={styles.todayBtn} onClick={onToday}>
          Today
        </button>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => onNavigate(1)}
          title="Next"
          aria-label="Next"
        >
          <ChevronRight />
        </button>
        <div className={styles.periodTitle}>{periodTitle}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {FILTER_CHIPS.map(({ id, label, dotColor }) => (
          <button
            key={id}
            type="button"
            className={`${styles.filterChip}${filter === id ? ` ${styles.filterChipActive}` : ''}`}
            onClick={() => onFilterChange(id)}
            aria-pressed={filter === id}
          >
            {dotColor && <span className={styles.chipDot} style={{ background: dotColor }} />}
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
