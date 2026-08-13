import { useState } from 'react'
import type { FormEvent } from 'react'
import { Mail } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { useDashboardUiStore } from '../../../store/dashboardUiStore'
import { useToastStore } from '../../../store/toastStore'
import formStyles from '../../tasks/modals/formStyles.module.css'

const ROLES = ['Developer', 'Designer', 'Manager', 'Viewer']
const EMPTY_FORM = { email: '', role: ROLES[0], message: '' }

export function InviteModal() {
  const activeModal = useDashboardUiStore((s) => s.activeModal)
  const closeModal = useDashboardUiStore((s) => s.closeModal)
  const showToast = useToastStore((s) => s.showToast)
  const [form, setForm] = useState(EMPTY_FORM)

  const handleClose = () => {
    setForm(EMPTY_FORM)
    closeModal()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.email) return
    showToast(`Invitation sent to ${form.email}`, 'success')
    handleClose()
  }

  return (
    <Modal
      open={activeModal === 'invite'}
      onOpenChange={(open) => !open && handleClose()}
      title="Invite Teammates"
      subtitle="Add people to your workspace"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="form-invite"><Mail aria-hidden="true" /> Send Invite</Button>
        </>
      }
    >
      <form id="form-invite" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="invite-email">Email Address *</label>
          <input id="invite-email" className={formStyles.formInput} type="email" placeholder="colleague@company.com" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="invite-role">Role</label>
          <select id="invite-role" className={formStyles.formSelect} value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="invite-msg">Personal Message (Optional)</label>
          <textarea id="invite-msg" className={formStyles.formTextarea} placeholder="Add a welcome message..." value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
        </div>
      </form>
    </Modal>
  )
}
