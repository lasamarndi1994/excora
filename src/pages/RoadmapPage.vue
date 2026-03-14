<template>
  <v-container fluid class="h-100 pa-6">
    <div class="d-flex align-center mb-6">
      <h1 class="text-h5 font-weight-bold">Roadmap</h1>
      <v-spacer></v-spacer>
      <v-btn variant="outlined" color="primary" class="mr-2">
        Weeks
        <v-icon right>mdi-chevron-down</v-icon>
      </v-btn>
    </div>

    <!-- Timeline Grid Header -->
    <div class="timeline-container border rounded bg-surface">
      <div class="d-flex border-b">
        <div class="timeline-sidebar border-e pa-3 font-weight-bold text-caption text-medium-emphasis"
          style="width: 250px; min-width: 250px;">
          Epics
        </div>
        <div class="flex-grow-1 d-flex overflow-hidden">
          <div v-for="month of months" :key="month"
            class="flex-grow-1 border-e text-center py-2 text-caption text-medium-emphasis font-weight-bold">
            {{ month }}
          </div>
        </div>
      </div>

      <!-- Epic Rows -->
      <div v-for="epic in store.epics" :key="epic.id" class="d-flex border-b">
        <!-- Sidebar Item -->
        <div class="timeline-sidebar border-e pa-3 d-flex align-center" style="width: 250px; min-width: 250px;">
          <v-icon icon="mdi-lightning-bolt" color="purple-lighten-1" size="20" class="mr-2"></v-icon>
          <span class="text-body-2 font-weight-medium text-truncate">{{ epic.name }}</span>
        </div>

        <!-- Timeline Bar Track -->
        <div class="flex-grow-1 position-relative py-3">
          <div class="grid-lines h-100 w-100 d-flex position-absolute top-0 left-0"
            style="z-index: 0; pointer-events: none;">
            <div v-for="m in 3" :key="m" class="flex-grow-1 border-e h-100"></div>
          </div>

          <!-- Bar -->
          <div
            class="timeline-bar rounded position-relative d-flex align-center px-2 text-white text-caption font-weight-medium elevation-1"
            :style="{
              backgroundColor: epic.color,
              width: '40%',
              marginLeft: getMargin(epic),
              height: '24px',
              zIndex: 1
            }">
            {{ epic.summary }}
          </div>
        </div>
      </div>

      <div class="d-flex pa-2">
        <v-btn variant="text" prepend-icon="mdi-plus" color="medium-emphasis" class="text-caption">Create
          epic</v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()
const months = ['Oct', 'Nov', 'Dec']

// Mock logic for bar position
const getMargin = (epic: any) => {
  // Random offsets for demo
  if (epic.id === 'e1') return '10%'
  if (epic.id === 'e2') return '45%'
  if (epic.id === 'e3') return '15%'
  return '0%'
}
</script>

<style scoped>
.timeline-container {
  overflow-x: auto;
}

.timeline-bar:hover {
  filter: brightness(0.95);
  cursor: pointer;
}
</style>
