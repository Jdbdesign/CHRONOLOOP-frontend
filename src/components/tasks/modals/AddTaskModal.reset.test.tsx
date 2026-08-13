import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { AddTaskModal } from './AddTaskModal'
import { useTaskModalStore } from '../../../store/taskModalStore'
import { useTasksStore } from '../../../store/tasksStore'
import { useToastStore } from '../../../store/toastStore'
import { MOCK_TASKS } from '../../../data/mockTasks'

/**
 * In real usage, Radix's Presence (which backs Modal/Dialog.Content) keeps a closing
 * modal's DOM subtree mounted for as long as it believes an exit animation is in flight —
 * driven by `data-state` and the element's computed `animationName` (see
 * Modal.module.css's `cardIn`/`cardOut` transitions, ~250ms per tokens.css). If
 * AddTaskModal is reopened for the same create/edit target while that exit animation is
 * still running, Presence cancels the exit and never unmounts the old subtree.
 *
 * jsdom doesn't run real CSS animations, so in an ordinary render Presence always unmounts
 * synchronously — which would let a reset that only "works" by accident of that unmount
 * pass unnoticed. This file instead stubs the `Modal` primitive itself to never unmount
 * its children at all (the permanent worst case of that race), via a hoisted `vi.mock` so
 * it's in effect from the very first time `AddTaskModal` (and therefore `Modal`) is
 * imported. Every assertion below can only pass because of AddTaskModal's own key-based
 * reset logic (the `sessionRef` bumped on close, folded into `AddTaskFormFields`'s key) —
 * never because Radix tore the DOM down for us.
 */
vi.mock('../../ui/Modal', () => ({
  Modal: ({ children, footer }: { children: ReactNode; footer?: ReactNode }) => (
    <>
      {children}
      {footer}
    </>
  ),
}))

describe('AddTaskModal — reset-on-close when the modal DOM never unmounts', () => {
  beforeEach(() => {
    useTaskModalStore.setState({ isOpen: true, editingTaskId: null })
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
    useToastStore.setState({ toasts: [] })
  })

  it('resets the form when closed and immediately reopened for the same create target', async () => {
    render(<AddTaskModal />)
    await userEvent.type(screen.getByLabelText(/task name/i), 'Draft that should not persist')
    await userEvent.click(screen.getByRole('button', { name: 'High' }))
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    // Cancel already ran handleClose (bumping the session counter) and set isOpen false.
    // Reopen immediately, in the same tick — no waiting for any animation.
    act(() => {
      useTaskModalStore.getState().openCreate()
    })

    expect(screen.getByLabelText(/task name/i)).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Medium' })).toHaveAttribute('data-selected', 'true')
  })

  it('resets the form when closed and immediately reopened for the same edit target', async () => {
    useTaskModalStore.setState({ isOpen: true, editingTaskId: 1 })
    render(<AddTaskModal />)
    await userEvent.clear(screen.getByLabelText(/task name/i))
    await userEvent.type(screen.getByLabelText(/task name/i), 'Unsaved edit that should not persist')
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    act(() => {
      useTaskModalStore.getState().openEdit(1)
    })

    expect(screen.getByLabelText(/task name/i)).toHaveValue('Homepage for CareyCare App')
  })
})
