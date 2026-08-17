import { BookOpen, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { useToastStore } from '../../store/toastStore'
import styles from './IntPageHeader.module.css'

interface Props { onNewKey: () => void }

export function IntPageHeader({ onNewKey }: Props) {
  const showToast = useToastStore((s) => s.showToast)
  return (
    <div className={styles.header}>
      <div>
        <div className={styles.breadcrumb}>Overview / Integrations</div>
        <h1 className={styles.heading}>Integrations</h1>
      </div>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={() => showToast('Opening API documentation\u2026', 'info', 1500)}>
          <BookOpen size={13} /> API Docs
        </Button>
        <Button variant="primary" onClick={onNewKey}>
          <Plus size={13} /> New API Key
        </Button>
      </div>
    </div>
  )
}
