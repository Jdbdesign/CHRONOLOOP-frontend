// src/components/layout/Sidebar.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useThemeStore } from '../../store/themeStore'

describe('Sidebar', () => {
  it('renders all nine nav items with correct labels and hrefs', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )

    const expected: Array<[string, string]> = [
      ['Dashboard', '/'],
      ['Tasks', '/tasks'],
      ['Projects', '/projects'],
      ['Sprints', '/sprints'],
      ['Team', '/team'],
      ['Reports', '/reports'],
      ['Calendar', '/calendar'],
      ['Integration', '/integrations'],
      ['Settings', '/settings'],
    ]

    for (const [label, href] of expected) {
      const link = screen.getByRole('link', { name: label })
      expect(link).toHaveAttribute('href', href)
    }
  })

  it('marks the current route as active via aria-current', () => {
    render(
      <MemoryRouter initialEntries={['/tasks']}>
        <Sidebar />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Tasks' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
  })

  it('switches the theme store when a theme toggle button is clicked', async () => {
    const { default: userEvent } = await import('@testing-library/user-event')
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )

    await userEvent.click(screen.getByRole('button', { name: /light/i }))
    expect(useThemeStore.getState().theme).toBe('light')

    await userEvent.click(screen.getByRole('button', { name: /dark/i }))
    expect(useThemeStore.getState().theme).toBe('dark')
  })
})
