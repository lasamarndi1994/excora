<template>
  <div class="inbox-root">

    <!-- ── Sidebar ── -->
    <aside class="inbox-sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-title">Inbox</h1>
        <button class="sidebar-settings-btn" title="Manage notifications">
          <v-icon size="16">mdi-cog-outline</v-icon>
        </button>
      </div>

      <!-- Search -->
      <div class="sidebar-search-wrap">
        <v-icon size="15" class="search-icon">mdi-magnify</v-icon>
        <input v-model="search" class="sidebar-search" placeholder="Search notifications…" />
      </div>

      <!-- Nav tabs -->
      <nav class="sidebar-nav">
        <button v-for="tab in tabs" :key="tab.value"
          class="sidebar-nav-item"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value">
          <v-icon size="16" class="nav-icon">{{ tab.icon }}</v-icon>
          <span>{{ tab.label }}</span>
          <span v-if="tab.count" class="nav-badge">{{ tab.count }}</span>
        </button>
      </nav>

      <!-- Filters -->
      <div class="sidebar-section-label">Filters</div>
      <div class="sidebar-filters">
        <button v-for="f in filters" :key="f.value"
          class="filter-chip"
          :class="{ active: activeFilter === f.value }"
          @click="activeFilter = f.value">
          <span class="filter-dot" :style="{ background: f.color }"></span>
          {{ f.label }}
        </button>
      </div>

      <!-- Stats -->
      <div class="sidebar-stats">
        <div class="sidebar-stat">
          <div class="sidebar-stat-val">12</div>
          <div class="sidebar-stat-lbl">Unread</div>
        </div>
        <div class="sidebar-stat">
          <div class="sidebar-stat-val">3</div>
          <div class="sidebar-stat-lbl">Overdue</div>
        </div>
        <div class="sidebar-stat">
          <div class="sidebar-stat-val">5</div>
          <div class="sidebar-stat-lbl">Bookmarks</div>
        </div>
      </div>
    </aside>

    <!-- ── Main feed ── -->
    <main class="inbox-main">

      <!-- Toolbar -->
      <div class="inbox-toolbar">
        <div class="toolbar-left">
          <button class="toolbar-btn" :class="{ active: sortNewest }" @click="sortNewest = !sortNewest">
            <v-icon size="14">mdi-swap-vertical</v-icon>
            {{ sortNewest ? 'Newest first' : 'Oldest first' }}
          </button>
          <button class="toolbar-btn">
            <v-icon size="14">mdi-filter-variant</v-icon>Filter
          </button>
        </div>
        <div class="toolbar-right">
          <button class="toolbar-icon-btn" title="Mark all read">
            <v-icon size="16">mdi-check-all</v-icon>
          </button>
          <button class="toolbar-icon-btn" title="More options">
            <v-icon size="16">mdi-dots-horizontal</v-icon>
          </button>
        </div>
      </div>

      <!-- Activity tab -->
      <div v-if="activeTab === 'activity'" class="feed">

        <div v-for="group in filteredGroups" :key="group.label" class="feed-group">
          <div class="feed-group-label">{{ group.label }}</div>

          <div v-for="(item, i) in group.items" :key="item.id"
            class="inbox-card"
            :class="{ unread: item.unread, selected: selectedId === item.id }"
            :style="{ animationDelay: i * 60 + 'ms' }"
            @click="selectedId = item.id">

            <!-- Left: avatar + unread dot -->
            <div class="card-avatar-col">
              <div class="card-avatar-wrap">
                <img :src="item.avatar" :alt="item.author" class="card-avatar" />
                <span v-if="item.unread" class="unread-dot"></span>
              </div>
            </div>

            <!-- Center: content -->
            <div class="card-body">
              <div class="card-top-row">
                <div class="card-type-icon" :style="{ background: item.typeBg }">
                  <v-icon size="12" :color="item.typeColor">{{ item.typeIcon }}</v-icon>
                </div>
                <span class="card-project">{{ item.project }}</span>
                <span class="card-sep">·</span>
                <span class="card-time">{{ item.time }}</span>
                <div class="card-badges">
                  <span v-if="item.status" class="card-status-badge" :class="`status-${item.statusType}`">
                    {{ item.status }}
                  </span>
                  <span v-if="item.priority" class="card-priority" :class="`priority-${item.priority}`">
                    <v-icon size="10">mdi-flag</v-icon>{{ item.priority }}
                  </span>
                </div>
              </div>

              <div class="card-title">{{ item.title }}</div>

              <div class="card-preview">
                <span class="card-author">{{ item.author }}</span>
                <span class="card-msg">{{ item.preview }}</span>
              </div>

              <div v-if="item.tags?.length" class="card-tags">
                <span v-for="tag in item.tags" :key="tag" class="card-tag">{{ tag }}</span>
              </div>
            </div>

            <!-- Right: actions -->
            <div class="card-actions">
              <button class="card-action-btn" title="Mark done" @click.stop>
                <v-icon size="14">mdi-check-circle-outline</v-icon>
              </button>
              <button class="card-action-btn" title="Bookmark" @click.stop>
                <v-icon size="14">mdi-bookmark-outline</v-icon>
              </button>
              <button class="card-action-btn" title="Archive" @click.stop>
                <v-icon size="14">mdi-archive-arrow-down-outline</v-icon>
              </button>
            </div>

          </div>
        </div>

        <div v-if="filteredGroups.length === 0" class="inbox-empty">
          <div class="empty-icon">📭</div>
          <div class="empty-title">All caught up!</div>
          <div class="empty-sub">No notifications match your current filter.</div>
        </div>
      </div>

      <!-- Bookmarks tab -->
      <div v-else-if="activeTab === 'bookmarks'" class="feed">
        <div class="feed-group">
          <div class="feed-group-label">Saved for later</div>
          <div v-for="(item, i) in bookmarks" :key="item.id"
            class="inbox-card"
            :style="{ animationDelay: i * 60 + 'ms' }">
            <div class="card-avatar-col">
              <div class="card-avatar-wrap">
                <img :src="item.avatar" :alt="item.author" class="card-avatar" />
              </div>
            </div>
            <div class="card-body">
              <div class="card-top-row">
                <v-icon size="14" color="#f59e0b">mdi-bookmark</v-icon>
                <span class="card-project">{{ item.project }}</span>
                <span class="card-sep">·</span>
                <span class="card-time">{{ item.time }}</span>
              </div>
              <div class="card-title">{{ item.title }}</div>
              <div class="card-preview"><span class="card-author">{{ item.author }}</span><span class="card-msg">{{ item.preview }}</span></div>
            </div>
            <div class="card-actions">
              <button class="card-action-btn" title="Remove bookmark" @click.stop>
                <v-icon size="14" color="#f59e0b">mdi-bookmark</v-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Archive tab -->
      <div v-else class="feed">
        <div class="feed-group">
          <div class="feed-group-label">Older than 30 days</div>
          <div v-for="(item, i) in archived" :key="item.id"
            class="inbox-card archived-card"
            :style="{ animationDelay: i * 60 + 'ms' }">
            <div class="card-avatar-col">
              <div class="card-avatar-wrap">
                <img :src="item.avatar" :alt="item.author" class="card-avatar archived-avatar" />
              </div>
            </div>
            <div class="card-body">
              <div class="card-top-row">
                <v-icon size="13" color="#94a3b8">mdi-package-down</v-icon>
                <span class="card-project" style="color:#94a3b8">{{ item.project }}</span>
                <span class="card-sep">·</span>
                <span class="card-time">{{ item.time }}</span>
                <span class="card-status-badge status-done">Completed</span>
              </div>
              <div class="card-title" style="color:#94a3b8">{{ item.title }}</div>
              <div class="card-preview"><span class="card-msg" style="color:#94a3b8">{{ item.preview }}</span></div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab    = ref('activity')
const activeFilter = ref('all')
const selectedId   = ref<number | null>(null)
const sortNewest   = ref(true)
const search       = ref('')

const tabs = [
  { value: 'activity',  label: 'Activity',  icon: 'mdi-bell-outline',     count: 12 },
  { value: 'bookmarks', label: 'Bookmarks', icon: 'mdi-bookmark-outline', count: 5  },
  { value: 'archive',   label: 'Archive',   icon: 'mdi-archive-outline',  count: 0  },
]

const filters = [
  { value: 'all',      label: 'All',       color: '#4f46e5' },
  { value: 'mention',  label: 'Mentions',  color: '#a855f7' },
  { value: 'assigned', label: 'Assigned',  color: '#10b981' },
  { value: 'overdue',  label: 'Overdue',   color: '#ef4444' },
  { value: 'comment',  label: 'Comments',  color: '#06b6d4' },
]

const allItems = [
  {
    id: 1, group: 'Today', unread: true,
    title: 'Quarterly contest Engagement real-time dashboard in partner dashboard',
    author: 'Satya Bal', avatar: 'https://i.pravatar.cc/150?img=47',
    time: '8:13 PM', project: 'Execora (EX)', preview: 'Please find the details and share the TAT asap.',
    typeIcon: 'mdi-at', typeColor: '#a855f7', typeBg: '#faf5ff',
    status: 'Due soon', statusType: 'warn', priority: 'High',
    tags: ['dashboard', 'partner'], type: 'mention',
  },
  {
    id: 2, group: 'Today', unread: true,
    title: 'Fix authentication bug on mobile login flow',
    author: 'Mike T.', avatar: 'https://i.pravatar.cc/150?img=12',
    time: '3:45 PM', project: 'Mobile App V2', preview: 'Assigned you to this task — needs urgent attention.',
    typeIcon: 'mdi-account-arrow-right', typeColor: '#10b981', typeBg: '#f0fdf4',
    status: null, statusType: null, priority: 'High',
    tags: ['bug', 'auth'], type: 'assigned',
  },
  {
    id: 3, group: 'Yesterday', unread: false,
    title: 'Quarterly Engagement contest for all partners',
    author: 'Lasa Marandi', avatar: 'https://i.pravatar.cc/150?img=11',
    time: 'Yesterday', project: 'Execora (EX)', preview: 'Get me creatives for these banners.',
    typeIcon: 'mdi-message-outline', typeColor: '#06b6d4', typeBg: '#ecfeff',
    status: null, statusType: null, priority: 'Medium',
    tags: [], type: 'comment',
  },
  {
    id: 4, group: 'Yesterday', unread: false,
    title: 'Partner lead automation in CRM',
    author: 'Lasa Marandi', avatar: 'https://i.pravatar.cc/150?img=11',
    time: 'Yesterday', project: 'Backend Migration', preview: 'Update the status on this before EOD.',
    typeIcon: 'mdi-clock-alert-outline', typeColor: '#ef4444', typeBg: '#fef2f2',
    status: 'Overdue', statusType: 'danger', priority: 'High',
    tags: ['crm', 'automation'], type: 'overdue',
  },
  {
    id: 5, group: 'Past 7 Days', unread: false,
    title: 'Design system token update — spacing & typography',
    author: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?img=32',
    time: '3 days ago', project: 'Website Redesign', preview: 'Left a comment on the Figma file.',
    typeIcon: 'mdi-message-outline', typeColor: '#06b6d4', typeBg: '#ecfeff',
    status: null, statusType: null, priority: 'Low',
    tags: ['design', 'tokens'], type: 'comment',
  },
  {
    id: 6, group: 'Past 7 Days', unread: false,
    title: 'Sprint 24 retrospective action items',
    author: 'Dave B.', avatar: 'https://i.pravatar.cc/150?img=15',
    time: '5 days ago', project: 'Execora (EX)', preview: 'Mentioned you in the retro notes.',
    typeIcon: 'mdi-at', typeColor: '#a855f7', typeBg: '#faf5ff',
    status: null, statusType: null, priority: 'Medium',
    tags: ['retro', 'sprint'], type: 'mention',
  },
]

const bookmarks = [
  { id: 10, title: 'Weekly sync notes and action items', author: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=33', time: '3 days ago', project: 'Execora (EX)', preview: 'Review the attached document before the next sprint planning.' },
  { id: 11, title: 'API rate limit strategy discussion', author: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?img=32', time: '5 days ago', project: 'Backend Migration', preview: 'Shared a doc with proposed solutions for the rate limiting issue.' },
]

const archived = [
  { id: 20, title: 'Design system audit and cleanup', author: 'Satya Bal', avatar: 'https://i.pravatar.cc/150?img=47', time: '1 month ago', project: 'Website Redesign', preview: 'All old components have been deprecated and archived from the main branch.' },
]

const filteredGroups = computed(() => {
  const groupOrder = ['Today', 'Yesterday', 'Past 7 Days']
  let items = allItems.filter(i => {
    const matchFilter = activeFilter.value === 'all' || i.type === activeFilter.value
    const matchSearch = !search.value || i.title.toLowerCase().includes(search.value.toLowerCase()) || i.preview.toLowerCase().includes(search.value.toLowerCase())
    return matchFilter && matchSearch
  })
  const grouped: Record<string, typeof allItems> = {}
  for (const item of items) {
    if (!grouped[item.group]) grouped[item.group] = []
    ;(grouped[item.group] as typeof allItems).push(item)
  }
  return groupOrder.filter(g => grouped[g]).map(g => ({ label: g, items: grouped[g] }))
})
</script>

<style scoped>
/* ── Root layout ── */
.inbox-root {
  display: flex;
  height: 100%;
  min-height: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #1e293b;
  background: #f8fafc;
  overflow: hidden;
}

/* ── Sidebar ── */
.inbox-sidebar {
  width: 220px;
  min-width: 220px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 16px 0 12px;
  overflow-y: auto;
  gap: 0;
}

@media (max-width: 768px) {
  .inbox-sidebar { display: none; }
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px 12px;
}
.sidebar-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}
.sidebar-settings-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: background .12s, color .12s;
}
.sidebar-settings-btn:hover { background: #f1f5f9; color: #4f46e5; }

/* Search */
.sidebar-search-wrap {
  position: relative;
  margin: 0 10px 12px;
}
.search-icon {
  position: absolute;
  left: 9px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}
.sidebar-search {
  width: 100%;
  box-sizing: border-box;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 10px 7px 30px;
  font-size: 12px;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.sidebar-search:focus {
  border-color: #a5b4fc;
  box-shadow: 0 0 0 3px rgba(99,102,241,.12);
}

/* Nav */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 8px;
  margin-bottom: 14px;
}
.sidebar-nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 12.5px;
  font-weight: 500;
  color: #475569;
  font-family: 'Inter', sans-serif;
  transition: background .12s, color .12s;
  text-align: left;
  width: 100%;
}
.sidebar-nav-item:hover { background: #f1f5f9; color: #0f172a; }
.sidebar-nav-item.active {
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 600;
}
.nav-icon { flex-shrink: 0; }
.nav-badge {
  margin-left: auto;
  background: #4f46e5;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 20px;
  min-width: 18px;
  text-align: center;
}
.sidebar-nav-item.active .nav-badge { background: #4f46e5; }

/* Section label */
.sidebar-section-label {
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #94a3b8;
  padding: 0 14px 6px;
}

/* Filters */
.sidebar-filters {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 8px;
  margin-bottom: 16px;
}
.filter-chip {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 10px;
  border-radius: 7px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 12px;
  color: #475569;
  font-family: 'Inter', sans-serif;
  transition: background .12s, color .12s;
  text-align: left;
  width: 100%;
}
.filter-chip:hover { background: #f1f5f9; color: #0f172a; }
.filter-chip.active { background: #f1f5f9; color: #0f172a; font-weight: 600; }
.filter-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Stats */
.sidebar-stats {
  margin-top: auto;
  display: flex;
  justify-content: space-around;
  padding: 12px 10px 0;
  border-top: 1px solid #f1f5f9;
}
.sidebar-stat { text-align: center; }
.sidebar-stat-val {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}
.sidebar-stat-lbl {
  font-size: 10.5px;
  color: #94a3b8;
  margin-top: 2px;
}

/* ── Main ── */
.inbox-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Toolbar */
.inbox-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
  flex-shrink: 0;
}
.toolbar-left, .toolbar-right { display: flex; align-items: center; gap: 6px; }
.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 7px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-size: 12px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: background .12s, border-color .12s, color .12s;
}
.toolbar-btn:hover, .toolbar-btn.active {
  background: #eef2ff;
  border-color: #c7d2fe;
  color: #4f46e5;
}
.toolbar-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  cursor: pointer;
  transition: background .12s, color .12s;
}
.toolbar-icon-btn:hover { background: #f1f5f9; color: #4f46e5; }

/* Feed */
.feed {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.feed-group { margin-bottom: 8px; }
.feed-group-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  color: #94a3b8;
  padding: 6px 4px 8px;
}

/* Inbox card */
.inbox-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 12px 10px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid #e2e8f0;
  margin-bottom: 6px;
  cursor: pointer;
  transition: border-color .15s, box-shadow .15s, transform .15s, background .12s;
  animation: fadeSlideUp .3s ease both;
  position: relative;
}
.inbox-card:hover {
  border-color: #a5b4fc;
  box-shadow: 0 4px 16px rgba(79,70,229,.08);
  transform: translateY(-1px);
}
.inbox-card.selected {
  border-color: #6366f1;
  background: #fafafe;
  box-shadow: 0 0 0 2px rgba(99,102,241,.15);
}
.inbox-card.unread {
  background: #fafafe;
  border-left: 3px solid #6366f1;
}
.archived-card {
  opacity: .7;
  background: #f8fafc;
}
.archived-card:hover { opacity: 1; }

/* Avatar */
.card-avatar-col { flex-shrink: 0; }
.card-avatar-wrap { position: relative; }
.card-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
.archived-avatar { filter: grayscale(1); }
.unread-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #6366f1;
  border: 2px solid #fff;
}

/* Card body */
.card-body { flex: 1; min-width: 0; }
.card-top-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}
.card-type-icon {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.card-project { font-size: 11.5px; font-weight: 600; color: #4f46e5; }
.card-sep { color: #cbd5e1; font-size: 11px; }
.card-time { font-size: 11px; color: #94a3b8; margin-left: auto; white-space: nowrap; }
.card-badges { display: flex; align-items: center; gap: 4px; }

.card-status-badge {
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 20px;
}
.status-warn   { background: #fffbeb; color: #d97706; }
.status-danger { background: #fef2f2; color: #ef4444; }
.status-done   { background: #f0fdf4; color: #16a34a; }

.card-priority {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 20px;
}
.priority-High   { background: #fef2f2; color: #ef4444; }
.priority-Medium { background: #fffbeb; color: #d97706; }
.priority-Low    { background: #f0fdf4; color: #16a34a; }

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-preview {
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card-author { font-weight: 600; color: #475569; margin-right: 4px; }
.card-msg { color: #94a3b8; }

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}
.card-tag {
  font-size: 10.5px;
  font-weight: 500;
  background: #f1f5f9;
  color: #475569;
  padding: 2px 7px;
  border-radius: 20px;
}

/* Card actions */
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  opacity: 0;
  transition: opacity .15s;
  flex-shrink: 0;
}
.inbox-card:hover .card-actions { opacity: 1; }
.card-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #94a3b8;
  cursor: pointer;
  transition: background .12s, color .12s, border-color .12s;
}
.card-action-btn:hover { background: #eef2ff; color: #4f46e5; border-color: #c7d2fe; }

/* Empty state */
.inbox-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}
.empty-icon { font-size: 40px; margin-bottom: 12px; }
.empty-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.empty-sub { font-size: 12.5px; color: #94a3b8; }

/* Entrance animation */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
