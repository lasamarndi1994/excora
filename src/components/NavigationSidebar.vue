<template>
  <v-navigation-drawer
    v-model="uiStore.drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    :temporary="$vuetify.display.mobile ? true : undefined"
    width="240"
    class="nav-sidebar"
  >
    <!-- Brand -->
    <div class="px-4 pt-5 pb-4 d-flex align-center">
      <div class="brand-logo mr-3">
        <v-icon icon="mdi-rocket-launch" color="white" size="18"></v-icon>
      </div>
      <div>
        <div class="text-subtitle-2 font-weight-bold">Execora</div>
        
      </div>
    
    </div>

    <v-divider class="mb-2 mx-3"></v-divider>

    <v-list density="compact" nav class="px-3 py-1">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        :to="item.to"
        color="primary"
        min-height="38"
        class="mb-0.5 nav-item"
        rounded="lg"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon" size="18" class="mr-1"></v-icon>
        </template>
        <v-list-item-title class="text-body-2 font-weight-medium">{{ item.title }}</v-list-item-title>
        <template v-slot:append v-if="item.badge">
          <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold px-1">
            {{ item.badge }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="my-3 mx-3"></v-divider>

    <div class="px-3">
      <div class="text-caption font-weight-semibold text-medium-emphasis px-2 mb-1 text-uppercase" style="letter-spacing:0.06em;">Projects</div>
      <v-list density="compact" nav class="py-0">
        <v-list-item
          v-for="proj in projects"
          :key="proj.name"
          :to="proj.to"
          color="primary"
          min-height="36"
          class="mb-0.5 nav-item"
          rounded="lg"
        >
          <template v-slot:prepend>
            <v-sheet :color="proj.color" width="18" height="18" rounded="sm"
              class="d-flex align-center justify-center mr-2">
              <v-icon size="11" color="white">{{ proj.icon }}</v-icon>
            </v-sheet>
          </template>
          <v-list-item-title class="text-body-2 font-weight-medium">{{ proj.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>

    <!-- Bottom: Create button -->
    <template v-slot:append>
      <div class="pa-3">
        <v-btn block color="primary" rounded="lg" prepend-icon="mdi-plus" class="font-weight-semibold"
          variant="tonal">
          New Item
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()

const items = ref([
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/dashboard' },
  { title: 'Inbox', icon: 'mdi-inbox-outline', to: '/inbox', badge: 3 },
  { title: 'My Tasks', icon: 'mdi-checkbox-marked-outline', to: '/tasks' },
  { title: 'Projects', icon: 'mdi-folder-outline', to: '/projects' },
  { title: 'Decisions', icon: 'mdi-checkbox-multiple-marked-outline', to: '/decisions' },
  { title: 'Reports', icon: 'mdi-chart-line', to: '/reports' },
  { title: 'Roadmap', icon: 'mdi-timeline-text-outline', to: '/roadmap' },
])

const projects = ref([
  { name: 'My EKYC', icon: 'mdi-shield-check', color: 'indigo', to: '/board' },
  { name: 'Crypto Gateway', icon: 'mdi-bitcoin', color: 'orange-darken-2', to: '/backlog' },
])
</script>

<style scoped>
.nav-sidebar {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
}

.brand-logo {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-item {
  transition: background-color 0.15s ease;
}
</style>
