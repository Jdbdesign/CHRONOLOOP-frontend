import { describe, it, expect, beforeEach } from 'vitest'
import { useProjectDetailStore } from './projectDetailStore'

describe('projectDetailStore', () => {
  beforeEach(() => {
    useProjectDetailStore.setState({ openProjectId: null })
  })

  it('open sets openProjectId to the given id', () => {
    useProjectDetailStore.getState().open('p5')
    expect(useProjectDetailStore.getState().openProjectId).toBe('p5')
  })

  it('close resets openProjectId to null', () => {
    useProjectDetailStore.getState().open('p5')
    useProjectDetailStore.getState().close()
    expect(useProjectDetailStore.getState().openProjectId).toBeNull()
  })
})
