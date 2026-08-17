import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntPageHeader } from './IntPageHeader'

describe('IntPageHeader', () => {
  it('renders breadcrumb, heading, and buttons', () => {
    render(<IntPageHeader onNewKey={vi.fn()} />)
    expect(screen.getByText('Overview / Integrations')).toBeInTheDocument()
    expect(screen.getByText('Integrations')).toBeInTheDocument()
    expect(screen.getByText('API Docs')).toBeInTheDocument()
    expect(screen.getByText('New API Key')).toBeInTheDocument()
  })

  it('calls onNewKey when New API Key is clicked', async () => {
    const user = userEvent.setup()
    const onNewKey = vi.fn()
    render(<IntPageHeader onNewKey={onNewKey} />)
    await user.click(screen.getByText('New API Key').closest('button')!)
    expect(onNewKey).toHaveBeenCalled()
  })
})
