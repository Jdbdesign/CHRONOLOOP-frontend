import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ReportsKpiGrid } from './ReportsKpiGrid'

describe('ReportsKpiGrid', () => {
  it('renders all 5 KPI cards', () => {
    render(<ReportsKpiGrid />)
    expect(screen.getByText('Tasks Completed')).toBeInTheDocument()
    expect(screen.getByText('Completion Rate')).toBeInTheDocument()
    expect(screen.getByText('Sprint Velocity')).toBeInTheDocument()
    expect(screen.getByText('On-Time Delivery')).toBeInTheDocument()
    expect(screen.getByText('Active Projects')).toBeInTheDocument()
  })

  it('shows values from RPT_DATA', () => {
    render(<ReportsKpiGrid />)
    expect(screen.getByText('127')).toBeInTheDocument()
    expect(screen.getByText('84%')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
