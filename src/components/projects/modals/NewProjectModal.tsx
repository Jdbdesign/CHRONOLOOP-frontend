import { useState } from 'react'
import type { FormEvent } from 'react'
import { Briefcase } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { useProjectModalStore } from '../../../store/projectModalStore'
import { useProjectsStore } from '../../../store/projectsStore'
import { useToastStore } from '../../../store/toastStore'
import type { ProjectPriority } from '../../../types/project'
import formStyles from './formStyles.module.css'

const CATEGORIES = ['Development', 'Design', 'Marketing', 'Research', 'Operations']
const ASSIGNEES = ['Aspen Herwitz', 'Roger Dokidis', 'Marley Vaccaro', 'Ryan Culhane']
const COLORS = [
  { hex: '#4A90FF', title: 'Blue' },
  { hex: '#22C55E', title: 'Green' },
  { hex: '#A855F7', title: 'Purple' },
  { hex: '#FF8C42', title: 'Orange' },
  { hex: '#00D4AA', title: 'Teal' },
  { hex: '#EC4899', title: 'Pink' },
  { hex: '#EAB308', title: 'Yellow' },
  { hex: '#FF4D4D', title: 'Red' },
  { hex: '#06B6D4', title: 'Cyan' },
]

interface FormState {
  name: string
  client: string
  category: string
  priority: ProjectPriority
  dueRaw: string
  assignee: string
  color: string
  desc: string
}

const EMPTY_FORM: FormState = {
  name: '', client: '', category: CATEGORIES[0], priority: 'medium',
  dueRaw: '', assignee: ASSIGNEES[0], color: COLORS[0].hex, desc: '',
}

function formatDueDate(dueRaw: string): string {
  return dueRaw
    ? new Date(`${dueRaw}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBD'
}

export function NewProjectModal() {
  const isOpen = useProjectModalStore((s) => s.isOpen)
  const closeModal = useProjectModalStore((s) => s.close)

  // Same synchronous-reset-on-close-intent pattern as AddTaskModal (Phase
  // 3.2) — see that file for why a plain useEffect+setState reset isn't used.
  const [session, setSession] = useState(0)
  const handleClose = () => {
    setSession((s) => s + 1)
    closeModal()
  }

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="New Project"
      subtitle="Set up a new project for your team"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="form-newproject">
            <Briefcase aria-hidden="true" /> Create Project
          </Button>
        </>
      }
    >
      <NewProjectFormFields key={session} onDone={handleClose} />
    </Modal>
  )
}

interface NewProjectFormFieldsProps {
  onDone: () => void
}

function NewProjectFormFields({ onDone }: NewProjectFormFieldsProps) {
  const addProject = useProjectsStore((s) => s.addProject)
  const showToast = useToastStore((s) => s.showToast)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) {
      showToast('Project name is required', 'error', 2000)
      return
    }
    // form.assignee ("Lead Assignee") is intentionally unused below — the
    // original's own btn-create-project handler (index.html:8485-8501) never
    // reads proj-assignee-sel either; every new project gets the same
    // hardcoded team:[{i:'JA', ...}] regardless of the selected assignee.
    addProject({
      name,
      client: form.client.trim(),
      category: form.category,
      priority: form.priority,
      dueDate: formatDueDate(form.dueRaw),
      color: form.color,
      desc: form.desc.trim(),
    })
    showToast(`Project "${name}" created!`, 'success', 3000)
    onDone()
  }

  return (
    <form id="form-newproject" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel} htmlFor="proj-name-input">Project Name *</label>
        <input
          id="proj-name-input"
          className={formStyles.formInput}
          type="text"
          placeholder="e.g. Mobile App Redesign"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>

      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="proj-client-input">Client</label>
          <input
            id="proj-client-input"
            className={formStyles.formInput}
            type="text"
            placeholder="Client name"
            value={form.client}
            onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))}
          />
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="proj-cat-sel">Category</label>
          <select id="proj-cat-sel" className={formStyles.formSelect} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className={formStyles.formGroup}>
        <span className={formStyles.formLabel}>Priority</span>
        <div className={formStyles.priorityGroup}>
          {(['high', 'medium', 'low'] as const).map((p) => (
            <button
              key={p}
              type="button"
              className={[formStyles.priorityPill, formStyles[p]].join(' ')}
              data-selected={form.priority === p}
              onClick={() => setForm((f) => ({ ...f, priority: p }))}
            >
              {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className={formStyles.formRow}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="proj-due-input">Due Date</label>
          <input id="proj-due-input" className={formStyles.formInput} type="date" value={form.dueRaw} onChange={(e) => setForm((f) => ({ ...f, dueRaw: e.target.value }))} />
        </div>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="proj-assignee-sel">Lead Assignee</label>
          <select id="proj-assignee-sel" className={formStyles.formSelect} value={form.assignee} onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}>
            {ASSIGNEES.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      <div className={formStyles.formGroup}>
        <span className={formStyles.formLabel}>Accent Color</span>
        <div className={formStyles.colorSwatchRow}>
          {COLORS.map(({ hex, title }) => (
            <button
              key={hex}
              type="button"
              className={formStyles.colorSwatch}
              data-selected={form.color === hex}
              style={{ background: hex }}
              title={title}
              aria-label={title}
              onClick={() => setForm((f) => ({ ...f, color: hex }))}
            />
          ))}
        </div>
      </div>

      <div className={formStyles.formGroup}>
        <label className={formStyles.formLabel} htmlFor="proj-desc-input">Description</label>
        <textarea
          id="proj-desc-input"
          className={formStyles.formTextarea}
          placeholder="What is this project about?"
          value={form.desc}
          onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
        />
      </div>
    </form>
  )
}
