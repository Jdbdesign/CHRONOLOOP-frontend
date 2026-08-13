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

  it('adds a toast with the warning variant', () => {
    useToastStore.getState().showToast('Heads up', 'warning')
    const [toast] = useToastStore.getState().toasts
    expect(toast.variant).toBe('warning')
  })

  it('defaults duration to 3000ms when not provided', () => {
    useToastStore.getState().showToast('Task saved')
    const [toast] = useToastStore.getState().toasts
    expect(toast.duration).toBe(3000)
  })

  it('accepts an explicit duration', () => {
    useToastStore.getState().showToast('Task saved', 'success', 6000)
    const [toast] = useToastStore.getState().toasts
    expect(toast.duration).toBe(6000)
  })

  it('removes a toast via dismissToast', () => {
    useToastStore.getState().showToast('Task saved')
    const [toast] = useToastStore.getState().toasts
    useToastStore.getState().dismissToast(toast.id)
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })
})

describe('toastStore — action toasts', () => {
  it('showActionToast adds a toast carrying an action and returns its id', () => {
    const onClick = () => {}
    const id = useToastStore.getState().showActionToast('Deleting…', { label: 'Undo', onClick })
    const toast = useToastStore.getState().toasts.find((t) => t.id === id)
    expect(toast?.message).toBe('Deleting…')
    expect(toast?.action?.label).toBe('Undo')
  })
})
