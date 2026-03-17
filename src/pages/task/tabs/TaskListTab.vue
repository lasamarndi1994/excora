<template>
  <div class="list-root">
    <div class="list-wrap">
      <table class="list-table">
        <thead>
          <tr>
            <th style="width:44%">Name</th>
            <th style="width:13%">Due date</th>
            <th style="width:18%">Assignees</th>
            <th style="width:13%">Project</th>
            <th style="width:12%">Priority</th>
          </tr>
        </thead>
        <tbody>
          <!-- Group header -->
          <tr class="group-row">
            <td colspan="5">
              <div class="group-label" @click="collapsed = !collapsed">
                <v-icon size="15" :style="{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)', transition: 'transform .2s' }">mdi-menu-down</v-icon>
                Recently assigned
                <span class="group-count">{{ tasks.length }}</span>
              </div>
            </td>
          </tr>

          <template v-if="!collapsed">
            <tr v-for="(task, i) in tasks" :key="task.id"
              class="list-row"
              :style="{ animationDelay: i * 35 + 'ms' }"
              @click="selected = task">
              <td class="name-cell">
                <button class="check-btn" :class="{ done: task.done }" @click.stop="task.done = !task.done">
                  <v-icon size="14">{{ task.done ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                </button>
                <span class="t-name" :class="{ 'is-done': task.done }">{{ task.name }}</span>
                <span v-if="task.comments" class="cmt-badge">
                  <v-icon size="11">mdi-message-outline</v-icon>{{ task.comments }}
                </span>
              </td>
              <td class="due-cell" :class="{ overdue: task.overdue }">
                <template v-if="task.due">
                  <v-icon size="11" style="margin-right:3px">mdi-calendar-outline</v-icon>{{ task.due }}
                </template>
                <span v-else style="color:#cbd5e1">—</span>
              </td>
              <td>
                <div class="avatar-stack">
                  <div v-for="(a, ai) in task.assignees" :key="ai"
                    class="mini-av" :style="{ background: a.bg, zIndex: task.assignees.length - ai }">
                    <img v-if="a.img" :src="a.img" :alt="a.initials" />
                    <span v-else>{{ a.initials }}</span>
                  </div>
                </div>
              </td>
              <td>
                <span v-if="task.project" class="proj-chip">{{ task.project }}</span>
              </td>
              <td>
                <span v-if="task.priority" class="prio-pill" :class="`prio-${task.priority.toLowerCase()}`">
                  {{ task.priority }}
                </span>
              </td>
            </tr>

            <!-- Add task row -->
            <tr class="add-row" @click="addTask">
              <td colspan="5">
                <span class="add-inner"><v-icon size="13">mdi-plus</v-icon> Add task</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

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
          <div class="d-meta-row"><v-icon size="13">mdi-calendar-outline</v-icon> {{ selected.due || 'No due date' }}</div>
          <div class="d-meta-row"><v-icon size="13">mdi-account-outline</v-icon> Unassigned</div>
          <div v-if="selected.project" class="d-meta-row"><v-icon size="13">mdi-folder-outline</v-icon> {{ selected.project }}</div>
          <div class="d-desc">No description yet.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface Task {
  id: number; name: string; done: boolean; due?: string; overdue?: boolean
  comments?: number; project?: string; priority?: string
  assignees: { img?: string; initials?: string; bg: string }[]
}

const collapsed = ref(false)
const selected  = ref<Task | null>(null)

const tasks = reactive<Task[]>([
  {
    id: 1, name: 'Partner library task updates', done: false, due: '29 Jan',
    comments: 2, project: 'Execora', priority: 'High',
    assignees: [{ img: 'https://i.pravatar.cc/150?img=11', bg: '#e0e7ff' }, { initials: 'PR', bg: '#fce7f3' }],
  },
  {
    id: 2, name: 'Mutual Fund - Backoffice', done: false,
    project: 'Finance', priority: 'Medium',
    assignees: [{ initials: 'AP', bg: '#fed7aa' }, { initials: 'SM', bg: '#fef3c7' }, { initials: 'RR', bg: '#fde68a' }],
  },
  {
    id: 3, name: 'Performance Dashboard Requirement and Implementation', done: false,
    due: 'Friday', overdue: true, comments: 16, project: 'Analytics', priority: 'High',
    assignees: [{ initials: 'Ma', bg: '#fce7f3' }, { initials: 'Ha', bg: '#cffafe' }, { initials: 'RR', bg: '#ede9fe' }],
  },
  {
    id: 4, name: 'Sprint 24 retrospective action items', done: true, due: 'Mar 10',
    project: 'Execora', priority: 'Low',
    assignees: [{ initials: 'DB', bg: '#d1fae5' }],
  },
  {
    id: 5, name: 'API rate limit strategy discussion', done: false, due: 'Mar 18',
    project: 'Backend', priority: 'Medium',
    assignees: [{ initials: 'SJ', bg: '#e0e7ff' }, { initials: 'AP', bg: '#fed7aa' }],
  },
])

let nextId = 50
function addTask() {
  tasks.push({ id: nextId++, name: 'New task', done: false, assignees: [] })
}
</script>

<style scoped>
.list-root { display: flex; flex-direction: column; height: 100%; overflow: hidden; font-family: 'Inter', sans-serif; }
.list-wrap { flex: 1; overflow-y: auto; padding: 16px 24px; }

.list-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
.list-table thead th {
  padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600;
  color: #94a3b8; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase; letter-spacing: .04em;
}
.group-row td { padding: 0; }
.group-label {
  display: flex; align-items: center; gap: 6px; padding: 9px 14px;
  font-size: 12px; font-weight: 700; color: #475569;
  background: #f8fafc; border-bottom: 1px solid #e2e8f0; cursor: pointer;
  user-select: none;
}
.group-label:hover { background: #f1f5f9; }
.group-count { background: #e2e8f0; color: #64748b; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 20px; }

.list-row { cursor: pointer; animation: fadeUp .22s ease both; }
.list-row:hover td { background: #f8fafc; }
.list-row td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; font-size: 13px; }

.name-cell { display: flex; align-items: center; gap: 8px; }
.check-btn {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; border-radius: 50%; border: none; background: none;
  cursor: pointer; color: #cbd5e1; flex-shrink: 0; transition: color .15s;
}
.check-btn:hover { color: #6366f1; }
.check-btn.done { color: #10b981; }
.t-name { font-size: 13px; font-weight: 500; color: #0f172a; }
.is-done { text-decoration: line-through; color: #94a3b8; }
.cmt-badge { display: inline-flex; align-items: center; gap: 3px; font-size: 11px; color: #94a3b8; }
.due-cell { font-size: 12px; color: #64748b; white-space: nowrap; }
.due-cell.overdue { color: #ef4444; font-weight: 600; }

.avatar-stack { display: flex; }
.mini-av {
  width: 24px; height: 24px; border-radius: 50%; border: 2px solid #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; color: #475569;
  margin-right: -6px; overflow: hidden; flex-shrink: 0;
}
.mini-av:last-child { margin-right: 0; }
.mini-av img { width: 100%; height: 100%; object-fit: cover; }

.proj-chip { font-size: 11px; font-weight: 500; background: #eef2ff; color: #4f46e5; padding: 2px 8px; border-radius: 20px; }
.prio-pill { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
.prio-high   { background: #fef2f2; color: #ef4444; }
.prio-medium { background: #fffbeb; color: #d97706; }
.prio-low    { background: #f0fdf4; color: #16a34a; }

.add-row { cursor: pointer; }
.add-row:hover td { background: #f8fafc; }
.add-row td { padding: 9px 14px; border-top: 1px dashed #e2e8f0; }
.add-inner { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; color: #94a3b8; transition: color .12s; }
.add-row:hover .add-inner { color: #4f46e5; }

/* Drawer */
.drawer-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.2); z-index: 200; display: flex; justify-content: flex-end; }
.drawer { width: 360px; background: #fff; height: 100%; box-shadow: -4px 0 24px rgba(0,0,0,.1); display: flex; flex-direction: column; animation: slideIn .2s ease; }
.drawer-hd { display: flex; align-items: center; gap: 10px; padding: 16px 18px; border-bottom: 1px solid #e2e8f0; }
.drawer-title { flex: 1; font-size: 14px; font-weight: 600; color: #0f172a; line-height: 1.4; }
.drawer-close { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; border: none; background: none; color: #94a3b8; cursor: pointer; transition: background .12s; }
.drawer-close:hover { background: #f1f5f9; }
.drawer-bd { flex: 1; overflow-y: auto; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; }
.d-meta-row { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #64748b; }
.d-desc { font-size: 12.5px; color: #94a3b8; background: #f8fafc; border-radius: 8px; padding: 12px; margin-top: 4px; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
</style>
