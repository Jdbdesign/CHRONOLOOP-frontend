import { Copy, Trash2, Plus } from 'lucide-react'
import { useIntegrationsStore } from '../../store/integrationsStore'
import { useToastStore } from '../../store/toastStore'
import { INT_ACTIVITY, INT_USAGE } from '../../data/mockIntegrations'
import { Button } from '../ui/Button'
import styles from './IntSidebarPanels.module.css'

export function IntActivityPanel() {
  const showToast = useToastStore((s) => s.showToast)
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div><div className={styles.panelTitle}>Recent Activity</div><div className={styles.panelSub}>Last 24 hours</div></div>
        <Button variant="secondary" style={{ fontSize: 10, padding: '0 10px', height: 26 }} onClick={() => showToast('Cleared activity log', 'success', 2000)}><Trash2 size={11} /></Button>
      </div>
      {INT_ACTIVITY.map((a, i) => (
        <div key={i} className={styles.actItem}>
          <div className={styles.actDot} style={{ background: a.dot }} />
          <div className={styles.actText} dangerouslySetInnerHTML={{ __html: a.text }} />
          <div className={styles.actTime}>{a.time}</div>
        </div>
      ))}
    </div>
  )
}

export function IntApiKeysPanel() {
  const apiKeys = useIntegrationsStore((s) => s.apiKeys)
  const showToast = useToastStore((s) => s.showToast)

  const handleCopy = (val: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(val).then(() => showToast('Key copied to clipboard', 'success', 2000))
    } else {
      showToast('Clipboard unavailable \u2014 copy the key manually', 'info', 3000)
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div><div className={styles.panelTitle}>API Keys</div><div className={styles.panelSub}>Manage access credentials</div></div>
      </div>
      {apiKeys.map((k) => (
        <div key={k.id} className={styles.keyRow}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className={styles.keyLabel}>{k.label}</div>
            <div className={styles.keySub}>{k.scope} \u00b7 Created {k.created} \u00b7 Expires {k.expires}</div>
          </div>
          <div className={styles.keyVal}>{k.val}</div>
          <button type="button" className={styles.keyBtn} title="Copy key" onClick={() => handleCopy(k.val)}><Copy /></button>
          <button type="button" className={styles.keyBtn} title="Revoke key" onClick={() => showToast(`Revoke "${k.label}"? This cannot be undone.`, 'info', 3000)}><Trash2 /></button>
        </div>
      ))}
    </div>
  )
}

export function IntUsagePanel() {
  const total = INT_USAGE.reduce((s, u) => s + u.count, 0)
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div><div className={styles.panelTitle}>API Usage</div><div className={styles.panelSub}>Calls today by integration</div></div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>{total.toLocaleString()} / 10k</div>
      </div>
      {INT_USAGE.map((u) => (
        <div key={u.name} className={styles.usageItem}>
          <div className={styles.usageName}>{u.name}</div>
          <div className={styles.usageTrack}><div className={styles.usageFill} style={{ width: `${Math.round((u.count / u.max) * 100)}%`, background: u.color }} /></div>
          <div className={styles.usageCount}>{u.count.toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
}

export function IntWebhooksPanel() {
  const webhooks = useIntegrationsStore((s) => s.webhooks)
  const toggleWebhook = useIntegrationsStore((s) => s.toggleWebhook)
  const removeWebhook = useIntegrationsStore((s) => s.removeWebhook)
  const showToast = useToastStore((s) => s.showToast)
  const active = webhooks.filter((w) => w.active).length

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div><div className={styles.panelTitle}>Webhooks</div><div className={styles.panelSub}>Outbound event listeners</div></div>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'var(--text-muted)' }}>{active}/{webhooks.length} active</span>
      </div>
      {webhooks.map((w, i) => (
        <div key={i} className={styles.whRow}>
          <div className={styles.whDot} style={{ background: w.active ? 'var(--accent-green)' : 'var(--text-muted)' }} />
          <div className={styles.whUrl} title={w.url}>{w.url}</div>
          <div className={styles.whEvent}>{w.event}</div>
          <label className={styles.toggle}>
            <input type="checkbox" checked={w.active} onChange={() => { toggleWebhook(i); showToast(`Webhook ${w.active ? 'disabled' : 'enabled'}`, w.active ? 'info' : 'success', 2000) }} />
            <span className={styles.slider} />
          </label>
          <button type="button" className={styles.keyBtn} onClick={() => { removeWebhook(i); showToast('Webhook removed', 'info', 2000) }}><Trash2 /></button>
        </div>
      ))}
      <button type="button" className={styles.addWhBtn} onClick={() => showToast('Webhook editor coming soon', 'info', 2000)}><Plus /> Add Webhook</button>
    </div>
  )
}

export function IntSyncSettings() {
  const syncRules = useIntegrationsStore((s) => s.syncRules)
  const toggleSyncRule = useIntegrationsStore((s) => s.toggleSyncRule)
  const showToast = useToastStore((s) => s.showToast)

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div><div className={styles.panelTitle}>Sync Settings</div><div className={styles.panelSub}>Control what data flows between your integrations</div></div>
      </div>
      {syncRules.map((r, i) => (
        <div key={i} className={styles.syncRow}>
          <div><div className={styles.syncName}>{r.name}</div><div className={styles.syncDetail}>{r.detail}</div></div>
          <label className={styles.toggle}>
            <input type="checkbox" checked={r.on} onChange={() => { toggleSyncRule(i); showToast(`Sync rule ${r.on ? 'disabled' : 'enabled'}`, r.on ? 'info' : 'success', 2000) }} />
            <span className={styles.slider} />
          </label>
        </div>
      ))}
    </div>
  )
}
