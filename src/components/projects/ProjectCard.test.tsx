import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectCard } from './ProjectCard'
import { MOCK_PROJECTS } from '../../data/mockProjects'

describe('ProjectCard', () => {
  it('renders name, client, category, badges, and progress', () => {
    render(<ProjectCard project={MOCK_PROJECTS[0]} index={0} onOpenDetail={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('Web 3 App for Fxtrade')).toBeInTheDocument()
    expect(screen.getByText('Fxtrade Expert')).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByText('8/18 tasks')).toBeInTheDocument()
  })

  it('calls onOpenDetail when the card is clicked', async () => {
    const onOpenDetail = vi.fn()
    render(<ProjectCard project={MOCK_PROJECTS[0]} index={0} onOpenDetail={onOpenDetail} onDelete={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'Web 3 App for Fxtrade' }))
    expect(onOpenDetail).toHaveBeenCalledWith('p1')
  })

  it('does not open the detail panel when the three-dot menu is clicked', async () => {
    const onOpenDetail = vi.fn()
    render(<ProjectCard project={MOCK_PROJECTS[0]} index={0} onOpenDetail={onOpenDetail} onDelete={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'More options' }))
    expect(onOpenDetail).not.toHaveBeenCalled()
  })

  it('calls onDelete with id and name from the context menu', async () => {
    const onDelete = vi.fn()
    render(<ProjectCard project={MOCK_PROJECTS[0]} index={0} onOpenDetail={() => {}} onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: 'More options' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: /Delete/ }))
    expect(onDelete).toHaveBeenCalledWith('p1', 'Web 3 App for Fxtrade')
  })

  it('shows an overflow "+N" tile when the team has more than 3 members', () => {
    render(<ProjectCard project={MOCK_PROJECTS[2]} index={0} onOpenDetail={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('+1')).toBeInTheDocument()
  })
})
