import { Plus } from 'lucide-react'
import type { Task, TaskStatus } from '../../types/task'
import { TaskBoardCard } from './TaskBoardCard'
import { useTaskModalStore } from '../../store/taskModalStore'
import styles from './TaskBoardView.module.css'

const COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'todo', label: 'To Do', color: '#4A90FF' },
  { key: 'in-progress', label: 'In Progress', color: '#EAB308' },
  { key: 'done', label: 'Done', color: '#22C55E' },
  { key: 'overdue', label: 'Overdue', color: '#FF4D4D' },
]

interface TaskBoardViewProps {
  tasks: Task[]
  onOpenDetail: (id: number) => void
}

export function TaskBoardView({ tasks, onOpenDetail }: TaskBoardViewProps) {
  const openCreate = useTaskModalStore((s) => s.openCreate)

  return (
    <div className={styles.board}>
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key)
        return (
          <div key={col.key} className={styles.col}>
            <div className={styles.colHeader}>
              <div className={styles.colTitle}>
                <span className={styles.colDot} style={{ background: col.color }} />
                <span className={styles.colTitleText}>{col.label}</span>
                <span className={styles.colCount}>{colTasks.length}</span>
              </div>
              <button type="button" className={styles.addColBtn} aria-label="Add task to column" onClick={openCreate}>
                <Plus aria-hidden="true" />
              </button>
            </div>
            <div className={styles.cards}>
              {colTasks.length === 0 ? (
                <div className={styles.empty}>No tasks</div>
              ) : (
                colTasks.map((task) => <TaskBoardCard key={task.id} task={task} onOpenDetail={onOpenDetail} />)
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
