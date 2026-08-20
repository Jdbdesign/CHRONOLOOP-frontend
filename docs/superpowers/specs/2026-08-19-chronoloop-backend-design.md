# CHRONOLOOP Backend Design

Date: 2026-08-19
Status: Approved — ready for implementation (starting with B0)

## 0. What the code actually shows (corrections to the brief)

Two things worth flagging before the design itself, since they change scope:

- There is no `src/services/` layer today. Every store (`tasksStore`, `projectsStore`, `sprintsStore`, `teamStore`, `calendarStore`, `integrationsStore`, `settingsStore`) reads its initial state directly from `src/data/mock*.ts` and mutates in-memory via Zustand `set()`. There's nothing to "confirm is structured well" — it needs to be built as part of this work. That's Phase B0 below.
- Relationships in the frontend types are almost entirely by name/color string, not by ID. `Task.project` is a project name string, `Sprint.project` is a project name string, team members are referenced by initials+color (`{i, c, n}`) rather than a member ID, in `Project.team` / `Sprint.team`. A real relational schema needs real foreign keys — normalized below, which is more schema surface than the frontend types literally show, but it's what "propose a normalized schema" requires.

Locked in from decisions: multi-tenant workspaces, invite-only membership, no real-time sync (refetch-on-mutation), file attachments stay metadata-only.

## 1. Data model

Core structural decisions beyond a literal 1:1 port of the frontend types:

- **User vs WorkspaceMember split.** `User` holds global identity (email, password, personal prefs). `WorkspaceMember` joins a `User` to a `Workspace` with a workspace-scoped role (Owner/Admin/Member/Viewer — the permission role) and workspace-scoped `jobTitle`/`department` (the descriptive role shown on Team cards — e.g. "Senior Dev" — a different concept from the permission role, and can differ per workspace).
- **Computed fields don't get columns.** `TeamMember.activeTasks`/`completedTasks`/`velocity`/`completion`/`todoTasks`/`inProgressTasks`, `Project.tasksTotal`/`tasksDone`/`dueDays`, `Sprint.tasksTotal`/`tasksDone`/`inProgress`/`todo`/`progress` are all derived at query time from real `Task` rows, not stored. This also quietly fixes the existing bug where `addProject`/`addSprint` hardcode `dueDays`/`daysLeft` to 30 regardless of the chosen date — once it's computed from `dueDate - now()`, that bug can't exist.
- **Sprint↔Task linkage becomes real.** Today `Sprint.sprintTasks` is a denormalized snapshot (`{title, status}`), not linked by ID. Adding `Task.sprintId` (nullable FK) so a sprint's task list, burndown, and velocity are computed from actual assigned tasks — this also needs `Task.points` (nullable; currently sprints track story points as a single sprint-level number) and `Task.completedAt` for burndown-over-time to be real rather than a static array. This is the one place the `Task` type is meaningfully extended beyond what exists today.
- **`TaskStatus` drops `overdue` as a stored value.** Storing "overdue" as a persisted status goes stale (nothing flips it when the due date passes without a cron job). DB stores `TODO | IN_PROGRESS | DONE`; "overdue" becomes a computed label (`status != DONE && due < now`) at the API layer, matching what the UI shows today.
- **`CalendarEvent` only persists manually-created events.** The current `calendarStore` already separates `userEvents` (real state) from task/sprint/project-due-date entries (synthesized). Keeping that split server-side: the calendar read endpoint merges real `CalendarEvent` rows (type `MEETING`, or a manually-added task/project/sprint-flavored entry) with synthesized entries computed from `Task.due`, `Sprint.startDate`/`endDate`, `Project.dueDate` in the requested date range. No independent storage for task/sprint/project-derived calendar entries.
- **Tags are a `String[]` column, not a `Tag` table.** There's no tag-management UI today (no rename/merge/list-all-tags surface), so a join table buys normalization the product doesn't use yet. Easy to promote later if that changes.
- **Milestones stay a simple embedded list, not a full CRUD sub-resource.** [ProjectDetailPanel.tsx](../../../src/components/projects/ProjectDetailPanel.tsx#L169-L183) renders `project.milestones` read-only — no click handlers, no checkbox toggle, no add/edit/reorder UI, and the existing source comment confirms the list "is never reordered or appended to within a project's lifetime here." The `Milestone` model below (with `order`, `done`, `dueDate`) stays in the schema as future-proofing, but B3 ships it GET-only, seeded alongside project creation — no mutating milestone endpoints until the frontend actually grows edit UI.

```prisma
// ── Identity & tenancy ──────────────────────────────────────────
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  firstName     String
  lastName      String
  bio           String?
  phone         String?
  linkedin      String?
  twitter       String?
  timezone      String    @default("UTC")
  language      String    @default("en-US")
  dateFormat    String    @default("MM/DD/YYYY")
  timeFormat    String    @default("12h")
  accentColor   String    @default("#4A90FF")
  avatarColor   String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  memberships     WorkspaceMember[]
  sessions        Session[]
  loginAttempts   LoginAttempt[]
  resetTokens     PasswordResetToken[]
  invitesSent     WorkspaceInvite[]     @relation("InvitedBy")
}

model Workspace {
  id                String    @id @default(cuid())
  name              String
  slug              String    @unique
  description       String?
  currency          String    @default("USD")
  fiscalYearStart   Int       @default(1)
  weekStart         String    @default("Monday")
  sprintDurationDays Int      @default(14)
  workHoursStart    String    @default("09:00")
  workHoursEnd      String    @default("18:00")
  createdAt         DateTime  @default(now())

  members       WorkspaceMember[]
  invites       WorkspaceInvite[]
  projects      Project[]
  sprints       Sprint[]
  tasks         Task[]
  calendarEvents CalendarEvent[]
  integrations  WorkspaceIntegration[]
  webhooks      Webhook[]
  syncRules     SyncRule[]
  apiKeys       ApiKey[]
  activityLog   ActivityLogEntry[]
}

enum WorkspaceRole { OWNER ADMIN MEMBER VIEWER }
enum MemberStatus { ACTIVE INVITED }

model WorkspaceMember {
  id           String        @id @default(cuid())
  workspaceId  String
  workspace    Workspace     @relation(fields: [workspaceId], references: [id])
  userId       String
  user         User          @relation(fields: [userId], references: [id])
  role         WorkspaceRole @default(MEMBER)
  jobTitle     String?
  department   String?
  location     String?
  status       MemberStatus  @default(ACTIVE)
  lastActiveAt DateTime?
  joinedAt     DateTime      @default(now())

  assignedTasks     Task[]              @relation("Assignee")
  projectMemberships ProjectMember[]
  notificationPrefs NotificationPrefs?

  @@unique([workspaceId, userId])
}

model WorkspaceInvite {
  id           String    @id @default(cuid())
  workspaceId  String
  workspace    Workspace @relation(fields: [workspaceId], references: [id])
  email        String
  role         WorkspaceRole
  tokenHash    String    @unique
  invitedById  String
  invitedBy    User      @relation("InvitedBy", fields: [invitedById], references: [id])
  expiresAt    DateTime
  acceptedAt   DateTime?
  revokedAt    DateTime?
  createdAt    DateTime  @default(now())
}

// ── Auth support ────────────────────────────────────────────────
model Session {
  id                String   @id @default(cuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  refreshTokenHash  String   @unique
  userAgent         String?
  ipAddress         String?
  createdAt         DateTime @default(now())
  lastSeenAt        DateTime @default(now())
  revokedAt         DateTime?
}

model LoginAttempt {
  id          String   @id @default(cuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  emailTried  String
  success     Boolean
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())
}

model PasswordResetToken {
  id         String    @id @default(cuid())
  userId     String
  user       User      @relation(fields: [userId], references: [id])
  tokenHash  String    @unique
  expiresAt  DateTime
  usedAt     DateTime?
}

// ── Projects ─────────────────────────────────────────────────────
enum ProjectStatus { ACTIVE IN_PROGRESS COMPLETED OVERDUE ON_HOLD }
enum Priority { HIGH MEDIUM LOW }

model Project {
  id          String        @id @default(cuid())
  workspaceId String
  workspace   Workspace     @relation(fields: [workspaceId], references: [id])
  name        String
  client      String?
  category    String?
  status      ProjectStatus @default(ACTIVE)
  priority    Priority      @default(MEDIUM)
  color       String
  dueDate     DateTime?
  description String?
  createdAt   DateTime      @default(now())

  members     ProjectMember[]
  milestones  Milestone[]
  tasks       Task[]
  sprints     Sprint[]
}

model ProjectMember {
  id        String   @id @default(cuid())
  projectId String
  project   Project  @relation(fields: [projectId], references: [id])
  memberId  String
  member    WorkspaceMember @relation(fields: [memberId], references: [id])
  @@unique([projectId, memberId])
}

model Milestone {
  id        String    @id @default(cuid())
  projectId String
  project   Project   @relation(fields: [projectId], references: [id])
  label     String
  done      Boolean   @default(false)
  dueDate   DateTime?
  order     Int       @default(0)
}

// ── Sprints ──────────────────────────────────────────────────────
enum SprintStatus { ACTIVE COMPLETED PLANNING UPCOMING }

model Sprint {
  id           String       @id @default(cuid())
  workspaceId  String
  workspace    Workspace    @relation(fields: [workspaceId], references: [id])
  projectId    String?
  project      Project?     @relation(fields: [projectId], references: [id])
  number       Int
  name         String
  goal         String?
  status       SprintStatus @default(PLANNING)
  startDate    DateTime?
  endDate      DateTime?
  storyPoints  Int          @default(0)
  color        String       @default("#EAB308")
  createdAt    DateTime     @default(now())

  tasks        Task[]
  burndownSnapshots BurndownSnapshot[]
}

// optional persisted daily point — deferred, not wired up yet (lazy computation chosen instead, see §7 decision 1)
model BurndownSnapshot {
  id       String   @id @default(cuid())
  sprintId String
  sprint   Sprint   @relation(fields: [sprintId], references: [id])
  date     DateTime
  remainingPoints Int
  @@unique([sprintId, date])
}

// ── Tasks ────────────────────────────────────────────────────────
enum TaskStatus { TODO IN_PROGRESS DONE }

model Task {
  id           Int       @id @default(autoincrement())  // kept as Int to match existing frontend Task.id, not cuid() like other models — see §7 decision 4
  workspaceId  String
  workspace    Workspace @relation(fields: [workspaceId], references: [id])
  title        String
  description  String?
  projectId    String?
  project      Project?  @relation(fields: [projectId], references: [id])
  sprintId     String?
  sprint       Sprint?   @relation(fields: [sprintId], references: [id])
  assigneeId   String?
  assignee     WorkspaceMember? @relation("Assignee", fields: [assigneeId], references: [id])
  priority     Priority   @default(MEDIUM)
  status       TaskStatus @default(TODO)
  points       Int?
  due          DateTime?
  completedAt  DateTime?
  tags         String[]   @default([])
  createdAt    DateTime   @default(now())
  deletedAt    DateTime?  // soft delete, backs the undo pattern

  subtasks     Subtask[]
  comments     Comment[]
  attachments  Attachment[]
}

model Subtask {
  id     String  @id @default(cuid())
  taskId Int
  task   Task    @relation(fields: [taskId], references: [id])
  text   String
  done   Boolean @default(false)
  order  Int     @default(0)
}

model Comment {
  id        String   @id @default(cuid())
  taskId    Int
  task      Task     @relation(fields: [taskId], references: [id])
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  text      String
  createdAt DateTime @default(now())
}

model Attachment { // metadata only — no file bytes/storage, deferred per decision
  id         String   @id @default(cuid())
  taskId     Int
  task       Task     @relation(fields: [taskId], references: [id])
  name       String
  sizeBytes  Int
  mimeType   String
  uploadedById String
  createdAt  DateTime @default(now())
}

// ── Calendar ─────────────────────────────────────────────────────
enum CalendarEventType { TASK PROJECT SPRINT MEETING }

model CalendarEvent { // manually-created events only; see §1 note
  id          String   @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  type        CalendarEventType
  title       String
  date        DateTime
  startDate   DateTime?
  endDate     DateTime?
  time        String?
  durationMinutes Int?
  projectId   String?
  assigneeId  String?
  priority    String?
  notes       String?
  createdById String
  createdAt   DateTime @default(now())
}

// ── Integrations (mostly config, functionally inert until real OAuth is a future phase) ────
enum IntegrationStatus { CONNECTED AVAILABLE }

model WorkspaceIntegration {
  id           String   @id @default(cuid())
  workspaceId  String
  workspace    Workspace @relation(fields: [workspaceId], references: [id])
  providerId   String    // 'slack' | 'github' | ... — static catalog, not DB-modeled
  status       IntegrationStatus @default(AVAILABLE)
  connectedById String?
  connectedAt  DateTime?
  @@unique([workspaceId, providerId])
}

model Webhook {
  id          String   @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  url         String
  event       String
  active      Boolean  @default(true)
}

model SyncRule {
  id          String   @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  name        String
  detail      String
  on          Boolean  @default(true)
}

model ApiKey {
  id          String   @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  label       String
  hashedKey   String   @unique
  scope       String
  createdAt   DateTime @default(now())
  expiresAt   DateTime?
}

// ── Cross-cutting ────────────────────────────────────────────────
model NotificationPrefs { // scoped per (user, workspace) via WorkspaceMember — see §7 decision 5
  id           String   @id @default(cuid())
  memberId     String   @unique
  member       WorkspaceMember @relation(fields: [memberId], references: [id])
  emailAssigned Boolean @default(true)
  emailComments Boolean @default(true)
  emailDue1     Boolean @default(true)
  emailDue3     Boolean @default(false)
  emailSprint   Boolean @default(true)
  emailProject  Boolean @default(true)
  emailWeekly   Boolean @default(true)
  appStatus     Boolean @default(true)
  appNewMember  Boolean @default(true)
  appIntegration Boolean @default(true)
  appOverdue    Boolean @default(true)
  appMentions   Boolean @default(true)
  digestFrequency String @default("immediate")
  dnd           Boolean @default(false)
}

model ActivityLogEntry { // backs Team member activity feed + dashboard activity
  id          String   @id @default(cuid())
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  actorId     String?
  text        String
  createdAt   DateTime @default(now())
}
```

## 2. Auth design

- **Bootstrapping:** the first user of a new workspace self-registers via `POST /auth/signup-workspace` (email, password, name, workspace name) — creates `User` + `Workspace` + `WorkspaceMember(role=OWNER)` in one transaction. Anyone can always spin up a new workspace this way (self-serve creation, no admin-gating — see §7 decision 3). Joining an existing workspace requires an invite.
- **Invite flow:** Owner/Admin calls `POST /workspaces/:id/invites {email, role}` → creates `WorkspaceInvite` with a hashed token, expiry. Invitee visits an accept-invite link → `POST /auth/accept-invite {token, password, firstName, lastName}` → creates or links `User`, creates `WorkspaceMember`. Directly replaces the current `PENDING_INVITES` mock and makes `resendInvite`/`revokeInvite` real.
- **Tokens:** short-lived access JWT (~15 min, `userId` only — no workspace claim), long-lived refresh token (~30 days) stored hashed in `Session`, delivered as an httpOnly Secure cookie (not localStorage — avoids XSS token theft). Access token held in memory on the frontend, sent as `Authorization: Bearer`.
- **Workspace scoping:** since a user can belong to multiple workspaces, requests carry an `X-Workspace-Id` header (or route param); a `requireWorkspaceMember` middleware checks membership + loads the caller's role on every workspace-scoped request, rather than re-minting a token per workspace switch.
- **Refresh:** `POST /auth/refresh` reads the cookie, validates + rotates the stored session (rotate-on-use), issues a new access token.
- **Sessions tab becomes real:** the mocked "Sessions" list in Settings > Security is the `Session` table — `revokeSession`/`revokeAllSessions` become real DELETEs. Login Activity becomes the real `LoginAttempt` audit log.
- **Password reset:** `POST /auth/forgot-password` creates a `PasswordResetToken`; the reset link is logged server-side (stubbed, no real email send — see §7 decision 2). `POST /auth/reset-password {token, newPassword}` completes it.
- **Hashing:** bcrypt, cost factor 12.
- **Authorization matrix:** the existing `ROLE_PERMISSIONS` table in the mock (owner/admin/member/viewer × create-tasks/delete-tasks/manage-projects/etc.) becomes the actual `requireRole()` middleware matrix.
- **TopBar / Settings connection:** both already read from one place (`useSettingsStore.profile`) — TopBar isn't independently hardcoded, it's just displaying the store's default state. So wiring real auth is mostly "replace settingsStore's hardcoded initial profile with `GET /auth/me`'s response," not a TopBar-specific change.

## 3. API design

REST, chosen over GraphQL/tRPC: the domain isn't graph-query-heavy, REST maps 1:1 onto the store actions already built (which is exactly the "thin wrapper" shape needed), and it avoids coupling frontend/backend deploys the way tRPC would. Express, chosen over Fastify: bigger ecosystem/doc coverage for a solo build, most common pairing with Prisma + Render, and Fastify's performance edge doesn't matter at this scale — zod middleware gets Fastify-grade input validation in Express without switching frameworks.

Surface area per domain (mirrors the store actions):

- **Auth/Workspace:** signup-workspace, accept-invite, login, refresh, logout, forgot/reset-password, `GET /auth/me`, `GET/PATCH /workspaces/:id`
- **Members/Team:** `GET /workspaces/:id/members` (with computed stats), `GET/PATCH/DELETE /members/:id`, invite CRUD (shared with Settings > Team & Roles)
- **Tasks:** `GET /workspaces/:id/tasks` (filter by project/assignee/status/sprint), `POST`, `PATCH /tasks/:id`, `PATCH /tasks/:id/status`, `DELETE` (soft) + `POST /tasks/:id/restore` (backs the existing undo-toast pattern), subtasks + comments as sub-resources
- **Projects:** `GET/POST/PATCH/DELETE /projects`, milestones as a **read-only nested list** on the project response — no mutating milestone endpoints (see §1)
- **Sprints:** `GET/POST/PATCH/DELETE /sprints`, `POST /sprints/:id/complete`, `GET /sprints/:id/burndown`
- **Calendar:** `GET /workspaces/:id/calendar/events?start&end&type=` (merged real+synthesized), `POST/DELETE` for manual events
- **Integrations:** `GET /workspaces/:id/integrations`, `POST /integrations/:id/connect|disconnect`, webhook/sync-rule/API-key CRUD
- **Reports:** `GET /reports/kpis`, `/weekly-tasks`, `/project-status`, `/sprint-velocity`, `/priority-breakdown`, `/team-output`, `/burndown` — all computed aggregates, no dedicated storage
- **Settings:** `PATCH /users/me` (profile/appearance), `PATCH /members/:id/notification-prefs`, sessions/login-activity (§2), invites (shared with Team)

Full request/response schemas belong in the implementation plan, not here.

## 4. Migration strategy

**Phase B0 (frontend-only, first, before any backend code exists):** introduce `src/services/*.ts` per domain. Each store stops touching `src/data/mock*.ts` / its own in-memory array directly and instead calls its service (`taskService.create(input): Promise<Task>`, etc.), which for now just wraps the existing mock logic in `Promise.resolve()`. Zero behavior change, all existing tests keep passing — this just relocates the seam. A `VITE_USE_MOCK_DATA` flag controls whether a service hits mocks or the real API.

**Per-domain swap (last phase, after that domain's backend is deployed and verified):** flip one service file at a time from mock-backed to fetch-backed, in the same order the pages were originally built. No big-bang cutover — the app keeps working end-to-end on mocks for every domain not yet swapped.

## 5. Real vs. deferred

**Becomes real:**
- Persistence layer entirely (the whole point)
- Settings Discard/dirty-state — real once Save persists via API and Discard reverts to last-fetched server state
- Security Sessions & Login Activity — literally the real session/audit tables
- Integrations Connect/Disconnect — real persisted `WorkspaceIntegration` status (not a toast)
- Webhooks/Sync Rules/API Keys — real CRUD persistence
- Reports — real computed aggregates instead of `RPT_DATA`
- Team & Roles owner row + `ROLE_PERMISSIONS` — real authorization
- TopBar/Settings hardcoded "Jacob Solayinka" — real logged-in user

**Stays deferred:**
- Real OAuth handshakes for Integrations — connect/disconnect toggles a flag, no actual third-party API calls
- Real billing (Settings > Billing / Invoices)
- Real file storage for attachments (metadata only)
- Live/real-time sync (refetch-on-mutation only)
- Real email delivery for invites/password-reset — stubbed, no provider chosen
- Per-integration sync logs / activity feed (`INT_ACTIVITY`, per-app `syncLog`) — these imply live third-party sync that doesn't exist; persisting fabricated log rows would be more misleading than the current static mock, so they stay static/mock display data
- Milestone mutation endpoints — UI is read-only today; add both the frontend edit UI and the backend endpoints together if this becomes a real feature

**Not automatically fixed — needs its own small frontend task in the swap phase:** the decorative filter dropdowns (`ProjectsToolbar` status-sort, `SprintsPageHeader` project checkboxes) exist in the UI but their handlers were never wired to filtering logic. The backend adding real `?status=`/`?project=` query params unblocks this but doesn't wire it — someone still has to connect the dropdown's `onChange` to the service call.

## 6. Non-negotiables — compliance

bcrypt for passwords, JWT access+refresh with rotation, no secrets committed (`.env.example` documenting `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `COOKIE_DOMAIN`), input validation via zod at every mutating endpoint, and the B0-first migration plan specifically so the frontend never breaks mid-build.

## 7. Delivery sequence

B0 — frontend services/ layer scaffold (prep, see §4)
B1 — backend foundation: Express+TS on Render, Prisma schema, Neon provisioned, full auth flow, authorization middleware, health check
B2 — Tasks API · B3 — Projects API (milestones GET-only) · B4 — Sprints API (+ `Task.sprintId`/`points`/`completedAt`) · B5 — Calendar API · B6 — Team/Members API (+ ActivityLog) · B7 — Reports API (aggregates only) · B8 — Integrations API · B9 — Settings API (mostly gluing B1/B6 endpoints into the remaining tabs)
F1–F8 — frontend swap-over, same domain order, one service file at a time behind `VITE_USE_MOCK_DATA`. Dashboard needs no dedicated backend phase — it composes Task/Project/Team/Calendar endpoints and swaps automatically once those are live.

### Decisions confirmed

1. **Burndown:** lazy computation from `Task.completedAt` (option a). `BurndownSnapshot` stays in schema as future-proofing, not wired up yet.
2. **Email:** keep fully stubbed (log links server-side), no provider chosen yet.
3. **Workspace creation:** self-serve, open — see Auth design (§2).
4. **Task.id:** kept as `Int` `autoincrement()` to match existing frontend, the one deliberate exception to the `cuid()` pattern.
5. **Notification prefs:** scoped per `(user, workspace)` via `WorkspaceMember`, given real multi-workspace membership.
6. **Milestones:** GET-only/read-through for B3 — no mutating endpoints. [ProjectDetailPanel.tsx](../../../src/components/projects/ProjectDetailPanel.tsx#L169-L183) confirms the milestone list is read-only display with no stable per-item ID in the source data; adding mutation endpoints ahead of any frontend edit UI would be speculative.
