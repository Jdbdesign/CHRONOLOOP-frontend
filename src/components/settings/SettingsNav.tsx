import type { ChangeEvent } from 'react'
import { User, Building2, Bell, Palette, ShieldCheck, CreditCard, Users } from 'lucide-react'
import styles from './SettingsNav.module.css'

export type SettingsTab = 'profile' | 'workspace' | 'notifications' | 'appearance' | 'security' | 'billing' | 'team'

interface Props { active: SettingsTab; onChange: (tab: SettingsTab) => void }

const NAV_ITEMS: { group: string; items: { id: SettingsTab; icon: typeof User; label: string }[] }[] = [
  { group: 'Account', items: [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'workspace', icon: Building2, label: 'Workspace' },
  ]},
  { group: 'Preferences', items: [
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
  ]},
  { group: 'Admin', items: [
    { id: 'security', icon: ShieldCheck, label: 'Security' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'team', icon: Users, label: 'Team & Roles' },
  ]},
]

export function SettingsNav({ active, onChange }: Props) {
  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as SettingsTab)
  }

  return (
    <>
      {/* Desktop/tablet sidebar nav */}
      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ group, items }) => (
          <div key={group}>
            <div className={styles.groupLabel}>{group}</div>
            {items.map(({ id, icon: Icon, label }) => (
              <button key={id} type="button" className={`${styles.item}${active === id ? ` ${styles.active}` : ''}`} onClick={() => onChange(id)}>
                <Icon /> <span>{label}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Mobile select nav */}
      <div className={styles.mobileNav}>
        <label htmlFor="settings-nav-select" className={styles.mobileLabel}>Section</label>
        <select
          id="settings-nav-select"
          className={styles.mobileSelect}
          value={active}
          onChange={handleSelect}
        >
          {NAV_ITEMS.map(({ group, items }) => (
            <optgroup key={group} label={group}>
              {items.map(({ id, label }) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </>
  )
}
