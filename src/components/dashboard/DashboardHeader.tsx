// src/components/dashboard/DashboardHeader.tsx
import { useState } from 'react'
import { Plus, PlusCircle, Briefcase, Zap, ChevronDown, Calendar, SlidersHorizontal, Upload } from 'lucide-react'
import { Button } from '../ui/Button'
import { Dropdown } from '../ui/Dropdown'
import { useTaskModalStore } from '../../store/taskModalStore'
import { useToastStore } from '../../store/toastStore'
import styles from './DashboardHeader.module.css'

const YEARS = ['2022', '2023', '2024', '2025']

const FILTER_DEFAULTS = {
  todo: true,
  progress: true,
  done: true,
  overdue: false,
  high: true,
  medium: true,
  low: false,
}

export function DashboardHeader() {
  const openCreateTask = useTaskModalStore((s) => s.openCreate)
  const showToast = useToastStore((s) => s.showToast)
  const [year, setYear] = useState('2024')
  const [filters, setFilters] = useState(FILTER_DEFAULTS)
  const [filterOpen, setFilterOpen] = useState(false)

  const handleAddTaskCaret = (action: 'task' | 'project' | 'sprint' | 'import') => {
    if (action === 'task') openCreateTask()
    else if (action === 'project') showToast('New Project form coming soon', 'info')
    else if (action === 'sprint') showToast('New Sprint form coming soon', 'info')
    else showToast('Import dialog opening...', 'info')
  }

  const handleExport = () => {
    showToast('Preparing export...', 'info', 1500)
    setTimeout(() => {
      const csv = 'Task,Project,Assignee,Due\nHomepage CareyCare,ChronoLoop,Aspen H.,Nov 2\nLanding Page Eatz,Web 3 App,Marley V.,Nov 7\n'
      const blob = new Blob([csv], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'chronoloop-export.csv'
      link.click()
      showToast('Data exported successfully!', 'success')
    }, 1600)
  }

  return (
    <div className={styles.row}>
      <div className={styles.greeting}>
        <div className={styles.hello}>Hello Jacobs,</div>
        <div className={styles.welcome}>Welcome Back,</div>
      </div>

      <div className={styles.actionBar}>
        <div className={styles.split}>
          <button type="button" className={styles.splitMain} onClick={openCreateTask}>
            <Plus aria-hidden="true" /> Add Task
          </button>
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <button type="button" className={styles.splitCaret} aria-label="More options">
                <ChevronDown aria-hidden="true" />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <Dropdown.Item icon={<PlusCircle aria-hidden="true" />} onSelect={() => handleAddTaskCaret('task')}>New Task</Dropdown.Item>
              <Dropdown.Item icon={<Briefcase aria-hidden="true" />} onSelect={() => handleAddTaskCaret('project')}>New Project</Dropdown.Item>
              <Dropdown.Item icon={<Zap aria-hidden="true" />} onSelect={() => handleAddTaskCaret('sprint')}>New Sprint</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item icon={<Upload aria-hidden="true" />} onSelect={() => handleAddTaskCaret('import')}>Import Tasks</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        </div>

        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="secondary">
              <Calendar aria-hidden="true" /> {year} <ChevronDown aria-hidden="true" />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            {YEARS.map((y) => (
              <Dropdown.Item key={y} active={y === year} onSelect={() => { setYear(y); showToast(`Showing data for ${y}`, 'info', 2000) }}>
                {y}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>

        <Dropdown.Root open={filterOpen} onOpenChange={setFilterOpen}>
          <Dropdown.Trigger asChild>
            <Button variant="secondary">
              <SlidersHorizontal aria-hidden="true" /> Filter
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Content className={styles.filterPanel}>
            <div className={styles.filterSectionTitle}>Status</div>
            {(['todo', 'progress', 'done', 'overdue'] as const).map((key) => (
              <label key={key} className={styles.filterCheckItem}>
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.checked }))}
                />
                <span>{key === 'todo' ? 'To-do' : key === 'progress' ? 'In Progress' : key === 'done' ? 'Completed' : 'Overdue'}</span>
              </label>
            ))}
            <Dropdown.Divider />
            <div className={styles.filterSectionTitle}>Priority</div>
            {(['high', 'medium', 'low'] as const).map((key) => (
              <label key={key} className={styles.filterCheckItem}>
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.checked }))}
                />
                <span>{key[0].toUpperCase() + key.slice(1)}</span>
              </label>
            ))}
            <div className={styles.filterFooter}>
              <button type="button" className={styles.filterClear} onClick={() => { setFilters({ todo: false, progress: false, done: false, overdue: false, high: false, medium: false, low: false }); showToast('Filters cleared', 'info', 2000); setFilterOpen(false) }}>
                Clear all
              </button>
              <button type="button" className={styles.filterApply} onClick={() => { showToast('Filters applied', 'success', 2000); setFilterOpen(false) }}>
                Apply
              </button>
            </div>
          </Dropdown.Content>
        </Dropdown.Root>

        <Button variant="secondary" onClick={handleExport}>
          <Upload aria-hidden="true" /> Export Data
        </Button>
      </div>
    </div>
  )
}
