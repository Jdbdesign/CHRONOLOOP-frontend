import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CalendarSubHeader } from './CalendarSubHeader'

describe('CalendarSubHeader', () => {
  const defaultProps = {
    periodTitle: 'November 2024',
    filter: 'all' as const,
    onNavigate: vi.fn(),
    onToday: vi.fn(),
    onFilterChange: vi.fn(),
  }

  it('renders the period title', () => {
    render(<CalendarSubHeader {...defaultProps} />)
    expect(screen.getByText('November 2024')).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    render(<CalendarSubHeader {...defaultProps} />)
    expect(screen.getByTitle('Previous')).toBeInTheDocument()
    expect(screen.getByTitle('Next')).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  it('calls onNavigate(-1) on prev click', async () => {
    const user = userEvent.setup()
    render(<CalendarSubHeader {...defaultProps} />)
    await user.click(screen.getByTitle('Previous'))
    expect(defaultProps.onNavigate).toHaveBeenCalledWith(-1)
  })

  it('calls onNavigate(1) on next click', async () => {
    const user = userEvent.setup()
    render(<CalendarSubHeader {...defaultProps} />)
    await user.click(screen.getByTitle('Next'))
    expect(defaultProps.onNavigate).toHaveBeenCalledWith(1)
  })

  it('calls onToday on Today click', async () => {
    const user = userEvent.setup()
    render(<CalendarSubHeader {...defaultProps} />)
    await user.click(screen.getByText('Today'))
    expect(defaultProps.onToday).toHaveBeenCalled()
  })

  it('renders all 5 filter chips', () => {
    render(<CalendarSubHeader {...defaultProps} />)
    expect(screen.getByText('All')).toBeInTheDocument()
    // Tasks/Projects/Sprints/Meetings appear both as filter chips and legend items
    const filterButtons = screen.getAllByRole('button', { pressed: false })
    const chipLabels = filterButtons.map((b) => b.textContent?.trim()).filter(Boolean)
    expect(chipLabels).toContain('Tasks')
    expect(chipLabels).toContain('Projects')
    expect(chipLabels).toContain('Sprints')
    expect(chipLabels).toContain('Meetings')
  })

  it('marks active filter with aria-pressed', () => {
    render(<CalendarSubHeader {...defaultProps} filter="task" />)
    const tasksButtons = screen.getAllByText('Tasks')
    const filterBtn = tasksButtons.find((el) => el.closest('button'))?.closest('button')
    expect(filterBtn).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('All').closest('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onFilterChange when a filter chip is clicked', async () => {
    const user = userEvent.setup()
    render(<CalendarSubHeader {...defaultProps} />)
    const sprintsElements = screen.getAllByText('Sprints')
    const sprintsBtn = sprintsElements.find((el) => el.closest('button'))?.closest('button')
    await user.click(sprintsBtn!)
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith('sprint')
  })

  it('renders the 4 legend items', () => {
    render(<CalendarSubHeader {...defaultProps} />)
    // Legend items duplicate the labels (Tasks, Projects, Sprints, Meetings)
    // They appear both in filter chips and legend, so getAllByText
    expect(screen.getAllByText('Tasks')).toHaveLength(2)
    expect(screen.getAllByText('Projects')).toHaveLength(2)
    expect(screen.getAllByText('Sprints')).toHaveLength(2)
    expect(screen.getAllByText('Meetings')).toHaveLength(2)
  })
})
