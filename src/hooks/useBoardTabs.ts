import { useState } from 'react'

/**
 * Simple local state hook for tracking which board column tab is active on mobile.
 * Resets to the first column on remount (by design — approved in R.5 Flag 1).
 */
export function useBoardTabs<T extends string>(columns: readonly T[]) {
  const [activeColumn, setActiveColumn] = useState<T>(columns[0])
  return { activeColumn, setActiveColumn } as const
}
