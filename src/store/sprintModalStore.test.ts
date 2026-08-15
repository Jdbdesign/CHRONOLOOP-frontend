import { describe, it, expect } from 'vitest'
import { useSprintModalStore } from './sprintModalStore'

describe('sprintModalStore', () => {
  it('starts with both modals closed', () => {
    const s = useSprintModalStore.getState()
    expect(s.isNewOpen).toBe(false)
    expect(s.editingSprintId).toBeNull()
  })

  it('openNew/closeNew toggle isNewOpen without touching editingSprintId', () => {
    useSprintModalStore.getState().openNew()
    expect(useSprintModalStore.getState().isNewOpen).toBe(true)
    useSprintModalStore.getState().closeNew()
    expect(useSprintModalStore.getState().isNewOpen).toBe(false)
  })

  it('openEdit sets editingSprintId, closeEdit clears it', () => {
    useSprintModalStore.getState().openEdit('s2')
    expect(useSprintModalStore.getState().editingSprintId).toBe('s2')
    useSprintModalStore.getState().closeEdit()
    expect(useSprintModalStore.getState().editingSprintId).toBeNull()
  })
})
