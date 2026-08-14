import { useEffect, useState } from 'react'

// Mirrors the original's own animation: reset to 0%, then double-rAF to the
// real width (index.html:7609-7614, :7683-7688, :7740). Unlike useCountUp
// (Phase 3.1), there is no "already animated" guard — the original always
// restarts this from 0% because it rebuilds the whole grid/list DOM on every
// sort/filter/search, so this hook intentionally replays on every `target`
// change, not just on mount.
export function useAnimatedWidth(target: number): number {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWidth(0)
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setWidth(target))
    })
    return () => cancelAnimationFrame(frame)
  }, [target])

  return width
}
