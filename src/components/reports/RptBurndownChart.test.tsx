import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RptBurndownChart } from './RptBurndownChart'

describe('RptBurndownChart', () => {
  it('renders the panel title and legend', () => {
    render(<RptBurndownChart />)
    expect(screen.getByText(/Sprint Burndown/)).toBeInTheDocument()
    expect(screen.getByText('Ideal')).toBeInTheDocument()
    expect(screen.getByText('Actual')).toBeInTheDocument()
  })

  it('renders 14 data point dots', () => {
    const { container } = render(<RptBurndownChart />)
    // 14 visible dots + 14 hover dots = 28 circles total
    const circles = container.querySelectorAll('circle')
    expect(circles).toHaveLength(28)
  })
})
