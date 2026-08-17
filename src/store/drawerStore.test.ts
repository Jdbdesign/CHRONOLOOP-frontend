import { describe, it, expect } from 'vitest'
import { useDrawerStore } from './drawerStore'

describe('drawerStore', () => {
  it('starts closed', () => {
    expect(useDrawerStore.getState().isOpen).toBe(false)
  })

  it('open sets isOpen to true', () => {
    useDrawerStore.getState().open()
    expect(useDrawerStore.getState().isOpen).toBe(true)
    useDrawerStore.getState().close()
  })

  it('close sets isOpen to false', () => {
    useDrawerStore.getState().open()
    useDrawerStore.getState().close()
    expect(useDrawerStore.getState().isOpen).toBe(false)
  })

  it('toggle flips isOpen', () => {
    useDrawerStore.getState().toggle()
    expect(useDrawerStore.getState().isOpen).toBe(true)
    useDrawerStore.getState().toggle()
    expect(useDrawerStore.getState().isOpen).toBe(false)
  })
})
