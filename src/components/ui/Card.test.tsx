import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders its children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('forwards a caller-supplied className alongside its own styling', () => {
    render(
      <Card className="custom" data-testid="card">
        Content
      </Card>,
    )
    expect(screen.getByTestId('card')).toHaveClass('custom')
  })
})
