// src/components/dashboard/CriticalProjectsPanel.tsx
import { useState } from 'react'
import { MoreHorizontal, ChevronDown, Eye, Edit2, Archive, Trash2 } from 'lucide-react'
import { Dropdown } from '../ui/Dropdown'
import { DASHBOARD_CRITICAL_PROJECTS } from '../../data/mockDashboardProjects'
import { useToastStore } from '../../store/toastStore'
import styles from './CriticalProjectsPanel.module.css'

const WEEK_OPTIONS = ['Today', 'This week', 'This month', 'This quarter']

const CTX_ACTIONS = [
  { action: 'view', label: 'View Details', icon: <Eye aria-hidden="true" />, message: (name: string) => `Viewing "${name}"`, variant: 'info' as const },
  { action: 'edit', label: 'Edit', icon: <Edit2 aria-hidden="true" />, message: (name: string) => `Editing "${name}"`, variant: 'info' as const },
  { action: 'archive', label: 'Archive', icon: <Archive aria-hidden="true" />, message: (name: string) => `Archived "${name}"`, variant: 'success' as const },
]

export function CriticalProjectsPanel() {
  const showToast = useToastStore((s) => s.showToast)
  const [week, setWeek] = useState('This week')

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Critical Projects</h2>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <button type="button" className={styles.weekBtn}>
              {week} <ChevronDown aria-hidden="true" />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            {WEEK_OPTIONS.map((label) => (
              <Dropdown.Item key={label} active={label === week} onSelect={() => { setWeek(label); showToast(`Showing ${label.toLowerCase()}`, 'info', 2000) }}>
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>
      </div>

      <div className={styles.rows}>
        {DASHBOARD_CRITICAL_PROJECTS.map((project) => (
          <div
            key={project.id}
            className={styles.row}
            role="button"
            tabIndex={0}
            onClick={() => showToast(`Opening: ${project.title}`, 'info', 2000)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (e.key === ' ') e.preventDefault()
                showToast(`Opening: ${project.title}`, 'info', 2000)
              }
            }}
          >
            <div>
              <div className={styles.rowTitle}>{project.title}</div>
              <div className={styles.rowMeta}>
                <button
                  type="button"
                  className={styles.client}
                  onClick={(e) => { e.stopPropagation(); showToast('Opening client profile...', 'info', 2000) }}
                >
                  {project.client}
                </button>
                <span className={styles.dot}>•</span>
                <span>{project.dueLabel}</span>
              </div>
            </div>

            <Dropdown.Root>
              <Dropdown.Trigger asChild>
                <button
                  type="button"
                  className={styles.threeDotBtn}
                  aria-label="More options"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal aria-hidden="true" />
                </button>
              </Dropdown.Trigger>
              <Dropdown.Content>
                {CTX_ACTIONS.map(({ action, label, icon, message, variant }) => (
                  <Dropdown.Item key={action} icon={icon} onSelect={() => showToast(message(project.title), variant)}>
                    {label}
                  </Dropdown.Item>
                ))}
                <Dropdown.Divider />
                <Dropdown.Item icon={<Trash2 aria-hidden="true" />} danger onSelect={() => showToast(`Deleted "${project.title}"`, 'error')}>
                  Delete
                </Dropdown.Item>
              </Dropdown.Content>
            </Dropdown.Root>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button type="button" className={styles.seeAll} onClick={() => showToast('Loading all projects...', 'info', 2000)}>
          See All
        </button>
      </div>
    </section>
  )
}
