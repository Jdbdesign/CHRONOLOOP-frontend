import { useMemo } from 'react'
import type { CalendarEvent } from '../../types/calendar'
import { calToISO, calFmtTime } from '../../lib/calendarHelpers'
import styles from './CalDayView.module.css'

interface Props {
  events: CalendarEvent[]
  currentDate: Date
  onEventClick: (evId: string) => void
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYNAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const HOURS = Array.from({ length: 15 }, (_, i) => i + 6) // 6am–8pm

/** Events with duration >= 240min or isMultiDay get banner treatment */
function isBannerEvent(ev: CalendarEvent): boolean {
  return !!(ev.isMultiDay || (ev.duration && ev.duration >= 240))
}

function fmtHourLabel(h: number): string {
  if (h === 12) return '12pm'
  if (h > 12) return h - 12 + 'pm'
  return h + 'am'
}

export function CalDayView({ events, currentDate, onEventClick }: Props) {
  const ds = calToISO(currentDate)
  const todayStr = calToISO(new Date())
  const isToday = ds === todayStr

  const dayEvs = useMemo(() => {
    return events.filter((ev) => {
      if (ev.isMultiDay) {
        return ds >= (ev.startDate || ev.date) && ds <= (ev.endDate || ev.date)
      }
      return ev.date === ds
    })
  }, [events, ds])

  const bannerEvs = dayEvs.filter(isBannerEvent)
  const timedEvs = dayEvs.filter((ev) => !isBannerEvent(ev))

  const taskCount = dayEvs.filter((e) => e.type === 'task').length
  const meetingCount = dayEvs.filter((e) => e.type === 'meeting').length
  const sprintCount = dayEvs.filter((e) => e.type === 'sprint').length

  return (
    <div className={styles.dayWrap}>
      <div className={styles.dayHero}>
        <div className={`${styles.dayBignum}${isToday ? ` ${styles.dayBignumToday}` : ''}`}>
          {currentDate.getDate()}
        </div>
        <div className={styles.dayInfoCol}>
          <div className={styles.dayWname}>{DAYNAMES[currentDate.getDay()]}</div>
          <div className={styles.dayFulldate}>
            {MONTHS[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
          </div>
        </div>
        <div className={styles.dayBadgebar}>
          <span
            className={styles.dayBadge}
            style={{ background: 'rgba(74,144,255,0.12)', color: 'var(--accent-blue)' }}
          >
            {dayEvs.length} event{dayEvs.length !== 1 ? 's' : ''}
          </span>
          {taskCount > 0 && (
            <span
              className={styles.dayBadge}
              style={{ background: 'rgba(74,144,255,0.07)', color: 'var(--text-secondary)' }}
            >
              {taskCount} tasks
            </span>
          )}
          {meetingCount > 0 && (
            <span
              className={styles.dayBadge}
              style={{ background: 'rgba(255,140,66,0.1)', color: 'var(--accent-orange)' }}
            >
              {meetingCount} meetings
            </span>
          )}
          {sprintCount > 0 && (
            <span
              className={styles.dayBadge}
              style={{ background: 'rgba(0,212,170,0.1)', color: 'var(--accent-teal)' }}
            >
              {sprintCount} sprints
            </span>
          )}
        </div>
      </div>

      {/* All-day / long-duration banner section */}
      {bannerEvs.length > 0 && (
        <div className={styles.bannerSection}>
          {bannerEvs.map((ev) => (
            <div
              key={ev.id}
              className={styles.bannerEv}
              style={{ background: ev.color }}
              data-evid={ev.id}
              onClick={() => onEventClick(ev.id)}
            >
              <span className={styles.bannerEvTitle}>{ev.title}</span>
              {ev.project && <span className={styles.bannerEvProj}>{ev.project}</span>}
            </div>
          ))}
        </div>
      )}

      <div className={styles.dayScroll}>
        <div className={styles.dayTgutter}>
          {HOURS.map((h) => (
            <div key={h} className={styles.dayTlbl}>
              {fmtHourLabel(h)}
            </div>
          ))}
        </div>
        <div className={styles.daySlots}>
          {HOURS.map((h) => (
            <div key={h} className={styles.dayHslot} />
          ))}
          {timedEvs.map((ev) => {
            const [hh, mm] = (ev.time || '09:00').split(':').map(Number)
            if (hh < 6 || hh > 20) return null
            const top = (hh - 6) * 66 + (mm / 60) * 66
            const ht = Math.max(44, ((ev.duration || 60) / 60) * 66)
            const typeLabel = ev.type.charAt(0).toUpperCase() + ev.type.slice(1)
            return (
              <div
                key={ev.id}
                className={styles.dayEv}
                style={{ background: ev.color, top: `${top}px`, minHeight: `${ht}px` }}
                data-evid={ev.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onEventClick(ev.id)
                }}
              >
                <div className={styles.dayEvTitle}>{ev.title}</div>
                <div className={styles.dayEvMeta}>
                  {calFmtTime(ev.time)}
                  {ev.duration ? ` · ${ev.duration}min` : ''}
                  {' · '}
                  {typeLabel}
                </div>
                {ev.project && <div className={styles.dayEvProj}>{ev.project}</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
