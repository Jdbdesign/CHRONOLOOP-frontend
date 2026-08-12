import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ActivityModal } from './ActivityModal'
import { useDashboardUiStore } from '../../../store/dashboardUiStore'
import { useToastStore } from '../../../store/toastStore'

describe('ActivityModal', () => {
  it('lists the five original activity entries when open', () => {
    useDashboardUiStore.setState({ activeModal: 'activity' })
    render(<ActivityModal />)
    expect(screen.getByText(/completed/i)).toBeInTheDocument()
    expect(screen.getByText(/moved/i)).toBeInTheDocument()
    expect(screen.getByText('Yesterday')).toBeInTheDocument()
  })

  it('Export Log closes the modal and shows a success toast', async () => {
    useDashboardUiStore.setState({ activeModal: 'activity' })
    useToastStore.setState({ toasts: [] })
    render(<ActivityModal />)
    await userEvent.click(screen.getByRole('button', { name: /export log/i }))
    expect(useDashboardUiStore.getState().activeModal).toBeNull()
    expect(useToastStore.getState().toasts.at(-1)?.message).toBe('Full activity log downloaded')
  })
})
