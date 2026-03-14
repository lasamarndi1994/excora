<template>
  <v-container fluid class="fill-height dashboard-container pa-6">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <h1 class="text-h5 font-weight-bold text-high-emphasis modern-header">Dashboard
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis">Timelines, Resources & Risk Management</p>
          </div>
          <v-btn color="primary" prepend-icon="mdi-plus" rounded="md" class="text-capitalize font-weight-bold"
            elevation="2" @click="isCreateTaskDialogOpen = true">New Project</v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Create Task Dialog -->
    <v-dialog v-model="isCreateTaskDialogOpen" max-width="800" scrollable scroll-strategy="none">
      <v-card class="rounded-md">
        <v-card-title class="d-flex align-center justify-space-between pa-4 border-b">
          <span class="text-h6 font-weight-bold">Create Task</span>
          <div class="d-flex align-center gap-2">
            <v-btn icon="mdi-minus" variant="text" density="comfortable" size="small"></v-btn>
            <v-btn icon="mdi-arrow-expand-all" variant="text" density="comfortable" size="small"></v-btn>
            <v-btn icon="mdi-dots-horizontal" variant="text" density="comfortable" size="small"></v-btn>
            <v-btn icon="mdi-close" variant="text" density="comfortable" size="small"
              @click="isCreateTaskDialogOpen = false"></v-btn>
          </div>
        </v-card-title>

        <v-card-text class="pa-6" style="max-height: 70vh;">
          <div class="text-body-2 text-medium-emphasis mb-6">Required fields are marked with an asterisk <span
              class="text-error">*</span></div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Space <span class="text-error">*</span></label>
            <v-select v-model="newTask.space" :items="['Execora (EX)']" variant="outlined" density="compact"
              :width="500" hide-details bg-color="white">
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="20" class="mr-2" color="blue-lighten-4" rounded="sm">
                    <v-icon size="14" color="blue-darken-2">mdi-checkbox-blank</v-icon>
                  </v-avatar>
                  {{ item.title }}
                </div>
              </template>
            </v-select>
          </div>

          <div class="mb-2">
            <label class="text-body-2 font-weight-bold d-block mb-2">Work type <span class="text-error">*</span></label>
            <v-select v-model="newTask.workType" :items="['Task', 'Bug', 'Story']" variant="outlined" density="compact"
              :width="500" hide-details bg-color="white">
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-icon size="16" color="blue" class="mr-2">mdi-checkbox-marked</v-icon>
                  {{ item.title }}
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
                <v-btn v-bind="props" variant="flat" color="grey-lighten-3"
                  class="text-none font-weight-bold text-body-2 mb-2 px-3" height="32">
                  {{ newTask.status === 'IN PROGRESS' ? 'IN PROGRESS' : (newTask.status === 'TEST' ? 'TEST' :
                    (newTask.status === 'DONE' ? 'DONE' : 'To Do')) }} <v-icon end size="16"
                    class="ml-1">mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list density="compact" class="py-2 border" elevation="2" min-width="220" bg-color="white">
                <v-list-item link @click="newTask.status = 'To Do'" class="min-height-0 py-1">
                  <div
                    class="d-inline-flex align-center bg-grey-lighten-3 text-grey-darken-3 px-2 rounded-sm font-weight-bold"
                    style="font-size: 11px; height: 20px;">TO DO</div>
                </v-list-item>
                <v-list-item link @click="newTask.status = 'IN PROGRESS'" class="min-height-0 py-1">
                  <div
                    class="d-inline-flex align-center bg-blue-lighten-4 text-blue-darken-3 px-2 rounded-sm font-weight-bold"
                    style="font-size: 11px; height: 20px;">IN PROGRESS</div>
                </v-list-item>
                <v-list-item link @click="newTask.status = 'TEST'" class="min-height-0 py-1">
                  <div
                    class="d-inline-flex align-center bg-blue-lighten-4 text-blue-darken-3 px-2 rounded-sm font-weight-bold"
                    style="font-size: 11px; height: 20px;">TEST</div>
                </v-list-item>
                <v-list-item link @click="newTask.status = 'DONE'" class="min-height-0 py-1">
                  <div
                    class="d-inline-flex align-center bg-light-green-lighten-4 text-green-darken-4 px-2 rounded-sm font-weight-bold"
                    style="font-size: 11px; height: 20px;">DONE</div>
                </v-list-item>

                <v-divider class="my-2"></v-divider>

                <v-list-item link class="min-height-0 py-1.5">
                  <v-list-item-title class="text-body-2 font-weight-medium text-high-emphasis">Create
                    status</v-list-item-title>
                </v-list-item>
                <v-list-item link class="min-height-0 py-1.5">
                  <v-list-item-title class="text-body-2 font-weight-medium text-high-emphasis">Edit
                    status</v-list-item-title>
                </v-list-item>
                <v-list-item link class="min-height-0 py-1.5">
                  <v-list-item-title class="text-body-2 font-weight-medium text-high-emphasis">Manage
                    workflow</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <div class="text-caption text-medium-emphasis">This is the initial status upon creation</div>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Summary <span class="text-error">*</span></label>
            <v-text-field v-model="newTask.summary" variant="outlined" density="compact" hide-details
              class="required-field-error"></v-text-field>
            <div class="text-caption text-error mt-1 d-flex align-center">
              <v-icon size="14" class="mr-1">mdi-alert-circle</v-icon> Summary is required
            </div>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Description</label>
            <div class="border rounded-md bg-surface">
              <QuillEditor :content="newTask.description" @update:content="newTask.description = $event"
                :modules="modules"
                placeholder="We support markdown! Try **bold**, `inline code`, or ``` for code blocks." />
            </div>
          </div>

          <div class="mb-6">
            <div class="d-flex align-center justify-space-between mb-2">
              <label class="text-body-2 font-weight-bold">Assignee</label>
              <a @click="newTask.assignee = 'Unassigned'"
                class="text-caption text-primary text-decoration-none cursor-pointer">Assign
                to me</a>
            </div>
            <v-select v-model="newTask.assignee" :items="['Unassigned']" variant="outlined" density="compact"
              hide-details bg-color="white">
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="24" color="grey-lighten-2" class="mr-2">
                    <v-icon size="16" color="grey-darken-1">mdi-account-outline</v-icon>
                  </v-avatar>
                  {{ item.title }}
                </div>
              </template>
            </v-select>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Date</label>
            <v-text-field placeholder="Select date" variant="outlined" density="compact" hide-details bg-color="white"
              append-inner-icon="mdi-calendar-blank" width="500"></v-text-field>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Team</label>
            <v-select placeholder="Choose a team" :items="['Frontend', 'Backend', 'Design']" variant="outlined"
              width="500" density="compact" hide-details bg-color="white">
              <template v-slot:prepend-inner>
                <v-avatar size="24" color="blue-lighten-4" class="mr-1" rounded="sm">
                  <v-icon size="14" color="blue-darken-2">mdi-account-group-outline</v-icon>
                </v-avatar>
              </template>
            </v-select>
            <div class="text-caption text-medium-emphasis mt-1">Associates a team to an issue. You can use this field to
              search
              and filter issues by team.</div>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Start date</label>
            <v-text-field placeholder="Select date" variant="outlined" density="compact" hide-details bg-color="white"
              width="500" append-inner-icon="mdi-calendar-blank"></v-text-field>
            <div class="text-caption text-medium-emphasis mt-1">Allows the planned start date for a piece of work to be
              set.</div>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Sprint</label>
            <v-select placeholder="Select sprint" :items="['Sprint 1', 'Sprint 2', 'Sprint 3']" variant="outlined"
              width="500" density="compact" hide-details bg-color="white"></v-select>
            <div class="text-caption text-medium-emphasis mt-1">Jira Software sprint field</div>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Story point estimate</label>
            <v-text-field variant="outlined" density="compact" hide-details bg-color="white" width="500"></v-text-field>
            <div class="text-caption text-medium-emphasis mt-1">Measurement of complexity and/or size of a requirement.
            </div>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Reporter <span class="text-error">*</span></label>
            <v-select v-model="newTask.reporter" :items="['Lasa Marandi']" variant="outlined" width="500"
              density="compact" hide-details bg-color="white">
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-avatar size="24" color="deep-orange" class="text-white text-caption mr-2 font-weight-bold">
                    LM
                  </v-avatar>
                  {{ item.title }}
                </div>
              </template>
            </v-select>
          </div>

          <div class="mb-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Attachment</label>
            <div class="border border-dashed rounded-md pa-6 d-flex align-center justify-center bg-grey-lighten-5">
              <div class="d-flex align-center cursor-pointer hover-text-primary">
                <v-icon size="20" class="mr-2">mdi-cloud-upload-outline</v-icon>
                <span class="text-body-2 text-medium-emphasis">Drop files to attach or</span>
                <v-btn variant="outlined" size="small" class="ml-2 text-none font-weight-medium bg-white">Browse</v-btn>
              </div>
            </div>
          </div>

          <div class="mb-2">
            <label class="text-body-2 font-weight-bold d-block mb-2">Linked Work items</label>
            <v-select v-model="newTask.linkType" width="500"
              :items="['blocks', 'is blocked by', 'clones', 'is cloned by', 'duplicates', 'is duplicated by', 'relates to']"
              variant="outlined" density="compact" hide-details bg-color="white" class="mb-3"></v-select>

            <v-select placeholder="Type, search or paste URL" :items="[]" variant="outlined" width="500"
              density="compact" hide-details bg-color="white"></v-select>
          </div>

          <div class="mb-6 mt-6">
            <label class="text-body-2 font-weight-bold d-block mb-2">Flagged</label>
            <v-checkbox v-model="newTask.isFlagged" label="Impediment" color="primary" hide-details
              density="compact"></v-checkbox>
            <div class="text-caption text-medium-emphasis mt-1">Allows to flag issues with impediments.</div>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4 d-flex justify-space-between bg-grey-lighten-5">
          <v-checkbox v-model="createAnother" label="Create another" color="primary" hide-details density="compact"
            class="ma-0 pa-0"></v-checkbox>
          <div class="d-flex gap-3">
            <v-btn variant="text" class="text-none font-weight-medium text-medium-emphasis"
              @click="isCreateTaskDialogOpen = false">Cancel</v-btn>
            <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-6">Create</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <!-- Active Projects Grid -->
    <v-row class="mb-6">
      <v-col cols="12" md="4" v-for="(project, i) in projects" :key="i">
        <v-card class="modern-card h-100 pa-5" flat>
          <div class="d-flex justify-space-between mb-4">
            <v-chip :color="project.statusColor" size="small" label class="font-weight-bold text-uppercase px-3">{{
              project.status }}</v-chip>
            <v-avatar size="32" class="border">
              <v-img :src="`https://ui-avatars.com/api/?name=${project.lead}&background=random`"></v-img>
            </v-avatar>
          </div>
          <h3 class="text-h6 font-weight-bold mb-2">{{ project.name }}</h3>
          <p class="text-body-2 text-medium-emphasis mb-6 line-clamp-2" style="min-height: 40px;">{{
            project.description }}</p>

          <div class="mb-2 text-caption font-weight-bold d-flex justify-space-between text-medium-emphasis">
            <span>Progress</span>
            <span>{{ project.progress }}%</span>
          </div>
          <v-progress-linear :model-value="project.progress" :color="project.statusColor" height="6" rounded
            bg-color="surface-variant" class="mb-6"></v-progress-linear>

          <v-divider class="mb-4"></v-divider>

          <div class="d-flex justify-space-between text-caption text-medium-emphasis">
            <span class="d-flex align-center font-weight-medium bg-surface-variant px-2 py-1 rounded">
              <v-icon size="small" class="mr-2">mdi-calendar-clock</v-icon>{{ project.deadline }}
            </span>
            <span class="d-flex align-center font-weight-medium">
              <v-icon size="small" class="mr-1">mdi-account-group-outline</v-icon>{{ project.teamSize }}
              members
            </span>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Timeline & Risks -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card class="modern-card h-100" flat>
          <v-card-title class="d-flex justify-space-between align-center pa-6">
            <span class="font-weight-bold">Project Roadmap</span>
            <div class="d-flex align-center bg-surface-variant rounded-lg pa-1">
              <v-btn size="small" icon="mdi-chevron-left" variant="text" density="comfortable"></v-btn>
              <span class="text-caption font-weight-bold mx-2">Q1 2026</span>
              <v-btn size="small" icon="mdi-chevron-right" variant="text" density="comfortable"></v-btn>
            </div>
          </v-card-title>
          <v-card-text class="pa-0">
            <!-- Simulated Gantt Chart -->
            <div class="d-flex flex-column gap-4 pa-6">
              <div v-for="(item, i) in roadmap" :key="i" class="d-flex align-center">
                <div style="width: 120px;" class="text-body-2 font-weight-bold text-high-emphasis">{{
                  item.name }}</div>
                <div class="flex-grow-1 bg-surface-variant rounded-xl position-relative overflow-hidden"
                  style="height: 36px;">
                  <!-- Grid lines -->
                  <div class="position-absolute h-100 border-e"
                    style="left: 25%; border-color: rgba(0,0,0,0.05) !important;"></div>
                  <div class="position-absolute h-100 border-e"
                    style="left: 50%; border-color: rgba(0,0,0,0.05) !important;"></div>
                  <div class="position-absolute h-100 border-e"
                    style="left: 75%; border-color: rgba(0,0,0,0.05) !important;"></div>

                  <div
                    class="position-absolute rounded-pill d-flex align-center justify-center px-4 text-caption text-white font-weight-bold shadow-sm"
                    :class="`bg-${item.color}`"
                    :style="`left: ${item.start}%; width: ${item.width}%; height: 80%; top: 10%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);`">
                    {{ item.phase }}
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="modern-card h-100 pa-0" flat>
          <div class="pa-6 pb-2">
            <h3 class="text-h6 font-weight-bold text-error d-flex align-center">
              <v-icon color="error" class="mr-2">mdi-alert-decagram</v-icon> Critical Risks
            </h3>
          </div>
          <v-list class="bg-transparent px-4">
            <v-list-item v-for="(risk, i) in risks" :key="i" lines="three"
              class="mb-2 border border-error-lighten-4 bg-error-lighten-5 rounded-lg">
              <v-list-item-title class="font-weight-bold text-error">{{ risk.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption mt-2 text-high-emphasis" style="line-height: 1.4;">{{
                risk.impact }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-card-actions class="px-6 pb-6">
            <v-btn block variant="outlined" color="error" class="rounded-lg text-capitalize font-weight-bold">View Full
              Risk Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Resource Allocation -->
    <v-row>
      <v-col cols="12">
        <v-card class="modern-card pa-6" flat>
          <h3 class="text-h6 font-weight-bold mb-6">Resource Allocation</h3>
          <v-table density="comfortable" class="bg-transparent">
            <thead>
              <tr>
                <th class="text-left font-weight-bold text-medium-emphasis">Resource</th>
                <th class="text-left font-weight-bold text-medium-emphasis">Role</th>
                <th class="text-center font-weight-bold text-medium-emphasis">Project A Utilization</th>
                <th class="text-center font-weight-bold text-medium-emphasis">Project B Utilization</th>
                <th class="text-center font-weight-bold text-medium-emphasis">Maintenance</th>
                <th class="text-center font-weight-bold text-medium-emphasis">Total Load</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in resources" :key="res.name" class="hover-bg-surface-variant transition-swing">
                <td class="font-weight-bold py-3">{{ res.name }}</td>
                <td class="text-caption text-medium-emphasis">{{ res.role }}</td>
                <td class="text-center"><v-chip size="small" v-if="res.projA" color="primary" variant="tonal"
                    class="font-weight-bold">{{ res.projA }}%</v-chip></td>
                <td class="text-center"><v-chip size="small" v-if="res.projB" color="secondary" variant="tonal"
                    class="font-weight-bold">{{ res.projB }}%</v-chip></td>
                <td class="text-center"><v-chip size="small" v-if="res.maint" color="grey" variant="tonal"
                    class="font-weight-bold">{{ res.maint }}%</v-chip></td>
                <td class="text-center">
                  <div class="d-flex align-center justify-center">
                    <span class="text-caption font-weight-bold mr-2"
                      :class="res.total > 100 ? 'text-error' : 'text-success'">{{ res.total
                      }}%</span>
                    <v-progress-circular :model-value="res.total" size="20" width="3"
                      :color="res.total > 100 ? 'error' : 'success'"></v-progress-circular>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
    mentionDenotationChars: ["@"],
    source: function (searchTerm: string, renderList: Function) {
      const values = taskStore.users.map(u => ({ id: u.id, value: u.name }))
      if (searchTerm.length === 0) {
        renderList(values, searchTerm)
      } else {
        const matches = []
        for (let i = 0; i < values.length; i++) {
          if (~values[i]!.value.toLowerCase().indexOf(searchTerm.toLowerCase())) {
            matches.push(values[i]!)
          }
        }
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
  linkType: 'blocks',
  isFlagged: false
})

const projects = [
  { name: 'Website Redesign', description: 'Overhaul of the main corporate website with new branding.', status: 'On Track', statusColor: 'success', progress: 75, deadline: 'Mar 15', teamSize: 5, lead: 'Alice' },
  { name: 'Mobile App V2', description: 'Adding biometric auth and dark mode support for iOS and Android.', status: 'At Risk', statusColor: 'warning', progress: 40, deadline: 'Apr 01', teamSize: 8, lead: 'Bob' },
  { name: 'Backend Migration', description: 'Moving from legacy monolith to microservices architecture.', status: 'Delayed', statusColor: 'error', progress: 20, deadline: 'May 30', teamSize: 6, lead: 'Charlie' },
];

const roadmap = [
  { name: 'Web Redesign', phase: 'Development', start: 20, width: 40, color: 'primary' },
  { name: 'Mobile App', phase: 'Testing', start: 50, width: 30, color: 'purple' },
  { name: 'Backend', phase: 'Planning', start: 0, width: 25, color: 'info' },
];

const risks = [
  { title: 'API Rate Limits', impact: 'Third-party vendor API limits may throttle syncing during peak hours.' },
  { title: 'Resource Shortage', impact: 'Senior frontend dev on medical leave for 2 weeks.' },
];

const resources = [
  { name: 'Sarah J.', role: 'Senior Dev', projA: 50, projB: 0, maint: 50, total: 100 },
  { name: 'Mike T.', role: 'Designer', projA: 80, projB: 20, maint: 0, total: 100 },
  { name: 'Dave B.', role: 'Backend Dev', projA: 0, projB: 50, maint: 60, total: 110 }, // Overutilized
];
</script>

<style scoped>
@import '@/styles/dashboard.css';

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gap-2 {
  gap: 8px;
}

.gap-4 {
  gap: 16px;
}

.hover-bg-surface-variant:hover {
  background-color: rgb(var(--v-theme-surface-variant));
}

.transition-swing {
  transition: background-color 0.2s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.required-field-error :deep(.v-field) {
  border-color: rgb(var(--v-theme-error)) !important;
}

.required-field-error :deep(.v-field__outline) {
  --v-field-border-color: rgb(var(--v-theme-error));
  --v-field-border-width: 2px;
}

.border-dashed {
  border-style: dashed !important;
}

.hover-text-primary:hover,
.hover-text-primary:hover .text-medium-emphasis {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>
