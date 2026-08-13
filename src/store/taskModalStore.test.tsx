import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskModalStore } from './taskModalStore'

describe('taskModalStore', () => {
  beforeEach(() => {
    useTaskModalStore.setState({ isOpen: false, editingTaskId: null })
  })

  it('openCreate opens the modal with no editing task', () => {
    useTaskModalStore.getState().openCreate()
    expect(useTaskModalStore.getState()).toMatchObject({ isOpen: true, editingTaskId: null })
  })

  it('openEdit opens the modal with the given task id', () => {
    useTaskModalStore.getState().openEdit(7)
    expect(useTaskModalStore.getState()).toMatchObject({ isOpen: true, editingTaskId: 7 })
  })

  it('close resets both isOpen and editingTaskId', () => {
    useTaskModalStore.getState().openEdit(7)
    useTaskModalStore.getState().close()
    expect(useTaskModalStore.getState()).toMatchObject({ isOpen: false, editingTaskId: null })
  })
})
