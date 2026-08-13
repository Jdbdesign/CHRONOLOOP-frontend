import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TaskDetailAttachments } from './TaskDetailAttachments'

describe('TaskDetailAttachments', () => {
  it('renders nothing when there are no attachments', () => {
    const { container } = render(<TaskDetailAttachments attachments={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders each attachment with its name and size', () => {
    render(<TaskDetailAttachments attachments={[{ name: 'wireframe_v2.fig', size: '1.2 MB', type: 'fig' }]} />)
    expect(screen.getByText('Attachments (1)')).toBeInTheDocument()
    expect(screen.getByText('wireframe_v2.fig')).toBeInTheDocument()
    expect(screen.getByText('1.2 MB')).toBeInTheDocument()
  })
})
