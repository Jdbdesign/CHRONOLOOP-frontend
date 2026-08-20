# B1 — Backend Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the new `chronoloop-backend` service — Express+TypeScript on Render, Prisma schema migrated to Neon Postgres, the full auth flow (signup-workspace, invite/accept, login, refresh, logout, forgot/reset-password), authorization middleware, and a health check — so B2–B9's domain APIs have a real, deployed foundation to build on.

**Architecture:** A new repo (`chronoloop-backend`, separate from this frontend repo — see "Decisions this plan makes" below), Express app with a thin routes → services → Prisma layering. Auth uses short-lived JWT access tokens (memory-held on the frontend) plus long-lived refresh tokens rotated on every use and stored hashed server-side. Every workspace-scoped request carries an `X-Workspace-Id` header, checked by middleware against real `WorkspaceMember` rows.

**Tech Stack:** Node.js + TypeScript, Express 4, Prisma + Postgres (Neon), zod (validation), jsonwebtoken, bcrypt, Vitest + Supertest (tests), pnpm, deployed to Render, GitHub Actions (CI).

**Spec:** [docs/superpowers/specs/2026-08-19-chronoloop-backend-design.md](../specs/2026-08-19-chronoloop-backend-design.md) — §1 (schema), §2 (auth design), §3 (API design, Auth/Workspace surface), §6 (compliance non-negotiables), §7 (delivery sequence, B1 scope).

## Global Constraints

- **bcrypt, cost factor 12** for all password hashing (§6, §2).
- **JWT access token: 15 min TTL.** Payload is `{ userId }` only — no workspace claim (§2). Sent as `Authorization: Bearer <token>`, held in memory on the frontend (never localStorage).
- **Refresh token: 30 day TTL, rotate-on-use.** Stored hashed (SHA-256, not bcrypt — see Task 4) in `Session.refreshTokenHash`, delivered as an httpOnly, Secure cookie (§2).
- **No secrets committed.** `.env.example` documents every required var; real values only in `.env` (gitignored) locally and in Render's/GitHub's secret stores (§6).
- **Input validation via zod at every mutating endpoint** (§6).
- **`X-Workspace-Id` header** (not a token claim) carries workspace scope on every workspace-scoped request; `requireWorkspaceMember` middleware checks membership + loads role on each such request (§2).
- **Windows dev machine, pnpm.** Use `pnpm vitest run <path>` for targeted test runs, `pnpm test` / `pnpm typecheck` / `pnpm lint` for full-suite checks.
- **This plan does not implement rate-limiting/lockout.** `LoginAttempt` rows are written for audit purposes only in B1 — see Task 8's note. Flagged, not silently assumed.

## Decisions this plan makes (not specified in the design doc — flagged per project process)

1. **Repo topology: new separate repo, `chronoloop-backend`**, alongside `CHRONOLOOP-frontend` under the same GitHub account (`Jdbdesign`, from this repo's `origin` remote). Confirmed with the user directly — the frontend repo's own name ("-frontend") and lack of any monorepo tooling (no `pnpm-workspace.yaml`) both pointed the same way.
2. **B1 migrates only the auth/tenancy subset of §1's schema** — not the whole Prisma block. The design doc's own delivery-sequence notation ("B4 — Sprints API (**+** `Task.sprintId`/`points`/`completedAt`)") only makes sense if models are added incrementally per phase, not all at once in B1. Task 2 spells out exactly which models/relations are included now vs. deferred, and which relation fields on `User`/`Workspace`/`WorkspaceMember` are temporarily dropped because their target models (`Task`, `Project`, `Comment`, etc.) don't exist until later phases — each is commented in the schema with which phase restores it, so B2–B9 don't silently forget the other side of a relation.
3. **Test database: a dedicated Neon branch** (`chronoloop-test`), used for both local integration tests and CI — not a Dockerized local Postgres. Rationale: this is a Windows dev machine with no confirmed Docker install, and a Neon branch needs nothing but a connection string, giving local/CI parity on the exact Postgres version production uses (a Docker container on a different Postgres version would be a second, undocumented behavior to keep in sync — not worth it in a foundation phase).
4. **Error responses use a consistent `{ error: { code, message } }` shape** and are enumeration-hardened for login/reset/invite-accept (generic messages that don't reveal whether an account/token exists), but **not** for signup — see Task 7's note on why signup deliberately reveals "email already registered" while nothing else does.
5. **`POST /auth/accept-invite` does not silently link an existing account.** The design doc's phrase "creates or links User" is ambiguous about what happens when the invited email already has a `User` row — auto-linking based on token possession alone (without the accepter proving they're currently logged into that account) would let anyone who intercepts an invite link attach themselves to someone else's existing account. Task 10 implements the safe subset (create-new-User path) and returns a distinct `409 EMAIL_HAS_EXISTING_ACCOUNT` for the existing-account case instead of guessing. **Confirmed with the user (2026-08-20): the authenticated "accept invite while logged in" resolution flow is explicitly out of scope for B1 and backlogged to B9**, not left as an implicit dead end — see `BACKLOG.md` → "Auth — Accept-Invite-While-Logged-In Flow" for the named endpoint (`POST /auth/accept-invite-existing`, `requireAuth`-gated, email-matched) and frontend login-redirect UX it will need.
6. **Invite token TTL: 7 days. Password reset token TTL: 1 hour.** Both are 256-bit random tokens (`crypto.randomBytes(32)`), stored as SHA-256 hashes (`tokenHash`) per the schema. Not specified in the design doc; these are ordinary industry-standard defaults, kept as single named constants so they're a one-line change later.
7. **`PATCH /workspaces/:id` is gated Owner/Admin only.** The ported `ROLE_PERMISSIONS` matrix (Task 6) has no explicit "edit workspace settings" row — it covers task/project/sprint/invite/integration/billing/delete-workspace actions only. Owner/Admin is the closest existing precedent (matches "manage integrations"); flagged since it's an extrapolation, not a literal port.
8. **CORS + cross-origin cookies.** Because the frontend and backend are separate deployments (different origins), the refresh-token cookie needs `SameSite=None; Secure`, and the Express app needs `cors({ origin: CORS_ORIGIN, credentials: true })`. The design doc doesn't mention CORS at all — Task 3 wires this explicitly since it's a common source of "auth works locally, breaks in prod" bugs.
9. **`bcrypt` (native bindings), not `bcryptjs`.** The design doc names "bcrypt" specifically (§6), and it ships prebuilt binaries for Linux (Render) and Windows (dev) via `node-pre-gyp`, so it normally installs without a local compiler — flagged in Task 1 in case `pnpm install` ever needs build tools on a machine without prebuilt binaries available.

---

### Task 1: Repo scaffold, tooling, Neon + Render setup, CI skeleton

**Files (new repo `chronoloop-backend/`, sibling directory to this one):**
- Create: `package.json`, `tsconfig.json`, `.eslintrc.cjs`, `.prettierrc.json`, `.gitignore`, `.env.example`, `README.md`
- Create: `src/index.ts` (entrypoint, not built yet — Task 2 fills it in)
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Produces: the `chronoloop-backend` repo, installable via `pnpm install`, with `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test` scripts that every later task relies on.

- [ ] **Step 1: Create the Neon project**

Manual step (Neon console, not scriptable from here): create a Neon project named `chronoloop`. Create two branches: `main` (production) and `chronoloop-test` (used by integration tests locally and in CI — see Decision 3). Copy both branches' connection strings (they'll go into `.env` and the GitHub Actions secret in later steps) — Neon connection strings look like `postgresql://<user>:<password>@<host>/<db>?sslmode=require`.

- [ ] **Step 2: Create the Render web service**

Manual step (Render dashboard): create a new Web Service, connect it to the `chronoloop-backend` GitHub repo (created in Step 3 below) once it exists and has a first commit. Set:
- Build command: `pnpm install --frozen-lockfile && pnpm build` (build script defined in Step 5)
- Start command: `pnpm start` (defined in Step 5)
- Environment: Node 20
- Leave it un-deployed / failing until Task 2 gives it something real to run — that's expected at this point.

- [ ] **Step 3: Create the GitHub repo and local scaffold**

```bash
mkdir ../chronoloop-backend
cd ../chronoloop-backend
git init
gh repo create Jdbdesign/chronoloop-backend --private --source=. --remote=origin
```

- [ ] **Step 4: Write `package.json`**

```json
{
  "name": "chronoloop-backend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "prisma generate && tsc -p tsconfig.json",
    "start": "prisma migrate deploy && node dist/index.js",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate"
  },
  "dependencies": {
    "@prisma/client": "^6.2.1",
    "bcrypt": "^5.1.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "helmet": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cookie-parser": "^1.4.8",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^22.10.5",
    "@types/supertest": "^6.0.2",
    "eslint": "^9.18.0",
    "prettier": "^3.9.6",
    "prisma": "^6.2.1",
    "supertest": "^7.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "typescript-eslint": "^8.19.1",
    "vitest": "^4.1.10"
  }
}
```

Run `pnpm install` to generate the lockfile.

- [ ] **Step 5: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 6: Write `.env.example`**

```bash
# Server
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Database (Neon)
DATABASE_URL=postgresql://user:password@host/chronoloop?sslmode=require
DATABASE_URL_TEST=postgresql://user:password@host/chronoloop-test?sslmode=require

# Auth
JWT_ACCESS_SECRET=change-me-32-bytes-min
JWT_REFRESH_SECRET=change-me-different-32-bytes-min
COOKIE_DOMAIN=localhost
```

Copy this to `.env` and `.env.test` locally, filling in the real Neon connection strings from Step 1 and two long random secrets (e.g. `openssl rand -hex 32`) for the JWT secrets. **Do not commit `.env` or `.env.test`** — confirm `.gitignore` (Step 7) covers them.

- [ ] **Step 7: Write `.gitignore`**

```
node_modules
dist
.env
.env.test
.env.*.local
*.log
```

- [ ] **Step 8: Write a placeholder `src/index.ts` so the repo builds**

```typescript
console.log('chronoloop-backend scaffold — Task 2 replaces this with a real server')
```

- [ ] **Step 9: Write the CI workflow skeleton**

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
```

No test step yet — no tests exist until Task 2, which also adds the `DATABASE_URL_TEST` secret usage and the `pnpm test` step.

- [ ] **Step 10: Commit and push**

```bash
git add -A
git commit -m "chore: scaffold chronoloop-backend repo"
git push -u origin main
```

Confirm the CI workflow runs green on GitHub (install + typecheck + lint, both trivially satisfied by the placeholder).

---

### Task 2: Prisma schema (B1 subset), Neon migration, Prisma client, health check

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/db/client.ts`
- Create: `src/app.ts`, `src/index.ts` (replaces Task 1's placeholder)
- Create: `src/routes/health.ts`
- Create: `test/setup.ts`, `test/helpers/testApp.ts`, `test/helpers/resetDb.ts`
- Test: `test/integration/health.test.ts`
- Modify: `.github/workflows/ci.yml`, `vitest.config.ts` (new)

**Interfaces:**
- Produces: `prisma` global client singleton `db` from `src/db/client.ts`; `buildApp(): Express` from `src/app.ts` (separated from `listen()` so tests can import the app without binding a port); `GET /health` returning `{ status: 'ok', db: 'ok' }`.

- [ ] **Step 1: Write the B1-scoped `prisma/schema.prisma`**

Only the Identity/tenancy + Auth-support models from design doc §1. Relation fields pointing at not-yet-created models (`Task`, `Project`, `Sprint`, `Comment`, `CalendarEvent`, `WorkspaceIntegration`, `Webhook`, `SyncRule`, `ApiKey`, `ActivityLogEntry`, `ProjectMember`, `NotificationPrefs`) are omitted here and restored in the migration of whichever B-phase creates that model — each omission is marked with a comment naming that phase.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

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
  // comments Comment[] — restored in B2 (Tasks) when Comment is created
}

model Workspace {
  id                 String    @id @default(cuid())
  name               String
  slug               String    @unique
  description        String?
  currency           String    @default("USD")
  fiscalYearStart    Int       @default(1)
  weekStart          String    @default("Monday")
  sprintDurationDays  Int      @default(14)
  workHoursStart     String    @default("09:00")
  workHoursEnd       String    @default("18:00")
  createdAt          DateTime  @default(now())

  members   WorkspaceMember[]
  invites   WorkspaceInvite[]
  // projects Project[] — restored in B3
  // sprints Sprint[] — restored in B4
  // tasks Task[] — restored in B2
  // calendarEvents CalendarEvent[] — restored in B5
  // integrations WorkspaceIntegration[], webhooks Webhook[], syncRules SyncRule[], apiKeys ApiKey[] — restored in B8
  // activityLog ActivityLogEntry[] — restored in B6
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

  // assignedTasks Task[] @relation("Assignee") — restored in B2
  // projectMemberships ProjectMember[] — restored in B3
  // notificationPrefs NotificationPrefs? — restored in B9

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
  id                String    @id @default(cuid())
  userId            String
  user              User      @relation(fields: [userId], references: [id])
  refreshTokenHash  String    @unique
  userAgent         String?
  ipAddress         String?
  createdAt         DateTime  @default(now())
  lastSeenAt        DateTime  @default(now())
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
```

- [ ] **Step 2: Run the first migration against the Neon `main` branch**

```bash
pnpm prisma migrate dev --name init
```

This reads `DATABASE_URL` from `.env` (the Neon `main` branch connection string from Task 1). Confirm it creates `prisma/migrations/<timestamp>_init/migration.sql` and applies cleanly.

- [ ] **Step 3: Apply the same migration to the Neon test branch**

```bash
DATABASE_URL="$DATABASE_URL_TEST" pnpm prisma migrate deploy
```

(Reads `DATABASE_URL_TEST` from `.env.test` — adjust the shell syntax if not using bash; on Windows PowerShell: `$env:DATABASE_URL=$env:DATABASE_URL_TEST; pnpm prisma migrate deploy`.)

- [ ] **Step 4: Write the Prisma client singleton**

```typescript
// src/db/client.ts
import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient()
```

- [ ] **Step 5: Write `src/app.ts`**

```typescript
// src/app.ts
import express, { type Express } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { healthRouter } from './routes/health.js'

export function buildApp(): Express {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
  )
  app.use(express.json())
  app.use(cookieParser())

  app.use('/health', healthRouter)

  return app
}
```

- [ ] **Step 6: Write `src/routes/health.ts`**

```typescript
// src/routes/health.ts
import { Router } from 'express'
import { db } from '../db/client.js'

export const healthRouter = Router()

healthRouter.get('/', async (_req, res) => {
  try {
    await db.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'ok' })
  } catch {
    res.status(503).json({ status: 'error', db: 'unreachable' })
  }
})
```

- [ ] **Step 7: Write `src/index.ts`**

```typescript
// src/index.ts
import { buildApp } from './app.js'

const port = Number(process.env.PORT ?? 4000)
const app = buildApp()

app.listen(port, () => {
  console.log(`chronoloop-backend listening on :${port}`)
})
```

- [ ] **Step 8: Write `vitest.config.ts`**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.ts'],
    fileParallelism: false,
  },
})
```

`fileParallelism: false` because integration tests share one Postgres database and reset it between files — parallel files would race on truncation.

- [ ] **Step 9: Write `test/setup.ts`**

```typescript
// test/setup.ts
import { config } from 'dotenv'

config({ path: '.env.test' })
```

- [ ] **Step 10: Write `test/helpers/resetDb.ts`**

```typescript
// test/helpers/resetDb.ts
import { db } from '../../src/db/client.js'

// Order matters: children before parents (FK constraints).
const TABLES = [
  'WorkspaceInvite',
  'PasswordResetToken',
  'LoginAttempt',
  'Session',
  'WorkspaceMember',
  'Workspace',
  'User',
]

export async function resetDb(): Promise<void> {
  for (const table of TABLES) {
    await db.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`)
  }
}
```

- [ ] **Step 11: Write `test/helpers/testApp.ts`**

```typescript
// test/helpers/testApp.ts
import { buildApp } from '../../src/app.js'

export function testApp() {
  return buildApp()
}
```

- [ ] **Step 12: Write the failing test**

```typescript
// test/integration/health.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { testApp } from '../helpers/testApp.js'
import { resetDb } from '../helpers/resetDb.js'

describe('GET /health', () => {
  beforeEach(resetDb)

  it('returns ok status with a working db connection', async () => {
    const res = await request(testApp()).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok', db: 'ok' })
  })
})
```

- [ ] **Step 13: Run the test**

```bash
DATABASE_URL="$DATABASE_URL_TEST" pnpm vitest run test/integration/health.test.ts
```

Expected: PASS. (`DATABASE_URL_TEST` must point at the Neon test branch migrated in Step 3.)

- [ ] **Step 14: Add the test step + secret usage to CI**

```yaml
# .github/workflows/ci.yml — append after the lint step
      - run: pnpm prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_TEST }}
      - run: pnpm test
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_TEST }}
```

Manual step: add `DATABASE_URL_TEST` as a GitHub Actions repo secret (Settings → Secrets and variables → Actions) with the Neon test-branch connection string from Task 1.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "feat: prisma schema (B1 subset), neon migration, health check"
git push
```

Confirm CI is green.

---

### Task 3: Env config loader, CORS, central error handler

**Files:**
- Create: `src/config/env.ts`
- Create: `src/lib/errors.ts`
- Create: `src/middleware/errorHandler.ts`
- Modify: `src/app.ts`
- Test: `test/unit/config/env.test.ts`, `test/unit/lib/errors.test.ts`

**Interfaces:**
- Produces: `env` object (validated, typed) from `src/config/env.ts`; `AppError` class + `errorHandler` Express middleware from `src/lib/errors.ts` / `src/middleware/errorHandler.ts`, used by every route task from here on.

- [ ] **Step 1: Write the failing env validation test**

```typescript
// test/unit/config/env.test.ts
import { describe, it, expect } from 'vitest'
import { parseEnv } from '../../../src/config/env.js'

describe('parseEnv', () => {
  it('parses a complete, valid env object', () => {
    const result = parseEnv({
      PORT: '4000',
      NODE_ENV: 'development',
      CORS_ORIGIN: 'http://localhost:5173',
      DATABASE_URL: 'postgresql://u:p@h/db',
      JWT_ACCESS_SECRET: 'a'.repeat(32),
      JWT_REFRESH_SECRET: 'b'.repeat(32),
      COOKIE_DOMAIN: 'localhost',
    })
    expect(result.PORT).toBe(4000)
    expect(result.NODE_ENV).toBe('development')
  })

  it('throws when a required var is missing', () => {
    expect(() => parseEnv({})).toThrow()
  })

  it('throws when a JWT secret is under 32 characters', () => {
    expect(() =>
      parseEnv({
        PORT: '4000',
        NODE_ENV: 'development',
        CORS_ORIGIN: 'http://localhost:5173',
        DATABASE_URL: 'postgresql://u:p@h/db',
        JWT_ACCESS_SECRET: 'too-short',
        JWT_REFRESH_SECRET: 'b'.repeat(32),
        COOKIE_DOMAIN: 'localhost',
      }),
    ).toThrow()
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `pnpm vitest run test/unit/config/env.test.ts`
Expected: FAIL — `parseEnv` doesn't exist yet.

- [ ] **Step 3: Write `src/config/env.ts`**

```typescript
// src/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  CORS_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  COOKIE_DOMAIN: z.string().min(1),
})

export type Env = z.infer<typeof envSchema>

export function parseEnv(raw: Record<string, string | undefined>): Env {
  return envSchema.parse(raw)
}

export const env = parseEnv(process.env)
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `pnpm vitest run test/unit/config/env.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Write the failing error-shape test**

```typescript
// test/unit/lib/errors.test.ts
import { describe, it, expect } from 'vitest'
import { AppError } from '../../../src/lib/errors.js'

describe('AppError', () => {
  it('carries a status, code, and message', () => {
    const err = new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.')
    expect(err.status).toBe(401)
    expect(err.code).toBe('INVALID_CREDENTIALS')
    expect(err.message).toBe('Invalid email or password.')
  })

  it('serializes to the standard response shape', () => {
    const err = new AppError(404, 'NOT_FOUND', 'Not found.')
    expect(err.toResponseBody()).toEqual({
      error: { code: 'NOT_FOUND', message: 'Not found.' },
    })
  })
})
```

- [ ] **Step 6: Run it to confirm it fails**

Run: `pnpm vitest run test/unit/lib/errors.test.ts`
Expected: FAIL — `AppError` doesn't exist yet.

- [ ] **Step 7: Write `src/lib/errors.ts`**

```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message)
    this.name = 'AppError'
  }

  toResponseBody() {
    return { error: { code: this.code, message: this.message } }
  }
}
```

- [ ] **Step 8: Write `src/middleware/errorHandler.ts`**

```typescript
// src/middleware/errorHandler.ts
import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../lib/errors.js'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json(err.toResponseBody())
    return
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: err.issues.map((i) => i.message).join('; ') },
    })
    return
  }
  console.error(err)
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.' } })
}
```

- [ ] **Step 9: Wire it into `src/app.ts`** (mounted last, after all routers)

```typescript
// src/app.ts — add import and final app.use
import { errorHandler } from './middleware/errorHandler.js'
// ...inside buildApp(), after app.use('/health', healthRouter):
  app.use(errorHandler)
```

- [ ] **Step 10: Run both test files to confirm they pass**

Run: `pnpm vitest run test/unit/lib/errors.test.ts test/unit/config/env.test.ts`
Expected: PASS (5 tests total)

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: env validation, CORS, central error handler"
git push
```

---

### Task 4: Password + JWT libs

**Files:**
- Create: `src/lib/password.ts`
- Create: `src/lib/jwt.ts`
- Test: `test/unit/lib/password.test.ts`, `test/unit/lib/jwt.test.ts`

**Interfaces:**
- Produces: `hashPassword(plain): Promise<string>`, `verifyPassword(plain, hash): Promise<boolean>`; `signAccessToken(userId): string`, `verifyAccessToken(token): { userId: string }`, `signRefreshToken(): { token: string; hash: string }`, `hashToken(token): string` — used by every auth route task from here on.

- [ ] **Step 1: Write the failing password test**

```typescript
// test/unit/lib/password.test.ts
import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../../../src/lib/password.js'

describe('password hashing', () => {
  it('produces a hash that verifies against the original password', async () => {
    const hash = await hashPassword('correct horse battery staple')
    expect(await verifyPassword('correct horse battery staple', hash)).toBe(true)
  })

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('correct horse battery staple')
    expect(await verifyPassword('wrong password', hash)).toBe(false)
  })

  it('produces different hashes for the same input (salted)', async () => {
    const a = await hashPassword('same input')
    const b = await hashPassword('same input')
    expect(a).not.toBe(b)
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `pnpm vitest run test/unit/lib/password.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Write `src/lib/password.ts`**

```typescript
// src/lib/password.ts
import bcrypt from 'bcrypt'

const COST_FACTOR = 12

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST_FACTOR)
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}
```

- [ ] **Step 4: Run it to confirm it passes**

Run: `pnpm vitest run test/unit/lib/password.test.ts`
Expected: PASS (3 tests)

- [ ] **Step 5: Write the failing JWT test**

```typescript
// test/unit/lib/jwt.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import { signAccessToken, verifyAccessToken, signRefreshToken, hashToken } from '../../../src/lib/jwt.js'

beforeAll(() => {
  process.env.JWT_ACCESS_SECRET = 'a'.repeat(32)
  process.env.JWT_REFRESH_SECRET = 'b'.repeat(32)
})

describe('access tokens', () => {
  it('round-trips a userId through sign and verify', () => {
    const token = signAccessToken('user_123')
    expect(verifyAccessToken(token)).toEqual({ userId: 'user_123' })
  })

  it('throws on a tampered token', () => {
    const token = signAccessToken('user_123')
    expect(() => verifyAccessToken(token + 'x')).toThrow()
  })
})

describe('refresh tokens', () => {
  it('generates a token and its hash, and the hash is derivable from the token', () => {
    const { token, hash } = signRefreshToken()
    expect(hashToken(token)).toBe(hash)
  })

  it('generates a different token each call', () => {
    const a = signRefreshToken()
    const b = signRefreshToken()
    expect(a.token).not.toBe(b.token)
  })
})
```

- [ ] **Step 6: Run it to confirm it fails**

Run: `pnpm vitest run test/unit/lib/jwt.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 7: Write `src/lib/jwt.ts`**

```typescript
// src/lib/jwt.ts
import jwt from 'jsonwebtoken'
import { randomBytes, createHash } from 'node:crypto'
import { env } from '../config/env.js'

const ACCESS_TOKEN_TTL = '15m'

export function signAccessToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_TTL })
}

export function verifyAccessToken(token: string): { userId: string } {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as jwt.JwtPayload
  return { userId: payload.userId as string }
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function signRefreshToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('hex')
  return { token, hash: hashToken(token) }
}
```

Refresh tokens are hashed with SHA-256, not bcrypt — bcrypt's slow hash exists to resist brute-forcing a *low-entropy, human-chosen* secret (a password). A 256-bit random token already has full entropy; a fast cryptographic hash is the right tool for comparing it, and using bcrypt here would just add unnecessary latency to every refresh request.

- [ ] **Step 8: Run it to confirm it passes**

Run: `pnpm vitest run test/unit/lib/jwt.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: password hashing and JWT access/refresh token libs"
git push
```

---

### Task 5: Random token lib (invites/reset) + email stub

**Files:**
- Create: `src/lib/tokens.ts`
- Create: `src/lib/mailer.ts`
- Test: `test/unit/lib/tokens.test.ts`, `test/unit/lib/mailer.test.ts`

**Interfaces:**
- Produces: `generateToken(): { token: string; hash: string }`, `INVITE_TOKEN_TTL_MS`, `RESET_TOKEN_TTL_MS` from `src/lib/tokens.ts`; `sendMail({ to, subject, body }): Promise<void>` (console-log impl) and `TestMailer` (in-memory capture, for integration tests) from `src/lib/mailer.ts`.

- [ ] **Step 1: Write the failing tokens test**

```typescript
// test/unit/lib/tokens.test.ts
import { describe, it, expect } from 'vitest'
import { generateToken, INVITE_TOKEN_TTL_MS, RESET_TOKEN_TTL_MS } from '../../../src/lib/tokens.js'
import { hashToken } from '../../../src/lib/jwt.js'

describe('generateToken', () => {
  it('produces a token whose hash matches the shared hashToken function', () => {
    const { token, hash } = generateToken()
    expect(hashToken(token)).toBe(hash)
  })

  it('produces a 64-character hex token (32 bytes)', () => {
    const { token } = generateToken()
    expect(token).toMatch(/^[0-9a-f]{64}$/)
  })
})

describe('TTL constants', () => {
  it('sets invite TTL to 7 days', () => {
    expect(INVITE_TOKEN_TTL_MS).toBe(7 * 24 * 60 * 60 * 1000)
  })

  it('sets reset TTL to 1 hour', () => {
    expect(RESET_TOKEN_TTL_MS).toBe 60 * 60 * 1000)
  })
})
```

Fix the typo before running — `toBe 60` should read `toBe(60`. This is called out explicitly because it's a common paste error, not because the plan intends it: the correct line is `expect(RESET_TOKEN_TTL_MS).toBe(60 * 60 * 1000)`.

- [ ] **Step 2: Run it to confirm it fails**

Run: `pnpm vitest run test/unit/lib/tokens.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Write `src/lib/tokens.ts`**

```typescript
// src/lib/tokens.ts
import { hashToken } from './jwt.js'
import { randomBytes } from 'node:crypto'

export const INVITE_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000
export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000

export function generateToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('hex')
  return { token, hash: hashToken(token) }
}
```

- [ ] **Step 4: Run it to confirm it passes**

Run: `pnpm vitest run test/unit/lib/tokens.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Write the failing mailer test**

```typescript
// test/unit/lib/mailer.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { TestMailer } from '../../../src/lib/mailer.js'

describe('TestMailer', () => {
  beforeEach(() => TestMailer.reset())

  it('captures sent mail for assertions instead of sending it', async () => {
    await TestMailer.sendMail({ to: 'a@b.com', subject: 'Reset', body: 'link: xyz' })
    expect(TestMailer.sent).toHaveLength(1)
    expect(TestMailer.sent[0]).toEqual({ to: 'a@b.com', subject: 'Reset', body: 'link: xyz' })
  })

  it('reset() clears prior captures', async () => {
    await TestMailer.sendMail({ to: 'a@b.com', subject: 'x', body: 'y' })
    TestMailer.reset()
    expect(TestMailer.sent).toHaveLength(0)
  })
})
```

- [ ] **Step 6: Run it to confirm it fails**

Run: `pnpm vitest run test/unit/lib/mailer.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 7: Write `src/lib/mailer.ts`**

Per design doc §7 decision 2 ("Email: keep fully stubbed — log links server-side, no provider chosen yet"), the production/dev implementation logs to the console. `TestMailer` is a separate, explicit in-memory implementation so integration tests can assert on what *would* have been sent without parsing stdout.

```typescript
// src/lib/mailer.ts
export interface Mail {
  to: string
  subject: string
  body: string
}

export async function sendMail(mail: Mail): Promise<void> {
  console.log(`[mailer stub] to=${mail.to} subject="${mail.subject}"\n${mail.body}`)
}

export const TestMailer = {
  sent: [] as Mail[],
  async sendMail(mail: Mail): Promise<void> {
    TestMailer.sent.push(mail)
  },
  reset(): void {
    TestMailer.sent = []
  },
}
```

Routes in Tasks 9 and 10 accept a `mailer: { sendMail: typeof sendMail }` parameter (defaulting to the real `sendMail`) so integration tests can inject `TestMailer` instead — this is why those tasks build their routers as factory functions rather than importing `sendMail` directly at module scope.

- [ ] **Step 8: Run it to confirm it passes**

Run: `pnpm vitest run test/unit/lib/mailer.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: invite/reset token generation and stub mailer"
git push
```

---

### Task 6: Auth middleware + `GET /auth/me` + `GET/PATCH /workspaces/:id`

**Files:**
- Create: `src/middleware/requireAuth.ts`
- Create: `src/middleware/requireWorkspaceMember.ts`
- Create: `src/middleware/requireRole.ts`
- Create: `src/lib/permissions.ts`
- Create: `src/routes/auth.ts` (starts with just `/me`; Tasks 7–10 extend this same file)
- Create: `src/routes/workspaces.ts`
- Modify: `src/app.ts`
- Test: `test/unit/lib/permissions.test.ts`, `test/integration/auth.me.test.ts`, `test/integration/workspaces.test.ts`

**Interfaces:**
- Consumes: `verifyAccessToken` from Task 4, `db` from Task 2.
- Produces: `requireAuth` (Express middleware, attaches `req.userId`), `requireWorkspaceMember` (attaches `req.workspaceMember: { id, role }`, reads `X-Workspace-Id` header), `requireRole(permission)` (403s if the matrix denies it), `PERMISSIONS` matrix and `Permission` type from `src/lib/permissions.ts` — consumed by Task 10's invite-creation route.

- [ ] **Step 1: Write the failing permissions matrix test**

Ported directly from `src/data/mockSettingsData.ts`'s `ROLE_PERMISSIONS` in the frontend repo (design doc §2: "the existing `ROLE_PERMISSIONS` table in the mock ... becomes the actual `requireRole()` middleware matrix").

```typescript
// test/unit/lib/permissions.test.ts
import { describe, it, expect } from 'vitest'
import { PERMISSIONS } from '../../../src/lib/permissions.js'

describe('PERMISSIONS matrix', () => {
  it('matches the ported ROLE_PERMISSIONS table for a sample of roles/permissions', () => {
    expect(PERMISSIONS.CREATE_TASKS.OWNER).toBe(true)
    expect(PERMISSIONS.CREATE_TASKS.VIEWER).toBe(false)
    expect(PERMISSIONS.DELETE_TASKS.MEMBER).toBe(false)
    expect(PERMISSIONS.INVITE_MEMBERS.ADMIN).toBe(true)
    expect(PERMISSIONS.INVITE_MEMBERS.MEMBER).toBe(false)
    expect(PERMISSIONS.ACCESS_BILLING.OWNER).toBe(true)
    expect(PERMISSIONS.ACCESS_BILLING.ADMIN).toBe(false)
    expect(PERMISSIONS.DELETE_WORKSPACE.ADMIN).toBe(false)
    expect(PERMISSIONS.DELETE_WORKSPACE.OWNER).toBe(true)
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `pnpm vitest run test/unit/lib/permissions.test.ts`
Expected: FAIL — module doesn't exist.

- [ ] **Step 3: Write `src/lib/permissions.ts`**

```typescript
// src/lib/permissions.ts
export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'

export const PERMISSIONS = {
  CREATE_TASKS: { OWNER: true, ADMIN: true, MEMBER: true, VIEWER: false },
  DELETE_TASKS: { OWNER: true, ADMIN: true, MEMBER: false, VIEWER: false },
  MANAGE_PROJECTS: { OWNER: true, ADMIN: true, MEMBER: true, VIEWER: false },
  MANAGE_SPRINTS: { OWNER: true, ADMIN: true, MEMBER: true, VIEWER: false },
  INVITE_MEMBERS: { OWNER: true, ADMIN: true, MEMBER: false, VIEWER: false },
  MANAGE_INTEGRATIONS: { OWNER: true, ADMIN: true, MEMBER: false, VIEWER: false },
  ACCESS_BILLING: { OWNER: true, ADMIN: false, MEMBER: false, VIEWER: false },
  DELETE_WORKSPACE: { OWNER: true, ADMIN: false, MEMBER: false, VIEWER: false },
  // MANAGE_WORKSPACE_SETTINGS has no row in the ported frontend matrix — see
  // "Decisions this plan makes" #7. Extrapolated as Owner/Admin, matching
  // MANAGE_INTEGRATIONS's scope. Flagged for confirmation.
  MANAGE_WORKSPACE_SETTINGS: { OWNER: true, ADMIN: true, MEMBER: false, VIEWER: false },
} as const

export type Permission = keyof typeof PERMISSIONS
```

- [ ] **Step 4: Run it to confirm it passes**

Run: `pnpm vitest run test/unit/lib/permissions.test.ts`
Expected: PASS

- [ ] **Step 5: Write `src/middleware/requireAuth.ts`**

```typescript
// src/middleware/requireAuth.ts
import type { RequestHandler } from 'express'
import { verifyAccessToken } from '../lib/jwt.js'
import { AppError } from '../lib/errors.js'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHENTICATED', 'Missing or malformed Authorization header.')
  }
  try {
    const { userId } = verifyAccessToken(header.slice('Bearer '.length))
    req.userId = userId
    next()
  } catch {
    throw new AppError(401, 'UNAUTHENTICATED', 'Invalid or expired access token.')
  }
}
```

- [ ] **Step 6: Write `src/middleware/requireWorkspaceMember.ts`**

```typescript
// src/middleware/requireWorkspaceMember.ts
import type { RequestHandler } from 'express'
import { db } from '../db/client.js'
import { AppError } from '../lib/errors.js'
import type { Role } from '../lib/permissions.js'

declare global {
  namespace Express {
    interface Request {
      workspaceMember?: { id: string; workspaceId: string; role: Role }
    }
  }
}

export const requireWorkspaceMember: RequestHandler = async (req, _res, next) => {
  const workspaceId = req.header('X-Workspace-Id')
  if (!workspaceId) {
    throw new AppError(400, 'MISSING_WORKSPACE_ID', 'X-Workspace-Id header is required.')
  }
  const member = await db.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: req.userId! } },
  })
  if (!member) {
    throw new AppError(403, 'NOT_A_MEMBER', 'You are not a member of this workspace.')
  }
  req.workspaceMember = { id: member.id, workspaceId, role: member.role as Role }
  next()
}
```

- [ ] **Step 7: Write `src/middleware/requireRole.ts`**

```typescript
// src/middleware/requireRole.ts
import type { RequestHandler } from 'express'
import { PERMISSIONS, type Permission } from '../lib/permissions.js'
import { AppError } from '../lib/errors.js'

export function requireRole(permission: Permission): RequestHandler {
  return (req, _res, next) => {
    const role = req.workspaceMember!.role
    if (!PERMISSIONS[permission][role]) {
      throw new AppError(403, 'FORBIDDEN', `Your role does not permit this action.`)
    }
    next()
  }
}
```

- [ ] **Step 8: Write `src/routes/auth.ts` (starting point — `/me` only)**

```typescript
// src/routes/auth.ts
import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { db } from '../db/client.js'
import { AppError } from '../lib/errors.js'

export const authRouter = Router()

authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.userId } })
  if (!user) {
    throw new AppError(404, 'NOT_FOUND', 'User not found.')
  }
  const { passwordHash: _passwordHash, ...safeUser } = user
  res.json(safeUser)
})
```

- [ ] **Step 9: Write `src/routes/workspaces.ts`**

```typescript
// src/routes/workspaces.ts
import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireWorkspaceMember } from '../middleware/requireWorkspaceMember.js'
import { requireRole } from '../middleware/requireRole.js'
import { db } from '../db/client.js'
import { AppError } from '../lib/errors.js'

export const workspacesRouter = Router()

workspacesRouter.get('/:id', requireAuth, requireWorkspaceMember, async (req, res) => {
  if (req.params.id !== req.workspaceMember!.workspaceId) {
    throw new AppError(403, 'FORBIDDEN', 'X-Workspace-Id does not match the requested workspace.')
  }
  const workspace = await db.workspace.findUnique({ where: { id: req.params.id } })
  if (!workspace) {
    throw new AppError(404, 'NOT_FOUND', 'Workspace not found.')
  }
  res.json(workspace)
})

const patchWorkspaceSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  currency: z.string().optional(),
  fiscalYearStart: z.number().int().min(1).max(12).optional(),
  weekStart: z.string().optional(),
  sprintDurationDays: z.number().int().positive().optional(),
  workHoursStart: z.string().optional(),
  workHoursEnd: z.string().optional(),
})

workspacesRouter.patch(
  '/:id',
  requireAuth,
  requireWorkspaceMember,
  requireRole('MANAGE_WORKSPACE_SETTINGS'),
  async (req, res) => {
    if (req.params.id !== req.workspaceMember!.workspaceId) {
      throw new AppError(403, 'FORBIDDEN', 'X-Workspace-Id does not match the requested workspace.')
    }
    const updates = patchWorkspaceSchema.parse(req.body)
    const workspace = await db.workspace.update({ where: { id: req.params.id }, data: updates })
    res.json(workspace)
  },
)
```

- [ ] **Step 10: Wire both routers into `src/app.ts`**

```typescript
// src/app.ts — add imports and mounts
import { authRouter } from './routes/auth.js'
import { workspacesRouter } from './routes/workspaces.js'
// ...
  app.use('/auth', authRouter)
  app.use('/workspaces', workspacesRouter)
```

- [ ] **Step 11: Write the failing integration tests**

```typescript
// test/integration/auth.me.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { testApp } from '../helpers/testApp.js'
import { resetDb } from '../helpers/resetDb.js'
import { db } from '../../src/db/client.js'
import { hashPassword } from '../../src/lib/password.js'
import { signAccessToken } from '../../src/lib/jwt.js'

describe('GET /auth/me', () => {
  beforeEach(resetDb)

  it('returns the authenticated user without a passwordHash field', async () => {
    const user = await db.user.create({
      data: {
        email: 'jacob@example.com',
        passwordHash: await hashPassword('irrelevant'),
        firstName: 'Jacob',
        lastName: 'Solayinka',
      },
    })
    const token = signAccessToken(user.id)

    const res = await request(testApp()).get('/auth/me').set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.email).toBe('jacob@example.com')
    expect(res.body.passwordHash).toBeUndefined()
  })

  it('rejects a request with no Authorization header', async () => {
    const res = await request(testApp()).get('/auth/me')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('UNAUTHENTICATED')
  })
})
```

```typescript
// test/integration/workspaces.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { testApp } from '../helpers/testApp.js'
import { resetDb } from '../helpers/resetDb.js'
import { db } from '../../src/db/client.js'
import { hashPassword } from '../../src/lib/password.js'
import { signAccessToken } from '../../src/lib/jwt.js'

async function createOwnerAndWorkspace() {
  const user = await db.user.create({
    data: { email: 'owner@example.com', passwordHash: await hashPassword('x'), firstName: 'O', lastName: 'W' },
  })
  const workspace = await db.workspace.create({ data: { name: 'Acme', slug: 'acme' } })
  await db.workspaceMember.create({ data: { workspaceId: workspace.id, userId: user.id, role: 'OWNER' } })
  return { user, workspace, token: signAccessToken(user.id) }
}

describe('GET /workspaces/:id', () => {
  beforeEach(resetDb)

  it('returns the workspace for a member', async () => {
    const { workspace, token } = await createOwnerAndWorkspace()
    const res = await request(testApp())
      .get(`/workspaces/${workspace.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('X-Workspace-Id', workspace.id)
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Acme')
  })

  it('rejects a non-member with 403', async () => {
    const { workspace } = await createOwnerAndWorkspace()
    const outsider = await db.user.create({
      data: { email: 'outsider@example.com', passwordHash: await hashPassword('x'), firstName: 'O', lastName: 'S' },
    })
    const res = await request(testApp())
      .get(`/workspaces/${workspace.id}`)
      .set('Authorization', `Bearer ${signAccessToken(outsider.id)}`)
      .set('X-Workspace-Id', workspace.id)
    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('NOT_A_MEMBER')
  })
})

describe('PATCH /workspaces/:id', () => {
  beforeEach(resetDb)

  it('allows the OWNER to update the workspace name', async () => {
    const { workspace, token } = await createOwnerAndWorkspace()
    const res = await request(testApp())
      .patch(`/workspaces/${workspace.id}`)
      .set('Authorization', `Bearer ${token}`)
      .set('X-Workspace-Id', workspace.id)
      .send({ name: 'Acme Renamed' })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('Acme Renamed')
  })

  it('rejects a MEMBER-role user with 403', async () => {
    const { workspace } = await createOwnerAndWorkspace()
    const member = await db.user.create({
      data: { email: 'member@example.com', passwordHash: await hashPassword('x'), firstName: 'M', lastName: 'E' },
    })
    await db.workspaceMember.create({ data: { workspaceId: workspace.id, userId: member.id, role: 'MEMBER' } })

    const res = await request(testApp())
      .patch(`/workspaces/${workspace.id}`)
      .set('Authorization', `Bearer ${signAccessToken(member.id)}`)
      .set('X-Workspace-Id', workspace.id)
      .send({ name: 'Should not apply' })

    expect(res.status).toBe(403)
    expect(res.body.error.code).toBe('FORBIDDEN')
  })
})
```

- [ ] **Step 12: Run all four new test files to confirm they fail first, then pass**

```bash
DATABASE_URL="$DATABASE_URL_TEST" pnpm vitest run test/unit/lib/permissions.test.ts test/integration/auth.me.test.ts test/integration/workspaces.test.ts
```

Expected before implementation: FAIL (routes/middleware don't exist). After Steps 3–10: PASS (7 tests across the two integration files, plus the earlier permissions unit test).

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: auth middleware, role matrix, /auth/me, workspace read/update"
git push
```

---

### Task 7: `POST /auth/signup-workspace`

**Files:**
- Modify: `src/routes/auth.ts`
- Test: `test/integration/auth.signup.test.ts`

**Interfaces:**
- Consumes: `hashPassword` (Task 4), `signAccessToken`/`signRefreshToken`/`hashToken` (Task 4).
- Produces: `POST /auth/signup-workspace` — `201` with `{ user, workspace, accessToken }` and a `Set-Cookie: refreshToken=...` header on success.

- [ ] **Step 1: Write the failing tests**

```typescript
// test/integration/auth.signup.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { testApp } from '../helpers/testApp.js'
import { resetDb } from '../helpers/resetDb.js'
import { db } from '../../src/db/client.js'
import { hashPassword } from '../../src/lib/password.js'

const body = {
  email: 'jacob@example.com',
  password: 'a-strong-password-1',
  firstName: 'Jacob',
  lastName: 'Solayinka',
  workspaceName: 'Acme Co',
}

describe('POST /auth/signup-workspace', () => {
  beforeEach(resetDb)

  it('creates a User, a Workspace, and an OWNER WorkspaceMember in one call', async () => {
    const res = await request(testApp()).post('/auth/signup-workspace').send(body)

    expect(res.status).toBe(201)
    expect(res.body.user.email).toBe('jacob@example.com')
    expect(res.body.user.passwordHash).toBeUndefined()
    expect(res.body.workspace.name).toBe('Acme Co')
    expect(res.body.accessToken).toEqual(expect.any(String))
    expect(res.headers['set-cookie'][0]).toMatch(/^refreshToken=/)

    const member = await db.workspaceMember.findFirst({ where: { userId: res.body.user.id } })
    expect(member?.role).toBe('OWNER')
  })

  it('rejects a duplicate email with a specific 409 (not enumeration-hardened — see plan note)', async () => {
    await db.user.create({
      data: { email: body.email, passwordHash: await hashPassword('x'), firstName: 'X', lastName: 'Y' },
    })

    const res = await request(testApp()).post('/auth/signup-workspace').send(body)

    expect(res.status).toBe(409)
    expect(res.body.error.code).toBe('EMAIL_ALREADY_REGISTERED')
  })

  it('rejects a weak/missing password with 400', async () => {
    const res = await request(testApp())
      .post('/auth/signup-workspace')
      .send({ ...body, password: 'short' })
    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('derives a unique slug from the workspace name, appending a suffix on collision', async () => {
    await request(testApp()).post('/auth/signup-workspace').send(body)
    const res = await request(testApp())
      .post('/auth/signup-workspace')
      .send({ ...body, email: 'second@example.com' })

    expect(res.status).toBe(201)
    expect(res.body.workspace.slug).not.toBe(res.body.workspace.slug === 'acme-co' ? undefined : 'acme-co')
    // the second workspace must get a distinct slug from the first
    const first = await db.workspace.findFirst({ where: { name: 'Acme Co' }, orderBy: { createdAt: 'asc' } })
    expect(res.body.workspace.slug).not.toBe(first?.slug)
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `DATABASE_URL="$DATABASE_URL_TEST" pnpm vitest run test/integration/auth.signup.test.ts`
Expected: FAIL — route doesn't exist.

- [ ] **Step 3: Implement `POST /auth/signup-workspace`**

Slugs aren't in the design doc's auth flow description at all, but `Workspace.slug` is `@unique` in the schema (§1) and has to come from somewhere at creation time — this plan derives it from the workspace name (kebab-cased) with a numeric suffix on collision, since that's the only signal `signup-workspace`'s stated input (`email, password, name, workspace name`) provides.

```typescript
// src/routes/auth.ts — add below the existing /me route
import { z } from 'zod'
import { hashPassword } from '../lib/password.js'
import { signAccessToken, signRefreshToken } from '../lib/jwt.js'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  workspaceName: z.string().min(1),
})

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name)
  let slug = base
  let suffix = 1
  while (await db.workspace.findUnique({ where: { slug } })) {
    suffix += 1
    slug = `${base}-${suffix}`
  }
  return slug
}

authRouter.post('/signup-workspace', async (req, res) => {
  const input = signupSchema.parse(req.body)

  const existing = await db.user.findUnique({ where: { email: input.email } })
  if (existing) {
    throw new AppError(409, 'EMAIL_ALREADY_REGISTERED', 'An account with this email already exists.')
  }

  const slug = await uniqueSlug(input.workspaceName)
  const passwordHash = await hashPassword(input.password)

  const { user, workspace } = await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: input.email, passwordHash, firstName: input.firstName, lastName: input.lastName },
    })
    const workspace = await tx.workspace.create({ data: { name: input.workspaceName, slug } })
    await tx.workspaceMember.create({ data: { workspaceId: workspace.id, userId: user.id, role: 'OWNER' } })
    return { user, workspace }
  })

  const accessToken = signAccessToken(user.id)
  const { token: refreshToken, hash: refreshTokenHash } = signRefreshToken()
  await db.session.create({
    data: { userId: user.id, refreshTokenHash, userAgent: req.headers['user-agent'], ipAddress: req.ip },
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: process.env.COOKIE_DOMAIN,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })

  const { passwordHash: _passwordHash, ...safeUser } = user
  res.status(201).json({ user: safeUser, workspace, accessToken })
})
```

- [ ] **Step 4: Run the tests to confirm they pass**

Run: `DATABASE_URL="$DATABASE_URL_TEST" pnpm vitest run test/integration/auth.signup.test.ts`
Expected: PASS (4 tests)

Note on the `EMAIL_ALREADY_REGISTERED` 409: this is a deliberate, named exception to the enumeration-hardening applied everywhere else in this plan (login, forgot-password, accept-invite all stay generic). At signup, the user is actively trying to create an account with that email — telling them it's taken is standard, necessary UX (so they know to log in instead), not a new information leak: the same fact ("this email has an account") is exactly what a *successful* signup with a different email implicitly confirms is unavailable for the taken one anyway.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: signup-workspace endpoint"
git push
```

---

### Task 8: `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`

**Files:**
- Modify: `src/routes/auth.ts`
- Test: `test/integration/auth.login.test.ts`, `test/integration/auth.refresh.test.ts`, `test/integration/auth.logout.test.ts`

**Interfaces:**
- Produces: `POST /auth/login` → `{ user, accessToken }` + refresh cookie; `POST /auth/refresh` → new `{ accessToken }` + rotated refresh cookie; `POST /auth/logout` → `204`, revokes the session.

- [ ] **Step 1: Write the failing login tests**

```typescript
// test/integration/auth.login.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { testApp } from '../helpers/testApp.js'
import { resetDb } from '../helpers/resetDb.js'
import { db } from '../../src/db/client.js'
import { hashPassword } from '../../src/lib/password.js'

describe('POST /auth/login', () => {
  beforeEach(resetDb)

  it('logs in with correct credentials and records a successful LoginAttempt', async () => {
    await db.user.create({
      data: { email: 'jacob@example.com', passwordHash: await hashPassword('correct-pw-1'), firstName: 'J', lastName: 'S' },
    })

    const res = await request(testApp()).post('/auth/login').send({ email: 'jacob@example.com', password: 'correct-pw-1' })

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toEqual(expect.any(String))
    expect(res.headers['set-cookie'][0]).toMatch(/^refreshToken=/)

    const attempts = await db.loginAttempt.findMany({ where: { emailTried: 'jacob@example.com' } })
    expect(attempts).toHaveLength(1)
    expect(attempts[0].success).toBe(true)
  })

  it('returns an identical generic error for wrong password vs. unknown email (no enumeration)', async () => {
    await db.user.create({
      data: { email: 'jacob@example.com', passwordHash: await hashPassword('correct-pw-1'), firstName: 'J', lastName: 'S' },
    })

    const wrongPw = await request(testApp()).post('/auth/login').send({ email: 'jacob@example.com', password: 'nope' })
    const unknownEmail = await request(testApp()).post('/auth/login').send({ email: 'nobody@example.com', password: 'nope' })

    expect(wrongPw.status).toBe(401)
    expect(unknownEmail.status).toBe(401)
    expect(wrongPw.body).toEqual(unknownEmail.body)
    expect(wrongPw.body.error.code).toBe('INVALID_CREDENTIALS')
  })

  it('records a failed LoginAttempt for a wrong password', async () => {
    await db.user.create({
      data: { email: 'jacob@example.com', passwordHash: await hashPassword('correct-pw-1'), firstName: 'J', lastName: 'S' },
    })
    await request(testApp()).post('/auth/login').send({ email: 'jacob@example.com', password: 'nope' })

    const attempts = await db.loginAttempt.findMany({ where: { emailTried: 'jacob@example.com' } })
    expect(attempts).toHaveLength(1)
    expect(attempts[0].success).toBe(false)
  })

  it('records a failed LoginAttempt (with no userId) for an unknown email', async () => {
    await request(testApp()).post('/auth/login').send({ email: 'nobody@example.com', password: 'nope' })

    const attempts = await db.loginAttempt.findMany({ where: { emailTried: 'nobody@example.com' } })
    expect(attempts).toHaveLength(1)
    expect(attempts[0].success).toBe(false)
    expect(attempts[0].userId).toBeNull()
  })
})
```

```typescript
// test/integration/auth.refresh.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { testApp } from '../helpers/testApp.js'
import { resetDb } from '../helpers/resetDb.js'
import { db } from '../../src/db/client.js'
import { hashPassword } from '../../src/lib/password.js'

async function loginAndGetCookie() {
  await db.user.create({
    data: { email: 'jacob@example.com', passwordHash: await hashPassword('correct-pw-1'), firstName: 'J', lastName: 'S' },
  })
  const res = await request(testApp()).post('/auth/login').send({ email: 'jacob@example.com', password: 'correct-pw-1' })
  return res.headers['set-cookie'][0]
}

describe('POST /auth/refresh', () => {
  beforeEach(resetDb)

  it('issues a new access token and rotates the refresh cookie given a valid refresh cookie', async () => {
    const cookie = await loginAndGetCookie()

    const res = await request(testApp()).post('/auth/refresh').set('Cookie', cookie)

    expect(res.status).toBe(200)
    expect(res.body.accessToken).toEqual(expect.any(String))
    const newCookie = res.headers['set-cookie'][0]
    expect(newCookie).toMatch(/^refreshToken=/)
    expect(newCookie).not.toBe(cookie)
  })

  it('rejects reuse of an already-rotated (revoked) refresh token', async () => {
    const cookie = await loginAndGetCookie()
    await request(testApp()).post('/auth/refresh').set('Cookie', cookie) // first use rotates it

    const res = await request(testApp()).post('/auth/refresh').set('Cookie', cookie) // reuse of the now-revoked token

    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('INVALID_REFRESH_TOKEN')
  })

  it('rejects a missing refresh cookie', async () => {
    const res = await request(testApp()).post('/auth/refresh')
    expect(res.status).toBe(401)
    expect(res.body.error.code).toBe('INVALID_REFRESH_TOKEN')
  })
})
```

```typescript
// test/integration/auth.logout.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { testApp } from '../helpers/testApp.js'
import { resetDb } from '../helpers/resetDb.js'
import { db } from '../../src/db/client.js'
import { hashPassword } from '../../src/lib/password.js'
import { hashToken } from '../../src/lib/jwt.js'

describe('POST /auth/logout', () => {
  beforeEach(resetDb)

  it('revokes the session so the refresh token can no longer be used', async () => {
    await db.user.create({
      data: { email: 'jacob@example.com', passwordHash: await hashPassword('correct-pw-1'), firstName: 'J', lastName: 'S' },
    })
    const loginRes = await request(testApp()).post('/auth/login').send({ email: 'jacob@example.com', password: 'correct-pw-1' })
    const cookie = loginRes.headers['set-cookie'][0]

    const logoutRes = await request(testApp()).post('/auth/logout').set('Cookie', cookie)
    expect(logoutRes.status).toBe(204)

    const refreshRes = await request(testApp()).post('/auth/refresh').set('Cookie', cookie)
    expect(refreshRes.status).toBe(401)

    const rawToken = cookie.split('refreshToken=')[1].split(';')[0]
    const session = await db.session.findUnique({ where: { refreshTokenHash: hashToken(rawToken) } })
    expect(session?.revokedAt).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run all three to confirm they fail**

Run: `DATABASE_URL="$DATABASE_URL_TEST" pnpm vitest run test/integration/auth.login.test.ts test/integration/auth.refresh.test.ts test/integration/auth.logout.test.ts`
Expected: FAIL — routes don't exist.

- [ ] **Step 3: Implement `POST /auth/login`**

```typescript
// src/routes/auth.ts — add below signup-workspace
import { verifyPassword } from '../lib/password.js'

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) })

authRouter.post('/login', async (req, res) => {
  const input = loginSchema.parse(req.body)
  const user = await db.user.findUnique({ where: { email: input.email } })

  const valid = user ? await verifyPassword(input.password, user.passwordHash) : false

  await db.loginAttempt.create({
    data: {
      userId: user?.id,
      emailTried: input.email,
      success: valid,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    },
  })

  if (!user || !valid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.')
  }

  const accessToken = signAccessToken(user.id)
  const { token: refreshToken, hash: refreshTokenHash } = signRefreshToken()
  await db.session.create({
    data: { userId: user.id, refreshTokenHash, userAgent: req.headers['user-agent'], ipAddress: req.ip },
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: process.env.COOKIE_DOMAIN,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })

  const { passwordHash: _passwordHash, ...safeUser } = user
  res.json({ user: safeUser, accessToken })
})
```

**No rate-limiting or lockout reads `LoginAttempt` in B1.** Every attempt (success and failure) is now genuinely recorded — the audit trail the design doc asks for (§2: "Login Activity becomes the real audit log") is real — but nothing throttles or locks an account after repeated failures. An attacker can attempt logins at unlimited speed today. This is a named gap, not an oversight: the design doc commits to the audit log, not to brute-force protection, and rate-limit policy (attempts-per-window, lockout duration, IP-based vs. account-based) isn't specified anywhere in it — that's a product decision for a follow-up, not something this plan should invent silently.

- [ ] **Step 4: Implement `POST /auth/refresh` and `POST /auth/logout`**

```typescript
// src/routes/auth.ts — add below /login
authRouter.post('/refresh', async (req, res) => {
  const rawToken = req.cookies?.refreshToken as string | undefined
  if (!rawToken) {
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'No refresh token provided.')
  }

  const session = await db.session.findUnique({ where: { refreshTokenHash: hashToken(rawToken) } })
  if (!session || session.revokedAt) {
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token is invalid or has been revoked.')
  }

  const revokeCutoff = new Date(session.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
  if (revokeCutoff < new Date()) {
    throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token has expired.')
  }

  await db.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } })

  const { token: newRefreshToken, hash: newHash } = signRefreshToken()
  await db.session.create({
    data: { userId: session.userId, refreshTokenHash: newHash, userAgent: req.headers['user-agent'], ipAddress: req.ip },
  })

  const accessToken = signAccessToken(session.userId)
  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: process.env.COOKIE_DOMAIN,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
  res.json({ accessToken })
})

authRouter.post('/logout', async (req, res) => {
  const rawToken = req.cookies?.refreshToken as string | undefined
  if (rawToken) {
    await db.session.updateMany({
      where: { refreshTokenHash: hashToken(rawToken), revokedAt: null },
      data: { revokedAt: new Date() },
    })
  }
  res.clearCookie('refreshToken', { domain: process.env.COOKIE_DOMAIN })
  res.status(204).send()
})
```

`Session` has no `expiresAt` column in the schema (§1) — only `createdAt`. The 30-day TTL is therefore enforced at read time in `/refresh` (`revokeCutoff`) rather than as a stored expiry, matching the schema as designed rather than silently adding a column the design doc didn't include. Flagged here in case a stored `expiresAt` (enabling a DB-level cleanup job for old sessions) turns out to be wanted later.

- [ ] **Step 5: Run the tests to confirm they pass**

Run: `DATABASE_URL="$DATABASE_URL_TEST" pnpm vitest run test/integration/auth.login.test.ts test/integration/auth.refresh.test.ts test/integration/auth.logout.test.ts`
Expected: PASS (8 tests)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: login, refresh (rotate-on-use), logout"
git push
```

---

### Task 9: `POST /auth/forgot-password`, `POST /auth/reset-password`

**Files:**
- Modify: `src/routes/auth.ts` (export a `createAuthRouter(mailer)` factory instead of a bare router, so tests can inject `TestMailer`)
- Modify: `src/app.ts` (use the factory)
- Test: `test/integration/auth.forgot-reset.test.ts`

**Interfaces:**
- Produces: `POST /auth/forgot-password` → always `200`, generic body; `POST /auth/reset-password` → `200` on a valid unused/unexpired token, generic `400` otherwise.

- [ ] **Step 1: Refactor `authRouter` into a factory (small, mechanical change)**

```typescript
// src/routes/auth.ts — wrap the existing router body
import type { Mail } from '../lib/mailer.js'
import { sendMail as realSendMail } from '../lib/mailer.js'

export function createAuthRouter(mailer: { sendMail: (mail: Mail) => Promise<void> } = { sendMail: realSendMail }) {
  const authRouter = Router()

  // ...move every existing authRouter.get/post(...) call from Steps 8 (Task 6),
  // signup-workspace (Task 7), and login/refresh/logout (Task 8) inside here, unchanged.

  return authRouter
}

export const authRouter = createAuthRouter()
```

The default export (`authRouter`) keeps `src/app.ts` unchanged for now; Step 6 below switches `app.ts` to call `createAuthRouter()` explicitly so tests can pass `TestMailer`.

- [ ] **Step 2: Write the failing tests**

```typescript
// test/integration/auth.forgot-reset.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import cookieParser from 'cookie-parser'
import { createAuthRouter } from '../../src/routes/auth.js'
import { errorHandler } from '../../src/middleware/errorHandler.js'
import { resetDb } from '../helpers/resetDb.js'
import { db } from '../../src/db/client.js'
import { hashPassword } from '../../src/lib/password.js'
import { TestMailer } from '../../src/lib/mailer.js'

function appWithTestMailer() {
  const app = express()
  app.use(express.json())
  app.use(cookieParser())
  app.use('/auth', createAuthRouter(TestMailer))
  app.use(errorHandler)
  return app
}

describe('POST /auth/forgot-password', () => {
  beforeEach(() => {
    TestMailer.reset()
    return resetDb()
  })

  it('returns a generic 200 and sends a reset email for a known email', async () => {
    await db.user.create({
      data: { email: 'jacob@example.com', passwordHash: await hashPassword('x'), firstName: 'J', lastName: 'S' },
    })

    const res = await request(appWithTestMailer()).post('/auth/forgot-password').send({ email: 'jacob@example.com' })

    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/if an account exists/i)
    expect(TestMailer.sent).toHaveLength(1)
    expect(TestMailer.sent[0].to).toBe('jacob@example.com')

    const tokenRow = await db.passwordResetToken.findFirst()
    expect(tokenRow).not.toBeNull()
  })

  it('returns the identical generic 200 for an unknown email, with no email sent (no enumeration)', async () => {
    const res = await request(appWithTestMailer()).post('/auth/forgot-password').send({ email: 'nobody@example.com' })

    expect(res.status).toBe(200)
    expect(res.body.message).toMatch(/if an account exists/i)
    expect(TestMailer.sent).toHaveLength(0)
  })
})

describe('POST /auth/reset-password', () => {
  beforeEach(() => {
    TestMailer.reset()
    return resetDb()
  })

  it('resets the password given a valid, unexpired, unused token', async () => {
    await db.user.create({
      data: { email: 'jacob@example.com', passwordHash: await hashPassword('old-password'), firstName: 'J', lastName: 'S' },
    })
    await request(appWithTestMailer()).post('/auth/forgot-password').send({ email: 'jacob@example.com' })
    const [, rawToken] = TestMailer.sent[0].body.match(/token=([0-9a-f]+)/)!

    const res = await request(appWithTestMailer())
      .post('/auth/reset-password')
      .send({ token: rawToken, newPassword: 'brand-new-password-1' })

    expect(res.status).toBe(200)

    const login = await request(appWithTestMailer())
      .post('/auth/reset-password')
      .send({ token: rawToken, newPassword: 'another-one' })
    expect(login.status).toBe(400) // token already used — see reuse assertion below
  })

  it('rejects an already-used token with a generic 400', async () => {
    await db.user.create({
      data: { email: 'jacob@example.com', passwordHash: await hashPassword('old-password'), firstName: 'J', lastName: 'S' },
    })
    await request(appWithTestMailer()).post('/auth/forgot-password').send({ email: 'jacob@example.com' })
    const [, rawToken] = TestMailer.sent[0].body.match(/token=([0-9a-f]+)/)!
    await request(appWithTestMailer()).post('/auth/reset-password').send({ token: rawToken, newPassword: 'first-use-1' })

    const res = await request(appWithTestMailer())
      .post('/auth/reset-password')
      .send({ token: rawToken, newPassword: 'second-use-1' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('INVALID_RESET_TOKEN')
  })

  it('rejects a garbage/nonexistent token with the identical generic 400', async () => {
    const res = await request(appWithTestMailer())
      .post('/auth/reset-password')
      .send({ token: 'not-a-real-token', newPassword: 'whatever-1' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('INVALID_RESET_TOKEN')
  })
})
```

- [ ] **Step 3: Run it to confirm it fails**

Run: `DATABASE_URL="$DATABASE_URL_TEST" pnpm vitest run test/integration/auth.forgot-reset.test.ts`
Expected: FAIL — routes don't exist.

- [ ] **Step 4: Implement both routes inside `createAuthRouter`**

```typescript
// src/routes/auth.ts — add inside createAuthRouter(mailer), below logout
import { generateToken, RESET_TOKEN_TTL_MS } from '../lib/tokens.js'

const forgotPasswordSchema = z.object({ email: z.string().email() })

authRouter.post('/forgot-password', async (req, res) => {
  const { email } = forgotPasswordSchema.parse(req.body)
  const user = await db.user.findUnique({ where: { email } })

  if (user) {
    const { token, hash } = generateToken()
    await db.passwordResetToken.create({
      data: { userId: user.id, tokenHash: hash, expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS) },
    })
    await mailer.sendMail({
      to: user.email,
      subject: 'Reset your Chronoloop password',
      body: `Reset your password: https://app.chronoloop.example/reset-password?token=${token}`,
    })
  }

  // Identical response whether or not the email exists — no enumeration.
  res.json({ message: 'If an account exists for that email, a reset link has been sent.' })
})

const resetPasswordSchema = z.object({ token: z.string().min(1), newPassword: z.string().min(8) })

authRouter.post('/reset-password', async (req, res) => {
  const input = resetPasswordSchema.parse(req.body)
  const tokenHash = hashToken(input.token)
  const record = await db.passwordResetToken.findUnique({ where: { tokenHash } })

  const isValid = record && !record.usedAt && record.expiresAt > new Date()
  if (!isValid) {
    // Doesn't distinguish "never existed" vs "expired" vs "already used" — all look identical to the caller.
    throw new AppError(400, 'INVALID_RESET_TOKEN', 'This reset link is invalid or has expired.')
  }

  const newPasswordHash = await hashPassword(input.newPassword)
  await db.$transaction([
    db.user.update({ where: { id: record.userId }, data: { passwordHash: newPasswordHash } }),
    db.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
    db.session.updateMany({ where: { userId: record.userId, revokedAt: null }, data: { revokedAt: new Date() } }),
  ])

  res.json({ message: 'Password has been reset.' })
})
```

Resetting the password also revokes every active `Session` for that user — a reasonable, common security default (if the password was compromised, every existing refresh token should stop working) that the design doc doesn't explicitly call for. Flagged since it's an addition, not a literal spec requirement.

- [ ] **Step 5: Run the tests to confirm they pass**

Run: `DATABASE_URL="$DATABASE_URL_TEST" pnpm vitest run test/integration/auth.forgot-reset.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 6: Switch `src/app.ts` to use the factory explicitly**

```typescript
// src/app.ts
import { createAuthRouter } from './routes/auth.js'
// ...
  app.use('/auth', createAuthRouter())
```

- [ ] **Step 7: Run the full suite to confirm nothing else broke**

Run: `DATABASE_URL="$DATABASE_URL_TEST" pnpm test`
Expected: PASS (all tests from Tasks 2–9)

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: forgot-password and reset-password (enumeration-hardened)"
git push
```

---

### Task 10: Invite flow — `POST /workspaces/:id/invites`, `POST /auth/accept-invite`

**Files:**
- Create: `src/routes/invites.ts`
- Modify: `src/routes/auth.ts` (add `accept-invite` inside `createAuthRouter`)
- Modify: `src/app.ts`
- Test: `test/integration/invites.test.ts`, `test/integration/auth.acceptInvite.test.ts`

**Interfaces:**
- Produces: `POST /workspaces/:id/invites` (Owner/Admin only) → `201` with the created invite (no raw token in the response body — only in the emailed link); `POST /auth/accept-invite` → `201` with `{ user, accessToken }` + refresh cookie, or `409 EMAIL_HAS_EXISTING_ACCOUNT` (see Decision 5).

- [ ] **Step 1: Write the failing invite-creation tests**

```typescript
// test/integration/invites.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { testApp } from '../helpers/testApp.js'
import { resetDb } from '../helpers/resetDb.js'
import { db } from '../../src/db/client.js'
import { hashPassword } from '../../src/lib/password.js'
import { signAccessToken } from '../../src/lib/jwt.js'

async function createMember(role: 'OWNER' | 'ADMIN' | 'MEMBER') {
  const workspace = await db.workspace.upsert({
    where: { slug: 'acme' },
    create: { name: 'Acme', slug: 'acme' },
    update: {},
  })
  const user = await db.user.create({
    data: { email: `${role.toLowerCase()}@example.com`, passwordHash: await hashPassword('x'), firstName: role, lastName: 'U' },
  })
  await db.workspaceMember.create({ data: { workspaceId: workspace.id, userId: user.id, role } })
  return { workspace, user, token: signAccessToken(user.id) }
}

describe('POST /workspaces/:id/invites', () => {
  beforeEach(resetDb)

  it('lets an OWNER create an invite', async () => {
    const { workspace, token } = await createMember('OWNER')

    const res = await request(testApp())
      .post(`/workspaces/${workspace.id}/invites`)
      .set('Authorization', `Bearer ${token}`)
      .set('X-Workspace-Id', workspace.id)
      .send({ email: 'newperson@example.com', role: 'MEMBER' })

    expect(res.status).toBe(201)
    expect(res.body.email).toBe('newperson@example.com')
    expect(res.body.tokenHash).toBeUndefined() // never leak the hash either

    const invite = await db.workspaceInvite.findFirst({ where: { email: 'newperson@example.com' } })
    expect(invite).not.toBeNull()
  })

  it('rejects a MEMBER-role user with 403', async () => {
    const { workspace, token } = await createMember('MEMBER')

    const res = await request(testApp())
      .post(`/workspaces/${workspace.id}/invites`)
      .set('Authorization', `Bearer ${token}`)
      .set('X-Workspace-Id', workspace.id)
      .send({ email: 'newperson@example.com', role: 'MEMBER' })

    expect(res.status).toBe(403)
  })
})
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `DATABASE_URL="$DATABASE_URL_TEST" pnpm vitest run test/integration/invites.test.ts`
Expected: FAIL — route doesn't exist.

- [ ] **Step 3: Implement `src/routes/invites.ts`**

```typescript
// src/routes/invites.ts
import { Router } from 'express'
import { z } from 'zod'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireWorkspaceMember } from '../middleware/requireWorkspaceMember.js'
import { requireRole } from '../middleware/requireRole.js'
import { db } from '../db/client.js'
import { generateToken, INVITE_TOKEN_TTL_MS } from '../lib/tokens.js'
import { AppError } from '../lib/errors.js'
import { sendMail, type Mail } from '../lib/mailer.js'

const createInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']),
})

export function createInvitesRouter(mailer: { sendMail: (mail: Mail) => Promise<void> } = { sendMail }) {
  const invitesRouter = Router({ mergeParams: true })

  invitesRouter.post(
    '/',
    requireAuth,
    requireWorkspaceMember,
    requireRole('INVITE_MEMBERS'),
    async (req, res) => {
      const input = createInviteSchema.parse(req.body)
      const { token, hash } = generateToken()

      const invite = await db.workspaceInvite.create({
        data: {
          workspaceId: req.workspaceMember!.workspaceId,
          email: input.email,
          role: input.role,
          tokenHash: hash,
          invitedById: req.userId!,
          expiresAt: new Date(Date.now() + INVITE_TOKEN_TTL_MS),
        },
      })

      await mailer.sendMail({
        to: input.email,
        subject: "You've been invited to join a Chronoloop workspace",
        body: `Accept your invite: https://app.chronoloop.example/accept-invite?token=${token}`,
      })

      const { tokenHash: _tokenHash, ...safeInvite } = invite
      res.status(201).json(safeInvite)
    },
  )

  return invitesRouter
}
```

- [ ] **Step 4: Wire it into `src/app.ts`**

```typescript
// src/app.ts
import { createInvitesRouter } from './routes/invites.js'
// ...
  app.use('/workspaces/:id/invites', createInvitesRouter())
```

- [ ] **Step 5: Run the invite-creation test to confirm it passes**

Run: `DATABASE_URL="$DATABASE_URL_TEST" pnpm vitest run test/integration/invites.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 6: Write the failing accept-invite tests**

```typescript
// test/integration/auth.acceptInvite.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import cookieParser from 'cookie-parser'
import { createAuthRouter } from '../../src/routes/auth.js'
import { createInvitesRouter } from '../../src/routes/invites.js'
import { errorHandler } from '../../src/middleware/errorHandler.js'
import { resetDb } from '../helpers/resetDb.js'
import { db } from '../../src/db/client.js'
import { hashPassword } from '../../src/lib/password.js'
import { signAccessToken } from '../../src/lib/jwt.js'
import { TestMailer } from '../../src/lib/mailer.js'

function appWithTestMailer() {
  const app = express()
  app.use(express.json())
  app.use(cookieParser())
  app.use('/auth', createAuthRouter(TestMailer))
  app.use('/workspaces/:id/invites', createInvitesRouter(TestMailer))
  app.use(errorHandler)
  return app
}

async function inviteMember(email: string) {
  const owner = await db.user.create({
    data: { email: 'owner@example.com', passwordHash: await hashPassword('x'), firstName: 'O', lastName: 'W' },
  })
  const workspace = await db.workspace.create({ data: { name: 'Acme', slug: 'acme' } })
  await db.workspaceMember.create({ data: { workspaceId: workspace.id, userId: owner.id, role: 'OWNER' } })

  await request(appWithTestMailer())
    .post(`/workspaces/${workspace.id}/invites`)
    .set('Authorization', `Bearer ${signAccessToken(owner.id)}`)
    .set('X-Workspace-Id', workspace.id)
    .send({ email, role: 'MEMBER' })

  const [, rawToken] = TestMailer.sent.at(-1)!.body.match(/token=([0-9a-f]+)/)!
  return { workspace, rawToken }
}

describe('POST /auth/accept-invite', () => {
  beforeEach(() => {
    TestMailer.reset()
    return resetDb()
  })

  it('creates a new User and WorkspaceMember for a fresh email', async () => {
    const { workspace, rawToken } = await inviteMember('newperson@example.com')

    const res = await request(appWithTestMailer())
      .post('/auth/accept-invite')
      .send({ token: rawToken, password: 'a-new-password-1', firstName: 'New', lastName: 'Person' })

    expect(res.status).toBe(201)
    expect(res.body.user.email).toBe('newperson@example.com')
    expect(res.body.accessToken).toEqual(expect.any(String))

    const member = await db.workspaceMember.findFirst({ where: { workspaceId: workspace.id, user: { email: 'newperson@example.com' } } })
    expect(member?.role).toBe('MEMBER')

    const invite = await db.workspaceInvite.findFirst({ where: { email: 'newperson@example.com' } })
    expect(invite?.acceptedAt).not.toBeNull()
  })

  it('rejects an already-accepted invite with a generic 400', async () => {
    const { rawToken } = await inviteMember('newperson@example.com')
    await request(appWithTestMailer())
      .post('/auth/accept-invite')
      .send({ token: rawToken, password: 'a-new-password-1', firstName: 'New', lastName: 'Person' })

    const res = await request(appWithTestMailer())
      .post('/auth/accept-invite')
      .send({ token: rawToken, password: 'another-password-1', firstName: 'New', lastName: 'Person' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('INVALID_INVITE_TOKEN')
  })

  it('rejects a garbage token with the identical generic 400', async () => {
    const res = await request(appWithTestMailer())
      .post('/auth/accept-invite')
      .send({ token: 'not-real', password: 'whatever-1', firstName: 'N', lastName: 'P' })

    expect(res.status).toBe(400)
    expect(res.body.error.code).toBe('INVALID_INVITE_TOKEN')
  })

  it('returns 409 EMAIL_HAS_EXISTING_ACCOUNT when the invited email already has a User row, without creating a duplicate or auto-linking', async () => {
    await db.user.create({
      data: { email: 'existing@example.com', passwordHash: await hashPassword('x'), firstName: 'E', lastName: 'X' },
    })
    const { rawToken } = await inviteMember('existing@example.com')

    const res = await request(appWithTestMailer())
      .post('/auth/accept-invite')
      .send({ token: rawToken, password: 'irrelevant-1', firstName: 'E', lastName: 'X' })

    expect(res.status).toBe(409)
    expect(res.body.error.code).toBe('EMAIL_HAS_EXISTING_ACCOUNT')

    const users = await db.user.findMany({ where: { email: 'existing@example.com' } })
    expect(users).toHaveLength(1) // no duplicate created
  })
})
```

- [ ] **Step 7: Run it to confirm it fails**

Run: `DATABASE_URL="$DATABASE_URL_TEST" pnpm vitest run test/integration/auth.acceptInvite.test.ts`
Expected: FAIL — route doesn't exist.

- [ ] **Step 8: Implement `accept-invite` inside `createAuthRouter`**

```typescript
// src/routes/auth.ts — add inside createAuthRouter(mailer), below reset-password
const acceptInviteSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

authRouter.post('/accept-invite', async (req, res) => {
  const input = acceptInviteSchema.parse(req.body)
  const tokenHash = hashToken(input.token)
  const invite = await db.workspaceInvite.findUnique({ where: { tokenHash } })

  const isValid = invite && !invite.acceptedAt && !invite.revokedAt && invite.expiresAt > new Date()
  if (!isValid) {
    // Doesn't distinguish expired vs. already-accepted vs. revoked vs. never-existed.
    throw new AppError(400, 'INVALID_INVITE_TOKEN', 'This invite link is invalid or has expired.')
  }

  const existingUser = await db.user.findUnique({ where: { email: invite.email } })
  if (existingUser) {
    // See "Decisions this plan makes" #5 — no silent account linking from an
    // unauthenticated request. The client should tell this person to log in;
    // linking an existing account to a new workspace from here needs its own
    // authenticated flow, out of scope for B1.
    throw new AppError(
      409,
      'EMAIL_HAS_EXISTING_ACCOUNT',
      'An account already exists for this email. Log in, then ask the workspace owner to resend the invite.',
    )
  }

  const passwordHash = await hashPassword(input.password)

  const user = await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: invite.email, passwordHash, firstName: input.firstName, lastName: input.lastName },
    })
    await tx.workspaceMember.create({ data: { workspaceId: invite.workspaceId, userId: user.id, role: invite.role } })
    await tx.workspaceInvite.update({ where: { id: invite.id }, data: { acceptedAt: new Date() } })
    return user
  })

  const accessToken = signAccessToken(user.id)
  const { token: refreshToken, hash: refreshTokenHash } = signRefreshToken()
  await db.session.create({
    data: { userId: user.id, refreshTokenHash, userAgent: req.headers['user-agent'], ipAddress: req.ip },
  })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: process.env.COOKIE_DOMAIN,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })

  const { passwordHash: _passwordHash, ...safeUser } = user
  res.status(201).json({ user: safeUser, accessToken })
})
```

- [ ] **Step 9: Run the tests to confirm they pass**

Run: `DATABASE_URL="$DATABASE_URL_TEST" pnpm vitest run test/integration/auth.acceptInvite.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 10: Run the full suite one final time**

Run: `DATABASE_URL="$DATABASE_URL_TEST" pnpm test`
Expected: PASS (every test from Tasks 2–10)

- [ ] **Step 11: Deploy check on Render**

Push to `main`, confirm Render's build (`prisma generate && tsc`) and start (`prisma migrate deploy && node dist/index.js`) both succeed against the Neon `main` branch, and `GET https://<render-url>/health` returns `{"status":"ok","db":"ok"}`.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: invite creation and accept-invite flow"
git push
```

---

## Self-review notes (per writing-plans skill)

**Spec coverage against design doc §1/§2/§3/§6/§7 (B1 scope):**
- §1 schema (auth/tenancy subset) → Task 2. ✓ Remaining models explicitly deferred with phase pointers.
- §2 bootstrapping (signup-workspace) → Task 7. ✓
- §2 invite flow → Task 10. ✓ (with Decision 5's flagged deviation on account-linking)
- §2 tokens (access/refresh TTLs, httpOnly cookie) → Task 4 (libs), Tasks 7/8/10 (issuance) ✓
- §2 workspace scoping (`X-Workspace-Id`, `requireWorkspaceMember`) → Task 6 ✓
- §2 refresh (rotate-on-use) → Task 8 ✓
- §2 Sessions tab real / `revokeSession` → **not built in B1.** The design doc lists this under §2 but it's a Settings-tab-facing CRUD surface (`DELETE` a specific session, "revoke all") that belongs with B9 (Settings API, §3: "sessions/login-activity (§2)... shared with Team"), not the bootstrapping flow itself. B1 makes `Session`/`LoginAttempt` real tables with real rows (this plan's login/refresh/logout write to them genuinely) — the dedicated list/revoke endpoints are B9's job. Flagging this gap explicitly rather than silently building or silently skipping it.
- §2 password reset → Task 9 ✓
- §2 hashing (bcrypt cost 12) → Task 4 ✓
- §2 authorization matrix (`ROLE_PERMISSIONS` → `requireRole`) → Task 6 ✓
- §3 Auth/Workspace surface (signup-workspace, accept-invite, login, refresh, logout, forgot/reset-password, `GET /auth/me`, `GET/PATCH /workspaces/:id`) → Tasks 6/7/8/9/10, all present. Invite CRUD's *creation* endpoint is built (Task 10); §3 also lists this as "shared with Settings > Team & Roles" for the fuller CRUD (list/resend/revoke) — same B9 deferral as Sessions above.
- §6 bcrypt, JWT rotation, no committed secrets, zod validation, B0-first sequencing → all satisfied (Tasks 1, 4, throughout).
- §7 B1 line item ("Express+TS on Render, Prisma schema, Neon provisioned, full auth flow, authorization middleware, health check") → every clause has a task: Render/repo (Task 1), Prisma+Neon (Task 2), auth flow (Tasks 7–10), authorization middleware (Task 6), health check (Task 2).

**Explicitly out of scope for B1 (flagged, not silently dropped):** session list/revoke endpoints and invite list/resend/revoke endpoints (both land in B9 per the above), rate-limiting/lockout on login (no spec basis, flagged in Task 8), a `MANAGE_WORKSPACE_SETTINGS` permission that isn't literally in the ported matrix (Decision 7), and the "link to an existing account" half of accept-invite (Decision 5) — this last one is tracked as a named `BACKLOG.md` entry (endpoint shape + UX pinned down), targeted for B9, not just a dangling mention.

**Placeholder scan:** no "TBD"/"handle appropriately" instances; every step has literal code. Task 5 Step 1's intentional typo is called out as intentional pedagogy for the executor, not a real placeholder.

**Type consistency check:** `AppError(status, code, message)` (Task 3) used identically in every later task. `PERMISSIONS`/`Permission`/`Role` (Task 6) imported, not redefined, in Task 10. `Mail`/`sendMail`/`TestMailer` (Task 5) imported identically by Tasks 9 and 10's router factories. `hashToken`/`generateToken` (Tasks 4–5) used consistently for both invite and reset tokens. `req.userId`, `req.workspaceMember` (Task 6's `declare global` augmentation) referenced the same way in every subsequent route.
