import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RptVelocityChart } from './RptVelocityChart'

describe('RptVelocityChart', () => {
  it('renders the title and target line label', () => {
    render(<RptVelocityChart />)
    expect(screen.getByText('Sprint Velocity')).toBeInTheDocument()
    expect(screen.getByText('Target')).toBeInTheDocument()
  })
})
