import * as RadixToast from '@radix-ui/react-toast'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'
import { useToastStore, type ToastItem } from '../../store/toastStore'
import styles from './Toast.module.css'

const ICONS = { success: CheckCircle, error: XCircle, info: Info, warning: AlertTriangle }
const VARIANT_CLASS = { success: styles.success, error: styles.error, info: styles.info, warning: '' }

interface ToastProps {
  toast: ToastItem
}

export function Toast({ toast }: ToastProps) {
  const dismissToast = useToastStore((state) => state.dismissToast)
  const Icon = ICONS[toast.variant]

  return (
    <RadixToast.Root
      className={`${styles.toast} ${VARIANT_CLASS[toast.variant]}`}
      data-variant={toast.variant}
      duration={toast.duration ?? 3000}
      onOpenChange={(open) => {
        if (!open) dismissToast(toast.id)
      }}
    >
      <Icon aria-hidden="true" />
      <RadixToast.Description className={styles.text}>{toast.message}</RadixToast.Description>
      {toast.action ? (
        <button type="button" className={styles.actionBtn} onClick={toast.action.onClick}>
          {toast.action.label}
        </button>
      ) : null}
    </RadixToast.Root>
  )
}
