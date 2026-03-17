<template>
  <div class="sprint-page">
    <ProjectHeader active-tab="sprint" />

    <!-- Sprint List View -->
    <template v-if="!selectedSprint">
      <div class="sp-toolbar">
        <div class="sp-toolbar-left">
          <h1 class="sp-title">Sprints</h1>
          <div class="filter-tabs">
            <button
              v-for="f in ['All','Draft','Active','Completed']" :key="f"
              class="filter-tab" :class="{ active: activeFilter === f }"
              @click="activeFilter = f"
            >{{ f }}</button>
          </div>
        </div>
        <div class="sp-toolbar-right">
          <div class="search-wrap">
            <v-icon size="14" color="#94a3b8" style="position:absolute;left:10px;top:50%;transform:translateY(-50%)">mdi-magnify</v-icon>
            <input v-model="searchQuery" class="search-input" placeholder="Search sprints..." />
          </div>
          <button class="btn-primary" @click="isAddDialogOpen = true">
            <v-icon size="13">mdi-plus</v-icon> New Sprint
          </button>
        </div>
      </div>

      <div class="sp-body">
        <div class="sp-table-wrap">
          <table class="sp-table">
            <thead>
              <tr>
                <th>Sprint title</th>
                <th>Status</th>
                <th>Start date</th>
                <th>End date</th>
                <th>Tasks</th>
                <th>Progress</th>
                <th style="text-align:center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="sprint in filteredSprints" :key="sprint.id"
                class="sp-row" @click="selectSprint(sprint)"
              >
                <td class="sp-name">{{ sprint.name }}</td>
                <td>
                  <span class="status-chip" :class="`status-${sprint.status.toLowerCase()}`">
                    {{ sprint.status }}
                  </span>
                </td>
                <td class="sp-date">{{ sprint.startDate }}</td>
                <td class="sp-date">{{ sprint.endDate }}</td>
                <td class="sp-date">{{ getTaskCount(sprint) }}/{{ sprint.taskCount }}</td>
                <td style="min-width:160px">
                  <div class="progress-row">
                    <div class="progress-track">
                      <div class="progress-fill" :style="`width:${sprint.progress}%;background:${getProgressColor(sprint.progress)}`"></div>
                    </div>
                    <span class="progress-pct">{{ sprint.progress }}%</span>
                  </div>
                </td>
                <td style="text-align:center">
                  <button class="icon-btn" @click.stop="openEditDialog(sprint)"><v-icon size="15">mdi-pencil-outline</v-icon></button>
                  <button class="icon-btn" @click.stop="openDeleteDialog(sprint)"><v-icon size="15">mdi-trash-can-outline</v-icon></button>
                </td>
              </tr>
              <tr v-if="filteredSprints.length === 0">
                <td colspan="7" class="empty-row">No sprints found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination-row">
          <span class="page-info">Showing {{ filteredSprints.length }} sprints</span>
          <div class="page-btns">
            <button class="page-btn">‹ Prev</button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <button class="page-btn">Next ›</button>
          </div>
        </div>
      </div>
    </template>

    <!-- Active Sprint Detail View -->
    <template v-else>
      <div class="sp-detail-header">
        <div class="detail-left">
          <button class="back-btn" @click="selectedSprint = null"><v-icon size="16">mdi-arrow-left</v-icon></button>
          <div>
            <div class="detail-title">{{ selectedSprint.name }}</div>
            <div class="detail-sub">Active Sprint</div>
          </div>
          <span class="status-chip status-active">Active</span>
        </div>
        <button class="btn-outline">End Sprint</button>
      </div>

      <div class="sp-detail-body">
        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Total Tasks</div>
            <div class="kpi-value">{{ store.issues.filter(i => i.sprintId === selectedSprint?.id).length }}</div>
            <div class="kpi-ring">
              <svg viewBox="0 0 36 36" width="56" height="56">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" stroke-width="3"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke="#4f46e5" stroke-width="3"
                  stroke-dasharray="94.2" :stroke-dashoffset="94.2 - (94.2 * selectedSprint.progress / 100)"
                  stroke-linecap="round" transform="rotate(-90 18 18)"/>
                <text x="18" y="22" text-anchor="middle" font-size="7" font-weight="700" fill="#4f46e5">{{ selectedSprint.progress }}%</text>
              </svg>
            </div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Completed</div>
            <div class="kpi-value">{{ store.issues.filter(i => i.sprintId === selectedSprint?.id && i.status === 'DONE').length }}</div>
            <div class="kpi-icon kpi-green"><v-icon size="20" color="#16a34a">mdi-check-circle</v-icon></div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Remaining Hours</div>
            <div class="kpi-value kpi-warn">40h <v-icon size="16" color="#ef4444">mdi-alert-outline</v-icon></div>
            <div class="kpi-meta">
              <div class="kpi-meta-row"><span class="dot dot-blue"></span>Ideal: <strong>35h</strong></div>
              <div class="kpi-meta-row"><span class="dot dot-red"></span><span style="color:#ef4444">Behind: <strong>38h</strong></span></div>
            </div>
          </div>
        </div>

        <!-- Burndown Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">Burndown Chart</div>
            <div class="chart-legend">
              <span class="legend-line dashed"></span> Ideal
              <span class="legend-line solid" style="margin-left:16px"></span> Actual
            </div>
          </div>
          <div class="burndown-chart">
            <div class="y-labels">
              <span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
            </div>
            <div class="chart-area">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="100" y2="100" stroke="#4f46e5" stroke-width=".5" stroke-dasharray="2 2" opacity=".5"/>
                <polyline points="0,0 15,10 30,25 45,15 60,35 75,25 85,75 100,90"
                  fill="none" stroke="#ef4444" stroke-width=".8" stroke-linejoin="round"/>
              </svg>
              <div class="x-labels">
                <span v-for="d in 14" :key="d">{{ d }}</span>
              </div>
            </div>
          </div>
          <div class="chart-x-title">Days</div>
        </div>

        <!-- Sprint Board -->
        <div class="board-section-title">Sprint Board</div>
        <div class="board-columns">
          <div v-for="col in boardCols" :key="col.status" class="board-col">
            <div class="col-header">
              <span class="col-dot" :style="`background:${col.color}`"></span>
              <span class="col-title">{{ col.label }}</span>
              <span class="col-count">{{ getColIssues(col.status).length }}</span>
            </div>
            <div class="col-cards">
              <div
                v-for="issue in getColIssues(col.status)" :key="issue.id"
                class="issue-card" @click="openIssueDetails(issue)"
              >
                <div class="issue-key">{{ issue.key }}</div>
                <div class="issue-summary">{{ issue.summary }}</div>
                <div class="issue-meta">
                  <span class="priority-dot" :style="`background:${priorityColor(issue.priority)}`"></span>
                  <span class="issue-type">{{ issue.type }}</span>
                </div>
              </div>
              <div v-if="getColIssues(col.status).length === 0" class="col-empty">No tasks</div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Dialogs -->
    <IssueDetailsDialog v-model="isDetailsOpen" :issue="selectedIssue" />
    <CreateSprintDialog v-model="isAddDialogOpen" @save="saveNewSprint" />
    <EditSprintDialog   v-model="isEditDialogOpen" :sprint="sprintToEdit" @save="saveSprintEdit" />
    <DeleteSprintDialog v-model="isDeleteDialogOpen" :sprint="sprintToDelete" @confirm="confirmDeleteSprint" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import ProjectHeader from '@/components/ProjectHeader.vue'
import IssueDetailsDialog from '@/components/IssueDetailsDialog.vue'
import CreateSprintDialog from './components/CreateSprintDialog.vue'
import EditSprintDialog   from './components/EditSprintDialog.vue'
import DeleteSprintDialog from './components/DeleteSprintDialog.vue'
import type { Sprint, Issue } from '@/stores/taskStore'

const store = useTaskStore()
const activeFilter  = ref('All')
const searchQuery   = ref('')
const selectedSprint = ref<Sprint | null>(null)

const filteredSprints = computed(() => {
  let list = store.sprints
  if (activeFilter.value !== 'All') list = list.filter(s => s.status === activeFilter.value)
  if (searchQuery.value) list = list.filter(s => s.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  return list
})

const getTaskCount = (s: Sprint) => store.issues.filter(i => i.sprintId === s.id).length
const selectSprint = (s: Sprint) => { selectedSprint.value = s }
const getProgressColor = (p: number) => p === 100 ? '#22c55e' : p === 0 ? '#e2e8f0' : '#4f46e5'

const boardCols = [
  { label: 'To Do',       status: 'TODO',        color: '#94a3b8' },
  { label: 'In Progress', status: 'IN_PROGRESS',  color: '#3b82f6' },
  { label: 'Done',        status: 'DONE',         color: '#22c55e' },
]
const getColIssues = (status: string) =>
  store.issues.filter(i => i.sprintId === selectedSprint.value?.id && i.status === status)

const priorityColor = (p: string) =>
  ({ High: '#ef4444', Medium: '#f97316', Low: '#22c55e' }[p] ?? '#94a3b8')

const isDetailsOpen  = ref(false)
const selectedIssue  = ref<Issue | null>(null)
const openIssueDetails = (issue: Issue) => { selectedIssue.value = issue; isDetailsOpen.value = true }

const isAddDialogOpen = ref(false)
const saveNewSprint = (data: Omit<Sprint, 'id' | 'taskCount' | 'progress'>) => {
  store.addSprint(data); isAddDialogOpen.value = false
}

const isEditDialogOpen = ref(false)
const sprintToEdit     = ref<Sprint | null>(null)
const openEditDialog   = (s: Sprint) => { sprintToEdit.value = s; isEditDialogOpen.value = true }
const saveSprintEdit   = (id: string, data: Partial<Sprint>) => { store.updateSprint(id, data); isEditDialogOpen.value = false }

const isDeleteDialogOpen = ref(false)
const sprintToDelete     = ref<Sprint | null>(null)
const openDeleteDialog   = (s: Sprint) => { sprintToDelete.value = s; isDeleteDialogOpen.value = true }
const confirmDeleteSprint = (id: string) => { store.deleteSprint(id); isDeleteDialogOpen.value = false; sprintToDelete.value = null }
</script>

<style scoped>
.sprint-page {
  display: flex; flex-direction: column; height: 100%;
  font-family: 'Inter', sans-serif; background: #f8fafc; overflow: hidden;
}

/* Toolbar */
.sp-toolbar {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
  padding: 14px 24px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
}
.sp-toolbar-left { display: flex; align-items: center; gap: 16px; }
.sp-title { font-size: 17px; font-weight: 800; color: #0f172a; margin: 0; }
.filter-tabs { display: flex; gap: 4px; }
.filter-tab {
  padding: 5px 12px; border-radius: 20px; border: 1px solid #e2e8f0;
  background: #fff; font-size: 12.5px; font-weight: 500; color: #64748b;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: all .12s;
}
.filter-tab:hover { background: #f1f5f9; }
.filter-tab.active { background: #ede9fe; border-color: #c4b5fd; color: #4f46e5; font-weight: 600; }
.sp-toolbar-right { display: flex; align-items: center; gap: 10px; }
.search-wrap { position: relative; }
.search-input {
  padding: 7px 10px 7px 30px; border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; color: #1e293b; background: #f8fafc; outline: none; width: 220px;
  font-family: 'Inter', sans-serif; transition: border-color .12s;
}
.search-input:focus { border-color: #4f46e5; background: #fff; }
.btn-primary {
  display: inline-flex; align-items: center; gap: 5px; padding: 8px 16px;
  background: #4f46e5; color: #fff; border: none; border-radius: 8px;
  font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif;
  transition: background .12s;
}
.btn-primary:hover { background: #4338ca; }
.btn-outline {
  padding: 7px 16px; border: 1px solid #e2e8f0; border-radius: 8px;
  background: #fff; font-size: 13px; font-weight: 500; color: #475569;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s;
}
.btn-outline:hover { background: #f1f5f9; }

/* Table */
.sp-body { flex: 1; overflow-y: auto; padding: 20px 24px; }
.sp-table-wrap { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: auto; }
.sp-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 600px; }
.sp-table thead tr { background: #f8fafc; }
.sp-table th {
  padding: 11px 14px; text-align: left; font-size: 12px; font-weight: 600;
  color: #64748b; border-bottom: 1px solid #e2e8f0; white-space: nowrap;
}
.sp-row { cursor: pointer; transition: background .1s; }
.sp-row:hover { background: #f8fafc; }
.sp-table td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
.sp-table tbody tr:last-child td { border-bottom: none; }
.sp-name { font-weight: 600; color: #0f172a; }
.sp-date { color: #64748b; }
.empty-row { text-align: center; color: #94a3b8; padding: 32px !important; }

.status-chip {
  display: inline-block; padding: 3px 10px; border-radius: 20px;
  font-size: 11.5px; font-weight: 600;
}
.status-draft     { background: #dbeafe; color: #1d4ed8; }
.status-active    { background: #dcfce7; color: #15803d; }
.status-completed { background: #f0fdf4; color: #16a34a; }

.progress-row { display: flex; align-items: center; gap: 8px; }
.progress-track { flex: 1; height: 6px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
.progress-fill  { height: 100%; border-radius: 4px; transition: width .3s; }
.progress-pct   { font-size: 11.5px; color: #64748b; white-space: nowrap; min-width: 32px; }

.icon-btn {
  width: 28px; height: 28px; border-radius: 6px; border: none; background: none;
  color: #94a3b8; cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
  transition: background .12s, color .12s;
}
.icon-btn:hover { background: #f1f5f9; color: #4f46e5; }

.pagination-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 16px; font-size: 13px;
}
.page-info { color: #94a3b8; }
.page-btns { display: flex; gap: 4px; }
.page-btn {
  padding: 5px 10px; border: 1px solid #e2e8f0; border-radius: 6px;
  background: #fff; font-size: 12.5px; color: #475569; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: all .12s;
}
.page-btn:hover { background: #f1f5f9; }
.page-btn.active { background: #4f46e5; border-color: #4f46e5; color: #fff; font-weight: 600; }

/* Detail View */
.sp-detail-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 24px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
}
.detail-left { display: flex; align-items: center; gap: 12px; }
.back-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid #e2e8f0;
  background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #475569; transition: background .12s;
}
.back-btn:hover { background: #f1f5f9; }
.detail-title { font-size: 15px; font-weight: 700; color: #0f172a; }
.detail-sub   { font-size: 12px; color: #94a3b8; }

.sp-detail-body { flex: 1; overflow-y: auto; padding: 20px 24px; }

/* KPI */
.kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
@media (max-width: 640px) {
  .kpi-grid { grid-template-columns: 1fr; }
  .sp-toolbar { padding: 10px 16px; }
  .sp-toolbar-left { flex-wrap: wrap; gap: 8px; }
  .filter-tabs { flex-wrap: wrap; }
  .sp-body { padding: 14px 16px; }
  .sp-detail-body { padding: 14px 16px; }
}
@media (min-width: 641px) and (max-width: 900px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
}
.kpi-card {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
  padding: 18px; display: flex; flex-direction: column; gap: 6px; position: relative;
  animation: fadeUp .3s ease both;
}
.kpi-label { font-size: 12px; color: #94a3b8; font-weight: 500; }
.kpi-value { font-size: 28px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 6px; }
.kpi-warn  { color: #0f172a; }
.kpi-ring  { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); }
.kpi-icon  { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.kpi-green { background: #dcfce7; }
.kpi-meta  { display: flex; flex-direction: column; gap: 4px; }
.kpi-meta-row { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; }
.dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-blue { background: #4f46e5; }
.dot-red  { background: #ef4444; }

/* Burndown */
.chart-card {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
  padding: 20px; margin-bottom: 20px; animation: fadeUp .35s ease both;
}
.chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.chart-title  { font-size: 14px; font-weight: 700; color: #0f172a; }
.chart-legend { display: flex; align-items: center; font-size: 12px; color: #64748b; gap: 6px; }
.legend-line  { display: inline-block; width: 20px; height: 2px; }
.dashed { border-top: 2px dashed #4f46e5; }
.solid  { border-top: 2px solid #ef4444; }
.burndown-chart { display: flex; gap: 8px; height: 160px; }
.y-labels {
  display: flex; flex-direction: column; justify-content: space-between;
  font-size: 10px; color: #94a3b8; text-align: right; padding-bottom: 20px;
}
.chart-area { flex: 1; position: relative; }
.chart-area svg { position: absolute; inset: 0; width: 100%; height: calc(100% - 20px); }
.x-labels {
  position: absolute; bottom: 0; left: 0; right: 0;
  display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8;
}
.chart-x-title { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 4px; }

/* Board */
.board-section-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
.board-columns { display: flex; gap: 14px; overflow-x: auto; padding-bottom: 16px; }
.board-col {
  min-width: 260px; width: 260px; background: #fff;
  border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px;
  display: flex; flex-direction: column; gap: 10px;
}
.col-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.col-dot    { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.col-title  { font-size: 13px; font-weight: 700; color: #0f172a; flex: 1; }
.col-count  { font-size: 11.5px; color: #94a3b8; background: #f1f5f9; padding: 1px 7px; border-radius: 10px; }
.col-cards  { display: flex; flex-direction: column; gap: 8px; }
.issue-card {
  background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 10px 12px; cursor: pointer; transition: box-shadow .15s, transform .15s;
}
.issue-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.08); transform: translateY(-1px); }
.issue-key     { font-size: 11px; color: #94a3b8; font-weight: 600; margin-bottom: 3px; }
.issue-summary { font-size: 13px; color: #1e293b; font-weight: 500; margin-bottom: 6px; }
.issue-meta    { display: flex; align-items: center; gap: 6px; }
.priority-dot  { width: 8px; height: 8px; border-radius: 50%; }
.issue-type    { font-size: 11px; color: #94a3b8; }
.col-empty     { font-size: 12px; color: #cbd5e1; text-align: center; padding: 16px 0; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
