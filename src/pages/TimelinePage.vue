<template>
  <v-container fluid class="pa-0 h-100 d-flex flex-column whitespace-nowrap overflow-hidden bg-white">
    <!-- Project Header -->
    <ProjectHeader active-tab="timeline" />

    <!-- Timeline Toolbar Area -->
    <div class="px-6 py-2 d-flex align-center justify-space-between flex-wrap gap-4 border-b bg-white"
      style="z-index: 5;">
      <div class="d-flex align-center gap-2">
        <v-text-field density="compact" single-line variant="outlined" placeholder="Search timeline"
          prepend-inner-icon="mdi-magnify" clearable hide-details width="220" color="primary"
          class="bg-surface custom-board-input"></v-text-field>

        <v-avatar color="indigo-lighten-1" size="32" class="text-white text-caption font-weight-bold ml-1">
          SB
        </v-avatar>

        <v-btn variant="outlined" class="text-none font-weight-medium" color="medium-emphasis" size="small">
          Epic <v-icon end icon="mdi-chevron-down"></v-icon>
        </v-btn>
      </div>

      <div class="d-flex align-center gap-3">
        <div class="d-flex align-center">
          <span class="text-caption text-medium-emphasis font-weight-medium mr-2">Q4 2025</span>
          <v-btn-group variant="outlined" density="comfortable" class="border-group">
            <v-btn size="small" class="text-none" color="medium-emphasis">Today</v-btn>
            <v-btn size="small" icon="mdi-chevron-left" color="medium-emphasis" class="px-1"></v-btn>
            <v-btn size="small" icon="mdi-chevron-right" color="medium-emphasis" class="px-1"></v-btn>
          </v-btn-group>
        </div>

        <v-btn-group variant="outlined" density="comfortable" class="border-group ml-2">
          <v-btn size="small" class="text-none px-4" color="medium-emphasis">Weeks <v-icon end
              icon="mdi-chevron-down"></v-icon></v-btn>
        </v-btn-group>

        <v-btn variant="outlined" class="text-none px-2 ml-2" color="medium-emphasis" size="small"
          icon="mdi-dots-horizontal"></v-btn>
      </div>
    </div>

    <!-- Timeline Content -->
    <div class="flex-grow-1 d-flex overflow-hidden">
      <!-- Left Sidebar: Epics/Issues List -->
      <div class="timeline-sidebar border-r d-flex flex-column h-100 bg-white" style="width: 320px; min-width: 320px;">
        <!-- Header -->
        <div class="px-4 py-2 border-b d-flex align-center text-caption font-weight-bold text-medium-emphasis"
          style="height: 48px;">
          Title
        </div>

        <!-- List -->
        <div class="overflow-y-auto flex-grow-1">
          <div v-for="(epic, i) in epics" :key="epic.id" class="border-b">
            <!-- Epic Row -->
            <div class="px-4 py-2 d-flex align-center hover-bg-grey cursor-pointer"
              @click="epic.expanded = !epic.expanded" style="height: 48px;">
              <v-icon size="18" :icon="epic.expanded ? 'mdi-chevron-down' : 'mdi-chevron-right'"
                class="mr-1 text-medium-emphasis"></v-icon>
              <v-icon size="16" color="purple" class="mr-2">mdi-flash</v-icon>
              <span class="text-body-2 font-weight-medium text-truncate flex-grow-1 mr-2">{{ epic.title
              }}</span>
              <span class="text-caption text-medium-emphasis bg-grey-lighten-3 px-2 rounded-xl">{{ epic.id
              }}</span>
            </div>

            <!-- Issues Row -->
            <v-expand-transition>
              <div v-show="epic.expanded">
                <div v-for="issue in epic.issues" :key="issue.id"
                  class="pl-8 pr-4 py-2 d-flex align-center hover-bg-grey cursor-pointer border-t"
                  style="height: 44px;">
                  <v-icon size="16" color="blue" class="mr-2">mdi-check-box-outline</v-icon>
                  <span class="text-body-2 text-truncate flex-grow-1 mr-2">{{ issue.title }}</span>
                  <span class="text-caption text-medium-emphasis">{{ issue.id }}</span>
                </div>

                <!-- Add new issue row -->
                <div
                  class="pl-8 pr-4 py-2 d-flex align-center hover-bg-grey cursor-pointer border-t text-medium-emphasis"
                  style="height: 44px;">
                  <v-icon size="16" class="mr-2">mdi-plus</v-icon>
                  <span class="text-body-2 font-weight-medium">Create issue</span>
                </div>
              </div>
            </v-expand-transition>
          </div>

          <div class="pa-4">
            <v-btn variant="text" prepend-icon="mdi-plus"
              class="text-none font-weight-medium text-medium-emphasis px-1 justify-start" size="small">
              Create epic
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Right Area: Gantt Chart Area -->
      <div class="timeline-chart flex-grow-1 position-relative overflow-auto h-100 bg-grey-lighten-5"
        ref="ganttContainer" @scroll="syncScroll">
        <!-- Gantt Header (Months/Weeks) -->
        <div class="gantt-header border-b d-flex flex-column position-sticky top-0 bg-grey-lighten-5 z-2"
          style="height: 48px; z-index: 10;">
          <div class="d-flex h-50 border-b">
            <div v-for="month in months" :key="month.name"
              class="p-0 border-r d-flex align-center justify-center text-caption font-weight-medium text-medium-emphasis"
              :style="{ width: month.width + 'px', minWidth: month.width + 'px' }">
              {{ month.name }}
            </div>
          </div>
          <div class="d-flex h-50">
            <div v-for="week in weeks" :key="week.date"
              class="border-r d-flex align-center justify-center text-caption text-medium-emphasis position-relative"
              :style="{ width: weekWidth + 'px', minWidth: weekWidth + 'px' }">
              {{ week.date }}
              <div v-if="week.isToday" class="today-marker position-absolute bg-blue"
                style="top: 0; bottom: -1000px; width: 2px; z-index: 0;"></div>
              <div v-if="week.isToday"
                class="today-indicator position-absolute bg-blue text-white rounded-pill text-caption px-2"
                style="top: -6px; font-size: 10px; z-index: 10;">Today</div>
            </div>
          </div>
        </div>

        <!-- Grid Background -->
        <div class="gantt-grid position-absolute h-100 d-flex pointer-events-none"
          style="top: 48px; left: 0; z-index: 0;">
          <div v-for="week in weeks" :key="week.date" class="border-r h-100"
            :style="{ width: weekWidth + 'px', minWidth: weekWidth + 'px' }"></div>
        </div>

        <!-- Gantt Rows Content -->
        <div class="gantt-body position-relative pt-0" style="z-index: 1;">
          <div v-for="(epic, i) in epics" :key="'gantt-row-' + i">
            <!-- Epic Bar Row -->
            <div class="position-relative d-flex align-center border-b hover-highlight"
              style="height: 48px; width: 100%;">
              <div v-if="epic.startOffset !== null"
                class="epic-bar rounded-pill mx-1 d-flex align-center cursor-pointer shadow-sm text-truncate text-white text-caption font-weight-bold px-3 transition-transform"
                :style="{
                  left: `${epic.startOffset}px`,
                  width: `${epic.width}px`,
                  backgroundColor: epic.color,
                  position: 'absolute'
                }">
                {{ epic.title }}
              </div>
            </div>

            <!-- Issues Bar Row -->
            <v-expand-transition>
              <div v-show="epic.expanded">
                <div v-for="issue in epic.issues" :key="'gantt-issue-' + issue.id"
                  class="position-relative d-flex align-center border-b hover-highlight"
                  style="height: 44px; width: 100%;">
                  <!-- Dotted connector if it fits inside epic -->
                  <div v-if="issue.startOffset !== null"
                    class="issue-bar rounded-sm mx-1 d-flex align-center cursor-pointer shadow-sm text-truncate text-white text-caption font-weight-bold px-2 transition-transform"
                    :style="{
                      left: `${issue.startOffset}px`,
                      width: `${issue.width}px`,
                      backgroundColor: issue.color || '#42A5F5',
                      position: 'absolute'
                    }">
                    {{ issue.title }}
                  </div>
                </div>

                <!-- Create Issue Row padding -->
                <div class="border-b" style="height: 44px; width: 100%;"></div>
              </div>
            </v-expand-transition>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProjectHeader from '@/components/ProjectHeader.vue'

const weekWidth = 60; // Pixels per week column

const months = ref([
  { name: 'Nov 2025', width: weekWidth * 4 },
  { name: 'Dec 2025', width: weekWidth * 5 },
  { name: 'Jan 2026', width: weekWidth * 4 },
  { name: 'Feb 2026', width: weekWidth * 4 },
  { name: 'Mar 2026', width: weekWidth * 5 }
])

const weeks = ref([
  { date: '03' }, { date: '10' }, { date: '17' }, { date: '24' },
  { date: '01' }, { date: '08' }, { date: '15' }, { date: '22' }, { date: '29' },
  { date: '05' }, { date: '12' }, { date: '19' }, { date: '26', isToday: true },
  { date: '02' }, { date: '09' }, { date: '16' }, { date: '23' },
  { date: '02' }, { date: '09' }, { date: '16' }, { date: '23' }, { date: '30' }
])

const epics = ref([
  {
    id: 'AB-160',
    title: 'Aliceblue Online Platform Upgrade',
    expanded: true,
    color: '#8E24AA', // Purple
    startOffset: weekWidth * 1.5,
    width: weekWidth * 7.5,
    issues: [
      { id: 'AB-161', title: 'Database Migration Phase 1', startOffset: weekWidth * 1.5, width: weekWidth * 3, color: '#1E88E5' },
      { id: 'AB-162', title: 'API Gateway Redesign', startOffset: weekWidth * 4.5, width: weekWidth * 4.5, color: '#1E88E5' },
    ]
  },
  {
    id: 'AB-492',
    title: 'Aliceblue Next.JS Refactor',
    expanded: false,
    color: '#3949AB', // Indigo
    startOffset: weekWidth * 8.5,
    width: weekWidth * 6.5,
    issues: [
      { id: 'AB-493', title: 'Component Library Setup', startOffset: weekWidth * 8.5, width: weekWidth * 2.5, color: '#43A047' },
      { id: 'AB-494', title: 'Authentication Flow transition', startOffset: weekWidth * 11, width: weekWidth * 4, color: '#1E88E5' },
    ]
  },
  {
    id: 'AB-159',
    title: 'Trade School integration',
    expanded: false,
    color: '#00897B', // Teal
    startOffset: weekWidth * 5,
    width: weekWidth * 12,
    issues: [
      { id: 'AB-180', title: 'Identify partners', startOffset: weekWidth * 5, width: weekWidth * 3, color: '#F4511E' },
    ]
  }
])

const ganttContainer = ref<HTMLElement | null>(null)

const syncScroll = (e: Event) => {
  // Sync logic if we had fixed sidebars, but we use flexbox so viewport handles it
}

onMounted(() => {
  // Scroll to 'today' line
  if (ganttContainer.value) {
    const todayIndex = weeks.value.findIndex(w => w.isToday)
    if (todayIndex > -1) {
      // scroll horizontally to center today
      ganttContainer.value.scrollLeft = Math.max(0, (todayIndex * weekWidth) - (ganttContainer.value.clientWidth / 2))
    }
  }
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.gap-4 {
  gap: 16px;
}

:deep(.v-btn--active) {
  color: var(--v-theme-primary);
}

.custom-board-input :deep(.v-field__input) {
  min-height: 32px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.border-group {
  border: 1px solid rgba(0, 0, 0, 0.12);
}

.border-r {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.hover-bg-grey:hover {
  background-color: #f4f5f7;
}

.hover-highlight:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.epic-bar,
.issue-bar {
  height: 24px;
  line-height: 24px;
}

.epic-bar:hover,
.issue-bar:hover {
  filter: brightness(0.9);
  transform: translateY(-1px);
}

.pointer-events-none {
  pointer-events: none;
}

.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.transition-transform {
  transition: transform 0.1s ease;
}

.z-2 {
  z-index: 2;
}
</style>
