export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'overdue'

export interface TaskSubtask {
  t: string
  done: boolean
}

export interface TaskComment {
  author: string
  text: string
  time: string
}

export interface TaskAttachment {
  name: string
  size: string
  type: string
}

export interface Task {
  id: number
  title: string
  project: string
  assignee: string
  aColor: string
  priority: TaskPriority
  status: TaskStatus
  due: string
  tags: string[]
  subtasks: TaskSubtask[]
  comments: TaskComment[]
  attachments: TaskAttachment[]
  description: string
}

export interface NewTaskInput {
  title: string
  project: string
  assignee: string
  due: string
  priority: TaskPriority
  description: string
}
