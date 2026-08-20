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

// Helper to eliminate duplication: find task by id, await mutation, update state
async function updateTaskById(
  get: () => TasksState,
  set: (partial: Partial<TasksState> | ((state: TasksState) => Partial<TasksState>)) => void,
  id: number,
  mutate: (task: Task) => Promise<Task>,
): Promise<void> {
  const { tasks } = get()
  const target = tasks.find((task) => task.id === id)
  if (!target) return
  const updated = await mutate(target)
  set((state) => ({
    tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
  }))
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
  updateTask: (id, input) => updateTaskById(get, set, id, (task) => taskService.applyTaskEdit(task, input)),
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
  setTaskStatus: (id, status) => updateTaskById(get, set, id, (task) => taskService.setTaskStatus(task, status)),
  addSubtask: (id, text) => updateTaskById(get, set, id, (task) => taskService.addSubtaskTo(task, text)),
  toggleSubtask: (id, index) => updateTaskById(get, set, id, (task) => taskService.toggleSubtaskAt(task, index)),
  updateTaskDescription: (id, description) => updateTaskById(get, set, id, (task) => taskService.setTaskDescription(task, description)),
  addComment: (id, text) => updateTaskById(get, set, id, (task) => taskService.addCommentTo(task, text)),
}))
