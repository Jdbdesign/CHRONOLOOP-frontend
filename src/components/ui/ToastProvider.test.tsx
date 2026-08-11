import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
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
})
