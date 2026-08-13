import { create } from 'zustand'

export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
  action?: ToastAction
}

interface ToastState {
  toasts: ToastItem[]
  showToast: (message: string, variant?: ToastVariant, duration?: number) => string
  showActionToast: (message: string, action: ToastAction, duration?: number) => string
  updateToastMessage: (id: string, message: string) => void
  dismissToast: (id: string) => void
}

let nextId = 0

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  showToast: (message, variant = 'info', duration = 3000) => {
    const id = `toast-${nextId++}`
    set((state) => ({ toasts: [...state.toasts, { id, message, variant, duration }] }))
    return id
  },
  showActionToast: (message, action, duration) => {
    const id = `toast-${nextId++}`
    set((state) => ({ toasts: [...state.toasts, { id, message, variant: 'error', duration, action }] }))
    return id
  },
  updateToastMessage: (id, message) => {
    set((state) => ({ toasts: state.toasts.map((t) => (t.id === id ? { ...t, message } : t)) }))
  },
  dismissToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
  },
}))
