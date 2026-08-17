import { Check, CheckCircle } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { useToastStore } from '../../../store/toastStore'
import { useIntegrationsStore } from '../../../store/integrationsStore'
import { INT_APP_DATA, INT_APPS } from '../../../data/mockIntegrations'

interface Props { appId: string | null; onClose: () => void }

export function ConnectModal({ appId, onClose }: Props) {
  const showToast = useToastStore((s) => s.showToast)
  const connectApp = useIntegrationsStore((s) => s.connectApp)
  const app = appId ? INT_APPS.find((a) => a.id === appId) : null
  const data = appId ? INT_APP_DATA[appId] : null
  if (!app || !data) return null

  const handleConnect = () => {
    connectApp(app.id)
    showToast(`${app.name} connected successfully!`, 'success', 2500)
    onClose()
  }

  return (
    <Modal open={!!appId} onOpenChange={(o) => { if (!o) onClose() }} title={`Connect ${app.name}`} subtitle={`Authorize ChronoLoop to connect with your ${app.name} workspace`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Features */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>What you get</div>
          {data.features.map((f) => (
            <div key={f.title} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: f.color, fontSize: 14 }}>\u2022</span>
              </div>
              <div><div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{f.title}</div><div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{f.desc}</div></div>
            </div>
          ))}
        </div>
        {/* Steps */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>How it works</div>
          {data.steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-blue)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
              <div><div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{s.t}</div><div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{s.d}</div></div>
            </div>
          ))}
        </div>
        {/* Permissions */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Permissions requested</div>
          {app.perms.map((p) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
              <Check size={12} style={{ color: 'var(--accent-green)' }} />{p}
            </div>
          ))}
        </div>
        {/* Requirements */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Requirements</div>
          {data.reqs.map((r) => (
            <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
              <CheckCircle size={12} style={{ color: 'var(--accent-blue)' }} />{r}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleConnect}>Authorize &amp; Connect</Button>
      </div>
    </Modal>
  )
}
