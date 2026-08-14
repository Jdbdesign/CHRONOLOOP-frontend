import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectPriorityBadge } from './ProjectPriorityBadge'

describe('ProjectPriorityBadge', () => {
  it('renders a capitalized priority label', () => {
    render(<ProjectPriorityBadge priority="high" />)
    expect(screen.getByText('High')).toBeInTheDocument()
  })
})
