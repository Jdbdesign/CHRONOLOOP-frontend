import { Calendar, Briefcase } from 'lucide-react'
import type { Task } from '../../types/task'
import { formatDue } from '../../lib/taskFormatters'
import { useTasksStore } from '../../store/tasksStore'
import { useToastStore } from '../../store/toastStore'
import { TaskAssigneeBubble } from './TaskAssigneeBubble'
import styles from './TaskDetailBody.module.css'

const ASSIGNEE_NAME_BY_CODE: Record<string, string> = {
  AS: 'Aspen Herwitz',
  RD: 'Roger Dokidis',
  MV: 'Marley Vaccaro',
  RC: 'Ryan Culhane',
}

interface TaskDetailBodyProps {
  task: Task
}

export function TaskDetailBody({ task }: TaskDetailBodyProps) {
  const updateTaskDescription = useTasksStore((s) => s.updateTaskDescription)
  const showToast = useToastStore((s) => s.showToast)

  return (
    <>
      <div className={styles.title}>{task.title}</div>

      <div>
        <div className={styles.label}>Details</div>
        <div className={styles.grid}>
          <div className={styles.cell}>
            <div className={styles.label}>Assignee</div>
            <div className={styles.val}>
              <TaskAssigneeBubble
                assignee={task.assignee}
                avatarSrc={undefined}
                color={task.aColor}
                size={22}
                fontSize={9}
              />
              {ASSIGNEE_NAME_BY_CODE[task.assignee] ?? task.assignee}
            </div>
          </div>
          <div className={styles.cell}>
            <div className={styles.label}>Due Date</div>
            <div className={styles.val}><Calendar aria-hidden="true" />{formatDue(task.due)}</div>
          </div>
          <div className={styles.cell}>
            <div className={styles.label}>Priority</div>
            <div className={[styles.val, styles.priorityVal, styles[task.priority]].join(' ')}>
              {task.priority[0].toUpperCase() + task.priority.slice(1)}
            </div>
          </div>
          <div className={styles.cell}>
            <div className={styles.label}>Project</div>
            <div className={styles.val}>
              <Briefcase aria-hidden="true" />
              <span className={styles.projectText}>{task.project}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className={styles.label}>Tags</div>
        <div className={styles.tagList}>
          {task.tags.map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
        </div>
      </div>

      <div>
        <div className={styles.label}>Description</div>
        <div
          key={task.id}
          contentEditable
          suppressContentEditableWarning
          className={styles.desc}
          onBlur={(e) => {
            updateTaskDescription(task.id, (e.currentTarget.textContent ?? '').trim())
            showToast('Description saved', 'success', 1500)
          }}
        >
          {task.description || 'Click to add a description...'}
        </div>
      </div>
    </>
  )
}
