import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InviteModal } from './InviteModal'
import { useDashboardUiStore } from '../../../store/dashboardUiStore'
import { useToastStore } from '../../../store/toastStore'

describe('InviteModal', () => {
  it('submitting sends an invite toast naming the email and closes', async () => {
    useDashboardUiStore.setState({ activeModal: 'invite' })
    useToastStore.setState({ toasts: [] })
    render(<InviteModal />)
    await userEvent.type(screen.getByLabelText(/email address/i), 'newhire@example.com')
    await userEvent.click(screen.getByRole('button', { name: /send invite/i }))
    expect(useToastStore.getState().toasts.at(-1)?.message).toBe('Invitation sent to newhire@example.com')
    expect(useDashboardUiStore.getState().activeModal).toBeNull()
  })

  it('does not submit when the email is empty', async () => {
    useDashboardUiStore.setState({ activeModal: 'invite' })
    useToastStore.setState({ toasts: [] })
    render(<InviteModal />)
    await userEvent.click(screen.getByRole('button', { name: /send invite/i }))
    expect(useToastStore.getState().toasts).toHaveLength(0)
    expect(useDashboardUiStore.getState().activeModal).toBe('invite')
  })
})
