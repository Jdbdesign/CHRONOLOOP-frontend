import { MessageSquare } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Avatar } from '../../ui/Avatar'
import { useDashboardUiStore } from '../../../store/dashboardUiStore'
import { useToastStore } from '../../../store/toastStore'
import { DASHBOARD_TEAM_MEMBERS } from '../../../data/mockDashboardTeam'
import styles from './MemberDetailModal.module.css'

export function MemberDetailModal() {
  const activeModal = useDashboardUiStore((s) => s.activeModal)
  const selectedMemberId = useDashboardUiStore((s) => s.selectedMemberId)
  const closeModal = useDashboardUiStore((s) => s.closeModal)
  const showToast = useToastStore((s) => s.showToast)
  const member = DASHBOARD_TEAM_MEMBERS.find((m) => m.id === selectedMemberId)

  if (!member) return null

  return (
    <Modal
      open={activeModal === 'member'}
      onOpenChange={(open) => !open && closeModal()}
      title="Team Member"
      className={styles.card}
      footer={
        <>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
          <Button onClick={() => { closeModal(); showToast('Opening message...', 'info') }}>
            <MessageSquare aria-hidden="true" /> Message
          </Button>
        </>
      }
    >
      <div className={styles.body}>
        <Avatar src={member.avatarSrc} name={member.name} style={{ width: 64, height: 64 }} />
        <div>
          <div className={styles.name}>{member.name}</div>
          <div className={styles.role}>{member.role}</div>
          <div className={styles.email}>{member.detailEmail}</div>
        </div>
        <div className={styles.statGrid}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{member.activeTasks}</div>
            <div className={styles.statLabel}>Active Tasks</div>
          </div>
          <div className={styles.stat}>
            <div className={[styles.statValue, styles.completion].join(' ')}>92%</div>
            <div className={styles.statLabel}>Completion</div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
