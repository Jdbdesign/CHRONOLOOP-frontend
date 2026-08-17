import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IntKpiGrid } from './IntKpiGrid'

describe('IntKpiGrid', () => {
  it('renders 4 KPI cards', () => {
    render(<IntKpiGrid />)
    expect(screen.getByText('Connected Apps')).toBeInTheDocument()
    expect(screen.getByText('API Calls Today')).toBeInTheDocument()
    expect(screen.getByText('Active Webhooks')).toBeInTheDocument()
    expect(screen.getByText('Sync Errors')).toBeInTheDocument()
  })
})
