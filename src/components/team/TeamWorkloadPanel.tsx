import { Avatar } from '../ui/Avatar'
import type { TeamMember } from '../../types/teamMember'
import styles from './TeamWorkloadPanel.module.css'

interface Props {
  members: TeamMember[]
}

export function TeamWorkloadPanel({ members }: Props) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Workload Distribution</h2>
        <div className={styles.legend}>
          <div className={styles.legendItem}><div className={styles.legendDot} style={{ background: 'var(--accent-green)', opacity: 0.85 }} />Completed</div>
          <div className={styles.legendItem}><div className={styles.legendDot} style={{ background: 'var(--accent-yellow)', opacity: 0.85 }} />In Progress</div>
          <div className={styles.legendItem}><div className={styles.legendDot} style={{ background: 'var(--border-default)', opacity: 0.85 }} />To Do</div>
        </div>
      </div>
      <div className={styles.grid}>
        {members.map((m) => {
          const total = m.todoTasks + m.inProgressTasks + m.completedTasks
          const doneW = total ? Math.round((m.completedTasks / total) * 100) : 0
          const inpW = total ? Math.round((m.inProgressTasks / total) * 100) : 0
          const todoW = 100 - doneW - inpW
          return (
            <div key={m.id} className={styles.row}>
              <Avatar name={m.initials} fallbackStyle={{ background: m.color, width: 28, height: 28, fontSize: 10 }} style={{ width: 28, height: 28 }} />
              <div className={styles.memberName}>{m.name.split(' ')[0]}</div>
              <div className={styles.bars}>
                <div className={styles.seg} style={{ width: `${doneW}%`, background: 'var(--accent-green)', opacity: 0.85, borderRadius: '3px 0 0 3px' }} />
                <div className={styles.seg} style={{ width: `${inpW}%`, background: 'var(--accent-yellow)', opacity: 0.85 }} />
                <div className={styles.seg} style={{ width: `${todoW}%`, background: 'var(--border-default)', opacity: 0.85, borderRadius: '0 3px 3px 0' }} />
              </div>
              <div className={styles.total}>{m.activeTasks + m.completedTasks}t</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
