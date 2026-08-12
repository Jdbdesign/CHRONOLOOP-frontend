// src/components/dashboard/CalendarWidget.tsx
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Dropdown } from '../ui/Dropdown'
import { TaskPopup } from './TaskPopup'
import { CAL_DAYS, CAL_TASKS } from '../../data/mockDashboardCalendar'
import type { DashboardCalendarTask } from '../../data/mockDashboardCalendar'
import { useToastStore } from '../../store/toastStore'
import styles from './CalendarWidget.module.css'

const WEEK_OPTIONS = ['Today', 'This week', 'This month', 'All time']
const ROW_H = 44
const ROW_TOP = 12
const COL_WIDTH_PCT = 100 / CAL_DAYS.length

export function CalendarWidget() {
  const showToast = useToastStore((s) => s.showToast)
  const [week, setWeek] = useState('This week')
  const [popup, setPopup] = useState<{ task: DashboardCalendarTask; anchorRect: DOMRect } | null>(null)

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Calendar View</h2>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <button type="button" className={styles.weekBtn}>
              {week} <ChevronDown aria-hidden="true" />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            {WEEK_OPTIONS.map((label) => (
              <Dropdown.Item
                key={label}
                active={label === week}
                onSelect={() => {
                  setWeek(label)
                  showToast(`Showing ${label.toLowerCase()}`, 'info', 2000)
                }}
              >
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>
      </div>

      <div className={styles.body}>
        <div className={styles.month}>NOVEMBER 2024</div>
        <div className={styles.grid}>
          <div className={styles.dayHeaders}>
            {CAL_DAYS.map((day, i) => (
              <div key={i} className={styles.dayColHeader}>
                <span className={styles.dayName}>{day.name}</span>
                <span className={styles.dayNum}>{day.date}</span>
              </div>
            ))}
          </div>

          <div className={styles.pillsArea}>
            {CAL_DAYS.map((_, i) => <div key={i} className={styles.gridCol} />)}
            <div className={styles.pillRows}>
              {CAL_TASKS.map((task, idx) => (
                <button
                  key={task.label}
                  type="button"
                  className={styles.pill}
                  style={{
                    animationDelay: `${600 + idx * 100}ms`,
                    left: `${(task.start - 1) * COL_WIDTH_PCT}%`,
                    width: `${(task.end - task.start + 1) * COL_WIDTH_PCT}%`,
                    top: ROW_TOP + task.row * ROW_H,
                    background: task.color,
                  }}
                  title={task.label}
                  onClick={(e) => setPopup({ task, anchorRect: e.currentTarget.getBoundingClientRect() })}
                >
                  <span className={styles.pillLabel}>{task.label}</span>
                  <span className={styles.pillBadge}>{task.badge}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TaskPopup task={popup?.task ?? null} anchorRect={popup?.anchorRect ?? null} onClose={() => setPopup(null)} />
    </section>
  )
}
