<template>
  <div class="timeline-page">
    <ProjectHeader active-tab="timeline" />

    <!-- Toolbar -->
    <div class="tl-toolbar">
      <div class="tl-toolbar-left">
        <div class="search-wrap">
          <v-icon size="14" color="#94a3b8" style="position:absolute;left:10px;top:50%;transform:translateY(-50%)">mdi-magnify</v-icon>
          <input class="search-input" placeholder="Search timeline..." />
        </div>
        <div class="avatar-chip">SB</div>
        <button class="tool-btn">Epic <v-icon size="12">mdi-chevron-down</v-icon></button>
      </div>
      <div class="tl-toolbar-right">
        <span class="quarter-label">Q4 2025</span>
        <div class="btn-group">
          <button class="grp-btn">Today</button>
          <button class="grp-btn grp-icon"><v-icon size="14">mdi-chevron-left</v-icon></button>
          <button class="grp-btn grp-icon"><v-icon size="14">mdi-chevron-right</v-icon></button>
        </div>
        <div class="btn-group">
          <button class="grp-btn">Weeks <v-icon size="12">mdi-chevron-down</v-icon></button>
        </div>
      </div>
    </div>

    <!-- Timeline Body -->
    <div class="tl-body">
      <!-- Left Sidebar -->
      <div class="tl-sidebar">
        <div class="sidebar-head">Title</div>
        <div class="sidebar-list">
          <div v-for="epic in epics" :key="epic.id" class="sidebar-epic-group">
            <!-- Epic row -->
            <div class="sidebar-row epic-row" @click="epic.expanded = !epic.expanded">
              <v-icon size="15" class="expand-icon">{{ epic.expanded ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
              <v-icon size="14" color="#8b5cf6">mdi-flash</v-icon>
              <span class="row-title">{{ epic.title }}</span>
              <span class="row-id">{{ epic.id }}</span>
            </div>
            <!-- Issue rows -->
            <template v-if="epic.expanded">
              <div v-for="issue in epic.issues" :key="issue.id" class="sidebar-row issue-row">
                <v-icon size="14" color="#3b82f6" style="margin-left:20px">mdi-check-box-outline</v-icon>
                <span class="row-title">{{ issue.title }}</span>
                <span class="row-id">{{ issue.id }}</span>
              </div>
              <div class="sidebar-row add-row">
                <v-icon size="14" style="margin-left:20px">mdi-plus</v-icon>
                <span>Create issue</span>
              </div>
            </template>
          </div>
          <div class="create-epic-btn">
            <v-icon size="14">mdi-plus</v-icon> Create epic
          </div>
        </div>
      </div>

      <!-- Gantt Chart -->
      <div class="gantt-wrap" ref="ganttContainer">
        <!-- Header -->
        <div class="gantt-header">
          <div class="gantt-months">
            <div v-for="m in months" :key="m.name" class="gantt-month" :style="`width:${m.width}px`">{{ m.name }}</div>
          </div>
          <div class="gantt-weeks">
            <div v-for="w in weeks" :key="w.date" class="gantt-week" :style="`width:${weekWidth}px`">
              <span>{{ w.date }}</span>
              <div v-if="w.isToday" class="today-line"></div>
              <div v-if="w.isToday" class="today-pill">Today</div>
            </div>
          </div>
        </div>

        <!-- Rows -->
        <div class="gantt-rows">
          <div v-for="epic in epics" :key="'g'+epic.id">
            <!-- Epic bar row -->
            <div class="gantt-row epic-gantt-row">
              <div v-for="w in weeks" :key="w.date" class="gantt-cell" :style="`width:${weekWidth}px`"></div>
              <div
                v-if="epic.startOffset !== null"
                class="gantt-bar epic-bar"
                :style="`left:${epic.startOffset}px;width:${epic.width}px;background:${epic.color}`"
              >{{ epic.title }}</div>
            </div>
            <!-- Issue rows -->
            <template v-if="epic.expanded">
              <div v-for="issue in epic.issues" :key="'gi'+issue.id" class="gantt-row issue-gantt-row">
                <div v-for="w in weeks" :key="w.date" class="gantt-cell" :style="`width:${weekWidth}px`"></div>
                <div
                  v-if="issue.startOffset !== null"
                  class="gantt-bar issue-bar"
                  :style="`left:${issue.startOffset}px;width:${issue.width}px;background:${issue.color}`"
                >{{ issue.title }}</div>
              </div>
              <div class="gantt-row add-gantt-row">
                <div v-for="w in weeks" :key="w.date" class="gantt-cell" :style="`width:${weekWidth}px`"></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProjectHeader from '@/components/ProjectHeader.vue'

const weekWidth = 64
const ganttContainer = ref<HTMLElement | null>(null)

const months = ref([
  { name: 'Nov 2025', width: weekWidth * 4 },
  { name: 'Dec 2025', width: weekWidth * 5 },
  { name: 'Jan 2026', width: weekWidth * 4 },
  { name: 'Feb 2026', width: weekWidth * 4 },
  { name: 'Mar 2026', width: weekWidth * 5 },
])

const weeks = ref([
  { date: '03' }, { date: '10' }, { date: '17' }, { date: '24' },
  { date: '01' }, { date: '08' }, { date: '15' }, { date: '22' }, { date: '29' },
  { date: '05' }, { date: '12' }, { date: '19' }, { date: '26', isToday: true },
  { date: '02' }, { date: '09' }, { date: '16' }, { date: '23' },
  { date: '02' }, { date: '09' }, { date: '16' }, { date: '23' }, { date: '30' },
])

const epics = ref([
  {
    id: 'AB-160', title: 'Aliceblue Online Platform Upgrade', expanded: true,
    color: '#7c3aed', startOffset: weekWidth * 1.5, width: weekWidth * 7.5,
    issues: [
      { id: 'AB-161', title: 'Database Migration Phase 1', startOffset: weekWidth * 1.5, width: weekWidth * 3,   color: '#3b82f6' },
      { id: 'AB-162', title: 'API Gateway Redesign',       startOffset: weekWidth * 4.5, width: weekWidth * 4.5, color: '#3b82f6' },
    ],
  },
  {
    id: 'AB-492', title: 'Aliceblue Next.JS Refactor', expanded: false,
    color: '#4f46e5', startOffset: weekWidth * 8.5, width: weekWidth * 6.5,
    issues: [
      { id: 'AB-493', title: 'Component Library Setup',        startOffset: weekWidth * 8.5, width: weekWidth * 2.5, color: '#22c55e' },
      { id: 'AB-494', title: 'Authentication Flow transition', startOffset: weekWidth * 11,  width: weekWidth * 4,   color: '#3b82f6' },
    ],
  },
  {
    id: 'AB-159', title: 'Trade School integration', expanded: false,
    color: '#0891b2', startOffset: weekWidth * 5, width: weekWidth * 12,
    issues: [
      { id: 'AB-180', title: 'Identify partners', startOffset: weekWidth * 5, width: weekWidth * 3, color: '#f97316' },
    ],
  },
])

onMounted(() => {
  if (ganttContainer.value) {
    const todayIdx = weeks.value.findIndex(w => w.isToday)
    if (todayIdx > -1)
      ganttContainer.value.scrollLeft = Math.max(0, todayIdx * weekWidth - ganttContainer.value.clientWidth / 2)
  }
})
</script>

<style scoped>
.timeline-page {
  display: flex; flex-direction: column; height: 100%;
  font-family: 'Inter', sans-serif; background: #f8fafc; overflow: hidden;
}

/* Toolbar */
.tl-toolbar {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  padding: 10px 20px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
}
.tl-toolbar-left, .tl-toolbar-right { display: flex; align-items: center; gap: 8px; }
.search-wrap { position: relative; }
.search-input {
  padding: 6px 10px 6px 30px; border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; color: #1e293b; background: #f8fafc; outline: none; width: 200px;
  font-family: 'Inter', sans-serif;
}
.search-input:focus { border-color: #4f46e5; background: #fff; }
.avatar-chip {
  width: 30px; height: 30px; border-radius: 50%; background: #818cf8;
  color: #fff; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.tool-btn {
  display: inline-flex; align-items: center; gap: 4px; padding: 5px 12px;
  border: 1px solid #e2e8f0; border-radius: 8px; background: #fff;
  font-size: 12.5px; color: #475569; cursor: pointer; font-family: 'Inter', sans-serif;
}
.tool-btn:hover { background: #f1f5f9; }
.quarter-label { font-size: 12.5px; font-weight: 600; color: #475569; }
.btn-group { display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.grp-btn {
  display: inline-flex; align-items: center; gap: 3px; padding: 5px 12px;
  border: none; background: #fff; font-size: 12.5px; color: #475569;
  cursor: pointer; font-family: 'Inter', sans-serif; border-right: 1px solid #e2e8f0;
  transition: background .12s;
}
.grp-btn:last-child { border-right: none; }
.grp-btn:hover { background: #f1f5f9; }
.grp-icon { padding: 5px 8px; }

/* Body */
.tl-body { flex: 1; display: flex; overflow: hidden; }

/* Sidebar */
.tl-sidebar {
  width: 300px; min-width: 300px; background: #fff;
  border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; overflow: hidden;
}

@media (max-width: 768px) {
  .tl-sidebar { display: none; }
  .tl-toolbar { flex-wrap: wrap; }
  .tl-toolbar-left, .tl-toolbar-right { flex-wrap: wrap; }
  .search-input { width: 140px; }
}
.sidebar-head {
  padding: 12px 16px; font-size: 12px; font-weight: 700; color: #64748b;
  border-bottom: 1px solid #e2e8f0; height: 80px; display: flex; align-items: flex-end;
}
.sidebar-list { overflow-y: auto; flex: 1; }
.sidebar-row {
  display: flex; align-items: center; gap: 6px; padding: 0 12px;
  height: 44px; cursor: pointer; transition: background .1s; border-bottom: 1px solid #f1f5f9;
}
.sidebar-row:hover { background: #f8fafc; }
.epic-row { height: 48px; font-weight: 600; }
.issue-row { height: 44px; }
.add-row { color: #94a3b8; font-size: 12.5px; }
.expand-icon { color: #94a3b8; flex-shrink: 0; }
.row-title { flex: 1; font-size: 13px; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row-id { font-size: 11px; color: #94a3b8; background: #f1f5f9; padding: 1px 6px; border-radius: 8px; flex-shrink: 0; }
.create-epic-btn {
  display: flex; align-items: center; gap: 6px; padding: 12px 16px;
  font-size: 13px; color: #94a3b8; cursor: pointer;
}
.create-epic-btn:hover { color: #4f46e5; }

/* Gantt */
.gantt-wrap {
  flex: 1; overflow: auto; position: relative; background: #f8fafc;
}
.gantt-header {
  position: sticky; top: 0; z-index: 10; background: #fff;
  border-bottom: 1px solid #e2e8f0;
}
.gantt-months { display: flex; border-bottom: 1px solid #e2e8f0; }
.gantt-month {
  flex-shrink: 0; height: 32px; display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; color: #475569; border-right: 1px solid #e2e8f0;
}
.gantt-weeks { display: flex; }
.gantt-week {
  flex-shrink: 0; height: 32px; display: flex; align-items: center; justify-content: center;
  font-size: 11.5px; color: #94a3b8; border-right: 1px solid #f1f5f9;
  position: relative;
}
.today-line {
  position: absolute; top: 0; bottom: -9999px; width: 2px;
  background: #4f46e5; left: 50%; transform: translateX(-50%); z-index: 5;
}
.today-pill {
  position: absolute; top: -2px; left: 50%; transform: translateX(-50%);
  background: #4f46e5; color: #fff; font-size: 9px; font-weight: 700;
  padding: 1px 6px; border-radius: 8px; white-space: nowrap; z-index: 6;
}

/* Gantt rows */
.gantt-rows { position: relative; }
.gantt-row {
  display: flex; position: relative; border-bottom: 1px solid #f1f5f9;
}
.epic-gantt-row { height: 48px; }
.issue-gantt-row { height: 44px; }
.add-gantt-row   { height: 44px; }
.gantt-cell {
  flex-shrink: 0; height: 100%; border-right: 1px solid #f1f5f9;
}
.gantt-row:hover { background: rgba(79,70,229,.03); }

.gantt-bar {
  position: absolute; top: 50%; transform: translateY(-50%);
  height: 24px; border-radius: 6px; display: flex; align-items: center;
  padding: 0 10px; font-size: 11px; font-weight: 600; color: #fff;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  box-shadow: 0 2px 6px rgba(0,0,0,.12); cursor: pointer;
  transition: filter .15s, transform .15s;
}
.gantt-bar:hover { filter: brightness(.9); transform: translateY(calc(-50% - 1px)); }
.epic-bar  { height: 26px; border-radius: 8px; }
.issue-bar { height: 20px; opacity: .9; }
</style>
