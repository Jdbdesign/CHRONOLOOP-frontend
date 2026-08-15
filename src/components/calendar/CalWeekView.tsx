import { useMemo } from 'react'
import type { CalendarEvent } from '../../types/calendar'
import { calToISO, calWeekStart, calFmtTime } from '../../lib/calendarHelpers'
import { addDays } from 'date-fns'
import styles from './CalWeekView.module.css'

interface Props {
  events: CalendarEvent[]
  currentDate: Date
  onEventClick: (evId: string, triggerEl: HTMLElement) => void
}

const DNAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 7am–8pm

function fmtHourLabel(h: number): string {
  if (h === 12) return '12pm'
  if (h > 12) return h - 12 + 'pm'
  return h + 'am'
}

export function CalWeekView({ events, currentDate, onEventClick }: Props) {
  const ws = calWeekStart(currentDate)
  const todayStr = calToISO(new Date())
  const days = useMemo(() => DNAMES.map((_, i) => addDays(ws, i)), [ws])

  const weekEvMap = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {}
    days.forEach((d) => {
      map[calToISO(d)] = []
    })
    events.forEach((ev) => {
      if (ev.isMultiDay) {
        days.forEach((d) => {
          const ds = calToISO(d)
          if (ds >= (ev.startDate || ev.date) && ds <= (ev.endDate || ev.date) && map[ds] !== undefined) {
            map[ds].push(ev)
          }
        })
      } else if (map[ev.date] !== undefined) {
        map[ev.date].push(ev)
      }
    })
    return map
  }, [events, days])

  return (
    <div className={styles.weekWrap}>
      <div className={styles.weekHdr} style={{ gridTemplateColumns: '52px repeat(7,1fr)' }}>
        <div style={{ borderRight: '1px solid var(--border-subtle)' }} />
        {days.map((d, i) => {
          const ds = calToISO(d)
          return (
            <div key={ds} className={styles.weekColHdr}>
              <div className={styles.weekDname}>{DNAMES[i]}</div>
              <div className={`${styles.weekDnum}${ds === todayStr ? ` ${styles.weekDnumToday}` : ''}`}>
                {d.getDate()}
              </div>
            </div>
          )
        })}
      </div>
      <div className={styles.weekScroll}>
        <div className={styles.timeCol}>
          {HOURS.map((h) => (
            <div key={h} className={styles.timeLbl}>
              {fmtHourLabel(h)}
            </div>
          ))}
        </div>
        <div className={styles.weekColsGrid} style={{ gridTemplateColumns: 'repeat(7,1fr)', flex: 1 }}>
          {days.map((d) => {
            const ds = calToISO(d)
            const dayEvs = weekEvMap[ds] || []
            const isToday = ds === todayStr
            return (
              <div
                key={ds}
                className={styles.weekCol}
                style={isToday ? { background: 'rgba(74,144,255,0.025)' } : undefined}
              >
                {HOURS.map((h) => (
                  <div key={h} className={styles.weekHslot} />
                ))}
                {dayEvs.map((ev, ei) => {
                  const [hh, mm] = (ev.time || '09:00').split(':').map(Number)
                  if (hh < 7 || hh > 20) return null
                  const top = (hh - 7) * 60 + (mm / 60) * 60
                  const ht = Math.max(24, ((ev.duration || 60) / 60) * 60)
                  const left = ei > 0 ? Math.min(ei * 18, 36) : 0
                  return (
                    <div
                      key={ev.id + '-' + ds}
                      className={styles.weekEv}
                      style={{ background: ev.color, top: `${top}px`, height: `${ht}px`, left: `${3 + left}px` }}
                      data-evid={ev.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(ev.id, e.currentTarget)
                      }}
                    >
                      <div className={styles.weekEvTitle}>{ev.title}</div>
                      <div className={styles.weekEvTime}>{calFmtTime(ev.time)}</div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
