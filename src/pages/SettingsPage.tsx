import { useState } from 'react'
import { RotateCcw, Save } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useToastStore } from '../store/toastStore'
import { SettingsNav } from '../components/settings/SettingsNav'
import type { SettingsTab } from '../components/settings/SettingsNav'
import { ProfileTab } from '../components/settings/tabs/ProfileTab'
import { WorkspaceTab } from '../components/settings/tabs/WorkspaceTab'
import { NotificationsTab } from '../components/settings/tabs/NotificationsTab'
import { AppearanceTab } from '../components/settings/tabs/AppearanceTab'
import { SecurityTab } from '../components/settings/tabs/SecurityTab'
import { BillingTab } from '../components/settings/tabs/BillingTab'
import { TeamRolesTab } from '../components/settings/tabs/TeamRolesTab'
import styles from './SettingsPage.module.css'

export function SettingsPage() {
  const showToast = useToastStore((s) => s.showToast)
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab />
      case 'workspace': return <WorkspaceTab />
      case 'notifications': return <NotificationsTab />
      case 'appearance': return <AppearanceTab />
      case 'security': return <SecurityTab />
      case 'billing': return <BillingTab />
      case 'team': return <TeamRolesTab />
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.breadcrumb}>Overview / Settings</div>
          <h1 className={styles.heading}>Settings</h1>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => showToast('No unsaved changes', 'info', 1800)}>
            <RotateCcw size={13} /> Discard
          </Button>
          <Button variant="primary" onClick={() => showToast('Settings saved!', 'success', 2000)}>
            <Save size={13} /> Save Changes
          </Button>
        </div>
      </div>
      <div className={styles.layout}>
        <SettingsNav active={activeTab} onChange={setActiveTab} />
        <div className={styles.content}>
          {renderTab()}
        </div>
      </div>
    </div>
  )
}
