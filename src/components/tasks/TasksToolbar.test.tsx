// src/components/tasks/TasksToolbar.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TasksToolbar } from './TasksToolbar'

describe('TasksToolbar', () => {
  it('search input reflects the controlled value and calls onSearchChange while typing', async () => {
    const onSearchChange = vi.fn()
    render(<TasksToolbar activeSort="due" onSortChange={vi.fn()} searchQuery="" onSearchChange={onSearchChange} />)
    await userEvent.type(screen.getByPlaceholderText('Search tasks...'), 'x')
    expect(onSearchChange).toHaveBeenCalledWith('x')
  })

  it('Sort dropdown keeps its trigger label static as "Sort" after selecting an option', async () => {
    const onSortChange = vi.fn()
    render(<TasksToolbar activeSort="due" onSortChange={onSortChange} searchQuery="" onSearchChange={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Sort' }))
    await userEvent.click(await screen.findByRole('menuitem', { name: /priority/i }))
    expect(onSortChange).toHaveBeenCalledWith('priority')
    expect(screen.getByRole('button', { name: 'Sort' })).toBeInTheDocument()
  })

  it('marks the currently active sort item', async () => {
    render(<TasksToolbar activeSort="priority" onSortChange={vi.fn()} searchQuery="" onSearchChange={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: 'Sort' }))
    expect(await screen.findByRole('menuitem', { name: /priority/i })).toHaveClass(/active/)
  })
})
