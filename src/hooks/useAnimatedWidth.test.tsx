import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnimatedWidth } from './useAnimatedWidth'

describe('useAnimatedWidth', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at 0 then reaches the target after two animation frames', () => {
    const { result } = renderHook(() => useAnimatedWidth(72))
    expect(result.current).toBe(0)

    act(() => {
      vi.advanceTimersByTime(50)
    })

    expect(result.current).toBe(72)
  })

  it('replays from 0 on every target change, unlike a mount-once animation', () => {
    const { result, rerender } = renderHook(({ target }) => useAnimatedWidth(target), {
      initialProps: { target: 40 },
    })

    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBe(40)

    act(() => {
      rerender({ target: 85 })
    })
    expect(result.current).toBe(0)

    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBe(85)
  })
})
