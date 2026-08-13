import { describe, it, expect, beforeEach } from 'vitest'
import { useTaskDetailStore } from './taskDetailStore'

describe('taskDetailStore', () => {
  beforeEach(() => {
    useTaskDetailStore.setState({ openTaskId: null })
  })

  it('open sets openTaskId to the given id', () => {
    useTaskDetailStore.getState().open(5)
    expect(useTaskDetailStore.getState().openTaskId).toBe(5)
  })

  it('close resets openTaskId to null', () => {
    useTaskDetailStore.getState().open(5)
    useTaskDetailStore.getState().close()
    expect(useTaskDetailStore.getState().openTaskId).toBeNull()
  })
})
