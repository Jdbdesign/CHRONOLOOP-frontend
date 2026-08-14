import { describe, it, expect, beforeEach } from 'vitest'
import { useProjectModalStore } from './projectModalStore'

describe('projectModalStore', () => {
  beforeEach(() => {
    useProjectModalStore.setState({ isOpen: false })
  })

  it('open sets isOpen to true', () => {
    useProjectModalStore.getState().open()
    expect(useProjectModalStore.getState().isOpen).toBe(true)
  })

  it('close sets isOpen to false', () => {
    useProjectModalStore.getState().open()
    useProjectModalStore.getState().close()
    expect(useProjectModalStore.getState().isOpen).toBe(false)
  })
})
