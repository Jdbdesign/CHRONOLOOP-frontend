import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RptProjectTable } from './RptProjectTable'

describe('RptProjectTable', () => {
  it('renders the table with 6 project rows', () => {
    render(<RptProjectTable />)
    expect(screen.getByText('Project Performance')).toBeInTheDocument()
    expect(screen.getByText('ChronoLoop App')).toBeInTheDocument()
    expect(screen.getByText('Eatz Landing Page')).toBeInTheDocument()
  })

  it('renders health badges', () => {
    render(<RptProjectTable />)
    expect(screen.getAllByText(/Good|At Risk|Critical/).length).toBeGreaterThanOrEqual(3)
  })
})
