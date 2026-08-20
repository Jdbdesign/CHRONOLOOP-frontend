# B0 — Services Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a `src/services/*.ts` layer per domain so every Zustand store's mutation logic (currently inlined `set()` callbacks touching `src/data/mock*.ts` arrays directly) is relocated into pure, testable functions — the seam that later phases (F1–F8) will swap from mock logic to real `fetch` calls, one file at a time.

**Architecture:** For each of 6 domains (tasks, projects, sprints, calendar, integrations, settings — team is excluded, see Global Constraints), extract the store's current inline computation (id generation, field defaulting/merging, array add/remove/toggle) into named pure functions in `src/services/<domain>Service.ts`. The store keeps owning `set()`/`get()` and any UI-derived state (e.g. `todoKpiOverride`), but calls the service function to compute the new value instead of inlining the logic itself. No behavior changes; this is a refactor under existing test coverage, not new-feature TDD — the step pattern per task is **create service → confirm baseline tests still pass → refactor store to delegate → confirm tests still pass unmodified**, rather than red→green.

**Tech Stack:** TypeScript, Zustand 5, Vitest 4, pnpm.

**Spec:** [docs/superpowers/specs/2026-08-19-chronoloop-backend-design.md](../specs/2026-08-19-chronoloop-backend-design.md) §4 (Migration strategy).

## Global Constraints

- **Zero behavior change to computed values.** Preserve existing quirks/bugs verbatim — including the `dueDays: 30` hardcoding bug in `projectService.buildNewProject` and `daysLeft: 30` in `sprintService.buildNewSprint` (both are documented, known bugs the spec says B3/B4 fix later, not B0).
- **Services stay synchronous in B0.** Per the confirmed architecture decision: making services return real Promises now would force every mutating store action to become `async`, which breaks every synchronous test assertion across all 7 store test files, `useDeleteWithUndo.test.tsx`, and an unknown subset of the 33 component tests that click a mutating action and assert the DOM synchronously — none of which is actually asynchronous yet. That cost is deferred to each domain's own F-phase, when a real `fetch` call is introduced and loading states genuinely become necessary. **Do not add `async`/`Promise` return types to any service function or store action in this plan.**
- **`VITE_USE_MOCK_DATA` is deferred, not scaffolded.** It has nothing to branch on until a domain has both a mock and a real implementation (F-phase). Introducing it now with a single always-true branch is dead weight — do not add it in this plan.
- **No `teamService.ts` in this plan.** `teamStore` ([src/store/teamStore.ts](../../../src/store/teamStore.ts)) has zero mutating actions today — it only seeds `members` from `TEAM_MEMBERS` at module load. There is no mutation logic to relocate. A service file is created for this domain only when it gets its first real mutation (e.g. a role/status change) or when B6/F6 needs `list()` for async hydration.
- **`removeProject`/`removeSprint`/`removeWebhook` etc. are extracted too, even though they're one-line filters.** Every mutation needs a service-layer seam eventually (each becomes a real `DELETE`/`PATCH` call in its B-phase), so route all of them through the service for consistency — the one exception is single-primitive passthrough setters with zero transformation (`setDigestFrequency`, `setAccentColor`'s data field, `resendInvite`'s intentional no-op): those stay inline in the store, since there's no logic to relocate and wrapping them in a function would be pure ceremony.
- **Windows dev machine, pnpm.** Use `pnpm vitest run <path>` for targeted test runs and `pnpm test` / `pnpm typecheck` / `pnpm lint` for full-suite checks, matching `package.json` scripts.
- **No `import.meta.env` / no new env vars, no new dependencies.** This phase only moves existing code between files.

---

### Task 1: Task service extraction

**Files:**
- Create: `src/services/taskService.ts`
- Modify: `src/store/tasksStore.ts`
- Test (unmodified, used to verify): `src/store/tasksStore.test.tsx`

**Interfaces:**
- Consumes: `NewTaskInput`, `Task`, `TaskStatus` from `../types/task` (unchanged).
- Produces (for the store to call): `buildNewTask(existingTasks, input)`, `applyTaskEdit(task, input)`, `setTaskStatus(task, status)`, `addSubtaskTo(task, text)`, `toggleSubtaskAt(task, index)`, `setTaskDescription(task, description)`, `addCommentTo(task, text)`, `removeTaskAt(tasks, id)`, `restoreTaskAt(tasks, task, index)`.

- [ ] **Step 1: Run the existing test file to confirm the baseline is green**

Run: `pnpm vitest run src/store/tasksStore.test.tsx`
Expected: PASS (11 tests) — this is the behavior contract Task 1 must not break.

- [ ] **Step 2: Create `src/services/taskService.ts`**

```typescript
import type { NewTaskInput, Task, TaskStatus } from '../types/task'

const ASSIGNEE_COLOR: Record<string, string> = {
  AS: 'linear-gradient(135deg,#4A90FF,#2563eb)',
  RD: 'linear-gradient(135deg,#FF8C42,#ea580c)',
  MV: 'linear-gradient(135deg,#A855F7,#7c3aed)',
  RC: 'linear-gradient(135deg,#00D4AA,#059669)',
}

export function buildNewTask(existingTasks: Task[], input: NewTaskInput): Task {
  const newId = existingTasks.length > 0 ? Math.max(...existingTasks.map((t) => t.id)) + 1 : 1
  return {
    id: newId,
    title: input.title,
    project: input.project,
    assignee: input.assignee,
    aColor: ASSIGNEE_COLOR[input.assignee] ?? 'linear-gradient(135deg,#4A90FF,#2563eb)',
    priority: input.priority,
    status: 'todo',
    due: input.due,
    tags: [],
    subtasks: [],
    comments: [],
    attachments: [],
    description: input.description,
  }
}

export function applyTaskEdit(task: Task, input: NewTaskInput): Task {
  return {
    ...task,
    title: input.title,
    project: input.project,
    assignee: input.assignee,
    aColor: ASSIGNEE_COLOR[input.assignee] ?? task.aColor,
    due: input.due,
    priority: input.priority,
    description: input.description,
  }
}

export function setTaskStatus(task: Task, status: 'todo' | 'done'): Task {
  return { ...task, status: status as TaskStatus }
}

export function addSubtaskTo(task: Task, text: string): Task {
  return { ...task, subtasks: [...task.subtasks, { t: text, done: false }] }
}

export function toggleSubtaskAt(task: Task, index: number): Task {
  return {
    ...task,
    subtasks: task.subtasks.map((s, i) => (i === index ? { ...s, done: !s.done } : s)),
  }
}

export function setTaskDescription(task: Task, description: string): Task {
  return { ...task, description }
}

export function addCommentTo(task: Task, text: string): Task {
  return {
    ...task,
    comments: [...task.comments, { author: 'You', text, time: 'Just now' }],
  }
}

export function removeTaskAt(
  tasks: Task[],
  id: number,
): { task: Task; index: number; remaining: Task[] } | null {
  const index = tasks.findIndex((t) => t.id === id)
  if (index < 0) return null
  const task = tasks[index]
  return { task, index, remaining: [...tasks.slice(0, index), ...tasks.slice(index + 1)] }
}

export function restoreTaskAt(tasks: Task[], task: Task, index: number): Task[] {
  const next = [...tasks]
  next.splice(index, 0, task)
  return next
}
```

- [ ] **Step 3: Rewrite `src/store/tasksStore.ts` to delegate to the service**

```typescript
import { create } from 'zustand'
import type { NewTaskInput, Task } from '../types/task'
import { MOCK_TASKS } from '../data/mockTasks'
import * as taskService from '../services/taskService'

interface TasksState {
  tasks: Task[]
  todoKpiOverride: number | null
  addTask: (input: NewTaskInput) => void
  updateTask: (id: number, input: NewTaskInput) => void
  removeTask: (id: number) => { task: Task; index: number } | null
  restoreTask: (task: Task, index: number) => void
  setTaskStatus: (id: number, status: 'todo' | 'done') => void
  addSubtask: (id: number, text: string) => void
  toggleSubtask: (id: number, index: number) => void
  updateTaskDescription: (id: number, description: string) => void
  addComment: (id: number, text: string) => void
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: MOCK_TASKS,
  todoKpiOverride: null,
  addTask: (input) => {
    const { tasks } = get()
    const nextTasks = [...tasks, taskService.buildNewTask(tasks, input)]
    set({
      tasks: nextTasks,
      todoKpiOverride: nextTasks.filter((t) => t.status === 'todo').length,
    })
  },
  updateTask: (id, input) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? taskService.applyTaskEdit(task, input) : task)),
    }))
  },
  removeTask: (id) => {
    const { tasks } = get()
    const result = taskService.removeTaskAt(tasks, id)
    if (!result) return null
    set({ tasks: result.remaining })
    return { task: result.task, index: result.index }
  },
  restoreTask: (task, index) => {
    set((state) => ({ tasks: taskService.restoreTaskAt(state.tasks, task, index) }))
  },
  setTaskStatus: (id, status) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? taskService.setTaskStatus(task, status) : task)),
    }))
  },
  addSubtask: (id, text) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? taskService.addSubtaskTo(task, text) : task)),
    }))
  },
  toggleSubtask: (id, index) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? taskService.toggleSubtaskAt(task, index) : task)),
    }))
  },
  updateTaskDescription: (id, description) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? taskService.setTaskDescription(task, description) : task)),
    }))
  },
  addComment: (id, text) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? taskService.addCommentTo(task, text) : task)),
    }))
  },
}))
```

- [ ] **Step 4: Run the test file again to confirm it's still green, unmodified**

Run: `pnpm vitest run src/store/tasksStore.test.tsx`
Expected: PASS (11 tests), zero changes to the test file itself.

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/services/taskService.ts src/store/tasksStore.ts
git commit -m "feat: Phase B0 — extract task mutation logic into taskService"
```

---

### Task 2: Project service extraction

**Files:**
- Create: `src/services/projectService.ts`
- Modify: `src/store/projectsStore.ts`
- Test (unmodified, used to verify): `src/store/projectsStore.test.tsx`

**Interfaces:**
- Consumes: `NewProjectInput`, `Project` from `../types/project`.
- Produces: `buildNewProject(input)`, `withoutProject(projects, id)`.

- [ ] **Step 1: Run the existing test file to confirm the baseline is green**

Run: `pnpm vitest run src/store/projectsStore.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 2: Create `src/services/projectService.ts`**

```typescript
import type { NewProjectInput, Project } from '../types/project'

export function buildNewProject(input: NewProjectInput): Project {
  return {
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
  }
}

export function withoutProject(projects: Project[], id: string): Project[] {
  return projects.filter((p) => p.id !== id)
}
```

- [ ] **Step 3: Rewrite `src/store/projectsStore.ts` to delegate to the service**

```typescript
import { create } from 'zustand'
import type { NewProjectInput, Project } from '../types/project'
import { MOCK_PROJECTS } from '../data/mockProjects'
import * as projectService from '../services/projectService'

interface ProjectsState {
  projects: Project[]
  addProject: (input: NewProjectInput) => void
  removeProject: (id: string) => void
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: MOCK_PROJECTS,
  addProject: (input) => {
    set((state) => ({ projects: [projectService.buildNewProject(input), ...state.projects] }))
  },
  removeProject: (id) => {
    set((state) => ({ projects: projectService.withoutProject(state.projects, id) }))
  },
}))
```

- [ ] **Step 4: Run the test file again to confirm it's still green, unmodified**

Run: `pnpm vitest run src/store/projectsStore.test.tsx`
Expected: PASS (4 tests), zero changes to the test file itself.

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/services/projectService.ts src/store/projectsStore.ts
git commit -m "feat: Phase B0 — extract project mutation logic into projectService"
```

---

### Task 3: Sprint service extraction

**Files:**
- Create: `src/services/sprintService.ts`
- Modify: `src/store/sprintsStore.ts`
- Test (unmodified, used to verify): `src/store/sprintsStore.test.ts`

**Interfaces:**
- Consumes: `EditSprintInput`, `NewSprintInput`, `Sprint` from `../types/sprint`.
- Produces: `formatDate(raw)`, `buildNewSprint(existingSprints, input)`, `applySprintEdit(sprint, input)`, `withoutSprint(sprints, id)`, `completeSprint(sprint)`.

- [ ] **Step 1: Run the existing test file to confirm the baseline is green**

Run: `pnpm vitest run src/store/sprintsStore.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 2: Create `src/services/sprintService.ts`**

```typescript
import type { EditSprintInput, NewSprintInput, Sprint } from '../types/sprint'

export function formatDate(raw: string): string {
  return raw
    ? new Date(`${raw}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'TBD'
}

export function buildNewSprint(existingSprints: Sprint[], input: NewSprintInput): Sprint {
  const number = `SPRINT ${String(existingSprints.length + 1).padStart(2, '0')}`
  return {
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
  }
}

export function applySprintEdit(sprint: Sprint, input: EditSprintInput): Sprint {
  return {
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
  }
}

export function withoutSprint(sprints: Sprint[], id: string): Sprint[] {
  return sprints.filter((s) => s.id !== id)
}

export function completeSprint(sprint: Sprint): Sprint {
  return { ...sprint, status: 'completed', progress: 100 }
}
```

- [ ] **Step 3: Rewrite `src/store/sprintsStore.ts` to delegate to the service**

```typescript
import { create } from 'zustand'
import type { EditSprintInput, NewSprintInput, Sprint } from '../types/sprint'
import { MOCK_SPRINTS } from '../data/mockSprints'
import * as sprintService from '../services/sprintService'

interface SprintsState {
  sprints: Sprint[]
  addSprint: (input: NewSprintInput) => void
  updateSprint: (id: string, input: EditSprintInput) => void
  removeSprint: (id: string) => void
  markComplete: (id: string) => void
}

export const useSprintsStore = create<SprintsState>((set) => ({
  sprints: MOCK_SPRINTS,
  addSprint: (input) => {
    set((state) => ({ sprints: [sprintService.buildNewSprint(state.sprints, input), ...state.sprints] }))
  },
  updateSprint: (id, input) => {
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === id ? sprintService.applySprintEdit(s, input) : s)),
    }))
  },
  removeSprint: (id) => {
    set((state) => ({ sprints: sprintService.withoutSprint(state.sprints, id) }))
  },
  markComplete: (id) => {
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === id ? sprintService.completeSprint(s) : s)),
    }))
  },
}))
```

- [ ] **Step 4: Run the test file again to confirm it's still green, unmodified**

Run: `pnpm vitest run src/store/sprintsStore.test.ts`
Expected: PASS (6 tests), zero changes to the test file itself.

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/services/sprintService.ts src/store/sprintsStore.ts
git commit -m "feat: Phase B0 — extract sprint mutation logic into sprintService"
```

---

### Task 4: Calendar service extraction

**Files:**
- Create: `src/services/calendarService.ts`
- Modify: `src/store/calendarStore.ts`
- Test (unmodified, used to verify): `src/store/calendarStore.test.ts`

**Interfaces:**
- Consumes: `CalendarEvent`, `NewCalendarEventInput` from `../types/calendar`.
- Produces: `buildNewCalendarEvent(input)`.
- Note: `view`/`filter`/`currentDate`/navigation are ephemeral client-side UI/nav state, not persisted `CalendarEvent` data (per the spec, there's no backend concept of "current calendar view") — `setView`, `setFilter`, `navigate`, `goToday`, `setCurrentDate` stay exactly as-is in the store, untouched by this task.

- [ ] **Step 1: Run the existing test file to confirm the baseline is green**

Run: `pnpm vitest run src/store/calendarStore.test.ts`
Expected: PASS (11 tests).

- [ ] **Step 2: Create `src/services/calendarService.ts`**

```typescript
import type { CalendarEvent, NewCalendarEventInput } from '../types/calendar'

const TYPE_COLORS: Record<string, string> = {
  task: '#4A90FF',
  project: '#A855F7',
  sprint: '#00D4AA',
  meeting: '#FF8C42',
}

export function buildNewCalendarEvent(input: NewCalendarEventInput): CalendarEvent {
  return {
    id: 'user-' + Date.now(),
    type: input.type,
    title: input.title,
    date: input.date,
    startDate: input.date,
    endDate: input.endDate || input.date,
    time: input.time,
    duration: 60,
    project: input.project,
    assignee: input.assignee,
    priority: input.priority,
    status: 'todo',
    color: TYPE_COLORS[input.type] || '#4A90FF',
    progress: 0,
    notes: input.notes,
    isMultiDay: !!(input.endDate && input.endDate !== input.date),
  }
}
```

- [ ] **Step 3: Modify `src/store/calendarStore.ts` to delegate `addUserEvent` to the service**

```typescript
import { create } from 'zustand'
import type { CalendarEvent, CalendarFilter, CalendarView, NewCalendarEventInput } from '../types/calendar'
import { calNavigate } from '../lib/calendarHelpers'
import * as calendarService from '../services/calendarService'

interface CalendarState {
  view: CalendarView
  currentDate: Date
  filter: CalendarFilter
  userEvents: CalendarEvent[]
  setView: (v: CalendarView) => void
  setFilter: (f: CalendarFilter) => void
  navigate: (dir: 1 | -1) => void
  goToday: () => void
  setCurrentDate: (d: Date) => void
  addUserEvent: (input: NewCalendarEventInput) => void
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  view: 'month',
  currentDate: new Date(2024, 10, 1), // Nov 1, 2024
  filter: 'all',
  userEvents: [],

  setView: (v) => set({ view: v }),
  setFilter: (f) => set({ filter: f }),
  navigate: (dir) => {
    const { view, currentDate } = get()
    set({ currentDate: calNavigate(view, currentDate, dir) })
  },
  goToday: () => set({ currentDate: new Date() }),
  setCurrentDate: (d) => set({ currentDate: d }),

  addUserEvent: (input) => {
    set((state) => ({ userEvents: [...state.userEvents, calendarService.buildNewCalendarEvent(input)] }))
  },
}))
```

- [ ] **Step 4: Run the test file again to confirm it's still green, unmodified**

Run: `pnpm vitest run src/store/calendarStore.test.ts`
Expected: PASS (11 tests), zero changes to the test file itself.

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/services/calendarService.ts src/store/calendarStore.ts
git commit -m "feat: Phase B0 — extract calendar event creation into calendarService"
```

---

### Task 5: Integrations service extraction

**Files:**
- Create: `src/services/integrationsService.ts`
- Modify: `src/store/integrationsStore.ts`
- Test (unmodified, used to verify): `src/store/integrationsStore.test.ts`

**Interfaces:**
- Consumes: `IntApp`, `IntWebhook`, `IntSyncRule`, `IntApiKey` from `../data/mockIntegrations`.
- Produces: `NewApiKeyInput` (type), `connectAppStatus(apps, id)`, `disconnectAppStatus(apps, id)`, `toggleWebhookAt(webhooks, index)`, `removeWebhookAt(webhooks, index)`, `toggleSyncRuleAt(rules, index)`, `buildNewApiKey(input)`.

- [ ] **Step 1: Run the existing test file to confirm the baseline is green**

Run: `pnpm vitest run src/store/integrationsStore.test.ts`
Expected: PASS (6 tests).

- [ ] **Step 2: Create `src/services/integrationsService.ts`**

```typescript
import type { IntApp, IntWebhook, IntSyncRule, IntApiKey } from '../data/mockIntegrations'

export interface NewApiKeyInput {
  label: string
  scope: string
  expires: string
  rateLimit: string
  ipWhitelist: string
}

export function connectAppStatus(apps: IntApp[], id: string): IntApp[] {
  return apps.map((a) => (a.id === id ? { ...a, status: 'connected' as const, syncedAt: 'Just now', users: 1 } : a))
}

export function disconnectAppStatus(apps: IntApp[], id: string): IntApp[] {
  return apps.map((a) =>
    a.id === id ? { ...a, status: 'available' as const, syncedAt: null, users: 0, calls: 0 } : a,
  )
}

export function toggleWebhookAt(webhooks: IntWebhook[], index: number): IntWebhook[] {
  return webhooks.map((w, i) => (i === index ? { ...w, active: !w.active } : w))
}

export function removeWebhookAt(webhooks: IntWebhook[], index: number): IntWebhook[] {
  return webhooks.filter((_, i) => i !== index)
}

export function toggleSyncRuleAt(rules: IntSyncRule[], index: number): IntSyncRule[] {
  return rules.map((r, i) => (i === index ? { ...r, on: !r.on } : r))
}

export function buildNewApiKey(input: NewApiKeyInput): IntApiKey {
  return {
    id: `k_${Date.now()}`,
    label: input.label,
    val: `ck_new_••••••••${Math.random().toString(36).slice(-4)}`,
    scope: input.scope,
    created: 'Today',
    expires: input.expires || 'Never',
  }
}
```

- [ ] **Step 3: Rewrite `src/store/integrationsStore.ts` to delegate to the service**

```typescript
import { create } from 'zustand'
import type { IntApp, IntWebhook, IntSyncRule, IntApiKey } from '../data/mockIntegrations'
import { INT_APPS, INT_WEBHOOKS, INT_SYNC_ROWS, INT_KEYS } from '../data/mockIntegrations'
import * as integrationsService from '../services/integrationsService'
import type { NewApiKeyInput } from '../services/integrationsService'

interface IntegrationsState {
  apps: IntApp[]
  webhooks: IntWebhook[]
  syncRules: IntSyncRule[]
  apiKeys: IntApiKey[]
  connectApp: (id: string) => void
  disconnectApp: (id: string) => void
  toggleWebhook: (index: number) => void
  removeWebhook: (index: number) => void
  toggleSyncRule: (index: number) => void
  addApiKey: (input: NewApiKeyInput) => void
}

export const useIntegrationsStore = create<IntegrationsState>((set) => ({
  apps: INT_APPS,
  webhooks: [...INT_WEBHOOKS],
  syncRules: [...INT_SYNC_ROWS],
  apiKeys: [...INT_KEYS],

  connectApp: (id) => set((state) => ({ apps: integrationsService.connectAppStatus(state.apps, id) })),

  disconnectApp: (id) => set((state) => ({ apps: integrationsService.disconnectAppStatus(state.apps, id) })),

  toggleWebhook: (index) =>
    set((state) => ({ webhooks: integrationsService.toggleWebhookAt(state.webhooks, index) })),

  removeWebhook: (index) =>
    set((state) => ({ webhooks: integrationsService.removeWebhookAt(state.webhooks, index) })),

  toggleSyncRule: (index) =>
    set((state) => ({ syncRules: integrationsService.toggleSyncRuleAt(state.syncRules, index) })),

  addApiKey: (input) =>
    set((state) => ({ apiKeys: [...state.apiKeys, integrationsService.buildNewApiKey(input)] })),
}))
```

- [ ] **Step 4: Run the test file again to confirm it's still green, unmodified**

Run: `pnpm vitest run src/store/integrationsStore.test.ts`
Expected: PASS (6 tests), zero changes to the test file itself.

- [ ] **Step 5: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/services/integrationsService.ts src/store/integrationsStore.ts
git commit -m "feat: Phase B0 — extract integrations mutation logic into integrationsService"
```

---

### Task 6: Settings service extraction

**Files:**
- Create: `src/services/settingsService.ts`
- Modify: `src/store/settingsStore.ts`
- Test: no dedicated `settingsStore.test.ts` exists today (verify via `pnpm typecheck` + `pnpm test` full run in Task 7, and via the component tests that already exercise Settings tabs).

**Interfaces:**
- Produces (types): `ProfileState`, `WorkspaceState`, `NotificationToggles`, `SettingsSessionEntry`.
- Produces (functions): `mergeProfile(profile, updates)`, `mergeWorkspace(workspace, updates)`, `toggleNotificationFlag(notifications, key)`, `withoutSessionAt(sessions, index)`, `keepOnlyCurrentSession(sessions)`, `setRoleOverride(roleOverrides, memberId, role)`, `buildNewInvite(email, role)`, `withoutInvite(invites, email)`.
- `setDigestFrequency`, `setAccentColor`'s data assignment, and `resendInvite` stay inline in the store per Global Constraints (trivial passthrough / intentional no-op).

- [ ] **Step 1: Search for any existing settingsStore-specific test file to confirm none exists**

Run: `pnpm vitest run src/store/settingsStore.test.ts src/store/settingsStore.test.tsx`
Expected: "No test files found" — confirms there's no dedicated store test to keep green; correctness for this task is verified via typecheck + the full suite in Task 7 (several Settings tab component tests already exercise `updateProfile`, `toggleNotification`, `revokeSession`, invites, etc. through the UI).

- [ ] **Step 2: Create `src/services/settingsService.ts`**

```typescript
import type { PendingInvite } from '../data/mockSettingsData'

export interface ProfileState {
  firstName: string
  lastName: string
  jobTitle: string
  department: string
  bio: string
  email: string
  phone: string
  linkedin: string
  twitter: string
  timezone: string
  language: string
  dateFormat: string
  timeFormat: string
}

export interface WorkspaceState {
  name: string
  url: string
  description: string
  currency: string
  fiscalYear: string
  weekStart: string
  sprintDuration: string
  workFrom: string
  workTo: string
}

export interface NotificationToggles {
  all: boolean
  dnd: boolean
  emailAssigned: boolean
  emailComments: boolean
  emailDue1: boolean
  emailDue3: boolean
  emailSprint: boolean
  emailProject: boolean
  emailWeekly: boolean
  appStatus: boolean
  appNewMember: boolean
  appIntegration: boolean
  appOverdue: boolean
  appMentions: boolean
}

export interface SettingsSessionEntry {
  icon: string
  device: string
  meta: string
  current?: boolean
}

export function mergeProfile(profile: ProfileState, updates: Partial<ProfileState>): ProfileState {
  return { ...profile, ...updates }
}

export function mergeWorkspace(workspace: WorkspaceState, updates: Partial<WorkspaceState>): WorkspaceState {
  return { ...workspace, ...updates }
}

export function toggleNotificationFlag(
  notifications: NotificationToggles,
  key: keyof NotificationToggles,
): NotificationToggles {
  return { ...notifications, [key]: !notifications[key] }
}

export function withoutSessionAt(sessions: SettingsSessionEntry[], index: number): SettingsSessionEntry[] {
  return sessions.filter((_, i) => i !== index)
}

export function keepOnlyCurrentSession(sessions: SettingsSessionEntry[]): SettingsSessionEntry[] {
  return sessions.filter((session) => session.current)
}

export function setRoleOverride(
  roleOverrides: Record<string, string>,
  memberId: string,
  role: string,
): Record<string, string> {
  return { ...roleOverrides, [memberId]: role }
}

export function buildNewInvite(email: string, role: string): PendingInvite {
  return { email, role, sent: 'Today', expires: 'In 7 days' }
}

export function withoutInvite(invites: PendingInvite[], email: string): PendingInvite[] {
  return invites.filter((inv) => inv.email !== email)
}
```

- [ ] **Step 3: Rewrite `src/store/settingsStore.ts` to delegate to the service**

```typescript
import { create } from 'zustand'
import type { PendingInvite } from '../data/mockSettingsData'
import { PENDING_INVITES } from '../data/mockSettingsData'
import * as settingsService from '../services/settingsService'
import type {
  NotificationToggles,
  ProfileState,
  SettingsSessionEntry,
  WorkspaceState,
} from '../services/settingsService'

interface SettingsState {
  // Profile
  profile: ProfileState
  updateProfile: (updates: Partial<ProfileState>) => void

  // Workspace
  workspace: WorkspaceState
  updateWorkspace: (updates: Partial<WorkspaceState>) => void

  // Notifications
  notifications: NotificationToggles
  toggleNotification: (key: keyof NotificationToggles) => void
  digestFrequency: string
  setDigestFrequency: (freq: string) => void

  // Appearance
  accentColor: string
  setAccentColor: (color: string) => void

  // Security — sessions
  sessions: SettingsSessionEntry[]
  revokeSession: (index: number) => void
  revokeAllSessions: () => void

  // Team & Roles
  roleOverrides: Record<string, string>
  setMemberRole: (memberId: string, role: string) => void
  pendingInvites: PendingInvite[]
  addInvite: (email: string, role: string) => void
  revokeInvite: (email: string) => void
  resendInvite: (email: string) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  profile: {
    firstName: 'Jacob',
    lastName: 'Solayinka',
    jobTitle: 'Product Manager',
    department: 'Product',
    bio: 'Building better products one sprint at a time. Passionate about team collaboration and clean workflows.',
    email: 'jacobsolayinka19@gmail.com',
    phone: '',
    linkedin: '',
    twitter: '',
    timezone: 'UTC+01:00 — West Africa Time (Lagos)',
    language: 'English (US)',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12-hour (AM/PM)',
  },
  updateProfile: (updates) => set((s) => ({ profile: settingsService.mergeProfile(s.profile, updates) })),

  workspace: {
    name: 'ChronoLoop',
    url: 'my-workspace',
    description: "Managing product sprints, tasks, and team collaboration for ChronoLoop's core platform.",
    currency: 'USD — US Dollar',
    fiscalYear: 'January',
    weekStart: 'Monday',
    sprintDuration: '2 weeks',
    workFrom: '09:00',
    workTo: '18:00',
  },
  updateWorkspace: (updates) => set((s) => ({ workspace: settingsService.mergeWorkspace(s.workspace, updates) })),

  notifications: {
    all: true,
    dnd: false,
    emailAssigned: true,
    emailComments: true,
    emailDue1: true,
    emailDue3: false,
    emailSprint: true,
    emailProject: true,
    emailWeekly: true,
    appStatus: true,
    appNewMember: true,
    appIntegration: true,
    appOverdue: true,
    appMentions: true,
  },
  toggleNotification: (key) =>
    set((s) => ({ notifications: settingsService.toggleNotificationFlag(s.notifications, key) })),
  digestFrequency: 'immediate',
  setDigestFrequency: (freq) => set({ digestFrequency: freq }),

  accentColor: '#4A90FF',
  setAccentColor: (color) => {
    document.documentElement.style.setProperty('--accent-blue', color)
    set({ accentColor: color })
  },

  sessions: [
    { icon: 'monitor', device: 'Windows 11 — Chrome 124', meta: 'Lagos, Nigeria · 192.168.1.1', current: true },
    { icon: 'smartphone', device: 'iPhone 15 Pro — Safari', meta: 'Lagos, Nigeria · 2 hours ago' },
    { icon: 'tablet', device: 'iPad Air — Chrome', meta: 'Abuja, Nigeria · 3 days ago' },
    { icon: 'laptop', device: 'MacBook Air — Firefox 125', meta: 'London, UK · 1 week ago' },
  ],
  revokeSession: (index) => set((s) => ({ sessions: settingsService.withoutSessionAt(s.sessions, index) })),
  revokeAllSessions: () => set((s) => ({ sessions: settingsService.keepOnlyCurrentSession(s.sessions) })),

  roleOverrides: {},
  setMemberRole: (memberId, role) =>
    set((s) => ({ roleOverrides: settingsService.setRoleOverride(s.roleOverrides, memberId, role) })),
  pendingInvites: [...PENDING_INVITES],
  addInvite: (email, role) =>
    set((s) => ({ pendingInvites: [...s.pendingInvites, settingsService.buildNewInvite(email, role)] })),
  revokeInvite: (email) =>
    set((s) => ({ pendingInvites: settingsService.withoutInvite(s.pendingInvites, email) })),
  resendInvite: () => {
    /* toast only — no real email system */
  },
}))
```

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 5: Run the Settings-related component tests to confirm no regressions**

Run: `pnpm vitest run src/components/settings`
Expected: PASS, zero changes to any test file.

- [ ] **Step 6: Commit**

```bash
git add src/services/settingsService.ts src/store/settingsStore.ts
git commit -m "feat: Phase B0 — extract settings mutation logic into settingsService"
```

---

### Task 7: Full regression pass and phase notes

**Files:**
- Modify: `BACKLOG.md` (append a "Phase B0 Notes" section, matching the existing Phase R.4–R.7 notes convention already in the file)

**Interfaces:**
- Consumes: nothing new — this task only runs verification and documents the two scoping calls made in this plan.

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: PASS, same total test count as before this plan started (no test file was modified in Tasks 1–6 — confirm the count matches `git stash` / pre-plan baseline if in doubt).

- [ ] **Step 2: Run typecheck and lint across the whole repo**

Run: `pnpm typecheck && pnpm lint`
Expected: no errors.

- [ ] **Step 3: Append phase notes to `BACKLOG.md`**

Add this section after the existing "Responsive Phase R.7 — notes" section:

```markdown
---

## Phase B0 Notes

- `src/services/*.ts` introduced for tasks, projects, sprints, calendar, integrations, and settings — each store's mutation logic (id generation, field defaulting/merging, array add/remove/toggle) now lives in named pure functions there instead of inline in the Zustand store. Stores still own `set()`/`get()` and any UI-derived state (e.g. `tasksStore.todoKpiOverride`).
- **No `teamService.ts` yet** — `teamStore` has zero mutating actions today (it only seeds from `TEAM_MEMBERS`). Add one when Team gets its first real mutation, or when B6/F6 needs `list()` for async hydration.
- **Services are synchronous in B0, on purpose.** Making them return real Promises now would force every mutating store action to become `async`, which breaks every synchronous test assertion in all 6 touched store test files plus `useDeleteWithUndo.test.tsx` and an unknown subset of component tests that click a mutating action and assert the DOM synchronously — none of that is actually asynchronous yet. `VITE_USE_MOCK_DATA` is deferred for the same reason: it has nothing to branch on until a domain has both a mock and a real implementation. Both land together in each domain's own F-phase, when a real `fetch` call is introduced and loading states become genuinely necessary — see `docs/superpowers/specs/2026-08-19-chronoloop-backend-design.md` §4.
- Initial list hydration (`tasks: MOCK_TASKS`, `projects: MOCK_PROJECTS`, etc.) intentionally stays a direct synchronous mock import in every store — routing it through an async `service.list()` now would force a loading state onto every page for no real benefit yet. That wiring belongs to each domain's F-phase alongside its mutations going async.
```

- [ ] **Step 4: Commit**

```bash
git add BACKLOG.md
git commit -m "docs: Phase B0 — regression pass and phase notes"
```
