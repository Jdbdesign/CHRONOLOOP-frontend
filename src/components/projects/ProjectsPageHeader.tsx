import { LayoutGrid, List, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import styles from './ProjectsPageHeader.module.css'

interface ProjectsPageHeaderProps {
  view: 'grid' | 'list'
  onViewChange: (view: 'grid' | 'list') => void
  onNewProject: () => void
}

export function ProjectsPageHeader({ view, onViewChange, onNewProject }: ProjectsPageHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <div className={styles.breadcrumb}>Overview / Projects</div>
        <div className={styles.heading}>Projects</div>
      </div>
      <div className={styles.actions}>
        <div className={styles.viewToggle}>
          <button type="button" className={styles.viewBtn} data-active={view === 'grid'} onClick={() => onViewChange('grid')}>
            <LayoutGrid aria-hidden="true" /> Grid
          </button>
          <button type="button" className={styles.viewBtn} data-active={view === 'list'} onClick={() => onViewChange('list')}>
            <List aria-hidden="true" /> List
          </button>
        </div>
        <Button onClick={onNewProject}>
          <Plus aria-hidden="true" /> New Project
        </Button>
      </div>
    </div>
  )
}
