import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectStatusBadge } from './ProjectStatusBadge'

describe('ProjectStatusBadge', () => {
  it('renders the label for a given status', () => {
    render(<ProjectStatusBadge status="in-progress" />)
    expect(screen.getByText('In Progress')).toBeInTheDocument()
  })

  it('renders the Overdue label', () => {
    render(<ProjectStatusBadge status="overdue" />)
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })
})
