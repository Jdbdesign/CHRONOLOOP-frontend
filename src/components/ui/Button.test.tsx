import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children and defaults to the primary variant', () => {
    render(<Button>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('data-variant', 'primary')
  })

  it('applies the requested variant', () => {
    render(<Button variant="danger">Delete</Button>)
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveAttribute('data-variant', 'danger')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Save</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('respects the disabled attribute', () => {
    render(<Button disabled>Save</Button>)
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })
})
