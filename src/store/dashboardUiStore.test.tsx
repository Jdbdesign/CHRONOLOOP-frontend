import { describe, it, expect, beforeEach } from 'vitest'
import { useDashboardUiStore } from './dashboardUiStore'

describe('dashboardUiStore', () => {
  beforeEach(() => {
    useDashboardUiStore.setState({ activeModal: null, selectedMemberId: null })
  })

  it('opens the Member modal with the selected member id', () => {
    useDashboardUiStore.getState().openMember('AS')
    expect(useDashboardUiStore.getState()).toMatchObject({ activeModal: 'member', selectedMemberId: 'AS' })
  })
})
