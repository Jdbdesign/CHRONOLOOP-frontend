import { useMemo } from 'react'
import { CalendarX, Plus } from 'lucide-react'
import { addDays } from 'date-fns'
import type { CalendarEvent } from '../../types/calendar'
import { calToISO, calFmtTime, getAgendaDefaultRange, TYPE_COLORS, TYPE_TEXT_COLORS } from '../../lib/calendarHelpers'
import { Button } from '../ui/Button'
import styles from './CalAgendaView.module.css'

interface Props {
  events: CalendarEvent[]
  currentDate: Date
  rangeStart: string
  rangeEnd: string
  onEventClick: (evId: string) => void
  onNewEvent: () => void
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DNAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalAgendaView({ events, currentDate, rangeStart, rangeEnd, onEventClick, onNewEvent }: Props) {
  const todayStr = calToISO(new Date())

  const grouped = useMemo(() => {
    const defaultRange = getAgendaDefaultRange(currentDate)
    const startDate = rangeStart ? new Date(rangeStart + 'T00:00:00') : defaultRange.start
    const endDate = rangeEnd ? new Date(rangeEnd + 'T00:00:00') : defaultRange.end

    const map: Record<string, CalendarEvent[]> = {}

    events.forEach((ev) => {
      const getDates = (): string[] => {
        if (ev.isMultiDay && ev.startDate && ev.endDate) {
          const dates: string[] = []
          let cur = new Date(ev.startDate + 'T00:00:00')
          const end2 = new Date(ev.endDate + 'T00:00:00')
          while (cur <= end2) {
            dates.push(calToISO(cur))
            cur = addDays(cur, 1)
          }
          return dates
        }
        return [ev.date]
      }

      getDates().forEach((ds) => {
        const d = new Date(ds + 'T00:00:00')
        if (d >= startDate && d <= endDate) {
          if (!map[ds]) map[ds] = []
          map[ds].push(ev)
        }
      })
    })

    return map
  }, [events, currentDate, rangeStart, rangeEnd])

  const sorted = Object.keys(grouped).sort()

  if (!sorted.length) {
    return (
      <div className={styles.agendaWrap}>
        <div className={styles.empty}>
          <CalendarX width={44} height={44} />
          <div className={styles.emptyTitle}>No events in this range</div>
          <div className={styles.emptySub}>Try adjusting the date range or adding a new event</div>
          <Button variant="primary" style={{ marginTop: 8 }} onClick={onNewEvent}>
            <Plus size={14} /> New Event
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.agendaWrap}>
      {sorted.map((ds) => {
        const d = new Date(ds + 'T00:00:00')
        const isToday = ds === todayStr
        const label = isToday
          ? 'Today'
          : `${DNAMES[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
        const dayEvs = grouped[ds].sort((a, b) => (a.time || '').localeCompare(b.time || ''))

        return (
          <div key={ds}>
            <div className={`${styles.dateHdr}${isToday ? ` ${styles.dateHdrToday}` : ''}`}>
              <div className={styles.dtext}>{label}</div>
              <div className={styles.dline} />
              <div className={styles.dcount}>
                {dayEvs.length} event{dayEvs.length !== 1 ? 's' : ''}
              </div>
            </div>
            {dayEvs.map((ev) => {
              const tl = ev.type.charAt(0).toUpperCase() + ev.type.slice(1)
              return (
                <div
                  key={ev.id + '-' + ds}
                  className={styles.agendaEv}
                  data-evid={ev.id}
                  onClick={() => onEventClick(ev.id)}
                >
                  <div className={styles.evBar} style={{ background: ev.color }} />
                  <div className={styles.evTime}>{calFmtTime(ev.time)}</div>
                  <div className={styles.evTitle}>{ev.title}</div>
                  <span
                    className={styles.evType}
                    style={{ background: TYPE_COLORS[ev.type], color: TYPE_TEXT_COLORS[ev.type] }}
                  >
                    {tl}
                  </span>
                  {ev.project && <div className={styles.evProj}>{ev.project}</div>}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
