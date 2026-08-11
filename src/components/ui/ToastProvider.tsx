import * as RadixToast from '@radix-ui/react-toast'
import type { ReactNode } from 'react'
import { useToastStore } from '../../store/toastStore'
import { Toast } from './Toast'
import styles from './Toast.module.css'

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <RadixToast.Provider swipeDirection="right">
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
      <RadixToast.Viewport className={styles.viewport} />
    </RadixToast.Provider>
  )
}
