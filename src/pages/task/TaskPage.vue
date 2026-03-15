<template>
  <div class="task-root">

    <!-- ── Header ── -->
    <div class="task-header">
      <div class="header-left">
        <div class="task-avatar">LM</div>
        <div>
          <h1 class="task-title">
            My Tasks
            <v-icon size="16" style="color:#94a3b8;margin-left:4px">mdi-chevron-down</v-icon>
          </h1>
          <p class="task-sub">Personal workspace · 11 tasks</p>
        </div>
      </div>
      <div class="header-right">
        <button class="hdr-btn">
          <v-icon size="14">mdi-lock-outline</v-icon> Share
        </button>
        <button class="hdr-btn hdr-btn--primary" @click="showAddTask = true">
          <v-icon size="14">mdi-plus</v-icon> Add Task
        </button>
      </div>
    </div>

    <!-- ── Tabs ── -->
    <div class="task-tabs-bar">
      <div class="task-tabs">
        <button v-for="tab in tabs" :key="tab.value"
          class="task-tab"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value">
          <v-icon size="14">{{ tab.icon }}</v-icon>
          {{ tab.label }}
        </button>
      </div>
      <div class="toolbar-actions">
        <button class="tool-btn"><v-icon size="13">mdi-filter-variant</v-icon> Filter</button>
        <button class="tool-btn"><v-icon size="13">mdi-swap-vertical</v-icon> Sort</button>
        <button class="tool-btn"><v-icon size="13">mdi-group</v-icon> Group</button>
        <div class="tool-sep"></div>
        <button class="tool-icon-btn"><v-icon size="15">mdi-magnify</v-icon></button>
        <button class="tool-icon-btn"><v-icon size="15">mdi-tune-vertical</v-icon></button>
      </div>
    </div>

    <!-- ── Tab Content ── -->
    <div class="task-body">

      <!-- LIST VIEW -->
      <div v-if="activeTab === 'list'" class="list-view">
        <div class="list-table-wrap">
          <table class="list-table">
            <thead>
              <tr>
                <th style="width:44%">Name</th>
                <th style="width:14%">Due date</th>
                <th style="width:20%">Assignees</th>
                <th style="width:14%">Project</th>
                <th style="width:8%">Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr class="group-row">
                <td colspan="5">
                  <div class="group-label">
                    <v-icon size="15">mdi-menu-down</v-icon>
                    Recently assigned
                    <span class="group-count">{{ listTasks.length }}</span>
                  </div>
                </td>
              </tr>
              <tr v-for="(task, i) in listTasks" :key="task.id"
                class="list-row"
                :style="{ animationDelay: i * 40 + 'ms' }"
                @click="openTask(task)">
                <td class="name-cell">
                  <button class="check-btn" :class="{ done: task.done }" @click.stop="task.done = !task.done">
                    <v-icon size="14">{{ task.done ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                  </button>
                  <span class="task-name" :class="{ 'task-done': task.done }">{{ task.name }}</span>
                  <span v-if="task.comments" class="comment-badge">
                    <v-icon size="11">mdi-message-outline</v-icon> {{ task.comments }}
                  </span>
                </td>
                <td class="due-cell" :class="{ overdue: task.overdue }">
                  <v-icon v-if="task.due" size="12" style="margin-right:3px">mdi-calendar-outline</v-icon>
                  {{ task.due || '—' }}
                </td>
                <td class="assignee-cell">
                  <div class="avatar-stack">
                    <div v-for="(a, ai) in task.assignees" :key="ai"
                      class="mini-avatar"
                      :style="{ background: a.color, zIndex: task.assignees.length - ai }">
                      <img v-if="a.img" :src="a.img" :alt="a.initials" />
                      <span v-else>{{ a.initials }}</span>
                    </div>
                  </div>
                </td>
                <td class="proj-cell">
                  <span v-if="task.project" class="proj-chip">{{ task.project }}</span>
                </td>
                <td>
                  <span v-if="task.priority" class="prio-pill" :class="`prio-${task.priority.toLowerCase()}`">
                    {{ task.priority }}
                  </span>
                </td>
              </tr>
              <!-- Add task row -->
              <tr class="add-row" @click="addListTask">
                <td colspan="5">
                  <span class="add-row-inner">
                    <v-icon size="14">mdi-plus</v-icon> Add task
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- BOARD VIEW -->
      <div v-else-if="activeTab === 'board'" class="board-view">
        <div v-for="col in boardColumns" :key="col.id" class="board-col">
          <div class="col-header">
            <div class="col-header-left">
              <span class="col-dot" :style="{ background: col.color }"></span>
              <span class="col-title">{{ col.title }}</span>
              <span class="col-count">{{ col.tasks.length }}</span>
            </div>
            <button class="col-menu-btn"><v-icon size="15">mdi-dots-horizontal</v-icon></button>
          </div>
          <div class="col-cards">
            <div v-for="(task, i) in col.tasks" :key="task.id"
              class="board-card"
              :style="{ animationDelay: i * 50 + 'ms' }"
              @click="openTask(task)">
              <div class="bc-top">
                <button class="check-btn" :class="{ done: task.done }" @click.stop="task.done = !task.done">
                  <v-icon size="14">{{ task.done ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                </button>
                <span class="bc-name" :class="{ 'task-done': task.done }">{{ task.name }}</span>
              </div>
              <div v-if="task.tag" class="bc-tag" :style="{ background: tagBg(task.tagColor), color: tagColor(task.tagColor) }">
                {{ task.tag }}
              </div>
              <div class="bc-footer">
                <span class="bc-date">{{ task.date }}</span>
                <div class="bc-meta">
                  <span v-if="task.likes" class="bc-meta-item">
                    <v-icon size="11">mdi-thumb-up-outline</v-icon> {{ task.likes }}
                  </span>
                  <span v-if="task.comments" class="bc-meta-item">
                    <v-icon size="11">mdi-message-outline</v-icon> {{ task.comments }}
                  </span>
                </div>
              </div>
            </div>
            <button class="col-add-btn" @click="addTaskToColumn(col.id)">
              <v-icon size="14">mdi-plus</v-icon> Add task
            </button>
          </div>
        </div>
        <button class="add-section-btn" @click="addSection">
          <v-icon size="14">mdi-plus</v-icon> Add section
        </button>
      </div>

      <!-- DASHBOARD VIEW -->
      <div v-else-if="activeTab === 'dashboard'" class="dash-view">
        <div class="dash-stat-row">
          <div v-for="stat in statCards" :key="stat.label" class="dash-stat-card">
            <div class="dsc-icon" :style="{ background: stat.iconBg }">
              <v-icon size="18" :color="stat.iconColor">{{ stat.icon }}</v-icon>
            </div>
            <div class="dsc-val">{{ stat.value }}</div>
            <div class="dsc-label">{{ stat.label }}</div>
            <div class="dsc-bar">
              <div class="dsc-bar-fill" :style="{ width: stat.pct + '%', background: stat.iconColor }"></div>
            </div>
          </div>
        </div>

        <div class="dash-charts-row">
          <!-- Bar chart: tasks by section -->
          <div class="dash-chart-card">
            <div class="dcc-title">Tasks by section</div>
            <div class="bar-chart">
              <div v-for="bar in sectionBars" :key="bar.label" class="bar-item">
                <span class="bar-val">{{ bar.count }}</span>
                <div class="bar-col-wrap">
                  <div class="bar-fill" :style="{ height: (bar.count / maxSectionCount * 100) + '%', background: '#818cf8' }"></div>
                </div>
                <span class="bar-lbl">{{ bar.label }}</span>
              </div>
            </div>
          </div>

          <!-- Donut: completion status -->
          <div class="dash-chart-card">
            <div class="dcc-title">Completion status</div>
            <div class="donut-row">
              <svg viewBox="0 0 36 36" width="110" height="110">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" stroke-width="5"/>
                <circle cx="18" cy="18" r="14" fill="none" stroke="#818cf8" stroke-width="5"
                  stroke-dasharray="64 36" stroke-dashoffset="25" stroke-linecap="round"/>
              </svg>
              <div class="donut-legend">
                <div v-for="seg in completionSegments" :key="seg.label" class="donut-leg-row">
                  <span class="donut-dot" :style="{ background: seg.color }"></span>
                  <span class="donut-lbl">{{ seg.label }}</span>
                  <span class="donut-val">{{ seg.value }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Line chart: completion over time -->
          <div class="dash-chart-card">
            <div class="dcc-title">Completion over time</div>
            <svg class="line-chart-svg" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#818cf8" stop-opacity=".3"/>
                  <stop offset="100%" stop-color="#818cf8" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path :d="completionAreaPath" fill="url(#lineGrad)"/>
              <path :d="completionLinePath" fill="none" stroke="#818cf8" stroke-width="2.5"
                stroke-linecap="round" stroke-linejoin="round"/>
              <circle v-for="(pt, i) in completionPoints" :key="i"
                :cx="pt.x" :cy="pt.y" r="3.5" fill="#818cf8" stroke="white" stroke-width="1.5"/>
            </svg>
            <div class="line-labels">
              <span v-for="pt in completionPoints" :key="pt.label">{{ pt.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CALENDAR placeholder -->
      <div v-else-if="activeTab === 'calendar'" class="placeholder-view">
        <div class="placeholder-icon">📅</div>
        <div class="placeholder-title">Calendar view</div>
        <div class="placeholder-sub">Coming soon</div>
      </div>

      <!-- FILES placeholder -->
      <div v-else class="placeholder-view">
        <div class="placeholder-icon">📎</div>
        <div class="placeholder-title">Files view</div>
        <div class="placeholder-sub">Coming soon</div>
      </div>

    </div>

    <!-- ── Task Detail Drawer ── -->
    <div v-if="selectedTask" class="task-drawer-overlay" @click.self="selectedTask = null">
      <div class="task-drawer">
        <div class="drawer-header">
          <button class="check-btn lg" :class="{ done: selectedTask.done }"
            @click="selectedTask.done = !selectedTask.done">
            <v-icon size="18">{{ selectedTask.done ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
          </button>
          <span class="drawer-title">{{ selectedTask.name }}</span>
          <button class="drawer-close" @click="selectedTask = null">
            <v-icon size="16">mdi-close</v-icon>
          </button>
        </div>
        <div class="drawer-body">
          <div v-if="(selectedTask as any).tag" class="drawer-tag"
            :style="{ background: tagBg((selectedTask as any).tagColor), color: tagColor((selectedTask as any).tagColor) }">
            {{ (selectedTask as any).tag }}
          </div>
          <div class="drawer-meta-row">
            <v-icon size="13" style="color:#94a3b8">mdi-calendar-outline</v-icon>
            <span>{{ (selectedTask as any).date || (selectedTask as any).due || 'No due date' }}</span>
          </div>
          <div class="drawer-meta-row">
            <v-icon size="13" style="color:#94a3b8">mdi-account-outline</v-icon>
            <span>Unassigned</span>
          </div>
          <div class="drawer-desc">No description yet.</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const activeTab   = ref('board')
const showAddTask = ref(false)

const tabs = [
  { value: 'list',      label: 'List',      icon: 'mdi-format-list-bulleted' },
  { value: 'board',     label: 'Board',     icon: 'mdi-view-column-outline' },
  { value: 'calendar',  label: 'Calendar',  icon: 'mdi-calendar-blank-outline' },
  { value: 'dashboard', label: 'Dashboard', icon: 'mdi-view-dashboard-outline' },
  { value: 'files',     label: 'Files',     icon: 'mdi-paperclip' },
]

// ── List tasks ────────────────────────────────────────────────────────────────
interface ListTask {
  id: number; name: string; done: boolean; due?: string; overdue?: boolean
  comments?: number; project?: string; priority?: string
  assignees: { img?: string; initials?: string; color: string }[]
}

const listTasks = reactive<ListTask[]>([
  {
    id: 1, name: 'Partner library task updates', done: false, due: '29 Jan',
    comments: 2, project: 'Execora', priority: 'High',
    assignees: [
      { img: 'https://i.pravatar.cc/150?img=11', color: '#e0e7ff' },
      { initials: 'PR', color: '#fce7f3' },
    ],
  },
  {
    id: 2, name: 'Mutual Fund - Backoffice', done: false, due: '',
    project: 'Finance', priority: 'Medium',
    assignees: [
      { initials: 'AP', color: '#fed7aa' },
      { initials: 'SM', color: '#fef3c7' },
      { initials: 'RR', color: '#fde68a' },
    ],
  },
  {
    id: 3, name: 'Performance Dashboard Requirement and Implementation', done: false,
    due: 'Friday', overdue: true, comments: 16, project: 'Analytics', priority: 'High',
    assignees: [
      { initials: 'Ma', color: '#fce7f3' },
      { initials: 'Ha', color: '#cffafe' },
      { initials: 'RR', color: '#ede9fe' },
    ],
  },
  {
    id: 4, name: 'Sprint 24 retrospective action items', done: true, due: 'Mar 10',
    project: 'Execora', priority: 'Low',
    assignees: [{ initials: 'DB', color: '#d1fae5' }],
  },
])

function addListTask() {
  listTasks.push({
    id: Date.now(), name: 'New task', done: false,
    assignees: [],
  })
}

// ── Board columns ─────────────────────────────────────────────────────────────
interface BoardTask {
  id: number; name: string; done: boolean
  tag?: string; tagColor?: string; date?: string; likes?: number; comments?: number
}
interface BoardColumn {
  id: string; title: string; color: string; tasks: BoardTask[]
}

const boardColumns = reactive<BoardColumn[]>([
  {
    id: 'recent', title: 'Recently assigned', color: '#818cf8',
    tasks: [
      { id: 1, name: 'Get EKYC Additional segment KT from Ganavi', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jun 28, 2023', likes: 1, comments: 4 },
      { id: 2, name: 'Get EKYC NRI Flow KT from Ganavi', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jun 29, 2023', comments: 4 },
      { id: 3, name: 'EKYC Admin side — Main, Addsegment, Dormant, NRI Flow KT', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jun 30, 2023', likes: 1 },
      { id: 4, name: 'EKYC Code analysis for all segments', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jul 1, 2023' },
      { id: 5, name: 'Research on EKYC flow and prepare test cases', done: false, tag: 'EKYC-V2', tagColor: 'green', date: 'Jul 3, 2023' },
      { id: 6, name: 'Implement authentication module', done: false, tag: 'Sprint-1', tagColor: 'blue', date: 'Jul 5, 2023', comments: 2 },
    ],
  },
  { id: 'today',     title: 'Do today',     color: '#f59e0b', tasks: [] },
  { id: 'next-week', title: 'Do next week', color: '#10b981', tasks: [] },
  { id: 'later',     title: 'Do later',     color: '#94a3b8', tasks: [] },
])

let nextId = 200
function addTaskToColumn(colId: string) {
  const col = boardColumns.find(c => c.id === colId)
  if (!col) return
  col.tasks.push({ id: nextId++, name: 'New task', done: false,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) })
}
function addSection() {
  boardColumns.push({ id: `s-${Date.now()}`, title: 'New section', color: '#cbd5e1', tasks: [] })
}

// ── Tag helpers ───────────────────────────────────────────────────────────────
const tagMap: Record<string, [string, string]> = {
  green: ['#f0fdf4', '#16a34a'],
  blue:  ['#eff6ff', '#2563eb'],
  red:   ['#fef2f2', '#ef4444'],
  amber: ['#fffbeb', '#d97706'],
}
function tagBg(c?: string)    { return tagMap[c ?? '']?.[0] ?? '#f1f5f9' }
function tagColor(c?: string) { return tagMap[c ?? '']?.[1] ?? '#475569' }

// ── Selected task ─────────────────────────────────────────────────────────────
const selectedTask = ref<(ListTask | BoardTask) | null>(null)
function openTask(t: ListTask | BoardTask) { selectedTask.value = t }

// ── Dashboard data ────────────────────────────────────────────────────────────
const statCards = [
  { label: 'Completed',  value: 7,  pct: 64, icon: 'mdi-check-circle-outline', iconBg: '#f0fdf4', iconColor: '#10b981' },
  { label: 'Incomplete', value: 4,  pct: 36, icon: 'mdi-circle-half-full',     iconBg: '#eff6ff', iconColor: '#3b82f6' },
  { label: 'Overdue',    value: 3,  pct: 27, icon: 'mdi-clock-alert-outline',  iconBg: '#fef2f2', iconColor: '#ef4444' },
  { label: 'Total',      value: 11, pct: 100, icon: 'mdi-format-list-checks',  iconBg: '#eef2ff', iconColor: '#6366f1' },
]

const sectionBars = [
  { label: 'Recent', count: 10 },
  { label: 'Today',  count: 0  },
  { label: 'Next Wk',count: 0  },
  { label: 'Later',  count: 0  },
]
const maxSectionCount = Math.max(...sectionBars.map(b => b.count), 1)

const completionSegments = [
  { label: 'Completed',  value: 7, color: '#818cf8' },
  { label: 'Incomplete', value: 4, color: '#e2e8f0' },
]

const svgW = 300, svgH = 100
const completionPoints = [
  { label: 'Mar 8',  v: 3 }, { label: 'Mar 10', v: 3 }, { label: 'Mar 12', v: 3 },
  { label: 'Mar 14', v: 4 }, { label: 'Mar 16', v: 3 }, { label: 'Mar 18', v: 3 },
  { label: 'Mar 20', v: 3 },
].map((pt, i, arr) => ({
  label: pt.label, v: pt.v,
  x: Math.round((i / (arr.length - 1)) * (svgW - 10) + 5),
  y: Math.round(svgH - (pt.v / 5) * (svgH - 8) - 4),
}))

const completionLinePath = completionPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
const completionAreaPath = completionLinePath +
  ` L${completionPoints[completionPoints.length - 1]!.x},${svgH} L${completionPoints[0]!.x},${svgH} Z`
</script>

<style scoped>
/* ── Root ── */
.task-root {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #1e293b;
  background: #f8fafc;
  overflow: hidden;
}

/* ── Header ── */
.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px 12px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.header-left { display: flex; align-items: center; gap: 12px; }
.task-avatar {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, #f97316, #fb923c);
  color: #fff; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.task-title {
  font-size: 16px; font-weight: 700; color: #0f172a;
  margin: 0; display: flex; align-items: center;
}
.task-sub { font-size: 11.5px; color: #94a3b8; margin: 2px 0 0; }
.header-right { display: flex; gap: 8px; }
.hdr-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 14px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #fff;
  font-size: 12.5px; font-weight: 500; color: #475569;
  cursor: pointer; font-family: 'Inter', sans-serif;
  transition: background .12s, border-color .12s, color .12s;
}
.hdr-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
.hdr-btn--primary {
  background: #4f46e5; border-color: #4f46e5; color: #fff;
  box-shadow: 0 2px 8px rgba(79,70,229,.25);
}
.hdr-btn--primary:hover { background: #4338ca; border-color: #4338ca; }

/* ── Tabs bar ── */
.task-tabs-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.task-tabs { display: flex; gap: 0; }
.task-tab {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 11px 14px;
  border: none; background: none;
  font-size: 12.5px; font-weight: 500; color: #64748b;
  cursor: pointer; font-family: 'Inter', sans-serif;
  border-bottom: 2px solid transparent;
  transition: color .12s, border-color .12s;
  white-space: nowrap;
}
.task-tab:hover { color: #0f172a; }
.task-tab.active { color: #4f46e5; border-bottom-color: #4f46e5; font-weight: 600; }

.toolbar-actions { display: flex; align-items: center; gap: 4px; }
.tool-btn {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 5px 10px; border-radius: 6px;
  border: none; background: none;
  font-size: 12px; color: #64748b;
  cursor: pointer; font-family: 'Inter', sans-serif;
  transition: background .12s, color .12s;
}
.tool-btn:hover { background: #f1f5f9; color: #0f172a; }
.tool-sep { width: 1px; height: 16px; background: #e2e8f0; margin: 0 4px; }
.tool-icon-btn {
  width: 28px; height: 28px; border-radius: 6px;
  border: none; background: none; color: #64748b;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background .12s, color .12s;
}
.tool-icon-btn:hover { background: #f1f5f9; color: #4f46e5; }

/* ── Body ── */
.task-body {
  flex: 1; min-height: 0; overflow: hidden;
  display: flex; flex-direction: column;
}

/* ── LIST VIEW ── */
.list-view { flex: 1; overflow-y: auto; padding: 16px 24px; }
.list-table-wrap {
  background: #fff; border-radius: 12px;
  border: 1px solid #e2e8f0; overflow: hidden;
}
.list-table { width: 100%; border-collapse: collapse; }
.list-table thead th {
  padding: 10px 14px; text-align: left;
  font-size: 11px; font-weight: 600; color: #94a3b8;
  background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase; letter-spacing: .04em;
}
.group-row td { padding: 0; }
.group-label {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 14px;
  font-size: 12px; font-weight: 700; color: #475569;
  background: #f8fafc; border-bottom: 1px solid #e2e8f0;
}
.group-count {
  background: #e2e8f0; color: #64748b;
  font-size: 10px; font-weight: 700;
  padding: 1px 6px; border-radius: 20px;
}
.list-row {
  cursor: pointer;
  animation: fadeSlideUp .25s ease both;
  transition: background .1s;
}
.list-row:hover td { background: #f8fafc; }
.list-row td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
.list-row:last-of-type td { border-bottom: none; }

.name-cell { display: flex; align-items: center; gap: 8px; }
.check-btn {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%;
  border: none; background: none; cursor: pointer;
  color: #cbd5e1; flex-shrink: 0;
  transition: color .15s;
}
.check-btn:hover { color: #6366f1; }
.check-btn.done { color: #10b981; }
.check-btn.lg { width: 28px; height: 28px; }
.task-name { font-size: 13px; font-weight: 500; color: #0f172a; }
.task-done { text-decoration: line-through; color: #94a3b8; }
.comment-badge {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 11px; color: #94a3b8; margin-left: 4px;
}
.due-cell { font-size: 12px; color: #64748b; white-space: nowrap; }
.due-cell.overdue { color: #ef4444; font-weight: 600; }
.avatar-stack { display: flex; }
.mini-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  border: 2px solid #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; color: #475569;
  margin-right: -6px; overflow: hidden; flex-shrink: 0;
}
.mini-avatar img { width: 100%; height: 100%; object-fit: cover; }
.mini-avatar:last-child { margin-right: 0; }
.proj-cell { vertical-align: middle; }
.proj-chip {
  font-size: 11px; font-weight: 500;
  background: #eef2ff; color: #4f46e5;
  padding: 2px 8px; border-radius: 20px;
}
.prio-pill {
  font-size: 11px; font-weight: 600;
  padding: 2px 8px; border-radius: 20px;
}
.prio-high   { background: #fef2f2; color: #ef4444; }
.prio-medium { background: #fffbeb; color: #d97706; }
.prio-low    { background: #f0fdf4; color: #16a34a; }
.add-row { cursor: pointer; }
.add-row:hover td { background: #f8fafc; }
.add-row td { padding: 10px 14px; border-top: 1px dashed #e2e8f0; }
.add-row-inner {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 12.5px; color: #94a3b8;
  transition: color .12s;
}
.add-row:hover .add-row-inner { color: #4f46e5; }

/* ── BOARD VIEW ── */
.board-view {
  flex: 1; display: flex; gap: 14px;
  padding: 16px 24px; overflow-x: auto; overflow-y: hidden;
  align-items: flex-start;
}
.board-col {
  width: 250px; min-width: 250px;
  background: #fff; border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex; flex-direction: column;
  max-height: 100%; overflow: hidden;
  flex-shrink: 0;
}
.col-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px 10px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}
.col-header-left { display: flex; align-items: center; gap: 7px; }
.col-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.col-title { font-size: 13px; font-weight: 600; color: #0f172a; }
.col-count {
  font-size: 11px; font-weight: 600;
  background: #f1f5f9; color: #64748b;
  padding: 1px 6px; border-radius: 20px;
}
.col-menu-btn {
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 6px;
  border: none; background: none; color: #94a3b8;
  cursor: pointer; transition: background .12s, color .12s;
}
.col-menu-btn:hover { background: #f1f5f9; color: #475569; }
.col-cards {
  flex: 1; overflow-y: auto;
  padding: 10px 10px 6px;
  display: flex; flex-direction: column; gap: 8px;
}
.board-card {
  background: #fff; border-radius: 10px;
  border: 1px solid #e2e8f0;
  padding: 10px 12px;
  cursor: pointer;
  animation: fadeSlideUp .25s ease both;
  transition: border-color .15s, box-shadow .15s, transform .15s;
}
.board-card:hover {
  border-color: #a5b4fc;
  box-shadow: 0 4px 14px rgba(79,70,229,.08);
  transform: translateY(-1px);
}
.bc-top { display: flex; align-items: flex-start; gap: 7px; margin-bottom: 7px; }
.bc-name { font-size: 12.5px; font-weight: 500; color: #0f172a; line-height: 1.4; }
.bc-tag {
  display: inline-block; font-size: 10.5px; font-weight: 600;
  padding: 2px 8px; border-radius: 20px; margin-bottom: 7px;
}
.bc-footer { display: flex; align-items: center; justify-content: space-between; }
.bc-date { font-size: 11px; color: #94a3b8; }
.bc-meta { display: flex; gap: 8px; }
.bc-meta-item {
  display: inline-flex; align-items: center; gap: 3px;
  font-size: 11px; color: #94a3b8;
}
.col-add-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 10px; border-radius: 8px;
  border: 1px dashed #e2e8f0; background: none;
  font-size: 12px; color: #94a3b8;
  cursor: pointer; font-family: 'Inter', sans-serif;
  transition: border-color .12s, color .12s, background .12s;
  width: 100%;
}
.col-add-btn:hover { border-color: #a5b4fc; color: #4f46e5; background: #fafafe; }
.add-section-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 10px 14px; border-radius: 10px;
  border: 1px dashed #e2e8f0; background: #fff;
  font-size: 12.5px; color: #94a3b8;
  cursor: pointer; font-family: 'Inter', sans-serif;
  white-space: nowrap; flex-shrink: 0; align-self: flex-start;
  transition: border-color .12s, color .12s;
}
.add-section-btn:hover { border-color: #a5b4fc; color: #4f46e5; }

/* ── DASHBOARD VIEW ── */
.dash-view { flex: 1; overflow-y: auto; padding: 16px 24px; display: flex; flex-direction: column; gap: 16px; }
.dash-stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.dash-stat-card {
  background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;
  padding: 16px; display: flex; flex-direction: column; gap: 6px;
  transition: box-shadow .15s, transform .15s;
}
.dash-stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.07); transform: translateY(-2px); }
.dsc-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 4px;
}
.dsc-val { font-size: 28px; font-weight: 700; color: #0f172a; line-height: 1; }
.dsc-label { font-size: 12px; color: #64748b; }
.dsc-bar { height: 4px; background: #f1f5f9; border-radius: 99px; overflow: hidden; margin-top: 4px; }
.dsc-bar-fill { height: 100%; border-radius: 99px; transition: width .6s; }

.dash-charts-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.dash-chart-card {
  background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;
  padding: 16px;
}
.dcc-title { font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 14px; }

/* Bar chart */
.bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 120px; }
.bar-item { display: flex; flex-direction: column; align-items: center; flex: 1; gap: 4px; height: 100%; }
.bar-val { font-size: 11px; color: #64748b; font-weight: 600; }
.bar-col-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; }
.bar-fill { width: 100%; border-radius: 4px 4px 0 0; min-height: 3px; transition: height .5s; }
.bar-lbl { font-size: 10px; color: #94a3b8; text-align: center; }

/* Donut */
.donut-row { display: flex; align-items: center; gap: 16px; }
.donut-legend { display: flex; flex-direction: column; gap: 8px; }
.donut-leg-row { display: flex; align-items: center; gap: 7px; font-size: 12px; }
.donut-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.donut-lbl { color: #64748b; flex: 1; }
.donut-val { font-weight: 700; color: #0f172a; }

/* Line chart */
.line-chart-svg { width: 100%; height: 100px; display: block; }
.line-labels {
  display: flex; justify-content: space-between;
  margin-top: 6px;
}
.line-labels span { font-size: 9px; color: #94a3b8; flex: 1; text-align: center; }

/* ── Placeholder ── */
.placeholder-view {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 8px; color: #94a3b8;
}
.placeholder-icon { font-size: 44px; }
.placeholder-title { font-size: 15px; font-weight: 600; color: #475569; }
.placeholder-sub { font-size: 12.5px; }

/* ── Task Drawer ── */
.task-drawer-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,.25);
  z-index: 100; display: flex; justify-content: flex-end;
}
.task-drawer {
  width: 380px; background: #fff; height: 100%;
  box-shadow: -4px 0 24px rgba(0,0,0,.12);
  display: flex; flex-direction: column;
  animation: slideInRight .2s ease;
}
@keyframes slideInRight {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
.drawer-header {
  display: flex; align-items: center; gap: 10px;
  padding: 16px 18px; border-bottom: 1px solid #e2e8f0;
}
.drawer-title { flex: 1; font-size: 14px; font-weight: 600; color: #0f172a; line-height: 1.4; }
.drawer-close {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border-radius: 7px;
  border: none; background: none; color: #94a3b8;
  cursor: pointer; transition: background .12s, color .12s;
}
.drawer-close:hover { background: #f1f5f9; color: #475569; }
.drawer-body { flex: 1; overflow-y: auto; padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; }
.drawer-tag {
  display: inline-block; font-size: 11.5px; font-weight: 600;
  padding: 3px 10px; border-radius: 20px;
}
.drawer-meta-row {
  display: flex; align-items: center; gap: 8px;
  font-size: 12.5px; color: #64748b;
}
.drawer-desc {
  font-size: 12.5px; color: #94a3b8;
  background: #f8fafc; border-radius: 8px;
  padding: 12px; margin-top: 4px;
}

/* ── Animation ── */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
