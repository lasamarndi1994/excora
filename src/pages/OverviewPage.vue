<template>
  <div class="overview-page">
    <ProjectHeader active-tab="summary" />

    <div class="overview-body">
      <!-- Toolbar -->
      <div class="overview-toolbar">
        <div class="filter-group">
          <button class="tool-btn" @click="filterOpen = !filterOpen">
            <span class="icon">⚙</span> Filter
          </button>
          <div v-if="filterOpen" class="filter-dropdown">
            <input class="filter-search" placeholder="Search filters..." />
            <label v-for="f in filterOptions" :key="f.value" class="filter-item">
              <input type="checkbox" /> {{ f.title }}
            </label>
          </div>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="stat-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-card" :style="`--accent:${stat.color}`">
          <div class="stat-icon" :style="`background:${stat.bg}`">
            <v-icon :color="stat.color" size="18">{{ stat.icon }}</v-icon>
          </div>
          <div>
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="main-grid">
        <!-- Status Overview -->
        <div class="card span-2">
          <div class="card-header">
            <div>
              <div class="card-title">Status overview</div>
              <div class="card-sub">Snapshot of work item statuses. <a href="#" class="link">View all</a></div>
            </div>
          </div>
          <div class="status-body">
            <div class="donut-wrap">
              <div class="donut">
                <div class="donut-hole">
                  <div class="donut-num">157</div>
                  <div class="donut-lbl">Total items</div>
                </div>
              </div>
            </div>
            <div class="legend-list">
              <div v-for="s in statusLegend" :key="s.label" class="legend-row">
                <span class="legend-dot" :style="`background:${s.color}`"></span>
                <span class="legend-text">{{ s.label }}</span>
                <span class="legend-count">{{ s.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card span-2">
          <div class="card-header">
            <div>
              <div class="card-title">Recent activity</div>
              <div class="card-sub">Stay up to date with what's happening.</div>
            </div>
            <button class="icon-btn">↗</button>
          </div>
          <div class="activity-date">Wednesday, December 24, 2025</div>
          <div class="activity-item">
            <div class="activity-avatar">S</div>
            <div class="activity-content">
              <div class="activity-text">
                <span class="activity-user">shiva.m</span>
                <span class="activity-action"> commented on </span>
                <span class="activity-link">AB-725: Update RMS Policy 17-12-2025</span>
                <span class="status-chip chip-green">CLOSED</span>
              </div>
              <div class="activity-time">6 days ago</div>
              <div class="activity-comment">
                <span class="mention">@Yash Ramakant Argre</span>, Validated above task and its working as expected.
              </div>
            </div>
          </div>
        </div>

        <!-- Priority Breakdown -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Priority breakdown</div>
              <div class="card-sub">Holistic view of work prioritization.</div>
            </div>
          </div>
          <div class="bar-chart">
            <div v-for="b in priorityBars" :key="b.label" class="bar-col">
              <div class="bar-track">
                <div class="bar-fill" :style="`height:${b.pct}%;background:${b.color}`"></div>
              </div>
              <div class="bar-label">{{ b.label }}</div>
            </div>
          </div>
        </div>

        <!-- Types of Work -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Types of work</div>
              <div class="card-sub">Breakdown by work item type.</div>
            </div>
          </div>
          <div class="type-list">
            <div v-for="t in workTypes" :key="t.name" class="type-row">
              <div class="type-name">
                <v-icon :color="t.color" size="15">{{ t.icon }}</v-icon>
                {{ t.name }}
              </div>
              <div class="type-bar-wrap">
                <div class="type-bar" :style="`width:${t.value}%;background:${t.barColor}`"></div>
                <span class="type-pct">{{ t.value }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Team Workload -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Team workload</div>
              <div class="card-sub">Monitor team capacity.</div>
            </div>
          </div>
          <div class="type-list">
            <div v-for="u in teamWorkload" :key="u.name" class="type-row">
              <div class="type-name">
                <div class="mini-avatar" :style="`background:${u.color}`">{{ u.initial }}</div>
                {{ u.name }}
              </div>
              <div class="type-bar-wrap">
                <div class="type-bar" :style="`width:${u.value}%;background:#4f46e5`"></div>
                <span class="type-pct">{{ u.value }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Epic Progress -->
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">Epic progress</div>
              <div class="card-sub">See how epics are progressing. <a href="#" class="link">View all</a></div>
            </div>
          </div>
          <div class="epic-legend">
            <span class="epic-dot" style="background:#22c55e"></span>Done
            <span class="epic-dot" style="background:#3b82f6;margin-left:12px"></span>In progress
            <span class="epic-dot" style="background:#e2e8f0;margin-left:12px"></span>To do
          </div>
          <div class="epic-list">
            <div v-for="e in epics" :key="e.id" class="epic-row">
              <div class="epic-name">
                <v-icon size="13" color="purple">mdi-flash</v-icon>
                {{ e.id }} {{ e.name }}
              </div>
              <div class="epic-bar-track">
                <div class="epic-seg" :style="`width:${e.done}%;background:#22c55e`">
                  <span v-if="e.done > 8">{{ e.done }}%</span>
                </div>
                <div class="epic-seg" :style="`width:${e.inProgress}%;background:#3b82f6`">
                  <span v-if="e.inProgress > 8">{{ e.inProgress }}%</span>
                </div>
                <div class="epic-seg" style="flex:1;background:#e2e8f0"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectHeader from '@/components/ProjectHeader.vue'

const filterOpen = ref(false)

const filterOptions = [
  { title: 'Assignee', value: 'assignee' },
  { title: 'Created', value: 'created' },
  { title: 'Due date', value: 'dueDate' },
  { title: 'Priority', value: 'priority' },
  { title: 'Status', value: 'status' },
  { title: 'Work type', value: 'workType' },
]

const stats = [
  { value: '3 completed', label: 'in the last 7 days', icon: 'mdi-check-circle-outline', color: '#16a34a', bg: '#dcfce7' },
  { value: '12 updated',  label: 'in the last 7 days', icon: 'mdi-update',               color: '#2563eb', bg: '#dbeafe' },
  { value: '7 created',   label: 'in the last 7 days', icon: 'mdi-file-plus-outline',    color: '#7c3aed', bg: '#ede9fe' },
  { value: '0 due soon',  label: 'in the next 7 days', icon: 'mdi-calendar-clock',       color: '#d97706', bg: '#fef3c7' },
]

const statusLegend = [
  { label: 'On Hold',       count: 28, color: '#D84315' },
  { label: 'Done',          count: 2,  color: '#4CAF50' },
  { label: 'ReOpen',        count: 3,  color: '#9C27B0' },
  { label: 'QA In Progress',count: 22, color: '#E91E63' },
  { label: 'In Progress',   count: 15, color: '#2196F3' },
  { label: 'Ready for QA',  count: 22, color: '#03A9F4' },
  { label: 'Known Issue',   count: 1,  color: '#5C6BC0' },
]

const priorityBars = [
  { label: 'Highest', pct: 0,  color: '#ef4444' },
  { label: 'High',    pct: 20, color: '#f97316' },
  { label: 'Medium',  pct: 75, color: '#94a3b8' },
  { label: 'Low',     pct: 0,  color: '#3b82f6' },
  { label: 'Lowest',  pct: 0,  color: '#6366f1' },
]

const workTypes = [
  { name: 'Task',    icon: 'mdi-check-box-outline', color: 'blue',     barColor: '#3b82f6', value: 58 },
  { name: 'Bug',     icon: 'mdi-circle-medium',     color: 'red',      barColor: '#ef4444', value: 31 },
  { name: 'Epic',    icon: 'mdi-flash',             color: 'purple',   barColor: '#8b5cf6', value: 5  },
  { name: 'Subtask', icon: 'mdi-file-tree',         color: 'blue-grey',barColor: '#64748b', value: 4  },
  { name: 'Story',   icon: 'mdi-bookmark',          color: 'green',    barColor: '#22c55e', value: 2  },
]

const teamWorkload = [
  { name: 'shiva.m',       initial: 'S',  color: '#fb923c', value: 23 },
  { name: 'Priya Rathore', initial: 'PR', color: '#f97316', value: 21 },
  { name: 'Yash R.',       initial: 'YR', color: '#3b82f6', value: 17 },
  { name: 'Piyush Kishor', initial: 'PK', color: '#0ea5e9', value: 4  },
  { name: 'Rahul Gupta',   initial: 'RG', color: '#6366f1', value: 1  },
]

const epics = [
  { id: 'AB-160', name: 'Aliceblue Online',  done: 91, inProgress: 4  },
  { id: 'AB-492', name: 'Aliceblue Next.JS', done: 76, inProgress: 17 },
  { id: 'AB-159', name: 'Trade School',      done: 94, inProgress: 2  },
]
</script>

<style scoped>
.overview-page {
  display: flex; flex-direction: column; height: 100%;
  font-family: 'Inter', sans-serif; background: #f8fafc; overflow: hidden;
}
.overview-body {
  flex: 1; overflow-y: auto; padding: 20px 24px 32px;
}

/* Toolbar */
.overview-toolbar { margin-bottom: 16px; position: relative; display: inline-block; }
.tool-btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px;
  border: 1px solid #e2e8f0; border-radius: 8px; background: #fff;
  font-size: 13px; font-weight: 500; color: #475569; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: background .12s;
}
.tool-btn:hover { background: #f1f5f9; }
.filter-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 50;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.1); padding: 10px; min-width: 220px;
}
.filter-search {
  width: 100%; padding: 7px 10px; border: 1px solid #e2e8f0; border-radius: 7px;
  font-size: 13px; outline: none; margin-bottom: 8px; font-family: 'Inter', sans-serif;
}
.filter-item {
  display: flex; align-items: center; gap: 8px; padding: 5px 4px;
  font-size: 13px; color: #374151; cursor: pointer;
}

/* Stat Cards */
.stat-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px;
}
.stat-card {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
  padding: 16px; display: flex; align-items: center; gap: 14px;
  animation: fadeUp .3s ease both;
}
.stat-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-value { font-size: 15px; font-weight: 700; color: #0f172a; }
.stat-label { font-size: 11.5px; color: #94a3b8; margin-top: 2px; }

/* Main Grid */
.main-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
}
.card {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
  padding: 20px; animation: fadeUp .35s ease both;
}
.span-2 { grid-column: span 2; }
.card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.card-sub { font-size: 12px; color: #94a3b8; margin-top: 2px; }
.link { color: #4f46e5; text-decoration: none; }
.link:hover { text-decoration: underline; }
.icon-btn {
  background: none; border: none; cursor: pointer; color: #94a3b8;
  font-size: 16px; padding: 2px 6px; border-radius: 6px;
}
.icon-btn:hover { background: #f1f5f9; }

/* Status */
.status-body { display: flex; align-items: center; justify-content: center; gap: 48px; }
.donut-wrap { flex-shrink: 0; }
.donut {
  width: 160px; height: 160px; border-radius: 50%;
  background: conic-gradient(
    #D84315 0deg 64deg, #4CAF50 64deg 69deg, #9C27B0 69deg 76deg,
    #E91E63 76deg 124deg, #2196F3 124deg 158deg, #03A9F4 158deg 196deg,
    #5C6BC0 196deg 198deg, #e2e8f0 198deg 360deg
  );
  display: flex; align-items: center; justify-content: center;
}
.donut-hole {
  width: 110px; height: 110px; border-radius: 50%; background: #fff;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.donut-num { font-size: 22px; font-weight: 800; color: #0f172a; }
.donut-lbl { font-size: 10px; color: #94a3b8; text-align: center; }
.legend-list { display: flex; flex-direction: column; gap: 8px; min-width: 200px; }
.legend-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #475569; }
.legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
.legend-text { flex: 1; min-width: 120px; }
.legend-count { font-weight: 600; color: #0f172a; }

/* Activity */
.activity-date { font-size: 11.5px; font-weight: 700; color: #94a3b8; margin-bottom: 14px; text-transform: uppercase; letter-spacing: .04em; }
.activity-item { display: flex; gap: 12px; }
.activity-avatar {
  width: 32px; height: 32px; border-radius: 50%; background: #fb923c;
  color: #fff; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.activity-content { flex: 1; }
.activity-text { font-size: 13px; color: #374151; line-height: 1.5; }
.activity-user { font-weight: 700; color: #4f46e5; cursor: pointer; }
.activity-action { color: #94a3b8; }
.activity-link { color: #4f46e5; cursor: pointer; }
.activity-link:hover { text-decoration: underline; }
.activity-time { font-size: 11.5px; color: #94a3b8; margin: 4px 0 8px; }
.activity-comment {
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 10px 12px; font-size: 13px; color: #374151;
}
.mention { background: #ede9fe; color: #4f46e5; padding: 1px 6px; border-radius: 4px; font-weight: 500; }
.status-chip { display: inline-block; padding: 1px 7px; border-radius: 4px; font-size: 10px; font-weight: 700; margin-left: 6px; }
.chip-green { background: #dcfce7; color: #16a34a; }

/* Priority Bar Chart */
.bar-chart { display: flex; align-items: flex-end; justify-content: space-around; height: 140px; padding-top: 8px; border-bottom: 2px solid #e2e8f0; margin-bottom: 8px; }
.bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
.bar-track { width: 32px; height: 110px; background: #f1f5f9; border-radius: 6px 6px 0 0; display: flex; align-items: flex-end; overflow: hidden; }
.bar-fill { width: 100%; border-radius: 6px 6px 0 0; transition: height .4s ease; min-height: 2px; }
.bar-label { font-size: 10px; color: #94a3b8; text-align: center; }

/* Type / Workload list */
.type-list { display: flex; flex-direction: column; gap: 10px; }
.type-row { display: flex; align-items: center; gap: 10px; }
.type-name { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #374151; width: 110px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.type-bar-wrap { flex: 1; display: flex; align-items: center; gap: 8px; }
.type-bar { height: 14px; border-radius: 4px; min-width: 2px; transition: width .4s ease; }
.type-pct { font-size: 11px; color: #94a3b8; white-space: nowrap; }
.mini-avatar { width: 22px; height: 22px; border-radius: 50%; color: #fff; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

/* Epic Progress */
.epic-legend { display: flex; align-items: center; font-size: 12px; color: #64748b; margin-bottom: 14px; }
.epic-dot { width: 10px; height: 10px; border-radius: 3px; display: inline-block; margin-right: 4px; }
.epic-list { display: flex; flex-direction: column; gap: 12px; }
.epic-row { font-weight: 600; }
.epic-name { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 5px; display: flex; align-items: center; gap: 4px; }
.epic-bar-track { display: flex; height: 16px; border-radius: 6px; overflow: hidden; background: #e2e8f0; }
.epic-seg { display: flex; align-items: center; justify-content: center; font-size: 10px; color: #fff; font-weight: 600; transition: width .4s ease; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (max-width: 900px) {
  .stat-grid { grid-template-columns: 1fr 1fr; }
  .main-grid { grid-template-columns: 1fr; }
  .span-2 { grid-column: span 1; }
  .status-body { flex-direction: column; align-items: flex-start; gap: 20px; }
}
@media (max-width: 600px) {
  .stat-grid { grid-template-columns: 1fr; }
  .overview-body { padding: 14px 14px 24px; }
}
</style>
