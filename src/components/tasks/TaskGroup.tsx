import { useState } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import type { Task, TaskStatus } from '../../types/task'
import { STATUS_CONFIG } from '../../lib/taskFormatters'
import { TaskRow } from './TaskRow'
import { useTaskModalStore } from '../../store/taskModalStore'
import styles from './TaskGroup.module.css'

interface TaskGroupProps {
  status: TaskStatus
  tasks: Task[]
  onOpenDetail: (id: number) => void
  onDelete: (id: number, title: string) => void
}

export function TaskGroup({ status, tasks, onOpenDetail, onDelete }: TaskGroupProps) {
  const [collapsed, setCollapsed] = useState(false)
  const openCreate = useTaskModalStore((s) => s.openCreate)
  const cfg = STATUS_CONFIG[status]

  if (tasks.length === 0) return null

  return (
    <div className={styles.group}>
      <button
        type="button"
        className={styles.header}
        data-collapsed={collapsed}
        aria-label={cfg.label}
        onClick={() => setCollapsed((c) => !c)}
      >
        <ChevronDown aria-hidden="true" className={styles.chevron} data-collapsed={collapsed} />
        <span className={styles.statusDot} style={{ background: cfg.dotColor }} />
        <span className={styles.label}>{cfg.label}</span>
        <span className={styles.count}>{tasks.length}</span>
        <span
          role="button"
          tabIndex={0}
          className={styles.addBtn}
          onClick={(e) => { e.stopPropagation(); openCreate() }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); e.preventDefault(); openCreate() } }}
        >
          <Plus aria-hidden="true" /> Add
        </span>
      </button>
      {!collapsed && (
        <div>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onOpenDetail={onOpenDetail} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
