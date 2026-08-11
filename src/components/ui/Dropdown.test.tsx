// src/components/ui/Dropdown.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dropdown } from './Dropdown'

describe('Dropdown', () => {
  it('opens the panel and lists items when the trigger is clicked', async () => {
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>This week</Dropdown.Item>
          <Dropdown.Item>This month</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))

    expect(screen.getByRole('menuitem', { name: 'This week' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'This month' })).toBeInTheDocument()
  })

  it('calls onSelect when an item is clicked', async () => {
    const onSelect = vi.fn<(event: Event) => void>()
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect}>This week</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    await userEvent.click(screen.getByRole('menuitem', { name: 'This week' }))

    expect(onSelect).toHaveBeenCalledTimes(1)
  })

  it('closes the panel when Escape is pressed', async () => {
    render(
      <Dropdown.Root>
        <Dropdown.Trigger>Open</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>This week</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('menuitem', { name: 'This week' })).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menuitem', { name: 'This week' })).not.toBeInTheDocument()
  })
})
