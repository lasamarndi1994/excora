# Requirements Document

## Introduction

Execora is a Vue 3 + Vuetify project management web application designed for software development teams. It provides a comprehensive suite of tools for managing issues, sprints, epics, decisions, and team collaboration across multiple projects. The application supports role-based dashboards (CEO, CTO, Project Manager, User), agile workflows (Scrum/Kanban), reporting, and a notification inbox. The frontend is a single-page application built with Vue 3 Composition API, Pinia state management, Vue Router, and Vuetify 4.

---

## Glossary

- **Application**: The Execora frontend SPA.
- **Issue**: A unit of work with a type (Task, Bug, Story, Epic), status, priority, assignees, and optional sprint/epic links.
- **Sprint**: A time-boxed iteration containing a set of Issues, with statuses Draft, Active, or Completed.
- **Epic**: A large body of work that groups related Issues and spans a date range on the Roadmap.
- **Board**: A Kanban-style view of Issues organized into columns representing workflow statuses.
- **Backlog**: The collection of Issues not yet assigned to a Sprint.
- **Decision**: A recorded architectural or business decision with rationale, options considered, impact, and status.
- **Notification**: An in-app activity event (mention, assignment, comment, overdue alert) surfaced in the Inbox.
- **Dashboard**: A role-specific analytics view (CEO, CTO, Project Manager, or User).
- **Report**: A data visualization page for sprint metrics (Burndown, Burnup, Velocity, CFD, Cycle Time, Deployment).
- **Space**: A project container that groups Boards, Backlogs, Sprints, and Epics.
- **User**: An authenticated member of the workspace with a name, avatar, and role.
- **Current_User**: The authenticated user currently logged in to the Application.
- **Store**: The Pinia reactive state layer (taskStore, uiStore, boardToolbarStore).
- **Router**: The Vue Router instance managing client-side navigation.

---

## Requirements

### Requirement 1: User Authentication

**User Story:** As a team member, I want to sign in to Execora, so that I can access my workspace and project data securely.

#### Acceptance Criteria

1. THE Application SHALL display a login page at the `/` route with email and password fields.
2. WHEN a user submits the login form with a valid email format and a non-empty password, THE Application SHALL navigate to the `/dashboard` route.
3. IF the email field is empty or contains an invalid format on form submission, THEN THE Application SHALL display an inline validation error message below the email field.
4. IF the password field is empty on form submission, THEN THE Application SHALL display an inline validation error message below the password field.
5. WHILE the login request is processing, THE Application SHALL display a loading spinner inside the submit button and disable the button.
6. THE Application SHALL provide a "Forgot password?" link that navigates to the `/auth/forgot-password` route.
7. THE Application SHALL offer Google and GitHub social sign-in buttons on the login page.
8. WHERE the user selects "Remember me", THE Application SHALL persist the session for 30 days.

---

### Requirement 2: Application Shell and Navigation

**User Story:** As a team member, I want a consistent navigation shell, so that I can move between sections of the application efficiently.

#### Acceptance Criteria

1. THE Application SHALL render a collapsible left navigation sidebar containing links to Dashboard, Inbox, My Tasks, Projects, Decisions, Reports, and Roadmap.
2. THE Application SHALL render a top application bar displaying the current page title, a global search input, notification bell, help menu, settings menu, and the Current_User's avatar and name.
3. WHEN the Current_User clicks the hamburger menu icon in the top bar, THE Application SHALL toggle the sidebar open or closed.
4. WHEN the Current_User navigates to a route, THE Application SHALL highlight the corresponding sidebar navigation item as active.
5. THE Application SHALL display an unread notification count badge on the Inbox sidebar item and the notification bell icon.
6. WHEN the Current_User focuses the global search input, THE Application SHALL expand the search field width to 620px.
7. THE Application SHALL display a user profile menu when the Current_User clicks their avatar, containing Profile, Account settings, Theme selector, and Log out options.
8. WHEN the Current_User selects a theme (Light, Dark, System), THE Application SHALL apply the selected Vuetify theme and persist the preference to localStorage.
9. WHEN the Current_User clicks Log out, THE Application SHALL clear the stored theme preference and navigate to the `/` route.

---

### Requirement 3: Issue Management

**User Story:** As a developer, I want to create, view, and update issues, so that I can track work items throughout their lifecycle.

#### Acceptance Criteria

1. THE Application SHALL support four Issue types: Task, Bug, Story, and Epic.
2. THE Application SHALL support three Issue statuses: TODO, IN_PROGRESS, and DONE.
3. THE Application SHALL support three Issue priority levels: High, Medium, and Low.
4. WHEN the Current_User opens the Create Issue drawer, THE Application SHALL display fields for type, summary, description (rich text), status, priority, assignee, sprint, epic link, story points, tags, labels, components, fix versions, original estimate, and due date.
5. WHEN the Current_User submits the Create Issue form with a non-empty summary, THE Store SHALL add the new Issue to the issues collection with a generated key in the format `KAN-{n}`.
6. IF the Current_User submits the Create Issue form with an empty summary, THEN THE Application SHALL not create the Issue and SHALL keep the drawer open.
7. WHEN the Current_User clicks "Save & add another" after filling in the Create Issue form, THE Application SHALL create the Issue and reset the form without closing the drawer.
8. WHEN the Current_User opens the Issue Details dialog for an existing Issue, THE Application SHALL display the issue summary, description, attachments, linked issues, subtasks, activity feed, and a sidebar with status, assignees, priority, story points, reporter, sprint, and time tracking fields.
9. WHEN the Current_User edits the description in the Issue Details dialog and clicks Save, THE Store SHALL update the Issue's description field.
10. THE Application SHALL support @mention autocomplete in the description rich-text editor, sourcing suggestions from the Store's users list.
11. THE Issue Details dialog SHALL support fullscreen mode toggled by a dedicated button.

---

### Requirement 4: Kanban Board

**User Story:** As a developer, I want a Kanban board view of sprint issues, so that I can visualize and manage work in progress.

#### Acceptance Criteria

1. THE Board SHALL display the active Sprint name, date range, total issue count, and done issue count in a sprint banner.
2. THE Board SHALL organize Issues into columns representing workflow statuses, with each column showing its issue count.
3. WHEN the Current_User drags an Issue card from one column and drops it onto another column, THE Store SHALL update the Issue's status to match the target column.
4. THE Board SHALL support inline issue creation within a column by clicking the "Create issue" button, entering a summary, selecting type and priority, and pressing Enter or clicking Create.
5. THE Board SHALL support filtering Issues by assignee, work type, priority, epic, and sprint via a filter panel accessible from the Filter button.
6. WHEN the Current_User applies one or more filters, THE Board SHALL display only Issues matching all active filter criteria and SHALL show filter chips for each active filter.
7. THE Board SHALL support grouping Issues into swimlanes by Assignee, Priority, or Epic via a Group by dropdown.
8. THE Board SHALL support sorting Issues within columns by Default, Priority, Created, Updated, or Assignee via a Sort dropdown.
9. THE Board SHALL support board settings to toggle display of epic labels, priority badges, and subtask progress on issue cards.
10. THE Board SHALL allow the Current_User to add new columns and rename or delete non-default columns.
11. WHEN the Current_User clicks "Complete Sprint", THE Application SHALL display a confirmation dialog showing the count of open and completed issues, and upon confirmation SHALL move open issues to the backlog.

---

### Requirement 5: Scrum Backlog

**User Story:** As a scrum master, I want to manage the product backlog and sprint planning, so that I can organize work into sprints.

#### Acceptance Criteria

1. THE Backlog page SHALL display a Sprint section and a Backlog section, each collapsible.
2. THE Sprint section SHALL show the sprint name, date range, issue count, and status pills for TODO, IN_PROGRESS, and DONE counts.
3. WHEN the Sprint section contains at least one Issue and the sprint is not active, THE Application SHALL enable the "Start sprint" button.
4. WHEN the Current_User clicks "Start sprint", THE Application SHALL display a dialog to configure sprint name, duration, start date, end date, and sprint goal before activating the sprint.
5. WHEN the Current_User clicks "Complete sprint", THE Application SHALL display a dialog showing completed and open issue counts and allow selection of where to move open items.
6. THE Backlog section SHALL display all Issues without a sprint assignment.
7. WHEN the Current_User clicks "Create" in either section, THE Application SHALL show an inline input to enter an issue summary and create a new Issue on Enter.
8. THE Application SHALL support searching the backlog by issue summary via a search input in the toolbar.

---

### Requirement 6: Sprint Management

**User Story:** As a project manager, I want to create, edit, and delete sprints, so that I can plan and track iteration cycles.

#### Acceptance Criteria

1. THE Sprint page SHALL display a table of all Sprints with columns for name, status, start date, end date, task count, progress, and actions.
2. THE Sprint page SHALL support filtering sprints by status (All, Draft, Active, Completed) via filter tabs.
3. THE Sprint page SHALL support searching sprints by name via a search input.
4. WHEN the Current_User clicks "New Sprint", THE Application SHALL open a Create Sprint dialog with fields for name, start date, end date, and status.
5. WHEN the Current_User submits the Create Sprint form, THE Store SHALL add the new Sprint to the sprints collection with a generated ID.
6. WHEN the Current_User clicks the edit icon for a Sprint, THE Application SHALL open an Edit Sprint dialog pre-populated with the sprint's current data.
7. WHEN the Current_User submits the Edit Sprint form, THE Store SHALL update the Sprint's fields.
8. WHEN the Current_User clicks the delete icon for a Sprint and confirms deletion, THE Store SHALL remove the Sprint and SHALL set the sprintId of all associated Issues to undefined.
9. WHEN the Current_User clicks on a Sprint row, THE Application SHALL navigate to a Sprint detail view showing KPI cards (total tasks, completed, remaining hours), a burndown chart, and a sprint board.

---

### Requirement 7: Timeline (Gantt) View

**User Story:** As a project manager, I want a Gantt-style timeline view of epics and issues, so that I can visualize project schedules.

#### Acceptance Criteria

1. THE Timeline page SHALL display a sidebar listing Epics and their child Issues, and a Gantt chart area with week-column headers.
2. THE Timeline SHALL render a horizontal bar for each Epic positioned according to its start and end dates relative to the displayed date range.
3. THE Timeline SHALL render a horizontal bar for each Issue positioned according to its start and end dates, nested under its parent Epic.
4. WHEN the Current_User clicks the expand/collapse icon on an Epic row in the sidebar, THE Timeline SHALL show or hide the Epic's child Issue rows.
5. THE Timeline SHALL display a vertical "Today" indicator line at the current date's position.
6. THE Timeline SHALL auto-scroll horizontally to center the "Today" indicator on mount.
7. THE Application SHALL support switching the timeline scale between Weeks, Months, and Quarters.

---

### Requirement 8: Roadmap View

**User Story:** As a product manager, I want a roadmap view of epics across time, so that I can communicate strategic plans.

#### Acceptance Criteria

1. THE Roadmap page SHALL display a timeline grid with month columns and one row per Epic.
2. THE Roadmap SHALL render a colored bar for each Epic spanning its start and end months, labeled with the Epic's summary.
3. WHEN the Current_User hovers over an Epic bar, THE Roadmap SHALL display a tooltip showing the Epic's name, start date, end date, and progress percentage.
4. THE Roadmap SHALL display milestone markers on Epic bars at configured milestone positions.
5. THE Roadmap SHALL display a "Today" vertical line at the current date's position.
6. THE Roadmap SHALL display summary cards below the timeline showing total epics, in-progress count, on-track count, at-risk count, and average progress.
7. THE Application SHALL support switching the roadmap view between Weeks, Months, and Quarters.
8. THE Application SHALL support scrolling the roadmap timeline left and right via navigation buttons.

---

### Requirement 9: Issue List View

**User Story:** As a developer, I want a tabular list of all issues, so that I can quickly scan and sort work items.

#### Acceptance Criteria

1. THE Issue List page SHALL display all Issues in a data table with columns for type icon, key, summary, assignee(s), status chip, priority indicator, and due date.
2. THE Issue List SHALL render the type column with a colored icon distinguishing Bug (red), Story (green), and Task/other (blue).
3. THE Issue List SHALL render the status column as a colored chip (secondary for TODO, info for IN_PROGRESS, success for DONE).
4. THE Issue List SHALL render the priority column with a directional icon (double-up for High, up for Medium, down for Low) alongside the priority label.
5. THE Issue List SHALL render the assignee column with stacked avatar images and a comma-separated name list.

---

### Requirement 10: Project Overview

**User Story:** As a team member, I want a project overview page, so that I can see a high-level summary of project health and activity.

#### Acceptance Criteria

1. THE Overview page SHALL display stat cards showing issues completed, updated, created, and due soon within the last/next 7 days.
2. THE Overview page SHALL display a status overview donut chart showing the distribution of issues across all statuses.
3. THE Overview page SHALL display a recent activity feed showing the latest issue comments and status changes.
4. THE Overview page SHALL display a priority breakdown bar chart showing issue counts by priority level.
5. THE Overview page SHALL display a types-of-work breakdown showing percentage distribution across Task, Bug, Epic, Subtask, and Story.
6. THE Overview page SHALL display a team workload section showing each team member's assigned issue percentage.
7. THE Overview page SHALL display an epic progress section showing done, in-progress, and to-do percentages for each Epic.

---

### Requirement 11: My Tasks

**User Story:** As a team member, I want a personal task workspace, so that I can manage my own work items independently of project boards.

#### Acceptance Criteria

1. THE My Tasks page SHALL display tasks in List, Board, Calendar, Dashboard, and Files tabs.
2. THE List tab SHALL display tasks in a table with columns for name, due date, assignees, project, and priority, grouped by section.
3. THE Board tab SHALL display tasks in Kanban columns (Recently assigned, Do today, Do next week, Do later) with cards showing name, tag, date, likes, and comment counts.
4. WHEN the Current_User clicks the completion checkbox on a task, THE Application SHALL toggle the task's done state and apply a strikethrough style to the task name.
5. WHEN the Current_User clicks "Add task" in a board column, THE Application SHALL add a new task card to that column.
6. WHEN the Current_User clicks "Add section" on the Board tab, THE Application SHALL add a new empty column.
7. THE Dashboard tab SHALL display stat cards for completed, incomplete, overdue, and total task counts, a tasks-by-section bar chart, a completion status donut chart, and a completion-over-time line chart.
8. WHEN the Current_User clicks a task, THE Application SHALL open a task detail drawer showing the task name, tag, due date, assignee, and description.

---

### Requirement 12: Decision Log

**User Story:** As a team lead, I want to record and track architectural and business decisions, so that the team has a searchable audit trail of key choices.

#### Acceptance Criteria

1. THE Decisions page SHALL display all Decisions in a table with columns for ID, title, linked work, date, impact, status, created by, and actions.
2. THE Decisions page SHALL support filtering decisions by status (All, Approved, Pending) via toggle buttons.
3. THE Decisions page SHALL support searching decisions by title or ID via a search input.
4. WHEN the Current_User clicks "New Decision", THE Application SHALL open a Create Decision dialog with fields for title, reason, impact, linked work, options considered, decision made, and status.
5. WHEN the Current_User submits the Create Decision form, THE Store SHALL add the new Decision with a generated ID in the format `DEC-{nnn}` and set createdBy to the Current_User.
6. WHEN the Current_User clicks the edit icon for a Decision, THE Application SHALL open an Edit Decision dialog pre-populated with the decision's current data.
7. WHEN the Current_User submits the Edit Decision form, THE Store SHALL update the Decision's fields.
8. WHEN the Current_User clicks on a Decision row, THE Application SHALL navigate to a Decision detail view showing all fields including rationale and options considered.

---

### Requirement 13: Inbox and Notifications

**User Story:** As a team member, I want an inbox for activity notifications, so that I can stay informed about mentions, assignments, and overdue items.

#### Acceptance Criteria

1. THE Inbox page SHALL display notifications grouped by time period (Today, Yesterday, Past 7 Days) in an Activity tab.
2. THE Inbox SHALL display a Bookmarks tab showing notifications the Current_User has saved for later.
3. THE Inbox SHALL display an Archive tab showing notifications older than 30 days.
4. THE Inbox SHALL support filtering notifications by type (All, Mentions, Assigned, Overdue, Comments) via filter chips in the sidebar.
5. THE Inbox SHALL support searching notifications by title or preview text via a search input.
6. THE Inbox SHALL support sorting notifications by newest or oldest first.
7. WHEN a notification is unread, THE Application SHALL display a blue left border on the notification card and a blue dot on the sender's avatar.
8. THE Inbox sidebar SHALL display summary statistics for unread count, overdue count, and bookmarked count.
9. WHEN the Current_User clicks the bookmark action on a notification, THE Application SHALL move the notification to the Bookmarks tab.
10. WHEN the Current_User clicks the archive action on a notification, THE Application SHALL move the notification to the Archive tab.

---

### Requirement 14: Reports

**User Story:** As a project manager, I want sprint and delivery reports, so that I can measure team performance and communicate progress.

#### Acceptance Criteria

1. THE Reports section SHALL provide the following report types: Burndown, Burnup, Velocity, Cumulative Flow Diagram (CFD), Cycle Time, and Deployment Frequency.
2. THE Burndown Report SHALL display an SVG line chart with ideal and actual remaining story points plotted over sprint days, and a team performance table.
3. THE Velocity Report SHALL display a grouped bar chart comparing committed versus completed story points per sprint, an average velocity line, and a sprint breakdown table.
4. WHEN the Current_User selects a sprint from the sprint selector on the Burndown Report, THE Report SHALL update the chart data to reflect the selected sprint's issues.
5. THE Velocity Report SHALL compute and display the average velocity across all sprints from the Store's sprints collection.
6. THE Reports page SHALL display report type navigation allowing the Current_User to switch between report types without a full page reload.

---

### Requirement 15: Role-Based Dashboards

**User Story:** As an executive or team member, I want a role-specific dashboard, so that I can see the metrics most relevant to my responsibilities.

#### Acceptance Criteria

1. THE Application SHALL provide four dashboard variants: CEO Dashboard, CTO Dashboard, Project Manager Dashboard, and User Dashboard, accessible via the `/dashboard` route.
2. THE CEO Dashboard SHALL display a live metrics ticker, KPI cards (Total Revenue, Active Users, Gross Margin, Churn Rate, NPS Score, Open Pipeline), a revenue bar chart, an org health ring chart, AI strategic insights, global expansion table, sales pipeline funnel, team sentiment breakdown, and recent decisions.
3. THE CTO Dashboard SHALL display KPI cards (System Uptime, API Latency, Error Rate, Deployments), a system health grid, a team velocity ring chart with per-team sparklines, and a tabbed detailed metrics panel covering Infrastructure Cost, Security Vulnerabilities, and Tech Debt.
4. THE Project Manager Dashboard SHALL display KPI cards (Active Projects, On Track, At Risk, Delayed), an active projects grid with progress bars, a project roadmap Gantt chart, a critical risks panel, and a resource allocation table.
5. THE User Dashboard SHALL display a personalized greeting using the Current_User's name, quick stat cards (Active tasks, Pending Review, Completed This Week), a My Priorities task list with due date highlighting, and a Recent Activity feed.
6. WHEN the Current_User checks a task checkbox on the User Dashboard, THE Application SHALL toggle the task's completed state and apply a strikethrough style to the task name.

---

### Requirement 16: Project and Spaces Management

**User Story:** As a project manager, I want to view and navigate between project spaces, so that I can manage multiple projects from a central location.

#### Acceptance Criteria

1. THE Projects page SHALL display a grid of Space cards showing the space name, type, icon, lead, open work item count, done work item count, and a star/favorite toggle.
2. WHEN the Current_User clicks a Space card, THE Application SHALL navigate to the Board view for that space.
3. WHEN the Current_User clicks the star icon on a Space card, THE Application SHALL toggle the space's starred state.
4. THE Projects page SHALL display an activity section with tabs for Worked on, Viewed, Assigned to me, Starred, and Boards.
5. THE Projects page SHALL display a "New Project" button that navigates to the Spaces creation page.

---

### Requirement 17: State Management and Data Integrity

**User Story:** As a developer, I want a reliable reactive state layer, so that all views reflect consistent and up-to-date data.

#### Acceptance Criteria

1. THE Store SHALL maintain a single source of truth for issues, epics, sprints, users, decisions, and the currentUser.
2. WHEN the Store's createIssue action is called, THE Store SHALL assign a unique key in the format `KAN-{n}` where n is one greater than the current issues count.
3. WHEN the Store's deleteSprint action is called with a sprint ID, THE Store SHALL remove the Sprint and SHALL set the sprintId field of all Issues referencing that sprint to undefined.
4. WHEN the Store's updateDecision action is called, THE Store SHALL preserve the Decision's original id field and merge all other provided fields.
5. WHEN the Store's addDecision action is called, THE Store SHALL generate an ID in the format `DEC-{nnn}` with zero-padded three-digit numbering based on the current decisions count.
6. FOR ALL Issues in the Store, THE Store SHALL maintain the invariant that each Issue's status is one of TODO, IN_PROGRESS, or DONE.
7. FOR ALL Sprints in the Store, THE Store SHALL maintain the invariant that each Sprint's status is one of Draft, Active, or Completed.

---

### Requirement 18: Routing and Navigation Guards

**User Story:** As a developer, I want well-defined client-side routing, so that users are directed to the correct pages and protected routes are enforced.

#### Acceptance Criteria

1. THE Router SHALL define routes for: `/` (Landing/Login), `/auth/forgot-password`, `/dashboard`, `/board`, `/backlog`, `/list`, `/roadmap`, `/timeline`, `/inbox`, `/decisions`, `/reports`, `/tasks`, `/projects`, `/project/spaces`, `/sprint`.
2. WHEN the Current_User navigates to an undefined route, THE Router SHALL redirect to the `/` route.
3. THE Application SHALL use the `<router-view>` component as the root rendering outlet in App.vue.

---

### Requirement 19: Responsive Layout and UI Consistency

**User Story:** As a team member, I want the application to be usable on different screen sizes, so that I can work from various devices.

#### Acceptance Criteria

1. THE Navigation sidebar SHALL render as a temporary bottom drawer on mobile viewports (below 768px breakpoint) and as a persistent side drawer on desktop viewports.
2. THE Login page left panel SHALL be hidden on viewports narrower than 768px and SHALL display on wider viewports.
3. THE Application SHALL use the Inter font family consistently across all pages and components.
4. THE Application SHALL use a consistent indigo/violet primary color palette (`#4f46e5`) for interactive elements, active states, and primary actions.
