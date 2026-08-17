import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReportsPageHeader } from './ReportsPageHeader'

describe('ReportsPageHeader', () => {
  it('renders breadcrumb, heading, range tabs, and action buttons', () => {
    render(<ReportsPageHeader />)
    expect(screen.getByText('Overview / Reports')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('7D')).toBeInTheDocument()
    expect(screen.getByText('30D')).toBeInTheDocument()
    expect(screen.getByText('90D')).toBeInTheDocument()
    expect(screen.getByText('12M')).toBeInTheDocument()
    expect(screen.getByText('Export')).toBeInTheDocument()
    expect(screen.getByText('Print')).toBeInTheDocument()
  })

  it('30D is active by default', () => {
    const { container } = render(<ReportsPageHeader />)
    const activeTab = container.querySelector('[class*="rangeTabActive"]')
    expect(activeTab?.textContent).toBe('30D')
  })

  it('clicking a range tab changes the active tab', async () => {
    const user = userEvent.setup()
    const { container } = render(<ReportsPageHeader />)
    await user.click(screen.getByText('90D'))
    const activeTab = container.querySelector('[class*="rangeTabActive"]')
    expect(activeTab?.textContent).toBe('90D')
  })
})
