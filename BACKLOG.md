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
