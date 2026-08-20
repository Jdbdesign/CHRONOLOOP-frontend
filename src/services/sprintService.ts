import type { EditSprintInput, NewSprintInput, Sprint } from '../types/sprint'

export function formatDate(raw: string): string {
  return raw
    ? new Date(`${raw}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBD'
}

export function buildNewSprint(existingSprints: Sprint[], input: NewSprintInput): Promise<Sprint> {
  const number = `SPRINT ${String(existingSprints.length + 1).padStart(2, '0')}`
  return Promise.resolve({
    id: `s_${Date.now()}`,
    number,
    name: input.name,
    goal: input.goal || 'No goal defined.',
    status: 'planning',
    startDate: formatDate(input.startRaw),
    endDate: formatDate(input.endRaw),
    startRaw: input.startRaw,
    endRaw: input.endRaw,
    daysLeft: 30,
    progress: 0,
    storyPoints: input.storyPoints,
    completedPoints: 0,
    tasksTotal: 0,
    tasksDone: 0,
    inProgress: 0,
    todo: 0,
    color: '#EAB308',
    project: input.project,
    velocity: null,
    team: [{ i: 'JA', c: '#4A90FF' }],
    burndown: [],
    sprintTasks: [],
  })
}

export function applySprintEdit(sprint: Sprint, input: EditSprintInput): Promise<Sprint> {
  return Promise.resolve({
    ...sprint,
    name: input.name,
    goal: input.goal,
    storyPoints: input.storyPoints,
    status: input.status,
    project: input.project,
    startDate: input.startRaw ? formatDate(input.startRaw) : sprint.startDate,
    startRaw: input.startRaw || sprint.startRaw,
    endDate: input.endRaw ? formatDate(input.endRaw) : sprint.endDate,
    endRaw: input.endRaw || sprint.endRaw,
    progress: input.status === 'completed' ? 100 : sprint.progress,
  })
}

export function withoutSprint(sprints: Sprint[], id: string): Promise<Sprint[]> {
  return Promise.resolve(sprints.filter((s) => s.id !== id))
}

export function completeSprint(sprint: Sprint): Promise<Sprint> {
  return Promise.resolve({ ...sprint, status: 'completed', progress: 100 })
}
