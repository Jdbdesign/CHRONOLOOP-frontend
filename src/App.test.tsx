import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders the Dashboard page by default, with the sidebar and topbar chrome', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('Critical Projects')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
  })

  it('navigates to the Tasks page when the Tasks nav link is clicked', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('link', { name: 'Tasks' }))
    expect(screen.getByText('My Tasks')).toBeInTheDocument()
  })

  it('navigates to the Integrations page when the "Integration" nav link is clicked', async () => {
    render(<App />)
    await userEvent.click(screen.getByRole('link', { name: 'Integration' }))
    expect(screen.getByRole('heading', { name: 'Integrations' })).toBeInTheDocument()
  })
})
