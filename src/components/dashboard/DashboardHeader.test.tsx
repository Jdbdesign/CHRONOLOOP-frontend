// src/components/dashboard/DashboardHeader.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

  it('closes the filter panel after clicking Apply', async () => {
    render(<DashboardHeader />)
    await userEvent.click(screen.getByRole('button', { name: /^filter$/i }))
    const applyButton = await screen.findByRole('button', { name: /^apply$/i })
    await userEvent.click(applyButton)
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /^apply$/i })).not.toBeInTheDocument()
    })
  })

  it('closes the filter panel after clicking Clear all', async () => {
    render(<DashboardHeader />)
    await userEvent.click(screen.getByRole('button', { name: /^filter$/i }))
    const clearButton = await screen.findByRole('button', { name: /clear all/i })
    await userEvent.click(clearButton)
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /clear all/i })).not.toBeInTheDocument()
    })
  })
})
