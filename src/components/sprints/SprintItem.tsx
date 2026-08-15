import { Calendar, MoreHorizontal, Eye, Edit2, CheckCircle2, Trash2 } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Dropdown } from '../ui/Dropdown'
import { SprintStatusBadge } from './SprintStatusBadge'
import { useAnimatedWidth } from '../../hooks/useAnimatedWidth'
import type { Sprint } from '../../types/sprint'
import styles from './SprintItem.module.css'

interface SprintItemProps {
  sprint: Sprint
  onOpenDetail: (id: string) => void
  onEdit: (id: string) => void
  onMarkComplete: (id: string) => void
  onDelete: (id: string, name: string) => void
}

export function SprintItem({ sprint, onOpenDetail, onEdit, onMarkComplete, onDelete }: SprintItemProps) {
  const fillWidth = useAnimatedWidth(sprint.progress)
  const visibleTeam = sprint.team.slice(0, 3)
  const overflowCount = sprint.team.length - 3

  return (
    <div
      className={styles.item}
      tabIndex={0}
      onClick={() => onOpenDetail(sprint.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenDetail(sprint.id)
        }
      }}
    >
      <div className={styles.accent} style={{ background: sprint.color }} />
      <div className={styles.inner}>
        <div className={styles.num}>{sprint.number}</div>
        <div className={styles.main}>
          <div className={styles.name}>{sprint.name}</div>
          <div className={styles.goal}>{sprint.goal}</div>
        </div>
        <SprintStatusBadge status={sprint.status} />
        <div className={styles.dates}><Calendar aria-hidden="true" />{sprint.startDate} — {sprint.endDate}</div>
        <div className={styles.progress}>
          <div className={styles.progLabel}>
            <span className={styles.progTasks}>{sprint.tasksDone}/{sprint.tasksTotal} tasks</span>
            <span className={styles.progPct}>{sprint.progress}%</span>
          </div>
          <div className={styles.progTrack}><div className={styles.progFill} style={{ background: sprint.color, width: `${fillWidth}%` }} /></div>
        </div>
        <div className={styles.pts}>
          <div className={styles.ptsNum}>{sprint.completedPoints}<span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'DM Sans'" }}>/{sprint.storyPoints}</span></div>
          <div className={styles.ptsLabel}>pts</div>
        </div>
        <div className={styles.team}>
          {visibleTeam.map((m) => (
            <Avatar key={m.i} name={m.i} fallbackStyle={{ background: m.c, fontSize: 9 }} style={{ width: 24, height: 24, borderColor: 'var(--bg-card)' }} />
          ))}
          {overflowCount > 0 && <div className={styles.avatarMore}>+{overflowCount}</div>}
        </div>

        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <button
              type="button"
              className={styles.menuBtn}
              aria-label="More options"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation() }}
            >
              <MoreHorizontal aria-hidden="true" />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item icon={<Eye aria-hidden="true" />} onSelect={() => onOpenDetail(sprint.id)}>View Details</Dropdown.Item>
            <Dropdown.Item icon={<Edit2 aria-hidden="true" />} onSelect={() => onEdit(sprint.id)}>Edit Sprint</Dropdown.Item>
            <Dropdown.Item icon={<CheckCircle2 aria-hidden="true" />} onSelect={() => onMarkComplete(sprint.id)}>Mark Complete</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item icon={<Trash2 aria-hidden="true" />} danger onSelect={() => onDelete(sprint.id, sprint.name)}>Delete</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </div>
    </div>
  )
}
