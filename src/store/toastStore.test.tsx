import { describe, it, expect, beforeEach } from 'vitest'
import { useToastStore } from './toastStore'

describe('toastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('starts with no toasts', () => {
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('adds a toast via showToast, defaulting to the info variant', () => {
    useToastStore.getState().showToast('Task saved')
    const [toast] = useToastStore.getState().toasts
    expect(toast.message).toBe('Task saved')
    expect(toast.variant).toBe('info')
  })

  it('adds a toast with an explicit variant', () => {
    useToastStore.getState().showToast('Something failed', 'error')
    const [toast] = useToastStore.getState().toasts
    expect(toast.variant).toBe('error')
  })

  it('removes a toast via dismissToast', () => {
    useToastStore.getState().showToast('Task saved')
    const [toast] = useToastStore.getState().toasts
    useToastStore.getState().dismissToast(toast.id)
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })
})
