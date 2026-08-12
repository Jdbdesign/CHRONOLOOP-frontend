// src/components/dashboard/TaskPopup.tsx
import { useEffect, useRef, useState } from 'react'
import { X, User, Calendar, Tag } from 'lucide-react'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import type { DashboardCalendarTask } from '../../data/mockDashboardCalendar'
import styles from './TaskPopup.module.css'

interface TaskPopupProps {
  task: DashboardCalendarTask | null
  anchorRect: DOMRect | null
  onClose: () => void
}

export function TaskPopup({ task, anchorRect, onClose }: TaskPopupProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

  useOutsideClick(ref, onClose, task !== null)

  useEffect(() => {
    if (!task || !anchorRect || !ref.current) {
      setPosition(null)
      return
    }
    const popup = ref.current
    const pw = popup.offsetWidth
    const ph = popup.offsetHeight
    let left = anchorRect.left
    let top = anchorRect.bottom + 6
    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8
    if (left < 8) left = 8
    if (top + ph > window.innerHeight - 8) top = anchorRect.top - ph - 6
    setPosition({ top, left })
  }, [task, anchorRect])

  if (!task) return null

  return (
    <div
      ref={ref}
      className={styles.popup}
      style={position ? { top: position.top, left: position.left } : { top: -9999, left: -9999 }}
    >
      <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
        <X aria-hidden="true" />
      </button>
      <div className={styles.titleRow}>
        <div className={styles.colorDot} style={{ background: task.color }} />
        <div className={styles.title}>{task.label}</div>
      </div>
      <div className={styles.row}><User aria-hidden="true" /> <span>{task.assignee}</span></div>
      <div className={styles.row}><Calendar aria-hidden="true" /> Due: <span>{task.due}</span></div>
      <div className={styles.row}><Tag aria-hidden="true" /> <span>{task.badge}</span></div>
    </div>
  )
}
