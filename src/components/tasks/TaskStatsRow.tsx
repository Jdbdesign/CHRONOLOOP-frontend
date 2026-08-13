import type { ReactNode } from 'react'
import { useTasksStore } from '../../store/tasksStore'
import styles from './TaskStatsRow.module.css'

const CHIPS = [
  { filter: 'all', label: 'Total', dot: 'var(--accent-blue)' },
  { filter: 'in-progress', label: 'In Progress', dot: 'var(--accent-yellow)' },
  { filter: 'todo', label: 'To Do', dot: 'var(--accent-blue)' },
  { filter: 'done', label: 'Completed', dot: 'var(--accent-green)' },
  { filter: 'overdue', label: 'Overdue', dot: 'var(--accent-red)' },
] as const

interface TaskStatsRowProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  children?: ReactNode
}

export function TaskStatsRow({ activeFilter, onFilterChange, children }: TaskStatsRowProps) {
  const tasks = useTasksStore((s) => s.tasks)

  const countFor = (filter: string) => (filter === 'all' ? tasks.length : tasks.filter((t) => t.status === filter).length)

  return (
    <div className={styles.row}>
      {CHIPS.map(({ filter, label, dot }) => (
        <div
          key={filter}
          className={styles.chip}
          data-active={activeFilter === filter}
          role="button"
          tabIndex={0}
          onClick={() => onFilterChange(filter)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              if (e.key === ' ') e.preventDefault()
              onFilterChange(filter)
            }
          }}
        >
          <span className={styles.dot} style={{ background: dot }} />
          <span className={styles.num}>{countFor(filter)}</span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
      {children}
    </div>
  )
}
