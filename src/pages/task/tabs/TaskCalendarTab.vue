<template>
  <div class="cal-root">
    <div class="tab-toolbar">
      <div class="cal-nav">
        <button class="icon-sq-btn" @click="prevMonth">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="cal-month-label">{{ monthLabel }}</span>
        <button class="icon-sq-btn" @click="nextMonth">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <button class="toolbar-btn" @click="goToday">Today</button>
    </div>

    <div class="cal-day-headers">
      <div v-for="d in dayNames" :key="d" class="day-hdr">{{ d }}</div>
    </div>

    <div class="cal-grid">
      <div v-for="(cell, i) in calCells" :key="i"
        class="cal-cell"
        :class="{ 'other-month': !cell.current, 'is-today': cell.isToday }">
        <div class="cell-num">{{ cell.day }}</div>
        <div v-for="task in cell.tasks.slice(0, 2)" :key="task.id" class="cell-task" :class="`ct-${task.color}`">
          {{ task.name }}
        </div>
        <div v-if="cell.tasks.length > 2" class="cell-more">+{{ cell.tasks.length - 2 }} more</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const today = new Date()
const viewYear  = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthLabel = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
)

const sampleTasks = [
  { id: 1, day: 5,  name: 'Partner updates',   color: 'indigo' },
  { id: 2, day: 5,  name: 'API spec review',    color: 'blue'   },
  { id: 3, day: 10, name: 'Sprint planning',    color: 'green'  },
  { id: 4, day: 14, name: 'Perf dashboard',     color: 'amber'  },
  { id: 5, day: 14, name: 'Design review',      color: 'purple' },
  { id: 6, day: 14, name: 'Backlog grooming',   color: 'indigo' },
  { id: 7, day: 20, name: 'Retro action items', color: 'green'  },
  { id: 8, day: 25, name: 'Release prep',       color: 'red'    },
]

const calCells = computed(() => {
  const y = viewYear.value, m = viewMonth.value
  const firstDay = new Date(y, m, 1).getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const daysInPrev  = new Date(y, m, 0).getDate()
  const cells = []

  // prev month padding
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, current: false, isToday: false, tasks: [] })

  // current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = y === today.getFullYear() && m === today.getMonth() && d === today.getDate()
    cells.push({
      day: d, current: true, isToday,
      tasks: sampleTasks.filter(t => t.day === d),
    })
  }

  // next month padding
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++)
    cells.push({ day: d, current: false, isToday: false, tasks: [] })

  return cells
})

function prevMonth() {
  if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- }
  else viewMonth.value--
}
function nextMonth() {
  if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ }
  else viewMonth.value++
}
function goToday() {
  viewYear.value  = today.getFullYear()
  viewMonth.value = today.getMonth()
}
</script>

<style scoped>
.cal-root { display:flex; flex-direction:column; height:100%; font-family:'Inter',sans-serif; background:#f8fafc; overflow:hidden; }
.cal-nav { display:flex; align-items:center; gap:8px; }
.cal-month-label { font-size:14px; font-weight:700; color:#0f172a; min-width:160px; text-align:center; }
.cal-day-headers { display:grid; grid-template-columns:repeat(7,1fr); background:#fff; border-bottom:1px solid #e2e8f0; flex-shrink:0; }
.day-hdr { padding:8px 0; text-align:center; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:.04em; }
.cal-grid { flex:1; display:grid; grid-template-columns:repeat(7,1fr); grid-template-rows:repeat(6,1fr); overflow:hidden; }
.cal-cell { border-right:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0; padding:6px 8px; display:flex; flex-direction:column; gap:3px; min-height:0; overflow:hidden; background:#fff; transition:background .1s; }
.cal-cell:hover { background:#f8fafc; }
.cal-cell:nth-child(7n) { border-right:none; }
.other-month { background:#f8fafc; }
.other-month .cell-num { color:#cbd5e1; }
.is-today .cell-num { background:#4f46e5; color:#fff; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; }
.cell-num { font-size:12px; font-weight:500; color:#475569; margin-bottom:2px; }
.cell-task { font-size:10.5px; font-weight:500; padding:2px 6px; border-radius:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.ct-indigo { background:#eef2ff; color:#4f46e5; }
.ct-blue   { background:#eff6ff; color:#2563eb; }
.ct-green  { background:#f0fdf4; color:#16a34a; }
.ct-amber  { background:#fffbeb; color:#d97706; }
.ct-purple { background:#faf5ff; color:#7c3aed; }
.ct-red    { background:#fef2f2; color:#ef4444; }
.cell-more { font-size:10px; color:#94a3b8; font-weight:500; }
</style>
