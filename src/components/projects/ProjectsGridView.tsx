import { FolderOpen, Plus } from 'lucide-react'
import { ProjectCard } from './ProjectCard'
import { Button } from '../ui/Button'
import { useProjectModalStore } from '../../store/projectModalStore'
import type { Project } from '../../types/project'
import styles from './ProjectsGridView.module.css'

interface ProjectsGridViewProps {
  projects: Project[]
  onOpenDetail: (id: string) => void
  onDelete: (id: string, name: string) => void
}

export function ProjectsGridView({ projects, onOpenDetail, onDelete }: ProjectsGridViewProps) {
  const openNewProject = useProjectModalStore((s) => s.open)

  if (projects.length === 0) {
    return (
      <div className={styles.empty}>
        <FolderOpen aria-hidden="true" width={44} height={44} />
        <div className={styles.emptyTitle}>No projects found</div>
        <div className={styles.emptySub}>Try adjusting your filter or search</div>
        <Button onClick={openNewProject} style={{ marginTop: 8 }}>
          <Plus aria-hidden="true" /> New Project
        </Button>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {projects.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} onOpenDetail={onOpenDetail} onDelete={onDelete} />
      ))}
    </div>
  )
}
