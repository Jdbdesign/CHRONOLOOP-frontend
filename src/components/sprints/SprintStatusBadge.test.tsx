import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SprintStatusBadge } from './SprintStatusBadge'

describe('SprintStatusBadge', () => {
  it('renders the label for each status', () => {
    const { rerender } = render(<SprintStatusBadge status="active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
    rerender(<SprintStatusBadge status="completed" />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
    rerender(<SprintStatusBadge status="planning" />)
    expect(screen.getByText('Planning')).toBeInTheDocument()
    rerender(<SprintStatusBadge status="upcoming" />)
    expect(screen.getByText('Upcoming')).toBeInTheDocument()
  })
})
