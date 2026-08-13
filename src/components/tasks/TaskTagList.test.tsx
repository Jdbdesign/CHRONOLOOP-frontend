import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskTagList } from './TaskTagList'

describe('TaskTagList', () => {
  it('renders up to 2 tags by default', () => {
    render(<TaskTagList tags={['Frontend', 'Design', 'Bug']} />)
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.queryByText('Bug')).not.toBeInTheDocument()
  })

  it('renders nothing when there are no tags', () => {
    const { container } = render(<TaskTagList tags={[]} />)
    expect(container.firstChild?.textContent).toBe('')
  })
})
