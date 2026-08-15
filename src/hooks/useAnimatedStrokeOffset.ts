import { useEffect, useState } from 'react'

// Generalizes useAnimatedWidth's reset-then-double-rAF trick
// (src/hooks/useAnimatedWidth.ts) to an SVG ring's stroke-dashoffset.
// Mirrors index.html:8042-8043 (offset math) and :8102-8105 (the
// double-rAF that sets .style.strokeDashoffset after the ring first
// paints fully unfilled) — same "always replay, no mount-once guard"
// behavior as useAnimatedWidth, since the original rebuilds the whole
// banner on every renderSprintsPage() call.
export function useAnimatedStrokeOffset(circumference: number, progressPct: number): number {
  const [offset, setOffset] = useState(circumference)

  useEffect(() => {
    const target = circumference * (1 - progressPct / 100)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOffset(circumference)
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setOffset(target))
    })
    return () => cancelAnimationFrame(frame)
  }, [circumference, progressPct])

  return offset
}
