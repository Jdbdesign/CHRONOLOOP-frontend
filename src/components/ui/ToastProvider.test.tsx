import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider } from './ToastProvider'
import { useToastStore } from '../../store/toastStore'

describe('ToastProvider', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('renders its children', () => {
    render(
      <ToastProvider>
        <div>App content</div>
      </ToastProvider>,
    )
    expect(screen.getByText('App content')).toBeInTheDocument()
  })

  it('renders a toast when showToast is called', async () => {
    render(
      <ToastProvider>
        <div>App content</div>
      </ToastProvider>,
    )

    act(() => {
      useToastStore.getState().showToast('Task saved', 'success')
    })

    expect(await screen.findByText('Task saved')).toBeInTheDocument()
  })

  it('renders a warning toast', async () => {
    render(
      <ToastProvider>
        <div>App content</div>
      </ToastProvider>,
    )

    act(() => {
      useToastStore.getState().showToast('Check your input', 'warning')
    })

    const toast = await screen.findByText('Check your input')
    expect(toast).toBeInTheDocument()
    expect(toast.closest('[data-variant]')).toHaveAttribute('data-variant', 'warning')
  })

  it('honors a custom duration passed to showToast', () => {
    render(
      <ToastProvider>
        <div>App content</div>
      </ToastProvider>,
    )

    act(() => {
      useToastStore.getState().showToast('Task saved', 'success', 8000)
    })

    expect(useToastStore.getState().toasts[0].duration).toBe(8000)
  })

  it('removes the toast from the store when dismissed', () => {
    render(
      <ToastProvider>
        <div>App content</div>
      </ToastProvider>,
    )

    act(() => {
      useToastStore.getState().showToast('Task saved', 'success')
    })
    const toastId = useToastStore.getState().toasts[0].id

    act(() => {
      useToastStore.getState().dismissToast(toastId)
    })

    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('renders an action button and calls its onClick handler when a toast carries an action', async () => {
    const onClick = vi.fn()
    render(<ToastProvider>{null}</ToastProvider>)
    act(() => {
      useToastStore.getState().showActionToast('Task deleted', { label: 'Undo', onClick })
    })
    const undoBtn = await screen.findByRole('button', { name: 'Undo' })
    await userEvent.click(undoBtn)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('an action toast with duration Infinity survives past Radix\'s default 3s auto-close', () => {
    vi.useFakeTimers()
    try {
      render(<ToastProvider>{null}</ToastProvider>)
      act(() => {
        useToastStore.getState().showActionToast('Task deleted', { label: 'Undo', onClick: vi.fn() }, Infinity)
      })
      expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()

      act(() => {
        vi.advanceTimersByTime(3500)
      })

      // Radix's own Toast.Root auto-close timer defaults to 3000ms whenever
      // `duration` is finite/undefined. Passing Infinity must disable that
      // timer entirely, so the toast (and its Undo button) is still present
      // well past 3s — it's the hook's own countdown, not Radix, that
      // eventually closes it.
      expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})
