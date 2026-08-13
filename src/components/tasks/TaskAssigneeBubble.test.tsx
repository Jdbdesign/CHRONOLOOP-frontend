import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskAssigneeBubble } from './TaskAssigneeBubble'

describe('TaskAssigneeBubble', () => {
  it('renders initials-on-gradient fallback when no avatar image is given', () => {
    render(<TaskAssigneeBubble assignee="AS" avatarSrc={undefined} color="linear-gradient(135deg,#4A90FF,#2563eb)" size={26} />)
    expect(screen.getByText('AS')).toBeInTheDocument()
  })

  it('applies the requested size', () => {
    render(<TaskAssigneeBubble assignee="AS" avatarSrc={undefined} color="linear-gradient(135deg,#4A90FF,#2563eb)" size={22} />)
    expect(screen.getByTitle('AS')).toHaveStyle({ width: '22px', height: '22px' })
  })
})
