// src/components/dashboard/CriticalProjectsPanel.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CriticalProjectsPanel } from './CriticalProjectsPanel'
import { useToastStore } from '../../store/toastStore'
import ddStyles from '../ui/Dropdown.module.css'

describe('CriticalProjectsPanel', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('renders all three critical project rows', () => {
    render(<CriticalProjectsPanel />)
    expect(screen.getByText('Web 3 app for Fxtrade')).toBeInTheDocument()
    expect(screen.getByText('Healthydog Landing Page')).toBeInTheDocument()
    expect(screen.getByText('Redesign of Website')).toBeInTheDocument()
  })

  it('shows a toast naming the project when a row is clicked', async () => {
    render(<CriticalProjectsPanel />)
    await userEvent.click(screen.getByText('Web 3 app for Fxtrade'))
    expect(useToastStore.getState().toasts.at(-1)?.message).toBe('Opening: Web 3 app for Fxtrade')
  })

  it('opens the three-dot context menu with View/Edit/Archive/Delete actions', async () => {
    render(<CriticalProjectsPanel />)
    const menus = screen.getAllByRole('button', { name: /more options/i })
    await userEvent.click(menus[0])
    expect(await screen.findByRole('menuitem', { name: /delete/i })).toBeInTheDocument()
  })

  it('does not fire the row click toast when the three-dot button is clicked', async () => {
    render(<CriticalProjectsPanel />)
    const menus = screen.getAllByRole('button', { name: /more options/i })
    await userEvent.click(menus[0])
    expect(useToastStore.getState().toasts.at(-1)?.message).not.toBe('Opening: Web 3 app for Fxtrade')
  })

  it('does not fire the row click toast when the client name is clicked', async () => {
    render(<CriticalProjectsPanel />)
    await userEvent.click(screen.getByText('DogXpert'))
    expect(useToastStore.getState().toasts.at(-1)?.message).toBe('Opening client profile...')
  })

  it('syncs the week dropdown trigger label and active item together on selection', async () => {
    render(<CriticalProjectsPanel />)
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
