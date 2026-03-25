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
        <button v-for="tab in tabs" :key="tab.value" class="sidebar-nav-item"
          :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
          <v-icon size="16" class="nav-icon">{{ tab.icon }}</v-icon>
          <span>{{ tab.label }}</span>
          <span v-if="tab.count" class="nav-badge">{{ tab.count }}</span>
        </button>
      </nav>

      <!-- Filters -->
      <div class="sidebar-section-label">Filters</div>
      <div class="sidebar-filters">
        <button v-for="f in filters" :key="f.value" class="filter-chip" :class="{ active: activeFilter === f.value }"
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

          <div v-for="(item, i) in group.items" :key="item.id" class="inbox-card"
            :class="{ unread: item.unread, selected: selectedId === item.id }"
            :style="{ animationDelay: i * 60 + 'ms' }" @click="selectedId = item.id">

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
          <div v-for="(item, i) in bookmarks" :key="item.id" class="inbox-card"
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
              <div class="card-preview"><span class="card-author">{{ item.author }}</span><span class="card-msg">{{
                item.preview }}</span></div>
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
          <div v-for="(item, i) in archived" :key="item.id" class="inbox-card archived-card"
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

    <!-- Task Detail Drawer (Right Side) -->
    <v-dialog v-model="detailsOpen" transition="slide-x-reverse-transition" content-class="dialog-right-drawer"
      scrollable>
      <div v-if="selectedItem" class="drawer-panel" @click.stop>

        <!-- Panel toolbar -->
        <div class="panel-toolbar">
          <v-btn variant="outlined" rounded size="small" class="mark-btn" @click="closeDetails">
            <template v-if="selectedItem?.status === 'Completed'">
              <v-icon size="16" class="mr-1">mdi-check-circle</v-icon>
            </template>
            <template v-else>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style="margin-right: 6px;">
                <circle cx="12" cy="12" r="10" stroke="#cbd5e1" stroke-width="2" />
              </svg>
            </template>
            {{ selectedItem?.status === 'Completed' ? 'Completed' : 'Mark complete' }}
          </v-btn>
          <div class="panel-toolbar-right">
            <v-btn variant="text" icon size="small" class="tb-btn" title="Like">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </v-btn>
            <v-btn variant="text" icon size="small" class="tb-btn" title="Attach">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              </svg>
            </v-btn>
            <v-btn variant="text" icon size="small" class="tb-btn" title="Dependencies">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M8 10V7a4 4 0 0 1 8 0v3h2v12H6V10h2zm2 0h4V7a2 2 0 0 0-4 0v3z" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </v-btn>
            <v-btn variant="text" icon size="small" class="tb-btn" title="Copy link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" />
              </svg>
            </v-btn>
            <v-btn variant="text" icon size="small" class="tb-btn" title="Expand">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </v-btn>
            <v-btn variant="text" icon size="small" class="tb-btn" title="More">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="5" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="19" cy="12" r="1.5" fill="currentColor" />
              </svg>
            </v-btn>
            <v-btn variant="text" icon size="small" class="tb-btn tb-close" @click="closeDetails" title="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
              </svg>
            </v-btn>
          </div>
        </div>

        <!-- Panel body -->
        <div class="panel-body">
          <!-- Task name -->
          <div class="task-name-wrap">
            <v-textarea readonly auto-grow variant="plain" hide-details class="task-name-input text-h5 font-weight-bold"
              style="line-height:1.2;" v-model="selectedItem.title" rows="1"></v-textarea>
          </div>

          <!-- Meta fields -->
          <div class="meta-fields">
            <div class="meta-row">
              <span class="meta-label">Assignee</span>
              <div class="meta-val">
                <div class="assignee-chip">
                  <template v-if="selectedItem?.avatar">
                    <img :src="selectedItem.avatar" class="chip-av" style="object-fit:cover;" />
                  </template>
                  <template v-else>
                    <div class="chip-av" style="background: #fbbf24; color: #78350f">{{
                      selectedItem?.author?.substring(0, 2).toUpperCase() || 'UN' }}</div>
                  </template>
                  <span style="font-size: 13px; margin-left:6px">{{ selectedItem?.author || 'Unassigned' }}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style="opacity:.6; margin-left:4px">
                    <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                  </svg>
                </div>
                <v-btn variant="text" size="small" class="meta-btn ms-2"
                  style="margin-left: 12px; font-size: 13px">Recently
                  assigned <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    style="opacity:.6; margin-left:2px">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg></v-btn>
              </div>
            </div>

            <div class="meta-row">
              <span class="meta-label">Due date</span>
              <div class="meta-val">
                <div class="assignee-chip"
                  style="background: transparent; color: #ef4444; border: 1px solid transparent; padding-left: 0; padding-right: 2px">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right: 2px">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                  <span style="font-size: 13px">{{ selectedItem?.time || 'No date' }}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style="opacity:.6; margin-left:4px">
                    <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="meta-row">
              <span class="meta-label">Dependencies</span>
              <div class="meta-val">
                <v-btn variant="text" size="small" class="meta-btn" style="font-size: 13px">Add dependencies</v-btn>
              </div>
            </div>

            <div class="meta-row border-0 mt-2">
              <span class="meta-label"
                style="display: flex; align-items: center; font-weight: 700; color: #0f172a; font-size: 13px">Projects
                <span class="count-badge ml-1"
                  style="background: #f1f5f9; padding: 2px 6px; border-radius: 12px; margin-left: 6px; font-weight: 600;">{{
                    selectedItem?.project ? 1 : 0 }}</span>
                <svg style="margin-left:8px; cursor:pointer" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                </svg></span>
              <div class="meta-val" style="justify-content: flex-end">
                <a href="#" style="font-size: 11px; color: #64748b; text-decoration: underline;">Send feedback</a>
              </div>
            </div>

            <div class="meta-row" style="padding-left: 18px; min-height: 28px">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #475569;">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style="opacity:.6">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                My tasks <span style="color: #64748b; margin-left: 12px; font-size: 12.5px;">Recently assigned <svg
                    width="10" height="10" viewBox="0 0 24 24" fill="none" style="opacity:.6; margin-left:2px">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                      stroke-linejoin="round" />
                  </svg></span>
              </div>
            </div>

          </div>

          <!-- Description -->
          <div class="section-block mt-4">
            <div class="section-title" style="text-transform: none; color: #0f172a; font-size: 14px;">Description</div>
            <v-textarea auto-grow variant="plain" hide-details placeholder="What is this task about?"
              class="desc-text mt-3" style="font-size: 13.5px; color: #64748b; line-height: 1.5" rows="2"></v-textarea>
            <div
              v-if="selectedItem.preview && selectedItem.preview !== 'Please find the details and share the TAT asap.' && selectedItem.preview !== 'What is this task about?'"
              class="desc-text mt-2" style="font-size: 13.5px; color: #475569; line-height: 1.5">
              {{ selectedItem.preview }}
            </div>
          </div>

        </div>

        <!-- Bottom Comment Box -->
        <div class="comment-section">
          <div class="c-av" style="background:#fbbf24; color: #78350f">LM</div>
          <div class="new-comment-wrap">
            <v-textarea class="new-comment-input" variant="plain" hide-details v-model="newComment" rows="1" auto-grow
              placeholder="Type / for menu" style="min-height: 38px"></v-textarea>
            <div class="new-comment-footer">
              <div class="comment-actions">
                <v-btn variant="text" icon size="small" class="icon-btn-sm"><svg width="14" height="14"
                    viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg></v-btn>
                <v-btn variant="text" icon size="small" class="icon-btn-sm"><svg width="15" height="15"
                    viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16v16H4V4z" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg></v-btn>
                <v-btn variant="text" icon size="small" class="icon-btn-sm"><svg width="15" height="15"
                    viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" />
                    <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" stroke-width="2"
                      stroke-linecap="round" />
                  </svg></v-btn>
                <v-btn variant="text" icon size="small" class="icon-btn-sm"><svg width="15" height="15"
                    viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" />
                  </svg></v-btn>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span class="comment-hint">0 people will be notified</span>
                <v-btn variant="flat" color="primary" size="small" class="btn-post blue-post">Comment</v-btn>
              </div>
            </div>
          </div>
        </div>
        <div class="comment-bottom-bar">
          <!-- Collaborators -->
          <div class="collab-row-small">
            <span style="font-size: 11px; color:#64748b; margin-right: 4px;">Collaborators</span>
            <div class="collab-av" style="background:#fbbf24; color: #78350f; border-color: #fff">LM</div>
            <div class="collab-av-empty"><svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="2" />
              </svg></div>
            <div class="collab-av-empty"><svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" />
                <path d="M4 20c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="2" />
              </svg></div>
            <v-btn variant="text" icon size="x-small" density="compact" class="collab-add-small">+</v-btn>
          </div>
          <v-btn variant="text" size="small" class="meta-btn ms-auto"
            style="color: #64748b; margin-left: auto; display: flex;"><svg width="13" height="13" viewBox="0 0 24 24"
              fill="none" style="margin-right:6px">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" />
              <polyline points="15 3 21 3 21 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>Leave task</v-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeTab = ref('activity')
const activeFilter = ref('all')
const selectedId = ref<number | null>(null)
const sortNewest = ref(true)
const search = ref('')
const newComment = ref('')

const detailsOpen = computed({
  get: () => selectedId.value !== null,
  set: (val) => { if (!val) selectedId.value = null }
})

const selectedItem = computed(() => {
  return allItems.value.find(i => i.id === selectedId.value) || null
})

function closeDetails() {
  detailsOpen.value = false
}

function toggleStatus() {
  if (!selectedItem.value) return
  if (selectedItem.value.status === 'Completed') {
    selectedItem.value.status = 'Due soon'
    selectedItem.value.statusType = 'warn'
  } else {
    selectedItem.value.status = 'Completed'
    selectedItem.value.statusType = 'done'
  }
}

const tabs = [
  { value: 'activity', label: 'Activity', icon: 'mdi-bell-outline', count: 12 },
  { value: 'bookmarks', label: 'Bookmarks', icon: 'mdi-bookmark-outline', count: 5 },
  { value: 'archive', label: 'Archive', icon: 'mdi-archive-outline', count: 0 },
]

const filters = [
  { value: 'all', label: 'All', color: '#4f46e5' },
  { value: 'mention', label: 'Mentions', color: '#a855f7' },
  { value: 'assigned', label: 'Assigned', color: '#10b981' },
  { value: 'overdue', label: 'Overdue', color: '#ef4444' },
  { value: 'comment', label: 'Comments', color: '#06b6d4' },
]

const allItems = ref([
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
])

const bookmarks = [
  { id: 10, title: 'Weekly sync notes and action items', author: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=33', time: '3 days ago', project: 'Execora (EX)', preview: 'Review the attached document before the next sprint planning.' },
  { id: 11, title: 'API rate limit strategy discussion', author: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?img=32', time: '5 days ago', project: 'Backend Migration', preview: 'Shared a doc with proposed solutions for the rate limiting issue.' },
]

const archived = [
  { id: 20, title: 'Design system audit and cleanup', author: 'Satya Bal', avatar: 'https://i.pravatar.cc/150?img=47', time: '1 month ago', project: 'Website Redesign', preview: 'All old components have been deprecated and archived from the main branch.' },
]

const filteredGroups = computed(() => {
  const groupOrder = ['Today', 'Yesterday', 'Past 7 Days']
  let items = allItems.value.filter(i => {
    const matchFilter = activeFilter.value === 'all' || i.type === activeFilter.value
    const matchSearch = !search.value || i.title.toLowerCase().includes(search.value.toLowerCase()) || i.preview.toLowerCase().includes(search.value.toLowerCase())
    return matchFilter && matchSearch
  })
  const grouped: Record<string, typeof allItems.value> = {}
  for (const item of items) {
    if (!grouped[item.group]) grouped[item.group] = []
      ; (grouped[item.group] as typeof allItems.value).push(item)
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
  .inbox-sidebar {
    display: none;
  }
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

.sidebar-settings-btn:hover {
  background: #f1f5f9;
  color: #4f46e5;
}

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
  box-shadow: 0 0 0 3px rgba(99, 102, 241, .12);
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

.sidebar-nav-item:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.sidebar-nav-item.active {
  background: #eef2ff;
  color: #4f46e5;
  font-weight: 600;
}

.nav-icon {
  flex-shrink: 0;
}

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

.sidebar-nav-item.active .nav-badge {
  background: #4f46e5;
}

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

.filter-chip:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.filter-chip.active {
  background: #f1f5f9;
  color: #0f172a;
  font-weight: 600;
}

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

.sidebar-stat {
  text-align: center;
}

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

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

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

.toolbar-btn:hover,
.toolbar-btn.active {
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

.toolbar-icon-btn:hover {
  background: #f1f5f9;
  color: #4f46e5;
}

/* Feed */
.feed {
  flex: 1;
  overflow-y: auto;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.feed-group {
  margin-bottom: 8px;
}

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
  box-shadow: 0 4px 16px rgba(79, 70, 229, .08);
  transform: translateY(-1px);
}

.inbox-card.selected {
  border-color: #6366f1;
  background: #fafafe;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, .15);
}

.inbox-card.unread {
  background: #fafafe;
  border-left: 3px solid #6366f1;
}

.archived-card {
  opacity: .7;
  background: #f8fafc;
}

.archived-card:hover {
  opacity: 1;
}

/* Avatar */
.card-avatar-col {
  flex-shrink: 0;
}

.card-avatar-wrap {
  position: relative;
}

.card-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.archived-avatar {
  filter: grayscale(1);
}

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
.card-body {
  flex: 1;
  min-width: 0;
}

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

.card-project {
  font-size: 11.5px;
  font-weight: 600;
  color: #4f46e5;
}

.card-sep {
  color: #cbd5e1;
  font-size: 11px;
}

.card-time {
  font-size: 11px;
  color: #94a3b8;
  margin-left: auto;
  white-space: nowrap;
}

.card-badges {
  display: flex;
  align-items: center;
  gap: 4px;
}

.card-status-badge {
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 20px;
}

.status-warn {
  background: #fffbeb;
  color: #d97706;
}

.status-danger {
  background: #fef2f2;
  color: #ef4444;
}

.status-done {
  background: #f0fdf4;
  color: #16a34a;
}

.card-priority {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 20px;
}

.priority-High {
  background: #fef2f2;
  color: #ef4444;
}

.priority-Medium {
  background: #fffbeb;
  color: #d97706;
}

.priority-Low {
  background: #f0fdf4;
  color: #16a34a;
}

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

.card-author {
  font-weight: 600;
  color: #475569;
  margin-right: 4px;
}

.card-msg {
  color: #94a3b8;
}

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

.inbox-card:hover .card-actions {
  opacity: 1;
}

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

.card-action-btn:hover {
  background: #eef2ff;
  color: #4f46e5;
  border-color: #c7d2fe;
}

/* Empty state */
.inbox-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.empty-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.empty-sub {
  font-size: 12.5px;
  color: #94a3b8;
}

/* Entrance animation */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Right Panel Drawer ── */
:deep(.dialog-right-drawer) {
  margin: 0 !important;
  margin-left: auto !important;
  width: 660px !important;
  max-width: 100vw !important;
  max-height: 100vh !important;
  height: 100vh !important;
  border-radius: 0 !important;
  background: #fff;
  box-shadow: -6px 0 32px rgba(0, 0, 0, .14) !important;
}

.drawer-panel {
  background: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

/* ── Panel toolbar ── */
.panel-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.mark-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all .15s;
}

.mark-btn:hover {
  border-color: #10b981;
  color: #10b981;
}

.panel-toolbar-right {
  display: flex;
  align-items: center;
  gap: 2px;
}

.tb-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  transition: background .12s, color .12s;
}

.tb-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.tb-close:hover {
  background: #fef2f2;
  color: #ef4444;
}

/* ── Panel body ── */
.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
}

.task-name-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.task-name-input {
  width: 100%;
  border: none;
  outline: none;
  background: none;
  resize: none;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  font-family: 'Inter', sans-serif;
  line-height: 1.2;
}

/* ── Meta fields ── */
.meta-fields {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-row {
  display: flex;
  align-items: center;
  min-height: 38px;
  padding: 0;
}

.meta-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: #475569;
  width: 130px;
  flex-shrink: 0;
}

.meta-val {
  flex: 1;
  display: flex;
  align-items: center;
}

.meta-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 0;
  border: none;
  background: none;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: color .12s;
}

.meta-btn:hover {
  color: #0f172a;
}

.assignee-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px 3px 3px;
  border-radius: 20px;
  background: transparent;
  font-size: 12.5px;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  transition: background .12s;
}

.assignee-chip:hover {
  background: #f8fafc;
}

.chip-av {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 700;
  color: #fff;
}

/* ── Description ── */
.section-block {
  display: flex;
  flex-direction: column;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

/* ── Comment Section ── */
.comment-section {
  padding: 16px 24px 12px;
  display: flex;
  gap: 12px;
  background: #fff;
  border-top: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.c-av {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  margin-top: 2px;
}

.new-comment-wrap {
  flex: 1;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fff;
  transition: border-color .15s;
}

.new-comment-wrap:focus-within {
  border-color: #94a3b8;
}

.new-comment-input {
  width: 100%;
  border: none;
  outline: none;
  background: none;
  font-size: 13.5px;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
  resize: none;
  margin-bottom: 8px;
}

.new-comment-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.comment-actions {
  display: flex;
  gap: 4px;
}

.icon-btn-sm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  transition: background .12s;
}

.icon-btn-sm:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.comment-hint {
  font-size: 11.5px;
  color: #94a3b8;
}

.btn-post.blue-post {
  background: #4f46e5;
  color: #fff;
  padding: 6px 16px;
  border-radius: 6px;
  border: none;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.btn-post.blue-post:hover {
  background: #4338ca;
}

/* ── Comment Bottom Bar ── */
.comment-bottom-bar {
  padding: 8px 24px 20px;
  background: #fafafa;
  display: flex;
  align-items: center;
  border-top: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.collab-row-small {
  display: flex;
  align-items: center;
  gap: 6px;
}

.collab-av {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  border: 2px solid #fff;
  cursor: pointer;
  box-shadow: 0 0 0 1px #e2e8f0;
}

.collab-av-empty {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px dashed #cbd5e1;
  color: #94a3b8;
  background: #fff;
  cursor: pointer;
}

.collab-add-small {
  font-size: 16px;
  color: #64748b;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  margin-left: 2px;
}
</style>
