# B0 — Services Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a `src/services/*.ts` layer per domain so every Zustand store's mutation logic (currently inlined `set()` callbacks touching `src/data/mock*.ts` arrays directly) is relocated into pure, testable functions — the seam that later phases (F1–F8) will swap from mock logic to real `fetch` calls, one file at a time.

**Architecture:** For each of 6 domains (tasks, projects, sprints, calendar, integrations, settings — team is excluded, see Global Constraints), extract the store's current inline computation (id generation, field defaulting/merging, array add/remove/toggle) into named `Promise<T>`-returning functions in `src/services/<domain>Service.ts` (see the async Global Constraint for why, and for the one flagged sync exception). The store keeps owning `set()`/`get()` and any UI-derived state (e.g. `todoKpiOverride`), but `await`s the service function to compute the new value instead of inlining the logic itself. No behavior change to computed values; this is a refactor under existing test coverage, not new-feature TDD — the step pattern per task is **create service → confirm baseline tests still pass → refactor store to delegate → add `await` to the store's own direct-call test file → confirm assertions still pass unchanged**, rather than red→green.

**Tech Stack:** TypeScript, Zustand 5, Vitest 4, pnpm.

**Spec:** [docs/superpowers/specs/2026-08-19-chronoloop-backend-design.md](../specs/2026-08-19-chronoloop-backend-design.md) §4 (Migration strategy).

## Global Constraints

- **Zero behavior change to computed values.** Preserve existing quirks/bugs verbatim — including the `dueDays: 30` hardcoding bug in `projectService.buildNewProject` and `daysLeft: 30` in `sprintService.buildNewSprint` (both are documented, known bugs the spec says B3/B4 fix later, not B0).
- **Services return `Promise<T>`, wrapped in `Promise.resolve(...)` for now.** This matches the spec's own B0 target (`taskService.create(input): Promise<Task>`, §4) so each domain's F-phase only swaps `Promise.resolve(mockLogic())` for `await fetch(...)` inside the service function — the store call site never changes shape again. Store mutating actions become `async` and `await` their service call before `set()`. Audited cost: the 7 store unit-test files call actions directly (`useStore.getState().addTask(...)`) with no `await` today, so each direct call needs `await` added and its `it()` callback made `async` — mechanical, done explicitly per task below. Component tests were also audited (`grep` across the suite): every test file using `fireEvent.click` also uses `@testing-library/user-event`, whose `.click()` already awaits internally, so the one-hop `Promise.resolve().then(set)` reliably flushes before the next assertion — no component test changes are expected (confirmed by the full regression run in Task 7).
  - **Exception: `taskService.removeTaskAt`/`restoreTaskAt` (Task 1) stay synchronous.** `useDeleteWithUndo` needs the removed `{ task, index }` back synchronously to render the "Undo" toast at the moment of deletion. Making this async would either delay the toast until the promise resolves (a real behavior change, violating the constraint above) or require an optimistic-delete redesign (remove locally now, fire the delete in the background, undo = re-insert locally + cancel/undo server-side) — a genuine feature decision, out of scope for B0. Revisit explicitly in F1 when task deletion gets a real endpoint. `removeProject`/`removeSprint`/`removeWebhook` have no synchronous consumer like this and go async with the rest of their domains.
- **Post-`await` commits go through a functional `set((state) => ...)`, never a flat `set({...})` built from a pre-`await` snapshot — but only where that costs nothing.** Once a service call is genuinely async (an `await` boundary exists), a flat `set({ field: computedFromStaleSnapshot })` after it is a lost-update race: a concurrent mutation landing during the gap gets silently overwritten. Where the recomputation is purely structural — a filter-by-id/index (`removeSprint`, `removeWebhook`, `revokeSession`, `revokeAllSessions`, `revokeInvite`) or a replace using a value the caller already supplied as an external argument (`setMemberRole`'s `role`, `updateProfile`/`updateWorkspace`'s `updates`) — recompute it against fresh `state` inside the functional updater instead of reusing the pre-`await` result; this duplicates no business logic, since the service still owns computing *what* the change is, the store just re-applies the *same already-known* change against whatever `state` looks like at commit time. Where the new value is genuinely self-referential — computed FROM the current value of the exact field being changed, not from an external input (`toggleWebhookAt`, `toggleSyncRuleAt`, `connectAppStatus`/`disconnectAppStatus`'s field writes, `toggleNotificationFlag`) — leave the existing snapshot-then-set pattern as-is for B0: a safe fix there would mean duplicating the toggle logic itself in the store, defeating the point of the service, and there is no concurrent-call UI path anywhere in the app today that could trigger it. This was found via Task 2's review (an `Important`, plan-mandated finding on `removeProject`) and retrofitted into Task 1's `updateTaskById`; it's stated once here so Tasks 3, 5, and 6 don't have to rediscover it independently. **Known cost of this fix, accepted deliberately (found in Task 6's review):** because a functional `set()` updater can't `await`, the fix works by discarding the awaited service call's return value and re-executing the same merge/filter expression inline in the store — meaning that expression now exists in two places (the service function and the store's updater) that must be kept in sync by hand. This trades a single source of truth for concurrency-safety; a service-returns-a-transform-function pattern (the service computes and returns `(state) => newState` — e.g. `withoutInvite(email): Promise<(invites: PendingInvite[]) => PendingInvite[]>` — and the store `await`s it, then applies the returned function inside a functional `set()`) would get both, but wasn't retrofitted into B0 since it would mean touching every already-shipped action (6+ files) for no behavioral difference today. Accepted as documented, deferred technical debt: today every affected service function's logic is a trivial spread/filter, so the drift risk is low, but if any B-phase later adds real logic (validation, transformation) to one of these service functions, that same change must also be applied to the store's inline mirror, or it will silently not take effect. The transform-function pattern is worth adopting as the default shape for new mutation seams in F-phases. Flag this prominently wherever this pattern is touched again.
- **Known, deliberately deferred gap: array-length-derived id/number generation is not concurrency-safe once construction goes async.** `taskService.buildNewTask`'s `newId` (`Math.max(...existingTasks.map(t => t.id)) + 1`) and `sprintService.buildNewSprint`'s `number` (`` `SPRINT ${String(existingSprints.length + 1)...}` ``) are both computed from a pre-`await` snapshot of the collection, then baked into the new entity before it's committed — a double-submit landing in the same microtask gap could produce two entities with the same id/number, a regression the synchronous pre-refactor code couldn't have (single-threaded, single-tick execution made this impossible). Found during Task 3's review. Not fixed in B0: a real fix means either generating the id inside the `set()` updater against fresh state (pulling id-generation logic back out of the service, undoing the point of this refactor) or accepting the same risk class the store already accepts elsewhere (see the post-`await` commit bullet above). The real, durable fix is a server-generated id — which is exactly what F1 (tasks) and F3 (sprints) deliver by construction, making this moot the moment either phase lands. `projectService.buildNewProject` (`` `p_new_${Date.now()}` ``), `calendarService.buildNewCalendarEvent` (`'user-' + Date.now()`), `integrationsService.buildNewApiKey` (`` `k_${Date.now()}` `` + random suffix), and `settingsService.buildNewInvite` (no id at all) don't have this problem — none of their id/key generation depends on the current collection's snapshot.
- **`VITE_USE_MOCK_DATA` is deferred, not dropped.** It has nothing to branch on until a domain has both a mock and a real implementation — a single always-true branch today is dead weight. It lands in each domain's own F-phase alongside that domain's first real `fetch` call, per the spec's §4 pairing of the flag with the mock→real swap. Tracked here so it isn't silently forgotten; Task 7's phase notes restate this commitment.
- **No `teamService.ts` in this plan.** `teamStore` ([src/store/teamStore.ts](../../../src/store/teamStore.ts)) has zero mutating actions today — it only seeds `members` from `TEAM_MEMBERS` at module load. There is no mutation logic to relocate. A service file is created for this domain only when it gets its first real mutation (e.g. a role/status change) or when B6/F6 needs `list()` for async hydration.
- **`removeProject`/`removeSprint`/`removeWebhook` etc. are extracted too, even though they're one-line filters.** Every mutation needs a service-layer seam eventually (each becomes a real `DELETE`/`PATCH` call in its B-phase), so route all of them through the service for consistency — the one exception is single-primitive passthrough setters with zero transformation (`setDigestFrequency`, `setAccentColor`'s data field, `resendInvite`'s intentional no-op): those stay inline in the store, since there's no logic to relocate and wrapping them in a function would be pure ceremony.
- **Windows dev machine, pnpm.** Use `pnpm vitest run <path>` for targeted test runs and `pnpm test` / `pnpm typecheck` / `pnpm lint` for full-suite checks, matching `package.json` scripts.
- **No `import.meta.env` / no new env vars, no new dependencies.** This phase only moves existing code between files.

---

### Task 1: Task service extraction

**Files:**
- Create: `src/services/taskService.ts`
- Modify: `src/store/tasksStore.ts`
- Test (modified: add await to async action calls): `src/store/tasksStore.test.tsx`

**Interfaces:**
- Consumes: `NewTaskInput`, `Task`, `TaskStatus` from `../types/task` (unchanged).
- Produces (for the store to call): `buildNewTask(existingTasks, input): Promise<Task>`, `applyTaskEdit(task, input): Promise<Task>`, `setTaskStatus(task, status): Promise<Task>`, `addSubtaskTo(task, text): Promise<Task>`, `toggleSubtaskAt(task, index): Promise<Task>`, `setTaskDescription(task, description): Promise<Task>`, `addCommentTo(task, text): Promise<Task>` — all `Promise.resolve()`-wrapped, per the async Global Constraint. `removeTaskAt(tasks, id)` and `restoreTaskAt(tasks, task, index)` stay **synchronous** (the flagged exception — see Global Constraints) because `useDeleteWithUndo` needs the removed item back immediately.

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

export function buildNewTask(existingTasks: Task[], input: NewTaskInput): Promise<Task> {
  const newId = existingTasks.length > 0 ? Math.max(...existingTasks.map((t) => t.id)) + 1 : 1
  return Promise.resolve({
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
  })
}

export function applyTaskEdit(task: Task, input: NewTaskInput): Promise<Task> {
  return Promise.resolve({
    ...task,
    title: input.title,
    project: input.project,
    assignee: input.assignee,
    aColor: ASSIGNEE_COLOR[input.assignee] ?? task.aColor,
    due: input.due,
    priority: input.priority,
    description: input.description,
  })
}

export function setTaskStatus(task: Task, status: 'todo' | 'done'): Promise<Task> {
  return Promise.resolve({ ...task, status: status as TaskStatus })
}

export function addSubtaskTo(task: Task, text: string): Promise<Task> {
  return Promise.resolve({ ...task, subtasks: [...task.subtasks, { t: text, done: false }] })
}

export function toggleSubtaskAt(task: Task, index: number): Promise<Task> {
  return Promise.resolve({
    ...task,
    subtasks: task.subtasks.map((s, i) => (i === index ? { ...s, done: !s.done } : s)),
  })
}

export function setTaskDescription(task: Task, description: string): Promise<Task> {
  return Promise.resolve({ ...task, description })
}

export function addCommentTo(task: Task, text: string): Promise<Task> {
  return Promise.resolve({
    ...task,
    comments: [...task.comments, { author: 'You', text, time: 'Just now' }],
  })
}

// Stays synchronous — see the flagged exception in Global Constraints:
// useDeleteWithUndo needs { task, index } back immediately to render the
// "Undo" toast, so wrapping this in a Promise is deferred to F1.
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
  addTask: (input: NewTaskInput) => Promise<void>
  updateTask: (id: number, input: NewTaskInput) => Promise<void>
  removeTask: (id: number) => { task: Task; index: number } | null
  restoreTask: (task: Task, index: number) => void
  setTaskStatus: (id: number, status: 'todo' | 'done') => Promise<void>
  addSubtask: (id: number, text: string) => Promise<void>
  toggleSubtask: (id: number, index: number) => Promise<void>
  updateTaskDescription: (id: number, description: string) => Promise<void>
  addComment: (id: number, text: string) => Promise<void>
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: MOCK_TASKS,
  todoKpiOverride: null,
  addTask: async (input) => {
    const { tasks } = get()
    const newTask = await taskService.buildNewTask(tasks, input)
    const nextTasks = [...tasks, newTask]
    set({
      tasks: nextTasks,
      todoKpiOverride: nextTasks.filter((t) => t.status === 'todo').length,
    })
  },
  updateTask: async (id, input) => {
    const { tasks } = get()
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const edited = await taskService.applyTaskEdit(target, input)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? edited : task)),
    }))
  },
  // Stays synchronous — see the flagged exception in Global Constraints /
  // taskService.removeTaskAt: useDeleteWithUndo needs the removed item back
  // immediately to render the "Undo" toast.
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
  setTaskStatus: async (id, status) => {
    const { tasks } = get()
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const updated = await taskService.setTaskStatus(target, status)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }))
  },
  addSubtask: async (id, text) => {
    const { tasks } = get()
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const updated = await taskService.addSubtaskTo(target, text)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }))
  },
  toggleSubtask: async (id, index) => {
    const { tasks } = get()
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const updated = await taskService.toggleSubtaskAt(target, index)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }))
  },
  updateTaskDescription: async (id, description) => {
    const { tasks } = get()
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const updated = await taskService.setTaskDescription(target, description)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }))
  },
  addComment: async (id, text) => {
    const { tasks } = get()
    const target = tasks.find((task) => task.id === id)
    if (!target) return
    const updated = await taskService.addCommentTo(target, text)
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? updated : task)),
    }))
  },
}))
```

- [ ] **Step 4: Update `src/store/tasksStore.test.tsx` to `await` the now-async actions**

`addTask`, `updateTask`, `setTaskStatus`, `addSubtask`, `toggleSubtask`, `updateTaskDescription`, and `addComment` now return `Promise<void>`. For every direct call to one of these via `useTasksStore.getState().<action>(...)`, add `await` and make the enclosing `it(...)` callback `async`. Do **not** touch calls to `removeTask`/`restoreTask` — those stay synchronous and unchanged. This is the one deliberate, expected modification to an "unmodified" test file in this plan (see Global Constraints) — everything else about the assertions stays the same.

- [ ] **Step 5: Run the test file again to confirm it's still green**

Run: `pnpm vitest run src/store/tasksStore.test.tsx`
Expected: PASS (11 tests) — same assertions as before, now with `await` added to the async action calls.

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/services/taskService.ts src/store/tasksStore.ts src/store/tasksStore.test.tsx
git commit -m "feat: Phase B0 — extract task mutation logic into taskService (async, per spec)"
```

---

### Task 2: Project service extraction

**Files:**
- Create: `src/services/projectService.ts`
- Modify: `src/store/projectsStore.ts`
- Test (modified: add await to async action calls): `src/store/projectsStore.test.tsx`

**Interfaces:**
- Consumes: `NewProjectInput`, `Project` from `../types/project`.
- Produces: `buildNewProject(input): Promise<Project>`, `withoutProject(projects, id): Promise<Project[]>` — both `Promise.resolve()`-wrapped, per the async Global Constraint. No `useDeleteWithUndo`-style consumer here, so no exception needed.

- [ ] **Step 1: Run the existing test file to confirm the baseline is green**

Run: `pnpm vitest run src/store/projectsStore.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 2: Create `src/services/projectService.ts`**

```typescript
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
```

- [ ] **Step 3: Rewrite `src/store/projectsStore.ts` to delegate to the service**

```typescript
import { create } from 'zustand'
import type { NewProjectInput, Project } from '../types/project'
import { MOCK_PROJECTS } from '../data/mockProjects'
import * as projectService from '../services/projectService'

interface ProjectsState {
  projects: Project[]
  addProject: (input: NewProjectInput) => Promise<void>
  removeProject: (id: string) => Promise<void>
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: MOCK_PROJECTS,
  addProject: async (input) => {
    const newProject = await projectService.buildNewProject(input)
    set((state) => ({ projects: [newProject, ...state.projects] }))
  },
  removeProject: async (id) => {
    const { projects } = get()
    const next = await projectService.withoutProject(projects, id)
    set({ projects: next })
  },
}))
```

- [ ] **Step 4: Update `src/store/projectsStore.test.tsx` to `await` the now-async actions**

`addProject` and `removeProject` now return `Promise<void>`. Add `await` to each direct call via `useProjectsStore.getState().<action>(...)` and make the enclosing `it(...)` callback `async`.

- [ ] **Step 5: Run the test file again to confirm it's still green**

Run: `pnpm vitest run src/store/projectsStore.test.tsx`
Expected: PASS (4 tests) — same assertions, now with `await` added.

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/services/projectService.ts src/store/projectsStore.ts src/store/projectsStore.test.tsx
git commit -m "feat: Phase B0 — extract project mutation logic into projectService (async, per spec)"
```

---

### Task 3: Sprint service extraction

**Files:**
- Create: `src/services/sprintService.ts`
- Modify: `src/store/sprintsStore.ts`
- Test (modified: add await to async action calls): `src/store/sprintsStore.test.ts`

**Interfaces:**
- Consumes: `EditSprintInput`, `NewSprintInput`, `Sprint` from `../types/sprint`.
- Produces: `formatDate(raw)` (stays synchronous — pure string formatting, not a mutation, no reason to wrap it), `buildNewSprint(existingSprints, input): Promise<Sprint>`, `applySprintEdit(sprint, input): Promise<Sprint>`, `withoutSprint(sprints, id): Promise<Sprint[]>`, `completeSprint(sprint): Promise<Sprint>` — the four mutation functions are `Promise.resolve()`-wrapped, per the async Global Constraint. No `useDeleteWithUndo`-style consumer here, so no exception needed.

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
```

- [ ] **Step 3: Rewrite `src/store/sprintsStore.ts` to delegate to the service**

```typescript
import { create } from 'zustand'
import type { EditSprintInput, NewSprintInput, Sprint } from '../types/sprint'
import { MOCK_SPRINTS } from '../data/mockSprints'
import * as sprintService from '../services/sprintService'

interface SprintsState {
  sprints: Sprint[]
  addSprint: (input: NewSprintInput) => Promise<void>
  updateSprint: (id: string, input: EditSprintInput) => Promise<void>
  removeSprint: (id: string) => Promise<void>
  markComplete: (id: string) => Promise<void>
}

export const useSprintsStore = create<SprintsState>((set, get) => ({
  sprints: MOCK_SPRINTS,
  addSprint: async (input) => {
    const { sprints } = get()
    const newSprint = await sprintService.buildNewSprint(sprints, input)
    set((state) => ({ sprints: [newSprint, ...state.sprints] }))
  },
  updateSprint: async (id, input) => {
    const { sprints } = get()
    const target = sprints.find((s) => s.id === id)
    if (!target) return
    const edited = await sprintService.applySprintEdit(target, input)
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === id ? edited : s)),
    }))
  },
  removeSprint: async (id) => {
    await sprintService.withoutSprint(get().sprints, id)
    set((state) => ({ sprints: state.sprints.filter((s) => s.id !== id) }))
  },
  markComplete: async (id) => {
    const { sprints } = get()
    const target = sprints.find((s) => s.id === id)
    if (!target) return
    const completed = await sprintService.completeSprint(target)
    set((state) => ({
      sprints: state.sprints.map((s) => (s.id === id ? completed : s)),
    }))
  },
}))
```

- [ ] **Step 4: Update `src/store/sprintsStore.test.ts` to `await` the now-async actions**

`addSprint`, `updateSprint`, `removeSprint`, and `markComplete` now return `Promise<void>`. Add `await` to each direct call via `useSprintsStore.getState().<action>(...)` and make the enclosing `it(...)` callback `async`.

- [ ] **Step 5: Run the test file again to confirm it's still green**

Run: `pnpm vitest run src/store/sprintsStore.test.ts`
Expected: PASS (6 tests) — same assertions, now with `await` added.

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/services/sprintService.ts src/store/sprintsStore.ts src/store/sprintsStore.test.ts
git commit -m "feat: Phase B0 — extract sprint mutation logic into sprintService (async, per spec)"
```

---

### Task 4: Calendar service extraction

**Files:**
- Create: `src/services/calendarService.ts`
- Modify: `src/store/calendarStore.ts`
- Test (modified: add await to async action calls): `src/store/calendarStore.test.ts`

**Interfaces:**
- Consumes: `CalendarEvent`, `NewCalendarEventInput` from `../types/calendar`.
- Produces: `buildNewCalendarEvent(input): Promise<CalendarEvent>` — `Promise.resolve()`-wrapped, per the async Global Constraint.
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

export function buildNewCalendarEvent(input: NewCalendarEventInput): Promise<CalendarEvent> {
  return Promise.resolve({
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
  })
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
  addUserEvent: (input: NewCalendarEventInput) => Promise<void>
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

  addUserEvent: async (input) => {
    const newEvent = await calendarService.buildNewCalendarEvent(input)
    set((state) => ({ userEvents: [...state.userEvents, newEvent] }))
  },
}))
```

- [ ] **Step 4: Update `src/store/calendarStore.test.ts` to `await` the now-async `addUserEvent`**

`addUserEvent` now returns `Promise<void>`. Add `await` to each direct call via `useCalendarStore.getState().addUserEvent(...)` and make the enclosing `it(...)` callback `async`.

- [ ] **Step 5: Run the test file again to confirm it's still green**

Run: `pnpm vitest run src/store/calendarStore.test.ts`
Expected: PASS (11 tests) — same assertions, now with `await` added.

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/services/calendarService.ts src/store/calendarStore.ts src/store/calendarStore.test.ts
git commit -m "feat: Phase B0 — extract calendar event creation into calendarService (async, per spec)"
```

---

### Task 5: Integrations service extraction

**Files:**
- Create: `src/services/integrationsService.ts`
- Modify: `src/store/integrationsStore.ts`
- Test (modified: add await to async action calls): `src/store/integrationsStore.test.ts`

**Interfaces:**
- Consumes: `IntApp`, `IntWebhook`, `IntSyncRule`, `IntApiKey` from `../data/mockIntegrations`.
- Produces: `NewApiKeyInput` (type), `connectAppStatus(apps, id): Promise<IntApp[]>`, `disconnectAppStatus(apps, id): Promise<IntApp[]>`, `toggleWebhookAt(webhooks, index): Promise<IntWebhook[]>`, `removeWebhookAt(webhooks, index): Promise<IntWebhook[]>`, `toggleSyncRuleAt(rules, index): Promise<IntSyncRule[]>`, `buildNewApiKey(input): Promise<IntApiKey>` — all `Promise.resolve()`-wrapped, per the async Global Constraint.
- Post-`await` commit pattern (see the Global Constraint on this): `removeWebhook` commits via a fresh-state functional `set()` since its removal is a trivial structural filter-by-index. `connectApp`, `disconnectApp`, `toggleWebhook`, and `toggleSyncRule` keep the plain `set({ field: result })` shape — their new values are self-referential (computed from the field's own current value: a status flip, a boolean toggle), so a concurrency-safe fix there would mean duplicating that toggle logic in the store. Leave these four as originally written; this is a deliberate, documented B0 scope boundary, not a gap to fix in this task.

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

export function connectAppStatus(apps: IntApp[], id: string): Promise<IntApp[]> {
  return Promise.resolve(
    apps.map((a) => (a.id === id ? { ...a, status: 'connected' as const, syncedAt: 'Just now', users: 1 } : a)),
  )
}

export function disconnectAppStatus(apps: IntApp[], id: string): Promise<IntApp[]> {
  return Promise.resolve(
    apps.map((a) => (a.id === id ? { ...a, status: 'available' as const, syncedAt: null, users: 0, calls: 0 } : a)),
  )
}

export function toggleWebhookAt(webhooks: IntWebhook[], index: number): Promise<IntWebhook[]> {
  return Promise.resolve(webhooks.map((w, i) => (i === index ? { ...w, active: !w.active } : w)))
}

export function removeWebhookAt(webhooks: IntWebhook[], index: number): Promise<IntWebhook[]> {
  return Promise.resolve(webhooks.filter((_, i) => i !== index))
}

export function toggleSyncRuleAt(rules: IntSyncRule[], index: number): Promise<IntSyncRule[]> {
  return Promise.resolve(rules.map((r, i) => (i === index ? { ...r, on: !r.on } : r)))
}

export function buildNewApiKey(input: NewApiKeyInput): Promise<IntApiKey> {
  return Promise.resolve({
    id: `k_${Date.now()}`,
    label: input.label,
    val: `ck_new_••••••••${Math.random().toString(36).slice(-4)}`,
    scope: input.scope,
    created: 'Today',
    expires: input.expires || 'Never',
  })
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
  connectApp: (id: string) => Promise<void>
  disconnectApp: (id: string) => Promise<void>
  toggleWebhook: (index: number) => Promise<void>
  removeWebhook: (index: number) => Promise<void>
  toggleSyncRule: (index: number) => Promise<void>
  addApiKey: (input: NewApiKeyInput) => Promise<void>
}

export const useIntegrationsStore = create<IntegrationsState>((set, get) => ({
  apps: INT_APPS,
  webhooks: [...INT_WEBHOOKS],
  syncRules: [...INT_SYNC_ROWS],
  apiKeys: [...INT_KEYS],

  connectApp: async (id) => {
    const apps = await integrationsService.connectAppStatus(get().apps, id)
    set({ apps })
  },

  disconnectApp: async (id) => {
    const apps = await integrationsService.disconnectAppStatus(get().apps, id)
    set({ apps })
  },

  toggleWebhook: async (index) => {
    const webhooks = await integrationsService.toggleWebhookAt(get().webhooks, index)
    set({ webhooks })
  },

  removeWebhook: async (index) => {
    await integrationsService.removeWebhookAt(get().webhooks, index)
    set((state) => ({ webhooks: state.webhooks.filter((_, i) => i !== index) }))
  },

  toggleSyncRule: async (index) => {
    const syncRules = await integrationsService.toggleSyncRuleAt(get().syncRules, index)
    set({ syncRules })
  },

  addApiKey: async (input) => {
    const newKey = await integrationsService.buildNewApiKey(input)
    set((state) => ({ apiKeys: [...state.apiKeys, newKey] }))
  },
}))
```

- [ ] **Step 4: Update `src/store/integrationsStore.test.ts` to `await` the now-async actions**

`connectApp`, `disconnectApp`, `toggleWebhook`, `removeWebhook`, `toggleSyncRule`, and `addApiKey` now return `Promise<void>`. Add `await` to each direct call via `useIntegrationsStore.getState().<action>(...)` and make the enclosing `it(...)` callback `async`.

- [ ] **Step 5: Run the test file again to confirm it's still green**

Run: `pnpm vitest run src/store/integrationsStore.test.ts`
Expected: PASS (6 tests) — same assertions, now with `await` added.

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/services/integrationsService.ts src/store/integrationsStore.ts src/store/integrationsStore.test.ts
git commit -m "feat: Phase B0 — extract integrations mutation logic into integrationsService (async, per spec)"
```

---

### Task 6: Settings service extraction

**Files:**
- Create: `src/services/settingsService.ts`
- Modify: `src/store/settingsStore.ts`
- Test: no dedicated `settingsStore.test.ts` exists today (verify via `pnpm typecheck` + `pnpm test` full run in Task 7, and via the component tests that already exercise Settings tabs).

**Interfaces:**
- Produces (types): `ProfileState`, `WorkspaceState`, `NotificationToggles`, `SettingsSessionEntry`.
- Produces (functions, all returning `Promise<T>`, `Promise.resolve()`-wrapped per the async Global Constraint): `mergeProfile(profile, updates)`, `mergeWorkspace(workspace, updates)`, `toggleNotificationFlag(notifications, key)`, `withoutSessionAt(sessions, index)`, `keepOnlyCurrentSession(sessions)`, `setRoleOverride(roleOverrides, memberId, role)`, `buildNewInvite(email, role)`, `withoutInvite(invites, email)`.
- `setDigestFrequency`, `setAccentColor`'s data assignment, and `resendInvite` stay inline in the store per Global Constraints (trivial passthrough / intentional no-op) — and stay synchronous, since they never call a service function.
- Post-`await` commit pattern (see the Global Constraint on this): `updateProfile`, `updateWorkspace`, `revokeSession`, `revokeAllSessions`, `setMemberRole`, and `revokeInvite` all commit via a fresh-state functional `set()` — each is either a trivial structural filter (by index or by `email`/`.current`) or a merge of a caller-supplied external input (`updates`, `role`), so recomputing it against fresh state duplicates no business logic. `toggleNotification` keeps the plain `set({ notifications: result })` shape — its new value is self-referential (`!notifications[key]`), so a concurrency-safe fix there would mean duplicating the toggle logic in the store. Leave it as originally written; this is a deliberate, documented B0 scope boundary, matching the same call made for Task 5's `toggleWebhook`/`toggleSyncRule`.

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

export function mergeProfile(profile: ProfileState, updates: Partial<ProfileState>): Promise<ProfileState> {
  return Promise.resolve({ ...profile, ...updates })
}

export function mergeWorkspace(workspace: WorkspaceState, updates: Partial<WorkspaceState>): Promise<WorkspaceState> {
  return Promise.resolve({ ...workspace, ...updates })
}

export function toggleNotificationFlag(
  notifications: NotificationToggles,
  key: keyof NotificationToggles,
): Promise<NotificationToggles> {
  return Promise.resolve({ ...notifications, [key]: !notifications[key] })
}

export function withoutSessionAt(
  sessions: SettingsSessionEntry[],
  index: number,
): Promise<SettingsSessionEntry[]> {
  return Promise.resolve(sessions.filter((_, i) => i !== index))
}

export function keepOnlyCurrentSession(sessions: SettingsSessionEntry[]): Promise<SettingsSessionEntry[]> {
  return Promise.resolve(sessions.filter((session) => session.current))
}

export function setRoleOverride(
  roleOverrides: Record<string, string>,
  memberId: string,
  role: string,
): Promise<Record<string, string>> {
  return Promise.resolve({ ...roleOverrides, [memberId]: role })
}

export function buildNewInvite(email: string, role: string): Promise<PendingInvite> {
  return Promise.resolve({ email, role, sent: 'Today', expires: 'In 7 days' })
}

export function withoutInvite(invites: PendingInvite[], email: string): Promise<PendingInvite[]> {
  return Promise.resolve(invites.filter((inv) => inv.email !== email))
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
  updateProfile: (updates: Partial<ProfileState>) => Promise<void>

  // Workspace
  workspace: WorkspaceState
  updateWorkspace: (updates: Partial<WorkspaceState>) => Promise<void>

  // Notifications
  notifications: NotificationToggles
  toggleNotification: (key: keyof NotificationToggles) => Promise<void>
  digestFrequency: string
  setDigestFrequency: (freq: string) => void

  // Appearance
  accentColor: string
  setAccentColor: (color: string) => void

  // Security — sessions
  sessions: SettingsSessionEntry[]
  revokeSession: (index: number) => Promise<void>
  revokeAllSessions: () => Promise<void>

  // Team & Roles
  roleOverrides: Record<string, string>
  setMemberRole: (memberId: string, role: string) => Promise<void>
  pendingInvites: PendingInvite[]
  addInvite: (email: string, role: string) => Promise<void>
  revokeInvite: (email: string) => Promise<void>
  resendInvite: (email: string) => void
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
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
  updateProfile: async (updates) => {
    await settingsService.mergeProfile(get().profile, updates)
    set((state) => ({ profile: { ...state.profile, ...updates } }))
  },

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
  updateWorkspace: async (updates) => {
    await settingsService.mergeWorkspace(get().workspace, updates)
    set((state) => ({ workspace: { ...state.workspace, ...updates } }))
  },

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
  toggleNotification: async (key) => {
    const notifications = await settingsService.toggleNotificationFlag(get().notifications, key)
    set({ notifications })
  },
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
  revokeSession: async (index) => {
    await settingsService.withoutSessionAt(get().sessions, index)
    set((state) => ({ sessions: state.sessions.filter((_, i) => i !== index) }))
  },
  revokeAllSessions: async () => {
    await settingsService.keepOnlyCurrentSession(get().sessions)
    set((state) => ({ sessions: state.sessions.filter((session) => session.current) }))
  },

  roleOverrides: {},
  setMemberRole: async (memberId, role) => {
    await settingsService.setRoleOverride(get().roleOverrides, memberId, role)
    set((state) => ({ roleOverrides: { ...state.roleOverrides, [memberId]: role } }))
  },
  pendingInvites: [...PENDING_INVITES],
  addInvite: async (email, role) => {
    const newInvite = await settingsService.buildNewInvite(email, role)
    set((s) => ({ pendingInvites: [...s.pendingInvites, newInvite] }))
  },
  revokeInvite: async (email) => {
    await settingsService.withoutInvite(get().pendingInvites, email)
    set((state) => ({ pendingInvites: state.pendingInvites.filter((inv) => inv.email !== email) }))
  },
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
Expected: PASS, zero changes to any test file — these tests drive interactions through `@testing-library/user-event`, whose `.click()` already awaits internally, so the now-async store actions should resolve before assertions run (per the audited Global Constraint). If any assertion here does fail on a stale-state race, that's the first real signal the audit missed a spot — fix it locally in that one test file with `await waitFor(...)` rather than reverting the async change, and note it in Task 7's phase notes.

- [ ] **Step 6: Commit**

```bash
git add src/services/settingsService.ts src/store/settingsStore.ts
git commit -m "feat: Phase B0 — extract settings mutation logic into settingsService (async, per spec)"
```

---

### Task 7: Full regression pass and phase notes

**Files:**
- Modify: `BACKLOG.md` (append a "Phase B0 Notes" section, matching the existing Phase R.4–R.7 notes convention already in the file)

**Interfaces:**
- Consumes: nothing new — this task only runs verification and documents the two scoping calls made in this plan.

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: PASS. Tasks 1–5 each modified one store test file (adding `await` to now-async action calls) — same assertions, no new or removed tests. Task 6 (settings) has no dedicated store test file, so nothing to modify there. One component test file, `src/components/tasks/TaskDetailBody.test.tsx`, DID need a fix mid-plan (see the note in the phase-notes block below) — the `user-event`-only audit missed it because it uses raw `fireEvent.blur` instead. That fix is already committed; this step should now come back fully green with no further surprises. If `pnpm test` surfaces any other file that needs the same `await waitFor(...)` treatment, fix it locally and add it to the phase notes rather than silently patching around it.

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
- **Services return `Promise<T>` (`Promise.resolve()`-wrapped), matching the spec's B0 target exactly** (`taskService.create(input): Promise<Task>`, §4) — not left synchronous. This was a deliberate correction mid-plan: an earlier draft of this plan proposed staying synchronous to avoid touching test assertions, but that both contradicted the spec and would have forced a second refactor of every store call site once F-phases introduce real `fetch` calls. Going async now means F-phase only swaps `Promise.resolve(mockLogic())` for `await fetch(...)` inside each service function.
  - **One flagged exception:** `taskService.removeTaskAt`/`restoreTaskAt` and their store counterparts stay synchronous — `useDeleteWithUndo` needs `{ task, index }` back immediately to render the "Undo" toast, and making that async would either delay the toast (a real behavior change) or require an optimistic-delete redesign, which is out of scope here. Revisit in F1.
  - Cost was audited, not assumed: the 5 store unit-test files with mutating actions (tasks, projects, sprints, calendar, integrations — settings has no dedicated store test file) needed `await` added to direct action calls. Component tests were assumed safe because they all drive interactions through `@testing-library/user-event`, which already awaits internally — that held for every file *except* `src/components/tasks/TaskDetailBody.test.tsx`, which uses raw `fireEvent.blur` and broke when `updateTaskDescription` went async. Fixed by wrapping its two affected assertions in `await waitFor(...)`. Lesson for future audits of this kind: grep for `fireEvent.blur/change/keyDown/keyUp/submit` too, not just `fireEvent.click`.
- **A lost-update race was found and fixed mid-plan.** Any action that reads `get()` before an `await` and then commits with a flat `set({ field: computedFromThatSnapshot })` after it risks silently overwriting a concurrent mutation — the synchronous pre-refactor code couldn't have this bug (single-threaded, single-tick execution), but the async conversion opens the window. Fixed everywhere the recomputation is free (a caller-supplied external input, or a purely structural filter-by-id/index): `removeProject`, `removeSprint`, `removeWebhook`, `updateTaskById`, and six settings actions (`updateProfile`, `updateWorkspace`, `revokeSession`, `revokeAllSessions`, `setMemberRole`, `revokeInvite`) all now commit via a functional `set((state) => ...)` that recomputes against fresh state, discarding the awaited service call's return value. Left deliberately unfixed where the new value is self-referential (computed from the very field being changed — `toggleWebhook`, `toggleSyncRule`, `connectApp`/`disconnectApp`, `toggleNotification`): a safe fix there would mean duplicating the service's toggle logic in the store. **Not currently exploitable** — the mock service's `Promise` resolves on the next microtask, faster than a human can re-trigger the same action via a second click. This is a timing accident of the mock, not a structural absence of concurrency: `toggleWebhook`/`toggleNotification` are each wired to multiple independent checkboxes with no pending-state guard (verified by tracing every call site), so the trigger path exists today — it just isn't fast enough to hit yet. Becomes exploitable at normal human click speed once F-phase swaps in real `fetch()` calls.
  - **Known cost of the fix that was applied:** since a functional `set()` updater can't `await`, "recompute against fresh state" means the store re-executes the same merge/filter expression the service already computed and discards the service's answer — that expression now lives in two places that must be kept in sync by hand. Low risk today since every affected service function's logic is a trivial spread/filter; if a future B-phase adds real logic (validation, transformation) to one of them, that change must also be applied to the store's inline mirror or it will silently not take effect.
  - **Known, deliberately unfixed gap:** `taskService.buildNewTask`'s `newId` and `sprintService.buildNewSprint`'s `number` are both derived from a pre-await snapshot of the collection's length/max — a double-submit in the same microtask gap could produce two entities with the same id/number. Not fixed for the same reason as above (no clean fix without pulling id-generation logic back into the store or accepting the risk); the durable fix is a server-generated id, which F1 (tasks) and F3 (sprints) deliver by construction.
- **`VITE_USE_MOCK_DATA` is still deferred, not dropped.** It has nothing to branch on until a domain has both a mock and a real implementation. It lands in each domain's own F-phase alongside that domain's first real `fetch` call — tracked here explicitly so B1+ doesn't quietly skip it.
- Initial list hydration (`tasks: MOCK_TASKS`, `projects: MOCK_PROJECTS`, etc.) intentionally stays a direct synchronous mock import in every store — routing it through an async `service.list()` now would force a loading state onto every page for no real benefit yet. That wiring belongs to each domain's F-phase alongside `VITE_USE_MOCK_DATA`.
```

- [ ] **Step 4: Commit**

```bash
git add BACKLOG.md
git commit -m "docs: Phase B0 — regression pass and phase notes"
```
