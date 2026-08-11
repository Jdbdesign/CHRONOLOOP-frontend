// src/components/dashboard/DashboardHeader.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DashboardHeader } from './DashboardHeader'
import { useDashboardUiStore } from '../../store/dashboardUiStore'

describe('DashboardHeader', () => {
  it('renders the greeting text', () => {
    render(<DashboardHeader />)
    expect(screen.getByText('Hello Jacobs,')).toBeInTheDocument()
    expect(screen.getByText('Welcome Back,')).toBeInTheDocument()
  })

  it('opens the Add Task modal via the split button\'s main action', async () => {
    useDashboardUiStore.setState({ activeModal: null })
    render(<DashboardHeader />)
    await userEvent.click(screen.getByRole('button', { name: /add task/i }))
    expect(useDashboardUiStore.getState().activeModal).toBe('addTask')
  })

  it('switches the active year label when a year is picked from the dropdown', async () => {
    render(<DashboardHeader />)
    await userEvent.click(screen.getByRole('button', { name: /2024/ }))
    await userEvent.click(await screen.findByRole('menuitem', { name: '2023' }))
    expect(screen.getByText('2023')).toBeInTheDocument()
  })
})
