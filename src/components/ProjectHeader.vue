<template>
  <div class="ph-wrap">
    <!-- Breadcrumb -->
    <div class="ph-bc">Spaces</div>

    <!-- Title + right actions -->
    <div class="ph-title-row">
      <div class="ph-title-left">
        <div class="ph-icon">
          <v-icon size="13" color="white">mdi-vector-square</v-icon>
        </div>
        <span class="ph-name">Cryptocurrency Payment Gateway</span>
        <button class="ph-icon-btn"><v-icon size="14">mdi-pencil-outline</v-icon></button>
        <button class="ph-icon-btn"><v-icon size="14">mdi-dots-horizontal</v-icon></button>
      </div>
      <div class="ph-title-right">
        <button class="ph-icon-btn"><v-icon size="15">mdi-share-variant-outline</v-icon></button>
        <button class="ph-icon-btn"><v-icon size="15">mdi-lightning-bolt-outline</v-icon></button>
        <button class="ph-icon-btn"><v-icon size="15">mdi-view-grid-outline</v-icon></button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="ph-tabs">
      <router-link
        v-for="tab in tabs" :key="tab.to" :to="tab.to"
        class="ph-tab" :class="{ 'ph-tab--active': activeTab === tab.value }">
        <v-icon size="13" class="mr-1">{{ tab.icon }}</v-icon>{{ tab.label }}
      </router-link>
      <button class="ph-tab ph-tab-add"><v-icon size="14">mdi-plus</v-icon></button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ activeTab?: string }>()
const tabs = [
  { value: 'overview', label: 'Overview',  icon: 'mdi-view-dashboard-outline',  to: '/overview' },
  { value: 'backlog',  label: 'Backlog',   icon: 'mdi-format-list-bulleted',     to: '/backlog' },
  { value: 'board',    label: 'Board',     icon: 'mdi-view-column-outline',      to: '/board' },
  { value: 'sprint',   label: 'Sprint',    icon: 'mdi-code-braces',              to: '/sprint' },
  { value: 'report',   label: 'Reports',   icon: 'mdi-chart-bar',                to: '/reports' },
  { value: 'timeline', label: 'Timeline',  icon: 'mdi-chart-timeline-variant',   to: '/timeline' },
  { value: 'decision', label: 'Decisions', icon: 'mdi-book-open-outline',        to: '/decisions' },
]
</script>

<style scoped>
.ph-wrap {
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  font-family: 'Inter', sans-serif;
  position: sticky;
  top: 0;
  z-index: 10;
}
.ph-bc {
  padding: 6px 16px 0;
  font-size: 11px;
  color: #94a3b8;
}
.ph-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 16px 6px;
}
.ph-title-left {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ph-icon {
  width: 22px; height: 22px;
  border-radius: 5px;
  background: #f97316;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ph-name {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}
.ph-icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px;
  border: none; background: none;
  color: #94a3b8; cursor: pointer;
  border-radius: 4px;
  transition: background .12s, color .12s;
}
.ph-icon-btn:hover { background: #f1f5f9; color: #475569; }
.ph-title-right {
  display: flex; align-items: center; gap: 2px;
}

/* Tabs */
.ph-tabs {
  display: flex;
  align-items: center;
  padding: 0 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.ph-tabs::-webkit-scrollbar { display: none; }
.ph-tab {
  display: flex; align-items: center;
  padding: 7px 11px;
  font-size: 12.5px; font-weight: 500;
  color: #64748b;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  flex-shrink: 0;
  transition: color .12s, border-color .12s;
  background: none; border-top: none; border-left: none; border-right: none;
  cursor: pointer; font-family: 'Inter', sans-serif;
}
.ph-tab:hover { color: #1e293b; }
.ph-tab--active { color: #4f46e5; border-bottom-color: #4f46e5; font-weight: 600; }
.ph-tab-add { color: #94a3b8; padding: 7px 8px; }
@media (max-width: 640px) {
  .ph-name { font-size: 12px; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .ph-title-right { display: none; }
}
</style>
