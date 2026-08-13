// src/components/tasks/TasksToolbar.tsx
import { useState } from 'react'
import { ArrowUpDown, SlidersHorizontal, Search, Calendar, Flag, Type, Briefcase, User } from 'lucide-react'
import { Button } from '../ui/Button'
import { Dropdown } from '../ui/Dropdown'
import { useToastStore } from '../../store/toastStore'
import styles from './TasksToolbar.module.css'

const SORT_OPTIONS = [
  { key: 'due', label: 'Due Date', icon: <Calendar aria-hidden="true" /> },
  { key: 'priority', label: 'Priority', icon: <Flag aria-hidden="true" /> },
  { key: 'name', label: 'Name (A–Z)', icon: <Type aria-hidden="true" /> },
  { key: 'project', label: 'Project', icon: <Briefcase aria-hidden="true" /> },
  { key: 'assignee', label: 'Assignee', icon: <User aria-hidden="true" /> },
] as const

const PRIORITY_KEYS = ['high', 'medium', 'low'] as const
const PROJECT_NAMES = ['Web 3 App for Fxtrade', 'Healthydog Landing Page', 'Redesign of Website', 'ChronoLoop Launch']

interface TasksToolbarProps {
  activeSort: string
  onSortChange: (sort: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function TasksToolbar({ activeSort, onSortChange, searchQuery, onSearchChange }: TasksToolbarProps) {
  const showToast = useToastStore((s) => s.showToast)
  const [priorityChecked, setPriorityChecked] = useState<Record<string, boolean>>({ high: true, medium: true, low: true })
  const [projectChecked, setProjectChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(PROJECT_NAMES.map((name) => [name, true])),
  )

  return (
    <div className={styles.toolbar}>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button variant="secondary">
            <ArrowUpDown aria-hidden="true" /> Sort
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          {SORT_OPTIONS.map(({ key, label, icon }) => (
            <Dropdown.Item
              key={key}
              icon={icon}
              active={activeSort === key}
              onSelect={() => { onSortChange(key); showToast(`Sorted by ${label}`, 'info', 1500) }}
            >
              {label}
            </Dropdown.Item>
          ))}
        </Dropdown.Content>
      </Dropdown.Root>

      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button variant="secondary">
            <SlidersHorizontal aria-hidden="true" /> Filter
          </Button>
        </Dropdown.Trigger>
        <Dropdown.Content className={styles.filterPanel}>
          <div className={styles.filterSectionTitle}>Priority</div>
          {PRIORITY_KEYS.map((key) => (
            <label key={key} className={styles.filterCheckItem}>
              <input
                type="checkbox"
                checked={priorityChecked[key]}
                onChange={(e) => setPriorityChecked((f) => ({ ...f, [key]: e.target.checked }))}
              />
              <span>{key[0].toUpperCase() + key.slice(1)}</span>
            </label>
          ))}
          <Dropdown.Divider />
          <div className={styles.filterSectionTitle}>Project</div>
          {PROJECT_NAMES.map((name) => (
            <label key={name} className={styles.filterCheckItem}>
              <input
                type="checkbox"
                checked={projectChecked[name]}
                onChange={(e) => setProjectChecked((f) => ({ ...f, [name]: e.target.checked }))}
              />
              <span>{name}</span>
            </label>
          ))}
          <div className={styles.filterFooter}>
            <button
              type="button"
              className={styles.filterClear}
              onClick={() => {
                setPriorityChecked({ high: false, medium: false, low: false })
                setProjectChecked(Object.fromEntries(PROJECT_NAMES.map((name) => [name, false])))
                showToast('Task filters cleared', 'info', 1500)
              }}
            >
              Clear
            </button>
            <button type="button" className={styles.filterApply} onClick={() => showToast('Filters applied', 'success', 1500)}>
              Apply
            </button>
          </div>
        </Dropdown.Content>
      </Dropdown.Root>

      <div className={styles.searchWrap}>
        <Search className={styles.searchIcon} aria-hidden="true" />
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
