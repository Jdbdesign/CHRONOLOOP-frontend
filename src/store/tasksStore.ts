import { create } from 'zustand'
import type { NewTaskInput, Task } from '../types/task'
import { MOCK_TASKS } from '../data/mockTasks'
import * as taskService from '../services/taskService'

interface TasksState {
  tasks: Task[]
  todoKpiOverride: number | null
  addTask: (input: NewTaskInput) => Promise<void>
  updateTask: (id: number, input: NewTaskInput) => Promise<void>
  removeTask: (id: number) => { task: Task; index: number } | null
  restoreTask: (task: Task, index: number) => void
  setTaskStatus: (id: number, status: 'todo' | 'done') => Promise<void>
  addSubtask: (id: number, text: string) => Promise<void>
  toggleSubtask: (id: number, index: number) => Promise<void>
  updateTaskDescription: (id: number, description: string) => Promise<void>
  addComment: (id: number, text: string) => Promise<void>
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: MOCK_TASKS,
  todoKpiOverride: null,
  addTask: async (input) => {
    const { tasks } = get()
    const newTask = await taskService.buildNewTask(tasks, input)
    const nextTasks = [...tasks, newTask]
    set({
      tasks: nextTasks,
      todoKpiOverride: nextTasks.filter((t) => t.status === 'todo').length,
    })
  },
  updateTask: async (id, input) => {
    const { tasks } = get()
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const edited = await taskService.applyTaskEdit(target, input)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? edited : task)),
    }))
  },
  // Stays synchronous — see the flagged exception in Global Constraints /
  // taskService.removeTaskAt: useDeleteWithUndo needs the removed item back
  // immediately to render the "Undo" toast.
  removeTask: (id) => {
    const { tasks } = get()
    const result = taskService.removeTaskAt(tasks, id)
    if (!result) return null
    set({ tasks: result.remaining })
    return { task: result.task, index: result.index }
  },
  restoreTask: (task, index) => {
    set((state) => ({ tasks: taskService.restoreTaskAt(state.tasks, task, index) }))
  },
  setTaskStatus: async (id, status) => {
    const { tasks } = get()
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const updated = await taskService.setTaskStatus(target, status)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }))
  },
  addSubtask: async (id, text) => {
    const { tasks } = get()
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const updated = await taskService.addSubtaskTo(target, text)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }))
  },
  toggleSubtask: async (id, index) => {
    const { tasks } = get()
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const updated = await taskService.toggleSubtaskAt(target, index)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }))
  },
  updateTaskDescription: async (id, description) => {
    const { tasks } = get()
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const updated = await taskService.setTaskDescription(target, description)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }))
  },
  addComment: async (id, text) => {
    const { tasks } = get()
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const updated = await taskService.addCommentTo(target, text)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }))
  },
}))
