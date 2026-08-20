import { describe, it, expect, beforeEach } from 'vitest'
import { useSprintsStore } from './sprintsStore'
import { MOCK_SPRINTS } from '../data/mockSprints'

describe('sprintsStore', () => {
  beforeEach(() => {
    useSprintsStore.setState({ sprints: MOCK_SPRINTS })
  })

  it('starts seeded with the 5 mock sprints', async () => {
    expect(useSprintsStore.getState().sprints).toHaveLength(5)
  })

  it('addSprint prepends a new planning-status sprint with a computed number', async () => {
    await useSprintsStore.getState().addSprint({
      name: 'New Sprint', goal: '', startRaw: '2024-12-20', endRaw: '2025-01-02',
      storyPoints: 25, project: 'ChronoLoop Launch',
    })
    const [first] = useSprintsStore.getState().sprints
    expect(first.name).toBe('New Sprint')
    expect(first.status).toBe('planning')
    expect(first.number).toBe('SPRINT 06')
    expect(first.progress).toBe(0)
    expect(first.velocity).toBeNull()
    expect(first.team).toEqual([{ i: 'JA', c: '#4A90FF' }])
  })

  it('addSprint defaults goal to "No goal defined." when blank, matching index.html:8459', async () => {
    await useSprintsStore.getState().addSprint({
      name: 'X', goal: '', startRaw: '', endRaw: '', storyPoints: 40, project: 'Web 3 App for Fxtrade',
    })
    expect(useSprintsStore.getState().sprints[0].goal).toBe('No goal defined.')
  })

  it('updateSprint mutates fields in place and forces progress to 100 when status becomes completed', async () => {
    await useSprintsStore.getState().updateSprint('s4', {
      name: 'Testing & Hardening (updated)', goal: 'Updated goal', storyPoints: 50,
      status: 'completed', project: 'Web 3 App for Fxtrade', startRaw: '', endRaw: '',
    })
    const s4 = useSprintsStore.getState().sprints.find((s) => s.id === 's4')
    expect(s4?.name).toBe('Testing & Hardening (updated)')
    expect(s4?.status).toBe('completed')
    expect(s4?.progress).toBe(100)
  })

  it('removeSprint removes the sprint by id', async () => {
    await useSprintsStore.getState().removeSprint('s5')
    expect(useSprintsStore.getState().sprints.find((s) => s.id === 's5')).toBeUndefined()
  })

  it('markComplete sets status to completed and progress to 100, matching index.html:8385', async () => {
    await useSprintsStore.getState().markComplete('s3')
    const s3 = useSprintsStore.getState().sprints.find((s) => s.id === 's3')
    expect(s3?.status).toBe('completed')
    expect(s3?.progress).toBe(100)
  })
})
