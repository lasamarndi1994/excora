<template>
  <v-container fluid class="pa-0 h-100 d-flex flex-column bg-white overflow-hidden">

    <!-- Header -->
    <div class="px-6 pt-5 pb-0 d-flex align-center justify-space-between">
      <div class="d-flex align-center gap-2">
        <v-avatar size="32" color="orange-darken-2" class="text-white font-weight-bold text-caption">LM</v-avatar>
        <h1 class="text-h6 font-weight-bold d-flex align-center cursor-pointer">
          My tasks
          <v-icon size="18" class="ml-1 text-medium-emphasis">mdi-chevron-down</v-icon>
        </h1>
      </div>
      <div class="d-flex gap-2">
        <v-btn variant="outlined" size="small" prepend-icon="mdi-lock-outline"
          class="text-none font-weight-medium text-medium-emphasis" color="medium-emphasis">Share</v-btn>
        <v-btn variant="outlined" size="small" prepend-icon="mdi-tune"
          class="text-none font-weight-medium text-medium-emphasis" color="medium-emphasis">Customize</v-btn>
      </div>
    </div>

    <!-- Tabs -->
    <div class="px-6 mt-2">
      <v-tabs v-model="activeTab" density="compact" color="primary" class="task-tabs">
        <v-tab value="list" class="text-none font-weight-medium px-3 text-body-2">
          <v-icon size="16" class="mr-1">mdi-format-list-bulleted</v-icon> List
        </v-tab>
        <v-tab value="board" class="text-none font-weight-medium px-3 text-body-2">
          <v-icon size="16" class="mr-1">mdi-view-column-outline</v-icon> Board
        </v-tab>
        <v-tab value="calendar" class="text-none font-weight-medium px-3 text-body-2">
          <v-icon size="16" class="mr-1">mdi-calendar-blank-outline</v-icon> Calendar
        </v-tab>
        <v-tab value="dashboard" class="text-none font-weight-medium px-3 text-body-2">
          <v-icon size="16" class="mr-1">mdi-view-dashboard-outline</v-icon> Dashboard
        </v-tab>
        <v-tab value="files" class="text-none font-weight-medium px-3 text-body-2">
          <v-icon size="16" class="mr-1">mdi-paperclip</v-icon> Files
        </v-tab>
        <v-btn icon="mdi-plus" variant="text" size="x-small" class="ml-1 align-self-center text-medium-emphasis" />
      </v-tabs>
      <v-divider />
    </div>

    <!-- Toolbar -->
    <div class="px-6 py-3 d-flex align-center justify-space-between">
      <div class="d-flex gap-1">
        <v-btn color="primary" size="small" class="text-none rounded-e-0 pr-2" prepend-icon="mdi-plus"
          elevation="0">Add task</v-btn>
        <v-btn color="primary" size="small" class="text-none rounded-s-0 px-1 border-s-thin border-white"
          elevation="0" style="min-width:28px">
          <v-icon size="16">mdi-chevron-down</v-icon>
        </v-btn>
      </div>
      <div class="d-flex align-center gap-1">
        <v-btn variant="text" size="small" prepend-icon="mdi-filter-variant"
          class="text-none text-medium-emphasis font-weight-medium px-2">Filter</v-btn>
        <v-btn variant="text" size="small" prepend-icon="mdi-swap-vertical"
          class="text-none text-medium-emphasis font-weight-medium px-2">Sort</v-btn>
        <v-btn variant="text" size="small" prepend-icon="mdi-group"
          class="text-none text-medium-emphasis font-weight-medium px-2">Group</v-btn>
        <v-divider vertical class="mx-1" style="height:16px" />
        <v-btn variant="text" size="small" prepend-icon="mdi-tune-vertical"
          class="text-none text-medium-emphasis font-weight-medium px-2">Options</v-btn>
        <v-btn icon="mdi-magnify" variant="text" size="small" class="text-medium-emphasis" />
      </div>
    </div>

    <!-- Tab Content -->
    <div class="flex-grow-1 overflow-hidden d-flex flex-column">
      <v-window v-model="activeTab" class="h-100 d-flex flex-column">

        <!-- ── LIST VIEW ── -->
        <v-window-item value="list" class="h-100 overflow-y-auto">
          <div class="px-6 pb-6">
            <v-card elevation="0" border class="overflow-hidden">
              <v-table class="tasks-table">
                <thead>
                  <tr>
                    <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:40%">Name</th>
                    <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:15%">Due date</th>
                    <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:20%">Collaborators</th>
                    <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:15%">Projects</th>
                    <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:10%">Visibility</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="group-header">
                    <td colspan="5" class="pa-0">
                      <div class="d-flex align-center px-4 py-2 cursor-pointer hover-bg-grey">
                        <v-icon size="18" class="mr-2">mdi-menu-down</v-icon>
                        <span class="font-weight-bold text-body-2">Recently assigned</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-for="task in listTasks" :key="task.id" class="task-row cursor-pointer">
                    <td class="pl-8 py-2">
                      <div class="d-flex align-center">
                        <v-icon size="16" class="mr-2 text-medium-emphasis">mdi-check-circle-outline</v-icon>
                        <span class="text-body-2 font-weight-medium">{{ task.name }}</span>
                        <span v-if="task.comments" class="d-flex align-center ml-2 text-medium-emphasis">
                          <span class="text-caption mr-1">{{ task.comments }}</span>
                          <v-icon size="13">mdi-message-outline</v-icon>
                        </span>
                      </div>
                    </td>
                    <td class="text-body-2 text-medium-emphasis">{{ task.due }}</td>
                    <td class="py-2">
                      <div class="d-flex">
                        <v-avatar v-for="(a, i) in task.assignees" :key="i" size="22"
                          :color="a.color" class="avatar-stack" :class="`z-${i}`"
                          style="border:2px solid white">
                          <v-img v-if="a.img" :src="a.img" cover />
                          <span v-else class="text-caption font-weight-bold" style="font-size:9px">{{ a.initials }}</span>
                        </v-avatar>
                      </div>
                    </td>
                    <td></td>
                    <td class="text-caption text-medium-emphasis">
                      <v-icon size="14" class="mr-1">mdi-account-multiple-outline</v-icon>Collaborators
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </div>
        </v-window-item>

        <!-- ── BOARD VIEW ── -->
        <v-window-item value="board" class="h-100">
          <div class="d-flex h-100 overflow-x-auto px-4 pb-4 gap-3 pt-1">

            <!-- Dynamic columns -->
            <div v-for="col in boardColumns" :key="col.id"
              class="board-col d-flex flex-column flex-shrink-0">

              <!-- Column header -->
              <div class="d-flex align-center justify-space-between px-2 py-2 mb-1">
                <div class="d-flex align-center gap-2">
                  <span class="text-body-2 font-weight-semibold text-high-emphasis">{{ col.title }}</span>
                  <span class="text-caption text-medium-emphasis">{{ col.tasks.length }}</span>
                </div>
                <div class="d-flex align-center">
                  <v-btn icon="mdi-dots-horizontal" variant="text" size="x-small"
                    class="text-medium-emphasis" density="compact" />
                </div>
              </div>

              <!-- Task cards (scrollable) -->
              <div class="flex-grow-1 overflow-y-auto d-flex flex-column gap-2 px-1">
                <v-card v-for="task in col.tasks" :key="task.id"
                  class="task-card pa-3 cursor-pointer" elevation="0" border
                  @click="selectedTask = task; taskDialog = true">

                  <!-- Status dot + title -->
                  <div class="d-flex align-start gap-2 mb-2">
                    <v-icon size="16" :color="task.done ? 'success' : 'medium-emphasis'"
                      class="mt-1 flex-shrink-0">
                      {{ task.done ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                    </v-icon>
                    <span class="text-body-2 font-weight-medium text-high-emphasis"
                      style="line-height:1.4">{{ task.name }}</span>
                  </div>

                  <!-- Tag -->
                  <v-chip v-if="task.tag" size="x-small" :color="task.tagColor ?? 'grey'"
                    variant="tonal" class="mb-2 font-weight-medium">{{ task.tag }}</v-chip>

                  <!-- Footer -->
                  <div class="d-flex align-center justify-space-between mt-1">
                    <span class="text-caption text-medium-emphasis">{{ task.date }}</span>
                    <div class="d-flex align-center gap-2 text-medium-emphasis">
                      <span v-if="task.likes" class="d-flex align-center gap-1 text-caption">
                        {{ task.likes }}<v-icon size="13">mdi-thumb-up-outline</v-icon>
                      </span>
                      <span v-if="task.comments" class="d-flex align-center gap-1 text-caption">
                        {{ task.comments }}<v-icon size="13">mdi-message-outline</v-icon>
                      </span>
                    </div>
                  </div>
                </v-card>

                <!-- Add task row -->
                <div class="add-task-row d-flex align-center gap-2 px-2 py-2 cursor-pointer rounded"
                  @click="addTaskToColumn(col.id)">
                  <v-icon size="16" color="medium-emphasis">mdi-plus</v-icon>
                  <span class="text-body-2 text-medium-emphasis">Add task</span>
                </div>
              </div>
            </div>

            <!-- Add section -->
            <div class="flex-shrink-0 d-flex align-start pt-2">
              <v-btn variant="text" prepend-icon="mdi-plus"
                class="text-none text-medium-emphasis font-weight-medium"
                size="small" @click="addSection">
                Add section
              </v-btn>
            </div>

          </div>
        </v-window-item>

        <!-- ── CALENDAR (placeholder) ── -->
        <v-window-item value="calendar" class="h-100 d-flex align-center justify-center">
          <div class="text-center text-medium-emphasis">
            <v-icon size="56" class="mb-3 opacity-40">mdi-calendar-blank-outline</v-icon>
            <div class="text-body-1 font-weight-medium">Calendar view coming soon</div>
          </div>
        </v-window-item>

        <!-- ── DASHBOARD ── -->
        <v-window-item value="dashboard" class="overflow-y-auto" style="height:100%;max-height:100%">
          <div class="pa-4">

            <!-- Top bar -->
            <div class="d-flex align-center justify-space-between mb-4">
              <v-btn size="small" variant="outlined" prepend-icon="mdi-plus"
                class="text-none font-weight-medium text-medium-emphasis" color="medium-emphasis">
                Add widget
              </v-btn>
              <v-btn size="small" variant="text" class="text-none text-medium-emphasis">
                Send feedback
              </v-btn>
            </div>

            <!-- Stat cards row -->
            <v-row class="mb-4" dense>
              <v-col v-for="stat in statCards" :key="stat.label" cols="6" md="3">
                <v-card class="stat-card pa-5 d-flex flex-column align-center text-center" border elevation="0">
                  <div class="text-body-2 text-medium-emphasis mb-3">{{ stat.label }}</div>
                  <div class="stat-number font-weight-light mb-3">{{ stat.value }}</div>
                  <div class="d-flex align-center gap-1 text-caption text-medium-emphasis">
                    <v-icon size="13">mdi-filter-outline</v-icon>
                    {{ stat.filter }}
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Charts row 1 -->
            <v-row class="mb-4" dense>
              <!-- Total tasks by section (bar chart) -->
              <v-col cols="12" md="6">
                <v-card border elevation="0" class="pa-4">
                  <div class="text-body-2 font-weight-medium mb-4">Total tasks by section</div>
                  <div class="chart-area d-flex align-end gap-3 px-2 pb-2" style="height:160px">
                    <div v-for="bar in sectionBars" :key="bar.label"
                      class="d-flex flex-column align-center flex-grow-1 gap-1">
                      <span class="text-caption text-medium-emphasis">{{ bar.count }}</span>
                      <div class="bar-col rounded-t"
                        :style="{ height: bar.count ? (bar.count / maxSectionCount * 120) + 'px' : '3px',
                                  background: bar.count ? '#a5b4fc' : '#e2e8f0',
                                  width: '100%' }"></div>
                      <span class="text-caption text-medium-emphasis text-truncate" style="max-width:56px;font-size:10px">
                        {{ bar.label }}
                      </span>
                    </div>
                  </div>
                  <v-divider class="my-3" />
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-1 text-caption text-medium-emphasis">
                      <v-icon size="13">mdi-filter-outline</v-icon> 1 Filter
                    </div>
                    <v-btn size="x-small" variant="text" class="text-none text-medium-emphasis">See all</v-btn>
                  </div>
                </v-card>
              </v-col>

              <!-- Tasks by completion status (donut) -->
              <v-col cols="12" md="6">
                <v-card border elevation="0" class="pa-4">
                  <div class="text-body-2 font-weight-medium mb-4">Tasks by completion status this upcoming month</div>
                  <div class="d-flex align-center justify-center" style="height:160px">
                    <div class="donut-wrap" style="position:relative;width:130px;height:130px">
                      <svg viewBox="0 0 36 36" width="130" height="130">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" stroke-width="5" />
                        <circle v-if="completionTotal > 0" cx="18" cy="18" r="14" fill="none"
                          stroke="#a5b4fc" stroke-width="5"
                          :stroke-dasharray="`${completionPct} ${100 - completionPct}`"
                          stroke-dashoffset="25" stroke-linecap="round" />
                      </svg>
                      <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">
                        <span class="text-h6 font-weight-light text-medium-emphasis">{{ completionTotal }}</span>
                      </div>
                    </div>
                    <div class="ml-6 d-flex flex-column gap-2">
                      <div v-for="seg in completionSegments" :key="seg.label" class="d-flex align-center gap-2">
                        <div class="rounded-sm" :style="{ width:'10px', height:'10px', background: seg.color }"></div>
                        <span class="text-caption text-medium-emphasis">{{ seg.label }}</span>
                        <span class="text-caption font-weight-bold ml-auto pl-4">{{ seg.value }}</span>
                      </div>
                    </div>
                  </div>
                  <v-divider class="my-3" />
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-1 text-caption text-medium-emphasis">
                      <v-icon size="13">mdi-filter-outline</v-icon> 2 Filters
                    </div>
                    <v-btn size="x-small" variant="text" class="text-none text-medium-emphasis">See all</v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Charts row 2 -->
            <v-row dense>
              <!-- Total tasks by project (bar) -->
              <v-col cols="12" md="6">
                <v-card border elevation="0" class="pa-4">
                  <div class="text-body-2 font-weight-medium mb-3">Total tasks by project</div>

                  <div class="d-flex" style="height:160px">
                    <!-- Y-axis labels -->
                    <div class="d-flex flex-column justify-space-between text-right pr-2 pb-5 flex-shrink-0"
                      style="width:28px">
                      <span style="font-size:9px" class="text-disabled">{{ maxProjectCount }}</span>
                      <span style="font-size:9px" class="text-disabled">{{ Math.round(maxProjectCount / 2) }}</span>
                      <span style="font-size:9px" class="text-disabled">0</span>
                    </div>
                    <!-- Chart -->
                    <div class="flex-grow-1 d-flex flex-column">
                      <div class="flex-grow-1 d-flex align-end gap-3 px-1"
                        style="border-left:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0;">
                        <div v-for="bar in projectBars" :key="bar.label"
                          class="d-flex flex-column align-center flex-grow-1 gap-1">
                          <span style="font-size:10px" class="text-medium-emphasis font-weight-medium">{{ bar.count }}</span>
                          <div class="rounded-t w-100"
                            :style="{
                              height: bar.count ? (bar.count / maxProjectCount * 100) + '%' : '3px',
                              background: 'linear-gradient(180deg,#818cf8,#a5b4fc)',
                              minHeight: bar.count ? '8px' : '3px'
                            }"></div>
                        </div>
                      </div>
                      <!-- X labels -->
                      <div class="d-flex gap-3 px-1 mt-1">
                        <div v-for="bar in projectBars" :key="bar.label"
                          class="flex-grow-1 text-center text-truncate"
                          style="font-size:10px; color:#94a3b8; max-width:80px">
                          {{ bar.label }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <v-divider class="my-3" />
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-1 text-caption text-medium-emphasis">
                      <v-icon size="13">mdi-filter-outline</v-icon> No Filters
                    </div>
                    <v-btn size="x-small" variant="text" class="text-none text-medium-emphasis">See all</v-btn>
                  </div>
                </v-card>
              </v-col>

              <!-- Task completion over time (area line) -->
              <v-col cols="12" md="6">
                <v-card border elevation="0" class="pa-4">
                  <div class="text-body-2 font-weight-medium mb-3">Task completion over time</div>

                  <div class="d-flex" style="height:160px">
                    <!-- Y-axis labels -->
                    <div class="d-flex flex-column justify-space-between text-right pr-2 pb-5 flex-shrink-0"
                      style="width:20px">
                      <span style="font-size:9px" class="text-disabled">4</span>
                      <span style="font-size:9px" class="text-disabled">2</span>
                      <span style="font-size:9px" class="text-disabled">0</span>
                    </div>
                    <!-- Chart -->
                    <div class="flex-grow-1 d-flex flex-column min-width-0">
                      <div class="flex-grow-1 position-relative"
                        style="border-left:1px solid #e2e8f0; border-bottom:1px solid #e2e8f0; overflow:hidden">
                        <svg width="100%" height="100%" preserveAspectRatio="none"
                          :viewBox="`0 0 ${svgW} ${svgH}`">
                          <!-- Grid lines -->
                          <line x1="0" :y1="svgH*0.25" :x2="svgW" :y2="svgH*0.25"
                            stroke="#f1f5f9" stroke-width="1"/>
                          <line x1="0" :y1="svgH*0.5"  :x2="svgW" :y2="svgH*0.5"
                            stroke="#f1f5f9" stroke-width="1"/>
                          <line x1="0" :y1="svgH*0.75" :x2="svgW" :y2="svgH*0.75"
                            stroke="#f1f5f9" stroke-width="1"/>
                          <!-- Area -->
                          <path :d="completionAreaPath" fill="rgba(129,140,248,0.15)"/>
                          <!-- Line -->
                          <path :d="completionLinePath" fill="none" stroke="#818cf8"
                            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                          <!-- Dots -->
                          <circle v-for="(pt, i) in completionPoints" :key="i"
                            :cx="pt.x" :cy="pt.y" r="3.5" fill="#818cf8" stroke="white" stroke-width="1.5"/>
                        </svg>
                      </div>
                      <!-- X labels -->
                      <div class="d-flex justify-space-between mt-1">
                        <span v-for="pt in completionPoints" :key="pt.label"
                          style="font-size:9px; color:#94a3b8; flex:1; text-align:center">
                          {{ pt.label }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <v-divider class="my-3" />
                  <div class="d-flex align-center justify-space-between">
                    <div class="d-flex align-center gap-1 text-caption text-medium-emphasis">
                      <v-icon size="13">mdi-filter-outline</v-icon> 1 Filter
                    </div>
                    <v-btn size="x-small" variant="text" class="text-none text-medium-emphasis">See all</v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>

          </div>
        </v-window-item>

        <!-- ── FILES (placeholder) ── -->
        <v-window-item value="files" class="h-100 d-flex align-center justify-center">
          <div class="text-center text-medium-emphasis">
            <v-icon size="56" class="mb-3 opacity-40">mdi-paperclip</v-icon>
            <div class="text-body-1 font-weight-medium">Files view coming soon</div>
          </div>
        </v-window-item>

      </v-window>
    </div>

    <!-- Task detail dialog (minimal) -->
    <v-dialog v-model="taskDialog" max-width="480">
      <v-card v-if="selectedTask" class="pa-4">
        <div class="d-flex align-center justify-space-between mb-3">
          <span class="text-subtitle-1 font-weight-bold">{{ selectedTask.name }}</span>
          <v-btn icon="mdi-close" variant="text" size="small" @click="taskDialog = false" />
        </div>
        <v-chip v-if="selectedTask.tag" size="small" :color="selectedTask.tagColor ?? 'grey'"
          variant="tonal" class="mb-3">{{ selectedTask.tag }}</v-chip>
        <div class="text-caption text-medium-emphasis">{{ selectedTask.date }}</div>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const activeTab = ref('board')

// ── List view data ────────────────────────────────────────────────────────────
const listTasks = [
  {
    id: 1, name: 'Partner library task updates', due: '29 Jan', comments: 2,
    assignees: [
      { img: 'https://i.pravatar.cc/150?img=11', color: '' },
      { initials: 'PR', color: 'pink-lighten-3' },
    ],
  },
  {
    id: 2, name: 'Mutual Fund - Backoffice', due: '', comments: 0,
    assignees: [
      { initials: 'AP', color: 'orange-lighten-2' },
      { initials: 'SM', color: 'amber-lighten-2' },
      { initials: 'RR', color: 'yellow-lighten-2' },
      { initials: 'UP', color: 'deep-purple-lighten-4' },
    ],
  },
  {
    id: 3, name: 'Performance Dashboard Requirement and Implementation', due: 'Friday', comments: 16,
    assignees: [
      { initials: 'Ma', color: 'pink-lighten-4' },
      { initials: 'Ha', color: 'cyan-lighten-4' },
      { initials: 'RR', color: 'deep-purple-lighten-4' },
    ],
  },
]

// ── Board view data ───────────────────────────────────────────────────────────
interface BoardTask {
  id: number
  name: string
  done: boolean
  tag?: string
  tagColor?: string
  date?: string
  likes?: number
  comments?: number
}

interface BoardColumn {
  id: string
  title: string
  tasks: BoardTask[]
}

const boardColumns = reactive<BoardColumn[]>([
  {
    id: 'recent',
    title: 'Recently assigned',
    tasks: [
      { id: 1, name: 'Get EKYC Additional segment KT from Ganavi', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jun 28, 2023', likes: 1, comments: 4 },
      { id: 2, name: 'Get EKYC NRI Flow KT from Ganavi', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jun 29, 2023', comments: 4 },
      { id: 3, name: 'Get EKYC Admin side for Main segment, Addsegment, Dormant Flow and NRI Flow KT from Ganavi', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jun 30, 2023', likes: 1 },
      { id: 4, name: 'EKYC Code analysing for Main segment, Addsegment, Dormant, NRI and Admin side.', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jul 1, 2023' },
      { id: 5, name: 'Research on EKYC flow and prepare test cases', done: false, tag: 'EKYC-V2', tagColor: 'green', date: 'Jul 3, 2023' },
      { id: 6, name: 'Implement authentication module', done: false, tag: 'Sprint-1', tagColor: 'blue', date: 'Jul 5, 2023', comments: 2 },
    ],
  },
  {
    id: 'today',
    title: 'Do today',
    tasks: [],
  },
  {
    id: 'next-week',
    title: 'Do next week',
    tasks: [],
  },
  {
    id: 'later',
    title: 'Do later',
    tasks: [],
  },
])

// ── Interactions ──────────────────────────────────────────────────────────────
const taskDialog = ref(false)
const selectedTask = ref<BoardTask | null>(null)

let nextTaskId = 100

function addTaskToColumn(colId: string) {
  const col = boardColumns.find(c => c.id === colId)
  if (!col) return
  col.tasks.push({
    id: nextTaskId++,
    name: 'New task',
    done: false,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  })
}

function addSection() {
  boardColumns.push({
    id: `section-${Date.now()}`,
    title: 'New section',
    tasks: [],
  })
}

// ── Dashboard data ────────────────────────────────────────────────────────────
const statCards = [
  { label: 'Total completed tasks', value: 7,  filter: '1 Filter' },
  { label: 'Total incomplete tasks', value: 4,  filter: '1 Filter' },
  { label: 'Total overdue tasks',    value: 3,  filter: '1 Filter' },
  { label: 'Total tasks',            value: 11, filter: 'No Filters' },
]

const sectionBars = [
  { label: 'Untitled S.', count: 0 },
  { label: 'Untitled S.', count: 0 },
  { label: 'Recently...',  count: 10 },
  { label: 'Do today',    count: 0 },
  { label: 'Do next...',  count: 0 },
  { label: 'Do later',    count: 0 },
]
const maxSectionCount = Math.max(...sectionBars.map(b => b.count), 1)

const projectBars = [
  { label: 'EX Board',   count: 7 },
  { label: 'Mobile App', count: 3 },
  { label: 'Analytics',  count: 1 },
]
const maxProjectCount = Math.max(...projectBars.map(b => b.count), 1)

const completionSegments = [
  { label: 'Completed',   value: 0, color: '#a5b4fc' },
  { label: 'Incomplete',  value: 0, color: '#e2e8f0' },
]
const completionTotal = completionSegments.reduce((s, c) => s + c.value, 0)
const completionPct   = completionTotal ? (completionSegments[0]!.value / completionTotal) * 100 : 0

const svgW = 300
const svgH = 100

const completionPoints = [
  { label: 'Mar 8',  v: 3 },
  { label: 'Mar 10', v: 3 },
  { label: 'Mar 12', v: 3 },
  { label: 'Mar 14', v: 4 },
  { label: 'Mar 16', v: 3 },
  { label: 'Mar 18', v: 3 },
  { label: 'Mar 20', v: 3 },
].map((pt, i, arr) => ({
  label: pt.label,
  v: pt.v,
  x: Math.round((i / (arr.length - 1)) * (svgW - 10) + 5),
  y: Math.round(svgH - (pt.v / 5) * (svgH - 8) - 4),
}))

const completionLinePath = completionPoints
  .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
  .join(' ')

const completionAreaPath =
  completionLinePath +
  ` L${completionPoints[completionPoints.length - 1]!.x},${svgH} L${completionPoints[0]!.x},${svgH} Z`
</script>

<style scoped>
.task-tabs :deep(.v-tab) {
  min-width: 0;
  padding: 0 12px;
}

/* Make v-window fill the flex container and pass height to items */
.task-tabs ~ * :deep(.v-window__container) {
  height: 100%;
}
:deep(.v-window) {
  flex: 1;
  min-height: 0;
}
:deep(.v-window__container) {
  height: 100%;
}
:deep(.v-window-item) {
  height: 100%;
}

/* List table */
.tasks-table th {
  border-bottom: 1px solid #f0f0f0 !important;
  background: transparent !important;
  padding: 8px 16px !important;
}
.tasks-table td {
  border-bottom: 1px solid #f0f0f0 !important;
}
.task-row:hover td {
  background-color: #f8f9fa !important;
}
.avatar-stack {
  margin-right: -6px;
}
.avatar-stack:last-child { margin-right: 0; }

/* Board */
.board-col {
  width: 240px;
  min-width: 240px;
  max-width: 240px;
  background: #f5f6f7;
  border-radius: 10px;
  padding: 8px 6px;
}

.task-card {
  background: #ffffff !important;
  border-radius: 8px !important;
  transition: box-shadow 0.15s ease;
}
.task-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.10) !important;
}

.add-task-row {
  transition: background 0.15s;
}
.add-task-row:hover {
  background: rgba(0,0,0,0.04);
}

.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.font-weight-semibold { font-weight: 600; }

/* Dashboard */
.stat-card {
  border-radius: 12px !important;
  transition: box-shadow 0.15s;
}
.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
}
.stat-number {
  font-size: 2.4rem;
  line-height: 1;
  color: rgba(var(--v-theme-on-surface), 0.85);
}
.bar-col {
  min-height: 3px;
  transition: height 0.3s ease;
}
.chart-area {
  border-left: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
}
</style>
