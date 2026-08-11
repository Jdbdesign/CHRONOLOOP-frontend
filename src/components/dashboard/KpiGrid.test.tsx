// src/components/dashboard/KpiGrid.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { KpiGrid } from './KpiGrid'
import { useTasksStore } from '../../store/tasksStore'
import { MOCK_TASKS } from '../../data/mockTasks'

describe('KpiGrid', () => {
  beforeEach(() => {
    useTasksStore.setState({ tasks: MOCK_TASKS, todoKpiOverride: null })
    vi.useFakeTimers()
  })

  it('renders all five KPI cards with their original static labels', () => {
    render(<KpiGrid />)
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByText('To-do')).toBeInTheDocument()
    expect(screen.getByText('Total Project')).toBeInTheDocument()
    expect(screen.getByText('Assigned Tasks')).toBeInTheDocument()
    expect(screen.getByText('Completed Task')).toBeInTheDocument()
    expect(screen.getByText('Overdue Tasks')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('uses the live todo count for the To-do card once todoKpiOverride is set', () => {
    useTasksStore.setState({ todoKpiOverride: 6 })
    render(<KpiGrid />)
    act(() => vi.advanceTimersByTime(1000))
    expect(screen.getByText('6')).toBeInTheDocument()
    vi.useRealTimers()
  })
})
