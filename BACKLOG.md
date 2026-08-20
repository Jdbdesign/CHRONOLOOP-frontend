# Backlog

## Settings — Misleading Discard Button (UX Bug)

The "Discard" button in the Settings page header always shows a toast saying "No unsaved changes" regardless of whether the user has actually edited form fields. This is actively misleading — it implies no changes exist when they may. The button should be disabled (or hidden) when the form is clean, and should prompt or revert when dirty.

**Distinct from**: the broader "Settings needs a persistence/dirty-tracking layer" work. This item specifically calls out that the current Discard button is worse than inert — it's deceptive about state.

**Fix requires**: Implementing real dirty-state tracking across all Settings tabs (Profile, Workspace, Notifications, Appearance, Security, Billing, Team & Roles), then wiring Save/Discard to that state.

---

## Settings — No Dirty-State Tracking / Persistence Layer

Settings forms currently have no concept of "unsaved changes." Switching tabs (whether via sidebar or mobile dropdown) discards edits silently. Save always fires a success toast without actually persisting anything. A future phase should:

1. Track dirty state per-tab (or globally across the Settings page)
2. Wire the Save button to actual persistence (API or local storage)
3. Wire the Discard button to revert to last-saved state
4. Optionally guard tab-switching with a confirm dialog when dirty

---

## Phase R.4 Notes

- Integrations page layout migrated from inline styles to CSS Module (`IntegrationsPage.module.css`) — future edits to that page's layout should use the module, not inline styles
- `SettingsFormRow` component introduced as a shared responsive wrapper for 2-column form rows; reusable in any future Settings tabs or similar forms
- TeamRolesTab invite form already uses `flex-wrap: wrap` and doesn't need `SettingsFormRow`

---

## Phase R.5 Notes

- `BoardTabSwitcher` is a shared, reusable component (`src/components/ui/BoardTabSwitcher.tsx`) — any future board/kanban views should use it rather than building their own mobile tab pattern
- `useBoardTabs` hook (`src/hooks/useBoardTabs.ts`) is generic over column key type — reusable for any board that needs mobile column selection
- Board views have no drag-and-drop — if DnD is added later, the mobile tab-switcher pattern will need revisiting (can't drag between columns when only one is visible). Consider a "move to column" action menu on each card as the mobile DnD equivalent.
- Yellow tab contrast (`#EAB308` background with white text) was confirmed acceptable in browser walkthrough — no change needed, but worth re-checking if the color palette changes
- Both board view tests were updated to scope queries within the board grid container (`.board` / `.boardView`) rather than using global `getByText`, since the tab bar renders duplicate labels in the DOM. Future tests for board components should follow this pattern.

---

## Phase R.6 Notes

- `useIsMobile` hook (`src/hooks/useIsMobile.ts`) uses `useSyncExternalStore` + `matchMedia` — reusable anywhere a component needs to know if the viewport is mobile. Returns boolean, updates on resize/rotation.
- `matchMedia` mock added to `src/test/setup.ts` (returns `matches: false` / desktop mode). Any future hooks that use `matchMedia` will work in tests without additional setup.
- Week view is **hidden on mobile** (redirect to Day). If a future feature needs Week-like multi-day visibility on mobile (e.g., a 3-day view), it would need its own component — don't try to force the 7-column WeekView to work at <640px.
- Month view dots at mobile use `pointer-events: none` — tapping a cell always navigates to Day view. If individual-event quick-actions are needed on mobile month view in the future, consider a long-press or a different interaction pattern rather than making 7px dots tappable.
- CalendarPageHeader uses a belt-and-suspenders approach for the Week redirect: header intercept (prevents setting 'week' on mobile) + CalendarPage useEffect (catches resize/rotation). Both pieces are needed — don't remove one thinking the other covers it.
- CalWeekView has inline `style={{ gridTemplateColumns: '...' }}` on its header and banner sections. Since we redirect away from Week on mobile, this wasn't a problem. If Week view ever needs tablet-responsive treatment, those inline styles will need extraction to CSS classes (CSS media queries can't override inline styles without `!important`).

---

## Responsive Phase R.7 — notes

- `pointer: coarse` combined with the project's existing breakpoints (`@media (max-width: 1023px) and (pointer: coarse)`) is the established pattern for touch-target sizing — it scopes changes to touch-capable phones/tablets without affecting desktop mouse users, including desktop touchscreens (which this project doesn't target). Use this exact media query for any future touch-target work.
- **Invisible hit-area technique** (preferred over real box growth when the element sits in a tight flex row): `position: relative` on the element + `::before { content: ''; position: absolute; inset: -Npx }` where `N` = `(44 − (visual_size − 2×border_width)) / 2` for elements with a border (the pseudo-element positions relative to the padding box under `box-sizing: border-box`, not the visual/border box) — `N = (44 - visual_size) / 2` only for borderless elements. This keeps the element's visual size and flex-basis completely unchanged — zero layout risk — while still giving a 44×44 tappable area. Used for `TaskRow.module.css` `.checkbox`/`.actionBtn`, `CalendarSubHeader.module.css` `.navBtn`, and `SprintItem.module.css` `.menuBtn` in this phase, after real box growth was found (via reading the actual flex row's full sibling list in the component's `.tsx`, not just its CSS) to risk overflow/clipping in each case. Prefer real box growth (`min-width`/`min-height: 44px`) only when the containing row has genuine flex slack — verify against the `.tsx`, not just the CSS, before choosing either approach.
- **Toggle switches** are sized 44×24 rather than a strict 44×44 in this phase (`ToggleRow.module.css`, `IntSidebarPanels.module.css` webhook toggle) — a checkbox-based toggle can't cleanly separate visible track size from hit area without a markup change, out of scope for a CSS-only phase. 44×24 is generous, standard toggle proportions; use as precedent for future toggle sizing decisions.
- **Swipe gestures: none were added in this phase.** Both candidates the responsive design spec named were checked against actual code and found already handled: the mobile drawer already closes via scrim-tap (`AppShell.tsx`) and Escape, and Radix's `Toast.Provider` already has `swipeDirection="right"` built in (`ToastProvider.tsx`). No swipe-gesture code exists to add.
- **Device-width testing methodology** (no Playwright/Cypress in this repo — verification is manual): Chrome/Edge DevTools → Toggle device toolbar (Ctrl+Shift+M) — this both resizes the viewport AND flips `pointer`/`any-pointer` to `coarse`/`touch`, which is what actually makes `pointer: coarse` rules testable (a plain browser resize does not). Test at exactly 375px (iPhone SE), 390px (iPhone 14), 768px (iPad Mini), 1024px (iPad Pro landscape / the desktop boundary — always re-check this one specifically, since it's where a `max-width: 1023px` rule must stop firing). Use this checklist for any future responsive phase's verification.
- **`TeamMemberRow.module.css` is used by `TeamMemberGrid.tsx`, not `TeamMemberRow.tsx`.** The component named `TeamMemberRow.tsx` is genuinely unused (no importers) — but its CSS module is imported and actively used by `TeamMemberGrid.tsx` (aliased as `rowStyles`) to render the Team list view's row, including a real 3-dot menu (`rowStyles.menuBtn`). An earlier pass in this same phase incorrectly concluded the module was dead by checking who imports the identically-named `.tsx` component instead of who imports the `.module.css` file — the menu was found and fixed in the final-review fix wave. **Lesson for future audits:** when checking whether a CSS module's styled element is actually rendered, grep for importers of the `.module.css` file itself, not just the same-named `.tsx` — a differently-named component can import and alias any CSS module.
- **Sprints list view (`SprintItem.module.css` / `SprintItem.tsx`) is likely already cramped at mobile widths independent of this phase** — its `.inner` row has 8 flex children, most `flex-shrink: 0` (num, dates, progress `min-width:130px`, pts `min-width:44px`, team avatars, menu button), with only the name/goal column absorbing shrinkage. Rough budget: non-shrinking content alone approaches or exceeds typical mobile viewport widths even before any R.7 touch-target growth. This looks like a pre-existing gap from Phase R.5, which explicitly addressed board-view responsiveness but not list-view density. Out of scope for R.7 (a layout/density problem, not a touch-target/hover/swipe/testing one) — flagging for whoever picks up Sprints list view next.
- **`Button`'s `.ghost` variant (`src/components/ui/Button.tsx` / `Button.module.css`) was never audited for touch-target sizing in this phase.** R.7's touch-target pass covered `TaskRow`, `CalendarSubHeader`, `SprintItem`, `TeamMemberGrid`, calendar nav, and toggle switches, but did not sweep every consumer of the shared `Button` component for `variant="ghost"` usages that might render below 44×44 on touch. Needs its own audit pass: find all `variant="ghost"` call sites, check rendered size against the `pointer: coarse` breakpoint, and apply the invisible-hit-area technique (see the R.7 pattern above) where undersized.

---

## Phase B0 Notes

- `src/services/*.ts` introduced for tasks, projects, sprints, calendar, integrations, and settings — each store's mutation logic (id generation, field defaulting/merging, array add/remove/toggle) now lives in named pure functions there instead of inline in the Zustand store. Stores still own `set()`/`get()` and any UI-derived state (e.g. `tasksStore.todoKpiOverride`).
- **No `teamService.ts` yet** — `teamStore` has zero mutating actions today (it only seeds from `TEAM_MEMBERS`). Add one when Team gets its first real mutation, or when B6/F6 needs `list()` for async hydration.
- **Services return `Promise<T>` (`Promise.resolve()`-wrapped), matching the spec's B0 target exactly** (`taskService.create(input): Promise<Task>`, §4) — not left synchronous. This was a deliberate correction mid-plan: an earlier draft of this plan proposed staying synchronous to avoid touching test assertions, but that both contradicted the spec and would have forced a second refactor of every store call site once F-phases introduce real `fetch` calls. Going async now means F-phase only swaps `Promise.resolve(mockLogic())` for `await fetch(...)` inside each service function.
  - **One flagged exception:** `taskService.removeTaskAt`/`restoreTaskAt` and their store counterparts stay synchronous — `useDeleteWithUndo` needs `{ task, index }` back immediately to render the "Undo" toast, and making that async would either delay the toast (a real behavior change) or require an optimistic-delete redesign, which is out of scope here. Revisit in F1.
  - Cost was audited, not assumed: the 5 store unit-test files with mutating actions (tasks, projects, sprints, calendar, integrations — settings has no dedicated store test file) needed `await` added to direct action calls. Component tests were assumed safe because they all drive interactions through `@testing-library/user-event`, which already awaits internally — that held for every file *except* `src/components/tasks/TaskDetailBody.test.tsx`, which uses raw `fireEvent.blur` and broke when `updateTaskDescription` went async. Fixed by wrapping its two affected assertions in `await waitFor(...)`. Lesson for future audits of this kind: grep for `fireEvent.blur/change/keyDown/keyUp/submit` too, not just `fireEvent.click`.
- **A lost-update race was found and fixed mid-plan.** Any action that reads `get()` before an `await` and then commits with a flat `set({ field: computedFromThatSnapshot })` after it risks silently overwriting a concurrent mutation — the synchronous pre-refactor code couldn't have this bug (single-threaded, single-tick execution), but the async conversion opens the window. Fixed everywhere the recomputation is free (a caller-supplied external input, or a purely structural filter-by-id/index): `removeProject`, `removeSprint`, `removeWebhook`, `updateTaskById`, and six settings actions (`updateProfile`, `updateWorkspace`, `revokeSession`, `revokeAllSessions`, `setMemberRole`, `revokeInvite`) all now commit via a functional `set((state) => ...)` that recomputes against fresh state, discarding the awaited service call's return value. Left deliberately unfixed where the new value is self-referential (computed from the very field being changed — `toggleWebhook`, `toggleSyncRule`, `connectApp`/`disconnectApp`, `toggleNotification`): a safe fix there would mean duplicating the service's toggle logic in the store, and there's no concurrent-call UI path anywhere in the app today that could trigger it.
  - **Known cost of the fix that was applied:** since a functional `set()` updater can't `await`, "recompute against fresh state" means the store re-executes the same merge/filter expression the service already computed and discards the service's answer — that expression now lives in two places that must be kept in sync by hand. Low risk today since every affected service function's logic is a trivial spread/filter; if a future B-phase adds real logic (validation, transformation) to one of them, that change must also be applied to the store's inline mirror or it will silently not take effect.
  - **Known, deliberately unfixed gap:** `taskService.buildNewTask`'s `newId` and `sprintService.buildNewSprint`'s `number` are both derived from a pre-await snapshot of the collection's length/max — a double-submit in the same microtask gap could produce two entities with the same id/number. Not fixed for the same reason as above (no clean fix without pulling id-generation logic back into the store or accepting the risk); the durable fix is a server-generated id, which F1 (tasks) and F3 (sprints) deliver by construction.
- **`VITE_USE_MOCK_DATA` is still deferred, not dropped.** It has nothing to branch on until a domain has both a mock and a real implementation. It lands in each domain's own F-phase alongside that domain's first real `fetch` call — tracked here explicitly so B1+ doesn't quietly skip it.
- Initial list hydration (`tasks: MOCK_TASKS`, `projects: MOCK_PROJECTS`, etc.) intentionally stays a direct synchronous mock import in every store — routing it through an async `service.list()` now would force a loading state onto every page for no real benefit yet. That wiring belongs to each domain's F-phase alongside `VITE_USE_MOCK_DATA`.
