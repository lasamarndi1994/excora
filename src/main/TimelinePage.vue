<template>
  <div class="timeline-page" @click="closeMenus">
    <ProjectHeader active-tab="timeline" />

    <!-- Toolbar -->
    <div class="tl-toolbar">
      <div class="tl-toolbar-left">
        <div class="search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="search-icon"><circle cx="11" cy="11" r="8" stroke="#94a3b8" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/></svg>
          <input class="search-input" v-model="search" placeholder="Search timeline..." />
        </div>
        <div class="view-toggle">
          <button v-for="v in viewModes" :key="v" class="vt-btn" :class="{ active: viewMode === v }" @click="setView(v)">{{ v }}</button>
        </div>
      </div>
      <div class="tl-toolbar-right">
        <span class="range-label">{{ rangeLabel }}</span>
        <div class="btn-group">
          <button class="grp-btn" @click="goToday">Today</button>
          <button class="grp-btn grp-icon" @click="shiftRange(-1)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="grp-btn grp-icon" @click="shiftRange(1)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
        <button class="tool-btn" @click="openCreateEpic">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          Create Epic
        </button>
      </div>
    </div>

    <!-- Timeline Body -->
    <div class="tl-body">
      <!-- Left Sidebar -->
      <div class="tl-sidebar">
        <div class="sidebar-head">
          <span>Title</span>
        </div>
        <div class="sidebar-list" ref="sidebarRef">
          <div v-for="epic in filteredEpics" :key="epic.id" class="sidebar-epic-group">
            <!-- Epic row -->
            <div class="sidebar-row epic-row" @click.stop="toggleEpic(epic.id)">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                :style="{ transform: expandedEpics.has(epic.id) ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform .2s', flexShrink: 0 }">
                <path d="M6 9l6 6 6-6" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="flex-shrink:0"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" :stroke="epic.color" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span class="row-title">{{ epic.name }}</span>
              <span class="row-id">{{ epic.id }}</span>
              <button class="row-action" @click.stop="openEditEpic(epic)" title="Edit">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </button>
              <button class="row-action row-action--danger" @click.stop="store.deleteEpic(epic.id)" title="Delete">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </button>
            </div>
            <!-- Issue rows -->
            <template v-if="expandedEpics.has(epic.id)">
              <div v-for="issue in epicIssues(epic.id)" :key="issue.id" class="sidebar-row issue-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style="margin-left:20px;flex-shrink:0"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#3b82f6" stroke-width="2"/><path d="M9 12l2 2 4-4" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span class="row-title">{{ issue.summary }}</span>
                <span class="row-id">{{ issue.key }}</span>
                <span class="issue-status-dot" :class="`s-${issue.status.toLowerCase().replace('_','-')}`"></span>
              </div>
              <div class="sidebar-row add-row" @click.stop="addIssueToEpic(epic.id)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style="margin-left:20px"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                <span>Create issue</span>
              </div>
            </template>
          </div>
          <div class="create-epic-btn" @click="openCreateEpic">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            Create epic
          </div>
        </div>
      </div>

      <!-- Gantt Chart -->
      <div class="gantt-wrap" ref="ganttRef" @scroll="onGanttScroll">
        <!-- Header -->
        <div class="gantt-header">
          <div class="gantt-months">
            <div v-for="col in headerCols" :key="col.key" class="gantt-month" :style="{ width: col.width + 'px' }">{{ col.label }}</div>
          </div>
          <div class="gantt-weeks">
            <div v-for="(cell, ci) in cells" :key="ci" class="gantt-week" :style="{ width: cellWidth + 'px' }">
              <span>{{ cell.label }}</span>
            </div>
          </div>
          <!-- Today line in header -->
          <div v-if="todayOffset >= 0" class="today-header-line" :style="{ left: todayOffset + 'px' }">
            <div class="today-pill">Today</div>
          </div>
        </div>

        <!-- Rows -->
        <div class="gantt-rows" :style="{ width: totalWidth + 'px' }">
          <!-- Today vertical line -->
          <div v-if="todayOffset >= 0" class="today-vline" :style="{ left: todayOffset + 'px' }"></div>

          <div v-for="epic in filteredEpics" :key="'g'+epic.id">
            <!-- Epic bar row -->
            <div class="gantt-row epic-gantt-row">
              <div v-for="(_, ci) in cells" :key="ci" class="gantt-cell" :style="{ width: cellWidth + 'px' }"></div>
              <div v-if="epicBarStyle(epic)" class="gantt-bar epic-bar"
                :style="{ ...epicBarStyle(epic)!, background: epic.color }"
                @mousedown.prevent="startDrag(epic, $event)"
                @click.stop="openEditEpic(epic)">
                <span class="bar-label">{{ epic.name }}</span>
                <div class="bar-resize-handle" @mousedown.stop.prevent="startResize(epic, $event)"></div>
              </div>
              <div v-else class="gantt-bar-placeholder" @click.stop="openEditEpic(epic)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/></svg>
                Set dates
              </div>
            </div>
            <!-- Issue rows -->
            <template v-if="expandedEpics.has(epic.id)">
              <div v-for="issue in epicIssues(epic.id)" :key="'gi'+issue.id" class="gantt-row issue-gantt-row">
                <div v-for="(_, ci) in cells" :key="ci" class="gantt-cell" :style="{ width: cellWidth + 'px' }"></div>
                <div class="gantt-bar issue-bar" :style="{ left: issueOffset(issue) + 'px', width: cellWidth * 2 + 'px', background: statusColor(issue.status) }">
                  <span class="bar-label">{{ issue.summary }}</span>
                </div>
              </div>
              <div class="gantt-row add-gantt-row">
                <div v-for="(_, ci) in cells" :key="ci" class="gantt-cell" :style="{ width: cellWidth + 'px' }"></div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Create / Edit Epic Dialog -->
    <teleport to="body">
      <div v-if="dialogOpen" class="dialog-overlay" @click.self="dialogOpen = false">
        <div class="dialog-box">
          <div class="dialog-header">
            <span class="dialog-title">{{ editingEpic ? 'Edit Epic' : 'Create Epic' }}</span>
            <button class="dialog-close" @click="dialogOpen = false">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="dialog-body">
            <div class="field-group">
              <label class="field-label">Name <span class="required">*</span></label>
              <input v-model="form.name" class="field-input" :class="{ 'field-error': errors.name }" placeholder="Epic name" />
              <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
            </div>
            <div class="field-group">
              <label class="field-label">Summary</label>
              <input v-model="form.summary" class="field-input" placeholder="Short description" />
            </div>
            <div class="field-row-2">
              <div class="field-group">
                <label class="field-label">Start date <span class="required">*</span></label>
                <input v-model="form.startDate" type="date" class="field-input" :class="{ 'field-error': errors.startDate }" />
                <span v-if="errors.startDate" class="error-msg">{{ errors.startDate }}</span>
              </div>
              <div class="field-group">
                <label class="field-label">Due date <span class="required">*</span></label>
                <input v-model="form.dueDate" type="date" class="field-input" :class="{ 'field-error': errors.dueDate }" />
                <span v-if="errors.dueDate" class="error-msg">{{ errors.dueDate }}</span>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Status</label>
              <select v-model="form.status" class="field-input field-select">
                <option v-for="s in epicStatuses" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div class="field-group">
              <label class="field-label">Color</label>
              <div class="color-row">
                <button v-for="c in colorPalette" :key="c" class="color-swatch"
                  :style="{ background: c, outline: form.color === c ? '2px solid #0f172a' : 'none', outlineOffset: '2px' }"
                  @click="form.color = c"></button>
              </div>
            </div>
          </div>
          <div class="dialog-footer">
            <button class="btn-cancel" @click="dialogOpen = false">Cancel</button>
            <button class="btn-primary" @click="saveEpic">{{ editingEpic ? 'Save Changes' : 'Create Epic' }}</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, reactive, nextTick, onMounted, onUnmounted } from 'vue'
import ProjectHeader from '@/components/ProjectHeader.vue'
import { useTaskStore } from '@/stores/taskStore'
import type { Epic } from '@/stores/taskStore'

const store = useTaskStore()

// ── View ──
const viewModes = ['Weeks', 'Months', 'Quarters'] as const
type ViewMode = typeof viewModes[number]
const viewMode = ref<ViewMode>('Months')
const rangeOffset = ref(0)
const search = ref('')
const expandedEpics = ref(new Set<string>(store.epics.map(e => e.id)))

const ganttRef = ref<HTMLElement | null>(null)
const sidebarRef = ref<HTMLElement | null>(null)

const today = new Date()

const setView = (v: ViewMode) => { viewMode.value = v; rangeOffset.value = 0 }
const shiftRange = (d: number) => { rangeOffset.value += d }
const goToday = () => { rangeOffset.value = 0; scrollToToday() }
const toggleEpic = (id: string) => {
  if (expandedEpics.value.has(id)) expandedEpics.value.delete(id)
  else expandedEpics.value.add(id)
}

// ── Cells ──
const cellWidth = computed(() => viewMode.value === 'Weeks' ? 64 : viewMode.value === 'Months' ? 48 : 80)

const cells = computed(() => {
  const result: { label: string; date: Date }[] = []
  if (viewMode.value === 'Weeks') {
    const base = new Date(today)
    base.setDate(base.getDate() - base.getDay() + rangeOffset.value * 7 * 20)
    for (let i = 0; i < 20; i++) {
      const d = new Date(base); d.setDate(d.getDate() + i * 7)
      result.push({ label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), date: d })
    }
  } else if (viewMode.value === 'Months') {
    const base = new Date(today.getFullYear(), today.getMonth() + rangeOffset.value * 12, 1)
    for (let i = 0; i < 12; i++) {
      const d = new Date(base.getFullYear(), base.getMonth() + i, 1)
      result.push({ label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), date: d })
    }
  } else {
    const baseQ = Math.floor(today.getMonth() / 3) + rangeOffset.value * 8
    for (let i = 0; i < 8; i++) {
      const q = ((baseQ + i) % 4 + 4) % 4
      const yr = today.getFullYear() + Math.floor((baseQ + i) / 4)
      const d = new Date(yr, q * 3, 1)
      result.push({ label: `Q${q+1} ${yr}`, date: d })
    }
  }
  return result
})

const totalWidth = computed(() => cells.value.length * cellWidth.value)

// Group cells into header columns (months/quarters)
const headerCols = computed(() => {
  if (viewMode.value === 'Weeks') {
    const map = new Map<string, number>()
    for (const c of cells.value) {
      const key = c.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      map.set(key, (map.get(key) ?? 0) + cellWidth.value)
    }
    return Array.from(map.entries()).map(([label, width]) => ({ key: label, label, width }))
  }
  if (viewMode.value === 'Months') {
    const map = new Map<string, number>()
    for (const c of cells.value) {
      const key = c.date.getFullYear().toString()
      map.set(key, (map.get(key) ?? 0) + cellWidth.value)
    }
    return Array.from(map.entries()).map(([label, width]) => ({ key: label, label, width }))
  }
  // Quarters — group by year
  const map = new Map<string, number>()
  for (const c of cells.value) {
    const key = c.date.getFullYear().toString()
    map.set(key, (map.get(key) ?? 0) + cellWidth.value)
  }
  return Array.from(map.entries()).map(([label, width]) => ({ key: label, label, width }))
})

const rangeLabel = computed(() => {
  if (!cells.value.length) return ''
  const first = cells.value[0]!.date
  const last  = cells.value[cells.value.length - 1]!.date
  return `${first.toLocaleDateString('en-US',{month:'short',year:'numeric'})} – ${last.toLocaleDateString('en-US',{month:'short',year:'numeric'})}`
})

// ── Today offset ──
const rangeStart = computed(() => cells.value[0]?.date ?? today)
const rangeDays  = computed(() => {
  if (!cells.value.length) return 1
  const last = cells.value[cells.value.length - 1]!.date
  return Math.max(1, daysBetween(rangeStart.value, last))
})

const todayOffset = computed(() => {
  const d = daysBetween(rangeStart.value, today)
  const pct = d / rangeDays.value
  if (pct < 0 || pct > 1) return -1
  return Math.round(pct * totalWidth.value)
})

// ── Bar positioning ──
const epicBarStyle = (epic: Epic) => {
  if (!epic.startDate || !epic.dueDate) return null
  const s = new Date(epic.startDate)
  const e = new Date(epic.dueDate)
  const startPct = daysBetween(rangeStart.value, s) / rangeDays.value
  const endPct   = daysBetween(rangeStart.value, e) / rangeDays.value
  if (endPct <= 0 || startPct >= 1) return null
  const left  = Math.max(0, startPct * totalWidth.value)
  const right = Math.min(totalWidth.value, endPct * totalWidth.value)
  return { left: left + 'px', width: Math.max(right - left, 4) + 'px' }
}

const issueOffset = (issue: { id: string; epicLink?: string }) => {
  const epic = store.epics.find(e => e.id === issue.epicLink)
  if (!epic?.startDate) return 0
  const s = new Date(epic.startDate)
  return Math.max(0, (daysBetween(rangeStart.value, s) / rangeDays.value) * totalWidth.value)
}

const statusColor = (status: string) => {
  const map: Record<string, string> = { TODO: '#94a3b8', IN_PROGRESS: '#3b82f6', DONE: '#10b981' }
  return map[status] ?? '#94a3b8'
}

// ── Filtered epics ──
const filteredEpics = computed(() =>
  store.epics.filter(e =>
    !search.value || e.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const epicIssues = (epicId: string) =>
  store.issues.filter(i => i.epicLink === epicId)

// ── Drag to move bar ──
let dragState: { epic: Epic; startX: number; origStart: string; origEnd: string } | null = null

const startDrag = (epic: Epic, e: MouseEvent) => {
  if (!epic.startDate || !epic.dueDate) return
  dragState = { epic, startX: e.clientX, origStart: epic.startDate, origEnd: epic.dueDate }
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
}

const onDragMove = (e: MouseEvent) => {
  if (!dragState) return
  const dx = e.clientX - dragState.startX
  const daysDelta = Math.round((dx / totalWidth.value) * rangeDays.value)
  const newStart = addDays(new Date(dragState.origStart), daysDelta)
  const newEnd   = addDays(new Date(dragState.origEnd),   daysDelta)
  store.updateEpic(dragState.epic.id, {
    startDate: toISO(newStart),
    dueDate:   toISO(newEnd),
  })
}

const onDragEnd = () => {
  dragState = null
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
}

// ── Drag to resize bar ──
let resizeState: { epic: Epic; startX: number; origEnd: string } | null = null

const startResize = (epic: Epic, e: MouseEvent) => {
  if (!epic.dueDate) return
  resizeState = { epic, startX: e.clientX, origEnd: epic.dueDate }
  window.addEventListener('mousemove', onResizeMove)
  window.addEventListener('mouseup', onResizeEnd)
}

const onResizeMove = (e: MouseEvent) => {
  if (!resizeState) return
  const dx = e.clientX - resizeState.startX
  const daysDelta = Math.round((dx / totalWidth.value) * rangeDays.value)
  const newEnd = addDays(new Date(resizeState.origEnd), daysDelta)
  if (resizeState.epic.startDate && new Date(resizeState.epic.startDate) < newEnd) {
    store.updateEpic(resizeState.epic.id, { dueDate: toISO(newEnd) })
  }
}

const onResizeEnd = () => {
  resizeState = null
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeEnd)
}

// ── Sync sidebar scroll ──
const onGanttScroll = () => {
  if (sidebarRef.value && ganttRef.value)
    sidebarRef.value.scrollTop = ganttRef.value.scrollTop
}

const scrollToToday = () => {
  nextTick(() => {
    if (ganttRef.value && todayOffset.value >= 0)
      ganttRef.value.scrollLeft = Math.max(0, todayOffset.value - ganttRef.value.clientWidth / 2)
  })
}

onMounted(() => scrollToToday())
onUnmounted(() => {
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeEnd)
})

// ── Add issue to epic ──
const addIssueToEpic = (epicId: string) => {
  store.createIssue({
    summary: 'New issue',
    type: 'Task',
    status: 'TODO',
    priority: 'Medium',
    assignees: [],
    epicLink: epicId,
  })
}

// ── Dialog ──
const dialogOpen  = ref(false)
const editingEpic = ref<Epic | null>(null)
const errors      = reactive({ name: '', startDate: '', dueDate: '' })
const epicStatuses = ['In Progress','On Track','Planned','At Risk','Done'] as const
const colorPalette = ['#6366f1','#a855f7','#10b981','#f59e0b','#ef4444','#3b82f6','#ec4899','#14b8a6']

const form = reactive({
  name: '', summary: '', color: '#6366f1',
  startDate: '', dueDate: '',
  status: 'Planned' as Epic['status'],
})

const openCreateEpic = () => {
  editingEpic.value = null
  form.name = ''; form.summary = ''; form.color = '#6366f1'
  form.startDate = ''; form.dueDate = ''; form.status = 'Planned'
  errors.name = ''; errors.startDate = ''; errors.dueDate = ''
  dialogOpen.value = true
}

const openEditEpic = (epic: Epic) => {
  editingEpic.value = { ...epic }
  form.name = epic.name; form.summary = epic.summary ?? ''
  form.color = epic.color; form.startDate = epic.startDate ?? ''
  form.dueDate = epic.dueDate ?? ''; form.status = epic.status ?? 'Planned'
  errors.name = ''; errors.startDate = ''; errors.dueDate = ''
  dialogOpen.value = true
}

const saveEpic = () => {
  errors.name = ''; errors.startDate = ''; errors.dueDate = ''
  if (!form.name.trim()) { errors.name = 'Name is required.'; return }
  if (!form.startDate)   { errors.startDate = 'Start date is required.'; return }
  if (!form.dueDate)     { errors.dueDate = 'Due date is required.'; return }
  const payload = { name: form.name, summary: form.summary, color: form.color, startDate: form.startDate, dueDate: form.dueDate, status: form.status }
  if (editingEpic.value) store.updateEpic(editingEpic.value.id, payload)
  else store.addEpic(payload)
  dialogOpen.value = false
}

const closeMenus = () => {}

// ── Helpers ──
const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000)
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }
const toISO = (d: Date) => d.toISOString().split('T')[0]!
</script>
<style scoped>
.timeline-page { display:flex; flex-direction:column; height:100%; font-family:'Inter',sans-serif; background:#f8fafc; overflow:hidden; }

/* Toolbar */
.tl-toolbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding:10px 20px; background:#fff; border-bottom:1px solid #e2e8f0; flex-shrink:0; }
.tl-toolbar-left, .tl-toolbar-right { display:flex; align-items:center; gap:8px; }
.search-wrap { position:relative; display:flex; align-items:center; }
.search-icon { position:absolute; left:9px; pointer-events:none; }
.search-input { padding:6px 10px 6px 30px; border:1px solid #e2e8f0; border-radius:8px; font-size:13px; color:#1e293b; background:#f8fafc; outline:none; width:200px; font-family:'Inter',sans-serif; transition:border-color .15s; }
.search-input:focus { border-color:#4f46e5; background:#fff; }
.view-toggle { display:flex; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; }
.vt-btn { padding:5px 12px; border:none; background:#fff; font-size:12px; font-weight:500; color:#64748b; cursor:pointer; font-family:'Inter',sans-serif; transition:background .12s,color .12s; }
.vt-btn.active { background:#eef2ff; color:#4f46e5; font-weight:600; }
.range-label { font-size:12.5px; font-weight:600; color:#475569; min-width:180px; text-align:center; }
.btn-group { display:flex; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; }
.grp-btn { display:inline-flex; align-items:center; gap:3px; padding:5px 12px; border:none; background:#fff; font-size:12.5px; color:#475569; cursor:pointer; font-family:'Inter',sans-serif; border-right:1px solid #e2e8f0; transition:background .12s; }
.grp-btn:last-child { border-right:none; }
.grp-btn:hover { background:#f1f5f9; }
.grp-icon { padding:5px 8px; }
.tool-btn { display:inline-flex; align-items:center; gap:5px; padding:6px 14px; border:none; background:#4f46e5; color:#fff; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; box-shadow:0 2px 8px rgba(79,70,229,.25); transition:background .12s; }
.tool-btn:hover { background:#4338ca; }

/* Body */
.tl-body { flex:1; display:flex; overflow:hidden; }

/* Sidebar */
.tl-sidebar { width:300px; min-width:300px; background:#fff; border-right:1px solid #e2e8f0; display:flex; flex-direction:column; overflow:hidden; }
.sidebar-head { padding:0 16px; font-size:12px; font-weight:700; color:#64748b; border-bottom:1px solid #e2e8f0; height:80px; display:flex; align-items:flex-end; padding-bottom:10px; }
.sidebar-list { overflow-y:auto; flex:1; }
.sidebar-row { display:flex; align-items:center; gap:6px; padding:0 8px 0 12px; height:44px; cursor:pointer; transition:background .1s; border-bottom:1px solid #f1f5f9; }
.sidebar-row:hover { background:#f8fafc; }
.sidebar-row:hover .row-action { opacity:1; }
.epic-row { height:48px; font-weight:600; }
.issue-row { height:44px; }
.add-row { color:#94a3b8; font-size:12.5px; }
.row-title { flex:1; font-size:13px; color:#1e293b; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.row-id { font-size:11px; color:#94a3b8; background:#f1f5f9; padding:1px 6px; border-radius:8px; flex-shrink:0; }
.row-action { display:flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:5px; border:none; background:none; color:#94a3b8; cursor:pointer; opacity:0; transition:opacity .12s,background .12s,color .12s; flex-shrink:0; }
.row-action:hover { background:#eef2ff; color:#4f46e5; }
.row-action--danger:hover { background:#fef2f2; color:#ef4444; }
.issue-status-dot { width:7px; height:7px; border-radius:50%; flex-shrink:0; }
.s-todo { background:#94a3b8; }
.s-in-progress { background:#3b82f6; }
.s-done { background:#10b981; }
.create-epic-btn { display:flex; align-items:center; gap:6px; padding:12px 16px; font-size:13px; color:#94a3b8; cursor:pointer; transition:color .12s; }
.create-epic-btn:hover { color:#4f46e5; }

/* Gantt */
.gantt-wrap { flex:1; overflow:auto; position:relative; background:#f8fafc; }
.gantt-header { position:sticky; top:0; z-index:10; background:#fff; border-bottom:1px solid #e2e8f0; }
.gantt-months { display:flex; border-bottom:1px solid #e2e8f0; }
.gantt-month { flex-shrink:0; height:32px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; color:#475569; border-right:1px solid #e2e8f0; }
.gantt-weeks { display:flex; position:relative; }
.gantt-week { flex-shrink:0; height:32px; display:flex; align-items:center; justify-content:center; font-size:11.5px; color:#94a3b8; border-right:1px solid #f1f5f9; position:relative; }
.today-header-line { position:absolute; top:0; bottom:0; width:2px; background:#4f46e5; z-index:6; pointer-events:none; }
.today-pill { position:absolute; top:2px; left:50%; transform:translateX(-50%); background:#4f46e5; color:#fff; font-size:9px; font-weight:700; padding:1px 6px; border-radius:8px; white-space:nowrap; }
.gantt-rows { position:relative; min-height:100%; }
.today-vline { position:absolute; top:0; bottom:0; width:2px; background:rgba(79,70,229,.25); z-index:2; pointer-events:none; }
.gantt-row { display:flex; position:relative; border-bottom:1px solid #f1f5f9; }
.epic-gantt-row { height:48px; }
.issue-gantt-row { height:44px; }
.add-gantt-row { height:44px; }
.gantt-cell { flex-shrink:0; height:100%; border-right:1px solid #f1f5f9; }
.gantt-row:hover { background:rgba(79,70,229,.02); }
.gantt-bar { position:absolute; top:50%; transform:translateY(-50%); height:24px; border-radius:6px; display:flex; align-items:center; padding:0 8px; font-size:11px; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; box-shadow:0 2px 6px rgba(0,0,0,.12); cursor:grab; transition:filter .15s; user-select:none; }
.gantt-bar:hover { filter:brightness(.92); }
.gantt-bar:active { cursor:grabbing; }
.epic-bar { height:26px; border-radius:8px; }
.issue-bar { height:20px; opacity:.85; cursor:default; }
.bar-label { flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; pointer-events:none; }
.bar-resize-handle { position:absolute; right:0; top:0; bottom:0; width:8px; cursor:ew-resize; background:rgba(255,255,255,.25); border-radius:0 8px 8px 0; }
.gantt-bar-placeholder { position:absolute; top:50%; transform:translateY(-50%); height:24px; border-radius:6px; display:inline-flex; align-items:center; gap:5px; padding:0 10px; font-size:11px; color:#94a3b8; border:1.5px dashed #e2e8f0; background:#fff; cursor:pointer; white-space:nowrap; left:8px; transition:border-color .12s,color .12s; }
.gantt-bar-placeholder:hover { border-color:#a5b4fc; color:#4f46e5; }

/* Dialog */
.dialog-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:1200; padding:16px; }
.dialog-box { background:#fff; border-radius:14px; width:100%; max-width:500px; max-height:90vh; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,.18); font-family:'Inter',sans-serif; animation:fadeUp .2s ease; }
.dialog-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px 16px; border-bottom:1px solid #e2e8f0; }
.dialog-title { font-size:16px; font-weight:700; color:#0f172a; }
.dialog-close { display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; border:none; background:none; color:#94a3b8; cursor:pointer; transition:background .12s; }
.dialog-close:hover { background:#f1f5f9; }
.dialog-body { padding:20px 24px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:14px; }
.field-group { display:flex; flex-direction:column; gap:5px; }
.field-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.field-label { font-size:13px; font-weight:600; color:#374151; }
.required { color:#ef4444; }
.field-input { padding:8px 12px; border:1px solid #e2e8f0; border-radius:8px; font-size:13px; color:#1e293b; background:#f8fafc; outline:none; transition:border-color .15s; font-family:'Inter',sans-serif; }
.field-input:focus { border-color:#4f46e5; background:#fff; }
.field-input.field-error { border-color:#ef4444; }
.field-select { appearance:none; cursor:pointer; }
.error-msg { font-size:12px; color:#ef4444; }
.color-row { display:flex; gap:8px; flex-wrap:wrap; }
.color-swatch { width:24px; height:24px; border-radius:50%; border:none; cursor:pointer; transition:transform .12s; }
.color-swatch:hover { transform:scale(1.2); }
.dialog-footer { display:flex; justify-content:flex-end; gap:10px; padding:16px 24px; border-top:1px solid #e2e8f0; background:#f8fafc; border-radius:0 0 14px 14px; }
.btn-cancel { padding:8px 18px; border:1px solid #e2e8f0; border-radius:8px; background:#fff; color:#475569; font-size:13px; font-weight:500; cursor:pointer; font-family:'Inter',sans-serif; }
.btn-cancel:hover { background:#f1f5f9; }
.btn-primary { padding:8px 20px; border:none; border-radius:8px; background:#4f46e5; color:#fff; font-size:13px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; }
.btn-primary:hover { background:#4338ca; }

@keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@media (max-width:768px) { .tl-sidebar { display:none; } .search-input { width:140px; } }
</style>