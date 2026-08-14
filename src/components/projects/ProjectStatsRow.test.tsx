import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectStatsRow } from './ProjectStatsRow'
import { useProjectsStore } from '../../store/projectsStore'
import { MOCK_PROJECTS } from '../../data/mockProjects'

describe('ProjectStatsRow', () => {
  beforeEach(() => {
    useProjectsStore.setState({ projects: MOCK_PROJECTS })
  })

  it('shows live counts for each status filter, computed from projectsStore', () => {
    render(<ProjectStatsRow activeFilter="all" onFilterChange={() => {}} />)
    // MOCK_PROJECTS: 4 active, 2 in-progress, 2 completed, 1 overdue, 1 on-hold, 10 total
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getAllByText('4').length).toBeGreaterThan(0)
  })

  it('calls onFilterChange with the clicked chip filter', async () => {
    const onFilterChange = vi.fn()
    render(<ProjectStatsRow activeFilter="all" onFilterChange={onFilterChange} />)
    await userEvent.click(screen.getByText('Overdue'))
    expect(onFilterChange).toHaveBeenCalledWith('overdue')
  })

  it('renders children as a row sibling of the chips', () => {
    render(
      <ProjectStatsRow activeFilter="all" onFilterChange={() => {}}>
        <div data-testid="toolbar-slot" />
      </ProjectStatsRow>,
    )
    expect(screen.getByTestId('toolbar-slot')).toBeInTheDocument()
  })
})
