import { Zap, Plus } from 'lucide-react'
import { SprintItem } from './SprintItem'
import { Button } from '../ui/Button'
import type { Sprint } from '../../types/sprint'
import styles from './SprintItem.module.css'

interface SprintsListViewProps {
  sprints: Sprint[]
  onOpenDetail: (id: string) => void
  onEdit: (id: string) => void
  onMarkComplete: (id: string) => void
  onDelete: (id: string, name: string) => void
  onNewSprint?: () => void
}

export function SprintsListView({ sprints, onOpenDetail, onEdit, onMarkComplete, onDelete, onNewSprint }: SprintsListViewProps) {
  if (sprints.length === 0) {
    return (
      <div className={styles.empty}>
        <Zap aria-hidden="true" width={44} height={44} />
        <div className={styles.emptyTitle}>No sprints found</div>
        <div className={styles.emptySub}>Try adjusting your filter or search</div>
        {onNewSprint && (
          <Button onClick={onNewSprint} style={{ marginTop: 8 }}>
            <Plus aria-hidden="true" /> New Sprint
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.sprintsList}>
      {sprints.map((sprint) => (
        <SprintItem key={sprint.id} sprint={sprint} onOpenDetail={onOpenDetail} onEdit={onEdit} onMarkComplete={onMarkComplete} onDelete={onDelete} />
      ))}
    </div>
  )
}
