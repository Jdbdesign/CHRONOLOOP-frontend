import { useCallback, useEffect, useRef, useState } from 'react'
import { Edit2, Trash2, X } from 'lucide-react'
import { useSprintDetailStore } from '../../store/sprintDetailStore'
import { useSprintsStore } from '../../store/sprintsStore'
import { Avatar } from '../ui/Avatar'
import { SprintStatusBadge } from './SprintStatusBadge'
import { useAnimatedWidth } from '../../hooks/useAnimatedWidth'
import styles from './SprintDetailPanel.module.css'

interface SprintDetailPanelProps {
  onEdit: (id: string) => void
  onDelete: (id: string, name: string) => void
}

export function SprintDetailPanel({ onEdit, onDelete }: SprintDetailPanelProps) {
  const openSprintId = useSprintDetailStore((s) => s.openSprintId)
  const close = useSprintDetailStore((s) => s.close)
  const sprints = useSprintsStore((s) => s.sprints)

  const [lastSprintId, setLastSprintId] = useState<string | null>(null)
  const [prevOpenSprintId, setPrevOpenSprintId] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    if (document.activeElement instanceof HTMLElement && panelRef.current?.contains(document.activeElement)) {
      document.activeElement.blur()
    }
    close()
  }, [close])

  // Adjusting state during render (React docs), same pattern as
  // ProjectDetailPanel (Phase 3.4): keeps the last-open sprint id available
  // so the panel can render its content while sliding out.
  if (openSprintId !== prevOpenSprintId) {
    setPrevOpenSprintId(openSprintId)
    if (openSprintId !== null) setLastSprintId(openSprintId)
  }

  const isOpen = openSprintId !== null

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, handleClose])

  // `inert` isn't in this project's @types/react HTMLAttributes yet, so it's
  // set as a real DOM property via the ref rather than as a JSX prop — same
  // workaround as ProjectDetailPanel (Phase 3.4).
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.inert = !isOpen
    }
  }, [isOpen])

  const displaySprintId = openSprintId ?? lastSprintId
  const sprint = sprints.find((s) => s.id === displaySprintId) ?? null

  const fillWidth = useAnimatedWidth(sprint?.progress ?? 0)

  const vSprints = sprints.filter((s) => s.velocity !== null)
  const maxVel = vSprints.length ? Math.max(...vSprints.map((s) => s.velocity as number)) : 1

  if (!sprint) {
    return (
      <>
        <div className={styles.overlay} data-open={false} data-testid="sprint-detail-overlay" />
        <div ref={panelRef} className={styles.panel} data-open={false} />
      </>
    )
  }

  const handleEdit = () => {
    const id = sprint.id
    handleClose()
    onEdit(id)
  }
  const handleDelete = () => {
    const id = sprint.id
    const name = sprint.name
    handleClose()
    onDelete(id, name)
  }

  return (
    <>
      <div className={styles.overlay} data-open={isOpen} data-testid="sprint-detail-overlay" onClick={handleClose} />
      <div ref={panelRef} className={styles.panel} data-open={isOpen}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.accentDot} style={{ background: sprint.color }} />
            <SprintStatusBadge status={sprint.status} />
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.headerBtn} title="Edit sprint" aria-label="Edit sprint" onClick={handleEdit}>
              <Edit2 aria-hidden="true" />
            </button>
            <button type="button" className={[styles.headerBtn, styles.deleteBtn].join(' ')} title="Delete sprint" aria-label="Delete sprint" onClick={handleDelete}>
              <Trash2 aria-hidden="true" />
            </button>
            <button type="button" className={styles.headerBtn} title="Close" aria-label="Close" onClick={handleClose}>
              <X aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <div className={styles.titleText}>{sprint.name}</div>
            <div className={styles.goalText}>{sprint.goal}</div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Details</div>
            <div className={styles.metaGrid}>
              <div className={styles.metaCell}><div className={styles.metaLabel}>Start Date</div><div className={styles.metaValue}>{sprint.startDate}</div></div>
              <div className={styles.metaCell}><div className={styles.metaLabel}>End Date</div><div className={styles.metaValue}>{sprint.endDate}</div></div>
              <div className={styles.metaCell}><div className={styles.metaLabel}>Story Points</div><div className={styles.metaValue}>{sprint.completedPoints} / {sprint.storyPoints}</div></div>
              <div className={styles.metaCell}><div className={styles.metaLabel}>Velocity</div><div className={styles.metaValue}>{sprint.velocity !== null ? `${sprint.velocity} pts` : '—'}</div></div>
              <div className={styles.metaCell} style={{ gridColumn: '1/-1' }}><div className={styles.metaLabel}>Project</div><div className={styles.metaValue} style={{ fontSize: 12 }}>{sprint.project}</div></div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Progress</div>
            <div className={styles.bigProgress}>
              <div className={styles.bigProgressMeta}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sprint.tasksDone} of {sprint.tasksTotal} tasks done</span>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: 'var(--text-primary)' }}>{sprint.progress}%</span>
              </div>
              <div className={styles.bigProgressBar}><div className={styles.bigProgressFill} style={{ background: sprint.color, width: `${fillWidth}%` }} /></div>
              <div style={{ display: 'flex', gap: 14, marginTop: 4, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text-muted)' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-green)', display: 'inline-block' }} />Done: {sprint.tasksDone}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text-muted)' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-yellow)', display: 'inline-block' }} />In Progress: {sprint.inProgress}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text-muted)' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-blue)', display: 'inline-block' }} />To Do: {sprint.todo}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Team</div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {sprint.team.map((m) => (
                <div key={m.i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <Avatar name={m.i} fallbackStyle={{ background: m.c, fontSize: 12 }} style={{ width: 38, height: 38 }} />
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{m.i}</div>
                </div>
              ))}
            </div>
          </div>

          {vSprints.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Team Velocity</div>
              <div className={styles.velocityBars}>
                {vSprints.map((s) => (
                  <div key={s.id} className={styles.velocityBarWrap}>
                    <div className={styles.velocityBarNum}>{s.velocity}</div>
                    <div
                      className={styles.velocityBar}
                      style={{
                        height: Math.round(((s.velocity as number) / maxVel) * 48),
                        background: s.id === sprint.id ? 'var(--accent-blue)' : 'var(--border-default)',
                      }}
                    />
                    <div className={styles.velocityBarLabel}>{s.number.replace('SPRINT ', 'S')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Sprint Tasks ({sprint.tasksDone}/{sprint.tasksTotal})</div>
            <div className={styles.taskList}>
              {/* sprintTasks items have no stable id in the source data shape
                  (matches index.html's own {title, status} shape) and this
                  list is never reordered/appended within a sprint's lifetime
                  here, so an index key is safe — same ruling already made
                  for ProjectDetailPanel's milestones list. */}
              {sprint.sprintTasks.map((t, index) => (
                <div key={index} className={styles.taskItem}>
                  <div className={[styles.taskCheck, t.status === 'done' && styles.done].filter(Boolean).join(' ')} />
                  <span className={[styles.taskName, t.status === 'done' && styles.done].filter(Boolean).join(' ')}>{t.title}</span>
                  <span
                    className={[
                      styles.taskStatusBadge,
                      t.status === 'done' ? styles.taskStatusDone : t.status === 'in-progress' ? styles.taskStatusActive : styles.taskStatusTodo,
                    ].join(' ')}
                  >
                    {t.status === 'done' ? 'Done' : t.status === 'in-progress' ? 'Active' : 'Todo'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
