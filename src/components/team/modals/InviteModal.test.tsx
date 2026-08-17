import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InviteModal } from './InviteModal'

describe('InviteModal', () => {
  it('renders nothing when closed', () => {
    render(<InviteModal open={false} onClose={vi.fn()} />)
    expect(screen.queryByText('Invite Teammates')).not.toBeInTheDocument()
  })

  it('renders title and form when open', () => {
    render(<InviteModal open={true} onClose={vi.fn()} />)
    expect(screen.getByText('Invite Teammates')).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Role/)).toBeInTheDocument()
  })

  it('does not submit when email is empty', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<InviteModal open={true} onClose={onClose} />)
    await user.click(screen.getByText('Send Invite').closest('button')!)
    expect(onClose).not.toHaveBeenCalled()
  })
})
