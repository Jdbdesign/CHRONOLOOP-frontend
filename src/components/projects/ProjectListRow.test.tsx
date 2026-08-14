import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectListRow } from './ProjectListRow'
import { MOCK_PROJECTS } from '../../data/mockProjects'

describe('ProjectListRow', () => {
  it('renders name, category, client, status, priority, progress, and due date', () => {
    render(<ProjectListRow project={MOCK_PROJECTS[0]} onOpenDetail={() => {}} />)
    expect(screen.getByText('Web 3 App for Fxtrade')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Fxtrade Expert')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByText('Nov 20, 2024')).toBeInTheDocument()
  })

  it('calls onOpenDetail on click', async () => {
    const onOpenDetail = vi.fn()
    render(<ProjectListRow project={MOCK_PROJECTS[0]} onOpenDetail={onOpenDetail} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onOpenDetail).toHaveBeenCalledWith('p1')
  })

  it('renders no three-dot menu, unlike ProjectCard', () => {
    render(<ProjectListRow project={MOCK_PROJECTS[0]} onOpenDetail={() => {}} />)
    expect(screen.queryByRole('button', { name: 'More options' })).not.toBeInTheDocument()
  })
})
