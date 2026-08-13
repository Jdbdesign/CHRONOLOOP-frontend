import { AlertCircle, MinusCircle, CheckCircle, Briefcase, Calendar, Edit2, Trash2 } from 'lucide-react'
import type { Task } from '../../types/task'
import { getDueClass, formatDue } from '../../lib/taskFormatters'
import { TaskTagList } from './TaskTagList'
import { TaskAssigneeBubble } from './TaskAssigneeBubble'
import { useTaskModalStore } from '../../store/taskModalStore'
import { useTasksStore } from '../../store/tasksStore'
import styles from './TaskRow.module.css'

const PRIORITY_ICON = { high: AlertCircle, medium: MinusCircle, low: CheckCircle } as const
const DUE_CLASS_MAP = { normal: styles.normal, soon: styles.soon, 'overdue-chip': styles.overdueChip } as const

interface TaskRowProps {
  task: Task
  onOpenDetail: (id: number) => void
  onDelete: (id: number, title: string) => void
}

export function TaskRow({ task, onOpenDetail, onDelete }: TaskRowProps) {
  const openEdit = useTaskModalStore((s) => s.openEdit)
  const setTaskStatus = useTasksStore((s) => s.setTaskStatus)
  const isDone = task.status === 'done'
  const dueClass = getDueClass(task.due, task.status)
  const PriorityIcon = PRIORITY_ICON[task.priority]

  return (
    <div className={styles.row} onClick={() => onOpenDetail(task.id)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={isDone}
        aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
        className={styles.checkbox}
        data-checked={isDone}
        onClick={(e) => { e.stopPropagation(); setTaskStatus(task.id, isDone ? 'todo' : 'done') }}
      />

      <div className={styles.nameCol}>
        <div className={styles.name} data-done={isDone}>{task.title}</div>
        <div className={styles.projectTag}><Briefcase aria-hidden="true" />{task.project}</div>
      </div>

      <TaskTagList tags={task.tags} />

      <div className={[styles.priority, styles[task.priority]].join(' ')}>
        <PriorityIcon aria-hidden="true" />
        {task.priority[0].toUpperCase() + task.priority.slice(1)}
      </div>

      <TaskAssigneeBubble assignee={task.assignee} avatarSrc={undefined} color={task.aColor} size={26} />

      <div className={[styles.due, DUE_CLASS_MAP[dueClass]].join(' ')}>
        <Calendar aria-hidden="true" />{formatDue(task.due)}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionBtn}
          title="Edit"
          aria-label="Edit"
          onClick={(e) => { e.stopPropagation(); openEdit(task.id) }}
        >
          <Edit2 aria-hidden="true" />
        </button>
        <button
          type="button"
          className={[styles.actionBtn, styles.deleteBtn].join(' ')}
          title="Delete"
          aria-label="Delete"
          onClick={(e) => { e.stopPropagation(); onDelete(task.id, task.title) }}
        >
          <Trash2 aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
