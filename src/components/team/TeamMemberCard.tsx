import { MoreHorizontal, Mail, MessageSquare, User } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Dropdown } from '../ui/Dropdown'
import { useToastStore } from '../../store/toastStore'
import type { TeamMember } from '../../types/teamMember'
import styles from './TeamMemberCard.module.css'

interface Props {
  member: TeamMember
  onOpenDetail: (id: string) => void
}

export function TeamMemberCard({ member: m, onOpenDetail }: Props) {
  const showToast = useToastStore((s) => s.showToast)

  return (
    <div className={styles.card} onClick={() => onOpenDetail(m.id)} data-member-id={m.id}>
      <div className={styles.accent} style={{ background: m.color }} />
      <div className={styles.body}>
        <div className={styles.top}>
          <div className={styles.avatarWrap}>
            <Avatar
              name={m.initials}
              fallbackStyle={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`, width: 52, height: 52, fontSize: 16 }}
              style={{ width: 52, height: 52 }}
            />
            <div className={`${styles.onlineDot} ${m.online ? styles.online : styles.offline}`} />
          </div>
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <button
                type="button"
                className={styles.menuBtn}
                aria-label="More options"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal size={14} />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item icon={<User size={13} />} onSelect={() => onOpenDetail(m.id)}>View Profile</Dropdown.Item>
              <Dropdown.Item icon={<MessageSquare size={13} />} onSelect={() => showToast('Opening message composer\u2026', 'info', 2000)}>Send Message</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item danger onSelect={() => showToast('Member removed from team', 'success', 3000)}>Remove from Team</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{m.name}</div>
          <div className={styles.role}>{m.role}</div>
          <div className={styles.dept}>{m.dept}</div>
          <div className={styles.email}><Mail size={10} />{m.email}</div>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCell}>
            <div className={styles.statNum} style={{ color: m.color }}>{m.activeTasks}</div>
            <div className={styles.statLabel}>Active Tasks</div>
          </div>
          <div className={styles.statCell}>
            <div className={styles.statNum}>{m.completedTasks}</div>
            <div className={styles.statLabel}>Completed</div>
          </div>
          <div className={styles.statCell}>
            <div className={styles.statNum} style={{ color: 'var(--accent-teal)' }}>{m.velocity}</div>
            <div className={styles.statLabel}>Velocity</div>
          </div>
        </div>
        <div className={styles.progress}>
          <div className={styles.progHeader}>
            <span className={styles.progLabel}>Completion Rate</span>
            <span className={styles.progPct}>{m.completion}%</span>
          </div>
          <div className={styles.progTrack}>
            <div className={styles.progFill} style={{ width: `${m.completion}%`, background: m.color }} />
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <button type="button" className={`${styles.actionBtn} ${styles.secondary}`} onClick={(e) => { e.stopPropagation(); showToast('Opening message composer\u2026', 'info', 2000) }}>
          <MessageSquare size={11} /> Message
        </button>
        <button type="button" className={`${styles.actionBtn} ${styles.primary}`} onClick={(e) => { e.stopPropagation(); onOpenDetail(m.id) }}>
          <User size={11} /> Profile
        </button>
      </div>
    </div>
  )
}
