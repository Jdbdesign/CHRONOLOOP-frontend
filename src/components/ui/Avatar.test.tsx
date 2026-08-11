import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders two-letter initials for a first+last name', () => {
    render(<Avatar name="Jacob Solayinka" />)
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('renders a single-letter fallback for a one-word name', () => {
    render(<Avatar name="Aspen" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('exposes the name as a title for identification', () => {
    render(<Avatar name="Roger Dokidis" />)
    expect(screen.getByTitle('Roger Dokidis')).toBeInTheDocument()
  })

  it('applies an inline style override for one-off sizing', () => {
    render(<Avatar name="Aspen Herwitz" style={{ width: 38, height: 38 }} />)
    expect(screen.getByTitle('Aspen Herwitz')).toHaveStyle({ width: '38px', height: '38px' })
  })
})
