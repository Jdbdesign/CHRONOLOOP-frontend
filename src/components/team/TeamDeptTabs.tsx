import { LayoutGrid, List } from 'lucide-react'
import styles from './TeamDeptTabs.module.css'

interface Props {
  activeFilter: string
  onFilterChange: (filter: string) => void
  view: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
  memberCounts: Record<string, number>
}

const DEPTS = [
  { id: 'all', label: 'All Members' },
  { id: 'development', label: 'Development' },
  { id: 'design', label: 'Design' },
  { id: 'management', label: 'Management' },
  { id: 'marketing', label: 'Marketing' },
]

export function TeamDeptTabs({ activeFilter, onFilterChange, view, onViewChange, memberCounts }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.tabs}>
        {DEPTS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`${styles.tab}${activeFilter === id ? ` ${styles.tabActive}` : ''}`}
            onClick={() => onFilterChange(id)}
          >
            {label}
            <span className={styles.tabCount}>{memberCounts[id] ?? 0}</span>
          </button>
        ))}
      </div>
      <div className={styles.viewToggle}>
        <button
          type="button"
          className={`${styles.viewBtn}${view === 'grid' ? ` ${styles.viewBtnActive}` : ''}`}
          onClick={() => onViewChange('grid')}
        >
          <LayoutGrid size={13} /> Grid
        </button>
        <button
          type="button"
          className={`${styles.viewBtn}${view === 'list' ? ` ${styles.viewBtnActive}` : ''}`}
          onClick={() => onViewChange('list')}
        >
          <List size={13} /> List
        </button>
      </div>
    </div>
  )
}
