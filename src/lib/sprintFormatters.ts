import { PlayCircle, CheckCircle2, ClipboardList, Clock } from 'lucide-react'
import type { Sprint, SprintStatus } from '../types/sprint'

export const SPRINT_STATUS_CONFIG = {
  active: { label: 'Active', icon: PlayCircle },
  completed: { label: 'Completed', icon: CheckCircle2 },
  planning: { label: 'Planning', icon: ClipboardList },
  upcoming: { label: 'Upcoming', icon: Clock },
} as const satisfies Record<SprintStatus, { label: string; icon: unknown }>

// Matches renderSprintsPage()'s sort switch (index.html:7981-7986) exactly,
// including the id-order fallback for the default 'number' mode.
export function sprintSortComparator(sortMode: string) {
  return (a: Sprint, b: Sprint) => {
    if (sortMode === 'name') return a.name.localeCompare(b.name)
    if (sortMode === 'progress') return b.progress - a.progress
    if (sortMode === 'storyPts') return b.storyPoints - a.storyPoints
    return a.id.localeCompare(b.id)
  }
}
