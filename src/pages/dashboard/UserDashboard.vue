<template>
  <v-container fluid class="dash">

    <!-- Header -->
    <div class="dash-header">
      <div>
        <div class="greeting-row">
          <span class="greeting-wave">👋</span>
          <h1 class="dash-title">Good morning, <span class="name-grad">{{ store.currentUser.name }}</span>!</h1>
        </div>
        <p class="dash-sub">Here's a summary of your day ahead — {{ today }}</p>
      </div>
      <div class="header-actions">
        <v-btn variant="outlined" class="hdr-btn" :ripple="false">
          <v-icon size="14">mdi-bell-outline</v-icon>
          <span class="notif-dot"></span>
        </v-btn>
        <v-btn class="my-tasks-btn" elevation="0" :ripple="false">
          <v-icon size="14" class="mr-1">mdi-check-all</v-icon>My Tasks
        </v-btn>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="stat-row">
      <div v-for="stat in quickStats" :key="stat.label" class="stat-card" :style="{ '--accent': stat.accent }">
        <div class="stat-card-inner">
          <div class="stat-icon-wrap">
            <div class="stat-icon-bg" :style="{ background: stat.iconBg }">
              <v-icon :color="stat.iconColor" size="22">{{ stat.icon }}</v-icon>
            </div>
            <div class="stat-sparkle"></div>
          </div>
          <div class="stat-info">
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-val">{{ stat.value }}</div>
          </div>
        </div>
        <div class="stat-bar">
          <div class="stat-bar-fill" :style="{ width: stat.pct + '%', background: stat.accent }"></div>
        </div>
        <div class="stat-footer">
          <span class="stat-trend" :class="stat.trendUp ? 'trend-up' : 'trend-down'">
            <v-icon size="11">{{ stat.trendUp ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
            {{ stat.trend }}
          </span>
          <span class="stat-period">vs last week</span>
        </div>
        <div class="stat-glow" :style="{ background: stat.accent }"></div>
      </div>
    </div>

    <!-- Main grid -->
    <div class="dash-grid">

      <!-- LEFT COLUMN -->
      <div class="left-col">

        <!-- My Priorities -->
        <div class="panel">
          <div class="panel-head">
            <div class="d-flex align-center ga-2">
              <div class="panel-icon-dot" style="background:#4f46e5"></div>
              <span class="panel-title">My Priorities</span>
            </div>
            <div class="d-flex align-center ga-2">
              <span class="tasks-badge">{{ pendingTasks.length }} tasks</span>
              <button class="panel-action-btn">+ Add</button>
            </div>
          </div>

          <div v-for="task in pendingTasks" :key="task.id" class="task-row">
            <div class="task-check-wrap">
              <input type="checkbox" v-model="task.completed" class="task-cb" />
            </div>
            <div class="task-body">
              <div class="task-name" :class="{ 'task-done': task.completed }">{{ task.title }}</div>
              <div class="task-meta">
                <span :class="dueCls(task.dueDate)">
                  <v-icon size="10">mdi-calendar-clock</v-icon> {{ task.dueDate }}
                </span>
                <span class="meta-dot"></span>
                <span class="meta-proj">
                  <v-icon size="10">mdi-folder-outline</v-icon> {{ task.project }}
                </span>
              </div>
            </div>
            <span class="priority-pill" :class="`pill-${task.priority.toLowerCase()}`">{{ task.priority }}</span>
            <v-icon size="13" class="row-chevron">mdi-chevron-right</v-icon>
          </div>
        </div>

        <!-- Sprint Progress -->
        <div class="panel">
          <div class="panel-head">
            <div class="d-flex align-center ga-2">
              <div class="panel-icon-dot" style="background:#8b5cf6"></div>
              <span class="panel-title">Sprint Progress</span>
            </div>
            <span class="sprint-label">Sprint 24 · 4 days left</span>
          </div>

          <div class="sprint-overview">
            <div class="sprint-donut-wrap">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#f1f5f9" stroke-width="10" />
                <circle cx="40" cy="40" r="32" fill="none" stroke="#4f46e5" stroke-width="10" stroke-dasharray="201"
                  :stroke-dashoffset="201 - (201 * sprintPct / 100)" stroke-linecap="round"
                  transform="rotate(-90 40 40)" />
                <text x="40" y="44" text-anchor="middle" font-size="14" font-weight="700" fill="#0f172a">{{ sprintPct
                  }}%</text>
              </svg>
            </div>
            <div class="sprint-stats">
              <div v-for="s in sprintStats" :key="s.label" class="sprint-stat-item">
                <div class="sprint-stat-val" :style="{ color: s.color }">{{ s.value }}</div>
                <div class="sprint-stat-label">{{ s.label }}</div>
              </div>
            </div>
          </div>

          <div class="sprint-breakdown">
            <div v-for="b in sprintBreakdown" :key="b.label" class="sb-row">
              <div class="sb-label-wrap">
                <span class="sb-dot" :style="{ background: b.color }"></span>
                <span class="sb-label">{{ b.label }}</span>
              </div>
              <div class="sb-bar-wrap">
                <div class="sb-bar">
                  <div class="sb-fill" :style="{ width: (b.count / sprintTotal * 100) + '%', background: b.color }">
                  </div>
                </div>
                <span class="sb-count">{{ b.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Productivity Chart -->
        <div class="panel">
          <div class="panel-head">
            <div class="d-flex align-center ga-2">
              <div class="panel-icon-dot" style="background:#06b6d4"></div>
              <span class="panel-title">My Productivity</span>
            </div>
            <div class="chart-tabs">
              <button v-for="t in ['Week', 'Month']" :key="t" class="chart-tab" :class="{ active: chartTab === t }"
                @click="chartTab = t">{{ t }}</button>
            </div>
          </div>
          <div class="chart-wrap">
            <svg width="100%" height="120" viewBox="0 0 420 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.18" />
                  <stop offset="100%" stop-color="#4f46e5" stop-opacity="0" />
                </linearGradient>
              </defs>
              <line v-for="y in [20, 50, 80, 110]" :key="y" x1="0" :y1="y" x2="420" :y2="y" stroke="#f1f5f9"
                stroke-width="1" />
              <polygon :points="chartAreaPts" fill="url(#chartGrad)" />
              <polyline :points="chartLinePts" fill="none" stroke="#4f46e5" stroke-width="2.5" stroke-linejoin="round"
                stroke-linecap="round" />
              <circle v-for="(p, i) in chartPoints" :key="i" :cx="p.x" :cy="p.y" r="3.5" fill="#4f46e5" stroke="white"
                stroke-width="1.5" />
            </svg>
            <div class="chart-labels">
              <span v-for="l in chartLabels" :key="l">{{ l }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- RIGHT COLUMN -->
      <div class="right-col">

        <!-- Today's Schedule -->
        <div class="panel">
          <div class="panel-head">
            <div class="d-flex align-center ga-2">
              <div class="panel-icon-dot" style="background:#f59e0b"></div>
              <span class="panel-title">Today's Schedule</span>
            </div>
            <span class="schedule-date">{{ shortDate }}</span>
          </div>
          <div class="schedule-list">
            <div v-for="ev in todaySchedule" :key="ev.id" class="schedule-item" :style="{ '--ev-color': ev.color }">
              <div class="ev-time-col">
                <span class="ev-time">{{ ev.time }}</span>
              </div>
              <div class="ev-bar" :style="{ background: ev.color }"></div>
              <div class="ev-body">
                <div class="ev-title">{{ ev.title }}</div>
                <div class="ev-meta">
                  <v-icon size="10">mdi-account-group-outline</v-icon> {{ ev.attendees }}
                </div>
              </div>
              <span class="ev-type-badge" :style="{ background: ev.bg, color: ev.color }">{{ ev.type }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="panel">
          <div class="panel-head">
            <div class="d-flex align-center ga-2">
              <div class="panel-icon-dot" style="background:#10b981"></div>
              <span class="panel-title">Recent Activity</span>
            </div>
          </div>
          <div class="activity-list">
            <div v-for="(act, i) in recentActivity" :key="i" class="act-row">
              <div class="act-dot-wrap">
                <div class="act-dot" :style="{ background: act.color }"></div>
                <div v-if="i < recentActivity.length - 1" class="act-line"></div>
              </div>
              <div class="act-body">
                <div class="act-text">
                  <span class="act-user">{{ act.user }}</span>
                  <span class="act-action"> {{ act.action }} </span>
                  <a href="#" class="act-link">{{ act.target }}</a>
                </div>
                <div class="act-time">{{ act.time }}</div>
              </div>
            </div>
          </div>
          <div class="view-all-wrap">
            <button class="view-all-btn">View All Activity</button>
          </div>
        </div>

        <!-- Team Workload -->
        <div class="panel">
          <div class="panel-head">
            <div class="d-flex align-center ga-2">
              <div class="panel-icon-dot" style="background:#ef4444"></div>
              <span class="panel-title">Team Workload</span>
            </div>
          </div>
          <div class="team-list">
            <div v-for="m in teamMembers" :key="m.name" class="team-row">
              <div class="team-av" :style="{ background: m.bg }">{{ m.initials }}</div>
              <div class="team-info">
                <div class="team-name">{{ m.name }}</div>
                <div class="team-bar-wrap">
                  <div class="team-bar">
                    <div class="team-fill" :style="{ width: m.load + '%', background: loadColor(m.load) }"></div>
                  </div>
                  <span class="team-pct">{{ m.load }}%</span>
                </div>
              </div>
              <span class="team-tasks-count">{{ m.tasks }} tasks</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()

const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
const shortDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const quickStats = [
  {
    label: 'Active Tasks', value: 12,
    icon: 'mdi-clipboard-text-outline', iconColor: '#4f46e5', iconBg: '#eef2ff',
    accent: '#4f46e5', pct: 72, trend: '+3 today', trendUp: true,
  },
  {
    label: 'Pending Review', value: 4,
    icon: 'mdi-eye-outline', iconColor: '#f59e0b', iconBg: '#fffbeb',
    accent: '#f59e0b', pct: 36, trend: '+1 today', trendUp: true,
  },
  {
    label: 'Completed This Week', value: 28,
    icon: 'mdi-check-decagram-outline', iconColor: '#10b981', iconBg: '#f0fdf4',
    accent: '#10b981', pct: 88, trend: '+5 this week', trendUp: true,
  },
  {
    label: 'Overdue', value: 2,
    icon: 'mdi-alert-circle-outline', iconColor: '#ef4444', iconBg: '#fef2f2',
    accent: '#ef4444', pct: 20, trend: '-1 today', trendUp: false,
  },
]

const pendingTasks = ref([
  { id: 1, title: 'Fix navigation bug on mobile', project: 'Website Redesign', dueDate: 'Today', priority: 'High', completed: false },
  { id: 2, title: 'Review API payload structures', project: 'Backend Migration', dueDate: 'Tomorrow', priority: 'Medium', completed: false },
  { id: 3, title: 'Update onboarding illustrations', project: 'Mobile App V2', dueDate: 'Oct 24', priority: 'Low', completed: false },
  { id: 4, title: 'Prepare slide deck for sprint review', project: 'Execora (EX)', dueDate: 'Oct 25', priority: 'Medium', completed: false },
  { id: 5, title: 'Write unit tests for auth module', project: 'Backend Migration', dueDate: 'Oct 26', priority: 'High', completed: false },
])

// Sprint
const sprintPct = 68
const sprintTotal = 42
const sprintStats = [
  { label: 'Story Points', value: '34/50', color: '#4f46e5' },
  { label: 'Completed', value: '28', color: '#10b981' },
  { label: 'In Progress', value: '8', color: '#f59e0b' },
]
const sprintBreakdown = [
  { label: 'Done', count: 28, color: '#10b981' },
  { label: 'In Progress', count: 8, color: '#f59e0b' },
  { label: 'To Do', count: 6, color: '#94a3b8' },
]

// Productivity chart
const chartTab = ref('Week')
const weekData = [4, 7, 5, 9, 6, 11, 8]
const monthData = [18, 22, 15, 28, 24, 30, 26, 20, 32, 27, 35, 29]
const chartLabels = computed(() =>
  chartTab.value === 'Week'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']
)
const chartData = computed(() => chartTab.value === 'Week' ? weekData : monthData)
const chartPoints = computed(() => {
  const d = chartData.value
  const maxV = Math.max(...d)
  const w = 420, h = 110, pad = 20
  return d.map((v, i) => ({
    x: pad + (i / (d.length - 1)) * (w - pad * 2),
    y: h - (v / maxV) * (h - 20),
  }))
})
const chartLinePts = computed(() => chartPoints.value.map(p => `${p.x},${p.y}`).join(' '))
const chartAreaPts = computed(() => {
  const pts = chartPoints.value
  if (!pts.length) return ''
  const first = pts[0]!
  const last = pts[pts.length - 1]!
  return `${pts.map(p => `${p.x},${p.y}`).join(' ')} ${last.x},120 ${first.x},120`
})

// Today's schedule
const todaySchedule = [
  { id: 1, time: '9:00 AM', title: 'Daily Standup', attendees: '8 people', type: 'Meeting', color: '#4f46e5', bg: '#eef2ff' },
  { id: 2, time: '11:00 AM', title: 'Sprint Planning Review', attendees: '5 people', type: 'Sprint', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 3, time: '2:00 PM', title: 'Design Handoff Session', attendees: '3 people', type: 'Design', color: '#06b6d4', bg: '#ecfeff' },
  { id: 4, time: '4:30 PM', title: 'Code Review: Auth Module', attendees: '2 people', type: 'Review', color: '#10b981', bg: '#f0fdf4' },
]

// Recent activity
const recentActivity = [
  { user: 'Sarah J.', action: 'mentioned you in', target: 'EX-142 Overview Doc', time: '10 mins ago', color: '#6366f1' },
  { user: 'Mike T.', action: 'moved', target: 'Design System Update', time: '1 hour ago', color: '#a855f7' },
  { user: 'System', action: 'assigned you to', target: 'Performance Audit', time: '2 hours ago', color: '#f59e0b' },
  { user: 'Dave B.', action: 'completed', target: 'Database Migration Phase 1', time: 'Yesterday', color: '#10b981' },
  { user: 'Lasa M.', action: 'commented on', target: 'Sprint 24 Retrospective', time: 'Yesterday', color: '#ef4444' },
]

// Team workload
const teamMembers = [
  { name: 'Sarah Johnson', initials: 'SJ', bg: '#dbeafe', load: 92, tasks: 14 },
  { name: 'Mike Torres', initials: 'MT', bg: '#fce7f3', load: 75, tasks: 11 },
  { name: 'Dave Brown', initials: 'DB', bg: '#dcfce7', load: 58, tasks: 8 },
  { name: 'Lasa Marandi', initials: 'LM', bg: '#fef3c7', load: 40, tasks: 6 },
  { name: 'Rupert Hall', initials: 'RH', bg: '#ede9fe', load: 25, tasks: 4 },
]

function loadColor(pct: number) {
  if (pct >= 85) return '#ef4444'
  if (pct >= 65) return '#f59e0b'
  return '#10b981'
}

function dueCls(d: string) {
  if (d.toLowerCase() === 'today') return 'meta-due due-today'
  if (d.toLowerCase() === 'tomorrow') return 'meta-due due-tomorrow'
  return 'meta-due'
}
</script>

<style scoped>
.dash {
  padding: 22px 26px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #1e293b;
  background: #f8fafc;
  min-height: 100%;
}

/* ── Header ── */
.dash-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.greeting-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
}

.greeting-wave {
  font-size: 20px;
  animation: wave 2s ease-in-out infinite;
  transform-origin: 70% 70%;
  display: inline-block;
}

@keyframes wave {

  0%,
  100% {
    transform: rotate(0deg);
  }

  20% {
    transform: rotate(18deg);
  }

  40% {
    transform: rotate(-8deg);
  }

  60% {
    transform: rotate(14deg);
  }

  80% {
    transform: rotate(-4deg);
  }
}

.dash-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.name-grad {
  background: linear-gradient(120deg, #4f46e5, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dash-sub {
  font-size: 12.5px;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hdr-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background .12s;
}

.hdr-btn:hover {
  background: #f8fafc;
}

.notif-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ef4444;
  border: 1.5px solid #fff;
}

.my-tasks-btn {
  display: inline-flex;
  align-items: center;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 8px rgba(79, 70, 229, .3);
  transition: background .15s, box-shadow .15s, transform .15s;
}

.my-tasks-btn:hover {
  background: #4338ca;
  box-shadow: 0 4px 16px rgba(79, 70, 229, .4);
  transform: translateY(-1px);
}

/* ── Stat cards ── */
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

@media (max-width: 900px) {
  .stat-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stat-row {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  position: relative;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 18px 14px;
  overflow: hidden;
  cursor: default;
  transition: transform .25s cubic-bezier(.34, 1.56, .64, 1), box-shadow .25s ease, border-color .25s ease;
}

.stat-card:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 12px 32px rgba(0, 0, 0, .10);
  border-color: var(--accent);
}

.stat-card:hover .stat-glow {
  opacity: .08;
  transform: scale(1.4);
}

.stat-card:hover .stat-icon-bg {
  transform: rotate(-8deg) scale(1.1);
}

.stat-card:hover .stat-val {
  transform: scale(1.05);
}

.stat-card:hover .stat-bar-fill {
  filter: brightness(1.1);
}

.stat-card-inner {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.stat-icon-wrap {
  position: relative;
}

.stat-icon-bg {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform .3s cubic-bezier(.34, 1.56, .64, 1);
}

.stat-sparkle {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0;
  transition: opacity .2s;
}

.stat-card:hover .stat-sparkle {
  opacity: 1;
  animation: sparkle-pop .4s ease forwards;
}

@keyframes sparkle-pop {
  0% {
    transform: scale(0);
    opacity: 1;
  }

  60% {
    transform: scale(1.6);
    opacity: .8;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 11.5px;
  color: #64748b;
  margin-bottom: 4px;
}

.stat-val {
  font-size: 30px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
  transition: transform .2s;
  display: inline-block;
}

.stat-bar {
  height: 4px;
  background: #f1f5f9;
  border-radius: 99px;
  margin-bottom: 10px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width .6s cubic-bezier(.4, 0, .2, 1), filter .2s;
}

.stat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 600;
}

.trend-up {
  color: #10b981;
}

.trend-down {
  color: #ef4444;
}

.stat-period {
  font-size: 10.5px;
  color: #94a3b8;
}

.stat-glow {
  position: absolute;
  bottom: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity .3s, transform .3s;
  pointer-events: none;
}

/* ── Main grid ── */
.dash-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  align-items: start;
}

.left-col,
.right-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

@media (max-width: 900px) {
  .dash-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dash {
    padding: 14px;
  }

  .dash-header {
    flex-wrap: wrap;
    gap: 10px;
  }
}

/* ── Shared panel ── */
.panel {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  transition: box-shadow .2s;
}

.panel:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, .06);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.panel-icon-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.panel-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #0f172a;
}

.tasks-badge {
  font-size: 11px;
  font-weight: 600;
  background: #eef2ff;
  color: #4f46e5;
  padding: 2px 9px;
  border-radius: 20px;
}

.panel-action-btn {
  font-size: 11px;
  font-weight: 600;
  color: #4f46e5;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  padding: 0;
  transition: opacity .15s;
}

.panel-action-btn:hover {
  opacity: .7;
}

/* ── Task rows ── */
.task-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  border-bottom: 1px solid #f8fafc;
  cursor: pointer;
  transition: background .12s;
  position: relative;
}

.task-row:last-child {
  border-bottom: none;
}

.task-row:hover {
  background: #f8fafc;
}

.task-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #4f46e5;
  border-radius: 0 3px 3px 0;
  opacity: 0;
  transition: opacity .15s;
}

.task-row:hover::before {
  opacity: 1;
}

.task-check-wrap {
  flex-shrink: 0;
}

.task-cb {
  width: 14px;
  height: 14px;
  accent-color: #4f46e5;
  cursor: pointer;
}

.task-body {
  flex: 1;
  min-width: 0;
}

.task-name {
  font-size: 12.5px;
  font-weight: 500;
  color: #0f172a;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-done {
  text-decoration: line-through;
  color: #94a3b8;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
}

.meta-due {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #64748b;
}

.due-today {
  color: #ef4444;
  font-weight: 600;
}

.due-tomorrow {
  color: #f59e0b;
  font-weight: 600;
}

.meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #cbd5e1;
}

.meta-proj {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #94a3b8;
}

.priority-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: transform .15s;
}

.task-row:hover .priority-pill {
  transform: scale(1.05);
}

.pill-high {
  background: #fef2f2;
  color: #ef4444;
}

.pill-medium {
  background: #fffbeb;
  color: #d97706;
}

.pill-low {
  background: #f0fdf4;
  color: #16a34a;
}

.row-chevron {
  color: #cbd5e1;
  flex-shrink: 0;
  transition: transform .15s, color .15s;
}

.task-row:hover .row-chevron {
  transform: translateX(3px);
  color: #94a3b8;
}

/* ── Sprint ── */
.sprint-label {
  font-size: 11.5px;
  font-weight: 600;
  color: #8b5cf6;
  background: #f5f3ff;
  padding: 2px 9px;
  border-radius: 20px;
}

.sprint-overview {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 16px 12px;
}

.sprint-donut-wrap {
  flex-shrink: 0;
}

.sprint-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.sprint-stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sprint-stat-val {
  font-size: 14px;
  font-weight: 700;
}

.sprint-stat-label {
  font-size: 11px;
  color: #94a3b8;
}

.sprint-breakdown {
  padding: 0 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sb-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sb-label-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 90px;
  flex-shrink: 0;
}

.sb-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sb-label {
  font-size: 11.5px;
  color: #475569;
}

.sb-bar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.sb-bar {
  flex: 1;
  height: 6px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
}

.sb-fill {
  height: 100%;
  border-radius: 99px;
  transition: width .5s;
}

.sb-count {
  font-size: 11.5px;
  font-weight: 600;
  color: #64748b;
  width: 20px;
  text-align: right;
}

/* ── Productivity chart ── */
.chart-tabs {
  display: flex;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  overflow: hidden;
}

.chart-tab {
  padding: 4px 10px;
  font-size: 11.5px;
  font-weight: 500;
  color: #64748b;
  background: #fff;
  border: none;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: background .12s, color .12s;
}

.chart-tab.active {
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 600;
}

.chart-wrap {
  padding: 12px 16px 4px;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 4px 0 8px;
  font-size: 10.5px;
  color: #94a3b8;
}

/* ── Schedule ── */
.schedule-date {
  font-size: 11.5px;
  color: #94a3b8;
}

.schedule-list {
  padding: 8px 0;
}

.schedule-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  transition: background .12s;
  cursor: pointer;
}

.schedule-item:hover {
  background: #f8fafc;
}

.ev-time-col {
  width: 58px;
  flex-shrink: 0;
}

.ev-time {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.ev-bar {
  width: 3px;
  height: 32px;
  border-radius: 99px;
  flex-shrink: 0;
}

.ev-body {
  flex: 1;
  min-width: 0;
}

.ev-title {
  font-size: 12.5px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 2px;
}

.ev-meta {
  font-size: 11px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 3px;
}

.ev-type-badge {
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── Activity ── */
.activity-list {
  padding: 6px 0;
}

.act-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 16px;
  transition: background .12s;
}

.act-row:hover {
  background: #f8fafc;
}

.act-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 3px;
}

.act-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px #fff;
  transition: transform .2s;
}

.act-row:hover .act-dot {
  transform: scale(1.3);
}

.act-line {
  width: 1px;
  flex: 1;
  min-height: 18px;
  background: #e2e8f0;
  margin-top: 4px;
}

.act-body {
  flex: 1;
}

.act-text {
  font-size: 12px;
  line-height: 1.5;
  color: #1e293b;
}

.act-user {
  font-weight: 600;
}

.act-action {
  color: #64748b;
}

.act-link {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}

.act-link:hover {
  text-decoration: underline;
}

.act-time {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
}

.view-all-wrap {
  padding: 10px 12px;
  border-top: 1px solid #f1f5f9;
}

.view-all-btn {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: background .12s, border-color .12s, color .12s;
}

.view-all-btn:hover {
  background: #eef2ff;
  border-color: #c7d2fe;
  color: #4f46e5;
}

/* ── Team workload ── */
.team-list {
  padding: 8px 0;
}

.team-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 16px;
  transition: background .12s;
  cursor: default;
}

.team-row:hover {
  background: #f8fafc;
}

.team-av {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #475569;
}

.team-info {
  flex: 1;
  min-width: 0;
}

.team-name {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.team-bar-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.team-bar {
  flex: 1;
  height: 5px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
}

.team-fill {
  height: 100%;
  border-radius: 99px;
  transition: width .5s;
}

.team-pct {
  font-size: 10.5px;
  font-weight: 600;
  color: #64748b;
  width: 28px;
  text-align: right;
}

.team-tasks-count {
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
  flex-shrink: 0;
}

.ga-2 {
  gap: 8px;
}






</style>
