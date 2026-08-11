// src/components/dashboard/TeamStatusPanel.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TeamStatusPanel } from './TeamStatusPanel'
import { useDashboardUiStore } from '../../store/dashboardUiStore'

describe('TeamStatusPanel', () => {
  it('renders all four team members plus the Add Individual tile', () => {
    render(<TeamStatusPanel />)
    expect(screen.getByText('Aspen Herwitz')).toBeInTheDocument()
    expect(screen.getByText('Roger Dokidis')).toBeInTheDocument()
    expect(screen.getByText('Marley Vaccaro')).toBeInTheDocument()
    expect(screen.getByText('Ryan Culhane')).toBeInTheDocument()
    expect(screen.getByText('Add Individual')).toBeInTheDocument()
  })

  it('opens the Member modal for the selected member on click', async () => {
    useDashboardUiStore.setState({ activeModal: null, selectedMemberId: null })
    render(<TeamStatusPanel />)
    await userEvent.click(screen.getByText('Aspen Herwitz'))
    expect(useDashboardUiStore.getState()).toMatchObject({ activeModal: 'member', selectedMemberId: 'AS' })
  })

  it('opens the Invite modal from Add Individual', async () => {
    useDashboardUiStore.setState({ activeModal: null })
    render(<TeamStatusPanel />)
    await userEvent.click(screen.getByText('Add Individual'))
    expect(useDashboardUiStore.getState().activeModal).toBe('invite')
  })

  it('opens the Activity modal from View Activity', async () => {
    useDashboardUiStore.setState({ activeModal: null })
    render(<TeamStatusPanel />)
    await userEvent.click(screen.getByRole('button', { name: 'View Activity' }))
    expect(useDashboardUiStore.getState().activeModal).toBe('activity')
  })

  it('animates the progress bar to 85% after mount', () => {
    vi.useFakeTimers()
    render(<TeamStatusPanel />)
    act(() => vi.advanceTimersByTime(500))
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '85')
    vi.useRealTimers()
  })
})
