import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectsGridView } from './ProjectsGridView'
import { MOCK_PROJECTS } from '../../data/mockProjects'

describe('ProjectsGridView', () => {
  it('renders one card per project', () => {
    render(<ProjectsGridView projects={MOCK_PROJECTS} onOpenDetail={() => {}} onDelete={() => {}} />)
    const projectNames = MOCK_PROJECTS.map((p) => p.name)
    const cards = screen.getAllByRole('button').filter((el) => projectNames.includes(el.getAttribute('aria-label') ?? ''))
    expect(cards).toHaveLength(10)
  })

  it('shows an empty state with a New Project button when there are no projects', () => {
    render(<ProjectsGridView projects={[]} onOpenDetail={() => {}} onDelete={() => {}} />)
    expect(screen.getByText('No projects found')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /New Project/ })).toBeInTheDocument()
  })
})
