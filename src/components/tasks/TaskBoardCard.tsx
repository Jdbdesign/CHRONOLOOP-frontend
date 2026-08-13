import type { Task } from '../../types/task'
import { getDueClass, formatDue } from '../../lib/taskFormatters'
import { TaskTagList } from './TaskTagList'
import { TaskAssigneeBubble } from './TaskAssigneeBubble'
import styles from './TaskBoardCard.module.css'

const DUE_CLASS_MAP = { normal: styles.normal, soon: styles.soon, 'overdue-chip': styles.overdueChip } as const

interface TaskBoardCardProps {
  task: Task
  onOpenDetail: (id: number) => void
}

export function TaskBoardCard({ task, onOpenDetail }: TaskBoardCardProps) {
  const dueClass = getDueClass(task.due, task.status)

  return (
    <button type="button" className={styles.card} onClick={() => onOpenDetail(task.id)}>
      <div className={styles.tags}><TaskTagList tags={task.tags} /></div>
      <div className={styles.title}>{task.title}</div>
      <div className={styles.footer}>
        <div className={[styles.priority, styles[task.priority]].join(' ')}>
          {task.priority[0].toUpperCase() + task.priority.slice(1)}
        </div>
        <div className={styles.footerRight}>
          <div className={[styles.due, DUE_CLASS_MAP[dueClass]].join(' ')}>{formatDue(task.due)}</div>
          <TaskAssigneeBubble assignee={task.assignee} avatarSrc={undefined} color={task.aColor} size={22} />
        </div>
      </div>
      <div className={styles.project}>{task.project}</div>
    </button>
  )
}
