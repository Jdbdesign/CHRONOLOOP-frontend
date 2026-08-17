import { RefreshCw, Users, Plus, Settings, AlertTriangle } from 'lucide-react'
import type { IntApp } from '../../data/mockIntegrations'
import { INT_APP_DATA } from '../../data/mockIntegrations'
import styles from './IntAppCard.module.css'

interface Props {
  app: IntApp
  onConnect: (id: string) => void
  onManage: (id: string) => void
}

const STATUS_LABELS: Record<string, string> = { connected: 'Connected', available: 'Available', beta: 'Beta', error: 'Error' }
const STATUS_CLASSES: Record<string, string> = { connected: styles.statusConnected, available: styles.statusAvailable, beta: styles.statusBeta, error: styles.statusError }

export function IntAppCard({ app, onConnect, onManage }: Props) {
  const data = INT_APP_DATA[app.id]
  const desc = data?.features?.[0]?.desc || ''

  const handleAction = () => {
    if (app.status === 'connected') onManage(app.id)
    else onConnect(app.id)
  }

  const btnClass = app.status === 'connected' ? styles.btnManage : app.status === 'error' ? styles.btnDisconnect : styles.btnAdd
  const btnLabel = app.status === 'connected' ? 'Manage' : app.status === 'error' ? 'Fix Auth' : 'Connect'
  const BtnIcon = app.status === 'connected' ? Settings : app.status === 'error' ? AlertTriangle : Plus

  return (
    <div className={`${styles.card}${app.status === 'connected' ? ` ${styles.connected}` : ''}`}>
      <div className={styles.top}>
        <div className={styles.logo} style={{ background: `${app.logoColor}20`, borderColor: `${app.logoColor}30` }}>{app.emoji}</div>
        <div className={`${styles.statusBadge} ${STATUS_CLASSES[app.status] || ''}`}>
          <div className={styles.statusDot} />
          {STATUS_LABELS[app.status] || app.status}
        </div>
      </div>
      <div>
        <div className={styles.name}>{app.name}</div>
        <div className={styles.category}>{app.category}</div>
      </div>
      <div className={styles.desc}>{desc}</div>
      <div className={styles.footer}>
        <div className={styles.meta}>
          {app.status === 'connected'
            ? <><RefreshCw /> Synced {app.syncedAt}</>
            : <><Users /> Not connected</>
          }
        </div>
        <button type="button" className={`${styles.connectBtn} ${btnClass}`} onClick={handleAction}>
          <BtnIcon /> {btnLabel}
        </button>
      </div>
    </div>
  )
}
