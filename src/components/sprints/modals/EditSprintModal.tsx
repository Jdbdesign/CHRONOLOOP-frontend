import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { useSprintModalStore } from '../../../store/sprintModalStore'
import { useSprintsStore } from '../../../store/sprintsStore'
import { useToastStore } from '../../../store/toastStore'
import type { Sprint, SprintStatus } from '../../../types/sprint'
import formStyles from './formStyles.module.css'

const PROJECTS = ['Web 3 App for Fxtrade', 'Healthydog Landing Page', 'Redesign of Website', 'ChronoLoop Launch']
const STATUSES: { value: SprintStatus; label: string }[] = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
]

export function EditSprintModal() {
  const editingSprintId = useSprintModalStore((s) => s.editingSprintId)
  const closeModal = useSprintModalStore((s) => s.closeEdit)
  const sprints = useSprintsStore((s) => s.sprints)
  const sprint = sprints.find((s) => s.id === editingSprintId) ?? null

  return (
    <Modal
      open={sprint !== null}
      onOpenChange={(open) => !open && closeModal()}
      title="Edit Sprint"
      subtitle="Update sprint details and settings"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={closeModal}>Cancel</Button>
          <Button type="submit" form="form-editsprint">
            <Check aria-hidden="true" /> Save Changes
          </Button>
        </>
      }
    >
      {sprint && <EditSprintFormFields key={sprint.id} sprint={sprint} onDone={closeModal} />}
    </Modal>
  )
}

interface FormState {
  name: string
  goal: string
  pts: string
  status: SprintStatus
  project: string
  startRaw: string
  endRaw: string
}

function EditSprintFormFields({ sprint, onDone }: { sprint: Sprint; onDone: () => void }) {
  const updateSprint = useSprintsStore((s) => s.updateSprint)
  const showToast = useToastStore((s) => s.showToast)
  const [form, setForm] = useState<FormState>({
    name: sprint.name, goal: sprint.goal, pts: String(sprint.storyPoints), status: sprint.status,
    project: sprint.project, startRaw: sprint.startRaw ?? '', endRaw: sprint.endRaw ?? '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) {
      showToast('Sprint name is required', 'error', 2000)
      return
    }
    // Non-numeric/blank pts and blank goal fall back to the sprint's
    // existing values, matching index.html:8436/8435 (`parseInt(...) ||
    // s.storyPoints` and `.trim() || s.goal`). Forcing progress to 100 when
    // status becomes 'completed' (index.html:8449) lives in
    // sprintsStore.updateSprint, not here.
    const pts = parseInt(form.pts, 10) || sprint.storyPoints
    const goal = form.goal.trim() || sprint.goal
    updateSprint(sprint.id, { name, goal, storyPoints: pts, status: form.status, project: form.project, startRaw: form.startRaw, endRaw: form.endRaw })
    showToast(`Sprint "${name}" updated!`, 'success', 3000)
    onDone()
  }

  return (
    <form id="form-editsprint" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel} htmlFor="edit-sprint-name-input">Sprint Name *</label>
        <input id="edit-sprint-name-input" className={formStyles.formInput} type="text" placeholder="e.g. Authentication & Onboarding" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
      </div>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel} htmlFor="edit-sprint-goal-input">Sprint Goal</label>
        <textarea id="edit-sprint-goal-input" className={formStyles.formTextarea} placeholder="Describe the main objective for this sprint..." style={{ minHeight: 60 }} value={form.goal} onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))} />
      </div>
      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="edit-sprint-start-input">Start Date</label>
          <input id="edit-sprint-start-input" className={formStyles.formInput} type="date" value={form.startRaw} onChange={(e) => setForm((f) => ({ ...f, startRaw: e.target.value }))} />
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="edit-sprint-end-input">End Date</label>
          <input id="edit-sprint-end-input" className={formStyles.formInput} type="date" value={form.endRaw} onChange={(e) => setForm((f) => ({ ...f, endRaw: e.target.value }))} />
        </div>
      </div>
      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="edit-sprint-pts-input">Story Point Capacity</label>
          <input id="edit-sprint-pts-input" className={formStyles.formInput} type="number" placeholder="e.g. 40" min={1} max={200} value={form.pts} onChange={(e) => setForm((f) => ({ ...f, pts: e.target.value }))} />
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="edit-sprint-status-sel">Status</label>
          <select id="edit-sprint-status-sel" className={formStyles.formSelect} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as SprintStatus }))}>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel} htmlFor="edit-sprint-project-sel">Project</label>
        <select id="edit-sprint-project-sel" className={formStyles.formSelect} value={form.project} onChange={(e) => setForm((f) => ({ ...f, project: e.target.value }))}>
          {PROJECTS.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
    </form>
  )
}
