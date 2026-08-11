// src/components/dashboard/CriticalProjectsPanel.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CriticalProjectsPanel } from './CriticalProjectsPanel'
import { useToastStore } from '../../store/toastStore'

describe('CriticalProjectsPanel', () => {
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
})
