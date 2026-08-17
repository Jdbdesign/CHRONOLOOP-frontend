import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RptSprintTable } from './RptSprintTable'

describe('RptSprintTable', () => {
  it('renders the table with 6 sprint rows', () => {
    render(<RptSprintTable />)
    expect(screen.getByText('Sprint Summary')).toBeInTheDocument()
    expect(screen.getByText('Auth & Onboarding')).toBeInTheDocument()
    expect(screen.getByText('Integrations')).toBeInTheDocument()
  })

  it('shows velocity and vs-target values', () => {
    render(<RptSprintTable />)
    expect(screen.getByText('32')).toBeInTheDocument()
    expect(screen.getByText('+5')).toBeInTheDocument() // Sprint 4: 45-40=+5
  })
})
