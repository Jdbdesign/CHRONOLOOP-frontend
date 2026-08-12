// src/components/dashboard/TeamStatusPanel.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TeamStatusPanel } from './TeamStatusPanel'
import { useDashboardUiStore } from '../../store/dashboardUiStore'
import ddStyles from '../ui/Dropdown.module.css'

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

  it('keeps aria-valuenow at 85 from first render while the fill bar animates its width to 85% after mount', () => {
    vi.useFakeTimers()
    render(<TeamStatusPanel />)
    const track = screen.getByRole('progressbar')
    expect(track).toHaveAttribute('aria-valuenow', '85')
    const fill = track.firstElementChild as HTMLElement
    expect(fill.style.width).toBe('0%')

    act(() => vi.advanceTimersByTime(500))

    expect(track).toHaveAttribute('aria-valuenow', '85')
    expect(fill.style.width).toBe('85%')
    vi.useRealTimers()
  })

  it('syncs the role dropdown trigger label and active item together on selection', async () => {
    render(<TeamStatusPanel />)
    expect(screen.getByRole('button', { name: 'Developer' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Developer' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Designer' }))

    expect(screen.getByRole('button', { name: 'Designer' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Designer' }))
    const designerItem = await screen.findByRole('menuitem', { name: 'Designer' })
    expect(designerItem).toHaveClass(ddStyles.active)
    const developerItem = screen.getByRole('menuitem', { name: 'Developer' })
    expect(developerItem).not.toHaveClass(ddStyles.active)
  })

  it('shows the "Select Project" placeholder on load with "All Projects" pre-active, then syncs trigger label and active item together on selection', async () => {
    render(<TeamStatusPanel />)
    expect(screen.getByRole('button', { name: 'Select Project' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Select Project' }))
    expect(await screen.findByRole('menuitem', { name: 'All Projects' })).toHaveClass(ddStyles.active)

    await userEvent.click(screen.getByRole('menuitem', { name: 'Healthydog Landing Page' }))

    expect(screen.getByRole('button', { name: 'Healthydog Landing Page' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Healthydog Landing Page' }))
    const selectedItem = await screen.findByRole('menuitem', { name: 'Healthydog Landing Page' })
    expect(selectedItem).toHaveClass(ddStyles.active)
    const allProjectsItem = screen.getByRole('menuitem', { name: 'All Projects' })
    expect(allProjectsItem).not.toHaveClass(ddStyles.active)
  })

  it('offers "ChronoLoop Launch" as a Select Project option', async () => {
    render(<TeamStatusPanel />)
    await userEvent.click(screen.getByRole('button', { name: 'Select Project' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'ChronoLoop Launch' }))
    expect(screen.getByRole('button', { name: 'ChronoLoop Launch' })).toBeInTheDocument()
  })
})
