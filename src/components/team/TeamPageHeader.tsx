import { Search, SlidersHorizontal, ArrowUpDown, UserPlus, Type, TrendingUp, ClipboardList, Zap } from 'lucide-react'
import { Button } from '../ui/Button'
import { Dropdown } from '../ui/Dropdown'
import { useToastStore } from '../../store/toastStore'
import styles from './TeamPageHeader.module.css'

interface Props {
  searchQuery: string
  onSearchChange: (q: string) => void
  sortMode: string
  onSortChange: (mode: string) => void
  onInvite: () => void
}

const SORT_OPTIONS = [
  { id: 'name', label: 'Name (A\u2013Z)', icon: <Type size={13} /> },
  { id: 'completion', label: 'Completion Rate', icon: <TrendingUp size={13} /> },
  { id: 'tasks', label: 'Active Tasks', icon: <ClipboardList size={13} /> },
  { id: 'velocity', label: 'Velocity', icon: <Zap size={13} /> },
]

export function TeamPageHeader({ searchQuery, onSearchChange, sortMode, onSortChange, onInvite }: Props) {
  const showToast = useToastStore((s) => s.showToast)

  return (
    <div className={styles.header}>
      <div>
        <div className={styles.breadcrumb}>Overview / Team</div>
        <div className={styles.heading}>Team</div>
      </div>
      <div className={styles.actions}>
        <div className={styles.searchWrap}>
          <Search className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="secondary">
              <SlidersHorizontal size={13} /> Filter
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item onSelect={() => showToast('Team filters cleared', 'info', 2000)}>
              Clear
            </Dropdown.Item>
            <Dropdown.Item onSelect={() => showToast('Filters applied', 'success', 2000)}>
              Apply
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>

        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button variant="secondary">
              <ArrowUpDown size={13} /> Sort
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            {SORT_OPTIONS.map((opt) => (
              <Dropdown.Item
                key={opt.id}
                icon={opt.icon}
                active={sortMode === opt.id}
                onSelect={() => onSortChange(opt.id)}
              >
                {opt.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>

        <Button variant="primary" onClick={onInvite}>
          <UserPlus size={13} /> Add Member
        </Button>
      </div>
    </div>
  )
}
