import type { TaskComment } from '../../types/task'
import { TaskAssigneeBubble } from './TaskAssigneeBubble'
import styles from './TaskDetailActivity.module.css'

interface TaskDetailActivityProps {
  comments: TaskComment[]
}

export function TaskDetailActivity({ comments }: TaskDetailActivityProps) {
  return (
    <div>
      <div className={styles.label}>Activity</div>
      <div className={styles.list}>
        {comments.length === 0 ? (
          <div className={styles.empty}>No comments yet.</div>
        ) : (
          comments.map((c, i) => (
            <div key={`${c.author}-${i}`} className={styles.item}>
              <TaskAssigneeBubble
                assignee={c.author}
                avatarSrc={undefined}
                color="linear-gradient(135deg,#4A90FF,#A855F7)"
                size={28}
                fontSize={10}
              />
              <div className={styles.bubble}>
                <div className={styles.author}>{c.author}</div>
                {c.text}
                <div className={styles.time}>{c.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
