import { MoreHorizontal, Calendar, Eye, Edit2, Archive, Trash2 } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Dropdown } from '../ui/Dropdown'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { ProjectPriorityBadge } from './ProjectPriorityBadge'
import { useAnimatedWidth } from '../../hooks/useAnimatedWidth'
import { getProjDueClass } from '../../lib/projectFormatters'
import { PROJECT_AVATAR_SRC } from '../../data/mockProjects'
import { useToastStore } from '../../store/toastStore'
import type { Project } from '../../types/project'
import styles from './ProjectCard.module.css'

interface ProjectCardProps {
  project: Project
  index: number
  onOpenDetail: (id: string) => void
  onDelete: (id: string, name: string) => void
}

export function ProjectCard({ project, index, onOpenDetail, onDelete }: ProjectCardProps) {
  const showToast = useToastStore((s) => s.showToast)
  const fillWidth = useAnimatedWidth(project.progress)
  const dueClass = getProjDueClass(project.dueDays)
  const visibleTeam = project.team.slice(0, 3)
  const overflowCount = project.team.length - 3

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${60 + index * 60}ms` }}
      role="button"
      tabIndex={0}
      aria-label={project.name}
      onClick={() => onOpenDetail(project.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenDetail(project.id)
        }
      }}
    >
      <div className={styles.accent} style={{ background: project.color }} />
      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.name}>{project.name}</div>
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <button
                type="button"
                className={styles.menuBtn}
                aria-label="More options"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal aria-hidden="true" />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item icon={<Eye aria-hidden="true" />} onSelect={() => onOpenDetail(project.id)}>
                View Details
              </Dropdown.Item>
              <Dropdown.Item icon={<Edit2 aria-hidden="true" />} onSelect={() => showToast('Edit project coming soon', 'info')}>
                Edit Project
              </Dropdown.Item>
              <Dropdown.Item icon={<Archive aria-hidden="true" />} onSelect={() => showToast('Project archived', 'success', 2000)}>
                Archive
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item icon={<Trash2 aria-hidden="true" />} danger onSelect={() => onDelete(project.id, project.name)}>
                Delete
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>

        <div className={styles.clientRow}>
          <span className={styles.client}>{project.client}</span>
          <span className={styles.categoryTag}>{project.category}</span>
        </div>

        <div className={styles.badges}>
          <ProjectStatusBadge status={project.status} />
          <ProjectPriorityBadge priority={project.priority} />
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            <span className={styles.progressTasks}>{project.tasksDone}/{project.tasksTotal} tasks</span>
            <span className={styles.progressPct}>{project.progress}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ background: project.color, width: `${fillWidth}%` }} />
          </div>
        </div>

        <div className={styles.footer}>
          <div className={[styles.due, dueClass !== 'normal' ? styles[dueClass] : ''].filter(Boolean).join(' ')}>
            <Calendar aria-hidden="true" />
            {project.dueDays < 0 ? 'Overdue · ' : 'Due · '}{project.dueDate}
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
      </div>
    </div>
  )
}
