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
      <v-tabs :model-value="activeTab" density="compact" color="primary" class="task-tabs">
        <v-tab value="list" class="text-none font-weight-medium px-3 text-body-2"
          @click="$router.push('/tasks/list')">
          <v-icon size="16" class="mr-1">mdi-format-list-bulleted</v-icon> List
        </v-tab>
        <v-tab value="board" class="text-none font-weight-medium px-3 text-body-2"
          @click="$router.push('/tasks/board')">
          <v-icon size="16" class="mr-1">mdi-view-column-outline</v-icon> Board
        </v-tab>
        <v-tab value="calendar" class="text-none font-weight-medium px-3 text-body-2"
          @click="$router.push('/tasks/calendar')">
          <v-icon size="16" class="mr-1">mdi-calendar-blank-outline</v-icon> Calendar
        </v-tab>
        <v-tab value="dashboard" class="text-none font-weight-medium px-3 text-body-2"
          @click="$router.push('/tasks/dashboard')">
          <v-icon size="16" class="mr-1">mdi-view-dashboard-outline</v-icon> Dashboard
        </v-tab>
        <v-tab value="files" class="text-none font-weight-medium px-3 text-body-2"
          @click="$router.push('/tasks/files')">
          <v-icon size="16" class="mr-1">mdi-paperclip</v-icon> Files
        </v-tab>
        <v-btn icon="mdi-plus" variant="text" size="x-small" class="ml-1 align-self-center text-medium-emphasis" />
      </v-tabs>
      <v-divider />
    </div>

    <!-- Toolbar -->
    <div v-if="showAddTask" class="px-6 py-3 d-flex align-center justify-space-between">
      <div class="d-flex gap-1">
        <template v-if="showAddTask">
          <v-btn color="primary" size="small" class="text-none rounded-e-0 pr-2" prepend-icon="mdi-plus"
            elevation="0">Add task</v-btn>
          <v-btn color="primary" size="small" class="text-none rounded-s-0 px-1 border-s-thin border-white"
            elevation="0" style="min-width:28px">
            <v-icon size="16">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
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

    <!-- Routed tab content -->
    <div class="flex-grow-1 overflow-hidden d-flex flex-column">
      <router-view />
    </div>

  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeTab = computed(() => {
  const seg = route.path.split('/').pop()
  return ['list', 'board', 'calendar', 'dashboard', 'files'].includes(seg ?? '')
    ? seg
    : 'list'
})

const showAddTask = computed(() => ['list', 'board'].includes(activeTab.value ?? ''))
</script>

<style scoped>
.task-tabs :deep(.v-tab) {
  min-width: 0;
  padding: 0 12px;
}
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
</style>
