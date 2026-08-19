import { Plus } from 'lucide-react'
import type { Task, TaskStatus } from '../../types/task'
import { STATUS_CONFIG } from '../../lib/taskFormatters'
import { TaskBoardCard } from './TaskBoardCard'
import { useTaskModalStore } from '../../store/taskModalStore'
import { useBoardTabs } from '../../hooks/useBoardTabs'
import { BoardTabSwitcher } from '../ui/BoardTabSwitcher'
import type { BoardTab } from '../ui/BoardTabSwitcher'
import styles from './TaskBoardView.module.css'

const BOARD_COLUMN_ORDER: TaskStatus[] = ['todo', 'in-progress', 'done', 'overdue']

interface TaskBoardViewProps {
  tasks: Task[]
  onOpenDetail: (id: number) => void
}

export function TaskBoardView({ tasks, onOpenDetail }: TaskBoardViewProps) {
  const openCreate = useTaskModalStore((s) => s.openCreate)
  const { activeColumn, setActiveColumn } = useBoardTabs(BOARD_COLUMN_ORDER)

  const tabs: BoardTab[] = BOARD_COLUMN_ORDER.map((status) => {
    const cfg = STATUS_CONFIG[status]
    return { key: status, label: cfg.label, color: cfg.color, count: tasks.filter((t) => t.status === status).length }
  })

  return (
    <>
      <BoardTabSwitcher tabs={tabs} activeKey={activeColumn} onChange={(k) => setActiveColumn(k as TaskStatus)} />
      <div className={styles.board}>
        {BOARD_COLUMN_ORDER.map((status) => {
          const cfg = STATUS_CONFIG[status]
          const colTasks = tasks.filter((t) => t.status === status)
          return (
            <div key={status} className={`${styles.col}${activeColumn === status ? ` ${styles.colActive}` : ''}`}>
              <div className={styles.colHeader}>
                <div className={styles.colTitle}>
                  <span className={styles.colDot} style={{ background: cfg.color }} />
                  <span className={styles.colTitleText}>{cfg.label}</span>
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
    </>
  )
}
