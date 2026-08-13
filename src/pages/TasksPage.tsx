import { useState } from 'react'
import { TasksPageHeader } from '../components/tasks/TasksPageHeader'
import { TaskStatsRow } from '../components/tasks/TaskStatsRow'
import { TasksToolbar } from '../components/tasks/TasksToolbar'
import { TaskListView } from '../components/tasks/TaskListView'
import { TaskBoardView } from '../components/tasks/TaskBoardView'
import { AddTaskModal } from '../components/tasks/modals/AddTaskModal'
import { useTasksStore } from '../store/tasksStore'
import { useDeleteWithUndo } from '../hooks/useDeleteWithUndo'
import { useToastStore } from '../store/toastStore'
import { PRIORITY_ORDER } from '../lib/taskFormatters'
import styles from './TasksPage.module.css'

export function TasksPage() {
  const tasks = useTasksStore((s) => s.tasks)
  const removeTask = useTasksStore((s) => s.removeTask)
  const restoreTask = useTasksStore((s) => s.restoreTask)
  const showToast = useToastStore((s) => s.showToast)
  const { deleteWithUndo } = useDeleteWithUndo(removeTask, restoreTask)

  const [view, setView] = useState<'list' | 'board'>('list')
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeSort, setActiveSort] = useState('due')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = tasks
    .filter((t) => activeFilter === 'all' || t.status === activeFilter)
    .filter((t) => {
      const q = searchQuery.toLowerCase().trim()
      if (!q) return true
      return (
        t.title.toLowerCase().includes(q) ||
        t.project.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    })
    .sort((a, b) => {
      if (activeSort === 'priority') return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      if (activeSort === 'name') return a.title.localeCompare(b.title)
      if (activeSort === 'project') return a.project.localeCompare(b.project)
      if (activeSort === 'assignee') return a.assignee.localeCompare(b.assignee)
      return new Date(a.due).getTime() - new Date(b.due).getTime()
    })

  const handleOpenDetail = () => {
    showToast('Task detail coming soon', 'info', 1500)
  }

  const handleDelete = (id: number, title: string) => {
    deleteWithUndo(id, title)
  }

  return (
    <div className={styles.page}>
      <TasksPageHeader view={view} onViewChange={setView} />
      <TaskStatsRow activeFilter={activeFilter} onFilterChange={setActiveFilter} />
      <TasksToolbar
        activeSort={activeSort}
        onSortChange={setActiveSort}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {view === 'list' ? (
        <TaskListView tasks={filteredTasks} onOpenDetail={handleOpenDetail} onDelete={handleDelete} />
      ) : (
        <TaskBoardView tasks={filteredTasks} onOpenDetail={handleOpenDetail} />
      )}
      <AddTaskModal />
    </div>
  )
}
