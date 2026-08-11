// src/hooks/useCountUp.test.tsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCountUp } from './useCountUp'

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // The animation is a 300ms setTimeout delay followed by a 700ms rAF loop
  // (=1000ms total), but fake-timer rAF ticks land on ~16ms boundaries, so
  // advancing by exactly 1000ms can land just short of the loop's final,
  // progress>=1 tick. Advance with margin so the loop actually completes.
  const ANIMATION_MS = 1100

  it('animates from 0 up to the target on mount', () => {
    const { result } = renderHook(() => useCountUp(45))

    expect(result.current).toBe(0)

    act(() => {
      vi.advanceTimersByTime(ANIMATION_MS)
    })

    expect(result.current).toBe(45)
  })

  it('snaps instantly to a new target on a later change, without re-animating', () => {
    const { result, rerender } = renderHook(({ target }) => useCountUp(target), {
      initialProps: { target: 45 },
    })

    act(() => {
      vi.advanceTimersByTime(ANIMATION_MS)
    })
    expect(result.current).toBe(45)

    act(() => {
      rerender({ target: 6 })
    })

    // No setTimeout/rAF delay this time: the value should update on the same
    // tick, not climb back up from near-zero over another 300ms + 700ms.
    expect(result.current).toBe(6)

    // Advancing timers further must not kick off a fresh animation.
    act(() => {
      vi.advanceTimersByTime(ANIMATION_MS)
    })
    expect(result.current).toBe(6)
  })
})
