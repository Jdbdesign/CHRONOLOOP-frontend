// src/components/dashboard/CalendarWidget.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalendarWidget } from './CalendarWidget'
import ddStyles from '../ui/Dropdown.module.css'

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

  it('syncs the week dropdown trigger label and active item together on selection', async () => {
    render(<CalendarWidget />)
    await userEvent.click(screen.getByRole('button', { name: 'This week' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Today' }))

    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Today' }))
    const todayItem = await screen.findByRole('menuitem', { name: 'Today' })
    expect(todayItem).toHaveClass(ddStyles.active)
    const thisWeekItem = screen.getByRole('menuitem', { name: 'This week' })
    expect(thisWeekItem).not.toHaveClass(ddStyles.active)
  })
})
