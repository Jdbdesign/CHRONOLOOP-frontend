import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RptTrendChart } from './RptTrendChart'

describe('RptTrendChart', () => {
  it('renders the panel title and legend', () => {
    render(<RptTrendChart />)
    expect(screen.getByText('Task Completion Trend')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Assigned')).toBeInTheDocument()
  })

  it('renders an SVG with bars', () => {
    const { container } = render(<RptTrendChart />)
    const rects = container.querySelectorAll('rect')
    expect(rects.length).toBeGreaterThan(12) // 24 data bars + 12 hover rects
  })
})
