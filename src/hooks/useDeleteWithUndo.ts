import { useCallback } from 'react'
import { useToastStore } from '../store/toastStore'

export function useDeleteWithUndo<T>(
  remove: (id: number) => { task: T; index: number } | null,
  restore: (item: T, index: number) => void,
) {
  const showActionToast = useToastStore((s) => s.showActionToast)
  const updateToastMessage = useToastStore((s) => s.updateToastMessage)
  const dismissToast = useToastStore((s) => s.dismissToast)

  const deleteWithUndo = useCallback(
    (id: number, label: string) => {
      const removed = remove(id)
      if (!removed) return

      const truncated = label.length > 22 ? `${label.slice(0, 22)}…` : label
      let secondsLeft = 5
      // duration: Infinity disables Radix's own auto-close timer (its effect
      // deps are [open, duration], and it early-returns for Infinity — see
      // @radix-ui/react-toast's useTimer usage), so the setInterval below is
      // the sole authority on when this toast closes. Without this, Radix's
      // default `?? 3000` fallback in Toast.tsx would close the toast ~2s
      // before the displayed 5s countdown says it will.
      const toastId = showActionToast(
        `"${truncated}" deletes in ${secondsLeft}s`,
        {
          label: 'Undo',
          onClick: () => {
            clearInterval(interval)
            restore(removed.task, removed.index)
            dismissToast(toastId)
          },
        },
        Infinity,
      )

      const interval = setInterval(() => {
        secondsLeft -= 1
        if (secondsLeft <= 0) {
          clearInterval(interval)
          dismissToast(toastId)
          return
        }
        updateToastMessage(toastId, `"${truncated}" deletes in ${secondsLeft}s`)
      }, 1000)
    },
    [remove, restore, showActionToast, updateToastMessage, dismissToast],
  )

  return { deleteWithUndo }
}
