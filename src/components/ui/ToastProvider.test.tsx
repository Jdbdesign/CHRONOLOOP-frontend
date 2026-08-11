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
