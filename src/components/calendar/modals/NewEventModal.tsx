import { useState } from 'react'
import type { FormEvent } from 'react'
import { CalendarPlus } from 'lucide-react'
import { Modal } from '../../ui/Modal'
import { Button } from '../../ui/Button'
import { useToastStore } from '../../../store/toastStore'
import type { CalendarEventType, NewCalendarEventInput } from '../../../types/calendar'
import styles from './NewEventModal.module.css'

interface Props {
  open: boolean
  onClose: () => void
  onSave: (input: NewCalendarEventInput) => void
}

const TYPE_OPTIONS: { id: CalendarEventType; label: string; iconBg: string; iconColor: string }[] = [
  { id: 'task', label: 'Task', iconBg: 'rgba(74,144,255,0.14)', iconColor: '#4A90FF' },
  { id: 'project', label: 'Project', iconBg: 'rgba(168,85,247,0.14)', iconColor: '#A855F7' },
  { id: 'sprint', label: 'Sprint', iconBg: 'rgba(0,212,170,0.14)', iconColor: '#00D4AA' },
  { id: 'meeting', label: 'Meeting', iconBg: 'rgba(255,140,66,0.14)', iconColor: '#FF8C42' },
]

const PROJECT_OPTIONS = ['', 'Web 3 App for Fxtrade', 'Healthydog Landing Page', 'Redesign of Website', 'ChronoLoop Launch', 'Internal']
const ASSIGNEE_OPTIONS = [
  { value: 'AS', label: 'Aspen H.' },
  { value: 'MV', label: 'Marley V.' },
  { value: 'RC', label: 'Ryan C.' },
  { value: 'RD', label: 'Roger D.' },
]

interface FormState {
  type: CalendarEventType
  title: string
  date: string
  time: string
  endDate: string
  project: string
  priority: string
  assignee: string
  notes: string
}

const EMPTY: FormState = {
  type: 'task',
  title: '',
  date: '',
  time: '09:00',
  endDate: '',
  project: '',
  priority: 'medium',
  assignee: 'AS',
  notes: '',
}

export function NewEventModal({ open, onClose, onSave }: Props) {
  const showToast = useToastStore((s) => s.showToast)

  // Key-based reset on close (same pattern as NewProjectModal / NewSprintModal)
  const [session, setSession] = useState(0)
  const handleClose = () => {
    setSession((s) => s + 1)
    onClose()
  }

  return (
    <Modal open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose() }} title="New Calendar Event" subtitle="Schedule a task, meeting, sprint, or project milestone">
      <NewEventForm key={session} onSubmit={onSave} onCancel={handleClose} showToast={showToast} />
    </Modal>
  )
}

function NewEventForm({
  onSubmit,
  onCancel,
  showToast,
}: {
  onSubmit: (input: NewCalendarEventInput) => void
  onCancel: () => void
  showToast: (msg: string, variant: 'success' | 'error' | 'info', duration?: number) => void
}) {
  const [form, setForm] = useState<FormState>(EMPTY)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      showToast('Please enter an event title', 'error', 2500)
      return
    }
    if (!form.date) {
      showToast('Please select a start date', 'error', 2500)
      return
    }
    onSubmit({
      type: form.type,
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      endDate: form.endDate || undefined,
      project: form.project,
      priority: form.priority,
      assignee: form.assignee,
      notes: form.notes,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Event Type</label>
        <div className={styles.typeGrid}>
          {TYPE_OPTIONS.map(({ id, label, iconBg, iconColor }) => (
            <button
              key={id}
              type="button"
              className={`${styles.typeCard}${form.type === id ? ` ${styles.typeCardSel}` : ''}`}
              data-type={id}
              onClick={() => update('type', id)}
            >
              <div className={styles.typeIcon} style={{ background: iconBg }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {id === 'task' && <><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>}
                  {id === 'project' && <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>}
                  {id === 'sprint' && <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>}
                  {id === 'meeting' && <><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></>}
                </svg>
              </div>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="cal-modal-title">Event Title</label>
        <input
          id="cal-modal-title"
          type="text"
          className={styles.formInput}
          placeholder="Enter event title..."
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="cal-modal-date">Start Date</label>
          <input
            id="cal-modal-date"
            type="date"
            className={styles.formInput}
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="cal-modal-time">Time</label>
          <input
            id="cal-modal-time"
            type="time"
            className={styles.formInput}
            value={form.time}
            onChange={(e) => update('time', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="cal-modal-end-date">
          End Date <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 10 }}>(optional — for multi-day spans)</span>
        </label>
        <input
          id="cal-modal-end-date"
          type="date"
          className={styles.formInput}
          value={form.endDate}
          onChange={(e) => update('endDate', e.target.value)}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="cal-modal-project">Project</label>
        <select
          id="cal-modal-project"
          className={styles.formSelect}
          value={form.project}
          onChange={(e) => update('project', e.target.value)}
        >
          <option value="">None</option>
          {PROJECT_OPTIONS.filter(Boolean).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="cal-modal-priority">Priority</label>
          <select
            id="cal-modal-priority"
            className={styles.formSelect}
            value={form.priority}
            onChange={(e) => update('priority', e.target.value)}
          >
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="cal-modal-assignee">Assignee</label>
          <select
            id="cal-modal-assignee"
            className={styles.formSelect}
            value={form.assignee}
            onChange={(e) => update('assignee', e.target.value)}
          >
            {ASSIGNEE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="cal-modal-notes">Notes</label>
        <textarea
          id="cal-modal-notes"
          className={styles.formTextarea}
          placeholder="Add notes or description..."
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
        />
      </div>

      <div className={styles.footer}>
        <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">
          <CalendarPlus size={14} /> Add to Calendar
        </Button>
      </div>
    </form>
  )
}
