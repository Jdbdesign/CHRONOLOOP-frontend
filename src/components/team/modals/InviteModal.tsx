import { useState } from 'react'
import type { FormEvent } from 'react'
import { Mail } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { useToastStore } from '../../../store/toastStore'

interface Props {
  open: boolean
  onClose: () => void
}

export function InviteModal({ open, onClose }: Props) {
  const showToast = useToastStore((s) => s.showToast)
  const [session, setSession] = useState(0)

  const handleClose = () => {
    setSession((s) => s + 1)
    onClose()
  }

  return (
    <Modal open={open} onOpenChange={(o) => { if (!o) handleClose() }} title="Invite Teammates" subtitle="Add people to your workspace">
      <InviteForm key={session} onSubmit={() => { showToast('Invite sent!', 'success', 2500); handleClose() }} onCancel={handleClose} showToast={showToast} />
    </Modal>
  )
}

function InviteForm({ onSubmit, onCancel, showToast }: { onSubmit: () => void; onCancel: () => void; showToast: (msg: string, v: 'error', d: number) => void }) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Developer')
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      showToast('Please enter an email address', 'error', 2500)
      return
    }
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }} htmlFor="invite-email">Email Address *</label>
        <input id="invite-email" type="email" placeholder="colleague@company.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }} htmlFor="invite-role">Role</label>
        <select id="invite-role" value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', height: 38, padding: '0 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
          <option>Developer</option>
          <option>Designer</option>
          <option>Manager</option>
          <option>Viewer</option>
        </select>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }} htmlFor="invite-msg">Personal Message (Optional)</label>
        <textarea id="invite-msg" placeholder="Add a welcome message..." value={message} onChange={(e) => setMessage(e.target.value)} style={{ width: '100%', minHeight: 80, padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 13, fontFamily: "'DM Sans', sans-serif", resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit"><Mail size={13} /> Send Invite</Button>
      </div>
    </form>
  )
}
