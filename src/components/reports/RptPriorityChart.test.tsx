import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RptPriorityChart } from './RptPriorityChart'

describe('RptPriorityChart', () => {
  it('renders all 4 priority levels', () => {
    render(<RptPriorityChart />)
    expect(screen.getByText('Critical')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Low')).toBeInTheDocument()
  })

  it('renders counts', () => {
    render(<RptPriorityChart />)
    expect(screen.getByText('52')).toBeInTheDocument() // Medium count
  })
})
