import { PROJECT_STATUS_CONFIG } from '../../lib/projectFormatters'
import type { ProjectStatus } from '../../types/project'
import styles from './ProjectBadges.module.css'

const STATUS_CLASS: Record<ProjectStatus, string> = {
  active: styles.active,
  'in-progress': styles.inProgress,
  completed: styles.completed,
  overdue: styles.overdue,
  'on-hold': styles.onHold,
}

interface ProjectStatusBadgeProps {
  status: ProjectStatus
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const { label, icon: Icon } = PROJECT_STATUS_CONFIG[status]
  return (
    <span className={[styles.statusBadge, STATUS_CLASS[status]].join(' ')}>
      <Icon aria-hidden="true" />
      {label}
    </span>
  )
}
