import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectsListView } from './ProjectsListView'
import { MOCK_PROJECTS } from '../../data/mockProjects'

describe('ProjectsListView', () => {
  it('renders a head row with column labels', () => {
    render(<ProjectsListView projects={MOCK_PROJECTS} onOpenDetail={() => {}} />)
    expect(screen.getByText('Project')).toBeInTheDocument()
    expect(screen.getByText('Client')).toBeInTheDocument()
    expect(screen.getByText('Team')).toBeInTheDocument()
  })

  it('renders one row per project', () => {
    render(<ProjectsListView projects={MOCK_PROJECTS} onOpenDetail={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(10)
  })

  it('shows an empty state with no projects', () => {
    render(<ProjectsListView projects={[]} onOpenDetail={() => {}} />)
    expect(screen.getByText('No projects found')).toBeInTheDocument()
  })
})
