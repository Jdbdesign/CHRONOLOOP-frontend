import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntAppCatalogue } from './IntAppCatalogue'

describe('IntAppCatalogue', () => {
  it('renders all 12 app cards by default', () => {
    render(<IntAppCatalogue onConnect={vi.fn()} onManage={vi.fn()} />)
    expect(screen.getByText('Slack')).toBeInTheDocument()
    expect(screen.getByText('Zapier')).toBeInTheDocument()
  })

  it('filters by category when tab is clicked', async () => {
    const user = userEvent.setup()
    render(<IntAppCatalogue onConnect={vi.fn()} onManage={vi.fn()} />)
    // Click the "Analytics" tab (only Datadog has this category)
    await user.click(screen.getByRole('button', { name: 'Analytics' }))
    expect(screen.getByText('Datadog')).toBeInTheDocument()
  })

  it('filters by search', async () => {
    const user = userEvent.setup()
    render(<IntAppCatalogue onConnect={vi.fn()} onManage={vi.fn()} />)
    const input = screen.getByRole('textbox')
    await user.type(input, 'Figma')
    expect(screen.getByText('Figma')).toBeInTheDocument()
    // Non-matching apps should be gone
    expect(screen.queryByText('GitHub')).not.toBeInTheDocument()
  })
})
