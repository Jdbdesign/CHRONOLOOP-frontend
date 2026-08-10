# ChronoLoop Frontend

Re-architecture of the ChronoLoop dashboard (previously a single 11,000-line `index.html`) into a maintainable Vite + React + TypeScript codebase. Same look, same behavior — see `docs/superpowers/specs/2026-08-10-chronoloop-frontend-rewrite-design.md` in the sibling `Chronoloop dashboard` repo for the full design doc.

## Stack

- Vite + React 18 + TypeScript (strict, no `any`)
- React Router for page navigation
- Zustand for client state
- CSS Modules over a ported `:root` design-token system (`src/styles/tokens.css`) — no Tailwind
- lucide-react for icons
- Vitest + React Testing Library for tests

## Getting started

```
pnpm install
pnpm dev        # start the dev server
pnpm test       # run the test suite once
pnpm test:watch # run tests in watch mode
pnpm typecheck  # tsc --noEmit
pnpm lint       # eslint
pnpm format     # prettier --write
```

## Folder structure

```
src/
  main.tsx, App.tsx       # entry point, router, top-level error boundary
  styles/                 # tokens.css (design tokens, ported verbatim from index.html), global.css
  components/
    layout/                # AppShell, Sidebar, TopBar, BrandLogo — the persistent chrome
    common/                 # ErrorBoundary and other cross-cutting components
    ui/                      # design-system primitives (Button, Modal, Dropdown, Toast, Card, Chip, Avatar) — Phase 2
    tasks/, projects/, sprints/, team/, reports/, calendar/, integrations/, settings/   # per-page components — later phases
  pages/                   # one *Page.tsx per sidebar nav item, mounted by the router
  store/                    # Zustand stores (themeStore now; tasksStore, uiStore, etc. in later phases)
  data/                     # mock data — later phases
  services/                 # thin functions over mock data now, real API later — later phases
  types/                    # shared TypeScript types — later phases
  hooks/                    # shared hooks — later phases
  lib/                      # date/formatting utilities — later phases
```

## Adding a new page

1. Create `src/pages/YourPage.tsx` exporting a component.
2. Add a `<Route path="your-path" element={<YourPage />} />` inside the `<Route element={<AppShell />}>` block in `src/App.tsx`.
3. If it needs a sidebar entry, add it to `NAV_ITEMS` in `src/components/layout/Sidebar.tsx`.

## Adding a new component

- Shared across pages → `src/components/ui/` or `src/components/common/`.
- Specific to one page's domain → `src/components/<domain>/` (e.g. `src/components/tasks/`).
- Style with a co-located CSS Module (`Component.module.css`) using the tokens from `src/styles/tokens.css` — never hardcode a color, spacing, or radius value that already has a token.
- Write a co-located `Component.test.tsx` using Vitest + React Testing Library.

## Design parity

This is a re-architecture, not a redesign. Every color, spacing value, border radius, and animation timing is copied exactly from the original `index.html`. If you find inconsistent or seemingly-accidental behavior while porting a page, flag it — don't silently "fix" it.
