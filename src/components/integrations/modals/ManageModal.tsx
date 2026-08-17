import { useState } from 'react'
import { Globe, User, Calendar, RefreshCw } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { useToastStore } from '../../../store/toastStore'
import { useIntegrationsStore } from '../../../store/integrationsStore'
import { INT_APP_DATA } from '../../../data/mockIntegrations'

interface Props { appId: string | null; onClose: () => void }

const TABS = ['Connection Details', 'Usage Stats', 'Configuration', 'Sync Log', 'Danger Zone']

export function ManageModal({ appId, onClose }: Props) {
  const showToast = useToastStore((s) => s.showToast)
  const disconnectApp = useIntegrationsStore((s) => s.disconnectApp)
  const apps = useIntegrationsStore((s) => s.apps)
  const [activeTab, setActiveTab] = useState(0)

  const app = appId ? apps.find((a) => a.id === appId) : null
  const data = appId ? INT_APP_DATA[appId] : null
  if (!app || !data) return null

  const handleDisconnect = () => {
    disconnectApp(app.id)
    showToast(`${app.name} disconnected`, 'info', 2500)
    onClose()
  }

  return (
    <Modal open={!!appId} onOpenChange={(o) => { if (!o) { onClose(); setActiveTab(0) } }} title={app.name} subtitle={data.workspace || `Connected to ${app.name}`}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
        {TABS.map((tab, i) => (
          <button key={tab} type="button" onClick={() => setActiveTab(i)} style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: activeTab === i ? 'var(--accent-blue)' : 'transparent', color: activeTab === i ? '#fff' : 'var(--text-secondary)', fontSize: 11, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>{tab}</button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <InfoCell icon={<Globe size={11} />} label="Workspace" val={data.workspace || '\u2014'} />
            <InfoCell icon={<User size={11} />} label="Connected By" val={data.connectedBy || '\u2014'} />
            <InfoCell icon={<Calendar size={11} />} label="Connected Date" val={data.connectedDate || '\u2014'} />
            <InfoCell icon={<RefreshCw size={11} />} label="Last Sync" val={app.syncedAt || '\u2014'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <StatCell num={String(app.calls.toLocaleString())} label="API Calls Today" color="var(--accent-blue)" />
            <StatCell num={String(app.users)} label="Team Members" color="var(--accent-teal)" />
            <StatCell num="99%" label="Sync Success" color="var(--accent-green)" />
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Usage stats are shown in the Connection Details tab and the sidebar API Usage panel.</div>
      )}

      {activeTab === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.config.length ? data.config.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div><div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{c.label}</div><div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{c.sub}</div></div>
              {c.type === 'toggle' ? (
                <label style={{ position: 'relative', width: 32, height: 18, flexShrink: 0 }}>
                  <input type="checkbox" defaultChecked={c.val as boolean} onChange={() => showToast('Setting updated', 'success', 1200)} style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{ position: 'absolute', inset: 0, background: c.val ? 'var(--accent-blue)' : 'var(--border-default)', borderRadius: 9, cursor: 'pointer' }} />
                </label>
              ) : c.type === 'select' ? (
                <select defaultValue={c.val as string} onChange={() => showToast('Setting updated', 'info', 1200)} style={{ padding: '4px 8px', borderRadius: 6, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: 11 }}>
                  {(c.opts || []).map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input defaultValue={c.val as string} onChange={() => showToast('Setting updated', 'info', 1200)} style={{ padding: '4px 8px', borderRadius: 6, background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', fontSize: 11, width: 140, textAlign: 'right' }} />
              )}
            </div>
          )) : <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 0' }}>No configuration options for this integration.</div>}
        </div>
      )}

      {activeTab === 3 && (
        <div>
          {data.syncLog.length ? data.syncLog.map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: l.dot, flexShrink: 0, marginTop: 5 }} />
              <div style={{ fontSize: 11, color: 'var(--text-primary)', flex: 1, lineHeight: 1.5 }}>{l.text}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>{l.time}</div>
            </div>
          )) : <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '8px 0' }}>No recent sync events.</div>}
        </div>
      )}

      {activeTab === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '10px 0' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Disconnecting will stop all sync rules and webhooks associated with this integration. This cannot be undone.</div>
          <Button variant="secondary" style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }} onClick={handleDisconnect}>Disconnect {app.name}</Button>
        </div>
      )}
    </Modal>
  )
}

function InfoCell({ icon, label, val }: { icon: React.ReactNode; label: string; val: string }) {
  return (
    <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5 }}>{icon}{val}</div>
    </div>
  )
}

function StatCell({ num, label, color }: { num: string; label: string; color: string }) {
  return (
    <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
      <div style={{ fontFamily: "'Syne'", fontSize: 20, fontWeight: 700, color, lineHeight: 1 }}>{num}</div>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
    </div>
  )
}
