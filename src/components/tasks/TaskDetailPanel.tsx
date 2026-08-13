import { useEffect, useState } from 'react'
import { Circle, Edit2, Trash2, X, Send } from 'lucide-react'
import { useTaskDetailStore } from '../../store/taskDetailStore'
import { useTasksStore } from '../../store/tasksStore'
import { useTaskModalStore } from '../../store/taskModalStore'
import { useToastStore } from '../../store/toastStore'
import { STATUS_CONFIG } from '../../lib/taskFormatters'
import { TaskDetailBody } from './TaskDetailBody'
import { TaskDetailSubtasks } from './TaskDetailSubtasks'
import { TaskDetailAttachments } from './TaskDetailAttachments'
import { TaskDetailActivity } from './TaskDetailActivity'
import styles from './TaskDetailPanel.module.css'

const STATUS_BADGE_CLASS = { todo: 'todo', 'in-progress': 'inProgress', done: 'done', overdue: 'overdue' } as const

interface TaskDetailPanelProps {
  onDelete: (id: number, title: string) => void
}

export function TaskDetailPanel({ onDelete }: TaskDetailPanelProps) {
  const openTaskId = useTaskDetailStore((s) => s.openTaskId)
  const close = useTaskDetailStore((s) => s.close)
  const tasks = useTasksStore((s) => s.tasks)
  const toggleSubtask = useTasksStore((s) => s.toggleSubtask)
  const addSubtask = useTasksStore((s) => s.addSubtask)
  const addComment = useTasksStore((s) => s.addComment)
  const openEdit = useTaskModalStore((s) => s.openEdit)
  const showToast = useToastStore((s) => s.showToast)

  const [lastTaskId, setLastTaskId] = useState<number | null>(null)
  const [prevOpenTaskId, setPrevOpenTaskId] = useState<number | null>(null)
  const [commentText, setCommentText] = useState('')

  // "Adjusting state during render" (React docs) instead of an effect: keeps
  // the last-open task id available so the panel can render its content while
  // sliding out, without a setState-in-effect cascade.
  if (openTaskId !== prevOpenTaskId) {
    setPrevOpenTaskId(openTaskId)
    if (openTaskId !== null) setLastTaskId(openTaskId)
  }

  const isOpen = openTaskId !== null

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, close])

  const displayTaskId = openTaskId ?? lastTaskId
  const task = tasks.find((t) => t.id === displayTaskId) ?? null

  if (!task) {
    return (
      <>
        <div className={styles.overlay} data-open={false} data-testid="task-detail-overlay" />
        <div className={styles.panel} data-open={false} />
      </>
    )
  }

  const statusCfg = STATUS_CONFIG[task.status]

  const handleEdit = () => {
    const id = task.id
    close()
    openEdit(id)
  }

  const handleDelete = () => {
    const id = task.id
    const title = task.title
    close()
    onDelete(id, title)
  }

  const handleSendComment = () => {
    const text = commentText.trim()
    if (!text) return
    addComment(task.id, text)
    setCommentText('')
    showToast('Comment added', 'success', 1500)
  }

  const handleAddSubtask = (text: string) => {
    addSubtask(task.id, text)
    showToast('Subtask added', 'success', 1500)
  }

  const handleToggleSubtask = (index: number) => {
    const willBeDone = !task.subtasks[index].done
    toggleSubtask(task.id, index)
    showToast(willBeDone ? 'Sub-task done!' : 'Sub-task reopened', willBeDone ? 'success' : 'info', 1500)
  }

  return (
    <>
      <div className={styles.overlay} data-open={isOpen} data-testid="task-detail-overlay" onClick={close} />
      <div className={styles.panel} data-open={isOpen}>
        <div className={styles.header}>
          <div className={[styles.statusBadge, styles[STATUS_BADGE_CLASS[task.status]]].join(' ')}>
            <Circle aria-hidden="true" />
            {statusCfg.label}
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.headerBtn} title="Edit task" aria-label="Edit task" onClick={handleEdit}>
              <Edit2 aria-hidden="true" />
            </button>
            <button
              type="button"
              className={[styles.headerBtn, styles.deleteBtn].join(' ')}
              title="Delete task"
              aria-label="Delete task"
              onClick={handleDelete}
            >
              <Trash2 aria-hidden="true" />
            </button>
            <button type="button" className={styles.headerBtn} title="Close" aria-label="Close" onClick={close}>
              <X aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <TaskDetailBody task={task} />
          <TaskDetailSubtasks subtasks={task.subtasks} onToggle={handleToggleSubtask} onAdd={handleAddSubtask} />
          <TaskDetailAttachments attachments={task.attachments} />
          <TaskDetailActivity comments={task.comments} />
        </div>

        <div className={styles.footer}>
          <img className={styles.footerAvatar} src="/avatars/Ellipse 1.png" alt="Jacob Solayinka" />
          <textarea
            className={styles.commentInput}
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="button" className={styles.sendBtn} aria-label="Send comment" onClick={handleSendComment}>
            <Send aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  )
}
