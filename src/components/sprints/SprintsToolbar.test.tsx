import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SprintsToolbar } from './SprintsToolbar'

describe('SprintsToolbar', () => {
  it('renders the Sort trigger and search input', () => {
    render(<SprintsToolbar activeSort="number" onSortChange={() => {}} searchQuery="" onSearchChange={() => {}} />)
    expect(screen.getByText('Sort')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search sprints...')).toBeInTheDocument()
  })

  it('calls onSortChange when a sort option is selected', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(<SprintsToolbar activeSort="number" onSortChange={onSortChange} searchQuery="" onSearchChange={() => {}} />)
    await user.click(screen.getByText('Sort'))
    await user.click(await screen.findByText('Story Points'))
    expect(onSortChange).toHaveBeenCalledWith('storyPts')
  })

  it('calls onSearchChange as the user types', async () => {
    const user = userEvent.setup()
    const onSearchChange = vi.fn()
    render(<SprintsToolbar activeSort="number" onSortChange={() => {}} searchQuery="" onSearchChange={onSearchChange} />)
    await user.type(screen.getByPlaceholderText('Search sprints...'), 'ux')
    expect(onSearchChange).toHaveBeenCalled()
  })
})
