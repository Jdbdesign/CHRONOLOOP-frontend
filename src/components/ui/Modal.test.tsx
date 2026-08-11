import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders title, subtitle, and children when open', () => {
    render(
      <Modal open onOpenChange={() => {}} title="New task" subtitle="Add a task to this project">
        <p>Body content</p>
      </Modal>,
    )

    expect(screen.getByRole('heading', { name: 'New task' })).toBeInTheDocument()
    expect(screen.getByText('Add a task to this project')).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('does not render its content when closed', () => {
    render(
      <Modal open={false} onOpenChange={() => {}} title="New task">
        <p>Body content</p>
      </Modal>,
    )

    expect(screen.queryByText('Body content')).not.toBeInTheDocument()
  })

  it('calls onOpenChange(false) when the close button is clicked', async () => {
    const onOpenChange = vi.fn()
    render(
      <Modal open onOpenChange={onOpenChange} title="New task">
        <p>Body content</p>
      </Modal>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renders the footer when provided', () => {
    render(
      <Modal open onOpenChange={() => {}} title="New task" footer={<button>Save</button>}>
        <p>Body content</p>
      </Modal>,
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})
