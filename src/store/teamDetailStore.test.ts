import { describe, it, expect } from 'vitest'
import { useTeamDetailStore } from './teamDetailStore'

describe('teamDetailStore', () => {
  it('starts closed', () => {
    expect(useTeamDetailStore.getState().openMemberId).toBeNull()
  })

  it('open sets the id, close clears it', () => {
    useTeamDetailStore.getState().open('tm3')
    expect(useTeamDetailStore.getState().openMemberId).toBe('tm3')
    useTeamDetailStore.getState().close()
    expect(useTeamDetailStore.getState().openMemberId).toBeNull()
  })
})
