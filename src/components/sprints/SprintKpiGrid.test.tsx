import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { SprintKpiGrid } from './SprintKpiGrid'
import { useSprintsStore } from '../../store/sprintsStore'
import { MOCK_SPRINTS } from '../../data/mockSprints'

describe('SprintKpiGrid', () => {
  beforeEach(() => {
    useSprintsStore.setState({ sprints: MOCK_SPRINTS })
    vi.useFakeTimers()
  })

  it('renders 5 KPI cards computed from the full sprint list', () => {
    render(<SprintKpiGrid />)
    // useCountUp's animation is gated behind a 300ms setTimeout + 700ms RAF
    // tween (700ms default duration), so advancing timers must cover the full
    // 1000ms and be wrapped in act() to flush the resulting state updates —
    // matching the pattern in KpiGrid.test.tsx (Phase 3.1 Dashboard KPI grid).
    act(() => vi.advanceTimersByTime(1000))

    expect(screen.getByText('Total Sprints')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument() // total
    expect(screen.getByText('Active Sprint')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument() // completed (s1, s2)
    expect(screen.getByText('Avg Velocity')).toBeInTheDocument()
    expect(screen.getByText('40')).toBeInTheDocument() // round((42+38)/2)
    expect(screen.getByText('Points Delivered')).toBeInTheDocument()
    expect(screen.getByText('106')).toBeInTheDocument() // 42+38+26+0+0 = 106 (CONTROLLER RULING: plan's original literal said '80', which is actually 42+38 — the Avg Velocity numerator, mistakenly reused. The correct sum of all 5 completedPoints is 106.)
    vi.useRealTimers()
  })
})
