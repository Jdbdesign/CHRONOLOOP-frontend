// src/hooks/useCountUp.ts
import { useEffect, useState } from 'react'

export function useCountUp(target: number, durationMs = 700): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame: number
    const startTimeout = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1)
        setValue(Math.round((1 - Math.pow(1 - progress, 3)) * target))
        if (progress < 1) frame = requestAnimationFrame(tick)
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
