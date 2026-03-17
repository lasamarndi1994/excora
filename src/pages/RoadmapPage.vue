<template>
  <div class="roadmap-root">

    <!-- Header -->
    <div class="roadmap-header">
      <div>
        <h1 class="roadmap-title">Roadmap</h1>
        <p class="roadmap-sub">Track epics and milestones across time</p>
      </div>
      <div class="header-right">
        <div class="view-toggle">
          <button v-for="v in views" :key="v" class="vt-btn" :class="{ active: viewMode === v }" @click="viewMode = v">{{ v }}</button>
        </div>
        <button class="hdr-btn"><v-icon size="13">mdi-filter-variant</v-icon> Filter</button>
        <button class="hdr-btn hdr-btn--primary"><v-icon size="13">mdi-plus</v-icon> Create Epic</button>
      </div>
    </div>

    <!-- Legend + controls -->
    <div class="roadmap-controls">
      <div class="legend">
        <div v-for="epic in epics" :key="epic.id" class="legend-item">
          <span class="legend-dot" :style="{ background: epic.color }"></span>
          <span>{{ epic.name }}</span>
        </div>
      </div>
      <div class="controls-right">
        <button class="ctrl-btn" @click="scrollLeft"><v-icon size="14">mdi-chevron-left</v-icon></button>
        <span class="ctrl-label">{{ months[0] }} – {{ months[months.length - 1] }}</span>
        <button class="ctrl-btn" @click="scrollRight"><v-icon size="14">mdi-chevron-right</v-icon></button>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline-wrap" ref="timelineRef">
      <div class="timeline-inner" :style="{ minWidth: timelineWidth + 'px' }">

        <!-- Month headers -->
        <div class="tl-header-row">
          <div class="tl-sidebar-cell tl-hdr-cell">Epics</div>
          <div class="tl-months">
            <div v-for="month in months" :key="month" class="tl-month-cell">{{ month }}</div>
          </div>
        </div>

        <!-- Today line -->
        <div class="today-line" :style="{ left: todayLeft + 'px' }">
          <div class="today-label">Today</div>
        </div>

        <!-- Epic rows -->
        <div v-for="(epic, ei) in epics" :key="epic.id"
          class="tl-row" :class="{ 'tl-row--alt': ei % 2 === 1 }">
          <div class="tl-sidebar-cell">
            <div class="epic-sidebar">
              <div class="epic-dot" :style="{ background: epic.color }"></div>
              <div class="epic-info">
                <div class="epic-name">{{ epic.name }}</div>
                <div class="epic-meta">{{ epic.tasks }} tasks · {{ epic.progress }}%</div>
              </div>
              <span class="epic-status-chip" :class="`es-${epic.statusType}`">{{ epic.status }}</span>
            </div>
          </div>
          <div class="tl-track">
            <!-- Grid lines -->
            <div v-for="(_, mi) in months" :key="mi" class="tl-grid-line" :style="{ left: (mi / months.length * 100) + '%' }"></div>
            <!-- Bar -->
            <div class="tl-bar"
              :style="{
                left: epic.startPct + '%',
                width: epic.widthPct + '%',
                background: epic.color,
              }"
              @mouseenter="hoveredEpic = epic.id"
              @mouseleave="hoveredEpic = null">
              <span class="tl-bar-label">{{ epic.summary }}</span>
              <!-- Tooltip -->
              <div v-if="hoveredEpic === epic.id" class="tl-tooltip">
                <div class="tt-title">{{ epic.name }}</div>
                <div class="tt-row"><span>Start</span><span>{{ epic.startLabel }}</span></div>
                <div class="tt-row"><span>End</span><span>{{ epic.endLabel }}</span></div>
                <div class="tt-row"><span>Progress</span><span>{{ epic.progress }}%</span></div>
                <div class="tt-prog"><div class="tt-prog-fill" :style="{ width: epic.progress + '%', background: epic.color }"></div></div>
              </div>
            </div>
            <!-- Milestone markers -->
            <div v-for="ms in epic.milestones" :key="ms.label"
              class="tl-milestone" :style="{ left: ms.pct + '%' }"
              :title="ms.label">
              <v-icon size="12" color="white">mdi-diamond</v-icon>
            </div>
          </div>
        </div>

        <!-- Add epic row -->
        <div class="tl-add-row">
          <button class="tl-add-btn"><v-icon size="13">mdi-plus</v-icon> Create epic</button>
        </div>

      </div>
    </div>

    <!-- Summary cards -->
    <div class="summary-row">
      <div v-for="card in summaryCards" :key="card.label" class="summary-card">
        <div class="sum-icon" :style="{ background: card.iconBg }">
          <v-icon size="16" :color="card.iconColor">{{ card.icon }}</v-icon>
        </div>
        <div class="sum-val">{{ card.value }}</div>
        <div class="sum-label">{{ card.label }}</div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
const viewMode    = ref('Months')
const views       = ['Weeks', 'Months', 'Quarters']
const hoveredEpic = ref<string | null>(null)
const timelineRef = ref<HTMLElement | null>(null)
const timelineWidth = 900

const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

const todayLeft = computed(() => {
  // Place today marker at ~55% for demo
  return 250 + timelineWidth * 0.55
})

function scrollLeft()  { if (timelineRef.value) timelineRef.value.scrollLeft -= 200 }
function scrollRight() { if (timelineRef.value) timelineRef.value.scrollLeft += 200 }

const epics = [
  {
    id: 'e1', name: 'EKYC V2 Rollout', summary: 'EKYC V2',
    color: '#6366f1', startPct: 5, widthPct: 38, progress: 72,
    tasks: 14, status: 'In Progress', statusType: 'info',
    startLabel: 'Oct 1', endLabel: 'Dec 15',
    milestones: [{ label: 'Beta launch', pct: 20 }, { label: 'GA', pct: 38 }],
  },
  {
    id: 'e2', name: 'Partner Dashboard', summary: 'Partner Dash',
    color: '#a855f7', startPct: 45, widthPct: 35, progress: 40,
    tasks: 9, status: 'In Progress', statusType: 'info',
    startLabel: 'Nov 10', endLabel: 'Feb 28',
    milestones: [{ label: 'Design freeze', pct: 55 }],
  },
  {
    id: 'e3', name: 'Performance Dashboard', summary: 'Perf Dash',
    color: '#10b981', startPct: 15, widthPct: 50, progress: 55,
    tasks: 11, status: 'On Track', statusType: 'success',
    startLabel: 'Oct 20', endLabel: 'Mar 10',
    milestones: [{ label: 'v1 release', pct: 40 }, { label: 'v2', pct: 65 }],
  },
  {
    id: 'e4', name: 'Mobile App V2', summary: 'Mobile V2',
    color: '#f59e0b', startPct: 60, widthPct: 30, progress: 15,
    tasks: 7, status: 'Planned', statusType: 'warn',
    startLabel: 'Jan 5', endLabel: 'Mar 31',
    milestones: [],
  },
  {
    id: 'e5', name: 'API Rate Limiting', summary: 'API Limits',
    color: '#ef4444', startPct: 2, widthPct: 20, progress: 90,
    tasks: 5, status: 'At Risk', statusType: 'danger',
    startLabel: 'Oct 1', endLabel: 'Nov 20',
    milestones: [{ label: 'Deploy', pct: 20 }],
  },
]

const summaryCards = [
  { label: 'Total Epics',    value: epics.length,                                    icon: 'mdi-lightning-bolt',       iconBg: '#eef2ff', iconColor: '#4f46e5' },
  { label: 'In Progress',    value: epics.filter(e => e.statusType === 'info').length, icon: 'mdi-progress-clock',      iconBg: '#eff6ff', iconColor: '#3b82f6' },
  { label: 'On Track',       value: epics.filter(e => e.statusType === 'success').length, icon: 'mdi-check-circle-outline', iconBg: '#f0fdf4', iconColor: '#10b981' },
  { label: 'At Risk',        value: epics.filter(e => e.statusType === 'danger').length,  icon: 'mdi-alert-circle-outline', iconBg: '#fef2f2', iconColor: '#ef4444' },
  { label: 'Avg Progress',   value: Math.round(epics.reduce((s, e) => s + e.progress, 0) / epics.length) + '%', icon: 'mdi-chart-line', iconBg: '#faf5ff', iconColor: '#a855f7' },
]
</script>

<style scoped>
.roadmap-root {
  display: flex; flex-direction: column; height: 100%; overflow: hidden;
  font-family: 'Inter', sans-serif; font-size: 13px; color: #1e293b; background: #f8fafc;
}

/* Header */
.roadmap-header {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  padding: 16px 24px 12px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
}
.roadmap-title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
.roadmap-sub { font-size: 12px; color: #94a3b8; margin: 0; }
.header-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.view-toggle { display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.vt-btn { padding: 6px 12px; border: none; background: #fff; font-size: 12px; font-weight: 500; color: #64748b; cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s, color .12s; }
.vt-btn.active { background: #eef2ff; color: #4f46e5; font-weight: 600; }
.hdr-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px;
  border-radius: 8px; border: 1px solid #e2e8f0; background: #fff;
  font-size: 12.5px; font-weight: 500; color: #475569;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s;
}
.hdr-btn--primary { background: #4f46e5; border-color: #4f46e5; color: #fff; box-shadow: 0 2px 8px rgba(79,70,229,.25); }
.hdr-btn--primary:hover { background: #4338ca; }

/* Controls */
.roadmap-controls {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
  padding: 10px 24px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
}
.legend { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #475569; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.controls-right { display: flex; align-items: center; gap: 8px; }
.ctrl-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; color: #475569; cursor: pointer; transition: background .12s; }
.ctrl-btn:hover { background: #f1f5f9; }
.ctrl-label { font-size: 12px; font-weight: 600; color: #475569; min-width: 120px; text-align: center; }

/* Timeline */
.timeline-wrap { flex: 1; overflow: auto; position: relative; }
.timeline-inner { position: relative; }

.tl-header-row { display: flex; position: sticky; top: 0; z-index: 10; background: #fff; border-bottom: 1px solid #e2e8f0; }
.tl-sidebar-cell { width: 250px; min-width: 250px; flex-shrink: 0; padding: 10px 16px; border-right: 1px solid #e2e8f0; }
.tl-hdr-cell { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; display: flex; align-items: center; }
.tl-months { flex: 1; display: flex; }
.tl-month-cell { flex: 1; text-align: center; padding: 10px 0; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .04em; border-right: 1px solid #f1f5f9; }

/* Today line */
.today-line { position: absolute; top: 40px; bottom: 0; width: 2px; background: #ef4444; z-index: 5; pointer-events: none; }
.today-label { position: absolute; top: -6px; left: 50%; transform: translateX(-50%); background: #ef4444; color: #fff; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 4px; white-space: nowrap; }

/* Rows */
.tl-row { display: flex; border-bottom: 1px solid #f1f5f9; min-height: 56px; }
.tl-row--alt { background: #fafbfc; }
.tl-row:hover { background: #f8fafc; }

.epic-sidebar { display: flex; align-items: center; gap: 8px; height: 100%; }
.epic-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.epic-info { flex: 1; min-width: 0; }
.epic-name { font-size: 12.5px; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.epic-meta { font-size: 10.5px; color: #94a3b8; margin-top: 1px; }
.epic-status-chip { font-size: 10px; font-weight: 600; padding: 1px 7px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
.es-info    { background: #eff6ff; color: #2563eb; }
.es-success { background: #f0fdf4; color: #16a34a; }
.es-warn    { background: #fffbeb; color: #d97706; }
.es-danger  { background: #fef2f2; color: #ef4444; }

.tl-track { flex: 1; position: relative; overflow: visible; }
.tl-grid-line { position: absolute; top: 0; bottom: 0; width: 1px; background: #f1f5f9; }

.tl-bar {
  position: absolute; top: 50%; transform: translateY(-50%);
  height: 28px; border-radius: 6px; min-width: 40px;
  display: flex; align-items: center; padding: 0 10px;
  cursor: pointer; z-index: 2;
  box-shadow: 0 2px 8px rgba(0,0,0,.12);
  transition: filter .15s, box-shadow .15s;
}
.tl-bar:hover { filter: brightness(1.08); box-shadow: 0 4px 16px rgba(0,0,0,.18); }
.tl-bar-label { font-size: 11px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Tooltip */
.tl-tooltip {
  position: absolute; bottom: calc(100% + 8px); left: 0;
  background: #1e293b; color: #fff; border-radius: 10px;
  padding: 10px 12px; min-width: 160px; z-index: 20;
  box-shadow: 0 8px 24px rgba(0,0,0,.2);
  pointer-events: none;
}
.tt-title { font-size: 12px; font-weight: 700; margin-bottom: 6px; }
.tt-row { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; margin-bottom: 3px; }
.tt-row span:last-child { color: #fff; font-weight: 500; }
.tt-prog { height: 4px; background: rgba(255,255,255,.2); border-radius: 99px; overflow: hidden; margin-top: 6px; }
.tt-prog-fill { height: 100%; border-radius: 99px; }

/* Milestone */
.tl-milestone {
  position: absolute; top: 50%; transform: translate(-50%, -50%);
  width: 18px; height: 18px; border-radius: 4px; z-index: 3;
  background: rgba(0,0,0,.35); display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}

/* Add row */
.tl-add-row { padding: 8px 16px; border-bottom: 1px solid #f1f5f9; }
.tl-add-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 7px; border: 1px dashed #e2e8f0; background: none; font-size: 12px; color: #94a3b8; cursor: pointer; font-family: 'Inter', sans-serif; transition: border-color .12s, color .12s; }
.tl-add-btn:hover { border-color: #a5b4fc; color: #4f46e5; }

/* Summary cards */
.summary-row { display: flex; gap: 0; border-top: 1px solid #e2e8f0; background: #fff; flex-shrink: 0; overflow-x: auto; }
.summary-card { flex: 1; min-width: 100px; display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-right: 1px solid #e2e8f0; }
.summary-card:last-child { border-right: none; }
.sum-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sum-val { font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1; }
.sum-label { font-size: 11px; color: #94a3b8; margin-top: 2px; }

@media (max-width: 768px) {
  .tl-sidebar-cell { width: 160px; min-width: 160px; }
  .roadmap-header { padding: 12px 16px 10px; }
  .roadmap-controls { padding: 8px 16px; }
}
</style>
