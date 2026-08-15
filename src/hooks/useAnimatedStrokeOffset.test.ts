import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnimatedStrokeOffset } from './useAnimatedStrokeOffset'

describe('useAnimatedStrokeOffset', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts fully unfilled (offset === circumference) then animates to the target offset', () => {
    // circumference 264 (r=42), progress 58% -> target offset = 264 * (1 - 0.58) = 110.88
    const { result } = renderHook(() => useAnimatedStrokeOffset(264, 58))
    expect(result.current).toBe(264)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(result.current).toBeCloseTo(110.88, 2)
  })

  it('replays from full-circumference on every progress change', () => {
    const { result, rerender } = renderHook(({ progress }) => useAnimatedStrokeOffset(264, progress), {
      initialProps: { progress: 20 },
    })

    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBeCloseTo(264 * 0.8, 2)

    act(() => {
      rerender({ progress: 90 })
    })
    expect(result.current).toBe(264)

    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBeCloseTo(264 * 0.1, 2)
  })

  it('returns 0 offset (fully filled) at 100% progress', () => {
    const { result } = renderHook(() => useAnimatedStrokeOffset(264, 100))
    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBeCloseTo(0, 2)
  })
})
