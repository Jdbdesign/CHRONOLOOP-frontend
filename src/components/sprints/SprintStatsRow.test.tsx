import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SprintStatsRow } from './SprintStatsRow'
import { useSprintsStore } from '../../store/sprintsStore'
import { MOCK_SPRINTS } from '../../data/mockSprints'

describe('SprintStatsRow', () => {
  beforeEach(() => {
    useSprintsStore.setState({ sprints: MOCK_SPRINTS })
  })

  it('renders live counts computed from the full store list, not a filtered one', () => {
    render(<SprintStatsRow activeFilter="all" onFilterChange={() => {}} />)
    expect(screen.getByText('All').previousSibling).toHaveTextContent('5')
    expect(screen.getByText('Active').previousSibling).toHaveTextContent('1')
    expect(screen.getByText('Planning').previousSibling).toHaveTextContent('1')
    expect(screen.getByText('Completed').previousSibling).toHaveTextContent('2')
    expect(screen.getByText('Upcoming').previousSibling).toHaveTextContent('1')
  })

  it('calls onFilterChange with the clicked chip\'s filter key', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    render(<SprintStatsRow activeFilter="all" onFilterChange={onFilterChange} />)
    await user.click(screen.getByText('Active'))
    expect(onFilterChange).toHaveBeenCalledWith('active')
  })

  it('renders children as a row sibling, not nested inside the chip list', () => {
    render(
      <SprintStatsRow activeFilter="all" onFilterChange={() => {}}>
        <div data-testid="toolbar-slot">toolbar</div>
      </SprintStatsRow>,
    )
    const slot = screen.getByTestId('toolbar-slot')
    const chip = screen.getByText('All').closest('div[data-active]')
    expect(slot.parentElement).toBe(chip?.parentElement)
  })
})
