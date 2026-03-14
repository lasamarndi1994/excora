<template>
  <v-card class="issue-card cursor-pointer" rounded="lg" elevation="0">
    <v-card-text class="pa-3">
      <div class="text-body-2 mb-3 text-high-emphasis font-weight-medium line-clamp-2">
        {{ issue.summary }}
      </div>
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-2">
          <!-- Type chip -->
          <v-chip
            size="x-small"
            :color="typeConfig.color"
            variant="tonal"
            class="font-weight-semibold px-2"
            style="height:20px;"
          >
            <v-icon :icon="typeConfig.icon" size="11" class="mr-1"></v-icon>
            {{ issue.type }}
          </v-chip>
          <span class="text-caption text-medium-emphasis font-weight-medium">{{ issue.key }}</span>
        </div>

        <div class="d-flex align-center gap-1">
          <!-- Priority dot -->
          <v-icon :color="priorityColor" size="12">mdi-circle</v-icon>
          <!-- Assignees -->
          <div class="d-flex ml-1">
            <v-avatar
              v-for="(assignee, i) in issue.assignees.slice(0, 3)"
              :key="assignee.id"
              size="22"
              :class="{ 'ml-n2': i > 0 }"
              style="border: 2px solid rgb(var(--v-theme-surface)); z-index: 1;"
            >
              <v-img :src="assignee.avatar" :alt="assignee.name"></v-img>
              <v-tooltip activator="parent" location="top">{{ assignee.name }}</v-tooltip>
            </v-avatar>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Issue } from '@/stores/taskStore'

const props = defineProps<{ issue: Issue }>()

const typeConfig = computed(() => {
  switch (props.issue.type) {
    case 'Bug':   return { icon: 'mdi-alert-circle', color: 'error' }
    case 'Story': return { icon: 'mdi-bookmark', color: 'success' }
    case 'Epic':  return { icon: 'mdi-lightning-bolt', color: 'purple' }
    default:      return { icon: 'mdi-check-bold', color: 'info' }
  }
})

const priorityColor = computed(() => {
  switch ((props.issue.priority || '').toLowerCase()) {
    case 'high':   return 'error'
    case 'medium': return 'warning'
    case 'low':    return 'success'
    default:       return 'grey'
  }
})
</script>

<style scoped>
.issue-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
}
.issue-card:hover {
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.12) !important;
  transform: translateY(-1px);
  border-color: rgba(79, 70, 229, 0.3) !important;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
</style>
