import { describe, it, expect } from 'vitest'
import { useTeamStore } from './teamStore'

describe('teamStore', () => {
  it('starts seeded with 8 team members', () => {
    expect(useTeamStore.getState().members).toHaveLength(8)
  })

  it('contains members from all 4 departments', () => {
    const depts = new Set(useTeamStore.getState().members.map((m) => m.dept))
    expect(depts).toContain('Development')
    expect(depts).toContain('Design')
    expect(depts).toContain('Management')
    expect(depts).toContain('Marketing')
  })
})
