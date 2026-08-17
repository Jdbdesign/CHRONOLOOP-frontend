import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RptDonutChart } from './RptDonutChart'

describe('RptDonutChart', () => {
  it('renders the title and total count', () => {
    render(<RptDonutChart />)
    expect(screen.getByText('Project Status')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument() // total projects
  })

  it('renders legend items with percentages', () => {
    render(<RptDonutChart />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    // 4/10 = 40% for both Completed and In Progress
    expect(screen.getAllByText('40%')).toHaveLength(2)
  })
})
