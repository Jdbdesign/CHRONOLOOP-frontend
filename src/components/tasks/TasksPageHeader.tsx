import { Plus, List, LayoutTemplate } from 'lucide-react'
import { Button } from '../ui/Button'
import { useTaskModalStore } from '../../store/taskModalStore'
import styles from './TasksPageHeader.module.css'

interface TasksPageHeaderProps {
  view: 'list' | 'board'
  onViewChange: (view: 'list' | 'board') => void
}

export function TasksPageHeader({ view, onViewChange }: TasksPageHeaderProps) {
  const openCreate = useTaskModalStore((s) => s.openCreate)

  return (
    <div className={styles.header}>
      <div>
        <div className={styles.breadcrumb}>Overview / Tasks</div>
        <div className={styles.heading}>My Tasks</div>
      </div>
      <div className={styles.actions}>
        <div className={styles.viewToggle}>
          <button type="button" className={styles.viewBtn} data-active={view === 'list'} onClick={() => onViewChange('list')}>
            <List aria-hidden="true" /> List
          </button>
          <button type="button" className={styles.viewBtn} data-active={view === 'board'} onClick={() => onViewChange('board')}>
            <LayoutTemplate aria-hidden="true" /> Board
          </button>
        </div>
        <Button onClick={openCreate}>
          <Plus aria-hidden="true" /> Add Task
        </Button>
      </div>
    </div>
  )
}
