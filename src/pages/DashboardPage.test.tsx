import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DashboardPage } from './DashboardPage'

describe('DashboardPage', () => {
  it('renders the greeting, KPI grid, both middle-row panels, and the calendar widget', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Welcome Back,')).toBeInTheDocument()
    expect(screen.getByText('To-do')).toBeInTheDocument()
    expect(screen.getByText('Critical Projects')).toBeInTheDocument()
    expect(screen.getByText('Team Status')).toBeInTheDocument()
    expect(screen.getByText('Calendar View')).toBeInTheDocument()
  })

  it('has an accessible page heading for screen-reader navigation', () => {
    render(<DashboardPage />)
    expect(screen.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeInTheDocument()
  })
})
