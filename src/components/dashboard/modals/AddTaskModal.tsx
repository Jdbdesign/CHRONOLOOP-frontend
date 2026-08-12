import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { useDashboardUiStore } from '../../../store/dashboardUiStore'
import { useTasksStore } from '../../../store/tasksStore'
import { useToastStore } from '../../../store/toastStore'
import type { TaskPriority } from '../../../types/task'
import formStyles from './formStyles.module.css'

const PROJECTS = ['Web 3 App for Fxtrade', 'Healthydog Landing Page', 'Redesign of Website', 'ChronoLoop Launch']
const ASSIGNEES: Record<string, string> = {
  'Aspen Herwitz': 'AS',
  'Roger Dokidis': 'RD',
  'Marley Vaccaro': 'MV',
  'Ryan Culhane': 'RC',
}

const EMPTY_FORM = { name: '', project: PROJECTS[0], assigneeName: 'Aspen Herwitz', due: '', priority: 'medium' as TaskPriority, description: '' }

export function AddTaskModal() {
  const activeModal = useDashboardUiStore((s) => s.activeModal)
  const closeModal = useDashboardUiStore((s) => s.closeModal)
  const addTask = useTasksStore((s) => s.addTask)
  const showToast = useToastStore((s) => s.showToast)
  const [form, setForm] = useState(EMPTY_FORM)

  const handleClose = () => {
    setForm(EMPTY_FORM)
    closeModal()
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) return
    const due = form.due || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
    addTask({
      title: name,
      project: form.project,
      assignee: ASSIGNEES[form.assigneeName] ?? form.assigneeName.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase(),
      due,
      priority: form.priority,
      description: form.description.trim(),
    })
    showToast(`"${name.slice(0, 30)}" added to To Do!`, 'success')
    handleClose()
  }

  return (
    <Modal
      open={activeModal === 'addTask'}
      onOpenChange={(open) => !open && handleClose()}
      title="Add New Task"
      subtitle="Fill in the details to create a task"
      footer={
        <>
          <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="form-addtask"><Plus aria-hidden="true" /> Add Task</Button>
        </>
      }
    >
      <form id="form-addtask" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="task-name-input">Task Name *</label>
          <input
            id="task-name-input"
            className={formStyles.formInput}
            type="text"
            placeholder="Enter task name..."
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>

        <div className={formStyles.formRow}>
          <div className={formStyles.formGroup}>
            <label className={formStyles.formLabel} htmlFor="task-project-sel">Project</label>
            <select id="task-project-sel" className={formStyles.formSelect} value={form.project} onChange={(e) => setForm((f) => ({ ...f, project: e.target.value }))}>
              {PROJECTS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div className={formStyles.formGroup}>
            <label className={formStyles.formLabel} htmlFor="task-assignee-sel">Assignee</label>
            <select id="task-assignee-sel" className={formStyles.formSelect} value={form.assigneeName} onChange={(e) => setForm((f) => ({ ...f, assigneeName: e.target.value }))}>
              {Object.keys(ASSIGNEES).map((name) => <option key={name}>{name}</option>)}
            </select>
          </div>
        </div>

        <div className={formStyles.formRow}>
          <div className={formStyles.formGroup}>
            <label className={formStyles.formLabel} htmlFor="task-due">Due Date</label>
            <input id="task-due" className={formStyles.formInput} type="date" value={form.due} onChange={(e) => setForm((f) => ({ ...f, due: e.target.value }))} />
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
        </div>

        <div className={formStyles.formGroup}>
          <label className={formStyles.formLabel} htmlFor="task-desc">Description</label>
          <textarea id="task-desc" className={formStyles.formTextarea} placeholder="Add a description..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        </div>
      </form>
    </Modal>
  )
}
