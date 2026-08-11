import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Chip } from './Chip'

describe('Chip', () => {
  it('renders the count and label', () => {
    render(<Chip dotColor="#4A90FF" count={45} label="To-do" />)
    expect(screen.getByText('45')).toBeInTheDocument()
    expect(screen.getByText('To-do')).toBeInTheDocument()
  })

  it('reflects the active state via aria-pressed', () => {
    render(<Chip dotColor="#4A90FF" count={45} label="To-do" active />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Chip dotColor="#4A90FF" count={45} label="To-do" onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
