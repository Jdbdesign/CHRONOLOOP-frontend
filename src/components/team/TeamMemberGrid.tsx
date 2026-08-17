import { Users, MoreHorizontal, User, MessageSquare, UserMinus } from 'lucide-react'
import type { TeamMember } from '../../types/teamMember'
import { TeamMemberCard } from './TeamMemberCard'
import { Avatar } from '../ui/Avatar'
import { Dropdown } from '../ui/Dropdown'
import { useToastStore } from '../../store/toastStore'
import styles from './TeamMemberGrid.module.css'
import rowStyles from './TeamMemberRow.module.css'

interface Props {
  members: TeamMember[]
  view: 'grid' | 'list'
  onOpenDetail: (id: string) => void
}

export function TeamMemberGrid({ members, view, onOpenDetail }: Props) {
  const showToast = useToastStore((s) => s.showToast)

  if (!members.length) {
    return (
      <div className={styles.empty}>
        <Users style={{ opacity: 0.3, width: 40, height: 40 }} />
        <div className={styles.emptyTitle}>No members found</div>
        <div className={styles.emptyText}>Try a different search or filter</div>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className={styles.listWrap}>
        {members.map((m) => (
          <div
            key={m.id}
            className={rowStyles.row}
            role="button"
            tabIndex={0}
            onClick={() => onOpenDetail(m.id)}
            onKeyDown={(e) => { if (e.key === 'Enter') onOpenDetail(m.id) }}
          >
            <div className={rowStyles.nameCell}>
              <div className={rowStyles.avatarWrap}>
                <Avatar
                  name={m.initials}
                  fallbackStyle={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`, width: 28, height: 28, fontSize: 10 }}
                  style={{ width: 28, height: 28 }}
                />
                <div className={`${rowStyles.onlineDot} ${m.online ? rowStyles.online : rowStyles.offline}`} />
              </div>
              <div className={rowStyles.name}>{m.name}</div>
            </div>
            <div className={rowStyles.tasksCell}>
              {m.activeTasks}<span className={rowStyles.tasksLabel}>tasks</span>
            </div>
            <div><span className={rowStyles.deptBadge}>{m.dept}</span></div>
            <div className={rowStyles.progCell}>
              <span className={rowStyles.pct}>{m.completion}%</span>
              <div className={rowStyles.track}>
                <div className={rowStyles.fill} style={{ width: `${m.completion}%`, background: m.color }} />
              </div>
            </div>
            <div className={rowStyles.statusCell}>
              <div className={rowStyles.statusDot} style={{ background: m.online ? 'var(--accent-green)' : 'var(--text-muted)' }} />
              {m.online ? 'Online' : 'Offline'}
            </div>
            <div className={rowStyles.menuCell}>
              <Dropdown.Root>
                <Dropdown.Trigger asChild>
                  <button
                    type="button"
                    className={rowStyles.menuBtn}
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
                  <Dropdown.Item danger icon={<UserMinus size={13} />} onSelect={() => showToast('Member removed from team', 'success', 3000)}>Remove from Team</Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {members.map((m) => (
        <TeamMemberCard key={m.id} member={m} onOpenDetail={onOpenDetail} />
      ))}
    </div>
  )
}
