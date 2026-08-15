import { useMemo } from 'react'
import type { CalendarEvent } from '../../types/calendar'
import { calToISO, expandEventsToDateMap } from '../../lib/calendarHelpers'
import styles from './CalMonthView.module.css'

interface Props {
  events: CalendarEvent[]
  currentDate: Date
  onDayClick: (isoDate: string) => void
  onEventClick: (evId: string) => void
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

interface CellData {
  date: Date
  iso: string
  other: boolean
}

function buildCells(year: number, month: number): CellData[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const cells: CellData[] = []

  // Previous month overflow
  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    cells.push({ date: d, iso: calToISO(d), other: true })
  }

  // Current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d)
    cells.push({ date, iso: calToISO(date), other: false })
  }

  // Next month overflow to fill 42 cells
  while (cells.length < 42) {
    const d = new Date(year, month + 1, cells.length - lastDay.getDate() - startOffset + 1)
    cells.push({ date: d, iso: calToISO(d), other: true })
  }

  return cells
}

export function CalMonthView({ events, currentDate, onDayClick, onEventClick }: Props) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const todayISO = calToISO(new Date())

  const cells = useMemo(() => buildCells(year, month), [year, month])
  const evMap = useMemo(() => expandEventsToDateMap(events), [events])

  return (
    <div className={styles.monthWrap}>
      <div className={styles.dayHeadersRow}>
        {DAY_NAMES.map((name) => (
          <div key={name} className={styles.dayColHdr}>
            {name}
          </div>
        ))}
      </div>
      <div className={styles.monthGrid}>
        {cells.map((cell) => {
          const isToday = cell.iso === todayISO
          const isWeekend = cell.date.getDay() === 0 || cell.date.getDay() === 6
          const dayEvs = evMap[cell.iso] || []
          const visible = dayEvs.slice(0, 3)
          const extra = dayEvs.length - 3

          const cellClasses = [
            styles.dayCell,
            cell.other ? styles.otherMonth : '',
            isToday ? styles.todayCell : '',
            isWeekend ? styles.weekendCell : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <div
              key={cell.iso}
              className={cellClasses}
              data-date={cell.iso}
              onClick={() => onDayClick(cell.iso)}
            >
              <div className={styles.dayNum}>{cell.date.getDate()}</div>
              {visible.map((ev) => (
                <div
                  key={ev.id}
                  className={styles.evPill}
                  style={{ background: ev.color }}
                  data-evid={ev.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    onEventClick(ev.id)
                  }}
                >
                  <div className={styles.pillDot} />
                  <div className={styles.pillText}>{ev.title}</div>
                </div>
              ))}
              {extra > 0 && (
                <button
                  type="button"
                  className={styles.moreBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    onDayClick(cell.iso)
                  }}
                >
                  +{extra} more
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
