import type { ReactNode } from 'react'
import { useSprintsStore } from '../../store/sprintsStore'
import styles from './SprintStatsRow.module.css'

const CHIPS = [
  { filter: 'all', label: 'All', dot: 'var(--accent-blue)' },
  { filter: 'active', label: 'Active', dot: 'var(--accent-blue)' },
  { filter: 'planning', label: 'Planning', dot: 'var(--accent-yellow)' },
  { filter: 'completed', label: 'Completed', dot: 'var(--accent-green)' },
  { filter: 'upcoming', label: 'Upcoming', dot: 'var(--accent-purple)' },
] as const

interface SprintStatsRowProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  children?: ReactNode
}

export function SprintStatsRow({ activeFilter, onFilterChange, children }: SprintStatsRowProps) {
  const sprints = useSprintsStore((s) => s.sprints)

  const countFor = (filter: string) => (filter === 'all' ? sprints.length : sprints.filter((s) => s.status === filter).length)

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
