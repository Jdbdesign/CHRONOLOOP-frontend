import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { MessageSquare } from 'lucide-react'
import { Avatar } from '../../ui/Avatar'
import { useToastStore } from '../../../store/toastStore'
import type { TeamMember } from '../../../types/teamMember'

interface Props {
  open: boolean
  onClose: () => void
  member: TeamMember | null
}

export function MemberProfileModal({ open, onClose, member }: Props) {
  const showToast = useToastStore((s) => s.showToast)
  if (!member) return null

  return (
    <Modal open={open} onOpenChange={(o) => { if (!o) onClose() }} title="Team Member">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
        <Avatar
          name={member.initials}
          fallbackStyle={{ background: `linear-gradient(135deg, ${member.color}, ${member.color}88)`, width: 64, height: 64, fontSize: 22 }}
          style={{ width: 64, height: 64 }}
        />
        <div>
          <div style={{ fontFamily: "'Syne'", fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{member.name}</div>
          <div style={{ fontSize: 12, color: 'var(--accent-blue)', marginTop: 2 }}>{member.role}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{member.email}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Syne'", fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{member.activeTasks}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Active Tasks</div>
          </div>
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
            <div style={{ fontFamily: "'Syne'", fontSize: 20, fontWeight: 700, color: 'var(--accent-green)' }}>{member.completion}%</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Completion</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
        <Button variant="secondary" onClick={onClose}>Close</Button>
        <Button variant="primary" onClick={() => { onClose(); showToast('Opening message\u2026', 'info', 2000) }}>
          <MessageSquare size={13} /> Message
        </Button>
      </div>
    </Modal>
  )
}
