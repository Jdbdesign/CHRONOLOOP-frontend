import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskDetailActivity } from './TaskDetailActivity'

describe('TaskDetailActivity', () => {
  it('shows "No comments yet." when there are no comments', () => {
    render(<TaskDetailActivity comments={[]} />)
    expect(screen.getByText('No comments yet.')).toBeInTheDocument()
  })

  it('renders each comment with author, text, and time', () => {
    render(<TaskDetailActivity comments={[{ author: 'Aspen H.', text: 'Looks great!', time: '2h ago' }]} />)
    expect(screen.getByText('Aspen H.')).toBeInTheDocument()
    expect(screen.getByText('Looks great!')).toBeInTheDocument()
    expect(screen.getByText('2h ago')).toBeInTheDocument()
  })
})
