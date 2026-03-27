<template>
  <div class="dash">

    <!-- Header -->
    <div class="dash-header">
      <div>
        <h1 class="dash-title">Project Manager Dashboard</h1>
        <p class="dash-sub">Timelines, Resources &amp; Risk Management</p>
      </div>
      <button class="action-btn" @click="isCreateTaskDialogOpen = true">
        <v-icon size="14" class="mr-1">mdi-plus</v-icon>New Project
      </button>
    </div>

    <!-- Stat cards -->
    <div class="stat-row">
      <div v-for="stat in metrics" :key="stat.label" class="stat-card" :style="{ '--accent': stat.accent }">
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
          <span class="stat-period">vs last sprint</span>
        </div>
        <div class="stat-glow" :style="{ background: stat.accent }"></div>
      </div>
    </div>

    <!-- Active Projects -->
    <div class="projects-grid mb-section">
      <div v-for="(project, i) in projects" :key="i" class="panel project-card">
        <div class="project-card-inner">
          <div class="d-flex align-center" style="justify-content: space-between; margin-bottom: 12px;">
            <span class="status-chip" :class="`chip-${project.chipClass}`">{{ project.status }}</span>
            <img
              :src="`https://ui-avatars.com/api/?name=${project.lead}&background=random&size=32`"
              class="lead-avatar"
              :alt="project.lead"
            />
          </div>
          <div class="project-name">{{ project.name }}</div>
          <div class="project-desc">{{ project.description }}</div>
          <div class="prog-label">
            <span>Progress</span><span>{{ project.progress }}%</span>
          </div>
          <div class="prog-bar">
            <div class="prog-fill" :style="{ width: project.progress + '%', background: project.accent }"></div>
          </div>
          <div class="project-footer">
            <span class="project-meta">
              <v-icon size="12" class="mr-1">mdi-calendar-clock</v-icon>{{ project.deadline }}
            </span>
            <span class="project-meta">
              <v-icon size="12" class="mr-1">mdi-account-group-outline</v-icon>{{ project.teamSize }} members
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Roadmap + Risks -->
    <div class="dash-grid wide mb-section">

      <!-- Roadmap -->
      <div class="panel">
        <div class="panel-head">
          <div class="d-flex align-center gap-2">
            <div class="panel-icon-dot" style="background:#4f46e5"></div>
            <span class="panel-title">Project Roadmap</span>
          </div>
          <div class="quarter-nav">
            <button class="quarter-btn">&#8249;</button>
            <span class="quarter-label">Q1 2026</span>
            <button class="quarter-btn">&#8250;</button>
          </div>
        </div>
        <div class="gantt-wrap">
          <div v-for="(item, i) in roadmap" :key="i" class="gantt-row">
            <div class="gantt-name">{{ item.name }}</div>
            <div class="gantt-track">
              <div class="gantt-grid-line" style="left:25%"></div>
              <div class="gantt-grid-line" style="left:50%"></div>
              <div class="gantt-grid-line" style="left:75%"></div>
              <div
                class="gantt-bar"
                :style="`left:${item.start}%; width:${item.width}%; background: ${ganttColors[item.color]}`"
              >{{ item.phase }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Critical Risks -->
      <div class="panel">
        <div class="panel-head">
          <div class="d-flex align-center gap-2">
            <div class="panel-icon-dot" style="background:#ef4444"></div>
            <span class="panel-title" style="color:#ef4444;">Critical Risks</span>
          </div>
        </div>
        <div style="padding: 12px 16px;">
          <div v-for="(risk, i) in risks" :key="i" class="risk-row">
            <div class="risk-title">
              <v-icon size="14" color="error" class="mr-1">mdi-alert-decagram</v-icon>{{ risk.title }}
            </div>
            <div class="risk-impact">{{ risk.impact }}</div>
          </div>
        </div>
        <div class="view-all-wrap">
          <button class="view-all-btn">View Full Risk Register</button>
        </div>
      </div>

    </div>

    <!-- Resource Allocation -->
    <div class="panel">
      <div class="panel-head">
        <div class="d-flex align-center gap-2">
          <div class="panel-icon-dot" style="background:#06b6d4"></div>
          <span class="panel-title">Resource Allocation</span>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Resource</th>
              <th>Role</th>
              <th class="text-center">Project A</th>
              <th class="text-center">Project B</th>
              <th class="text-center">Maintenance</th>
              <th class="text-center">Total Load</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="res in resources" :key="res.name">
              <td class="font-medium">{{ res.name }}</td>
              <td style="color:#64748b; font-size:11.5px;">{{ res.role }}</td>
              <td class="text-center">
                <span v-if="res.projA" class="status-chip chip-info">{{ res.projA }}%</span>
              </td>
              <td class="text-center">
                <span v-if="res.projB" class="status-chip chip-warning">{{ res.projB }}%</span>
              </td>
              <td class="text-center">
                <span v-if="res.maint" class="status-chip chip-grey">{{ res.maint }}%</span>
              </td>
              <td class="text-center">
                <span class="status-chip" :class="res.total > 100 ? 'chip-error' : 'chip-success'">
                  {{ res.total }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Task Dialog -->
    <v-dialog v-model="isCreateTaskDialogOpen" max-width="800" scrollable scroll-strategy="none">
      <v-card class="rounded-md">
        <v-card-title class="d-flex align-center justify-space-between pa-4 border-b">
          <span class="text-h6 font-weight-bold">Create Task</span>
          <div class="d-flex align-center gap-2">
            <v-btn icon="mdi-minus" variant="text" density="comfortable" size="small"></v-btn>
            <v-btn icon="mdi-arrow-expand-all" variant="text" density="comfortable" size="small"></v-btn>
            <v-btn icon="mdi-dots-horizontal" variant="text" density="comfortable" size="small"></v-btn>
            <v-btn icon="mdi-close" variant="text" density="comfortable" size="small" @click="isCreateTaskDialogOpen = false"></v-btn>
          </div>
        </v-card-title>

        <v-card-text class="pa-6" style="max-height: 70vh;">
          <div class="text-body-2 text-medium-emphasis mb-6">
            Required fields are marked with an asterisk <span class="text-error">*</span>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Space <span class="text-error">*</span></label>
            <v-select v-model="newTask.space" :items="['Execora (EX)']" variant="outlined" density="compact" :width="500" hide-details bg-color="white">
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="20" class="mr-2" color="blue-lighten-4" rounded="sm">
                    <v-icon size="14" color="blue-darken-2">mdi-checkbox-blank</v-icon>
                  </v-avatar>
                  {{ (item as any).title }}
                </div>
              </template>
            </v-select>
          </div>

          <div class="mb-2">
            <label class="text-body-2 font-weight-bold d-block mb-2">Work type <span class="text-error">*</span></label>
            <v-select v-model="newTask.workType" :items="['Task', 'Bug', 'Story']" variant="outlined" density="compact" :width="500" hide-details bg-color="white">
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="16" color="blue" class="mr-2">mdi-checkbox-marked</v-icon>
                  {{ (item as any).title }}
                </div>
              </template>
            </v-select>
          </div>
          <a href="#" class="text-caption text-primary text-decoration-none d-flex align-center mb-6">
            Learn about work types <v-icon size="14" class="ml-1">mdi-open-in-new</v-icon>
          </a>

          <v-divider class="mb-6"></v-divider>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Status</label>
            <v-menu :close-on-content-click="true" location="bottom start" offset="4">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" variant="flat" color="grey-lighten-3" class="text-none font-weight-bold text-body-2 mb-2 px-3" height="32">
                  {{ newTask.status }} <v-icon end size="16" class="ml-1">mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list density="compact" class="py-2 border" elevation="2" min-width="220" bg-color="white">
                <v-list-item link @click="newTask.status = 'To Do'" class="py-1">
                  <div class="d-inline-flex align-center bg-grey-lighten-3 text-grey-darken-3 px-2 rounded-sm font-weight-bold" style="font-size:11px;height:20px;">TO DO</div>
                </v-list-item>
                <v-list-item link @click="newTask.status = 'IN PROGRESS'" class="py-1">
                  <div class="d-inline-flex align-center bg-blue-lighten-4 text-blue-darken-3 px-2 rounded-sm font-weight-bold" style="font-size:11px;height:20px;">IN PROGRESS</div>
                </v-list-item>
                <v-list-item link @click="newTask.status = 'TEST'" class="py-1">
                  <div class="d-inline-flex align-center bg-blue-lighten-4 text-blue-darken-3 px-2 rounded-sm font-weight-bold" style="font-size:11px;height:20px;">TEST</div>
                </v-list-item>
                <v-list-item link @click="newTask.status = 'DONE'" class="py-1">
                  <div class="d-inline-flex align-center bg-light-green-lighten-4 text-green-darken-4 px-2 rounded-sm font-weight-bold" style="font-size:11px;height:20px;">DONE</div>
                </v-list-item>
              </v-list>
            </v-menu>
            <div class="text-caption text-medium-emphasis">This is the initial status upon creation</div>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Summary <span class="text-error">*</span></label>
            <v-text-field v-model="newTask.summary" variant="outlined" density="compact" hide-details></v-text-field>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Description</label>
            <div class="border rounded-md bg-surface">
              <QuillEditor :content="newTask.description" @update:content="newTask.description = $event" :modules="modules" placeholder="Add a description..." />
            </div>
          </div>

          <div class="mb-6">
            <div class="d-flex align-center justify-space-between mb-2">
              <label class="text-body-2 font-weight-bold">Assignee</label>
              <a @click="newTask.assignee = 'Unassigned'" class="text-caption text-primary text-decoration-none cursor-pointer">Assign to me</a>
            </div>
            <v-select v-model="newTask.assignee" :items="['Unassigned']" variant="outlined" density="compact" hide-details bg-color="white">
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="24" color="grey-lighten-2" class="mr-2">
                    <v-icon size="16" color="grey-darken-1">mdi-account-outline</v-icon>
                  </v-avatar>
                  {{ (item as any).title }}
                </div>
              </template>
            </v-select>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Sprint</label>
            <v-select placeholder="Select sprint" :items="['Sprint 1', 'Sprint 2', 'Sprint 3']" variant="outlined" width="500" density="compact" hide-details bg-color="white"></v-select>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Story point estimate</label>
            <v-text-field variant="outlined" density="compact" hide-details bg-color="white" width="500"></v-text-field>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Reporter <span class="text-error">*</span></label>
            <v-select v-model="newTask.reporter" :items="['Lasa Marandi']" variant="outlined" width="500" density="compact" hide-details bg-color="white">
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="24" color="deep-orange" class="text-white text-caption mr-2 font-weight-bold">LM</v-avatar>
                  {{ (item as any).title }}
                </div>
              </template>
            </v-select>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Flagged</label>
            <v-checkbox v-model="newTask.isFlagged" label="Impediment" color="primary" hide-details density="compact"></v-checkbox>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4 d-flex justify-space-between bg-grey-lighten-5">
          <v-checkbox v-model="createAnother" label="Create another" color="primary" hide-details density="compact" class="ma-0 pa-0"></v-checkbox>
          <div class="d-flex gap-3">
            <v-btn variant="text" class="text-none font-weight-medium text-medium-emphasis" @click="isCreateTaskDialogOpen = false">Cancel</v-btn>
            <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-6">Create</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import QuillEditor from '@/components/QuillEditor.vue'
import { useTaskStore } from '@/stores/taskStore'

const isCreateTaskDialogOpen = ref(false)
const createAnother = ref(false)

const taskStore = useTaskStore()
const modules = {
  mention: {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    mentionDenotationChars: ['@'],
    source: function (searchTerm: string, renderList: Function) {
      const values = taskStore.users.map(u => ({ id: u.id, value: u.name }))
      if (searchTerm.length === 0) {
        renderList(values, searchTerm)
      } else {
        const matches = values.filter(v => v.value.toLowerCase().includes(searchTerm.toLowerCase()))
        renderList(matches, searchTerm)
      }
    },
  }
}

const newTask = ref({
  space: 'Execora (EX)',
  workType: 'Task',
  status: 'To Do',
  summary: '',
  description: '',
  assignee: 'Unassigned',
  reporter: 'Lasa Marandi',
  isFlagged: false,
})

const metrics = [
  { label: 'Active Projects', value: '3',   icon: 'mdi-briefcase-outline',    iconColor: '#4f46e5', iconBg: '#eef2ff', accent: '#4f46e5', pct: 75, trend: '+1 this month', trendUp: true },
  { label: 'On Track',        value: '1',   icon: 'mdi-check-circle-outline', iconColor: '#10b981', iconBg: '#f0fdf4', accent: '#10b981', pct: 33, trend: 'stable',        trendUp: true },
  { label: 'At Risk',         value: '1',   icon: 'mdi-alert-outline',        iconColor: '#f59e0b', iconBg: '#fffbeb', accent: '#f59e0b', pct: 33, trend: '+1 this week',  trendUp: false },
  { label: 'Delayed',         value: '1',   icon: 'mdi-clock-alert-outline',  iconColor: '#ef4444', iconBg: '#fef2f2', accent: '#ef4444', pct: 33, trend: 'same as last',  trendUp: false },
]

const projects = [
  { name: 'Website Redesign',  description: 'Overhaul of the main corporate website with new branding.',          status: 'On Track', chipClass: 'success', accent: '#10b981', progress: 75, deadline: 'Mar 15', teamSize: 5, lead: 'Alice' },
  { name: 'Mobile App V2',     description: 'Adding biometric auth and dark mode support for iOS and Android.',   status: 'At Risk',  chipClass: 'warning', accent: '#f59e0b', progress: 40, deadline: 'Apr 01', teamSize: 8, lead: 'Bob' },
  { name: 'Backend Migration', description: 'Moving from legacy monolith to microservices architecture.',         status: 'Delayed',  chipClass: 'error',   accent: '#ef4444', progress: 20, deadline: 'May 30', teamSize: 6, lead: 'Charlie' },
]

const roadmap = [
  { name: 'Web Redesign', phase: 'Development', start: 20, width: 40, color: 'primary' },
  { name: 'Mobile App',   phase: 'Testing',     start: 50, width: 30, color: 'purple' },
  { name: 'Backend',      phase: 'Planning',    start: 0,  width: 25, color: 'info' },
]

const ganttColors: Record<string, string> = {
  primary: '#4f46e5',
  purple:  '#a855f7',
  info:    '#06b6d4',
}

const risks = [
  { title: 'API Rate Limits',   impact: 'Third-party vendor API limits may throttle syncing during peak hours.' },
  { title: 'Resource Shortage', impact: 'Senior frontend dev on medical leave for 2 weeks.' },
]

const resources = [
  { name: 'Sarah J.', role: 'Senior Dev',  projA: 50, projB: 0,  maint: 50, total: 100 },
  { name: 'Mike T.',  role: 'Designer',    projA: 80, projB: 20, maint: 0,  total: 100 },
  { name: 'Dave B.',  role: 'Backend Dev', projA: 0,  projB: 50, maint: 60, total: 110 },
]
</script>

<style scoped>
@import '@/styles/dashboard-shared.css';

.mb-section { margin-bottom: 14px; }

/* Projects grid */
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 640px) { .projects-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .projects-grid { grid-template-columns: repeat(3, 1fr); } }
.project-card-inner { padding: 18px; }
.lead-avatar {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
}
.project-name {
  font-size: 14px; font-weight: 700; color: #0f172a;
  margin-bottom: 6px;
}
.project-desc {
  font-size: 12px; color: #64748b; line-height: 1.5;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.prog-label {
  display: flex; justify-content: space-between;
  font-size: 11px; font-weight: 600; color: #64748b;
  margin-bottom: 6px;
}
.project-footer {
  display: flex; justify-content: space-between;
  margin-top: 14px; padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}
.project-meta {
  display: flex; align-items: center;
  font-size: 11.5px; color: #64748b; font-weight: 500;
}

/* Gantt */
.gantt-wrap { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.gantt-row { display: flex; align-items: center; gap: 12px; }
.gantt-name { width: 110px; font-size: 12px; font-weight: 600; color: #0f172a; flex-shrink: 0; }
.gantt-track {
  flex: 1; height: 34px; background: #f1f5f9;
  border-radius: 8px; position: relative; overflow: hidden;
}
.gantt-grid-line {
  position: absolute; top: 0; bottom: 0; width: 1px;
  background: rgba(0,0,0,0.06);
}
.gantt-bar {
  position: absolute; top: 10%; height: 80%;
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 600; color: #fff;
  padding: 0 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.12);
}


/* Risk rows */
.risk-row {
  background: #fef2f2; border: 1px solid #fecaca;
  border-radius: 10px; padding: 12px 14px; margin-bottom: 10px;
}
.risk-row:last-child { margin-bottom: 0; }
.risk-title {
  font-size: 12.5px; font-weight: 600; color: #ef4444;
  display: flex; align-items: center; margin-bottom: 4px;
}
.risk-impact { font-size: 11.5px; color: #64748b; line-height: 1.4; }

.text-center { text-align: center; }
</style>
