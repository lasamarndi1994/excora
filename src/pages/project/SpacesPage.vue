<template>
  <v-container fluid class="pa-6 mx-auto">
    <!-- Header -->
    <div class="mb-6 d-flex align-center justify-space-between">
      <h1 class="text-h5 font-weight-bold">Spaces</h1>
      <v-btn color="primary" class="text-none font-weight-bold rounded-md"
        @click="isCreateProjectDialogOpen = true">Create Project</v-btn>
    </div>

    <!-- Create Project Dialog -->
    <v-dialog v-model="isCreateProjectDialogOpen" max-width="800" scroll-strategy="none">
      <v-card class="rounded-md">
        <v-card-title class="d-flex align-center justify-space-between pa-4 border-b">
          <span class="text-h6 font-weight-bold">Create Project</span>
          <v-btn icon="mdi-close" variant="text" density="comfortable" size="small"
            @click="isCreateProjectDialogOpen = false"></v-btn>
        </v-card-title>

        <v-card-text class="pa-6" style="overflow-y: auto; max-height: 80vh;">
          <v-form @submit.prevent>
            <div class="mb-5">
              <label class="text-body-2 font-weight-bold d-block mb-1">Project Name <span
                  class="text-error">*</span></label>
              <v-text-field v-model="newProject.name" variant="outlined" density="compact" hide-details
                placeholder="e.g. Mobile App Development" bg-color="white"></v-text-field>
            </div>

            <div class="mb-5">
              <label class="text-body-2 font-weight-bold d-block mb-1">Description</label>
              <div class="border rounded-md bg-white">
                <QuillEditor :content="newProject.description" @update:content="newProject.description = $event"
                  :modules="modules" placeholder="e.g. Android & iOS app" />
              </div>
            </div>

            <v-row class="mb-1">
              <v-col cols="12" sm="6" class="py-0">
                <div class="mb-5">
                  <label class="text-body-2 font-weight-bold d-block mb-1">Project Type</label>
                  <v-select v-model="newProject.type" :items="['Scrum', 'Kanban']" variant="outlined" density="compact"
                    hide-details bg-color="white"></v-select>
                </div>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <div class="mb-5">
                  <label class="text-body-2 font-weight-bold d-block mb-1">Sprint Duration</label>
                  <v-select v-model="newProject.sprintDuration" :items="['1 Week', '2 Weeks', '3 Weeks', '4 Weeks']"
                    variant="outlined" density="compact" hide-details bg-color="white"></v-select>
                </div>
              </v-col>
            </v-row>

            <v-row class="mb-1">
              <v-col cols="12" sm="6" class="py-0">
                <div class="mb-5">
                  <label class="text-body-2 font-weight-bold d-block mb-1">Start Date</label>
                  <v-text-field v-model="newProject.startDate" type="date" variant="outlined" density="compact"
                    hide-details bg-color="white"></v-text-field>
                </div>
              </v-col>
              <v-col cols="12" sm="6" class="py-0">
                <div class="mb-5">
                  <label class="text-body-2 font-weight-bold d-block mb-1">Owner</label>
                  <v-autocomplete v-model="newProject.owner" :items="taskStore.users" item-title="name" item-value="id"
                    return-object chips closable-chips variant="outlined" density="compact" hide-details
                    placeholder="Select owner" bg-color="white">
                    <template #chip="{ props, item }">
                      <v-chip v-bind="props" :prepend-avatar="item.raw.avatar" size="small" class="mr-1">
                        {{ item.raw.name }}
                      </v-chip>
                    </template>
                    <template #item="{ props, item }">
                      <v-list-item v-bind="props" :title="undefined" class="pa-2" min-height="32">
                        <template #prepend>
                          <v-avatar :image="item.raw.avatar" size="24" class="mr-3"></v-avatar>
                        </template>
                        <v-list-item-title class="text-body-2">{{ item.raw.name }}</v-list-item-title>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </div>
              </v-col>
            </v-row>

            <div class="mb-5">
              <label class="text-body-2 font-weight-bold d-block mb-1">Team Members</label>
              <v-select v-model="newProject.teamMembers" :items="['Developer', 'QA team', 'Project Manager']" multiple
                chips closable-chips variant="outlined" density="compact" hide-details placeholder="Select team members"
                bg-color="white"></v-select>
            </div>

            <div class="mb-2">
              <label class="text-body-2 font-weight-bold d-block mb-1">Workflow</label>
              <v-select v-model="newProject.workflow" :items="['Todo', 'Inprogress', 'Review', 'QA Complate', 'Done']"
                multiple chips closable-chips variant="outlined" density="compact" hide-details
                placeholder="Select workflow steps" bg-color="white"></v-select>
            </div>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4 bg-grey-lighten-5 justify-end">
          <v-btn variant="text" class="text-none font-weight-medium text-medium-emphasis mr-2"
            @click="isCreateProjectDialogOpen = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" class="text-none font-weight-medium px-6">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Controls -->
    <div class="mb-6 d-flex align-center gap-4">
      <v-text-field density="compact" variant="outlined" placeholder="Search spaces" prepend-inner-icon="mdi-magnify"
        hide-details style="max-width: 300px;"></v-text-field>

      <v-select density="compact" variant="outlined" :items="['All apps', 'Jira Software', 'Jira Service Management']"
        label="Filter by app" hide-details class="custom-select" style="max-width: 200px;"></v-select>
    </div>

    <!-- Table Section -->
    <v-card elevation="0" border class="overflow-hidden">
      <v-table class="spaces-table">
        <thead>
          <tr>
            <th class="text-left font-weight-medium text-medium-emphasis pl-4" style="width: 10px;">
              <v-icon size="small">mdi-star</v-icon>
            </th>
            <th class="text-left font-weight-medium text-medium-emphasis" style="width: 25%;">
              Name <v-icon size="small" class="ml-1">mdi-arrow-down</v-icon>
            </th>
            <th class="text-left font-weight-medium text-medium-emphasis" style="width: 15%;">Key</th>
            <th class="text-left font-weight-medium text-medium-emphasis" style="width: 30%;">Type</th>
            <th class="text-left font-weight-medium text-medium-emphasis" style="width: 20%;">Lead</th>
            <th class="text-center font-weight-medium text-medium-emphasis" style="width: 30%;">Space URL
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="space in spaces" :key="space.key" class="space-row cursor-pointer hover-bg-grey">
            <td class="pl-4">
              <v-btn icon="mdi-star" variant="text" size="small" :color="space.starred ? 'warning' : 'grey-lighten-1'"
                class="star-btn" :class="{ 'opacity-0': !space.starred }"></v-btn>
            </td>
            <td>
              <div class="d-flex align-center py-2">
                <v-sheet :color="space.color" width="24" height="24" rounded
                  class="d-flex align-center justify-center mr-3">
                  <v-icon :icon="space.icon" size="14" color="white"></v-icon>
                </v-sheet>
                <span class="text-primary font-weight-medium">{{ space.name }}</span>
              </div>
            </td>
            <td class="text-body-2">{{ space.key }}</td>
            <td class="text-body-2">{{ space.type }}</td>
            <td>
              <div class="d-flex align-center">
                <v-avatar size="24" :color="space.leadColor" class="mr-2">
                  <span class="text-caption text-white font-weight-bold">{{ space.leadInitials
                  }}</span>
                </v-avatar>
                <span class="text-body-2">{{ space.leadName }}</span>
              </div>
            </td>
            <td class="text-center">
              <v-btn icon="mdi-dots-horizontal" variant="text" size="small" class="text-medium-emphasis"></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Pagination -->
    <div class="d-flex justify-center mt-6">
      <v-pagination v-model="page" :length="1" :total-visible="5" density="comfortable" active-color="primary"
        class="custom-pagination"></v-pagination>
    </div>

  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QuillEditor from '@/components/QuillEditor.vue'
import { useTaskStore } from '@/stores/taskStore'

const page = ref(1)
const isCreateProjectDialogOpen = ref(false)

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

const newProject = ref({
  name: 'Mobile App Development',
  description: 'Android & iOS app',
  type: 'Scrum',
  sprintDuration: '2 Weeks',
  startDate: '2026-03-10',
  owner: taskStore.users[0], // Prepopulate with a mocked user for the tag to show
  teamMembers: ['Developer', 'QA team', 'Project Manager'],
  workflow: ['Todo', 'Inprogress', 'Review', 'QA Complate', 'Done']
})

// Static data based on user screenshot
const spaces = ref([
  {
    name: 'Cryptocurrency Payment Gateway',
    key: 'CPG',
    type: 'Team-managed software',
    leadName: 'Satya Ranjan Bal',
    leadInitials: 'SB',
    leadColor: 'orange-darken-3',
    icon: 'mdi-poll',
    color: 'red-darken-2',
    starred: true
  },
  {
    name: 'Execora',
    key: 'EX',
    type: 'Team-managed software',
    leadName: 'Satya Ranjan Bal',
    leadInitials: 'SB',
    leadColor: 'orange-darken-3',
    icon: 'mdi-wallet-bifold',
    color: 'blue-darken-3',
    starred: false
  },
  {
    name: 'Kanban',
    key: 'KAN',
    type: 'Team-managed software',
    leadName: 'Lasa Marandi',
    leadInitials: 'LM',
    leadColor: 'red-darken-3',
    icon: 'mdi-cellphone-link',
    color: 'amber-darken-2',
    starred: false
  },
  {
    name: 'Kanban 1',
    key: 'K1',
    type: 'Team-managed software',
    leadName: 'Lasa Marandi',
    leadInitials: 'LM',
    leadColor: 'red-darken-3',
    icon: 'mdi-cellphone-link',
    color: 'blue',
    starred: false
  },
  {
    name: 'Marketing asset creation',
    key: 'MAC',
    type: 'Team-managed business',
    leadName: 'Lasa Marandi',
    leadInitials: 'LM',
    leadColor: 'red-darken-3',
    icon: 'mdi-puzzle',
    color: 'cyan-darken-1',
    starred: false
  },
  {
    name: 'Project management',
    key: 'PM',
    type: 'Team-managed business',
    leadName: 'Lasa Marandi',
    leadInitials: 'LM',
    leadColor: 'red-darken-3',
    icon: 'mdi-rocket-launch',
    color: 'indigo-darken-4',
    starred: false
  }
])
</script>

<style scoped>
.gap-4 {
  gap: 16px;
}

.custom-select :deep(.v-field__input) {
  min-height: 40px !important;
  padding-top: 0;
  padding-bottom: 0;
}

/* Table overrides */
.spaces-table th {
  font-size: 0.75rem !important;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e0e0e0 !important;
  background-color: transparent !important;
}

.spaces-table td {
  border-bottom: 1px solid #f0f0f0 !important;
}

.space-row {
  transition: background-color 0.2s ease;
}

.hover-bg-grey:hover {
  background-color: #f4f5f7 !important;
}

.hover-bg-grey:hover .star-btn {
  opacity: 1 !important;
}

.opacity-0 {
  opacity: 0;
}

/* Pagination overrides */
.custom-pagination :deep(.v-pagination__item) {
  border: 1px solid #dfe1e6;
  border-radius: 3px;
  min-width: 32px;
  height: 32px;
  margin: 0 4px;
}

.custom-pagination :deep(.v-pagination__item--is-active) {
  border-color: var(--v-theme-primary);
}
</style>
