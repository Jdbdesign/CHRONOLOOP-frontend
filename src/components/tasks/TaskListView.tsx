import type { Task, TaskStatus } from '../../types/task'
import { TaskGroup } from './TaskGroup'

const GROUP_DISPLAY_ORDER: TaskStatus[] = ['overdue', 'in-progress', 'todo', 'done']

interface TaskListViewProps {
  tasks: Task[]
  onOpenDetail: (id: number) => void
  onDelete: (id: number, title: string) => void
}

export function TaskListView({ tasks, onOpenDetail, onDelete }: TaskListViewProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {GROUP_DISPLAY_ORDER.map((status) => (
        <TaskGroup
          key={status}
          status={status}
          tasks={tasks.filter((t) => t.status === status)}
          onOpenDetail={onOpenDetail}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
