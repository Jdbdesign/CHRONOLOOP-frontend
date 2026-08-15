import { CalendarRange } from 'lucide-react'
import styles from './CalendarAgendaBar.module.css'

interface Props {
  visible: boolean
  rangeStart: string
  rangeEnd: string
  onRangeStartChange: (value: string) => void
  onRangeEndChange: (value: string) => void
  onReset: () => void
}

export function CalendarAgendaBar({
  visible,
  rangeStart,
  rangeEnd,
  onRangeStartChange,
  onRangeEndChange,
  onReset,
}: Props) {
  if (!visible) return null

  return (
    <div className={styles.bar}>
      <CalendarRange style={{ width: 15, height: 15, color: 'var(--text-muted)', flexShrink: 0 }} />
      <span className={styles.label}>From</span>
      <input
        type="date"
        className={styles.rangeInput}
        value={rangeStart}
        onChange={(e) => onRangeStartChange(e.target.value)}
        aria-label="Agenda start date"
      />
      <span className={styles.label}>To</span>
      <input
        type="date"
        className={styles.rangeInput}
        value={rangeEnd}
        onChange={(e) => onRangeEndChange(e.target.value)}
        aria-label="Agenda end date"
      />
      <button type="button" className="btn-secondary" style={{ height: 32 }} onClick={onReset}>
        Reset
      </button>
    </div>
  )
}
