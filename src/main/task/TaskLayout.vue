<template>
  <div class="task-layout">

    <!-- Header -->
    <div class="tl-header">
      <div class="tl-header-left">
        <div class="tl-avatar">LM</div>
        <div>
          <h1 class="tl-title">My Tasks</h1>
          <p class="tl-sub">Personal workspace · {{ totalTasks }} tasks</p>
        </div>
      </div>
      <div class="tl-header-right">
        <button class="tl-btn">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2"/></svg>
          Share
        </button>
        <button class="tl-btn tl-btn--primary" @click="$emit('add-task')">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          Add Task
        </button>
      </div>
    </div>

    <!-- Tabs + toolbar -->
    <div class="tl-tabs-bar">
      <div class="tl-tabs">
        <button v-for="tab in tabs" :key="tab.value"
          class="tl-tab" :class="{ active: activeTab === tab.value }"
          @click="$router.push(tab.path)">
          <span class="tab-icon" v-html="tab.svg"></span>{{ tab.label }}
        </button>
      </div>

      <div v-if="showToolbar" class="tl-toolbar" ref="toolbarRef">

        <!-- Filter -->
        <div class="tb-wrap" ref="filterWrapRef">
          <button class="tool-btn" :class="{ active: activeFilters.length > 0 }" @click.stop="togglePanel('filter')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Filter
            <span v-if="activeFilters.length" class="tb-badge">{{ activeFilters.length }}</span>
          </button>
          <div v-if="openPanel === 'filter'" class="tb-panel" @click.stop>
            <div class="tb-panel-title">Filter by</div>
            <label v-for="f in filterOptions" :key="f.value" class="tb-check-row" @click="toggleFilter(f.value)">
              <span class="tb-checkbox" :class="{ checked: activeFilters.includes(f.value) }">
                <svg v-if="activeFilters.includes(f.value)" width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              <span>{{ f.label }}</span>
            </label>
            <div class="tb-panel-divider"></div>
            <button class="tb-clear" @click="activeFilters = []">Clear filters</button>
          </div>
        </div>

        <!-- Sort -->
        <div class="tb-wrap" ref="sortWrapRef">
          <button class="tool-btn" :class="{ active: sortBy !== 'none' }" @click.stop="togglePanel('sort')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Sort
            <span v-if="sortBy !== 'none'" class="tb-badge-text">· {{ sortOptions.find(s=>s.value===sortBy)?.label }}</span>
          </button>
          <div v-if="openPanel === 'sort'" class="tb-panel" @click.stop>
            <div class="tb-panel-title">Sort by</div>
            <div v-for="s in sortOptions" :key="s.value" class="tb-radio-row" @click="sortBy = s.value">
              <span class="tb-radio" :class="{ checked: sortBy === s.value }"></span>
              {{ s.label }}
            </div>
          </div>
        </div>

        <!-- Group -->
        <div class="tb-wrap" ref="groupWrapRef">
          <button class="tool-btn" :class="{ active: groupBy !== 'none' }" @click.stop="togglePanel('group')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>
            Group
            <span v-if="groupBy !== 'none'" class="tb-badge-text">· {{ groupOptions.find(g=>g.value===groupBy)?.label }}</span>
          </button>
          <div v-if="openPanel === 'group'" class="tb-panel" @click.stop>
            <div class="tb-panel-title">Group by</div>
            <div v-for="g in groupOptions" :key="g.value" class="tb-radio-row" @click="groupBy = g.value">
              <span class="tb-radio" :class="{ checked: groupBy === g.value }"></span>
              {{ g.label }}
            </div>
          </div>
        </div>

        <div class="tool-sep"></div>

        <!-- Search -->
        <div class="tb-search-wrap">
          <transition name="search-expand">
            <div v-if="searchOpen" class="tb-search-box">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#94a3b8" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/></svg>
              <input class="tb-search-input" v-model="searchQuery" placeholder="Search tasks…" ref="searchInputRef" @keydown.esc="searchOpen = false; searchQuery = ''" autofocus />
              <button class="tb-search-clear" @click="searchOpen = false; searchQuery = ''">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
              </button>
            </div>
          </transition>
          <button v-if="!searchOpen" class="tool-icon-btn" @click="searchOpen = true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>

        <!-- Customize -->
        <div class="tb-wrap">
          <button class="tool-icon-btn" :class="{ active: openPanel === 'customize' }" @click.stop="togglePanel('customize')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="6" r="2" fill="currentColor"/><circle cx="16" cy="12" r="2" fill="currentColor"/><circle cx="8" cy="18" r="2" fill="currentColor"/></svg>
          </button>
          <div v-if="openPanel === 'customize'" class="tb-panel tb-panel-right" @click.stop>
            <div class="tb-panel-title">Customize board</div>
            <label class="tb-check-row" @click="showDone = !showDone">
              <span class="tb-checkbox" :class="{ checked: showDone }">
                <svg v-if="showDone" width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              Show completed tasks
            </label>
            <label class="tb-check-row" @click="showTags = !showTags">
              <span class="tb-checkbox" :class="{ checked: showTags }">
                <svg v-if="showTags" width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              Show tags
            </label>
            <label class="tb-check-row" @click="showDates = !showDates">
              <span class="tb-checkbox" :class="{ checked: showDates }">
                <svg v-if="showDates" width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              Show due dates
            </label>
            <label class="tb-check-row" @click="showAssignees = !showAssignees">
              <span class="tb-checkbox" :class="{ checked: showAssignees }">
                <svg v-if="showAssignees" width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>
              Show assignees
            </label>
          </div>
        </div>

      </div>
    </div>

    <!-- Active filter chips -->
    <div v-if="showToolbar && (activeFilters.length || searchQuery || sortBy !== 'none')" class="tl-chips">
      <span v-for="f in activeFilters" :key="f" class="tl-chip">
        {{ filterOptions.find(o=>o.value===f)?.label }}
        <button class="chip-x" @click="toggleFilter(f)">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
        </button>
      </span>
      <span v-if="searchQuery" class="tl-chip">
        "{{ searchQuery }}"
        <button class="chip-x" @click="searchQuery = ''">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
        </button>
      </span>
      <span v-if="sortBy !== 'none'" class="tl-chip tl-chip--sort">
        ↑ {{ sortOptions.find(s=>s.value===sortBy)?.label }}
        <button class="chip-x" @click="sortBy = 'none'">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>
        </button>
      </span>
    </div>

    <!-- Routed content -->
    <div class="tl-body">
      <router-view />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  activeFilters, sortBy, groupBy, searchQuery,
  showDone, showTags, showDates, showAssignees,
  filterOptions, sortOptions, groupOptions, toggleFilter,
} from '@/stores/boardToolbarStore'

defineEmits(['add-task'])

const route = useRoute()
const openPanel      = ref<string | null>(null)
const searchOpen     = ref(false)
const searchInputRef = ref<HTMLInputElement | null>(null)
const toolbarRef     = ref<HTMLElement | null>(null)

function togglePanel(name: string) {
  openPanel.value = openPanel.value === name ? null : name
}

function onDocMousedown(e: MouseEvent) {
  // close only if click is outside the entire toolbar area
  if (toolbarRef.value && !toolbarRef.value.contains(e.target as Node)) {
    openPanel.value = null
  }
}

onMounted(() => document.addEventListener('mousedown', onDocMousedown))
onUnmounted(() => document.removeEventListener('mousedown', onDocMousedown))

const tabs = [
  { value: 'list',      label: 'List',      path: '/tasks/list',      svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
  { value: 'board',     label: 'Board',     path: '/tasks/board',     svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="5" height="18" rx="1" stroke="currentColor" stroke-width="2"/><rect x="10" y="3" width="5" height="12" rx="1" stroke="currentColor" stroke-width="2"/><rect x="17" y="3" width="5" height="15" rx="1" stroke="currentColor" stroke-width="2"/></svg>' },
  { value: 'calendar',  label: 'Calendar',  path: '/tasks/calendar',  svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
  { value: 'dashboard', label: 'Dashboard', path: '/tasks/dashboard', svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>' },
  { value: 'files',     label: 'Files',     path: '/tasks/files',     svg: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
]

const activeTab = computed(() => {
  const seg = route.path.split('/').pop()
  return tabs.find(t => t.value === seg)?.value ?? 'list'
})

const showToolbar = computed(() => ['list', 'board'].includes(activeTab.value))

// injected from child via provide/inject or just a placeholder
const totalTasks = ref(11)
</script>

<style scoped>
.task-layout {
  display: flex; flex-direction: column; height: 100%; min-height: 0;
  font-family: 'Inter', sans-serif; font-size: 13px;
  color: #1e293b; background: #f8fafc; overflow: hidden; position: relative;
}

.tl-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 24px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
  gap: 12px; flex-wrap: wrap;
}
.tl-header-left { display: flex; align-items: center; gap: 12px; }
.tl-avatar {
  width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, #f97316, #fb923c);
  color: #fff; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.tl-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0; }
.tl-sub { font-size: 11.5px; color: #94a3b8; margin: 2px 0 0; }
.tl-header-right { display: flex; gap: 8px; }
.tl-btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px;
  border-radius: 8px; border: 1px solid #e2e8f0; background: #fff;
  font-size: 12.5px; font-weight: 500; color: #475569;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s, border-color .12s;
}
.tl-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
.tl-btn--primary { background: #4f46e5; border-color: #4f46e5; color: #fff; box-shadow: 0 2px 8px rgba(79,70,229,.25); }
.tl-btn--primary:hover { background: #4338ca; border-color: #4338ca; }

.tl-tabs-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
  flex-wrap: wrap; gap: 4px; position: relative; z-index: 100;
}
.tl-tabs { display: flex; overflow-x: auto; }
.tl-tab {
  display: inline-flex; align-items: center; gap: 6px; padding: 11px 12px;
  border: none; background: none; font-size: 12.5px; font-weight: 500; color: #64748b;
  cursor: pointer; font-family: 'Inter', sans-serif;
  border-bottom: 2px solid transparent; transition: color .12s, border-color .12s; white-space: nowrap;
}
.tl-tab:hover { color: #0f172a; }
.tl-tab.active { color: #4f46e5; border-bottom-color: #4f46e5; font-weight: 600; }
.tab-icon { display: flex; align-items: center; }

.tl-toolbar { display: flex; align-items: center; gap: 2px; padding: 4px 0; flex-wrap: wrap; }

.tb-wrap { position: relative; }
.tool-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px;
  border-radius: 6px; border: none; background: none; font-size: 12px; color: #64748b;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s, color .12s;
  white-space: nowrap;
}
.tool-btn:hover, .tool-btn.active { background: #f1f5f9; color: #4f46e5; }
.tool-icon-btn {
  width: 28px; height: 28px; border-radius: 6px; border: none; background: none;
  color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background .12s, color .12s;
}
.tool-icon-btn:hover, .tool-icon-btn.active { background: #f1f5f9; color: #4f46e5; }
.tool-sep { width: 1px; height: 16px; background: #e2e8f0; margin: 0 4px; align-self: center; }

.tb-badge { background: #4f46e5; color: #fff; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 20px; margin-left: 2px; }
.tb-badge-text { font-size: 10.5px; color: #4f46e5; font-weight: 600; }

.tb-panel {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 400;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.12); min-width: 200px; padding: 6px;
}
.tb-panel-right { left: auto; right: 0; }
.tb-panel-title { font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; padding: 4px 8px 6px; }
.tb-panel-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }
.tb-check-row {
  display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 7px;
  cursor: pointer; font-size: 12.5px; color: #374151; transition: background .1s; user-select: none;
}
.tb-check-row:hover { background: #f8fafc; }
.tb-checkbox {
  width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid #cbd5e1;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .12s;
}
.tb-checkbox.checked { background: #4f46e5; border-color: #4f46e5; color: #fff; }
.tb-radio-row {
  display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 7px;
  cursor: pointer; font-size: 12.5px; color: #374151; transition: background .1s;
}
.tb-radio-row:hover { background: #f8fafc; }
.tb-radio { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid #cbd5e1; flex-shrink: 0; transition: all .12s; }
.tb-radio.checked { border-color: #4f46e5; border-width: 4px; }
.tb-clear { width: 100%; padding: 5px 8px; border: none; background: none; font-size: 12px; color: #ef4444; cursor: pointer; text-align: left; border-radius: 6px; font-family: 'Inter', sans-serif; }
.tb-clear:hover { background: #fef2f2; }

.tb-search-wrap { display: flex; align-items: center; }
.tb-search-box {
  display: flex; align-items: center; gap: 6px; background: #f8fafc;
  border: 1px solid #e2e8f0; border-radius: 7px; padding: 4px 8px; min-width: 180px;
}
.tb-search-input { border: none; outline: none; background: none; font-size: 12.5px; color: #0f172a; font-family: 'Inter', sans-serif; flex: 1; width: 130px; }
.tb-search-clear { display: flex; align-items: center; border: none; background: none; color: #94a3b8; cursor: pointer; padding: 0; }
.tb-search-clear:hover { color: #ef4444; }

.search-expand-enter-active, .search-expand-leave-active { transition: all .18s ease; }
.search-expand-enter-from, .search-expand-leave-to { opacity: 0; max-width: 0; }

.tl-chips {
  display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  padding: 6px 20px; background: #fff; border-bottom: 1px solid #f1f5f9; flex-shrink: 0;
}
.tl-chip {
  display: inline-flex; align-items: center; gap: 5px; padding: 3px 8px 3px 10px;
  border-radius: 20px; background: #eef2ff; color: #4f46e5;
  border: 1px solid #c7d2fe; font-size: 11.5px; font-weight: 500;
}
.tl-chip--sort { background: #f0fdf4; color: #16a34a; border-color: #86efac; }
.chip-x { display: flex; align-items: center; border: none; background: none; color: inherit; cursor: pointer; padding: 0; opacity: .7; }
.chip-x:hover { opacity: 1; }

.tl-body { flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column; }
.tl-body > * { flex: 1; min-height: 0; }
</style>
