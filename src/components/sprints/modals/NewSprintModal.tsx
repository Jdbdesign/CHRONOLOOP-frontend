import { useState } from 'react'
import type { FormEvent } from 'react'
import { Zap } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { useSprintModalStore } from '../../../store/sprintModalStore'
import { useSprintsStore } from '../../../store/sprintsStore'
import { useToastStore } from '../../../store/toastStore'
import formStyles from './formStyles.module.css'

const PROJECTS = ['Web 3 App for Fxtrade', 'Healthydog Landing Page', 'Redesign of Website', 'ChronoLoop Launch']

interface FormState {
  name: string
  goal: string
  startRaw: string
  endRaw: string
  pts: string
  project: string
}

const EMPTY_FORM: FormState = { name: '', goal: '', startRaw: '', endRaw: '', pts: '', project: PROJECTS[0] }

export function NewSprintModal() {
  const isOpen = useSprintModalStore((s) => s.isNewOpen)
  const closeModal = useSprintModalStore((s) => s.closeNew)

  // Same synchronous-reset-on-close-intent pattern as NewProjectModal /
  // AddTaskModal — a plain useEffect+setState reset trips the
  // react-hooks/set-state-in-effect lint rule.
  const [session, setSession] = useState(0)
  const handleClose = () => {
    setSession((s) => s + 1)
    closeModal()
  }

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="New Sprint"
      subtitle="Plan and launch a new development sprint"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="form-newsprint">
            <Zap aria-hidden="true" /> Create Sprint
          </Button>
        </>
      }
    >
      <NewSprintFormFields key={session} onDone={handleClose} />
    </Modal>
  )
}

function NewSprintFormFields({ onDone }: { onDone: () => void }) {
  const addSprint = useSprintsStore((s) => s.addSprint)
  const showToast = useToastStore((s) => s.showToast)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) {
      showToast('Sprint name is required', 'error', 2000)
      return
    }
    // form.pts falls back to 40 when blank/non-numeric, matching
    // index.html:8462's `parseInt(...) || 40`.
    const pts = parseInt(form.pts, 10) || 40
    addSprint({ name, goal: form.goal.trim(), startRaw: form.startRaw, endRaw: form.endRaw, storyPoints: pts, project: form.project })
    showToast(`Sprint "${name}" created!`, 'success', 3000)
    onDone()
  }

  return (
    <form id="form-newsprint" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel} htmlFor="sprint-name-input">Sprint Name *</label>
        <input id="sprint-name-input" className={formStyles.formInput} type="text" placeholder="e.g. Authentication & Onboarding" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      </div>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel} htmlFor="sprint-goal-input">Sprint Goal</label>
        <textarea id="sprint-goal-input" className={formStyles.formTextarea} placeholder="Describe the main objective for this sprint..." style={{ minHeight: 60 }} value={form.goal} onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))} />
      </div>
      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="sprint-start-input">Start Date</label>
          <input id="sprint-start-input" className={formStyles.formInput} type="date" value={form.startRaw} onChange={(e) => setForm((f) => ({ ...f, startRaw: e.target.value }))} />
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="sprint-end-input">End Date</label>
          <input id="sprint-end-input" className={formStyles.formInput} type="date" value={form.endRaw} onChange={(e) => setForm((f) => ({ ...f, endRaw: e.target.value }))} />
        </div>
      </div>
      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="sprint-pts-input">Story Point Capacity</label>
          <input id="sprint-pts-input" className={formStyles.formInput} type="number" placeholder="e.g. 40" min={1} max={200} value={form.pts} onChange={(e) => setForm((f) => ({ ...f, pts: e.target.value }))} />
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="sprint-project-sel">Project</label>
          <select id="sprint-project-sel" className={formStyles.formSelect} value={form.project} onChange={(e) => setForm((f) => ({ ...f, project: e.target.value }))}>
            {PROJECTS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
    </form>
  )
}
