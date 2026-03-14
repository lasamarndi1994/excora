<template>
  <v-container fluid class="pa-0 h-100 d-flex flex-column whitespace-nowrap overflow-hidden bg-surface">
    <!-- Project Header -->
    <ProjectHeader active-tab="decision" />

    <!-- Decision List View -->
    <template v-if="!selectedDecision">
      <div class="px-6 py-4 d-flex align-center justify-space-between flex-wrap gap-4 border-b">
        <h1 class="text-h6 font-weight-bold mb-0 text-high-emphasis">Decision Log</h1>
        <v-btn color="primary" class="text-none font-weight-medium rounded-md" prepend-icon="mdi-plus" size="small"
          elevation="0" @click="isCreateModalOpen = true">
          New Decision
        </v-btn>
      </div>

      <div class="flex-grow-1 px-8 py-6 pb-0 overflow-y-auto bg-grey-lighten-5">
        <v-card variant="flat" class="bg-white rounded-lg border mb-6" elevation="0">
          <!-- Filters -->
          <div class="px-4 py-3 d-flex align-center justify-space-between flex-wrap gap-4 border-b">
            <v-text-field density="compact" single-line variant="outlined" placeholder="Search decisions..."
              prepend-inner-icon="mdi-magnify" hide-details width="300" color="primary" clearable
              class="bg-surface custom-search-input"></v-text-field>

            <div class="d-flex align-center px-2">
              <v-btn variant="outlined" prepend-icon="mdi-calendar-outline"
                class="text-none font-weight-medium text-medium-emphasis border-grey-lighten-1 me-3 "
                size="small">Date</v-btn>
              <v-btn variant="outlined" prepend-icon="mdi-folder-outline"
                class="text-none font-weight-medium text-medium-emphasis border-grey-lighten-1"
                size="small">Project</v-btn>
            </div>
          </div>

          <!-- Decisions Table -->
          <v-table density="comfortable" hover>
            <thead>
              <tr>
                <th style="width:40px" class="px-4"><v-checkbox-btn density="compact" color="primary"></v-checkbox-btn>
                </th>
                <th class="text-subtitle-2 font-weight-bold text-medium-emphasis">Decision ID</th>
                <th class="text-subtitle-2 font-weight-bold text-medium-emphasis">Decision Title</th>
                <th class="text-subtitle-2 font-weight-bold text-medium-emphasis">Linked Project/Task
                </th>
                <th class="text-subtitle-2 font-weight-bold text-medium-emphasis">Date</th>
                <th class="text-subtitle-2 font-weight-bold text-medium-emphasis">Status</th>
                <th class="text-subtitle-2 font-weight-bold text-medium-emphasis">Created By</th>
                <th class="text-subtitle-2 font-weight-bold text-medium-emphasis text-center">Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="decision in decisions" :key="decision.id" class="cursor-pointer"
                @click="selectedDecision = decision">
                <td class="px-4" @click.stop><v-checkbox-btn density="compact" color="primary"></v-checkbox-btn></td>
                <td class="font-weight-medium text-primary border-b hover-underline"
                  @click.stop="selectedDecision = decision">{{ decision.id }}</td>
                <td class="font-weight-medium text-high-emphasis border-b">{{ decision.title }}</td>
                <td class="text-body-2 text-medium-emphasis border-b max-w-250 text-truncate">{{
                  decision.linkedWork }}</td>
                <td class="text-body-2 text-medium-emphasis border-b">{{ decision.date }}</td>
                <td class="border-b">
                  <v-chip size="small" :color="decision.status === 'Approved' ? 'success' : 'warning'" variant="flat"
                    class="font-weight-bold px-3 text-white">
                    {{ decision.status }}
                  </v-chip>
                </td>
                <td class="text-body-2 text-medium-emphasis border-b">{{ decision.createdBy.name }}</td>
                <td class="text-center border-b" @click.stop>
                  <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="medium-emphasis"
                    @click.stop="openEditModal(decision)"></v-btn>
                  <v-btn icon="mdi-eye-outline" variant="text" size="small" color="medium-emphasis"
                    @click.stop="selectedDecision = decision"></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Pagination Mockup -->
          <div class="d-flex justify-center align-center py-4 border-t gap-2">
            <v-btn icon="mdi-chevron-left" variant="text" size="x-small" color="medium-emphasis"></v-btn>
            <v-btn variant="tonal" size="x-small" color="primary" class="font-weight-bold rounded-sm">1</v-btn>
            <v-btn variant="text" size="x-small" class="font-weight-bold text-medium-emphasis">2</v-btn>
            <v-btn variant="text" size="x-small" class="font-weight-bold text-medium-emphasis">3</v-btn>
            <v-btn icon="mdi-chevron-right" variant="text" size="x-small" color="medium-emphasis"></v-btn>
          </div>
        </v-card>
      </div>
    </template>

    <!-- Decision Detail View -->
    <template v-else>
      <DecisionDetails :decision="selectedDecision" @close="selectedDecision = null" />
    </template>

    <!-- Create Decision Modal -->
    <CreateDecisionDialog v-model="isCreateModalOpen" :issues="store.issues" :current-user="store.currentUser"
      @save="saveNewDecision" />

    <!-- Edit Decision Modal -->
    <EditDecisionDialog v-model="isEditModalOpen" :decision="decisionToEdit" :issues="store.issues"
      :current-user="store.currentUser" @save="saveEditDecision" />

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import ProjectHeader from '@/components/ProjectHeader.vue'
import DecisionDetails from './components/DecisionDetails.vue'
import CreateDecisionDialog from './components/CreateDecisionDialog.vue'
import EditDecisionDialog from './components/EditDecisionDialog.vue'
import type { Decision } from '@/stores/taskStore'

const store = useTaskStore()
const decisions = computed(() => store.decisions)

const selectedDecision = ref<Decision | null>(null)

// Create logic
const isCreateModalOpen = ref(false)
const saveNewDecision = (payload: Omit<Decision, 'id' | 'createdBy'>) => {
  store.addDecision({ ...payload, createdBy: store.currentUser })
  isCreateModalOpen.value = false
}

// Edit logic
const isEditModalOpen = ref(false)
const decisionToEdit = ref<Decision | null>(null)

const openEditModal = (decision: Decision) => {
  decisionToEdit.value = decision
  isEditModalOpen.value = true
}

const saveEditDecision = (id: string, payload: Partial<Decision>) => {
  store.updateDecision(id, payload)
  isEditModalOpen.value = false
}
</script>

<style scoped>
.custom-search-input :deep(.v-field__input) {
  min-height: 36px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.max-w-250 {
  max-width: 250px;
}

.hover-underline:hover {
  text-decoration: underline;
}
</style>
