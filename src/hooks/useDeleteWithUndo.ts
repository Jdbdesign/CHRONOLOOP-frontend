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
      const toastId = showActionToast(`"${truncated}" deletes in ${secondsLeft}s`, {
        label: 'Undo',
        onClick: () => {
          clearInterval(interval)
          restore(removed.task, removed.index)
          dismissToast(toastId)
        },
      })

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
