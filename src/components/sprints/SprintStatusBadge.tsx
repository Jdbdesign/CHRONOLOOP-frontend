import { SPRINT_STATUS_CONFIG } from '../../lib/sprintFormatters'
import type { SprintStatus } from '../../types/sprint'
import styles from './SprintBadges.module.css'

const STATUS_CLASS: Record<SprintStatus, string> = {
  active: styles.active,
  completed: styles.completed,
  planning: styles.planning,
  upcoming: styles.upcoming,
}

interface SprintStatusBadgeProps {
  status: SprintStatus
}

export function SprintStatusBadge({ status }: SprintStatusBadgeProps) {
  const { label, icon: Icon } = SPRINT_STATUS_CONFIG[status]
  return (
    <span className={[styles.statusBadge, STATUS_CLASS[status]].join(' ')}>
      <Icon aria-hidden="true" />
      {label}
    </span>
  )
}
