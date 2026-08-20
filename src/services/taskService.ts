import type { NewTaskInput, Task, TaskStatus } from '../types/task'

const ASSIGNEE_COLOR: Record<string, string> = {
  AS: 'linear-gradient(135deg,#4A90FF,#2563eb)',
  RD: 'linear-gradient(135deg,#FF8C42,#ea580c)',
  MV: 'linear-gradient(135deg,#A855F7,#7c3aed)',
  RC: 'linear-gradient(135deg,#00D4AA,#059669)',
}

export function buildNewTask(existingTasks: Task[], input: NewTaskInput): Promise<Task> {
  const newId = existingTasks.length > 0 ? Math.max(...existingTasks.map((t) => t.id)) + 1 : 1
  return Promise.resolve({
    id: newId,
    title: input.title,
    project: input.project,
    assignee: input.assignee,
    aColor: ASSIGNEE_COLOR[input.assignee] ?? 'linear-gradient(135deg,#4A90FF,#2563eb)',
    priority: input.priority,
    status: 'todo',
    due: input.due,
    tags: [],
    subtasks: [],
    comments: [],
    attachments: [],
    description: input.description,
  })
}

export function applyTaskEdit(task: Task, input: NewTaskInput): Promise<Task> {
  return Promise.resolve({
    ...task,
    title: input.title,
    project: input.project,
    assignee: input.assignee,
    aColor: ASSIGNEE_COLOR[input.assignee] ?? task.aColor,
    due: input.due,
    priority: input.priority,
    description: input.description,
  })
}

export function setTaskStatus(task: Task, status: 'todo' | 'done'): Promise<Task> {
  return Promise.resolve({ ...task, status: status as TaskStatus })
}

export function addSubtaskTo(task: Task, text: string): Promise<Task> {
  return Promise.resolve({ ...task, subtasks: [...task.subtasks, { t: text, done: false }] })
}

export function toggleSubtaskAt(task: Task, index: number): Promise<Task> {
  return Promise.resolve({
    ...task,
    subtasks: task.subtasks.map((s, i) => (i === index ? { ...s, done: !s.done } : s)),
  })
}

export function setTaskDescription(task: Task, description: string): Promise<Task> {
  return Promise.resolve({ ...task, description })
}

export function addCommentTo(task: Task, text: string): Promise<Task> {
  return Promise.resolve({
    ...task,
    comments: [...task.comments, { author: 'You', text, time: 'Just now' }],
  })
}

// Stays synchronous — see the flagged exception in Global Constraints:
// useDeleteWithUndo needs { task, index } back immediately to render the
// "Undo" toast, so wrapping this in a Promise is deferred to F1.
export function removeTaskAt(
  tasks: Task[],
  id: number,
): { task: Task; index: number; remaining: Task[] } | null {
  const index = tasks.findIndex((t) => t.id === id)
  if (index < 0) return null
  const task = tasks[index]
  return { task, index, remaining: [...tasks.slice(0, index), ...tasks.slice(index + 1)] }
}

export function restoreTaskAt(tasks: Task[], task: Task, index: number): Task[] {
  const next = [...tasks]
  next.splice(index, 0, task)
  return next
}
