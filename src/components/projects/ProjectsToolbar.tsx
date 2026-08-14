import { useState } from 'react'
import { ArrowUpDown, SlidersHorizontal, Search, Type, Calendar, BarChart2, Flag, Circle } from 'lucide-react'
import * as RadixDropdown from '@radix-ui/react-dropdown-menu'
import { Button } from '../ui/Button'
import { Dropdown } from '../ui/Dropdown'
import { useToastStore } from '../../store/toastStore'
import styles from './ProjectsToolbar.module.css'

const SORT_OPTIONS = [
  { key: 'name', label: 'Name (A–Z)', icon: <Type aria-hidden="true" /> },
  { key: 'dueDate', label: 'Due Date', icon: <Calendar aria-hidden="true" /> },
  { key: 'progress', label: 'Progress', icon: <BarChart2 aria-hidden="true" /> },
  { key: 'priority', label: 'Priority', icon: <Flag aria-hidden="true" /> },
  // Preserved for visual parity only — renderProjectsPage()'s sort switch
  // (index.html:7547-7552) has no 'status' case, so selecting this in the
  // shipped app silently no-ops. Do not wire real status-sort logic to it.
  { key: 'status', label: 'Status', icon: <Circle aria-hidden="true" /> },
] as const

const PRIORITY_KEYS = ['high', 'medium', 'low'] as const
const CATEGORY_KEYS = ['Development', 'Design', 'Marketing'] as const

interface ProjectsToolbarProps {
  activeSort: string
  onSortChange: (sort: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function ProjectsToolbar({ activeSort, onSortChange, searchQuery, onSearchChange }: ProjectsToolbarProps) {
  const showToast = useToastStore((s) => s.showToast)
  const [priorityChecked, setPriorityChecked] = useState<Record<string, boolean>>({ high: true, medium: true, low: true })
  const [categoryChecked, setCategoryChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(CATEGORY_KEYS.map((k) => [k, true])),
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
          <div className={styles.filterSectionTitle}>Category</div>
          {CATEGORY_KEYS.map((key) => (
            <label key={key} className={styles.filterCheckItem}>
              <input
                type="checkbox"
                checked={categoryChecked[key]}
                onChange={(e) => setCategoryChecked((f) => ({ ...f, [key]: e.target.checked }))}
              />
              <span>{key}</span>
            </label>
          ))}
          <div className={styles.filterFooter}>
            <RadixDropdown.Item
              className={styles.filterClear}
              onSelect={() => {
                setPriorityChecked({ high: false, medium: false, low: false })
                setCategoryChecked(Object.fromEntries(CATEGORY_KEYS.map((k) => [k, false])))
                showToast('Filters cleared', 'info', 1500)
              }}
            >
              Clear
            </RadixDropdown.Item>
            <RadixDropdown.Item
              className={styles.filterApply}
              onSelect={() => showToast('Filters applied', 'success', 1500)}
            >
              Apply
            </RadixDropdown.Item>
          </div>
        </Dropdown.Content>
      </Dropdown.Root>

      <div className={styles.searchWrap}>
        <Search className={styles.searchIcon} aria-hidden="true" />
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
