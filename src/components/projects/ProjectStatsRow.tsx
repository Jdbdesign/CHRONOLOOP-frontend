import type { ReactNode } from 'react'
import { useProjectsStore } from '../../store/projectsStore'
import styles from './ProjectStatsRow.module.css'

// Dot colors match index.html:3382-3411 exactly, including Total and Active
// both using accent-blue.
const CHIPS = [
  { filter: 'all', label: 'Total', dot: 'var(--accent-blue)' },
  { filter: 'active', label: 'Active', dot: 'var(--accent-blue)' },
  { filter: 'in-progress', label: 'In Progress', dot: 'var(--accent-purple)' },
  { filter: 'completed', label: 'Completed', dot: 'var(--accent-green)' },
  { filter: 'overdue', label: 'Overdue', dot: 'var(--accent-red)' },
  { filter: 'on-hold', label: 'On Hold', dot: 'var(--accent-yellow)' },
] as const

interface ProjectStatsRowProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  children?: ReactNode
}

export function ProjectStatsRow({ activeFilter, onFilterChange, children }: ProjectStatsRowProps) {
  const projects = useProjectsStore((s) => s.projects)

  const countFor = (filter: string) => (filter === 'all' ? projects.length : projects.filter((p) => p.status === filter).length)

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
