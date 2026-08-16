import { Users } from 'lucide-react'
import type { TeamMember } from '../../types/teamMember'
import { TeamMemberCard } from './TeamMemberCard'
import styles from './TeamMemberGrid.module.css'

interface Props {
  members: TeamMember[]
  view: 'grid' | 'list'
  onOpenDetail: (id: string) => void
}

export function TeamMemberGrid({ members, view, onOpenDetail }: Props) {
  if (!members.length) {
    return (
      <div className={styles.empty}>
        <Users style={{ opacity: 0.3, width: 40, height: 40 }} />
        <div className={styles.emptyTitle}>No members found</div>
        <div className={styles.emptyText}>Try a different search or filter</div>
      </div>
    )
  }

  return (
    <div className={styles.grid} style={view === 'list' ? { gridTemplateColumns: '1fr' } : undefined}>
      {members.map((m) => (
        <TeamMemberCard key={m.id} member={m} onOpenDetail={onOpenDetail} />
      ))}
    </div>
  )
}
