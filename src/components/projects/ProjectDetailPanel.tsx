import { useCallback, useEffect, useRef, useState } from 'react'
import { Edit2, Trash2, X } from 'lucide-react'
import { useProjectDetailStore } from '../../store/projectDetailStore'
import { useProjectsStore } from '../../store/projectsStore'
import { useToastStore } from '../../store/toastStore'
import { Avatar } from '../ui/Avatar'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { useAnimatedWidth } from '../../hooks/useAnimatedWidth'
import { PROJECT_AVATAR_SRC } from '../../data/mockProjects'
import { priorityLabel } from '../../lib/projectFormatters'
import styles from './ProjectDetailPanel.module.css'

interface ProjectDetailPanelProps {
  onDelete: (id: string, name: string) => void
}

export function ProjectDetailPanel({ onDelete }: ProjectDetailPanelProps) {
  const openProjectId = useProjectDetailStore((s) => s.openProjectId)
  const close = useProjectDetailStore((s) => s.close)
  const projects = useProjectsStore((s) => s.projects)
  const showToast = useToastStore((s) => s.showToast)

  const [lastProjectId, setLastProjectId] = useState<string | null>(null)
  const [prevOpenProjectId, setPrevOpenProjectId] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    if (document.activeElement instanceof HTMLElement && panelRef.current?.contains(document.activeElement)) {
      document.activeElement.blur()
    }
    close()
  }, [close])

  // Adjusting state during render (React docs), same pattern as
  // TaskDetailPanel (Phase 3.3): keeps the last-open project id available so
  // the panel can render its content while sliding out.
  if (openProjectId !== prevOpenProjectId) {
    setPrevOpenProjectId(openProjectId)
    if (openProjectId !== null) setLastProjectId(openProjectId)
  }

  const isOpen = openProjectId !== null

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, handleClose])

  // `inert` isn't in this project's @types/react HTMLAttributes yet, so it's
  // set as a real DOM property via the ref rather than as a JSX prop — same
  // workaround as TaskDetailPanel (Phase 3.3).
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.inert = !isOpen
    }
  }, [isOpen])

  const displayProjectId = openProjectId ?? lastProjectId
  const project = projects.find((p) => p.id === displayProjectId) ?? null

  const fillWidth = useAnimatedWidth(project?.progress ?? 0)

  if (!project) {
    return (
      <>
        <div className={styles.overlay} data-open={false} data-testid="project-detail-overlay" />
        <div ref={panelRef} className={styles.panel} data-open={false} />
      </>
    )
  }

  const handleDelete = () => {
    const id = project.id
    const name = project.name
    handleClose()
    onDelete(id, name)
  }

  return (
    <>
      <div className={styles.overlay} data-open={isOpen} data-testid="project-detail-overlay" onClick={handleClose} />
      <div ref={panelRef} className={styles.panel} data-open={isOpen}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.accentDot} style={{ background: project.color }} />
            <ProjectStatusBadge status={project.status} />
          </div>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.headerBtn}
              title="Edit project"
              aria-label="Edit project"
              onClick={() => showToast('Edit project coming soon', 'info', 2000)}
            >
              <Edit2 aria-hidden="true" />
            </button>
            <button type="button" className={[styles.headerBtn, styles.deleteBtn].join(' ')} title="Delete project" aria-label="Delete project" onClick={handleDelete}>
              <Trash2 aria-hidden="true" />
            </button>
            <button type="button" className={styles.headerBtn} title="Close" aria-label="Close" onClick={handleClose}>
              <X aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <div className={styles.titleText}>{project.name}</div>
            <div className={styles.clientText}>{project.client}</div>
            <div className={styles.desc}>{project.desc}</div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Progress</div>
            <div className={styles.bigProgress}>
              <div className={styles.bigProgressMeta}>
                <span className={styles.tasksText}>{project.tasksDone} of {project.tasksTotal} tasks completed</span>
                <span className={styles.pct}>{project.progress}%</span>
              </div>
              <div className={styles.bigProgressBar}>
                <div className={styles.bigProgressFill} style={{ background: project.color, width: `${fillWidth}%` }} />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Details</div>
            <div className={styles.metaGrid}>
              <div className={styles.metaCell}>
                <div className={styles.metaLabel}>Priority</div>
                <div className={styles.metaValue}>{priorityLabel(project.priority)}</div>
              </div>
              <div className={styles.metaCell}>
                <div className={styles.metaLabel}>Category</div>
                <div className={styles.metaValue}>{project.category}</div>
              </div>
              <div className={styles.metaCell}>
                <div className={styles.metaLabel}>Due Date</div>
                <div className={styles.metaValue}>{project.dueDate}</div>
              </div>
              <div className={styles.metaCell}>
                <div className={styles.metaLabel}>Tasks</div>
                <div className={styles.metaValue}>{project.tasksDone} / {project.tasksTotal}</div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Team</div>
            <div className={styles.teamGrid}>
              {project.team.map((member) => (
                <div key={member.i} className={styles.teamMember}>
                  <Avatar
                    src={PROJECT_AVATAR_SRC[member.i]}
                    name={member.n || member.i}
                    style={{ width: 40, height: 40 }}
                    fallbackStyle={{ background: member.c, fontSize: 12 }}
                  />
                  <div className={styles.teamName}>{member.n || member.i}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Milestones</div>
            <div className={styles.milestones}>
              {/* Milestones have no stable id in the source data (index.html's
                  {l,done,d} shape) and this list is never reordered or
                  appended to within a project's lifetime here, so an index
                  key is safe. */}
              {project.milestones.map((milestone, index) => (
                <div key={index} className={styles.milestoneItem}>
                  <div className={[styles.milestoneCheck, milestone.done ? styles.done : ''].filter(Boolean).join(' ')} />
                  <span className={[styles.milestoneText, milestone.done ? styles.done : ''].filter(Boolean).join(' ')}>{milestone.l}</span>
                  <span className={styles.milestoneDate}>{milestone.d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
