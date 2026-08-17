import { useIntegrationsStore } from '../../store/integrationsStore'
import { INT_USAGE } from '../../data/mockIntegrations'
import styles from './IntKpiGrid.module.css'

export function IntKpiGrid() {
  const apps = useIntegrationsStore((s) => s.apps)
  const webhooks = useIntegrationsStore((s) => s.webhooks)
  const connected = apps.filter((a) => a.status === 'connected').length
  const totalCalls = INT_USAGE.reduce((s, u) => s + u.count, 0)
  const activeWh = webhooks.filter((w) => w.active).length
  const errors = apps.filter((a) => a.status === 'error').length

  return (
    <div className={styles.grid}>
      <div className={styles.card}><div className={styles.label}>Connected Apps</div><div className={styles.value}>{connected}</div><div className={styles.sub}><span className={styles.up}>\u25B2 2</span>&nbsp;this month</div></div>
      <div className={styles.card}><div className={styles.label}>API Calls Today</div><div className={styles.value}>{totalCalls.toLocaleString()}</div><div className={styles.sub}><span className={styles.up}>\u25B2 14%</span>&nbsp;vs yesterday</div></div>
      <div className={styles.card}><div className={styles.label}>Active Webhooks</div><div className={styles.value}>{activeWh}</div><div className={styles.sub}>{webhooks.length - activeWh} inactive endpoint{webhooks.length - activeWh !== 1 ? 's' : ''}</div></div>
      <div className={styles.card}><div className={styles.label}>Sync Errors</div><div className={styles.value} style={{ color: errors ? 'var(--accent-red)' : 'var(--accent-green)' }}>{errors}</div><div className={styles.sub}>{errors ? <><span className={styles.down}>\u25CF</span>&nbsp;Datadog token expired</> : <><span className={styles.up}>\u25CF</span>&nbsp;All systems operational</>}</div></div>
    </div>
  )
}
