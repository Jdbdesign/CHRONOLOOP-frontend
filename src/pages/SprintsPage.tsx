import { useState } from 'react'
import { SprintsPageHeader } from '../components/sprints/SprintsPageHeader'
import { SprintKpiGrid } from '../components/sprints/SprintKpiGrid'
import { ActiveSprintBanner } from '../components/sprints/ActiveSprintBanner'
import { SprintStatsRow } from '../components/sprints/SprintStatsRow'
import { SprintsToolbar } from '../components/sprints/SprintsToolbar'
import { SprintsListView } from '../components/sprints/SprintsListView'
import { SprintsBoardView } from '../components/sprints/SprintsBoardView'
import { SprintDetailPanel } from '../components/sprints/SprintDetailPanel'
import { NewSprintModal } from '../components/sprints/modals/NewSprintModal'
import { EditSprintModal } from '../components/sprints/modals/EditSprintModal'
import { useSprintsStore } from '../store/sprintsStore'
import { useSprintDetailStore } from '../store/sprintDetailStore'
import { useSprintModalStore } from '../store/sprintModalStore'
import { useToastStore } from '../store/toastStore'
import { sprintSortComparator } from '../lib/sprintFormatters'
import styles from './SprintsPage.module.css'

export function SprintsPage() {
  const sprints = useSprintsStore((s) => s.sprints)
  const removeSprint = useSprintsStore((s) => s.removeSprint)
  const markComplete = useSprintsStore((s) => s.markComplete)
  const openDetail = useSprintDetailStore((s) => s.open)
  const openNewSprint = useSprintModalStore((s) => s.openNew)
  const openEditSprint = useSprintModalStore((s) => s.openEdit)
  const showToast = useToastStore((s) => s.showToast)

  const [view, setView] = useState<'list' | 'board'>('list')
  const [activeFilter, setActiveFilter] = useState('all')
  const [dropdownFilters, setDropdownFilters] = useState<string[] | null>(null)
  const [activeSort, setActiveSort] = useState('number')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSprints = sprints
    .filter((s) => activeFilter === 'all' || s.status === activeFilter)
    .filter((s) => (dropdownFilters ? dropdownFilters.includes(s.status) : true))
    .filter((s) => {
      const q = searchQuery.toLowerCase().trim()
      if (!q) return true
      return s.name.toLowerCase().includes(q) || s.goal.toLowerCase().includes(q) || s.project.toLowerCase().includes(q)
    })
    .sort(sprintSortComparator(activeSort))

  const handleDelete = (id: string, name: string) => {
    removeSprint(id)
    showToast(`"${name}" deleted`, 'success', 3000)
  }

  const handleMarkComplete = (id: string) => {
    markComplete(id)
    showToast('Sprint marked complete', 'success')
  }

  // Shared remount key across the banner and the results subtree, matching
  // renderSprintsPage() (index.html:7973-7999) rebuilding both on every
  // view/filter/dropdown-filter/sort/search change — see Global Constraints.
  const queryKey = `${view}|${activeFilter}|${dropdownFilters?.join(',') ?? 'none'}|${activeSort}|${searchQuery}`

  return (
    <div className={styles.page}>
      <SprintsPageHeader
        view={view}
        onViewChange={setView}
        onApplyStatusFilters={setDropdownFilters}
        onNewSprint={openNewSprint}
      />
      <SprintKpiGrid />
      <div key={`banner|${queryKey}`}>
        <ActiveSprintBanner />
      </div>
      <SprintStatsRow activeFilter={activeFilter} onFilterChange={setActiveFilter}>
        <SprintsToolbar activeSort={activeSort} onSortChange={setActiveSort} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </SprintStatsRow>
      <div key={`results|${queryKey}`}>
        {view === 'list' ? (
          <SprintsListView
            sprints={filteredSprints}
            onOpenDetail={openDetail}
            onEdit={openEditSprint}
            onMarkComplete={handleMarkComplete}
            onDelete={handleDelete}
            onNewSprint={openNewSprint}
          />
        ) : (
          <SprintsBoardView sprints={filteredSprints} onOpenDetail={openDetail} />
        )}
      </div>
      <NewSprintModal />
      <EditSprintModal />
      <SprintDetailPanel onEdit={openEditSprint} onDelete={handleDelete} />
    </div>
  )
}
