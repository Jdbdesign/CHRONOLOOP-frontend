import { useState } from 'react'
import { ProjectsPageHeader } from '../components/projects/ProjectsPageHeader'
import { ProjectStatsRow } from '../components/projects/ProjectStatsRow'
import { ProjectsToolbar } from '../components/projects/ProjectsToolbar'
import { ProjectsGridView } from '../components/projects/ProjectsGridView'
import { ProjectsListView } from '../components/projects/ProjectsListView'
import { ProjectDetailPanel } from '../components/projects/ProjectDetailPanel'
import { NewProjectModal } from '../components/projects/modals/NewProjectModal'
import { useProjectsStore } from '../store/projectsStore'
import { useProjectDetailStore } from '../store/projectDetailStore'
import { useProjectModalStore } from '../store/projectModalStore'
import { useToastStore } from '../store/toastStore'
import { useInert } from '../hooks/useInert'
import styles from './ProjectsPage.module.css'

export function ProjectsPage() {
  const projects = useProjectsStore((s) => s.projects)
  const removeProject = useProjectsStore((s) => s.removeProject)
  const panelOpen = useProjectDetailStore((s) => !!s.openProjectId)
  const contentRef = useInert<HTMLDivElement>(panelOpen)
  const openDetail = useProjectDetailStore((s) => s.open)
  const openNewProject = useProjectModalStore((s) => s.open)
  const showToast = useToastStore((s) => s.showToast)

  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeSort, setActiveSort] = useState('name')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = projects
    .filter((p) => activeFilter === 'all' || p.status === activeFilter)
    .filter((p) => {
      const q = searchQuery.toLowerCase().trim()
      if (!q) return true
      return p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (activeSort === 'name') return a.name.localeCompare(b.name)
      if (activeSort === 'progress') return b.progress - a.progress
      if (activeSort === 'dueDate') return a.dueDays - b.dueDays
      if (activeSort === 'priority') {
        const order = { high: 0, medium: 1, low: 2 }
        return order[a.priority] - order[b.priority]
      }
      // 'status' falls through here, matching the original's dead sort case
      // (index.html:7547-7552) — see Global Constraints.
      return 0
    })

  const handleDelete = (id: string, name: string) => {
    removeProject(id)
    showToast(`"${name}" deleted`, 'success', 3000)
  }

  return (
    <div className={styles.page}>
      <div ref={contentRef}>
        <ProjectsPageHeader view={view} onViewChange={setView} onNewProject={openNewProject} />
        <ProjectStatsRow activeFilter={activeFilter} onFilterChange={setActiveFilter}>
          <ProjectsToolbar
            activeSort={activeSort}
            onSortChange={setActiveSort}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </ProjectStatsRow>
        <div key={`${activeFilter}|${activeSort}|${searchQuery}`}>
          {view === 'grid' ? (
            <ProjectsGridView projects={filteredProjects} onOpenDetail={openDetail} onDelete={handleDelete} />
          ) : (
            <ProjectsListView projects={filteredProjects} onOpenDetail={openDetail} />
          )}
        </div>
        <NewProjectModal />
      </div>
      <ProjectDetailPanel onDelete={handleDelete} />
    </div>
  )
}
