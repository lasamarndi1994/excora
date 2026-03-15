<template>
  <div class="proj-root">

    <!-- Header -->
    <div class="proj-header">
      <div>
        <h1 class="proj-title">Projects</h1>
        <p class="proj-sub">Manage and track all your team's work</p>
      </div>
      <div class="proj-header-right">
        <button class="hdr-btn"><v-icon size="13">mdi-filter-variant</v-icon> Filter</button>
        <button class="hdr-btn hdr-btn--primary" @click="$router.push('/project/spaces')">
          <v-icon size="13">mdi-plus</v-icon> New Project
        </button>
      </div>
    </div>

    <div class="proj-body">

      <!-- Recent Spaces -->
      <div class="section">
        <div class="section-head">
          <span class="section-title">Recent spaces</span>
          <button class="view-all-btn" @click="$router.push('/project/spaces')">
            View all <v-icon size="13">mdi-arrow-right</v-icon>
          </button>
        </div>

        <div class="spaces-grid">
          <div v-for="(space, i) in spaces" :key="space.key"
            class="space-card"
            :style="{ animationDelay: i * 50 + 'ms' }"
            @click="$router.push('/board')">
            <div class="sc-accent" :style="{ background: space.accentColor }"></div>
            <div class="sc-body">
              <div class="sc-top">
                <div class="sc-icon" :style="{ background: space.iconBg }">
                  <v-icon size="18" :color="space.iconColor">{{ space.icon }}</v-icon>
                </div>
                <div class="sc-info">
                  <div class="sc-name">{{ space.name }}</div>
                  <div class="sc-type">{{ space.type }}</div>
                </div>
                <button class="sc-star" :class="{ starred: space.starred }" @click.stop="space.starred = !space.starred">
                  <v-icon size="14">{{ space.starred ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
                </button>
              </div>

              <div class="sc-links">
                <div class="sc-link-row">
                  <span>My open work items</span>
                  <span class="sc-badge">0</span>
                </div>
                <div class="sc-link-row">
                  <span>Done work items</span>
                  <span class="sc-badge sc-badge--green">{{ space.done }}</span>
                </div>
              </div>
            </div>
            <div class="sc-footer">
              <div class="sc-lead">
                <div class="sc-lead-av" :style="{ background: space.leadBg }">{{ space.leadInitials }}</div>
                <span>{{ space.leadName }}</span>
              </div>
              <span class="sc-board-tag">1 board</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity tabs -->
      <div class="section">
        <div class="activity-tabs">
          <button v-for="tab in activityTabs" :key="tab.value"
            class="act-tab" :class="{ active: activeTab === tab.value }"
            @click="activeTab = tab.value">
            {{ tab.label }}
            <span v-if="tab.count !== undefined" class="act-tab-badge">{{ tab.count }}</span>
          </button>
        </div>

        <!-- Worked on -->
        <div v-if="activeTab === 'worked'" class="activity-feed">
          <div v-for="(item, i) in workedItems" :key="i" class="act-item" :style="{ animationDelay: i * 40 + 'ms' }">
            <div class="act-icon" :style="{ background: item.iconBg }">
              <v-icon size="14" :color="item.iconColor">{{ item.icon }}</v-icon>
            </div>
            <div class="act-body">
              <div class="act-text">
                <span class="act-user">{{ item.user }}</span>
                <span class="act-action"> {{ item.action }} </span>
                <span class="act-link">{{ item.target }}</span>
              </div>
              <div class="act-meta">{{ item.project }} · {{ item.time }}</div>
            </div>
            <span class="act-status-chip" :class="`chip-${item.statusType}`">{{ item.status }}</span>
          </div>
        </div>

        <!-- Viewed -->
        <div v-else-if="activeTab === 'viewed'" class="activity-feed">
          <div v-for="(item, i) in viewedItems" :key="i" class="act-item" :style="{ animationDelay: i * 40 + 'ms' }">
            <div class="act-icon" :style="{ background: item.iconBg }">
              <v-icon size="14" :color="item.iconColor">{{ item.icon }}</v-icon>
            </div>
            <div class="act-body">
              <div class="act-text"><span class="act-link">{{ item.target }}</span></div>
              <div class="act-meta">{{ item.project }} · {{ item.time }}</div>
            </div>
          </div>
        </div>

        <!-- Assigned to me -->
        <div v-else-if="activeTab === 'assigned'" class="empty-state">
          <div class="es-illustration">
            <div class="es-laptop">
              <div class="es-screen">
                <div class="es-sidebar"></div>
                <div class="es-content">
                  <div class="es-bar es-bar--light"></div>
                  <div class="es-bar es-bar--dark"></div>
                  <div class="es-bar es-bar--light" style="width:60%"></div>
                </div>
              </div>
              <div class="es-base"></div>
            </div>
            <div class="es-badge"><v-icon size="22" color="white">mdi-check-circle</v-icon></div>
            <div class="es-toast"></div>
          </div>
          <div class="es-title">Find all your open work items in one place</div>
          <div class="es-sub">You have no open work items assigned to you</div>
        </div>

        <!-- Starred -->
        <div v-else-if="activeTab === 'starred'" class="activity-feed">
          <div v-for="s in spaces.filter(sp => sp.starred)" :key="s.key" class="act-item">
            <div class="act-icon" :style="{ background: s.iconBg }">
              <v-icon size="14" :color="s.iconColor">{{ s.icon }}</v-icon>
            </div>
            <div class="act-body">
              <div class="act-text"><span class="act-link">{{ s.name }}</span></div>
              <div class="act-meta">{{ s.type }}</div>
            </div>
            <span class="sc-board-tag">Starred</span>
          </div>
          <div v-if="!spaces.some(s => s.starred)" class="empty-simple">
            <v-icon size="36" style="color:#cbd5e1">mdi-star-outline</v-icon>
            <div>No starred projects yet</div>
          </div>
        </div>

        <!-- Boards -->
        <div v-else class="empty-simple">
          <v-icon size="36" style="color:#cbd5e1">mdi-view-column-outline</v-icon>
          <div>No boards to display</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref('worked')

const activityTabs = [
  { value: 'worked',   label: 'Worked on' },
  { value: 'viewed',   label: 'Viewed' },
  { value: 'assigned', label: 'Assigned to me', count: 0 },
  { value: 'starred',  label: 'Starred' },
  { value: 'boards',   label: 'Boards' },
]

const spaces = ref([
  { name: 'Cryptocurrency Payment Gateway', key: 'CPG', type: 'Team-managed software', icon: 'mdi-poll',           iconBg: '#fef2f2', iconColor: '#ef4444', accentColor: '#ef4444', leadName: 'Satya B.', leadInitials: 'SB', leadBg: '#fed7aa', starred: true,  done: 4 },
  { name: 'Execora',                        key: 'EX',  type: 'Team-managed software', icon: 'mdi-wallet-bifold',  iconBg: '#eff6ff', iconColor: '#2563eb', accentColor: '#2563eb', leadName: 'Satya B.', leadInitials: 'SB', leadBg: '#fed7aa', starred: false, done: 12 },
  { name: 'Project Management',             key: 'PM',  type: 'Team-managed business', icon: 'mdi-rocket-launch',  iconBg: '#eef2ff', iconColor: '#4f46e5', accentColor: '#4f46e5', leadName: 'Lasa M.',  leadInitials: 'LM', leadBg: '#fce7f3', starred: false, done: 7 },
  { name: 'Kanban 1',                       key: 'K1',  type: 'Team-managed software', icon: 'mdi-cellphone-link', iconBg: '#eff6ff', iconColor: '#3b82f6', accentColor: '#3b82f6', leadName: 'Lasa M.',  leadInitials: 'LM', leadBg: '#fce7f3', starred: false, done: 2 },
  { name: 'Kanban',                         key: 'KAN', type: 'Team-managed software', icon: 'mdi-cellphone-link', iconBg: '#fffbeb', iconColor: '#d97706', accentColor: '#f59e0b', leadName: 'Lasa M.',  leadInitials: 'LM', leadBg: '#fce7f3', starred: false, done: 5 },
  { name: 'Marketing Asset Creation',       key: 'MAC', type: 'Team-managed business', icon: 'mdi-puzzle',         iconBg: '#ecfeff', iconColor: '#0891b2', accentColor: '#06b6d4', leadName: 'Lasa M.',  leadInitials: 'LM', leadBg: '#fce7f3', starred: false, done: 3 },
])

const workedItems = [
  { user: 'You', action: 'updated', target: 'EKYC NRI Flow KT', project: 'Execora (EX)', time: '2h ago', icon: 'mdi-pencil-outline', iconBg: '#eef2ff', iconColor: '#4f46e5', status: 'In Progress', statusType: 'info' },
  { user: 'You', action: 'closed', target: 'Partner library task updates', project: 'Execora (EX)', time: '5h ago', icon: 'mdi-check-circle-outline', iconBg: '#f0fdf4', iconColor: '#10b981', status: 'Done', statusType: 'success' },
  { user: 'You', action: 'commented on', target: 'Performance Dashboard Implementation', project: 'Analytics', time: 'Yesterday', icon: 'mdi-message-outline', iconBg: '#faf5ff', iconColor: '#a855f7', status: 'Review', statusType: 'warn' },
  { user: 'You', action: 'created', target: 'Sprint 25 planning board', project: 'Project Management', time: '2 days ago', icon: 'mdi-plus-circle-outline', iconBg: '#eff6ff', iconColor: '#2563eb', status: 'Todo', statusType: 'grey' },
]

const viewedItems = [
  { target: 'EKYC Code analysis for all segments', project: 'Execora (EX)', time: '1h ago', icon: 'mdi-eye-outline', iconBg: '#f8fafc', iconColor: '#64748b' },
  { target: 'Velocity Chart Q1 2025', project: 'Analytics', time: '3h ago', icon: 'mdi-eye-outline', iconBg: '#f8fafc', iconColor: '#64748b' },
  { target: 'Marketing campaign assets', project: 'Marketing Asset Creation', time: 'Yesterday', icon: 'mdi-eye-outline', iconBg: '#f8fafc', iconColor: '#64748b' },
]
</script>

<style scoped>
.proj-root {
  display: flex; flex-direction: column; height: 100%; overflow: hidden;
  font-family: 'Inter', sans-serif; font-size: 13px; color: #1e293b; background: #f8fafc;
}

/* Header */
.proj-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 26px 14px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
}
.proj-title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
.proj-sub { font-size: 12px; color: #94a3b8; margin: 0; }
.proj-header-right { display: flex; gap: 8px; }
.hdr-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px;
  border-radius: 8px; border: 1px solid #e2e8f0; background: #fff;
  font-size: 12.5px; font-weight: 500; color: #475569;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s, border-color .12s;
}
.hdr-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
.hdr-btn--primary { background: #4f46e5; border-color: #4f46e5; color: #fff; box-shadow: 0 2px 8px rgba(79,70,229,.25); }
.hdr-btn--primary:hover { background: #4338ca; border-color: #4338ca; }

/* Body */
.proj-body { flex: 1; overflow-y: auto; padding: 20px 26px; display: flex; flex-direction: column; gap: 24px; }

/* Section */
.section { display: flex; flex-direction: column; gap: 14px; }
.section-head { display: flex; align-items: center; justify-content: space-between; }
.section-title { font-size: 13.5px; font-weight: 700; color: #0f172a; }
.view-all-btn {
  display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 500;
  color: #4f46e5; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif;
  transition: color .12s;
}
.view-all-btn:hover { color: #4338ca; }

/* Spaces grid */
.spaces-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.space-card {
  background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;
  overflow: hidden; cursor: pointer; display: flex; flex-direction: column;
  animation: fadeUp .25s ease both;
  transition: border-color .15s, box-shadow .15s, transform .15s;
  position: relative;
}
.space-card:hover { border-color: #a5b4fc; box-shadow: 0 4px 16px rgba(79,70,229,.08); transform: translateY(-2px); }
.sc-accent { height: 3px; width: 100%; flex-shrink: 0; }
.sc-body { padding: 14px 14px 10px; flex: 1; }
.sc-top { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
.sc-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.sc-info { flex: 1; min-width: 0; }
.sc-name { font-size: 13px; font-weight: 600; color: #0f172a; line-height: 1.3; margin-bottom: 2px; }
.sc-type { font-size: 11px; color: #94a3b8; }
.sc-star {
  display: flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border-radius: 6px; border: none; background: none;
  color: #cbd5e1; cursor: pointer; flex-shrink: 0; transition: color .15s;
}
.sc-star:hover, .sc-star.starred { color: #f59e0b; }
.sc-links { display: flex; flex-direction: column; gap: 6px; }
.sc-link-row { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #64748b; }
.sc-badge { font-size: 10.5px; font-weight: 600; background: #f1f5f9; color: #64748b; padding: 1px 7px; border-radius: 20px; }
.sc-badge--green { background: #f0fdf4; color: #16a34a; }
.sc-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 14px; border-top: 1px solid #f1f5f9; background: #f8fafc;
}
.sc-lead { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: #64748b; }
.sc-lead-av { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; color: #475569; flex-shrink: 0; }
.sc-board-tag { font-size: 11px; font-weight: 500; background: #eef2ff; color: #4f46e5; padding: 2px 8px; border-radius: 20px; }

/* Activity tabs */
.activity-tabs { display: flex; gap: 0; border-bottom: 1px solid #e2e8f0; }
.act-tab {
  display: inline-flex; align-items: center; gap: 6px; padding: 10px 14px;
  border: none; background: none; font-size: 12.5px; font-weight: 500; color: #64748b;
  cursor: pointer; font-family: 'Inter', sans-serif;
  border-bottom: 2px solid transparent; transition: color .12s, border-color .12s;
}
.act-tab:hover { color: #0f172a; }
.act-tab.active { color: #4f46e5; border-bottom-color: #4f46e5; font-weight: 600; }
.act-tab-badge { background: #e2e8f0; color: #64748b; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 20px; }

/* Activity feed */
.activity-feed { display: flex; flex-direction: column; gap: 2px; padding-top: 8px; }
.act-item {
  display: flex; align-items: center; gap: 12px; padding: 10px 12px;
  border-radius: 10px; cursor: pointer; animation: fadeUp .22s ease both;
  transition: background .1s;
}
.act-item:hover { background: #f8fafc; }
.act-icon { width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.act-body { flex: 1; min-width: 0; }
.act-text { font-size: 13px; color: #0f172a; margin-bottom: 2px; }
.act-user { font-weight: 600; }
.act-action { color: #64748b; }
.act-link { color: #4f46e5; font-weight: 500; }
.act-meta { font-size: 11px; color: #94a3b8; }
.act-status-chip { font-size: 11px; font-weight: 600; padding: 2px 9px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
.chip-info    { background: #eff6ff; color: #2563eb; }
.chip-success { background: #f0fdf4; color: #16a34a; }
.chip-warn    { background: #fffbeb; color: #d97706; }
.chip-grey    { background: #f1f5f9; color: #64748b; }

/* Empty state */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 40px 20px; gap: 12px; }
.es-illustration { position: relative; width: 220px; height: 140px; margin-bottom: 8px; }
.es-laptop { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); }
.es-screen {
  width: 160px; height: 96px; border-radius: 6px 6px 0 0;
  border: 3px solid #b0bec5; border-bottom: none;
  background: #f1f5f9; display: flex; overflow: hidden;
}
.es-sidebar { width: 22px; background: #3b4fd8; height: 100%; flex-shrink: 0; }
.es-content { flex: 1; padding: 10px 8px; display: flex; flex-direction: column; gap: 6px; background: #fff; }
.es-bar { height: 10px; border-radius: 4px; background: #e2e8f0; }
.es-bar--dark { background: #a5b4fc; }
.es-base { width: 200px; height: 10px; background: #78909c; border-radius: 0 0 6px 6px; }
.es-badge {
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #34d399);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(16,185,129,.3);
}
.es-toast {
  position: absolute; bottom: 28px; right: 10px;
  width: 44px; height: 14px; border-radius: 4px;
  background: #34d399; opacity: .7;
}
.es-title { font-size: 15px; font-weight: 700; color: #0f172a; text-align: center; }
.es-sub { font-size: 12.5px; color: #94a3b8; text-align: center; }

.empty-simple { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px 20px; color: #94a3b8; font-size: 13px; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
</style>
