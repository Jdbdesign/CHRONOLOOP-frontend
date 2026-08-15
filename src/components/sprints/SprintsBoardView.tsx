import { SprintBoardCard } from './SprintBoardCard'
import type { Sprint, SprintStatus } from '../../types/sprint'
import styles from './SprintBoardCard.module.css'

const COLUMNS: { key: SprintStatus; label: string; color: string }[] = [
  { key: 'active', label: 'Active', color: '#4A90FF' },
  { key: 'planning', label: 'Planning', color: '#EAB308' },
  { key: 'upcoming', label: 'Upcoming', color: '#A855F7' },
  { key: 'completed', label: 'Completed', color: '#22C55E' },
]

interface SprintsBoardViewProps {
  sprints: Sprint[]
  onOpenDetail: (id: string) => void
}

export function SprintsBoardView({ sprints, onOpenDetail }: SprintsBoardViewProps) {
  return (
    <div className={styles.boardView}>
      {COLUMNS.map((col) => {
        const colSprints = sprints.filter((s) => s.status === col.key)
        return (
          <div key={col.key} className={styles.boardCol}>
            <div className={styles.boardColHeader}>
              <div className={styles.boardColTitle}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, display: 'inline-block' }} />
                <span>{col.label}</span>
                <span className={styles.boardColCount}>{colSprints.length}</span>
              </div>
            </div>
            <div className={styles.boardCards}>
              {colSprints.length === 0
                ? <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, padding: '20px 0' }}>No sprints</div>
                : colSprints.map((sprint) => <SprintBoardCard key={sprint.id} sprint={sprint} onOpenDetail={onOpenDetail} />)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
