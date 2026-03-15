<template>
  <div class="board-root">
    <div v-for="col in columns" :key="col.id" class="board-col">
      <div class="col-hd">
        <div class="col-hd-left">
          <span class="col-dot" :style="{ background: col.color }"></span>
          <span class="col-title">{{ col.title }}</span>
          <span class="col-count">{{ col.tasks.length }}</span>
        </div>
        <button class="col-menu"><v-icon size="15">mdi-dots-horizontal</v-icon></button>
      </div>

      <div class="col-body">
        <div v-for="(task, i) in col.tasks" :key="task.id"
          class="b-card"
          :style="{ animationDelay: i * 45 + 'ms' }"
          @click="selected = task">
          <div class="bc-top">
            <button class="check-btn" :class="{ done: task.done }" @click.stop="task.done = !task.done">
              <v-icon size="14">{{ task.done ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
            </button>
            <span class="bc-name" :class="{ 'is-done': task.done }">{{ task.name }}</span>
          </div>
          <div v-if="task.tag" class="bc-tag" :style="{ background: tagBg(task.tagColor), color: tagFg(task.tagColor) }">
            {{ task.tag }}
          </div>
          <div class="bc-foot">
            <span class="bc-date">{{ task.date }}</span>
            <div class="bc-meta">
              <span v-if="task.likes" class="bc-mi"><v-icon size="11">mdi-thumb-up-outline</v-icon>{{ task.likes }}</span>
              <span v-if="task.comments" class="bc-mi"><v-icon size="11">mdi-message-outline</v-icon>{{ task.comments }}</span>
            </div>
          </div>
        </div>

        <button class="col-add" @click="addTask(col.id)">
          <v-icon size="13">mdi-plus</v-icon> Add task
        </button>
      </div>
    </div>

    <button class="add-section" @click="addSection">
      <v-icon size="13">mdi-plus</v-icon> Add section
    </button>

    <!-- Detail drawer -->
    <div v-if="selected" class="drawer-overlay" @click.self="selected = null">
      <div class="drawer">
        <div class="drawer-hd">
          <button class="check-btn" :class="{ done: selected.done }" @click="selected.done = !selected.done">
            <v-icon size="16">{{ selected.done ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
          </button>
          <span class="drawer-title">{{ selected.name }}</span>
          <button class="drawer-close" @click="selected = null"><v-icon size="15">mdi-close</v-icon></button>
        </div>
        <div class="drawer-bd">
          <div v-if="selected.tag" class="d-tag"
            :style="{ background: tagBg(selected.tagColor), color: tagFg(selected.tagColor) }">
            {{ selected.tag }}
          </div>
          <div class="d-meta-row"><v-icon size="13">mdi-calendar-outline</v-icon>{{ selected.date || 'No due date' }}</div>
          <div class="d-meta-row"><v-icon size="13">mdi-account-outline</v-icon>Unassigned</div>
          <div class="d-desc">No description yet.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Task {
  id: number; name: string; done: boolean
  tag?: string; tagColor?: string; date?: string; likes?: number; comments?: number
}
interface Col { id: string; title: string; color: string; tasks: Task[] }

const selected = ref<Task | null>(null)

const columns = reactive<Col[]>([
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

const tagMap: Record<string, [string, string]> = {
  green: ['#f0fdf4', '#16a34a'], blue: ['#eff6ff', '#2563eb'],
  red:   ['#fef2f2', '#ef4444'], amber: ['#fffbeb', '#d97706'],
}
const tagBg = (c?: string) => tagMap[c ?? '']?.[0] ?? '#f1f5f9'
const tagFg = (c?: string) => tagMap[c ?? '']?.[1] ?? '#475569'

let nid = 200
function addTask(colId: string) {
  const col = columns.find(c => c.id === colId)
  if (!col) return
  col.tasks.push({ id: nid++, name: 'New task', done: false,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) })
}
function addSection() {
  columns.push({ id: `s-${Date.now()}`, title: 'New section', color: '#cbd5e1', tasks: [] })
}
</script>

<style scoped>
.board-root {
  display: flex; gap: 14px; height: 100%;
  padding: 16px 24px; overflow-x: auto; overflow-y: hidden;
  align-items: flex-start; font-family: 'Inter', sans-serif;
}
.board-col {
  width: 252px; min-width: 252px; flex-shrink: 0;
  background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;
  display: flex; flex-direction: column; max-height: 100%; overflow: hidden;
}
.col-hd {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px 10px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0;
}
.col-hd-left { display: flex; align-items: center; gap: 7px; }
.col-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.col-title { font-size: 13px; font-weight: 600; color: #0f172a; }
.col-count { font-size: 11px; font-weight: 600; background: #f1f5f9; color: #64748b; padding: 1px 6px; border-radius: 20px; }
.col-menu { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 6px; border: none; background: none; color: #94a3b8; cursor: pointer; transition: background .12s; }
.col-menu:hover { background: #f1f5f9; }

.col-body { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 8px; }

.b-card {
  background: #fff; border-radius: 10px; border: 1px solid #e2e8f0;
  padding: 10px 12px; cursor: pointer;
  animation: fadeUp .22s ease both;
  transition: border-color .15s, box-shadow .15s, transform .15s;
}
.b-card:hover { border-color: #a5b4fc; box-shadow: 0 4px 14px rgba(79,70,229,.08); transform: translateY(-1px); }

.bc-top { display: flex; align-items: flex-start; gap: 7px; margin-bottom: 7px; }
.check-btn {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%; border: none; background: none;
  cursor: pointer; color: #cbd5e1; flex-shrink: 0; transition: color .15s;
}
.check-btn:hover { color: #6366f1; }
.check-btn.done { color: #10b981; }
.bc-name { font-size: 12.5px; font-weight: 500; color: #0f172a; line-height: 1.4; }
.is-done { text-decoration: line-through; color: #94a3b8; }
.bc-tag { display: inline-block; font-size: 10.5px; font-weight: 600; padding: 2px 8px; border-radius: 20px; margin-bottom: 7px; }
.bc-foot { display: flex; align-items: center; justify-content: space-between; }
.bc-date { font-size: 11px; color: #94a3b8; }
.bc-meta { display: flex; gap: 8px; }
.bc-mi { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: #94a3b8; }

.col-add {
  display: flex; align-items: center; gap: 5px; padding: 7px 10px; border-radius: 8px;
  border: 1px dashed #e2e8f0; background: none; font-size: 12px; color: #94a3b8;
  cursor: pointer; font-family: 'Inter', sans-serif; width: 100%;
  transition: border-color .12s, color .12s, background .12s;
}
.col-add:hover { border-color: #a5b4fc; color: #4f46e5; background: #fafafe; }

.add-section {
  display: inline-flex; align-items: center; gap: 5px; padding: 10px 14px;
  border-radius: 10px; border: 1px dashed #e2e8f0; background: #fff;
  font-size: 12.5px; color: #94a3b8; cursor: pointer; font-family: 'Inter', sans-serif;
  white-space: nowrap; flex-shrink: 0; align-self: flex-start;
  transition: border-color .12s, color .12s;
}
.add-section:hover { border-color: #a5b4fc; color: #4f46e5; }

/* Drawer */
.drawer-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.2); z-index: 200; display: flex; justify-content: flex-end; }
.drawer { width: 360px; background: #fff; height: 100%; box-shadow: -4px 0 24px rgba(0,0,0,.1); display: flex; flex-direction: column; animation: slideIn .2s ease; }
.drawer-hd { display: flex; align-items: center; gap: 10px; padding: 16px 18px; border-bottom: 1px solid #e2e8f0; }
.drawer-title { flex: 1; font-size: 14px; font-weight: 600; color: #0f172a; line-height: 1.4; }
.drawer-close { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; border: none; background: none; color: #94a3b8; cursor: pointer; transition: background .12s; }
.drawer-close:hover { background: #f1f5f9; }
.drawer-bd { flex: 1; overflow-y: auto; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; }
.d-tag { display: inline-block; font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 20px; }
.d-meta-row { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #64748b; }
.d-desc { font-size: 12.5px; color: #94a3b8; background: #f8fafc; border-radius: 8px; padding: 12px; margin-top: 4px; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
</style>
