import type { NewProjectInput, Project } from '../types/project'

export function buildNewProject(input: NewProjectInput): Promise<Project> {
  return Promise.resolve({
    id: `p_new_${Date.now()}`,
    name: input.name,
    client: input.client || 'No client',
    category: input.category,
    status: 'active',
    priority: input.priority,
    progress: 0,
    color: input.color,
    tasksTotal: 0,
    tasksDone: 0,
    // Hardcoded to 30 regardless of the chosen due date — matches the
    // original's own btn-create-project handler (index.html:8498),
    // which never computes a real day-delta from proj-due-input.
    // Fixed for real once the backend computes this from dueDate - now()
    // (see docs/superpowers/specs/2026-08-19-chronoloop-backend-design.md §1).
    dueDays: 30,
    dueDate: input.dueDate,
    desc: input.desc || 'No description provided.',
    team: [{ i: 'JA', c: '#4A90FF', n: 'Jacobs A.' }],
    milestones: [],
  })
}

export function withoutProject(projects: Project[], id: string): Promise<Project[]> {
  return Promise.resolve(projects.filter((p) => p.id !== id))
}
