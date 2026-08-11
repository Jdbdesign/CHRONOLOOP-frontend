import { describe, it, expect, beforeEach } from 'vitest'
import { useDashboardUiStore } from './dashboardUiStore'

describe('dashboardUiStore', () => {
  beforeEach(() => {
    useDashboardUiStore.setState({ activeModal: null, selectedMemberId: null })
  })

  it('opens and closes the Add Task modal', () => {
    useDashboardUiStore.getState().openAddTask()
    expect(useDashboardUiStore.getState().activeModal).toBe('addTask')
    useDashboardUiStore.getState().closeModal()
    expect(useDashboardUiStore.getState().activeModal).toBeNull()
  })

  it('opens the Member modal with the selected member id', () => {
    useDashboardUiStore.getState().openMember('AS')
    expect(useDashboardUiStore.getState()).toMatchObject({ activeModal: 'member', selectedMemberId: 'AS' })
  })
})
