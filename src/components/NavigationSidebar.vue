<template>
  <v-navigation-drawer
    v-model="uiStore.drawer"
    :location="$vuetify.display.mobile ? 'bottom' : undefined"
    :temporary="$vuetify.display.mobile ? true : undefined"
    width="240"
    class="nav-sidebar"
  >
    <div class="sidebar-inner">

      <!-- Brand — logo unchanged -->
      <div class="brand">
        <div class="brand-logo">
          <v-icon icon="mdi-rocket-launch" color="white" size="18" />
        </div>
        <div>
          <div class="brand-name">Execora</div>
          <div class="brand-tag">Workspace</div>
        </div>
      </div>

      <div class="s-divider"></div>

      <!-- Main nav -->
      <nav class="nav-section">
        <router-link
          v-for="item in items" :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="{ active: isActive(item.to) }"
        >
          <v-icon :icon="item.icon" size="16" class="nav-icon" />
          <span class="nav-label">{{ item.title }}</span>
          <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
        </router-link>
      </nav>

      <div class="s-divider"></div>

      <!-- Projects -->
      <div class="nav-section">
        <div class="section-heading">Projects</div>
        <router-link
          v-for="proj in projects" :key="proj.name"
          :to="proj.to"
          class="nav-item"
          :class="{ active: isActive(proj.to) }"
        >
          <v-sheet :color="proj.color" width="16" height="16" rounded="sm"
            class="proj-sheet d-flex align-center justify-center flex-shrink-0">
            <v-icon size="10" color="white">{{ proj.icon }}</v-icon>
          </v-sheet>
          <span class="nav-label">{{ proj.name }}</span>
        </router-link>
      </div>

      <div class="sidebar-spacer"></div>

      <!-- Bottom -->
      <div class="sidebar-bottom">
        <div class="s-divider" style="margin-bottom:12px"></div>
        <button class="new-item-btn">
          <v-icon icon="mdi-plus" size="15" />
          New Item
        </button>
      </div>

    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()
const route   = useRoute()

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

const items = ref([
  { title: 'Dashboard', icon: 'mdi-view-dashboard-outline',        to: '/dashboard' },
  { title: 'Inbox',     icon: 'mdi-inbox-outline',                 to: '/inbox', badge: 3 },
  { title: 'My Tasks',  icon: 'mdi-checkbox-marked-outline',       to: '/tasks' },
  { title: 'Projects',  icon: 'mdi-folder-outline',                to: '/projects' },
  { title: 'Decisions', icon: 'mdi-checkbox-multiple-marked-outline', to: '/decisions' },
  { title: 'Reports',   icon: 'mdi-chart-line',                    to: '/reports' },
  { title: 'Roadmap',   icon: 'mdi-timeline-text-outline',         to: '/roadmap' },
])

const projects = ref([
  { name: 'My EKYC',        icon: 'mdi-shield-check', color: 'indigo',          to: '/board'   },
  { name: 'Crypto Gateway', icon: 'mdi-bitcoin',      color: 'orange-darken-2', to: '/backlog' },
])
</script>

<style scoped>
.nav-sidebar {
  border-right: 1px solid #e2e8f0 !important;
  background: #fff !important;
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Inter', sans-serif;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px 14px;
}
.brand-logo {
  width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  display: flex; align-items: center; justify-content: center;
}
.brand-name { font-size: 14px; font-weight: 800; color: #0f172a; letter-spacing: -.3px; line-height: 1.2; }
.brand-tag  { font-size: 10.5px; color: #94a3b8; margin-top: 1px; }

/* Divider */
.s-divider { height: 1px; background: #f1f5f9; margin: 0 12px; }

/* Nav section */
.nav-section { padding: 8px; }
.section-heading {
  font-size: 10.5px; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .07em;
  padding: 6px 8px 4px;
}

/* Nav item */
.nav-item {
  display: flex; align-items: center; gap: 9px;
  padding: 7px 10px; border-radius: 8px;
  font-size: 14.5px; font-weight: 500; color: #475569;
  text-decoration: none; cursor: pointer;
  transition: background .12s, color .12s;
  margin-bottom: 1px;
}
.nav-item:hover { background: #f8fafc; color: #1e293b; }
.nav-item.active { background: #ede9fe; color: #4f46e5; font-weight: 600; }

.nav-icon { color: #94a3b8; flex-shrink: 0; transition: color .12s; }
.nav-item:hover .nav-icon { color: #475569; }
.nav-item.active .nav-icon { color: #4f46e5 !important; }

.nav-label { flex: 1; }

.nav-badge {
  font-size: 10.5px; font-weight: 700;
  background: #4f46e5; color: #fff;
  padding: 1px 6px; border-radius: 20px; min-width: 18px; text-align: center;
}

/* Project sheet */
.proj-sheet { flex-shrink: 0; }

/* Spacer */
.sidebar-spacer { flex: 1; }

/* Bottom */
.sidebar-bottom { padding: 0 8px 14px; }
.new-item-btn {
  display: flex; align-items: center; justify-content: center; gap: 7px;
  width: 100%; padding: 9px; border-radius: 9px;
  border: 1.5px dashed #c7d2fe; background: #f5f3ff;
  font-size: 13px; font-weight: 600; color: #4f46e5;
  font-family: 'Inter', sans-serif; cursor: pointer;
  transition: background .15s, border-color .15s;
}
.new-item-btn:hover { background: #ede9fe; border-color: #a5b4fc; }
</style>
