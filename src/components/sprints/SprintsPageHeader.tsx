import { useState } from 'react'
import { List, LayoutTemplate, SlidersHorizontal, Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { Dropdown } from '../ui/Dropdown'
import { useToastStore } from '../../store/toastStore'
import styles from './SprintsPageHeader.module.css'

const STATUS_KEYS = ['active', 'planning', 'upcoming', 'completed'] as const
const STATUS_LABELS: Record<(typeof STATUS_KEYS)[number], string> = {
  active: 'Active', planning: 'Planning', upcoming: 'Upcoming', completed: 'Completed',
}
const FILTER_PROJECTS = ['Web 3 App for Fxtrade', 'Healthydog Landing Page', 'Redesign of Website']

interface SprintsPageHeaderProps {
  view: 'list' | 'board'
  onViewChange: (view: 'list' | 'board') => void
  onApplyStatusFilters: (checked: string[] | null) => void
  onNewSprint: () => void
}

export function SprintsPageHeader({ view, onViewChange, onApplyStatusFilters, onNewSprint }: SprintsPageHeaderProps) {
  const showToast = useToastStore((s) => s.showToast)
  const [statusChecked, setStatusChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(STATUS_KEYS.map((k) => [k, true])),
  )
  // Decorative — index.html's sprint-filter-apply handler (:8402-8408) never
  // reads sf-p1/sf-p2/sf-p3, so this state never leaves the component.
  const [projectChecked, setProjectChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(FILTER_PROJECTS.map((p) => [p, true])),
  )

  const handleClear = () => {
    setStatusChecked(Object.fromEntries(STATUS_KEYS.map((k) => [k, true])))
    setProjectChecked(Object.fromEntries(FILTER_PROJECTS.map((p) => [p, true])))
    onApplyStatusFilters(null)
    showToast('Filters cleared', 'info', 1500)
  }

  const handleApply = () => {
    const checked = STATUS_KEYS.filter((k) => statusChecked[k])
    onApplyStatusFilters(checked.length === 4 ? null : checked)
    showToast('Filters applied', 'success', 1500)
  }

  return (
    <div className={styles.header}>
      <div>
        <div className={styles.breadcrumb}>Overview / Sprints</div>
        <div className={styles.heading}>Sprints</div>
      </div>
      <div className={styles.actions}>
        <div className={styles.viewToggle}>
          <button type="button" className={styles.viewBtn} data-active={view === 'list'} onClick={() => onViewChange('list')}>
            <List aria-hidden="true" /> List
          </button>
          <button type="button" className={styles.viewBtn} data-active={view === 'board'} onClick={() => onViewChange('board')}>
            <LayoutTemplate aria-hidden="true" /> Board
          </button>
        </div>

        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="secondary">
              <SlidersHorizontal aria-hidden="true" /> Filter
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Content className={styles.filterPanel}>
            <div className={styles.filterSectionTitle}>Status</div>
            {STATUS_KEYS.map((key) => (
              <label key={key} className={styles.filterCheckItem}>
                <input
                  type="checkbox"
                  checked={statusChecked[key]}
                  onChange={(e) => setStatusChecked((f) => ({ ...f, [key]: e.target.checked }))}
                />
                <span>{STATUS_LABELS[key]}</span>
              </label>
            ))}
            <Dropdown.Divider />
            <div className={styles.filterSectionTitle}>Project</div>
            {FILTER_PROJECTS.map((project) => (
              <label key={project} className={styles.filterCheckItem}>
                <input
                  type="checkbox"
                  checked={projectChecked[project]}
                  onChange={(e) => setProjectChecked((f) => ({ ...f, [project]: e.target.checked }))}
                />
                <span>{project}</span>
              </label>
            ))}
            <div className={styles.filterFooter}>
              <button type="button" className={styles.filterClear} onClick={handleClear}>Clear</button>
              <button type="button" className={styles.filterApply} onClick={handleApply}>Apply</button>
            </div>
          </Dropdown.Content>
        </Dropdown.Root>

        <Button onClick={onNewSprint}>
          <Plus aria-hidden="true" /> New Sprint
        </Button>
      </div>
    </div>
  )
}
