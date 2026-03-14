<template>
  <v-container fluid class="pa-6 page-container">
    <!-- Header -->
    <div class="d-flex align-center justify-space-between flex-wrap gap-4 mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold mb-1">
          Good morning, <span class="text-gradient">{{ store.currentUser.name }}</span> 👋
        </h1>
        <p class="text-body-2 text-medium-emphasis">Here's what's on your plate today.</p>
      </div>
      <v-btn color="primary" prepend-icon="mdi-check-all" rounded="lg" class="font-weight-semibold" elevation="0">
        My Tasks
      </v-btn>
    </div>

    <!-- Quick Stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="4" v-for="(stat, i) in quickStats" :key="i">
        <v-card class="card-hover pa-5 d-flex align-center gap-4" rounded="xl" :class="stat.borderClass">
          <v-avatar :color="stat.avatarColor" size="48" rounded="lg">
            <v-icon :color="stat.iconColor" size="24">{{ stat.icon }}</v-icon>
          </v-avatar>
          <div>
            <div class="text-caption font-weight-medium text-medium-emphasis mb-0.5">{{ stat.label }}</div>
            <div class="text-h4 font-weight-black">{{ stat.value }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- My Tasks -->
      <v-col cols="12" md="8">
        <v-card rounded="xl" class="h-100">
          <div class="d-flex justify-space-between align-center px-6 py-4 border-b">
            <span class="text-subtitle-1 font-weight-bold">My Priorities</span>
            <v-chip size="small" variant="tonal" color="primary" class="font-weight-semibold">
              {{ pendingTasks.length }} tasks
            </v-chip>
          </div>

          <v-list class="bg-transparent py-0">
            <template v-for="(task, index) in pendingTasks" :key="task.id">
              <v-list-item class="px-6 py-3 hover-bg-surface-variant transition-swing cursor-pointer">
                <template v-slot:prepend>
                  <v-checkbox-btn v-model="task.completed" color="primary" class="mr-3"></v-checkbox-btn>
                </template>

                <v-list-item-title
                  class="font-weight-medium text-body-2 mb-1"
                  :class="{ 'text-decoration-line-through text-medium-emphasis': task.completed }"
                >
                  {{ task.title }}
                </v-list-item-title>

                <v-list-item-subtitle class="d-flex align-center flex-wrap gap-2 mt-0.5">
                  <span class="d-flex align-center text-caption font-weight-medium" :class="getUrgencyColor(task.dueDate)">
                    <v-icon size="12" class="mr-1">mdi-calendar-clock</v-icon>
                    {{ task.dueDate }}
                  </span>
                  <span class="text-caption text-medium-emphasis d-flex align-center">
                    <v-icon size="12" class="mr-1">mdi-folder-outline</v-icon>
                    {{ task.project }}
                  </span>
                </v-list-item-subtitle>

                <template v-slot:append>
                  <v-chip
                    size="x-small"
                    :color="getPriorityColor(task.priority)"
                    variant="tonal"
                    class="font-weight-semibold ml-3"
                  >
                    {{ task.priority }}
                  </v-chip>
                </template>
              </v-list-item>
              <v-divider v-if="index < pendingTasks.length - 1" class="mx-6"></v-divider>
            </template>

            <div v-if="pendingTasks.length === 0" class="pa-10 text-center">
              <v-icon color="success" size="52" class="mb-3">mdi-check-circle-outline</v-icon>
              <div class="text-subtitle-2 font-weight-bold mb-1">You're all caught up!</div>
              <div class="text-caption text-medium-emphasis">No pending tasks for today.</div>
            </div>
          </v-list>
        </v-card>
      </v-col>

      <!-- Activity -->
      <v-col cols="12" md="4">
        <v-card rounded="xl" class="h-100 d-flex flex-column">
          <div class="px-6 py-4 border-b d-flex justify-space-between align-center">
            <span class="text-subtitle-1 font-weight-bold">Recent Activity</span>
            <v-btn variant="text" size="small" color="primary" class="text-none font-weight-medium">View all</v-btn>
          </div>

          <v-card-text class="flex-grow-1 px-6 pb-4 pt-4">
            <v-timeline density="compact" align="start" truncate-line="start" class="activity-timeline">
              <v-timeline-item
                v-for="(activity, i) in recentActivity"
                :key="i"
                :dot-color="activity.color"
                size="x-small"
              >
                <div class="mb-0.5">
                  <span class="font-weight-semibold text-body-2">{{ activity.user }}</span>
                  <span class="text-body-2 text-medium-emphasis ml-1">{{ activity.action }}</span>
                </div>
                <div class="text-caption font-weight-medium text-primary cursor-pointer hover-underline">
                  {{ activity.target }}
                </div>
                <div class="text-caption text-medium-emphasis mt-0.5">{{ activity.time }}</div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()

const quickStats = [
  {
    label: 'Active Tasks', value: 12,
    icon: 'mdi-clipboard-text-outline',
    avatarColor: 'indigo-lighten-5', iconColor: 'indigo-darken-1',
    borderClass: 'stat-card-blue'
  },
  {
    label: 'Pending Review', value: 4,
    icon: 'mdi-eye-outline',
    avatarColor: 'orange-lighten-5', iconColor: 'orange-darken-2',
    borderClass: 'stat-card-amber'
  },
  {
    label: 'Completed This Week', value: 28,
    icon: 'mdi-check-decagram-outline',
    avatarColor: 'green-lighten-5', iconColor: 'green-darken-2',
    borderClass: 'stat-card-green'
  },
]

const pendingTasks = ref([
  { id: 1, title: 'Fix navigation bug on mobile', project: 'Website Redesign', dueDate: 'Today', priority: 'High', completed: false },
  { id: 2, title: 'Review API payload structures', project: 'Backend Migration', dueDate: 'Tomorrow', priority: 'Medium', completed: false },
  { id: 3, title: 'Update onboarding illustrations', project: 'Mobile App V2', dueDate: 'Oct 24', priority: 'Low', completed: false },
  { id: 4, title: 'Prepare slide deck for sprint review', project: 'Execora (EX)', dueDate: 'Oct 25', priority: 'Medium', completed: false },
])

const recentActivity = [
  { user: 'Sarah J.', action: 'mentioned you in', target: 'EX-142 Overview Doc', time: '10 mins ago', color: 'indigo' },
  { user: 'Mike T.', action: 'moved', target: 'Design System Update', time: '1 hour ago', color: 'purple' },
  { user: 'System', action: 'assigned you to', target: 'Performance Audit', time: '2 hours ago', color: 'orange' },
  { user: 'Dave B.', action: 'completed', target: 'Database Migration Phase 1', time: 'Yesterday', color: 'green' },
]

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high': return 'error'
    case 'medium': return 'warning'
    case 'low': return 'success'
    default: return 'grey'
  }
}

const getUrgencyColor = (dateString: string) => {
  if (dateString.toLowerCase() === 'today') return 'text-error font-weight-bold'
  if (dateString.toLowerCase() === 'tomorrow') return 'text-warning font-weight-bold'
  return 'text-medium-emphasis'
}
</script>

<style scoped>
@import '@/styles/global.css';

:deep(.activity-timeline .v-timeline-divider) {
  min-width: 40px;
}
</style>
