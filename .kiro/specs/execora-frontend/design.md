s |
 P18 | Generate random decision sets; render decisions table; assert all required columns present per row |
| P19 | Generate random theme selections from {light, dark, system}; assert localStorage and Vuetify theme match |
| P20 | Generate random nav route paths; navigate; assert corresponding nav item has active class |
| P21 | Generate random issues; open details dialog; assert all required sections are rendered |
| P22 | Generate random user sets in store; type @ in editor; assert all users appear in suggestion mixed-status issues; complete sprint; assert open issues unlinked |
| P14 | Generate random issue sets with mixed sprintId values; assert backlog shows only issues with no sprintId |
| P15 | Generate random status filter values; assert displayed sprints match filter |
| P16 | Generate random issue sets; render issue list; assert each row has correct icon colors, chip colors, priority icons, and assignee display |
| P17 | Generate random epic sets; render roadmap summary; assert computed values are correct |
|nged, other fields updated |
| P9 | Generate random issue sets; render board; assert each column count equals filtered issue count |
| P10 | Generate random (issue, targetStatus) pairs; call moveIssue; assert issue.status === targetStatus |
| P11 | Generate random filter combinations and issue sets; assert displayed issues satisfy all active filters |
| P12 | Generate random group-by values and issue sets; assert each swimlane contains exactly the matching issues |
| P13 | Generate random active sprints withom sprint status mutations; assert status ∈ {Draft, Active, Completed} |
| P5 | Generate random non-empty summaries; call createIssue; assert key matches /^KAN-\d+$/ |
| P6 | Generate random decision payloads; call addDecision; assert id matches /^DEC-\d{3}$/ and createdBy equals currentUser |
| P7 | Generate random sprint IDs with linked issues; call deleteSprint; assert sprint removed and all linked issues have sprintId === undefined |
| P8 | Generate random decision updates; call updateDecision; assert id unchalibrary).

Each property test must run a minimum of **100 iterations**.

Each test must include a comment tag in the format:
`// Feature: execora-frontend, Property {N}: {property_text}`

**Property test mapping:**

| Property | Test description |
|---|---|
| P1 | Generate random status mutations; assert status ∈ {TODO, IN_PROGRESS, DONE} |
| P2 | Generate random issue types; assert type ∈ {Task, Bug, Story, Epic} |
| P3 | Generate random priorities; assert priority ∈ {High, Medium, Low} |
| P4 | Generate randts.

### Unit tests

Focus on:
- Specific rendering examples (login page fields, sidebar nav items, board column structure)
- Edge cases: empty summary rejected, empty password rejected, sprint with no issues disables Start button
- Integration points: `CreateIssueDrawer` calls `taskStore.createIssue`, `IssueDetailsDialog` calls `taskStore` on save
- Navigation: clicking logout navigates to `/`, clicking a space card navigates to `/board`

### Property-based tests

Use **fast-check** (TypeScript-compatible PBT - `deleteSprint` safely iterates all issues and only unlinks those with a matching `sprintId`.

**Navigation:**
- Undefined routes currently fall through without an explicit catch-all redirect. A `{ path: '/:pathMatch(.*)*', redirect: '/' }` route should be added.

---

## Testing Strategy

### Dual testing approach

Both unit tests and property-based tests are required. Unit tests verify specific examples, edge cases, and integration points. Property-based tests verify universal correctness across all valid inpu"No tasks" placeholder.
- Backlog sprint section with no issues shows a visual empty state with "Plan your sprint" messaging.
- Inbox with no matching notifications shows "All caught up!" state.
- Projects "Assigned to me" tab shows an illustrated empty state.

**Drag-and-drop:**
- `moveIssue` is a no-op if the issue ID is not found in the store.
- Drop targets show a visual `drop-line` indicator during drag-over.

**Store mutations:**
- `updateSprint` and `updateDecision` are no-ops if the ID is not found.

**Validates: Requirements 3.10**

---

## Error Handling

**Form validation:**
- Login: email format validated on blur and submit; password non-empty validated on submit. Errors displayed inline below the field. Submit button disabled during loading.
- Create Issue: empty summary prevents creation; drawer stays open.
- Create Sprint: required fields (name, start date, end date) must be non-empty before submission.
- Create Decision: title is required.

**Empty states:**
- Board columns with no issues show a ue should render the issue's summary, description area, attachments section, linked issues section, subtasks section, activity section, and a sidebar containing status, assignees, priority, story points, reporter, sprint, and time tracking fields.

**Validates: Requirements 3.8**

---

### Property 22: @mention autocomplete sources from store users

*For any* set of users in the store, typing `@` in the Quill description editor should surface suggestions that include all users from the store's `users` collection.
reading `localStorage['user-theme']` after selection returns the selected value.

**Validates: Requirements 2.8**

---

### Property 20: Sidebar active item follows route

*For any* route path that corresponds to a navigation item, navigating to that route should result in exactly that navigation item having the `active` CSS class applied.

**Validates: Requirements 2.4**

---

### Property 21: Issue details dialog renders all fields

*For any* issue in the store, opening the Issue Details dialog for that issrty 18: Decision table rendering completeness

*For any* set of decisions in the store, the Decisions page table should render one row per decision, and each row should display the ID, title, linked work, date, impact chip, status chip, and creator name.

**Validates: Requirements 12.1**

---

### Property 19: Theme persistence round-trip

*For any* theme selection (Light, Dark, System), selecting it should both apply the Vuetify theme immediately and persist the value to `localStorage['user-theme']`, such that , 9.4, 9.5**

---

### Property 17: Roadmap summary card correctness

*For any* set of epics, the roadmap summary cards should display values that are correctly computed: total count equals the number of epics, in-progress count equals epics with `statusType === 'info'`, on-track count equals epics with `statusType === 'success'`, at-risk count equals epics with `statusType === 'danger'`, and average progress equals the arithmetic mean of all epic progress values.

**Validates: Requirements 8.6**

---

### Prope"All" is selected).

**Validates: Requirements 6.2**

---

### Property 16: Issue list rendering completeness

*For any* set of issues in the store, the Issue List page should render one row per issue, and each row should display the correct type icon color (red for Bug, green for Story, blue for Task/other), the correct status chip color (secondary for TODO, info for IN_PROGRESS, success for DONE), the correct priority icon direction, and all assignee avatars with names.

**Validates: Requirements 9.1, 9.2, 9.3*Validates: Requirements 4.11**

---

### Property 14: Backlog section shows only unassigned issues

*For any* set of issues in the store, the Backlog section should display exactly those issues whose `sprintId` is `undefined` or absent.

**Validates: Requirements 5.6**

---

### Property 15: Sprint filter tabs

*For any* status filter value (All, Draft, Active, Completed) applied on the Sprint page, the displayed sprint rows should contain only sprints whose `status` matches the filter (or all sprints when ction (Assignee, Priority, or Epic) and any set of issues, each swimlane should contain exactly the issues that match that group's value, with no issue appearing in more than one swimlane.

**Validates: Requirements 4.7**

---

### Property 13: Sprint completion moves open issues to backlog

*For any* active sprint, completing it should result in all issues with status `TODO` or `IN_PROGRESS` having their `sprintId` set to `undefined` (moved to backlog), while `DONE` issues remain associated with the sprint.

*issue's `status` to the column's corresponding status value.

**Validates: Requirements 4.3**

---

### Property 11: Board filtering correctness

*For any* combination of active filters (assignee, type, priority, epic, sprint) and any set of issues, the board should display only issues that satisfy ALL active filter criteria simultaneously, and a filter chip should be shown for each active filter.

**Validates: Requirements 4.5, 4.6**

---

### Property 12: Board grouping correctness

*For any* group-by selepayload while preserving the original `id` field unchanged.

**Validates: Requirements 12.7, 17.4**

---

### Property 9: Board column issue counts

*For any* set of issues in the store, the count displayed in each board column header must equal the number of issues whose `status` matches that column's status value.

**Validates: Requirements 4.2**

---

### Property 10: Board drag-and-drop status update

*For any* issue and any target column, moving the issue to that column (via `moveIssue`) should update the Requirements 12.5, 17.5**

---

### Property 7: Sprint deletion cascade

*For any* sprint in the store, calling `deleteSprint(id)` should remove the sprint from the sprints collection AND set `sprintId` to `undefined` on every issue that previously referenced that sprint ID.

**Validates: Requirements 6.8, 17.3**

---

### Property 8: Decision update preserves ID

*For any* decision in the store and any partial update payload, calling `updateDecision(id, payload)` should update the decision's fields from the  issue summary (non-empty string), calling `createIssue` should result in a new issue appearing in the store whose `key` matches the pattern `KAN-{n}` where `n` is a positive integer.

**Validates: Requirements 3.5, 17.2**

---

### Property 6: Decision ID generation round-trip

*For any* valid decision payload, calling `addDecision` should result in a new decision appearing in the store whose `id` matches the pattern `DEC-{nnn}` (zero-padded to 3 digits) and whose `createdBy` equals the current user.

**Validates: `'Bug'`, `'Story'`, or `'Epic'`.

**Validates: Requirements 3.1, 17.1**

---

### Property 3: Issue priority invariant

*For any* issue in the store, its `priority` field must be one of `'High'`, `'Medium'`, or `'Low'`.

**Validates: Requirements 3.3, 17.1**

---

### Property 4: Sprint status invariant

*For any* sprint in the store, its `status` field must be one of `'Draft'`, `'Active'`, or `'Completed'`.

**Validates: Requirements 17.7**

---

### Property 5: Issue key generation round-trip

*For any* valid — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Issue status invariant

*For any* issue in the store (before or after any mutation), its `status` field must be one of `'TODO'`, `'IN_PROGRESS'`, or `'DONE'`.

**Validates: Requirements 3.2, 17.6**

---

### Property 2: Issue type invariant

*For any* issue in the store, its `type` field must be one of `'Task'`, ue` |
| `/reports/:id` | `ReportDetailPage.vue` |
| `/projects` | `ProjectPage.vue` |
| `/project/spaces` | `SpacesPage.vue` |
| `/inbox` | `InboxPage.vue` |
| `/decisions` | `DecisionsPage.vue` |
| `/tasks` | `TaskLayout.vue` (nested: list, board, calendar, dashboard, files) |

Undefined routes are not explicitly redirected in the current router; this is a gap to address.

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a systemult layout (app shell):**
| Path | Component |
|---|---|
| `/dashboard` | `UserDashboard.vue` |
| `/dashboard/ceo` | `CEODashboard.vue` |
| `/dashboard/cto` | `CTODashboard.vue` |
| `/dashboard/project-manager` | `ProjectManagerDashboard.vue` |
| `/board` | `BoardPage.vue` |
| `/backlog` | `ScrumBacklogPage.vue` |
| `/sprint` | `SprintPage.vue` |
| `/overview` | `OverviewPage.vue` |
| `/list` | `TaskListPage.vue` |
| `/timeline` | `TimelinePage.vue` |
| `/roadmap` | `RoadmapPage.vue` |
| `/reports` | `Reports.vre`**: `drawer: boolean` — controls sidebar visibility. `toggleDrawer()` flips it.

**`boardToolbarStore`**: module-level refs for `activeFilters`, `sortBy`, `groupBy`, `searchQuery`, `showDone`, `showTags`, `showDates`, `showAssignees`. Used by board toolbar components.

---

## Routing

Two layout groups in `src/router/index.ts`:

**Blank layout (auth):**
| Path | Component |
|---|---|
| `/` | `LandingPage.vue` |
| `/auth/login` | `LoginPage.vue` |
| `/auth/forgot-password` | `ForgotPasswordPage.vue` |

**DefaN-{issues.length + 1}` |
| `moveIssue(id, status)` | Updates issue status in-place |
| `addSprint(data)` | Pushes new sprint; id = `s{sprints.length + 1}` |
| `updateSprint(id, data)` | Merges data, preserves id |
| `deleteSprint(id)` | Removes sprint; sets `sprintId = undefined` on all linked issues |
| `addDecision(data)` | Pushes new decision; id = `DEC-{zero-padded 3-digit count}` |
| `updateDecision(id, data)` | Merges data, preserves id |
| `deleteDecision(id)` | Removes decision |

### UI State

**`uiStoted'
  startDate: string
  endDate: string
  taskCount: number
  progress: number                     // 0–100
}

interface Decision {
  id: string                           // format: "DEC-{nnn}"
  title: string
  reason: string
  impact: 'High' | 'Medium' | 'Low'
  linkedWork: string
  optionsConsidered: string
  decisionMade: string
  status: 'Approved' | 'Pending'
  date: string
  createdBy: User
}
```

### Store actions

| Action | Behavior |
|---|---|
| `createIssue(data)` | Pushes new issue; key = `KAty: 'High' | 'Medium' | 'Low'
  assignees: User[]
  type: 'Task' | 'Bug' | 'Story' | 'Epic'
  epicLink?: string                    // ID of parent Epic
  sprintId?: string                    // ID of parent Sprint
}

interface Epic {
  id: string
  name: string
  summary: string
  color: string
  startDate?: string
  dueDate?: string
}

interface User {
  id: string
  name: string
  avatar: string                       // URL
}

interface Sprint {
  id: string
  name: string
  status: 'Draft' | 'Active' | 'Complee decision (title, reason, impact, linked work, options considered, decision made, status)

**`decisions/components/EditDecisionDialog.vue`** — edit existing decision

**`decisions/components/DecisionDetails.vue`** — full detail view of a decision

---

## Data Models

All types are defined in `src/stores/taskStore.ts`:

```typescript
interface Issue {
  id: string
  key: string                          // format: "KAN-{n}"
  summary: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priorie, duration, start/end dates, goal)

**`project/CompleteSprintDialog.vue`** — dialog to complete a sprint, showing completed/open counts and destination for open items

**`sprint/components/CreateSprintDialog.vue`** — create new sprint (name, start date, end date, status)

**`sprint/components/EditSprintDialog.vue`** — edit existing sprint, pre-populated

**`sprint/components/DeleteSprintDialog.vue`** — confirm sprint deletion

### Decision Components

**`decisions/components/CreateDecisionDialog.vue`** — create, due date
- "Save & add another" resets form without closing; "Create" closes drawer
- Calls `taskStore.createIssue()`

**`QuillEditor.vue`**
- Props: `content?: string`, `theme?: string`, `placeholder?: string`, `readOnly?: boolean`, `modules?: any`
- Emits: `update:content`
- Wraps Quill with Snow theme, toolbar (headers, bold/italic/underline, image, code-block), and optional `quill-mention` module

### Sprint Components

**`project/StartSprintDialog.vue`** — dialog to configure and start a sprint (namty/sprint/reporter, timestamps)
- Uses `QuillEditor` with `@mention` module for description editing
- Fullscreen toggle via `isFullscreen` ref

**`CreateIssueDrawer.vue`**
- Props: `modelValue: boolean`
- Emits: `update:modelValue`
- Renders: right-side drawer (560px) with issue type pills, title input, Quill description editor, and field rows for status, priority, assignee (dropdown), sprint, epic, story points, tags
- "More fields" toggle reveals: reporter, labels, components, fix versions, original estimat
### Issue Components

**`IssueCard.vue`**
- Props: `issue: Issue`
- Emits: `click(issue: Issue)`
- Renders: summary (2-line clamp), type icon (colored by type), issue key, assignee avatars (max 2)

**`IssueDetailsDialog.vue`**
- Props: `modelValue: boolean`, `issue: Issue | null`
- Emits: `update:modelValue`
- Renders: fullscreen-capable modal with main column (title, action bar, description editor, attachments, linked issues, subtasks, activity) and sidebar (status select, details card with assignees/priorirom route), search input (expands to 620px on focus), notification bell, help menu, settings menu, user avatar + profile menu
- Theme switching: reads/writes `localStorage['user-theme']`, calls `vuetify.theme.change()`
- Logout: clears localStorage, navigates to `/`

**`ProjectHeader.vue`**
- Props: `active-tab: string`
- Renders a sub-navigation bar for project views (Summary, Board, Backlog, Sprint, Timeline, List tabs)
- Used by: BoardPage, ScrumBacklogPage, SprintPage, TimelinePage, OverviewPage, TaskListPage
ces

### Application Shell

**`NavigationSidebar.vue`**
- Props: none (reads `uiStore.drawer` and `useRoute()`)
- Renders `v-navigation-drawer` with `location="bottom"` on mobile, persistent on desktop
- Nav items: Dashboard, Inbox (badge), My Tasks, Projects, Decisions, Reports, Roadmap
- Project shortcuts section with colored icons
- Emits: none (uses `uiStore` directly)

**`AppTopBar.vue`**
- Props: none (reads `taskStore.currentUser`, `uiStore`, `useRoute()`)
- Renders: hamburger toggle, page title (derived f **`blank.vue`** — wraps auth pages (`/`, `/auth/login`, `/auth/forgot-password`). No sidebar or topbar.
- **`default.vue`** — wraps all authenticated pages. Renders `NavigationSidebar` + `AppTopBar` + `<router-view>`.

### Data flow

```
User interaction
      │
      ▼
Page/Component (Vue SFC)
      │  calls action / reads reactive ref
      ▼
Pinia Store (taskStore / uiStore)
      │  mutates reactive state
      ▼
All components reading that state re-render automatically
```

---

## Components and Interfants, decisions     │
│  ├── uiStore     — sidebar drawer state                  │
│  └── boardToolbarStore — board filter/sort/group state   │
│                                                          │
│  Router (Vue Router 4)                                   │
│  └── Two layout groups: blank (auth) / default (app)     │
└─────────────────────────────────────────────────────────┘
```

### Layout system

Two layouts are used:

-                                                │
│  Shared Components                                       │
│  ├── AppTopBar, NavigationSidebar                        │
│  ├── IssueCard, IssueDetailsDialog, CreateIssueDrawer    │
│  ├── ProjectHeader, QuillEditor                          │
│  └── project/: CompleteSprintDialog, StartSprintDialog   │
│                                                          │
│  Stores (Pinia)                                          │
│  ├── taskStore   — issues, epics, sprier           │
│  ├── Project: BoardPage, ScrumBacklogPage, SprintPage    │
│  │            TimelinePage, RoadmapPage, OverviewPage    │
│  │            TaskListPage                               │
│  ├── Tasks: TaskPage (tabbed: List/Board/Calendar/Dash)  │
│  ├── Decisions: DecisionsPage                            │
│  ├── Inbox: InboxPage                                    │
│  ├── Reports: Reports, ReportDetailPage                  │
│  └── Projects: ProjectPage, SpacesPage                   │
│          -view>                               │
│                                                          │
│  Layouts                                                 │
│  ├── blank.vue   (auth pages — no shell)                 │
│  └── default.vue (app shell: sidebar + topbar)           │
│                                                          │
│  Pages (route components)                                │
│  ├── Auth: LoginPage, ForgotPasswordPage                 │
│  ├── Dashboard: CEO, CTO, ProjectManager, Usyered architecture:

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (SPA)                        │
├─────────────────────────────────────────────────────────┤
│  App.vue  →  <routern the current implementation. All state is held in Pinia stores seeded with in-memory mock data. The design is structured to make a future API integration straightforward by keeping data access centralized in stores.

**Tech stack:**
- Vue 3 (Composition API, `<script setup>`)
- Vuetify 4 (component library + theming)
- Pinia (state management)
- Vue Router 4 (client-side routing)
- Quill + quill-mention (rich-text editing)
- TypeScript
- Vite (build tooling)

---

## Architecture

The application follows a la3 single-page application (SPA) for software project management. It provides agile workflow tooling — Kanban boards, scrum backlogs, sprint management, timelines, roadmaps, decision logs, role-based dashboards, and reporting — all within a consistent shell built on Vuetify 4.

The application is a pure frontend SPA with no backend integration iw

Execora is a Vue # Design Document: Execora Frontend

## Overvie