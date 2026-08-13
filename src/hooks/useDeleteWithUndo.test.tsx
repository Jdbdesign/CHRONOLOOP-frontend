import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeleteWithUndo } from './useDeleteWithUndo'
import { useToastStore } from '../store/toastStore'

describe('useDeleteWithUndo', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('calls remove immediately and shows an action toast', () => {
    const remove = vi.fn().mockReturnValue({ task: { id: 1, title: 'Sample task' }, index: 0 })
    const restore = vi.fn()
    const { result } = renderHook(() => useDeleteWithUndo(remove, restore))

    act(() => result.current.deleteWithUndo(1, 'Sample task'))

    expect(remove).toHaveBeenCalledWith(1)
    const toast = useToastStore.getState().toasts.at(-1)
    expect(toast?.action?.label).toBe('Undo')
    // duration must be Infinity so Radix's own auto-close timer never fires —
    // the hook's setInterval is the sole authority on when this toast closes.
    // See Toast.tsx's `duration={toast.duration ?? 3000}` fallback: any
    // finite/undefined duration here races Radix's timer against the 5s
    // countdown text and closes the toast ~2s early.
    expect(toast?.duration).toBe(Infinity)
  })

  it('clicking Undo calls restore with the removed task and its original index, and dismisses the toast', () => {
    const removed = { task: { id: 1, title: 'Sample task' }, index: 2 }
    const remove = vi.fn().mockReturnValue(removed)
    const restore = vi.fn()
    const { result } = renderHook(() => useDeleteWithUndo(remove, restore))

    act(() => result.current.deleteWithUndo(1, 'Sample task'))
    const toastId = useToastStore.getState().toasts.at(-1)!.id
    act(() => useToastStore.getState().toasts.find((t) => t.id === toastId)?.action?.onClick())

    expect(restore).toHaveBeenCalledWith(removed.task, removed.index)
    expect(useToastStore.getState().toasts.find((t) => t.id === toastId)).toBeUndefined()
  })

  it('clicking Undo shows a "Task restored" success toast', () => {
    const removed = { task: { id: 1, title: 'Sample task' }, index: 2 }
    const remove = vi.fn().mockReturnValue(removed)
    const restore = vi.fn()
    const { result } = renderHook(() => useDeleteWithUndo(remove, restore))

    act(() => result.current.deleteWithUndo(1, 'Sample task'))
    const toastId = useToastStore.getState().toasts.at(-1)!.id
    act(() => useToastStore.getState().toasts.find((t) => t.id === toastId)?.action?.onClick())

    const restoredToast = useToastStore.getState().toasts.at(-1)
    expect(restoredToast).toMatchObject({ message: 'Task restored', variant: 'success', duration: 2000 })
  })

  it('does nothing if remove returns null (task already gone)', () => {
    const remove = vi.fn().mockReturnValue(null)
    const restore = vi.fn()
    const { result } = renderHook(() => useDeleteWithUndo(remove, restore))

    act(() => result.current.deleteWithUndo(999, 'Ghost task'))

    expect(useToastStore.getState().toasts).toHaveLength(0)
    expect(restore).not.toHaveBeenCalled()
  })
})
