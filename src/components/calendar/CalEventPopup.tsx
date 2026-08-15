import { useEffect, useRef } from 'react'
import { X, Folder, Calendar, Clock, User, Flag, CircleDot, CheckCircle2, FileText } from 'lucide-react'
import type { CalendarEvent, CalendarEventType } from '../../types/calendar'
import { calFmtTime, TYPE_COLORS, TYPE_TEXT_COLORS } from '../../lib/calendarHelpers'
import { STATUS_CONFIG } from '../../lib/taskFormatters'
import type { TaskStatus } from '../../types/task'
import styles from './CalEventPopup.module.css'

interface Props {
  event: CalendarEvent
  onClose: () => void
  onNavigate: (type: CalendarEventType, sourceId?: string | number) => void
}

export function CalEventPopup({ event, onClose, onNavigate }: Props) {
  const fillRef = useRef<HTMLDivElement>(null)

  // Animate progress bar fill
  useEffect(() => {
    if (event.progress !== undefined && fillRef.current) {
      fillRef.current.style.width = '0%'
      requestAnimationFrame(() => {
        if (fillRef.current) {
          fillRef.current.style.width = `${event.progress}%`
        }
      })
    }
  }, [event.progress])

  const typeLabel = event.type.charAt(0).toUpperCase() + event.type.slice(1)

  // Status label
  let statusLabel = ''
  if (event.status) {
    const config = STATUS_CONFIG[event.status as TaskStatus]
    statusLabel = config ? config.label : event.status
  }

  // Subtasks
  const subtasksDone = event.subtasks?.filter((s) => s.done).length ?? 0
  const subtasksTotal = event.subtasks?.length ?? 0

  // Navigation button label
  let navLabel = ''
  if (event.type === 'task' && event.sourceId) navLabel = 'View Task'
  else if (event.type === 'project') navLabel = 'View Project'
  else if (event.type === 'sprint') navLabel = 'View Sprint'

  return (
    <div className={styles.popupContent}>
      <div className={styles.head}>
        <span
          className={styles.typeBadge}
          style={{ background: TYPE_COLORS[event.type], color: TYPE_TEXT_COLORS[event.type] }}
        >
          {typeLabel}
        </span>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close popup">
          <X />
        </button>
      </div>

      <div className={styles.name}>{event.title}</div>

      {event.project && (
        <div className={styles.row}>
          <Folder />
          <span>{event.project}</span>
        </div>
      )}

      <div className={styles.row}>
        <Calendar />
        <span>
          <strong>{event.isMultiDay ? `${event.startDate} → ${event.endDate}` : event.date}</strong>
        </span>
      </div>

      {event.time && (
        <div className={styles.row}>
          <Clock />
          <span>
            {calFmtTime(event.time)}
            {event.duration ? ` · ${event.duration} min` : ''}
          </span>
        </div>
      )}

      {event.assignee && (
        <div className={styles.row}>
          <User />
          <span>
            Assignee: <strong>{event.assignee}</strong>
          </span>
        </div>
      )}

      {event.priority && (
        <div className={styles.row}>
          <Flag />
          <span>
            Priority: <strong style={{ textTransform: 'capitalize' }}>{event.priority}</strong>
          </span>
        </div>
      )}

      {statusLabel && (
        <div className={styles.row}>
          <CircleDot />
          <span>
            Status: <strong>{statusLabel}</strong>
          </span>
        </div>
      )}

      {event.progress !== undefined && (
        <div>
          <div className={styles.progressBar}>
            <div
              ref={fillRef}
              className={styles.progressFill}
              style={{ background: event.color, width: '0%' }}
            />
          </div>
          <div className={styles.progressLabel}>{event.progress}% complete</div>
        </div>
      )}

      {subtasksTotal > 0 && (
        <div className={styles.row}>
          <CheckCircle2 />
          <span>
            Subtasks: <strong>{subtasksDone}/{subtasksTotal} done</strong>
          </span>
        </div>
      )}

      {event.notes && (
        <div className={styles.row} style={{ alignItems: 'flex-start' }}>
          <FileText />
          <span style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {event.notes.substring(0, 110)}
            {event.notes.length > 110 ? '…' : ''}
          </span>
        </div>
      )}

      <div className={styles.footer}>
        <button type="button" className={styles.btnSecondary} onClick={onClose}>
          Close
        </button>
        {navLabel && (
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => {
              onClose()
              onNavigate(event.type, event.sourceId)
            }}
          >
            {navLabel}
          </button>
        )}
      </div>
    </div>
  )
}
