<template>
  <div class="task-layout">

    <!-- Header -->
    <div class="tl-header">
      <div class="tl-header-left">
        <div class="tl-avatar">LM</div>
        <div>
          <h1 class="tl-title">My Tasks <v-icon size="15" style="color:#94a3b8">mdi-chevron-down</v-icon></h1>
          <p class="tl-sub">Personal workspace · 11 tasks</p>
        </div>
      </div>
      <div class="tl-header-right">
        <button class="tl-btn"><v-icon size="13">mdi-lock-outline</v-icon> Share</button>
        <button class="tl-btn tl-btn--primary"><v-icon size="13">mdi-plus</v-icon> Add Task</button>
      </div>
    </div>

    <!-- Tabs + toolbar -->
    <div class="tl-tabs-bar">
      <div class="tl-tabs">
        <button v-for="tab in tabs" :key="tab.value"
          class="tl-tab" :class="{ active: activeTab === tab.value }"
          @click="$router.push(tab.path)">
          <v-icon size="13">{{ tab.icon }}</v-icon>{{ tab.label }}
        </button>
      </div>
      <div v-if="showToolbar" class="tl-toolbar">
        <button class="tool-btn"><v-icon size="12">mdi-filter-variant</v-icon> Filter</button>
        <button class="tool-btn"><v-icon size="12">mdi-swap-vertical</v-icon> Sort</button>
        <button class="tool-btn"><v-icon size="12">mdi-group</v-icon> Group</button>
        <div class="tool-sep"></div>
        <button class="tool-icon-btn"><v-icon size="14">mdi-magnify</v-icon></button>
        <button class="tool-icon-btn"><v-icon size="14">mdi-tune-vertical</v-icon></button>
      </div>
    </div>

    <!-- Routed content -->
    <div class="tl-body">
      <router-view />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { value: 'list',      label: 'List',      icon: 'mdi-format-list-bulleted',  path: '/tasks/list'      },
  { value: 'board',     label: 'Board',     icon: 'mdi-view-column-outline',   path: '/tasks/board'     },
  { value: 'calendar',  label: 'Calendar',  icon: 'mdi-calendar-blank-outline',path: '/tasks/calendar'  },
  { value: 'dashboard', label: 'Dashboard', icon: 'mdi-view-dashboard-outline',path: '/tasks/dashboard' },
  { value: 'files',     label: 'Files',     icon: 'mdi-paperclip',             path: '/tasks/files'     },
]

const activeTab = computed(() => {
  const seg = route.path.split('/').pop()
  return tabs.find(t => t.value === seg)?.value ?? 'list'
})

const showToolbar = computed(() => ['list', 'board'].includes(activeTab.value))
</script>

<style scoped>
.task-layout {
  display: flex; flex-direction: column; height: 100%; min-height: 0;
  font-family: 'Inter', sans-serif; font-size: 13px;
  color: #1e293b; background: #f8fafc; overflow: hidden;
}

/* Header */
.tl-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 24px 12px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
}
.tl-header-left { display: flex; align-items: center; gap: 12px; }
.tl-avatar {
  width: 36px; height: 36px; border-radius: 10px;
  background: linear-gradient(135deg, #f97316, #fb923c);
  color: #fff; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.tl-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0; display: flex; align-items: center; gap: 2px; }
.tl-sub { font-size: 11.5px; color: #94a3b8; margin: 2px 0 0; }
.tl-header-right { display: flex; gap: 8px; }
.tl-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px;
  border-radius: 8px; border: 1px solid #e2e8f0; background: #fff;
  font-size: 12.5px; font-weight: 500; color: #475569;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s, border-color .12s;
}
.tl-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
.tl-btn--primary { background: #4f46e5; border-color: #4f46e5; color: #fff; box-shadow: 0 2px 8px rgba(79,70,229,.25); }
.tl-btn--primary:hover { background: #4338ca; border-color: #4338ca; }

/* Tabs bar */
.tl-tabs-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
}
.tl-tabs { display: flex; }
.tl-tab {
  display: inline-flex; align-items: center; gap: 6px; padding: 11px 14px;
  border: none; background: none; font-size: 12.5px; font-weight: 500; color: #64748b;
  cursor: pointer; font-family: 'Inter', sans-serif;
  border-bottom: 2px solid transparent; transition: color .12s, border-color .12s; white-space: nowrap;
}
.tl-tab:hover { color: #0f172a; }
.tl-tab.active { color: #4f46e5; border-bottom-color: #4f46e5; font-weight: 600; }

/* Toolbar */
.tl-toolbar { display: flex; align-items: center; gap: 4px; }
.tool-btn {
  display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px;
  border-radius: 6px; border: none; background: none; font-size: 12px; color: #64748b;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s, color .12s;
}
.tool-btn:hover { background: #f1f5f9; color: #0f172a; }
.tool-sep { width: 1px; height: 16px; background: #e2e8f0; margin: 0 4px; }
.tool-icon-btn {
  width: 28px; height: 28px; border-radius: 6px; border: none; background: none;
  color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background .12s, color .12s;
}
.tool-icon-btn:hover { background: #f1f5f9; color: #4f46e5; }

/* Body */
.tl-body { flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column; }
</style>
