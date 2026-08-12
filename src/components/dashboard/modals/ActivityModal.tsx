import { Download } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { Avatar } from '../../ui/Avatar'
import { useDashboardUiStore } from '../../../store/dashboardUiStore'
import { useToastStore } from '../../../store/toastStore'
import styles from './ActivityModal.module.css'

const ACTIVITY_ITEMS = [
  { name: 'Aspen Herwitz', avatarSrc: '/avatars/Ellipse 2.png', text: <><strong>Aspen Herwitz</strong> completed <em>Login screen wireframe</em></>, time: '2 minutes ago' },
  { name: 'Roger Dokidis', avatarSrc: '/avatars/Ellipse 3.png', text: <><strong>Roger Dokidis</strong> added a comment to <em>Healthydog Landing Page</em></>, time: '15 minutes ago' },
  { name: 'Marley Vaccaro', avatarSrc: '/avatars/Ellipse 4.png', text: <><strong>Marley Vaccaro</strong> uploaded 3 design assets</>, time: '1 hour ago' },
  { name: 'Ryan Culhane', avatarSrc: '/avatars/Ellipse 5.png', text: <><strong>Ryan Culhane</strong> moved <em>Web 3 App</em> to In Review</>, time: '2 hours ago' },
  { name: 'Jacob Solayinka', avatarSrc: '/avatars/Ellipse 1.png', text: <><strong>You</strong> created a new sprint <em>Sprint 4</em></>, time: 'Yesterday' },
]

export function ActivityModal() {
  const activeModal = useDashboardUiStore((s) => s.activeModal)
  const closeModal = useDashboardUiStore((s) => s.closeModal)
  const showToast = useToastStore((s) => s.showToast)

  return (
    <Modal
      open={activeModal === 'activity'}
      onOpenChange={(open) => !open && closeModal()}
      title="Team Activity"
      subtitle="Recent actions by team members"
      footer={
        <>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
          <Button onClick={() => { closeModal(); showToast('Full activity log downloaded', 'success') }}>
            <Download aria-hidden="true" /> Export Log
          </Button>
        </>
      }
    >
      {ACTIVITY_ITEMS.map((item) => (
        <div key={item.name + item.time} className={styles.item}>
          <Avatar src={item.avatarSrc} name={item.name} style={{ width: 28, height: 28 }} />
          <div>
            <div className={styles.text}>{item.text}</div>
            <div className={styles.time}>{item.time}</div>
          </div>
        </div>
      ))}
    </Modal>
  )
}
