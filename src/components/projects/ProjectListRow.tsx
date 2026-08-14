import { Calendar } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { ProjectPriorityBadge } from './ProjectPriorityBadge'
import { useAnimatedWidth } from '../../hooks/useAnimatedWidth'
import { getProjDueClass } from '../../lib/projectFormatters'
import { PROJECT_AVATAR_SRC } from '../../data/mockProjects'
import type { Project } from '../../types/project'
import styles from './ProjectListRow.module.css'

interface ProjectListRowProps {
  project: Project
  onOpenDetail: (id: string) => void
}

export function ProjectListRow({ project, onOpenDetail }: ProjectListRowProps) {
  const fillWidth = useAnimatedWidth(project.progress)
  const dueClass = getProjDueClass(project.dueDays)
  const visibleTeam = project.team.slice(0, 3)
  const overflowCount = project.team.length - 3

  return (
    <div
      className={styles.row}
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetail(project.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpenDetail(project.id)
      }}
    >
      <div className={styles.nameCell}>
        <div className={styles.dot} style={{ background: project.color }} />
        <div>
          <div className={styles.name}>{project.name}</div>
          <div className={styles.cat}>{project.category}</div>
        </div>
      </div>
      <div className={styles.clientCell}>{project.client}</div>
      <div><ProjectStatusBadge status={project.status} /></div>
      <div><ProjectPriorityBadge priority={project.priority} /></div>
      <div className={styles.progCell}>
        <span className={styles.pct}>{project.progress}%</span>
        <div className={styles.track}><div className={styles.fill} style={{ background: project.color, width: `${fillWidth}%` }} /></div>
      </div>
      <div className={[styles.dueCell, dueClass !== 'normal' ? styles[dueClass] : ''].filter(Boolean).join(' ')}>
        <Calendar aria-hidden="true" />{project.dueDate}
      </div>
      <div className={styles.avatars}>
        {visibleTeam.map((member) => (
          <Avatar
            key={member.i}
            src={PROJECT_AVATAR_SRC[member.i]}
            name={member.n || member.i}
            className={styles.avatar}
            style={{ width: 24, height: 24 }}
            fallbackStyle={{ background: member.c, fontSize: 9 }}
          />
        ))}
        {overflowCount > 0 && <div className={styles.avatarMore}>+{overflowCount}</div>}
      </div>
    </div>
  )
}
