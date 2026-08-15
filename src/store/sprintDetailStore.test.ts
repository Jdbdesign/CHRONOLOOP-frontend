import { describe, it, expect } from 'vitest'
import { useSprintDetailStore } from './sprintDetailStore'

describe('sprintDetailStore', () => {
  it('starts closed', () => {
    expect(useSprintDetailStore.getState().openSprintId).toBeNull()
  })

  it('open sets the id, close clears it', () => {
    useSprintDetailStore.getState().open('s3')
    expect(useSprintDetailStore.getState().openSprintId).toBe('s3')
    useSprintDetailStore.getState().close()
    expect(useSprintDetailStore.getState().openSprintId).toBeNull()
  })
})
