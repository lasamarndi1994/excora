<template>
  <v-app-bar height="52" flat class="topbar border-b px-2">
    <div class="d-flex align-center w-100 gap-2">
      <v-app-bar-nav-icon variant="text" size="small" @click.stop="uiStore.toggleDrawer"
        class="text-medium-emphasis"></v-app-bar-nav-icon>

      <div class="text-subtitle-2 font-weight-semibold" style="white-space:nowrap;">{{ title }}</div>

      <v-spacer></v-spacer>

      <!-- Search -->
      <v-text-field
        density="compact"
        variant="outlined"
        placeholder="Search..."
        prepend-inner-icon="mdi-magnify"
        hide-details
        single-line
        class="search-field"
        :style="{ width: searchFocused ? '320px' : '180px', transition: 'width 0.3s ease' }"
        color="primary"
        rounded="lg"
        @focus="searchFocused = true"
        @blur="searchFocused = false"
        autocomplete="off"
        bg-color="surface-variant"
      >
        <template v-slot:append-inner>
          <span v-if="!searchFocused" class="search-kbd">⌘K</span>
        </template>
      </v-text-field>

      <!-- Notifications -->
      <v-menu width="400" max-height="560" :close-on-content-click="false" offset="10" location="bottom center">
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" class="text-medium-emphasis" v-bind="props">
            <v-badge color="error" content="3" floating>
              <v-icon size="20">mdi-bell-outline</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <v-card rounded="xl" elevation="8" class="overflow-hidden">
          <div class="d-flex align-center justify-space-between px-4 py-3 border-b">
            <span class="text-subtitle-2 font-weight-bold">Notifications</span>
            <div class="d-flex align-center gap-2">
              <v-btn icon density="compact" variant="text" size="small">
                <v-icon size="16">mdi-dots-vertical</v-icon>
              </v-btn>
            </div>
          </div>
          <v-tabs density="compact" color="primary">
            <v-tab value="direct" class="text-none text-caption px-4">Direct</v-tab>
            <v-tab value="watching" class="text-none text-caption px-4">Watching</v-tab>
          </v-tabs>
          <v-divider></v-divider>
          <div class="d-flex flex-column align-center justify-center pa-8 text-center" style="min-height: 240px;">
            <div class="notif-empty-icon mb-3">
              <v-icon size="28" color="primary">mdi-check-all</v-icon>
            </div>
            <div class="text-subtitle-2 font-weight-bold mb-1">All caught up</div>
            <div class="text-caption text-medium-emphasis">No unread notifications from the last 30 days.</div>
          </div>
        </v-card>
      </v-menu>

      <!-- Help -->
      <v-menu width="320" :close-on-content-click="false" offset="10" location="bottom center">
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" class="text-medium-emphasis" v-bind="props">
            <v-icon size="20">mdi-help-circle-outline</v-icon>
          </v-btn>
        </template>
        <v-card rounded="xl" elevation="8" class="overflow-hidden">
          <div class="px-4 py-3 border-b">
            <span class="text-subtitle-2 font-weight-bold">Help & Resources</span>
          </div>
          <v-list density="compact" class="py-2">
            <v-list-item link prepend-icon="mdi-file-document-outline" append-icon="mdi-open-in-new" rounded="lg" class="mx-2 mb-1">
              <v-list-item-title class="text-body-2">Documentation</v-list-item-title>
            </v-list-item>
            <v-list-item link prepend-icon="mdi-school-outline" append-icon="mdi-open-in-new" rounded="lg" class="mx-2 mb-1">
              <v-list-item-title class="text-body-2">Learning Center</v-list-item-title>
            </v-list-item>
            <v-list-item link prepend-icon="mdi-forum-outline" append-icon="mdi-open-in-new" rounded="lg" class="mx-2 mb-1">
              <v-list-item-title class="text-body-2">Community Forums</v-list-item-title>
            </v-list-item>
            <v-list-item link prepend-icon="mdi-alert-circle-outline" rounded="lg" class="mx-2">
              <v-list-item-title class="text-body-2">Contact Support</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <!-- Settings -->
      <v-menu max-width="520" :close-on-content-click="false" offset="10" scroll-strategy="none" location="bottom center">
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" class="text-medium-emphasis" v-bind="props">
            <v-icon size="20">mdi-cog-outline</v-icon>
          </v-btn>
        </template>
        <v-card rounded="xl" elevation="8" class="overflow-hidden">
          <div class="px-4 py-3 border-b d-flex align-center justify-space-between">
            <span class="text-subtitle-2 font-weight-bold">Settings</span>
          </div>
          <v-list lines="two" density="compact" class="py-2">
            <v-list-item link prepend-icon="mdi-account-outline" rounded="lg" class="mx-2 mb-1">
              <v-list-item-title class="text-body-2 font-weight-medium">General settings</v-list-item-title>
              <v-list-item-subtitle class="text-caption">Language, timezone, preferences</v-list-item-subtitle>
            </v-list-item>
            <v-list-item link prepend-icon="mdi-bell-outline" rounded="lg" class="mx-2 mb-1">
              <v-list-item-title class="text-body-2 font-weight-medium">Notifications</v-list-item-title>
              <v-list-item-subtitle class="text-caption">Email and in-app notifications</v-list-item-subtitle>
            </v-list-item>
            <v-list-subheader class="text-caption font-weight-bold text-uppercase px-4 mt-2">Admin</v-list-subheader>
            <v-list-item link prepend-icon="mdi-monitor" rounded="lg" class="mx-2 mb-1">
              <v-list-item-title class="text-body-2 font-weight-medium">System</v-list-item-title>
              <v-list-item-subtitle class="text-caption">Security, automation, UI config</v-list-item-subtitle>
            </v-list-item>
            <v-list-item link prepend-icon="mdi-account-group-outline" append-icon="mdi-open-in-new" rounded="lg" class="mx-2">
              <v-list-item-title class="text-body-2 font-weight-medium">User management</v-list-item-title>
              <v-list-item-subtitle class="text-caption">Users, groups, access requests</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>

      <!-- User Avatar -->
      <v-menu min-width="240" location="bottom end">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" size="small" variant="text" class="ml-1">
            <v-avatar size="30" color="primary" class="user-avatar">
              <v-img :src="store.currentUser.avatar"></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-card class="pa-2 mt-1" rounded="xl" elevation="8">
          <div class="d-flex align-center pa-3 mb-1">
            <v-avatar size="40" color="primary" class="mr-3">
              <span class="text-body-2 text-white font-weight-bold">LM</span>
            </v-avatar>
            <div>
              <div class="text-body-2 font-weight-bold">Lasa Marndi</div>
              <div class="text-caption text-medium-emphasis">lasamarndi@example.com</div>
            </div>
          </div>
          <v-divider class="mb-1"></v-divider>
          <v-list density="compact" nav class="pa-0">
            <v-list-item prepend-icon="mdi-account-outline" title="Profile" rounded="lg" class="mb-0.5"></v-list-item>
            <v-list-item prepend-icon="mdi-cog-outline" title="Account settings" rounded="lg" class="mb-0.5"></v-list-item>
            <v-menu location="start" offset="10" :close-on-content-click="true">
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props" prepend-icon="mdi-theme-light-dark" title="Theme"
                  append-icon="mdi-chevron-right" rounded="lg" class="mb-0.5"></v-list-item>
              </template>
              <v-card min-width="180" class="pa-2" elevation="8" rounded="xl">
                <v-list density="compact" nav class="pa-0">
                  <v-list-item rounded="lg" @click="selectTheme('light')" :active="userTheme === 'light'" color="primary" class="mb-0.5">
                    <template v-slot:prepend><v-icon size="18" class="mr-2">mdi-white-balance-sunny</v-icon></template>
                    <v-list-item-title class="text-body-2">Light</v-list-item-title>
                  </v-list-item>
                  <v-list-item rounded="lg" @click="selectTheme('dark')" :active="userTheme === 'dark'" color="primary" class="mb-0.5">
                    <template v-slot:prepend><v-icon size="18" class="mr-2">mdi-moon-waning-crescent</v-icon></template>
                    <v-list-item-title class="text-body-2">Dark</v-list-item-title>
                  </v-list-item>
                  <v-list-item rounded="lg" @click="selectTheme('system')" :active="userTheme === 'system'" color="primary">
                    <template v-slot:prepend><v-icon size="18" class="mr-2">mdi-monitor</v-icon></template>
                    <v-list-item-title class="text-body-2">System</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-list>
          <v-divider class="my-1"></v-divider>
          <v-list density="compact" nav class="pa-0">
            <v-list-item prepend-icon="mdi-logout-variant" title="Log out" rounded="lg" @click="logout"
              class="text-error"></v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useTaskStore } from '@/stores/taskStore'
import { useUiStore } from '@/stores/uiStore'

const route = useRoute()
const store = useTaskStore()
const uiStore = useUiStore()
const theme = useTheme()
const router = useRouter()

const searchFocused = ref(false)

const title = computed(() => {
  if (route.path.includes('roadmap')) return 'Roadmap'
  if (route.path.includes('backlog')) return 'Backlog'
  if (route.path.includes('board')) return 'Board'
  if (route.path.includes('list')) return 'Issues'
  if (route.path.includes('dashboard')) return 'Dashboard'
  if (route.path.includes('inbox')) return 'Inbox'
  if (route.path.includes('decisions')) return 'Decisions'
  if (route.path.includes('reports')) return 'Reports'
  return 'Project'
})

const userTheme = ref(localStorage.getItem('user-theme') || 'light')
const systemTheme = ref(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

const updateTheme = () => {
  const newTheme = userTheme.value === 'system'
    ? (systemTheme.value === 'dark' ? 'dark' : 'light')
    : (userTheme.value === 'dark' ? 'dark' : 'light')
  theme.change(newTheme)
  localStorage.setItem('user-theme', userTheme.value)
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  systemTheme.value = event.matches ? 'dark' : 'light'
  if (userTheme.value === 'system') updateTheme()
})

onMounted(() => { updateTheme() })

const logout = () => {
  localStorage.removeItem('user-theme')
  userTheme.value = 'light'
  updateTheme()
  router.push('/')
}

const selectTheme = (mode: string) => {
  userTheme.value = mode
  updateTheme()
}
</script>

<style scoped>
.topbar {
  background-color: rgb(var(--v-theme-surface)) !important;
}

.search-field :deep(.v-field) {
  border-radius: 10px !important;
}

.search-kbd {
  font-size: 10px;
  color: rgb(var(--v-theme-on-surface-variant));
  background: rgb(var(--v-theme-surface-variant));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  padding: 1px 5px;
  font-family: inherit;
  white-space: nowrap;
}

.notif-empty-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(var(--v-theme-primary), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar {
  background: linear-gradient(135deg, #4F46E5, #7C3AED) !important;
}

.gap-2 { gap: 8px; }
</style>
