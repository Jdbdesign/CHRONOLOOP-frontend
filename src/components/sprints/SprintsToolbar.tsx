import { ArrowUpDown, Search, Hash, Type, BarChart2, Zap } from 'lucide-react'
import { Button } from '../ui/Button'
import { Dropdown } from '../ui/Dropdown'
import { useToastStore } from '../../store/toastStore'
import styles from './SprintsToolbar.module.css'

const SORT_OPTIONS = [
  { key: 'number', label: 'Sprint Number', icon: <Hash aria-hidden="true" /> },
  { key: 'name', label: 'Name (A–Z)', icon: <Type aria-hidden="true" /> },
  { key: 'progress', label: 'Progress', icon: <BarChart2 aria-hidden="true" /> },
  { key: 'storyPts', label: 'Story Points', icon: <Zap aria-hidden="true" /> },
] as const

interface SprintsToolbarProps {
  activeSort: string
  onSortChange: (sort: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function SprintsToolbar({ activeSort, onSortChange, searchQuery, onSearchChange }: SprintsToolbarProps) {
  const showToast = useToastStore((s) => s.showToast)

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

      <div className={styles.searchWrap}>
        <Search className={styles.searchIcon} aria-hidden="true" />
        <input
          className={styles.searchInput}
          type="search"
          placeholder="Search sprints..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}
