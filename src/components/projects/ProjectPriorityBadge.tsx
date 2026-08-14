import { priorityLabel } from '../../lib/projectFormatters'
import type { ProjectPriority } from '../../types/project'
import styles from './ProjectBadges.module.css'

const PRIORITY_CLASS: Record<ProjectPriority, string> = {
  high: styles.high,
  medium: styles.medium,
  low: styles.low,
}

interface ProjectPriorityBadgeProps {
  priority: ProjectPriority
}

export function ProjectPriorityBadge({ priority }: ProjectPriorityBadgeProps) {
  return <span className={[styles.priorityBadge, PRIORITY_CLASS[priority]].join(' ')}>{priorityLabel(priority)}</span>
}
