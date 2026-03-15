<template>
  <v-app-bar height="56" flat class="topbar">
    <div class="topbar-inner">

      <!-- Left -->
      <div class="topbar-left">
        <button class="icon-btn" @click="uiStore.toggleDrawer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <div class="page-title">{{ title }}</div>
      </div>

      <!-- Right -->
      <div class="topbar-right">

        <!-- Search — expands on focus without shifting other items -->
        <div class="search-container">
          <div class="search-wrap" :class="{ focused: searchFocused }">
            <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <input class="search-input" placeholder="Search..." @focus="searchFocused = true" @blur="searchFocused = false" autocomplete="off" />
            <span v-if="!searchFocused" class="search-kbd">⌘K</span>
          </div>
        </div>

        <!-- Notifications -->
        <v-menu width="380" max-height="520" :close-on-content-click="false" offset="8" location="bottom end">
          <template #activator="{ props }">
            <button class="icon-btn notif-btn" v-bind="props">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
              <span class="notif-dot">3</span>
            </button>
          </template>
          <v-card class="styled-card" rounded="xl" elevation="0">
            <div class="pop-header">
              <span class="pop-title">Notifications</span>
              <button class="icon-btn-sm"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/></svg></button>
            </div>
            <div class="pop-tabs">
              <button class="pop-tab active">Direct</button>
              <button class="pop-tab">Watching</button>
            </div>
            <div class="pop-empty">
              <div class="empty-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#4f46e5" stroke-width="2" stroke-linecap="round"/><polyline points="22 4 12 14.01 9 11.01" stroke="#4f46e5" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              <div class="empty-title">All caught up</div>
              <div class="empty-sub">No unread notifications from the last 30 days.</div>
            </div>
          </v-card>
        </v-menu>

        <!-- Help -->
        <v-menu width="300" :close-on-content-click="false" offset="8" location="bottom end">
          <template #activator="{ props }">
            <button class="icon-btn" v-bind="props">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </template>
          <v-card class="styled-card" rounded="xl" elevation="0">
            <div class="pop-header"><span class="pop-title">Help & Resources</span></div>
            <div class="menu-list">
              <a class="menu-item" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>Documentation<svg class="ml-auto" width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="15 3 21 3 21 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></a>
              <a class="menu-item" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>Learning Center<svg class="ml-auto" width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="15 3 21 3 21 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></a>
              <a class="menu-item" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Community Forums</a>
              <a class="menu-item" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>Contact Support</a>
            </div>
          </v-card>
        </v-menu>

        <!-- Settings -->
        <v-menu width="340" :close-on-content-click="false" offset="8" location="bottom end">
          <template #activator="{ props }">
            <button class="icon-btn" v-bind="props">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.8"/></svg>
            </button>
          </template>
          <v-card class="styled-card" rounded="xl" elevation="0">
            <div class="pop-header"><span class="pop-title">Settings</span></div>
            <div class="menu-list">
              <a class="menu-item two-line" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/></svg><div><div class="mi-title">General settings</div><div class="mi-sub">Language, timezone, preferences</div></div></a>
              <a class="menu-item two-line" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><div><div class="mi-title">Notifications</div><div class="mi-sub">Email and in-app notifications</div></div></a>
              <div class="menu-section-label">Admin</div>
              <a class="menu-item two-line" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><div><div class="mi-title">System</div><div class="mi-sub">Security, automation, UI config</div></div></a>
              <a class="menu-item two-line" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><div><div class="mi-title">User management</div><div class="mi-sub">Users, groups, access requests</div></div></a>
            </div>
          </v-card>
        </v-menu>

        <div class="topbar-sep"></div>

        <!-- User -->
        <v-menu min-width="240" offset="8" location="bottom end">
          <template #activator="{ props }">
            <button class="user-btn" v-bind="props">
              <img v-if="store.currentUser.avatar" :src="store.currentUser.avatar" class="user-avatar" />
              <div v-else class="user-avatar-fallback">{{ store.currentUser.name.charAt(0) }}</div>
              <div class="user-info">
                <div class="user-name">{{ store.currentUser.name }}</div>
                <div class="user-role">Admin</div>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style="color:#94a3b8;flex-shrink:0"><polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </template>
          <v-card class="styled-card" rounded="xl" elevation="0">
            <div class="user-pop-header">
              <img v-if="store.currentUser.avatar" :src="store.currentUser.avatar" class="user-pop-avatar" />
              <div v-else class="user-pop-avatar-fallback">{{ store.currentUser.name.charAt(0) }}</div>
              <div>
                <div class="user-pop-name">{{ store.currentUser.name }}</div>
                <div class="user-pop-email">lasamarndi@example.com</div>
              </div>
            </div>
            <div class="pop-divider"></div>
            <div class="menu-list">
              <a class="menu-item" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/></svg>Profile</a>
              <a class="menu-item" href="#"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="1.8"/></svg>Account settings</a>
              <v-menu location="start" offset="8" :close-on-content-click="false">
                <template #activator="{ props }">
                  <div class="menu-item" v-bind="props">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.8"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                    Theme
                    <svg class="ml-auto" width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="15 18 9 12 15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                </template>
                <v-card class="styled-card" min-width="160" rounded="xl" elevation="0">
                  <div class="menu-list">
                    <div v-for="t in themes" :key="t.value"
                      class="menu-item" :class="{ 'menu-item-active': userTheme === t.value }"
                      @click="selectTheme(t.value)">
                      <span v-html="t.svg"></span>{{ t.label }}
                      <svg v-if="userTheme === t.value" class="ml-auto" width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                  </div>
                </v-card>
              </v-menu>
            </div>
            <div class="pop-divider"></div>
            <div class="menu-list">
              <button class="menu-item danger" @click="logout">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                Log out
              </button>
            </div>
          </v-card>
        </v-menu>

      </div>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'
import { useTaskStore } from '@/stores/taskStore'
import { useUiStore } from '@/stores/uiStore'

const route   = useRoute()
const router  = useRouter()
const store   = useTaskStore()
const uiStore = useUiStore()
const theme   = useTheme()

const searchFocused = ref(false)

const title = computed(() => {
  if (route.path.includes('roadmap'))   return 'Roadmap'
  if (route.path.includes('backlog'))   return 'Backlog'
  if (route.path.includes('board'))     return 'Board'
  if (route.path.includes('list'))      return 'Issues'
  if (route.path.includes('dashboard')) return 'Dashboard'
  if (route.path.includes('inbox'))     return 'Inbox'
  if (route.path.includes('decisions')) return 'Decisions'
  if (route.path.includes('reports'))   return 'Reports'
  return 'Project'
})

const themes = [
  { value: 'light',  label: 'Light',  svg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.8"/><line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` },
  { value: 'dark',   label: 'Dark',   svg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>` },
  { value: 'system', label: 'System', svg: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>` },
]

const userTheme   = ref(localStorage.getItem('user-theme') || 'light')
const systemTheme = ref(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

const updateTheme = () => {
  const t = userTheme.value === 'system' ? systemTheme.value : userTheme.value
  theme.change(t === 'dark' ? 'dark' : 'light')
  localStorage.setItem('user-theme', userTheme.value)
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  systemTheme.value = e.matches ? 'dark' : 'light'
  if (userTheme.value === 'system') updateTheme()
})

onMounted(() => updateTheme())

const selectTheme = (mode: string) => { userTheme.value = mode; updateTheme() }
const logout = () => {
  localStorage.removeItem('user-theme')
  userTheme.value = 'light'
  updateTheme()
  router.push('/')
}
</script>

<style scoped>
.topbar { background: #fff !important; border-bottom: 1px solid #e2e8f0 !important; }
.topbar :deep(.v-toolbar__content) { padding: 0 !important; height: 100% !important; }

.topbar-inner {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; height: 100%; padding: 0 16px;
  font-family: 'Inter', sans-serif;
}

/* Left */
.topbar-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.page-title  { font-size: 14px; font-weight: 700; color: #0f172a; white-space: nowrap; }

/* Right — no flex-grow so search can't push things */
.topbar-right { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.topbar-sep   { width: 1px; height: 20px; background: #e2e8f0; margin: 0 6px; }

/* Search */
.search-container {
  position: relative;
  width: 200px; flex-shrink: 0;
}
.search-wrap {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 12px; border-radius: 9px;
  border: 1.5px solid #e2e8f0; background: #f8fafc;
  width: 300px;
  position: absolute; right: 0; top: 50%; transform: translateY(-50%);
  transition: width .25s cubic-bezier(.4,0,.2,1), border-color .15s, background .15s;
}
.search-wrap.focused {
  width: 620px;
  border-color: #4f46e5; background: #fff;
  box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
}
.search-icon { color: #94a3b8; flex-shrink: 0; }
.search-input {
  flex: 1; min-width: 0; border: none; background: transparent; outline: none;
  font-size: 13px; color: #374151; font-family: 'Inter', sans-serif;
}
.search-input::placeholder { color: #cbd5e1; }
.search-kbd {
  font-size: 10px; color: #94a3b8; background: #f1f5f9;
  border: 1px solid #e2e8f0; border-radius: 4px;
  padding: 1px 5px; white-space: nowrap; flex-shrink: 0;
}

/* Icon buttons */
.icon-btn {
  width: 34px; height: 34px; border-radius: 8px; border: none;
  background: transparent; cursor: pointer; color: #64748b;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, color .15s; position: relative; flex-shrink: 0;
}
.icon-btn:hover { background: #f1f5f9; color: #1e293b; }
.icon-btn-sm {
  width: 26px; height: 26px; border-radius: 6px; border: none;
  background: transparent; cursor: pointer; color: #64748b;
  display: flex; align-items: center; justify-content: center;
}
.icon-btn-sm:hover { background: #f1f5f9; }

/* Notif dot */
.notif-btn { position: relative; }
.notif-dot {
  position: absolute; top: 4px; right: 4px;
  min-width: 16px; height: 16px; border-radius: 20px;
  background: #ef4444; color: #fff; font-size: 9px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #fff; padding: 0 3px;
}

/* User button */
.user-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 5px 10px 5px 5px; border-radius: 10px; border: 1.5px solid #e2e8f0;
  background: #fff; cursor: pointer; transition: background .15s, border-color .15s;
  flex-shrink: 0;
}
.user-btn:hover { background: #f8fafc; border-color: #c7d2fe; }
.user-avatar { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; }
.user-avatar-fallback {
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.user-name { font-size: 12.5px; font-weight: 600; color: #0f172a; line-height: 1.2; }
.user-role { font-size: 10.5px; color: #94a3b8; }

/* Styled card */
.styled-card {
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10) !important;
  font-family: 'Inter', sans-serif; overflow: hidden;
}

/* Popover header */
.pop-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-bottom: 1px solid #f1f5f9;
}
.pop-title  { font-size: 13px; font-weight: 700; color: #0f172a; }
.pop-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

/* Notif tabs */
.pop-tabs { display: flex; padding: 8px 12px 0; gap: 4px; border-bottom: 1px solid #f1f5f9; }
.pop-tab {
  padding: 6px 12px; border: none; background: transparent;
  font-size: 12.5px; font-weight: 500; color: #64748b;
  cursor: pointer; font-family: 'Inter', sans-serif;
  border-bottom: 2px solid transparent; margin-bottom: -1px; transition: color .15s;
}
.pop-tab.active { color: #4f46e5; border-bottom-color: #4f46e5; font-weight: 600; }

/* Empty state */
.pop-empty {
  display: flex; flex-direction: column; align-items: center;
  padding: 32px 16px; gap: 8px; text-align: center;
}
.empty-icon-wrap {
  width: 48px; height: 48px; border-radius: 50%;
  background: #ede9fe; display: flex; align-items: center; justify-content: center;
}
.empty-title { font-size: 13px; font-weight: 700; color: #0f172a; }
.empty-sub   { font-size: 12px; color: #94a3b8; }

/* Menu list */
.menu-list { padding: 6px; }
.menu-item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 8px;
  font-size: 13px; color: #374151; text-decoration: none;
  cursor: pointer; transition: background .12s;
  border: none; background: transparent; width: 100%;
  font-family: 'Inter', sans-serif; text-align: left;
}
.menu-item:hover { background: #f8fafc; }
.menu-item.danger { color: #ef4444; }
.menu-item.danger:hover { background: #fef2f2; }
.menu-item.two-line { align-items: flex-start; }
.menu-item-active { background: #f5f3ff !important; color: #4f46e5 !important; }
.mi-title { font-size: 13px; font-weight: 500; color: #374151; }
.mi-sub   { font-size: 11.5px; color: #94a3b8; margin-top: 1px; }
.menu-section-label {
  font-size: 10.5px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .07em; padding: 8px 10px 4px;
}
.ml-auto { margin-left: auto; }

/* User popover header */
.user-pop-header { display: flex; align-items: center; gap: 10px; padding: 14px 16px; }
.user-pop-avatar { width: 38px; height: 38px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.user-pop-avatar-fallback {
  width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #fff; font-size: 15px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.user-pop-name  { font-size: 13px; font-weight: 700; color: #0f172a; }
.user-pop-email { font-size: 11.5px; color: #94a3b8; margin-top: 1px; }
</style>
