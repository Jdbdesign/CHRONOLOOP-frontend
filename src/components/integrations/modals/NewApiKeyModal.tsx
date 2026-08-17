import { useState } from 'react'
import type { FormEvent } from 'react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { useToastStore } from '../../../store/toastStore'
import { useIntegrationsStore } from '../../../store/integrationsStore'

interface Props { open: boolean; onClose: () => void }

export function NewApiKeyModal({ open, onClose }: Props) {
  const showToast = useToastStore((s) => s.showToast)
  const addApiKey = useIntegrationsStore((s) => s.addApiKey)
  const [session, setSession] = useState(0)

  const handleClose = () => { setSession((s) => s + 1); onClose() }

  return (
    <Modal open={open} onOpenChange={(o) => { if (!o) handleClose() }} title="Generate API Key" subtitle="Create a new credential for external access">
      <ApiKeyForm key={session} onSubmit={(input) => { addApiKey(input); showToast('API key generated!', 'success', 2500); handleClose() }} onCancel={handleClose} showToast={showToast} />
    </Modal>
  )
}

function ApiKeyForm({ onSubmit, onCancel, showToast }: { onSubmit: (input: { label: string; scope: string; expires: string; rateLimit: string; ipWhitelist: string }) => void; onCancel: () => void; showToast: (m: string, v: 'error', d: number) => void }) {
  const [label, setLabel] = useState('')
  const [scope, setScope] = useState('Full Access')
  const [expires, setExpires] = useState('')
  const [rateLimit, setRateLimit] = useState('60')
  const [ipWhitelist, setIpWhitelist] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!label.trim()) { showToast('Please enter a key name', 'error', 2500); return }
    onSubmit({ label: label.trim(), scope, expires, rateLimit, ipWhitelist })
  }

  const inputStyle = { width: '100%', height: 36, padding: '0 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 12, fontFamily: "'DM Sans', sans-serif" } as const
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div><label style={labelStyle}>Key Name *</label><input style={inputStyle} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Production Key" /></div>
      <div>
        <label style={labelStyle}>Permission Scope</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {['Full Access', 'Read Only', 'Write Only'].map((s) => (
            <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input type="radio" name="scope" checked={scope === s} onChange={() => setScope(s)} />{s}
            </label>
          ))}
        </div>
      </div>
      <div><label style={labelStyle}>Expiration</label><input type="date" style={{ ...inputStyle, colorScheme: 'dark' }} value={expires} onChange={(e) => setExpires(e.target.value)} /></div>
      <div><label style={labelStyle}>Rate Limit (requests/min)</label><input type="number" style={inputStyle} value={rateLimit} onChange={(e) => setRateLimit(e.target.value)} /></div>
      <div><label style={labelStyle}>IP Whitelist (optional, comma-separated)</label><input style={inputStyle} value={ipWhitelist} onChange={(e) => setIpWhitelist(e.target.value)} placeholder="e.g. 192.168.1.0/24" /></div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">Generate Key</Button>
      </div>
    </form>
  )
}
