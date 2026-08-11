// src/hooks/useCountUp.ts
import { useEffect, useRef, useState } from 'react'

export function useCountUp(target: number, durationMs = 700): number {
  const [value, setValue] = useState(0)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    // Only the first render (mount) plays the animated count-up, matching the
    // original countUp() at index.html:6768-6782. Any later target change —
    // e.g. the "To-do" KPI updating live when a task is added — snaps
    // instantly, matching the plain textContent set at index.html:6705-6706.
    if (hasAnimatedRef.current) {
      setValue(target)
      return
    }

    let frame: number
    const startTimeout = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1)
        setValue(Math.round((1 - Math.pow(1 - progress, 3)) * target))
        if (progress < 1) {
          frame = requestAnimationFrame(tick)
        } else {
          hasAnimatedRef.current = true
        }
      }
      frame = requestAnimationFrame(tick)
    }, 300)

    return () => {
      clearTimeout(startTimeout)
      cancelAnimationFrame(frame)
    }
  }, [target, durationMs])

  return value
}
