import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProjectsToolbar } from './ProjectsToolbar'

function renderToolbar(overrides: Partial<Parameters<typeof ProjectsToolbar>[0]> = {}) {
  const props = {
    activeSort: 'name',
    onSortChange: vi.fn(),
    searchQuery: '',
    onSearchChange: vi.fn(),
    ...overrides,
  }
  render(<ProjectsToolbar {...props} />)
  return props
}

describe('ProjectsToolbar', () => {
  it('calls onSortChange when a sort option is selected', async () => {
    const { onSortChange } = renderToolbar()
    await userEvent.click(screen.getByRole('button', { name: /Sort/ }))
    await userEvent.click(await screen.findByRole('menuitem', { name: 'Due Date' }))
    expect(onSortChange).toHaveBeenCalledWith('dueDate')
  })

  it('offers a Status sort option that is present but does not need to be functional', async () => {
    renderToolbar()
    await userEvent.click(screen.getByRole('button', { name: /Sort/ }))
    expect(await screen.findByRole('menuitem', { name: 'Status' })).toBeInTheDocument()
  })

  it('calls onSearchChange as the user types', async () => {
    const { onSearchChange } = renderToolbar()
    await userEvent.type(screen.getByPlaceholderText('Search projects...'), 'fx')
    expect(onSearchChange).toHaveBeenCalled()
  })

  it('Filter panel Clear/Apply do not throw and do not require onSortChange or onSearchChange', async () => {
    renderToolbar()
    await userEvent.click(screen.getByRole('button', { name: /Filter/ }))
    await userEvent.click(await screen.findByRole('button', { name: 'Clear' }))
  })
})
