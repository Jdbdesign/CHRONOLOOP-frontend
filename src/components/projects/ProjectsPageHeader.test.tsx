import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectsPageHeader } from './ProjectsPageHeader'

describe('ProjectsPageHeader', () => {
  it('renders the breadcrumb and heading', () => {
    render(<ProjectsPageHeader view="grid" onViewChange={() => {}} onNewProject={() => {}} />)
    expect(screen.getByText('Overview / Projects')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
  })

  it('marks the active view button and calls onViewChange on click', async () => {
    const onViewChange = vi.fn()
    render(<ProjectsPageHeader view="grid" onViewChange={onViewChange} onNewProject={() => {}} />)
    expect(screen.getByRole('button', { name: /Grid/ })).toHaveAttribute('data-active', 'true')
    await userEvent.click(screen.getByRole('button', { name: /List/ }))
    expect(onViewChange).toHaveBeenCalledWith('list')
  })

  it('calls onNewProject when the New Project button is clicked', async () => {
    const onNewProject = vi.fn()
    render(<ProjectsPageHeader view="grid" onViewChange={() => {}} onNewProject={onNewProject} />)
    await userEvent.click(screen.getByRole('button', { name: /New Project/ }))
    expect(onNewProject).toHaveBeenCalled()
  })
})
