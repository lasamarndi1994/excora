<template>
  <v-container fluid class="pa-0 h-100 d-flex flex-column whitespace-nowrap overflow-hidden bg-white">
    <!-- Project Header -->
    <ProjectHeader active-tab="summary" />

    <!-- Overview Content -->
    <div class="flex-grow-1 px-6 py-6 overflow-y-auto bg-blue-grey-lighten-5">
      <div class=" mx-auto">
        <!-- Filter Button -->
        <div class="mb-4 d-inline-block">
          <v-menu v-model="filterMenu" :close-on-content-click="false" location="bottom start" offset="4">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" prepend-icon="mdi-filter-variant" variant="outlined"
                class="text-none bg-white font-weight-medium" color="medium-emphasis" size="small">
                Filter
              </v-btn>
            </template>

            <v-card width="260" elevation="4" class="rounded-lg overflow-hidden border d-flex flex-column"
              style="max-height: 440px;">
              <div class="pa-2 bg-white">
                <v-text-field density="compact" variant="outlined" placeholder="Search more filters" height="20"
                  prepend-inner-icon="mdi-magnify" hide-details class="bg-surface custom-search-input"
                  single-line></v-text-field>
              </div>

              <div class="overflow-y-auto px-2 pb-2 flex-grow-1 bg-white">
                <v-checkbox density="compact" hide-details color="primary" class="filter-checkbox mb-1"
                  v-for="item in filterOptions" :key="item.value">
                  <template v-slot:label>
                    <span class="text-body-2 text-high-emphasis ml-2">{{ item.title }}</span>
                  </template>
                </v-checkbox>
              </div>

              <v-divider></v-divider>

              <div class="px-4 py-3 bg-surface text-right text-caption text-medium-emphasis">
                {{ filterOptions.length }} of {{ filterOptions.length }}
              </div>
            </v-card>
          </v-menu>
        </div>

        <!-- Metric Cards -->
        <v-row class="mb-2">
          <v-col cols="12" sm="6" md="3">
            <v-card variant="outlined" class="bg-white border-card d-flex align-center pa-4 h-100" elevation="0">
              <v-sheet width="32" height="32" color="green-lighten-4"
                class="rounded d-flex align-center justify-center mr-4">
                <v-icon color="green-darken-2" size="20">mdi-check-circle-outline</v-icon>
              </v-sheet>
              <div>
                <div class="text-subtitle-2 font-weight-bold mb-n1">3 completed</div>
                <div class="text-caption text-medium-emphasis">in the last 7 days</div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card variant="outlined" class="bg-white border-card d-flex align-center pa-4 h-100" elevation="0">
              <v-sheet width="32" height="32" color="grey-lighten-3"
                class="rounded d-flex align-center justify-center mr-4">
                <v-icon color="grey-darken-2" size="20">mdi-update</v-icon>
              </v-sheet>
              <div>
                <div class="text-subtitle-2 font-weight-bold mb-n1">12 updated</div>
                <div class="text-caption text-medium-emphasis">in the last 7 days</div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card variant="outlined" class="bg-white border-card d-flex align-center pa-4 h-100" elevation="0">
              <v-sheet width="32" height="32" color="grey-lighten-3"
                class="rounded d-flex align-center justify-center mr-4">
                <v-icon color="grey-darken-2" size="20">mdi-file-document-outline</v-icon>
              </v-sheet>
              <div>
                <div class="text-subtitle-2 font-weight-bold mb-n1">7 created</div>
                <div class="text-caption text-medium-emphasis">in the last 7 days</div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-card variant="outlined" class="bg-white border-card d-flex align-center pa-4 h-100" elevation="0">
              <v-sheet width="32" height="32" color="grey-lighten-3"
                class="rounded d-flex align-center justify-center mr-4">
                <v-icon color="grey-darken-2" size="20">mdi-calendar-blank</v-icon>
              </v-sheet>
              <div>
                <div class="text-subtitle-2 font-weight-bold mb-n1">0 due soon</div>
                <div class="text-caption text-medium-emphasis">in the next 7 days</div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Status Overview -->
        <v-row class="mb-2">
          <v-col cols="12">
            <v-card variant="outlined" class="bg-white border-card pa-4" elevation="0">
              <div class="mb-6">
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Status overview</h3>
                <div class="text-caption text-medium-emphasis">
                  Get a snapshot of the status of your work items.
                  <a href="#" class="text-primary text-decoration-none ml-1">View all work items</a>
                </div>
              </div>

              <v-row align="center" justify="center" class="py-4">
                <!-- Donut Chart Area -->
                <v-col cols="12" md="6" class="d-flex justify-center position-relative">
                  <div class="donut-chart">
                    <div class="donut-inner d-flex flex-column align-center justify-center">
                      <div class="text-h4 font-weight-bold">157</div>
                      <div class="text-caption text-medium-emphasis mt-n1">Total work item...
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- Legend -->
                <v-col cols="12" md="6">
                  <div class="d-flex flex-column gap-2" style="max-height: 200px; overflow-y: auto;">
                    <div class="d-flex align-center text-caption" v-for="item in statusLegend" :key="item.label">
                      <div class="legend-dot mr-2" :style="{ backgroundColor: item.color }"></div>
                      <span class="text-medium-emphasis">{{ item.label }}: {{ item.count }}</span>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Recent Activity -->
        <v-row class="mb-2">
          <v-col cols="12">
            <v-card variant="outlined" class="bg-white border-card pa-4" elevation="0">
              <div class="d-flex justify-space-between align-start mb-4">
                <div>
                  <h3 class="text-subtitle-1 font-weight-bold mb-0">Recent activity</h3>
                  <div class="text-caption text-medium-emphasis">Stay up to date with what's happening
                    across the space.</div>
                </div>
                <v-btn icon="mdi-open-in-new" variant="text" size="small" color="medium-emphasis"></v-btn>
              </div>

              <!-- Activity List -->
              <div class="activity-timeline mt-4">
                <div class="text-caption font-weight-bold mb-4">Wednesday, December 24, 2025</div>

                <div class="activity-item d-flex align-start mb-6">
                  <v-avatar size="32" color="orange-lighten-1"
                    class="mr-3 text-white text-caption font-weight-bold">S</v-avatar>
                  <div class="flex-grow-1">
                    <div class="text-body-2">
                      <span class="font-weight-bold text-primary cursor-pointer hover-underline">shiva.m</span>
                      <span class="text-medium-emphasis mx-1">commented on</span>
                      <v-icon size="16" color="blue" class="mr-1">mdi-check-box-outline</v-icon>
                      <a href="#" class="text-primary text-decoration-none hover-underline text-truncate d-inline-block"
                        style="max-width: 250px; vertical-align: bottom;">AB-725: Update RMS
                        Policy 17-12-2025</a>
                      <v-chip size="x-small" color="green" class="ml-2 font-weight-bold" variant="flat">CLOSED</v-chip>
                    </div>
                    <div class="text-caption text-medium-emphasis mb-2">6 days ago</div>

                    <v-card variant="flat" class="bg-grey-lighten-4 pa-3 rounded-lg border">
                      <div class="text-body-2">
                        <span class="text-primary bg-blue-lighten-5 px-1 rounded mr-1">@Yash
                          Ramakant Argre</span>
                        , Validated above task and its working as expected.
                      </div>
                      <div class="bg-grey-lighten-3 mt-2 rounded" style="height: 24px; width: 100%;"></div>
                    </v-card>
                  </div>
                </div>

                <!-- Fade out effect at bottom -->
                <div class="text-center pt-2 border-top">
                  <v-icon color="grey-lighten-1">mdi-chevron-down</v-icon>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Charts Row -->
        <v-row class="mb-2">
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="bg-white border-card pa-4 h-100" elevation="0">
              <div class="mb-4">
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Priority breakdown</h3>
                <div class="text-caption text-medium-emphasis">
                  Get a holistic view of how work is being prioritized.
                  <a href="#" class="text-primary text-decoration-none ml-1">How to manage priorities
                    for spaces</a>
                </div>
              </div>

              <div class="priority-chart d-flex align-end justify-space-around pt-6 pb-2 position-relative"
                style="height: 180px;">
                <!-- grid lines -->
                <div class="grid-line" style="bottom: 25%;"><span>50</span></div>
                <div class="grid-line" style="bottom: 50%;"><span>100</span></div>

                <div class="d-flex flex-column align-center z-index-1">
                  <div class="chart-bar bg-red" style="height: 0px;"></div>
                </div>
                <div class="d-flex flex-column align-center z-index-1">
                  <div class="chart-bar bg-orange" style="height: 0px;"></div>
                </div>
                <div class="d-flex flex-column align-center z-index-1">
                  <div class="chart-bar bg-grey" style="height: 120px;"></div>
                </div>
                <div class="d-flex flex-column align-center z-index-1">
                  <div class="chart-bar bg-blue" style="height: 0px;"></div>
                </div>
                <div class="d-flex flex-column align-center z-index-1">
                  <div class="chart-bar bg-purple" style="height: 0px;"></div>
                </div>
              </div>

              <div class="d-flex justify-space-around border-t pt-2">
                <div class="text-caption text-medium-emphasis d-flex align-center"><v-icon size="12" color="red"
                    class="mr-1">mdi-chevron-double-up</v-icon> Highest</div>
                <div class="text-caption text-medium-emphasis d-flex align-center"><v-icon size="12" color="orange"
                    class="mr-1">mdi-chevron-up</v-icon> High</div>
                <div class="text-caption text-medium-emphasis d-flex align-center"><v-icon size="12" color="orange"
                    class="mr-1" style="transform: rotate(90deg);">mdi-menu</v-icon>
                  Medium</div>
                <div class="text-caption text-medium-emphasis d-flex align-center"><v-icon size="12" color="blue"
                    class="mr-1">mdi-chevron-down</v-icon> Low</div>
                <div class="text-caption text-medium-emphasis d-flex align-center"><v-icon size="12" color="blue"
                    class="mr-1">mdi-chevron-double-down</v-icon> Lowest</div>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card variant="outlined" class="bg-white border-card pa-4 h-100" elevation="0">
              <div class="mb-4">
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Types of work</h3>
                <div class="text-caption text-medium-emphasis">
                  Get a breakdown of work items by their types.
                  <a href="#" class="text-primary text-decoration-none ml-1">View all items</a>
                </div>
              </div>

              <v-table density="compact" class="type-work-table">
                <thead>
                  <tr>
                    <th class="text-caption text-medium-emphasis font-weight-medium bg-transparent border-none px-0">
                      Type</th>
                    <th
                      class="text-caption text-medium-emphasis font-weight-medium bg-transparent border-none px-0 text-right">
                      Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="type in workTypes" :key="type.name">
                    <td class="px-0 py-2 border-none">
                      <div class="d-flex align-center">
                        <v-icon size="16" :color="type.color" class="mr-2">{{ type.icon
                        }}</v-icon>
                        <span class="text-body-2">{{ type.name }}</span>
                      </div>
                    </td>
                    <td class="px-0 py-2 border-none w-50">
                      <div class="d-flex align-center w-100">
                        <v-progress-linear :model-value="type.value" height="16" bg-color="grey-lighten-3"
                          color="grey-darken-1" rounded="0">
                          <template v-slot:default="{ value }">
                            <span class="text-white text-caption" style="font-size: 10px !important;"
                              v-if="value > 15">{{
                                Math.ceil(value) }}%</span>
                          </template>
                        </v-progress-linear>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>

        <!-- Workload Row -->
        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <v-card variant="outlined" class="bg-white border-card pa-4 h-100" elevation="0">
              <div class="mb-4">
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Team workload</h3>
                <div class="text-caption text-medium-emphasis">
                  Monitor the capacity of your team.
                  <a href="#" class="text-primary text-decoration-none ml-1">Reassign work items to
                    get the right
                    balance</a>
                </div>
              </div>

              <v-table density="compact" class="type-work-table">
                <thead>
                  <tr>
                    <th class="text-caption text-medium-emphasis font-weight-medium bg-transparent border-none px-0">
                      Assignee</th>
                    <th
                      class="text-caption text-medium-emphasis font-weight-medium bg-transparent border-none px-0 text-right">
                      Work distribution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in teamWorkload" :key="user.name">
                    <td class="px-0 py-2 border-none">
                      <div class="d-flex align-center">
                        <v-avatar size="24" :color="user.avatarColor"
                          class="mr-2 text-white text-caption font-weight-bold">
                          {{ user.initial }}
                        </v-avatar>
                        <span class="text-body-2">{{ user.name }}</span>
                      </div>
                    </td>
                    <td class="px-0 py-2 border-none w-50">
                      <div class="d-flex align-center w-100">
                        <v-progress-linear :model-value="user.value" height="16" bg-color="grey-lighten-3"
                          color="grey-darken-1" rounded="0">
                          <template v-slot:default="{ value }">
                            <span class="text-white text-caption" style="font-size: 10px !important;"
                              v-if="value > 15">{{
                                Math.ceil(value) }}%</span>
                          </template>
                        </v-progress-linear>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card variant="outlined" class="bg-white border-card pa-4 h-100" elevation="0">
              <div class="mb-4">
                <h3 class="text-subtitle-1 font-weight-bold mb-0">Epic progress</h3>
                <div class="text-caption text-medium-emphasis">
                  See how your epics are progressing at a glance.
                  <a href="#" class="text-primary text-decoration-none ml-1">View all epics</a>
                </div>
              </div>

              <div class="d-flex gap-4 mb-4 mt-2">
                <div class="d-flex align-center text-caption">
                  <div class="legend-dot bg-green mr-1"></div> Done
                </div>
                <div class="d-flex align-center text-caption">
                  <div class="legend-dot bg-blue mr-1"></div> In progress
                </div>
                <div class="d-flex align-center text-caption">
                  <div class="legend-dot bg-grey mr-1"></div> To do
                </div>
              </div>

              <div class="epics-list">
                <div v-for="epic in epics" :key="epic.id" class="mb-4">
                  <div class="d-flex align-center text-caption font-weight-medium mb-1 hover-underline cursor-pointer">
                    <v-icon size="14" color="purple" class="mr-1">mdi-flash</v-icon>
                    {{ epic.id }} {{ epic.name }}
                  </div>
                  <div class="epic-progress-bar rounded overflow-hidden d-flex" style="height: 16px;">
                    <v-tooltip :text="`Done: ${epic.done}%`" location="top">
                      <template v-slot:activator="{ props }">
                        <div v-bind="props" class="bg-green h-100 d-flex align-center px-2 text-white"
                          :style="{ width: epic.done + '%' }" style="font-size: 10px;">{{
                            epic.done }}%</div>
                      </template>
                    </v-tooltip>
                    <v-tooltip :text="`In progress: ${epic.inProgress}%`" location="top">
                      <template v-slot:activator="{ props }">
                        <div v-bind="props" class="bg-blue h-100 d-flex align-center justify-center text-white"
                          :style="{ width: epic.inProgress + '%' }" style="font-size: 10px;" v-if="epic.inProgress > 0">
                          {{ epic.inProgress }}%</div>
                      </template>
                    </v-tooltip>
                    <div
                      class="bg-grey-lighten-2 h-100 flex-grow-1 border-left text-center d-flex align-center justify-center text-grey-darken-1"
                      style="font-size: 10px;">...</div>
                  </div>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProjectHeader from '@/components/ProjectHeader.vue'

const filterMenu = ref(false)

const filterOptions = [
  { title: 'Assignee', value: 'assignee' },
  { title: 'Created', value: 'created' },
  { title: 'Due date', value: 'dueDate' },
  { title: 'Parent', value: 'parent' },
  { title: 'Priority', value: 'priority' },
  { title: 'Status', value: 'status' },
  { title: 'Updated', value: 'updated' },
  { title: 'Work type', value: 'workType' },
]

const statusLegend = [
  { label: 'On Hold', count: 28, color: '#D84315' },
  { label: 'Done', count: 2, color: '#4CAF50' },
  { label: 'ReOpen', count: 3, color: '#9C27B0' },
  { label: 'QA In Progress', count: 22, color: '#E91E63' },
  { label: 'In Progress', count: 15, color: '#2196F3' },
  { label: 'Ready for QA', count: 22, color: '#03A9F4' },
  { label: 'Known Issue', count: 1, color: '#5C6BC0' },
]

const workTypes = [
  { name: 'Task', icon: 'mdi-check-box-outline', color: 'blue', value: 58 },
  { name: 'Bug', icon: 'mdi-circle-medium', color: 'red', value: 31 },
  { name: 'Epic', icon: 'mdi-flash', color: 'purple', value: 5 },
  { name: 'Subtask', icon: 'mdi-file-tree', color: 'blue-grey', value: 4 },
  { name: 'Story', icon: 'mdi-bookmark', color: 'green', value: 2 },
]

const teamWorkload = [
  { name: 'shiva.m', initial: 'S', avatarColor: 'orange-lighten-1', value: 23 },
  { name: 'Priya Rathore', initial: 'PR', avatarColor: 'orange-lighten-2', value: 21 },
  { name: 'Yash Ramakant...', initial: 'YR', avatarColor: 'blue-darken-2', value: 17 },
  { name: 'Piyush Kishor', initial: 'PK', avatarColor: 'light-blue-darken-1', value: 4 },
  { name: 'Rahul Gupta', initial: 'RG', avatarColor: 'indigo-darken-1', value: 1 },
]

const epics = [
  { id: 'AB-160', name: 'Aliceblue Online', done: 91, inProgress: 4 },
  { id: 'AB-492', name: 'Aliceblue Next.JS', done: 76, inProgress: 17 },
  { id: 'AB-159', name: 'Trade School', done: 94, inProgress: 2 },
]
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.filter-checkbox :deep(.v-selection-control) {
  min-height: auto;
}

.filter-checkbox :deep(.v-selection-control__wrapper) {
  margin-top: 2px;
}

.gap-4 {
  gap: 16px;
}

.border-card {
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 4px;
}



/* Dashboard Tabs styles */
:deep(.v-btn--active) {
  color: var(--v-theme-primary);
}

/* Donut chart placeholder */
.donut-chart {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(#D84315 0deg 30deg,
      /* On Hold */
      #4CAF50 30deg 35deg,
      /* Done */
      #9C27B0 35deg 40deg,
      /* ReOpen */
      #E91E63 40deg 90deg,
      /* QA In Progress */
      #2196F3 90deg 130deg,
      /* In Progress */
      #03A9F4 130deg 180deg,
      /* Ready for QA */
      #5C6BC0 180deg 185deg,
      /* Known Issue */
      #e0e0e0 185deg 360deg
      /* Empty/Rest */
    );
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-inner {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background-color: white;
  z-index: 2;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.hover-underline:hover {
  text-decoration: underline !important;
}

/* Chart */
.priority-chart {
  border-bottom: 2px solid #eee;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  border-bottom: 1px dashed #e0e0e0;
  z-index: 0;
}

.grid-line span {
  position: absolute;
  left: -20px;
  top: -8px;
  font-size: 10px;
  color: #9e9e9e;
}

.chart-bar {
  width: 40px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  transition: height 0.3s ease;
}

.z-index-1 {
  z-index: 1;
}

.type-work-table th,
.type-work-table td {
  border-bottom: none !important;
}

.border-left {
  border-left: 1px solid white;
}
</style>
