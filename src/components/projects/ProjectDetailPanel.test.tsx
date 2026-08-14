import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectDetailPanel } from './ProjectDetailPanel'
import { useProjectDetailStore } from '../../store/projectDetailStore'
import { useProjectsStore } from '../../store/projectsStore'
import { MOCK_PROJECTS } from '../../data/mockProjects'

describe('ProjectDetailPanel', () => {
  beforeEach(() => {
    useProjectDetailStore.setState({ openProjectId: null })
    useProjectsStore.setState({ projects: MOCK_PROJECTS })
  })

  it('renders nothing identifiable when closed', () => {
    render(<ProjectDetailPanel onDelete={() => {}} />)
    expect(screen.getByTestId('project-detail-overlay')).toHaveAttribute('data-open', 'false')
  })

  it('renders the project name, description, meta grid, team, and milestones when open', () => {
    useProjectDetailStore.setState({ openProjectId: 'p1' })
    render(<ProjectDetailPanel onDelete={() => {}} />)
    expect(screen.getByText('Web 3 App for Fxtrade')).toBeInTheDocument()
    expect(screen.getByText(/Building a comprehensive Web3 application/)).toBeInTheDocument()
    expect(screen.getByText('Development')).toBeInTheDocument()
    expect(screen.getByText('Aspen H.')).toBeInTheDocument()
    expect(screen.getByText('Security Audit')).toBeInTheDocument()
  })

  it('closes on Escape', async () => {
    useProjectDetailStore.setState({ openProjectId: 'p1' })
    render(<ProjectDetailPanel onDelete={() => {}} />)
    await userEvent.keyboard('{Escape}')
    expect(useProjectDetailStore.getState().openProjectId).toBeNull()
  })

  it('closes on overlay click', async () => {
    useProjectDetailStore.setState({ openProjectId: 'p1' })
    render(<ProjectDetailPanel onDelete={() => {}} />)
    await userEvent.click(screen.getByTestId('project-detail-overlay'))
    expect(useProjectDetailStore.getState().openProjectId).toBeNull()
  })

  it('calls onDelete with id and name, and closes the panel', async () => {
    const onDelete = vi.fn()
    useProjectDetailStore.setState({ openProjectId: 'p1' })
    render(<ProjectDetailPanel onDelete={onDelete} />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }))
    expect(onDelete).toHaveBeenCalledWith('p1', 'Web 3 App for Fxtrade')
    expect(useProjectDetailStore.getState().openProjectId).toBeNull()
  })
})
