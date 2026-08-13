import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Save } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { useTaskModalStore } from '../../../store/taskModalStore'
import { useTasksStore } from '../../../store/tasksStore'
import { useToastStore } from '../../../store/toastStore'
import type { Task, TaskPriority } from '../../../types/task'
import formStyles from './formStyles.module.css'

const PROJECTS = ['Web 3 App for Fxtrade', 'Healthydog Landing Page', 'Redesign of Website', 'ChronoLoop Launch']
const ASSIGNEES: Record<string, string> = {
  'Aspen Herwitz': 'AS',
  'Roger Dokidis': 'RD',
  'Marley Vaccaro': 'MV',
  'Ryan Culhane': 'RC',
}
const ASSIGNEE_NAME_BY_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(ASSIGNEES).map(([name, code]) => [code, name]),
)

interface FormState {
  name: string
  project: string
  assigneeName: string
  due: string
  priority: TaskPriority
  description: string
}

const EMPTY_FORM: FormState = { name: '', project: PROJECTS[0], assigneeName: 'Aspen Herwitz', due: '', priority: 'medium', description: '' }

function formStateFromTask(task: Task): FormState {
  return {
    name: task.title,
    project: task.project,
    assigneeName: ASSIGNEE_NAME_BY_CODE[task.assignee] ?? task.assignee,
    due: task.due,
    priority: task.priority,
    description: task.description,
  }
}

export function AddTaskModal() {
  const isOpen = useTaskModalStore((s) => s.isOpen)
  const editingTaskId = useTaskModalStore((s) => s.editingTaskId)
  const closeModal = useTaskModalStore((s) => s.close)
  const tasks = useTasksStore((s) => s.tasks)
  const isEditing = editingTaskId !== null

  // Bumped synchronously on every close *intent* (Cancel, submit, outside click, Escape —
  // all funnel through here). This is folded into AddTaskFormFields' key below so the form
  // always gets a fresh mount/lazy-init on the next open, even when reopening the same
  // create/edit target. We can't rely solely on Radix unmounting the modal body for this:
  // Modal.module.css gives Dialog.Content a real `cardOut` exit animation, so Radix's
  // Presence keeps the subtree mounted (state 'unmountSuspended') until that animation
  // finishes — if the modal is reopened for the same target inside that window, Presence
  // cancels the exit and never unmounts, so a key based on editingTaskId alone wouldn't
  // change and stale form values would survive. Bumping this counter here (a plain
  // setState from an event handler, batched with closeModal()) makes the reset synchronous
  // and independent of animation timing, without calling setState inside an effect and
  // without reading a ref during render.
  const [session, setSession] = useState(0)
  const handleClose = () => {
    setSession((s) => s + 1)
    closeModal()
  }

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title={isEditing ? 'Edit Task' : 'Add New Task'}
      subtitle={isEditing ? 'Update the task details' : 'Fill in the details to create a task'}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="form-addtask">
            {isEditing ? <><Save aria-hidden="true" /> Save Changes</> : <><Plus aria-hidden="true" /> Add Task</>}
          </Button>
        </>
      }
    >
      <AddTaskFormFields
        key={`${editingTaskId ?? 'create'}-${session}`}
        editingTaskId={editingTaskId}
        task={editingTaskId === null ? undefined : tasks.find((t) => t.id === editingTaskId)}
        onDone={handleClose}
      />
    </Modal>
  )
}

interface AddTaskFormFieldsProps {
  editingTaskId: number | null
  task: Task | undefined
  onDone: () => void
}

function AddTaskFormFields({ editingTaskId, task, onDone }: AddTaskFormFieldsProps) {
  const addTask = useTasksStore((s) => s.addTask)
  const updateTask = useTasksStore((s) => s.updateTask)
  const showToast = useToastStore((s) => s.showToast)
  const [form, setForm] = useState<FormState>(() => (task ? formStateFromTask(task) : EMPTY_FORM))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const name = form.name.trim()
    if (!name) return
    const due = form.due || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
    const assignee = ASSIGNEES[form.assigneeName] ?? form.assigneeName.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase()

    if (editingTaskId !== null) {
      updateTask(editingTaskId, { title: name, project: form.project, assignee, due, priority: form.priority, description: form.description.trim() })
      showToast('Task updated!', 'success')
    } else {
      addTask({ title: name, project: form.project, assignee, due, priority: form.priority, description: form.description.trim() })
      showToast(`"${name.slice(0, 30)}" added to To Do!`, 'success')
    }
    onDone()
  }

  return (
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
  )
}
