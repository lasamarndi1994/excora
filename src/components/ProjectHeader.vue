<template>
  <div class="project-header px-6 pt-4 border-b bg-surface">
    <!-- Breadcrumb -->
    <div class="d-flex align-center mb-2 gap-1">
      <v-icon size="14" class="text-medium-emphasis">mdi-folder-outline</v-icon>
      <span class="text-caption text-medium-emphasis">Spaces</span>
      <v-icon size="12" class="text-medium-emphasis">mdi-chevron-right</v-icon>
      <span class="text-caption text-medium-emphasis font-weight-medium">Cryptocurrency Payment Gateway</span>
    </div>

    <!-- Title row -->
    <div class="d-flex align-center justify-space-between mb-3">
      <div class="d-flex align-center gap-2">
        <v-sheet width="28" height="28" color="orange-darken-2" rounded="lg"
          class="d-flex align-center justify-center flex-shrink-0">
          <v-icon size="16" color="white">mdi-vector-square</v-icon>
        </v-sheet>
        <h1 class="text-subtitle-1 font-weight-bold">Cryptocurrency Payment Gateway</h1>
        <v-btn icon="mdi-open-in-new" variant="text" size="x-small" class="text-medium-emphasis"></v-btn>
        <v-btn icon="mdi-dots-horizontal" variant="text" size="x-small" class="text-medium-emphasis"></v-btn>
      </div>
      <div class="d-flex align-center gap-1">
        <v-btn icon="mdi-share-variant-outline" variant="text" size="small" class="text-medium-emphasis"></v-btn>
        <v-btn icon="mdi-lightning-bolt-outline" variant="text" size="small" class="text-medium-emphasis"></v-btn>
        <v-btn icon="mdi-fullscreen" variant="text" size="small" class="text-medium-emphasis"></v-btn>
      </div>
    </div>

    <!-- Tabs -->
    <v-tabs density="compact" color="primary" class="mb-n1" :model-value="activeTab">
      <v-tab class="text-none text-body-2 font-weight-medium px-3" value="overview" to="/overview"
        prepend-icon="mdi-view-dashboard-outline">Overview</v-tab>
      <v-tab class="text-none text-body-2 font-weight-medium px-3" value="backlog" to="/backlog"
        prepend-icon="mdi-format-list-bulleted">Backlog</v-tab>
      <v-tab class="text-none text-body-2 font-weight-medium px-3" value="board" to="/board"
        prepend-icon="mdi-view-column-outline">Board</v-tab>
      <v-tab class="text-none text-body-2 font-weight-medium px-3" value="sprint" to="/sprint"
        prepend-icon="mdi-code-braces">Sprint</v-tab>
      <v-tab class="text-none text-body-2 font-weight-medium px-3" value="report" to="/reports"
        prepend-icon="mdi-chart-bar">Reports</v-tab>
      <v-tab class="text-none text-body-2 font-weight-medium px-3" value="timeline" to="/timeline"
        prepend-icon="mdi-chart-timeline-variant">Timeline</v-tab>
      <v-tab class="text-none text-body-2 font-weight-medium px-3" value="decision" to="/decisions"
        prepend-icon="mdi-book-open-outline">Decisions</v-tab>
      <v-btn icon="mdi-plus" variant="text" size="small" class="ml-1 text-medium-emphasis"></v-btn>
    </v-tabs>
  </div>
</template>

<script setup lang="ts">
defineProps<{ activeTab?: string }>()
</script>

<style scoped>
.project-header {
  position: sticky;
  top: 0;
  z-index: 5;
}
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
</style>
