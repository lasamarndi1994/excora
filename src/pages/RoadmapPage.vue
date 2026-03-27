<template>
  <div class="roadmap-root">

    <!-- Header -->
    <div class="roadmap-header">
      <div>
        <h1 class="roadmap-title">Roadmap</h1>
        <p class="roadmap-sub">{{ store.epics.length }} epics · {{ rangeLabel }}</p>
      </div>
      <div class="header-right">
        <div class="view-toggle">
          <button v-for="v in views" :key="v" class="vt-btn"
            :class="{ active: viewMode === v }" @click="setView(v)">{{ v }}</button>
        </div>
        <button class="hdr-btn" @click="filterOpen = !filterOpen">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Filter
          <span v-if="statusFilterVal !== 'all'" class="filter-dot"></span>
        </button>
        <button class="hdr-btn hdr-btn--primary" @click="openCreate">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          Create Epic
        </button>
      </div>
    </div>

    <!-- Filter bar -->
    <div v-if="filterOpen" class="filter-bar">
      <span class="filter-label">Status:</span>
      <div class="status-filters">
        <button v-for="f in statusOptions" :key="f.value"
          class="sf-btn" :class="{ active: statusFilterVal === f.value }"
          @click="statusFilterVal = f.value">{{ f.label }}</button>
      </div>
      <span class="filter-label" style="margin-left:12px">Color:</span>
      <div class="color-swatches">
        <button v-for="c in colorPalette" :key="c"
          class="swatch" :style="{ background: c }"
          :class="{ 'swatch--active': colorFilter === c }"
          @click="colorFilter = colorFilter === c ? '' : c"></button>
      </div>
      <button class="clear-filter" @click="statusFilterVal = 'all'; colorFilter = ''">Clear</button>
    </div>

    <!-- Legend + nav -->
    <div class="roadmap-controls">
      <div class="legend">
        <div v-for="epic in visibleEpics" :key="epic.id" class="legend-item">
          <span class="legend-dot" :style="{ background: epic.color }"></span>
          <span>{{ epic.name }}</span>
        </div>
      </div>
      <div class="controls-right">
        <button class="ctrl-btn" @click="shiftRange(-1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="ctrl-label">{{ rangeLabel }}</span>
        <button class="ctrl-btn" @click="shiftRange(1)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button class="ctrl-btn" @click="goToToday" title="Jump to today">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>

    <!-- Timeline -->
    <div class="timeline-wrap" ref="timelineRef">
      <div class="timeline-inner">

        <!-- Column headers -->
        <div class="tl-header-row">
          <div class="tl-sidebar-cell tl-hdr-cell">Epics</div>
          <div class="tl-months">
            <div v-for="col in columns" :key="col.key" class="tl-month-cell">{{ col.label }}</div>
          </div>
        </div>

        <!-- Today line -->
        <div v-if="todayPct >= 0 && todayPct <= 100" class="today-line-wrap">
          <div class="today-line" :style="{ left: todayPct + '%' }">
            <div class="today-label">Today</div>
          </div>
        </div>

        <!-- Epic rows -->
        <div v-for="(epic, ei) in visibleEpics" :key="epic.id"
          class="tl-row" :class="{ 'tl-row--alt': ei % 2 === 1 }"
          @click="openEdit(epic)">
          <div class="tl-sidebar-cell">
            <div class="epic-sidebar">
              <div class="epic-dot" :style="{ background: epic.color }"></div>
              <div class="epic-info">
                <div class="epic-name">{{ epic.name }}</div>
                <div class="epic-meta">{{ epicTaskCount(epic.id) }} tasks · {{ epicProgress(epic.id) }}%</div>
              </div>
              <span class="epic-status-chip" :class="`es-${statusType(epic.status)}`">{{ epic.status || 'Planned' }}</span>
              <div class="epic-actions">
                <button class="ea-btn" title="Edit" @click.stop="openEdit(epic)">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <button class="ea-btn ea-btn--danger" title="Delete" @click.stop="store.deleteEpic(epic.id)">                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="tl-track">
            <div v-for="(_, ci) in columns" :key="ci" class="tl-grid-line"
              :style="{ left: (ci / columns.length * 100) + '%' }"></div>

            <!-- Bar -->
            <template v-if="barStyle(epic) !== null">
              <div class="tl-bar"
                :style="{ ...barStyle(epic)!, background: epic.color }"
                @mouseenter="hoveredEpic = epic.id"
                @mouseleave="hoveredEpic = null"
                @click.stop="openEdit(epic)">
                <div class="tl-bar-progress" :style="{ width: epicProgress(epic.id) + '%', background: 'rgba(255,255,255,.3)' }"></div>
                <span class="tl-bar-label">{{ epic.summary }}</span>
                <div v-if="hoveredEpic === epic.id" class="tl-tooltip">
                  <div class="tt-title">{{ epic.name }}</div>
                  <div class="tt-row"><span>Start</span><span>{{ fmtDate(epic.startDate) }}</span></div>
                  <div class="tt-row"><span>End</span><span>{{ fmtDate(epic.dueDate) }}</span></div>
                  <div class="tt-row"><span>Tasks</span><span>{{ epicTaskCount(epic.id) }}</span></div>
                  <div class="tt-row"><span>Progress</span><span>{{ epicProgress(epic.id) }}%</span></div>
                  <div class="tt-prog"><div class="tt-prog-fill" :style="{ width: epicProgress(epic.id) + '%', background: epic.color }"></div></div>
                </div>
              </div>
            </template>

            <!-- Milestones -->
            <template v-for="ms in (epic.milestones ?? [])" :key="ms.label">
              <div v-if="ms && milestonePct(ms.date) >= 0 && milestonePct(ms.date) <= 100"
                class="tl-milestone" :style="{ left: milestonePct(ms.date) + '%' }"
                :title="ms.label + ' · ' + fmtDate(ms.date)">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="white"/></svg>
              </div>
            </template>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="visibleEpics.length === 0" class="tl-empty">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>No epics match the current filter</span>
        </div>

        <!-- Add row -->
        <div class="tl-add-row">
          <button class="tl-add-btn" @click="openCreate">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            Create epic
          </button>
        </div>

      </div>
    </div>

    <!-- Summary cards -->
    <div class="summary-row">
      <div v-for="card in summaryCards" :key="card.label" class="summary-card">
        <div class="sum-icon" :style="{ background: card.iconBg }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :style="{ color: card.iconColor }" v-html="card.iconSvg"></svg>
        </div>
        <div>
          <div class="sum-val">{{ card.value }}</div>
          <div class="sum-label">{{ card.label }}</div>
        </div>
      </div>
    </div>

  </div>

  <!-- Create / Edit Dialog -->
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
            <div class="color-picker-row">
              <button v-for="c in colorPalette" :key="c"
                class="swatch swatch--lg" :style="{ background: c }"
                :class="{ 'swatch--active': form.color === c }"
                @click="form.color = c"></button>
            </div>
          </div>
          <!-- Milestones -->
          <div class="field-group">
            <div class="field-label-row">
              <label class="field-label">Milestones</label>
              <button class="add-ms-btn" @click="addMilestone">+ Add</button>
            </div>
            <div v-for="(ms, i) in form.milestones" :key="i" class="ms-row">
              <input v-model="ms.label" class="field-input ms-label" placeholder="Label" />
              <input v-model="ms.date" type="date" class="field-input ms-date" />
              <button class="ms-rm" @click="form.milestones.splice(i, 1)">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
              </button>
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
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import type { Epic } from '@/stores/taskStore'

const store = useTaskStore()

// ── View mode ──
const views   = ['Weeks', 'Months', 'Quarters'] as const
type ViewMode = typeof views[number]
const viewMode = ref<ViewMode>('Months')

// ── Range offset (shift by N units) ──
const rangeOffset = ref(0)

const setView = (v: ViewMode) => { viewMode.value = v; rangeOffset.value = 0 }

// ── Build columns based on view ──
const today = new Date()

const columns = computed(() => {
  const cols: { key: string; label: string; start: Date; end: Date }[] = []
  if (viewMode.value === 'Weeks') {
    // 12 weeks
    const base = new Date(today)
    base.setDate(base.getDate() - base.getDay() + rangeOffset.value * 7 * 12)
    for (let i = 0; i < 12; i++) {
      const s = new Date(base); s.setDate(s.getDate() + i * 7)
      const e = new Date(s); e.setDate(e.getDate() + 6)
      cols.push({ key: s.toISOString(), label: `W${getWeekNum(s)} ${s.toLocaleDateString('en-US',{month:'short',day:'numeric'})}`, start: s, end: e })
    }
  } else if (viewMode.value === 'Months') {
    // 6 months
    const base = new Date(today.getFullYear(), today.getMonth() + rangeOffset.value * 6, 1)
    for (let i = 0; i < 6; i++) {
      const s = new Date(base.getFullYear(), base.getMonth() + i, 1)
      const e = new Date(base.getFullYear(), base.getMonth() + i + 1, 0)
      cols.push({ key: s.toISOString(), label: s.toLocaleDateString('en-US',{month:'short',year:'2-digit'}), start: s, end: e })
    }
  } else {
    // 4 quarters
    const baseQ = Math.floor(today.getMonth() / 3) + rangeOffset.value * 4
    const baseYear = today.getFullYear() + Math.floor(baseQ / 4)
    const startQ = ((baseQ % 4) + 4) % 4
    for (let i = 0; i < 4; i++) {
      const q = (startQ + i) % 4
      const yr = baseYear + Math.floor((startQ + i) / 4)
      const s = new Date(yr, q * 3, 1)
      const e = new Date(yr, q * 3 + 3, 0)
      cols.push({ key: s.toISOString(), label: `Q${q+1} ${yr}`, start: s, end: e })
    }
  }
  return cols
})

const rangeStart = computed(() => columns.value[0]!.start)
const rangeEnd   = computed(() => columns.value[columns.value.length - 1]!.end)
const rangeDays  = computed(() => daysBetween(rangeStart.value, rangeEnd.value) || 1)

const rangeLabel = computed(() => {
  const s = rangeStart.value.toLocaleDateString('en-US',{month:'short',year:'numeric'})
  const e = rangeEnd.value.toLocaleDateString('en-US',{month:'short',year:'numeric'})
  return `${s} – ${e}`
})

const shiftRange = (dir: number) => { rangeOffset.value += dir }
const goToToday  = () => { rangeOffset.value = 0 }

// ── Today line ──
const todayPct = computed(() => {
  const d = daysBetween(rangeStart.value, today)
  return (d / rangeDays.value) * 100
})

// ── Filters ──
const filterOpen     = ref(false)
const statusFilterVal = ref('all')
const colorFilter    = ref('')

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'On Track', label: 'On Track' },
  { value: 'Planned', label: 'Planned' },
  { value: 'At Risk', label: 'At Risk' },
  { value: 'Done', label: 'Done' },
]

const colorPalette = ['#6366f1','#a855f7','#10b981','#f59e0b','#ef4444','#3b82f6','#ec4899','#14b8a6']
const epicStatuses = ['In Progress','On Track','Planned','At Risk','Done'] as const

const visibleEpics = computed(() =>
  store.epics.filter(e => {
    const matchStatus = statusFilterVal.value === 'all' || e.status === statusFilterVal.value
    const matchColor  = !colorFilter.value || e.color === colorFilter.value
    return matchStatus && matchColor
  })
)

// ── Bar positioning ──
const barStyle = (epic: Epic) => {
  if (!epic.startDate || !epic.dueDate) return null
  const s = new Date(epic.startDate)
  const e = new Date(epic.dueDate)
  const startPct = Math.max(0, (daysBetween(rangeStart.value, s) / rangeDays.value) * 100)
  const endPct   = Math.min(100, (daysBetween(rangeStart.value, e) / rangeDays.value) * 100)
  if (endPct <= 0 || startPct >= 100) return null
  return { left: startPct + '%', width: Math.max(endPct - startPct, 2) + '%' }
}

const milestonePct = (date?: string) => {
  if (!date) return -1
  return (daysBetween(rangeStart.value, new Date(date)) / rangeDays.value) * 100
}

// ── Epic stats from issues ──
const epicTaskCount = (epicId: string) =>
  store.issues.filter(i => i.epicLink === epicId).length

const epicProgress = (epicId: string) => {
  const tasks = store.issues.filter(i => i.epicLink === epicId)
  if (!tasks.length) return 0
  const done = tasks.filter(i => i.status === 'DONE').length
  return Math.round((done / tasks.length) * 100)
}

const statusType = (status?: string) => {
  const map: Record<string, string> = {
    'In Progress': 'info', 'On Track': 'success',
    'Planned': 'warn', 'At Risk': 'danger', 'Done': 'done',
  }
  return map[status ?? ''] ?? 'warn'
}

// ── Summary cards ──
const summaryCards = computed(() => {
  const ep = store.epics
  const avgProg = ep.length ? Math.round(ep.reduce((s, e) => s + epicProgress(e.id), 0) / ep.length) : 0
  return [
    { label: 'Total Epics',  value: ep.length,
      iconBg: '#eef2ff', iconColor: '#4f46e5',
      iconSvg: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
    { label: 'In Progress',  value: ep.filter(e => e.status === 'In Progress').length,
      iconBg: '#eff6ff', iconColor: '#3b82f6',
      iconSvg: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
    { label: 'On Track',     value: ep.filter(e => e.status === 'On Track').length,
      iconBg: '#f0fdf4', iconColor: '#10b981',
      iconSvg: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
    { label: 'At Risk',      value: ep.filter(e => e.status === 'At Risk').length,
      iconBg: '#fef2f2', iconColor: '#ef4444',
      iconSvg: '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
    { label: 'Avg Progress', value: avgProg + '%',
      iconBg: '#faf5ff', iconColor: '#a855f7',
      iconSvg: '<line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  ]
})

// ── Dialog ──
const dialogOpen   = ref(false)
const editingEpic  = ref<Epic | null>(null)
const errors       = reactive({ name: '', startDate: '', dueDate: '' })

const defaultForm = () => ({
  name: '', summary: '', color: '#6366f1',
  startDate: '', dueDate: '',
  status: 'Planned' as Epic['status'],
  milestones: [] as { label: string; date: string }[],
})
const form = reactive(defaultForm())

const openCreate = () => {
  editingEpic.value = null
  form.name = ''
  form.summary = ''
  form.color = '#6366f1'
  form.startDate = ''
  form.dueDate = ''
  form.status = 'Planned'
  form.milestones = []
  errors.name = ''; errors.startDate = ''; errors.dueDate = ''
  dialogOpen.value = true
}

const openEdit = (epic: Epic) => {
  editingEpic.value = { ...epic }  // snapshot, not live reference
  form.name = epic.name
  form.summary = epic.summary ?? ''
  form.color = epic.color
  form.startDate = epic.startDate ?? ''
  form.dueDate = epic.dueDate ?? ''
  form.status = epic.status ?? 'Planned'
  form.milestones = epic.milestones ? epic.milestones.map(m => ({ ...m })) : []
  errors.name = ''; errors.startDate = ''; errors.dueDate = ''
  dialogOpen.value = true
}

const addMilestone = () => form.milestones.push({ label: '', date: '' })

const saveEpic = () => {
  errors.name = ''; errors.startDate = ''; errors.dueDate = ''
  if (!form.name.trim()) { errors.name = 'Name is required.'; return }
  if (!form.startDate)   { errors.startDate = 'Start date is required.'; return }
  if (!form.dueDate)     { errors.dueDate = 'Due date is required.'; return }

  const payload = {
    name: form.name, summary: form.summary, color: form.color,
    startDate: form.startDate, dueDate: form.dueDate,
    status: form.status,
    milestones: form.milestones.filter(m => m.label && m.date),
  }
  if (editingEpic.value) store.updateEpic(editingEpic.value.id, payload)
  else store.addEpic(payload)
  dialogOpen.value = false
}

// ── Helpers ──
const daysBetween = (a: Date, b: Date) =>
  Math.round((b.getTime() - a.getTime()) / 86400000)

const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'

const getWeekNum = (d: Date) => {
  const start = new Date(d.getFullYear(), 0, 1)
  return Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7)
}

const hoveredEpic = ref<string | null>(null)
const timelineRef = ref<HTMLElement | null>(null)
</script>
<style scoped>
.roadmap-root { display:flex; flex-direction:column; height:100%; overflow:hidden; font-family:'Inter',sans-serif; font-size:13px; color:#1e293b; background:#f8fafc; }

/* Header */
.roadmap-header { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; padding:16px 24px 12px; background:#fff; border-bottom:1px solid #e2e8f0; flex-shrink:0; }
.roadmap-title { font-size:18px; font-weight:700; color:#0f172a; margin:0 0 3px; }
.roadmap-sub { font-size:12px; color:#94a3b8; margin:0; }
.header-right { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.view-toggle { display:flex; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; }
.vt-btn { padding:6px 12px; border:none; background:#fff; font-size:12px; font-weight:500; color:#64748b; cursor:pointer; font-family:'Inter',sans-serif; transition:background .12s,color .12s; }
.vt-btn.active { background:#eef2ff; color:#4f46e5; font-weight:600; }
.hdr-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 14px; border-radius:8px; border:1px solid #e2e8f0; background:#fff; font-size:12.5px; font-weight:500; color:#475569; cursor:pointer; font-family:'Inter',sans-serif; transition:background .12s; position:relative; }
.hdr-btn:hover { background:#f1f5f9; }
.hdr-btn--primary { background:#4f46e5; border-color:#4f46e5; color:#fff; box-shadow:0 2px 8px rgba(79,70,229,.25); }
.hdr-btn--primary:hover { background:#4338ca; }
.filter-dot { width:6px; height:6px; border-radius:50%; background:#ef4444; position:absolute; top:4px; right:4px; }

/* Filter bar */
.filter-bar { display:flex; align-items:center; gap:10px; flex-wrap:wrap; padding:8px 24px; background:#fff; border-bottom:1px solid #e2e8f0; flex-shrink:0; }
.filter-label { font-size:11px; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.04em; }
.status-filters { display:flex; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; }
.sf-btn { padding:5px 10px; border:none; background:#fff; font-size:12px; font-weight:500; color:#64748b; cursor:pointer; font-family:'Inter',sans-serif; transition:background .12s,color .12s; }
.sf-btn.active { background:#eef2ff; color:#4f46e5; font-weight:600; }
.color-swatches { display:flex; gap:5px; }
.swatch { width:18px; height:18px; border-radius:50%; border:2px solid transparent; cursor:pointer; transition:transform .12s,border-color .12s; }
.swatch--active { border-color:#0f172a; transform:scale(1.2); }
.swatch--lg { width:24px; height:24px; }
.clear-filter { font-size:11.5px; color:#94a3b8; border:none; background:none; cursor:pointer; font-family:'Inter',sans-serif; }
.clear-filter:hover { color:#ef4444; }

/* Controls */
.roadmap-controls { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; padding:10px 24px; background:#fff; border-bottom:1px solid #e2e8f0; flex-shrink:0; }
.legend { display:flex; align-items:center; gap:14px; flex-wrap:wrap; }
.legend-item { display:flex; align-items:center; gap:6px; font-size:12px; color:#475569; }
.legend-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.controls-right { display:flex; align-items:center; gap:6px; }
.ctrl-btn { display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; border:1px solid #e2e8f0; background:#fff; color:#475569; cursor:pointer; transition:background .12s; }
.ctrl-btn:hover { background:#f1f5f9; }
.ctrl-label { font-size:12px; font-weight:600; color:#475569; min-width:160px; text-align:center; }

/* Timeline */
.timeline-wrap { flex:1; overflow:auto; position:relative; }
.timeline-inner { position:relative; min-width:700px; }
.tl-header-row { display:flex; position:sticky; top:0; z-index:10; background:#fff; border-bottom:1px solid #e2e8f0; }
.tl-sidebar-cell { width:220px; min-width:220px; flex-shrink:0; padding:10px 12px; border-right:1px solid #e2e8f0; }
.tl-hdr-cell { font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; display:flex; align-items:center; }
.tl-months { flex:1; display:flex; }
.tl-month-cell { flex:1; text-align:center; padding:10px 0; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.04em; border-right:1px solid #f1f5f9; }

/* Today line — lives inside tl-track so it's scoped to the track area */
.today-line-wrap { position:absolute; top:40px; bottom:0; left:220px; right:0; pointer-events:none; z-index:5; }
.today-line { position:absolute; top:0; bottom:0; width:2px; background:#ef4444; }
.today-label { position:absolute; top:0; left:50%; transform:translateX(-50%); background:#ef4444; color:#fff; font-size:9px; font-weight:700; padding:1px 5px; border-radius:4px; white-space:nowrap; }

.tl-row { display:flex; border-bottom:1px solid #f1f5f9; min-height:60px; cursor:pointer; }
.tl-row--alt { background:#fafbfc; }
.tl-row:hover { background:#f8fafc; }
.epic-sidebar { display:flex; align-items:center; gap:7px; height:100%; min-height:60px; padding:8px 0; }
.epic-dot { width:9px; height:9px; border-radius:50%; flex-shrink:0; }
.epic-info { flex:1; min-width:0; }
.epic-name { font-size:12px; font-weight:600; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.epic-meta { font-size:10px; color:#94a3b8; margin-top:1px; }
.epic-status-chip { font-size:9.5px; font-weight:600; padding:1px 6px; border-radius:20px; white-space:nowrap; flex-shrink:0; }
.es-info    { background:#eff6ff; color:#2563eb; }
.es-success { background:#f0fdf4; color:#16a34a; }
.es-warn    { background:#fffbeb; color:#d97706; }
.es-danger  { background:#fef2f2; color:#ef4444; }
.es-done    { background:#f1f5f9; color:#64748b; }
.epic-actions { display:flex; gap:2px; opacity:0; transition:opacity .12s; flex-shrink:0; }
.tl-row:hover .epic-actions { opacity:1; }
.ea-btn { display:flex; align-items:center; justify-content:center; width:20px; height:20px; border-radius:5px; border:none; background:none; color:#94a3b8; cursor:pointer; transition:background .12s,color .12s; }
.ea-btn:hover { background:#eef2ff; color:#4f46e5; }
.ea-btn--danger:hover { background:#fef2f2; color:#ef4444; }
.tl-track { flex:1; position:relative; overflow:visible; min-height:60px; }
.tl-grid-line { position:absolute; top:0; bottom:0; width:1px; background:#f1f5f9; }
.tl-bar { position:absolute; top:50%; transform:translateY(-50%); height:26px; border-radius:6px; min-width:4px; display:flex; align-items:center; padding:0 8px; cursor:pointer; z-index:2; box-shadow:0 2px 8px rgba(0,0,0,.12); transition:filter .15s,box-shadow .15s; overflow:hidden; }
.tl-bar:hover { filter:brightness(1.08); box-shadow:0 4px 16px rgba(0,0,0,.18); }
.tl-bar-progress { position:absolute; left:0; top:0; bottom:0; border-radius:6px; pointer-events:none; }
.tl-bar-label { font-size:11px; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; position:relative; z-index:1; }
.tl-tooltip { position:absolute; bottom:calc(100% + 8px); left:0; background:#1e293b; color:#fff; border-radius:10px; padding:10px 12px; min-width:160px; z-index:20; box-shadow:0 8px 24px rgba(0,0,0,.2); pointer-events:none; }
.tt-title { font-size:12px; font-weight:700; margin-bottom:6px; }
.tt-row { display:flex; justify-content:space-between; font-size:11px; color:#94a3b8; margin-bottom:3px; }
.tt-row span:last-child { color:#fff; font-weight:500; }
.tt-prog { height:4px; background:rgba(255,255,255,.2); border-radius:99px; overflow:hidden; margin-top:6px; }
.tt-prog-fill { height:100%; border-radius:99px; }
.tl-milestone { position:absolute; top:50%; transform:translate(-50%,-50%); width:18px; height:18px; border-radius:4px; z-index:3; background:rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; cursor:pointer; }
.tl-add-row { padding:8px 16px; border-bottom:1px solid #f1f5f9; }
.tl-add-btn { display:inline-flex; align-items:center; gap:5px; padding:6px 12px; border-radius:7px; border:1px dashed #e2e8f0; background:none; font-size:12px; color:#94a3b8; cursor:pointer; font-family:'Inter',sans-serif; transition:border-color .12s,color .12s; }
.tl-add-btn:hover { border-color:#a5b4fc; color:#4f46e5; }
.tl-empty { display:flex; flex-direction:column; align-items:center; gap:8px; padding:48px; color:#94a3b8; font-size:13px; }

/* Summary */
.summary-row { display:flex; gap:0; border-top:1px solid #e2e8f0; background:#fff; flex-shrink:0; overflow-x:auto; }
.summary-card { flex:1; min-width:100px; display:flex; align-items:center; gap:10px; padding:12px 18px; border-right:1px solid #e2e8f0; }
.summary-card:last-child { border-right:none; }
.sum-icon { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.sum-val { font-size:20px; font-weight:700; color:#0f172a; line-height:1; }
.sum-label { font-size:11px; color:#94a3b8; margin-top:2px; }

/* Dialog */
.dialog-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:1200; padding:16px; }
.dialog-box { background:#fff; border-radius:14px; width:100%; max-width:520px; max-height:90vh; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,.18); font-family:'Inter',sans-serif; animation:fadeUp .2s ease; }
.dialog-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px 16px; border-bottom:1px solid #e2e8f0; }
.dialog-title { font-size:16px; font-weight:700; color:#0f172a; }
.dialog-close { display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; border:none; background:none; color:#94a3b8; cursor:pointer; transition:background .12s; }
.dialog-close:hover { background:#f1f5f9; }
.dialog-body { padding:20px 24px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:14px; }
.field-group { display:flex; flex-direction:column; gap:5px; }
.field-row-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.field-label { font-size:13px; font-weight:600; color:#374151; }
.field-label-row { display:flex; align-items:center; justify-content:space-between; }
.required { color:#ef4444; }
.field-input { padding:8px 12px; border:1px solid #e2e8f0; border-radius:8px; font-size:13px; color:#1e293b; background:#f8fafc; outline:none; transition:border-color .15s; font-family:'Inter',sans-serif; }
.field-input:focus { border-color:#4f46e5; background:#fff; }
.field-input.field-error { border-color:#ef4444; }
.field-select { appearance:none; cursor:pointer; }
.error-msg { font-size:12px; color:#ef4444; }
.color-picker-row { display:flex; gap:8px; flex-wrap:wrap; }
.add-ms-btn { font-size:12px; color:#4f46e5; border:none; background:none; cursor:pointer; font-family:'Inter',sans-serif; }
.ms-row { display:flex; gap:8px; align-items:center; }
.ms-label { flex:1; }
.ms-date { width:140px; }
.ms-rm { display:flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:5px; border:none; background:none; color:#cbd5e1; cursor:pointer; flex-shrink:0; }
.ms-rm:hover { color:#ef4444; background:#fef2f2; }
.dialog-footer { display:flex; justify-content:flex-end; gap:10px; padding:16px 24px; border-top:1px solid #e2e8f0; background:#f8fafc; border-radius:0 0 14px 14px; }
.btn-cancel { padding:8px 18px; border:1px solid #e2e8f0; border-radius:8px; background:#fff; color:#475569; font-size:13px; font-weight:500; cursor:pointer; font-family:'Inter',sans-serif; }
.btn-cancel:hover { background:#f1f5f9; }
.btn-primary { padding:8px 20px; border:none; border-radius:8px; background:#4f46e5; color:#fff; font-size:13px; font-weight:600; cursor:pointer; font-family:'Inter',sans-serif; }
.btn-primary:hover { background:#4338ca; }

@keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
@media (max-width:768px) { .tl-sidebar-cell { width:130px; min-width:130px; } .today-line-wrap { left:130px; } }
</style>