// src/pages/ProjectsPage.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectsPage } from './ProjectsPage'
import { useProjectsStore } from '../store/projectsStore'
import { useProjectDetailStore } from '../store/projectDetailStore'
import { useProjectModalStore } from '../store/projectModalStore'
import { MOCK_PROJECTS } from '../data/mockProjects'

describe('ProjectsPage', () => {
  beforeEach(() => {
    useProjectsStore.setState({ projects: MOCK_PROJECTS })
    useProjectDetailStore.setState({ openProjectId: null })
    useProjectModalStore.setState({ isOpen: false })
  })

  it('renders the header and all 10 projects in grid view by default', () => {
    render(<ProjectsPage />)
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('Web 3 App for Fxtrade')).toBeInTheDocument()
    expect(screen.getByText('Content Management System')).toBeInTheDocument()
  })

  it('switches to list view and back', async () => {
    render(<ProjectsPage />)
    await userEvent.click(screen.getByRole('button', { name: /List/ }))
    expect(screen.getByText('Client')).toBeInTheDocument() // list head column, absent in grid view
    await userEvent.click(screen.getByRole('button', { name: /Grid/ }))
    expect(screen.queryByText('Client')).not.toBeInTheDocument()
  })

  it('filters by stat chip', async () => {
    render(<ProjectsPage />)
    // getByText('Overdue') is ambiguous here: it also matches the overdue
    // project's ProjectStatusBadge text on its grid card. Scope to the stat
    // chip itself (role="button", accessible name includes its label) to
    // disambiguate from that card badge.
    await userEvent.click(screen.getByRole('button', { name: /Overdue/ }))
    expect(screen.getByText('Brand Identity System')).toBeInTheDocument()
    expect(screen.queryByText('Web 3 App for Fxtrade')).not.toBeInTheDocument()
  })

  it('filters by search query across name, client, and category', async () => {
    render(<ProjectsPage />)
    await userEvent.type(screen.getByPlaceholderText('Search projects...'), 'shopmax')
    expect(screen.getByText('E-Commerce Platform Revamp')).toBeInTheDocument()
    expect(screen.queryByText('Web 3 App for Fxtrade')).not.toBeInTheDocument()
  })

  it('opens the detail panel from a card and deletes the project from it', async () => {
    render(<ProjectsPage />)
    await userEvent.click(screen.getByRole('button', { name: 'Web 3 App for Fxtrade' }))
    expect(useProjectDetailStore.getState().openProjectId).toBe('p1')

    await userEvent.click(screen.getByRole('button', { name: 'Delete project' }))
    expect(useProjectsStore.getState().projects.find((p) => p.id === 'p1')).toBeUndefined()
  })

  it('opens the New Project modal from the header and creates a project that appears in the grid', async () => {
    render(<ProjectsPage />)
    await userEvent.click(screen.getByRole('button', { name: /New Project/ }))
    await userEvent.type(screen.getByLabelText(/Project Name/), 'Fresh Launch')
    await userEvent.click(screen.getByRole('button', { name: /Create Project/ }))
    expect(screen.getByText('Fresh Launch')).toBeInTheDocument()
  })
})
