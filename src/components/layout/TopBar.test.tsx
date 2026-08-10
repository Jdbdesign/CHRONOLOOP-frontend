// src/components/layout/TopBar.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopBar } from './TopBar'

describe('TopBar', () => {
  it('renders the search input', () => {
    render(<TopBar />)
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument()
  })

  it('renders the team avatar cluster with accessible names', () => {
    render(<TopBar />)
    expect(screen.getByTitle('Aspen Herwitz')).toBeInTheDocument()
    expect(screen.getByTitle('Roger Dokidis')).toBeInTheDocument()
    expect(screen.getByTitle('Marley Vaccaro')).toBeInTheDocument()
    expect(screen.getByTitle('Ryan Culhane')).toBeInTheDocument()
  })

  it('renders the share button, notification bell with badge, and user avatar button', () => {
    render(<TopBar />)
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /jacob solayinka/i })).toBeInTheDocument()
  })
})
