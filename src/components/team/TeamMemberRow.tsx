import { Avatar } from '../ui/Avatar'
import type { TeamMember } from '../../types/teamMember'
import styles from './TeamMemberRow.module.css'

interface Props {
  member: TeamMember
  onOpenDetail: (id: string) => void
}

export function TeamMemberRow({ member: m, onOpenDetail }: Props) {
  return (
    <div
      className={styles.row}
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetail(m.id)}
      onKeyDown={(e) => { if (e.key === 'Enter') onOpenDetail(m.id) }}
    >
      <div className={styles.nameCell}>
        <div className={styles.avatarWrap}>
          <Avatar
            name={m.initials}
            fallbackStyle={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`, width: 28, height: 28, fontSize: 10 }}
            style={{ width: 28, height: 28 }}
          />
          <div className={`${styles.onlineDot} ${m.online ? styles.online : styles.offline}`} />
        </div>
        <div className={styles.name}>{m.name}</div>
      </div>
      <div className={styles.tasksCell}>
        {m.activeTasks}<span className={styles.tasksLabel}>tasks</span>
      </div>
      <div><span className={styles.deptBadge}>{m.dept}</span></div>
      <div className={styles.progCell}>
        <span className={styles.pct}>{m.completion}%</span>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${m.completion}%`, background: m.color }} />
        </div>
      </div>
      <div className={styles.statusCell}>
        <div className={styles.statusDot} style={{ background: m.online ? 'var(--accent-green)' : 'var(--text-muted)' }} />
        {m.online ? 'Online' : 'Offline'}
      </div>
    </div>
  )
}
