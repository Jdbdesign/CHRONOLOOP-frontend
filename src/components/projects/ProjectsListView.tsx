import { ChevronsUpDown } from 'lucide-react'
import { ProjectListRow } from './ProjectListRow'
import type { Project } from '../../types/project'
import styles from './ProjectsListView.module.css'

interface ProjectsListViewProps {
  projects: Project[]
  onOpenDetail: (id: string) => void
}

export function ProjectsListView({ projects, onOpenDetail }: ProjectsListViewProps) {
  if (projects.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyTitle}>No projects found</div>
        <div className={styles.emptySub}>Try adjusting your filter</div>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      <div className={styles.head}>
        <div className={styles.col}>Project <ChevronsUpDown aria-hidden="true" /></div>
        <div className={styles.col}>Client</div>
        <div className={styles.col}>Status</div>
        <div className={styles.col}>Priority</div>
        <div className={styles.col}>Progress</div>
        <div className={styles.col}>Due Date</div>
        <div className={styles.col}>Team</div>
      </div>
      {projects.map((project) => (
        <ProjectListRow key={project.id} project={project} onOpenDetail={onOpenDetail} />
      ))}
    </div>
  )
}
