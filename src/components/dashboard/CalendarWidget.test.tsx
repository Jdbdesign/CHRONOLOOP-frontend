// src/components/dashboard/CalendarWidget.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalendarWidget } from './CalendarWidget'

describe('CalendarWidget', () => {
  it('renders the 19-day header row and all five task pills', () => {
    render(<CalendarWidget />)
    expect(screen.getByText('NOVEMBER 2024')).toBeInTheDocument()
    expect(screen.getAllByText('Fri')).toHaveLength(3)
    expect(screen.getByText('Homepage for CareyCare App')).toBeInTheDocument()
    expect(screen.getByText('Finalize User Onboarding Flow')).toBeInTheDocument()
  })

  it('clicking a task pill opens its detail popup', async () => {
    render(<CalendarWidget />)
    await userEvent.click(screen.getByText('Homepage for CareyCare App'))
    expect(screen.getByText('Aspen H.')).toBeInTheDocument()
    expect(screen.getByText('Nov 2')).toBeInTheDocument()
  })

  it('the close button dismisses the popup', async () => {
    render(<CalendarWidget />)
    await userEvent.click(screen.getByText('Homepage for CareyCare App'))
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByText('Nov 2')).not.toBeInTheDocument()
  })
})
