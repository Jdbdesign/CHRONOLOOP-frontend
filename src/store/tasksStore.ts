import { create } from 'zustand'
import type { NewTaskInput, Task, TaskStatus } from '../types/task'
import { MOCK_TASKS } from '../data/mockTasks'

const ASSIGNEE_COLOR: Record<string, string> = {
  AS: 'linear-gradient(135deg,#4A90FF,#2563eb)',
  RD: 'linear-gradient(135deg,#FF8C42,#ea580c)',
  MV: 'linear-gradient(135deg,#A855F7,#7c3aed)',
  RC: 'linear-gradient(135deg,#00D4AA,#059669)',
}

interface TasksState {
  tasks: Task[]
  todoKpiOverride: number | null
  addTask: (input: NewTaskInput) => void
  updateTask: (id: number, input: NewTaskInput) => void
  removeTask: (id: number) => { task: Task; index: number } | null
  restoreTask: (task: Task, index: number) => void
  setTaskStatus: (id: number, status: 'todo' | 'done') => void
  addSubtask: (id: number, text: string) => void
  toggleSubtask: (id: number, index: number) => void
  updateTaskDescription: (id: number, description: string) => void
  addComment: (id: number, text: string) => void
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: MOCK_TASKS,
  todoKpiOverride: null,
  addTask: (input) => {
    const { tasks } = get()
    const newId = tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
    const newTask: Task = {
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
    }
    const nextTasks = [...tasks, newTask]
    set({
      tasks: nextTasks,
      todoKpiOverride: nextTasks.filter((t) => t.status === 'todo').length,
    })
  },
  updateTask: (id, input) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: input.title,
              project: input.project,
              assignee: input.assignee,
              aColor: ASSIGNEE_COLOR[input.assignee] ?? task.aColor,
              due: input.due,
              priority: input.priority,
              description: input.description,
            }
          : task,
      ),
    }))
  },
  removeTask: (id) => {
    const { tasks } = get()
    const index = tasks.findIndex((t) => t.id === id)
    if (index < 0) return null
    const task = tasks[index]
    set({ tasks: [...tasks.slice(0, index), ...tasks.slice(index + 1)] })
    return { task, index }
  },
  restoreTask: (task, index) => {
    set((state) => {
      const next = [...state.tasks]
      next.splice(index, 0, task)
      return { tasks: next }
    })
  },
  setTaskStatus: (id, status) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, status: status as TaskStatus } : task)),
    }))
  },
  addSubtask: (id, text) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, subtasks: [...task.subtasks, { t: text, done: false }] } : task,
      ),
    }))
  },
  toggleSubtask: (id, index) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, subtasks: task.subtasks.map((s, i) => (i === index ? { ...s, done: !s.done } : s)) }
          : task,
      ),
    }))
  },
  updateTaskDescription: (id, description) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, description } : task)),
    }))
  },
  addComment: (id, text) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, comments: [...task.comments, { author: 'You', text, time: 'Just now' }] }
          : task,
      ),
    }))
  },
}))
