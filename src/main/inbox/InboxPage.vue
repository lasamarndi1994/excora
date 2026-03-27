<template>
  <div class="inbox-root">

    <!-- ── Sidebar ── -->
    <aside class="inbox-sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-title">Inbox</h1>
        <button class="sidebar-settings-btn" title="Manage notifications">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" stroke-width="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2"/></svg>
        </button>
      </div>

      <!-- Search -->
      <div class="sidebar-search-wrap">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" class="search-icon"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input v-model="search" class="sidebar-search" placeholder="Search notifications…" />
      </div>

      <!-- Nav tabs -->
      <nav class="sidebar-nav">
        <button v-for="tab in tabs" :key="tab.value" class="sidebar-nav-item"
          :class="{ active: activeTab === tab.value }" @click="activeTab = tab.value">
          <span class="nav-icon" v-html="tab.svg"></span>
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
          <div class="sidebar-stat-val">{{ unreadCount }}</div>
          <div class="sidebar-stat-lbl">Unread</div>
        </div>
        <div class="sidebar-stat">
          <div class="sidebar-stat-val">3</div>
          <div class="sidebar-stat-lbl">Overdue</div>
        </div>
        <div class="sidebar-stat">
          <div class="sidebar-stat-val">{{ bookmarkCount }}</div>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            {{ sortNewest ? 'Newest first' : 'Oldest first' }}
          </button>
          <button class="toolbar-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Filter
          </button>
        </div>
        <div class="toolbar-right">
          <button class="toolbar-icon-btn" title="Mark all read">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 12 9 23l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="toolbar-icon-btn" title="More options">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>
          </button>
        </div>
      </div>

      <!-- Activity tab -->
      <div v-if="activeTab === 'activity'" class="feed">
        <div v-for="group in filteredGroups" :key="group.label" class="feed-group">
          <div class="feed-group-label">{{ group.label }}</div>
          <div v-for="(item, i) in group.items" :key="item.id" class="inbox-card"
            :class="{ unread: item.unread, selected: selectedId === item.id, 'is-done-card': item.done }"
            :style="{ animationDelay: i * 60 + 'ms' }" @click="openPanel(item.id)">

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
                  <span v-html="item.typeSvg" style="display:flex;align-items:center;justify-content:center;width:12px;height:12px;"></span>
                </div>
                <span class="card-project">{{ item.project }}</span>
                <span class="card-sep">·</span>
                <span class="card-time">{{ item.time }}</span>
                <div class="card-badges">
                  <span v-if="item.status" class="card-status-badge" :class="`status-${item.statusType}`">{{ item.status }}</span>
                  <span v-if="item.priority" class="card-priority" :class="`priority-${item.priority}`">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></svg>
                    {{ item.priority }}
                  </span>
                </div>
              </div>
              <div class="card-title" :class="{ 'line-through-text': item.done }">{{ item.title }}</div>
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
              <button class="card-action-btn" :class="{ 'action-done': item.done }" title="Mark done" @click.stop="item.done = !item.done">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path v-if="item.done" d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="card-action-btn" :class="{ 'action-bookmarked': item.bookmarked }" title="Bookmark" @click.stop="item.bookmarked = !item.bookmarked">
                <svg width="14" height="14" viewBox="0 0 24 24" :fill="item.bookmarked ? '#f59e0b' : 'none'" :stroke="item.bookmarked ? '#f59e0b' : 'currentColor'" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
              <button class="card-action-btn" title="Archive" @click.stop="archiveItem(item.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="21 8 21 21 3 21 3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="3" width="22" height="5" rx="1" stroke="currentColor" stroke-width="2"/><line x1="10" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
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
          <div v-for="(item, i) in bookmarkedItems" :key="item.id" class="inbox-card"
            :style="{ animationDelay: i * 60 + 'ms' }" @click="openPanel(item.id)">
            <div class="card-avatar-col">
              <div class="card-avatar-wrap">
                <img :src="item.avatar" :alt="item.author" class="card-avatar" />
              </div>
            </div>
            <div class="card-body">
              <div class="card-top-row">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                <span class="card-project">{{ item.project }}</span>
                <span class="card-sep">·</span>
                <span class="card-time">{{ item.time }}</span>
              </div>
              <div class="card-title">{{ item.title }}</div>
              <div class="card-preview"><span class="card-author">{{ item.author }}</span><span class="card-msg">{{ item.preview }}</span></div>
            </div>
            <div class="card-actions">
              <button class="card-action-btn action-bookmarked" title="Remove bookmark" @click.stop="item.bookmarked = false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Archive tab -->
      <div v-else class="feed">
        <div class="feed-group">
          <div class="feed-group-label">Older than 30 days</div>
          <div v-for="(item, i) in archivedItems" :key="item.id" class="inbox-card archived-card"
            :style="{ animationDelay: i * 60 + 'ms' }">
            <div class="card-avatar-col">
              <div class="card-avatar-wrap">
                <img :src="item.avatar" :alt="item.author" class="card-avatar archived-avatar" />
              </div>
            </div>
            <div class="card-body">
              <div class="card-top-row">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12" stroke-linecap="round"/></svg>
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

    <!-- ── Slide-in Detail Panel (Teleport) ── -->
    <teleport to="body">
      <transition name="panel-slide">
        <div v-if="panelOpen && selectedItem" class="panel-overlay" :class="{ 'panel-overlay--full': isFullPage }">
          <div class="panel-drawer" :class="{ 'panel-drawer--full': isFullPage }" @click="taskMenuOpen = false">

            <!-- Panel toolbar -->
            <div class="panel-toolbar">
              <button class="mark-btn" :class="{ completed: selectedItem.done }" @click="selectedItem.done = !selectedItem.done">
                <svg v-if="selectedItem.done" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#10b981" stroke-width="2"/><path d="M8 12l3 3 5-5" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#cbd5e1" stroke-width="2"/></svg>
                {{ selectedItem.done ? 'Completed' : 'Mark complete' }}
              </button>
              <div class="panel-toolbar-right">
                <button class="tb-btn" title="Like">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button class="tb-btn" title="Attach">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <button class="tb-btn" title="Dependencies">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M10 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button class="tb-btn" title="Copy link">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <!-- Expand to full page -->
                <button class="tb-btn" :class="{ 'tb-active': isFullPage }" title="Expand to full page" @click="isFullPage = !isFullPage">
                  <svg v-if="!isFullPage" width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <!-- Three-dot menu -->
                <div style="position:relative">
                  <button class="tb-btn" title="More" @click.stop="taskMenuOpen = !taskMenuOpen">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>
                  </button>
                  <div v-if="taskMenuOpen" class="task-dropdown" @click.stop>
                    <div class="td-group">
                      <button class="td-item" @click="taskMenuOpen=false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Add to projects
                        <span class="td-kbd"><kbd>Tab</kbd><kbd>P</kbd></span>
                      </button>
                      <button class="td-item" @click="taskMenuOpen=false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        Add tags
                        <span class="td-kbd"><kbd>Tab</kbd><kbd>T</kbd></span>
                      </button>
                      <button class="td-item" @click="taskMenuOpen=false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        Create follow-up task
                        <span class="td-kbd"><kbd>Shift</kbd><kbd>Tab</kbd><kbd>F</kbd></span>
                      </button>
                      <button class="td-item" @click="taskMenuOpen=false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        Merge duplicate tasks
                        <span class="td-kbd"><kbd>Shift</kbd><kbd>Tab</kbd><kbd>D</kbd></span>
                      </button>
                    </div>
                    <div class="td-divider"></div>
                    <div class="td-group">
                      <button class="td-item" @click="taskMenuOpen=false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Summarize task
                      </button>
                      <button class="td-item" @click="taskMenuOpen=false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        Draft subtasks
                      </button>
                    </div>
                    <div class="td-divider"></div>
                    <div class="td-group">
                      <button class="td-item" @click="taskMenuOpen=false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        Convert to
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style="margin-left:auto"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      </button>
                      <button class="td-item" @click="duplicateCurrentTask(); taskMenuOpen=false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        Duplicate task
                      </button>
                      <button class="td-item" @click="taskMenuOpen=false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="6" y="14" width="12" height="8" rx="1" stroke="currentColor" stroke-width="2"/></svg>
                        Print
                      </button>
                      <button class="td-item" @click="taskMenuOpen=false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" stroke-width="2"/></svg>
                        Make public
                      </button>
                    </div>
                    <div class="td-divider"></div>
                    <div class="td-group">
                      <button class="td-item td-item--danger" @click="deleteCurrentTask(); taskMenuOpen=false">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg>
                        Delete task
                        <span class="td-kbd"><kbd>Tab</kbd><kbd>Bksp</kbd></span>
                      </button>
                    </div>
                  </div>
                </div>
                <button class="tb-btn tb-close" @click="closePanel" title="Close">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>

            <!-- Panel body -->
            <div class="panel-body">

              <!-- Task title -->
              <div class="task-name-wrap">
                <textarea class="task-name-input" v-model="selectedItem.title" rows="1" @input="autoResize"></textarea>
              </div>

              <!-- Meta fields -->
              <div class="panel-meta-fields">

                <!-- Assignee -->
                <div class="panel-meta-row" style="position:relative">
                  <span class="panel-meta-label">Assignee</span>
                  <div class="panel-meta-val">
                    <div class="assignee-chip" @click.stop="toggleAssigneePicker" ref="assigneeTriggerRef">
                      <img v-if="selectedItem.avatar" :src="selectedItem.avatar" class="chip-av" style="object-fit:cover;" />
                      <div v-else class="chip-av" style="background:#fbbf24;color:#78350f">{{ selectedItem.author?.substring(0,2).toUpperCase() || 'UN' }}</div>
                      <span>{{ selectedItem.author || 'Unassigned' }}</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style="opacity:.5;margin-left:2px"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                  </div>
                </div>

                <!-- Priority -->
                <div class="panel-meta-row">
                  <span class="panel-meta-label">Priority</span>
                  <div class="panel-meta-val">
                    <button class="priority-pill" :class="`prio-${(selectedItem.priority||'').toLowerCase()}`" @click="cyclePriority(selectedItem)">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/></svg>
                      {{ selectedItem.priority || 'None' }}
                    </button>
                  </div>
                </div>

                <!-- Due date -->
                <div class="panel-meta-row">
                  <span class="panel-meta-label">Due date</span>
                  <div class="panel-meta-val">
                    <div class="date-chip">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                      <input type="date" class="date-input-field" v-model="selectedItem.dueDate" />
                    </div>
                  </div>
                </div>

                <!-- Project -->
                <div class="panel-meta-row">
                  <span class="panel-meta-label">Project</span>
                  <div class="panel-meta-val">
                    <span class="proj-chip-meta">
                      <span class="proj-dot"></span>
                      {{ selectedItem.project }}
                    </span>
                  </div>
                </div>

              </div>

              <!-- Description -->
              <div class="panel-section">
                <div class="panel-section-title">Description</div>
                <textarea class="desc-textarea" v-model="selectedItem.description" placeholder="What is this task about?" rows="3"></textarea>
              </div>

              <!-- Tags -->
              <div class="panel-section">
                <div class="panel-section-title">Tags</div>
                <div class="tags-wrap">
                  <span v-for="tag in selectedItem.tags" :key="tag" class="tag-chip">
                    {{ tag }}
                    <button class="tag-remove" @click="removeTag(selectedItem, tag)">×</button>
                  </span>
                  <input class="tag-input" v-model="newTag" placeholder="Add tag…" @keydown.enter.prevent="addTag(selectedItem)" />
                </div>
              </div>

              <!-- Comments -->
              <div class="panel-section">
                <div class="panel-section-title">Comments <span class="count-badge">{{ selectedItem.comments.length }}</span></div>
                <div class="comments-list">
                  <div v-for="c in selectedItem.comments" :key="c.id" class="comment-row">
                    <div class="c-av" :style="{ background: c.avBg }">{{ c.author.substring(0,2).toUpperCase() }}</div>
                    <div class="c-body">
                      <div class="c-header">
                        <span class="c-author">{{ c.author }}</span>
                        <span class="c-time">{{ c.time }}</span>
                        <button class="c-del icon-btn-sm" @click="deleteComment(selectedItem, c.id)" title="Delete">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                        </button>
                      </div>
                      <div class="c-text">{{ c.text }}</div>
                    </div>
                  </div>
                </div>

                <!-- New comment -->
                <div class="new-comment">
                  <div class="c-av" style="background:#fbbf24;color:#78350f">LM</div>
                  <div class="new-comment-wrap">
                    <textarea class="new-comment-input" v-model="newComment" rows="2"
                      placeholder="Write a comment… (Ctrl+Enter to post)"
                      @keydown.ctrl.enter.prevent="postComment(selectedItem)"></textarea>
                    <div class="new-comment-footer">
                      <div class="comment-actions">
                        <button class="icon-btn-sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        </button>
                        <button class="icon-btn-sm">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        </button>
                      </div>
                      <div style="display:flex;align-items:center;gap:10px;">
                        <span class="comment-hint">Ctrl+Enter to post</span>
                        <button class="btn-post" :disabled="!newComment.trim()" @click="postComment(selectedItem)">Post</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Assignee picker (teleported separately) -->
    <teleport to="body">
      <div v-if="assigneePickerOpen" class="assignee-picker-fixed" :style="assigneePickerStyle" @click.stop>
        <div class="ap-title">Change assignee</div>
        <div class="ap-search-wrap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#94a3b8" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/></svg>
          <input class="ap-search" v-model="assigneeSearch" placeholder="Search…" @click.stop />
        </div>
        <div v-for="u in filteredAssigneeUsers" :key="u.id"
          class="ap-item" :class="{ 'ap-item--active': selectedItem?.author === u.name }"
          @click="assignUser(u)">
          <img :src="u.avatar" class="ap-av" />
          <span class="ap-name">{{ u.name }}</span>
          <svg v-if="selectedItem?.author === u.name" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="ap-divider"></div>
        <div class="ap-item" @click="assignUser(null)">
          <div class="ap-av-empty">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/></svg>
          </div>
          <span class="ap-name" style="color:#94a3b8">Unassign</span>
        </div>
      </div>
    </teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()

// ── Types ──
interface Comment {
  id: number
  author: string
  avBg: string
  text: string
  time: string
}

interface InboxItem {
  id: number
  group: string
  unread: boolean
  title: string
  author: string
  avatar: string
  time: string
  project: string
  preview: string
  typeSvg: string
  typeColor: string
  typeBg: string
  status: string | null
  statusType: string | null
  priority: string
  tags: string[]
  type: string
  done: boolean
  bookmarked: boolean
  archived: boolean
  description: string
  dueDate: string
  comments: Comment[]
}

// ── SVG helpers ──
const svgAt = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="#a855f7" stroke-width="2"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" stroke="#a855f7" stroke-width="2" stroke-linecap="round"/></svg>`
const svgAssign = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="#10b981" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="#10b981" stroke-width="2"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#10b981" stroke-width="2" stroke-linecap="round"/></svg>`
const svgMsg = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
const svgClock = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#ef4444" stroke-width="2"/><path d="M12 6v6l4 2" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg>`

// ── State ──
const activeTab = ref('activity')
const activeFilter = ref('all')
const selectedId = ref<number | null>(null)
const panelOpen = ref(false)
const sortNewest = ref(true)
const search = ref('')
const newComment = ref('')
const newTag = ref('')
const assigneePickerOpen = ref(false)
const assigneeSearch = ref('')
const assigneeTriggerRef = ref<HTMLElement | null>(null)
const assigneePickerStyle = ref<Record<string, string>>({})
const taskMenuOpen = ref(false)
const isFullPage = ref(false)
let commentIdSeq = 100

// ── Data ──
const allItems = ref<InboxItem[]>([
  {
    id: 1, group: 'Today', unread: true,
    title: 'Quarterly contest Engagement real-time dashboard in partner dashboard',
    author: 'Satya Bal', avatar: 'https://i.pravatar.cc/150?img=47',
    time: '8:13 PM', project: 'Execora (EX)', preview: 'Please find the details and share the TAT asap.',
    typeSvg: svgAt, typeColor: '#a855f7', typeBg: '#faf5ff',
    status: 'Due soon', statusType: 'warn', priority: 'High',
    tags: ['dashboard', 'partner'], type: 'mention',
    done: false, bookmarked: false, archived: false,
    description: '', dueDate: '',
    comments: [
      { id: 1, author: 'Satya Bal', avBg: '#6366f1', text: 'Please find the details and share the TAT asap.', time: '8:13 PM' }
    ],
  },
  {
    id: 2, group: 'Today', unread: true,
    title: 'Fix authentication bug on mobile login flow',
    author: 'Mike T.', avatar: 'https://i.pravatar.cc/150?img=12',
    time: '3:45 PM', project: 'Mobile App V2', preview: 'Assigned you to this task — needs urgent attention.',
    typeSvg: svgAssign, typeColor: '#10b981', typeBg: '#f0fdf4',
    status: null, statusType: null, priority: 'High',
    tags: ['bug', 'auth'], type: 'assigned',
    done: false, bookmarked: false, archived: false,
    description: '', dueDate: '',
    comments: [],
  },
  {
    id: 3, group: 'Yesterday', unread: false,
    title: 'Quarterly Engagement contest for all partners',
    author: 'Lasa Marandi', avatar: 'https://i.pravatar.cc/150?img=11',
    time: 'Yesterday', project: 'Execora (EX)', preview: 'Get me creatives for these banners.',
    typeSvg: svgMsg, typeColor: '#06b6d4', typeBg: '#ecfeff',
    status: null, statusType: null, priority: 'Medium',
    tags: [], type: 'comment',
    done: false, bookmarked: false, archived: false,
    description: '', dueDate: '',
    comments: [],
  },
  {
    id: 4, group: 'Yesterday', unread: false,
    title: 'Partner lead automation in CRM',
    author: 'Lasa Marandi', avatar: 'https://i.pravatar.cc/150?img=11',
    time: 'Yesterday', project: 'Backend Migration', preview: 'Update the status on this before EOD.',
    typeSvg: svgClock, typeColor: '#ef4444', typeBg: '#fef2f2',
    status: 'Overdue', statusType: 'danger', priority: 'High',
    tags: ['crm', 'automation'], type: 'overdue',
    done: false, bookmarked: false, archived: false,
    description: '', dueDate: '',
    comments: [],
  },
  {
    id: 5, group: 'Past 7 Days', unread: false,
    title: 'Design system token update — spacing & typography',
    author: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?img=32',
    time: '3 days ago', project: 'Website Redesign', preview: 'Left a comment on the Figma file.',
    typeSvg: svgMsg, typeColor: '#06b6d4', typeBg: '#ecfeff',
    status: null, statusType: null, priority: 'Low',
    tags: ['design', 'tokens'], type: 'comment',
    done: false, bookmarked: false, archived: false,
    description: '', dueDate: '',
    comments: [],
  },
  {
    id: 6, group: 'Past 7 Days', unread: false,
    title: 'Sprint 24 retrospective action items',
    author: 'Dave B.', avatar: 'https://i.pravatar.cc/150?img=15',
    time: '5 days ago', project: 'Execora (EX)', preview: 'Mentioned you in the retro notes.',
    typeSvg: svgAt, typeColor: '#a855f7', typeBg: '#faf5ff',
    status: null, statusType: null, priority: 'Medium',
    tags: ['retro', 'sprint'], type: 'mention',
    done: false, bookmarked: false, archived: false,
    description: '', dueDate: '',
    comments: [],
  },
])

// ── Tabs ──
const tabs = [
  { value: 'activity', label: 'Activity', svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`, count: computed(() => unreadCount.value) },
  { value: 'bookmarks', label: 'Bookmarks', svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, count: computed(() => bookmarkCount.value) },
  { value: 'archive', label: 'Archive', svg: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="21 8 21 21 3 21 3 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="3" width="22" height="5" rx="1" stroke="currentColor" stroke-width="2"/><line x1="10" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`, count: 0 },
]

const filters = [
  { value: 'all', label: 'All', color: '#4f46e5' },
  { value: 'mention', label: 'Mentions', color: '#a855f7' },
  { value: 'assigned', label: 'Assigned', color: '#10b981' },
  { value: 'overdue', label: 'Overdue', color: '#ef4444' },
  { value: 'comment', label: 'Comments', color: '#06b6d4' },
]

// ── Computed ──
const selectedItem = computed(() => allItems.value.find(i => i.id === selectedId.value) || null)

const unreadCount = computed(() => allItems.value.filter(i => i.unread && !i.archived).length)
const bookmarkCount = computed(() => allItems.value.filter(i => i.bookmarked && !i.archived).length)

const bookmarkedItems = computed(() => allItems.value.filter(i => i.bookmarked && !i.archived))
const archivedItems = computed(() => allItems.value.filter(i => i.archived))

const filteredGroups = computed(() => {
  const groupOrder = ['Today', 'Yesterday', 'Past 7 Days']
  const items = allItems.value.filter(i => {
    if (i.archived) return false
    const matchFilter = activeFilter.value === 'all' || i.type === activeFilter.value
    const matchSearch = !search.value || i.title.toLowerCase().includes(search.value.toLowerCase()) || i.preview.toLowerCase().includes(search.value.toLowerCase())
    return matchFilter && matchSearch
  })
  const grouped: Record<string, InboxItem[]> = {}
  for (const item of items) {
    if (!grouped[item.group]) grouped[item.group] = []
    grouped[item.group]!.push(item)
  }
  return groupOrder.filter(g => grouped[g]).map(g => ({ label: g, items: grouped[g] as InboxItem[] }))
})

// ── Actions ──
function openPanel(id: number) {
  selectedId.value = id
  panelOpen.value = true
}

function closePanel() {
  panelOpen.value = false
  setTimeout(() => { selectedId.value = null }, 250)
}

function archiveItem(id: number) {
  const item = allItems.value.find(i => i.id === id)
  if (item) item.archived = true
}

const duplicateCurrentTask = () => {
  if (!selectedItem.value) return
  const copy = { ...JSON.parse(JSON.stringify(selectedItem.value)), id: Date.now() }
  copy.title += ' (copy)'
  allItems.value.push(copy)
}

const deleteCurrentTask = () => {
  if (!selectedItem.value) return
  allItems.value = allItems.value.filter(i => i.id !== selectedItem.value!.id)
  closePanel()
}

function cyclePriority(item: InboxItem) {
  const order = ['High', 'Medium', 'Low']
  const idx = order.indexOf(item.priority)
  item.priority = order[(idx + 1) % order.length] ?? 'High'
}

function addTag(item: InboxItem) {
  const t = newTag.value.trim()
  if (t && !item.tags.includes(t)) item.tags.push(t)
  newTag.value = ''
}

function removeTag(item: InboxItem, tag: string) {
  item.tags = item.tags.filter(t => t !== tag)
}

function postComment(item: InboxItem) {
  const text = newComment.value.trim()
  if (!text) return
  item.comments.push({
    id: ++commentIdSeq,
    author: 'Lasa Marandi',
    avBg: '#fbbf24',
    text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })
  newComment.value = ''
}

function deleteComment(item: InboxItem, id: number) {
  item.comments = item.comments.filter(c => c.id !== id)
}

// ── Assignee picker ──
const filteredAssigneeUsers = computed(() =>
  store.users.filter(u =>
    !assigneeSearch.value || u.name.toLowerCase().includes(assigneeSearch.value.toLowerCase())
  )
)

const toggleAssigneePicker = () => {
  assigneePickerOpen.value = !assigneePickerOpen.value
  if (assigneePickerOpen.value && assigneeTriggerRef.value) {
    assigneeSearch.value = ''
    const rect = assigneeTriggerRef.value.getBoundingClientRect()
    assigneePickerStyle.value = {
      position: 'fixed',
      top: rect.bottom + 6 + 'px',
      left: rect.left + 'px',
      zIndex: '9999',
    }
  }
}

const assignUser = (u: { name: string; avatar: string } | null) => {
  if (!selectedItem.value) return
  selectedItem.value.author = u?.name ?? ''
  selectedItem.value.avatar = u?.avatar ?? ''
  assigneePickerOpen.value = false
}

function autoResize(e: Event) {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}
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
.sidebar-nav-item.active { background: #eef2ff; color: #4f46e5; font-weight: 600; }

.nav-icon { flex-shrink: 0; display: flex; align-items: center; }

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

.toolbar-left, .toolbar-right {
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

.inbox-card.is-done-card .card-title { text-decoration: line-through; color: #94a3b8; }

.archived-card { opacity: .7; background: #f8fafc; }
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

.status-warn { background: #fffbeb; color: #d97706; }
.status-danger { background: #fef2f2; color: #ef4444; }
.status-done { background: #f0fdf4; color: #16a34a; }

.card-priority {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 10.5px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 20px;
}

.priority-High { background: #fef2f2; color: #ef4444; }
.priority-Medium { background: #fffbeb; color: #d97706; }
.priority-Low { background: #f0fdf4; color: #16a34a; }

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

.line-through-text { text-decoration: line-through; color: #94a3b8; }

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

.card-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }

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
.card-action-btn.action-done { color: #10b981; border-color: #6ee7b7; background: #f0fdf4; }
.card-action-btn.action-bookmarked { color: #f59e0b; border-color: #fcd34d; background: #fffbeb; }

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

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── Slide-in Panel ── */
.panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.25);
  z-index: 1100;
  display: flex;
  justify-content: flex-end;
}

.panel-drawer {
  width: 660px;
  max-width: 95vw;
  height: 100%;
  background: #fff;
  box-shadow: -6px 0 32px rgba(0,0,0,.14);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.panel-slide-enter-active,
.panel-slide-leave-active { transition: transform .22s ease; }
.panel-slide-enter-from .panel-drawer,
.panel-slide-leave-to .panel-drawer { transform: translateX(100%); }

/* Panel toolbar */
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
  padding: 5px 14px;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  font-size: 12.5px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all .15s;
}

.mark-btn:hover { border-color: #10b981; color: #10b981; }
.mark-btn.completed { border-color: #10b981; background: #f0fdf4; color: #10b981; }

.panel-toolbar-right { display: flex; align-items: center; gap: 2px; }

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

.tb-btn:hover { background: #f1f5f9; color: #0f172a; }
.tb-close:hover { background: #fef2f2; color: #ef4444; }

/* Panel body */
.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
}

/* Task title */
.task-name-wrap { display: flex; }

.task-name-input {
  width: 100%;
  border: none;
  outline: none;
  background: none;
  resize: none;
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  font-family: 'Inter', sans-serif;
  line-height: 1.3;
  overflow: hidden;
}

/* Meta fields */
.panel-meta-fields {
  display: flex;
  flex-direction: column;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
}

.panel-meta-row {
  display: flex;
  align-items: center;
  min-height: 38px;
  border-bottom: 1px solid #f8fafc;
  padding: 0 12px;
}

.panel-meta-row:last-child { border-bottom: none; }

.panel-meta-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  width: 110px;
  flex-shrink: 0;
}

.panel-meta-val { flex: 1; display: flex; align-items: center; }

.assignee-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px 3px 3px;
  border-radius: 20px;
  background: #f1f5f9;
  font-size: 12.5px;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  transition: background .12s;
}

.assignee-chip:hover { background: #e2e8f0; }

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

/* Priority pill */
.priority-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1.5px solid transparent;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all .12s;
}

.prio-high { background: #fef2f2; color: #ef4444; border-color: #fca5a5; }
.prio-medium { background: #fffbeb; color: #d97706; border-color: #fcd34d; }
.prio-low { background: #f0fdf4; color: #16a34a; border-color: #86efac; }
.prio- { background: #f1f5f9; color: #64748b; border-color: #e2e8f0; }

/* Date chip */
.date-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #475569;
  font-size: 12.5px;
}

.date-input-field {
  border: none;
  outline: none;
  background: none;
  font-size: 12.5px;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
}

/* Project chip */
.proj-chip-meta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: #1e293b;
}

.proj-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4f46e5;
  flex-shrink: 0;
}

/* Panel sections */
.panel-section { display: flex; flex-direction: column; gap: 8px; }

.panel-section-title {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  text-transform: uppercase;
  letter-spacing: .04em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.count-badge {
  font-size: 11px;
  color: #64748b;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
  background: #f1f5f9;
  padding: 1px 6px;
  border-radius: 20px;
}

/* Description textarea */
.desc-textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
  resize: vertical;
  outline: none;
  background: #f8fafc;
  transition: border-color .15s;
  line-height: 1.5;
}

.desc-textarea:focus { border-color: #a5b4fc; background: #fff; }

/* Tags */
.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  background: #f8fafc;
  min-height: 38px;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #eef2ff;
  color: #4f46e5;
  border: 1px solid #c7d2fe;
  font-size: 11.5px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 20px;
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  color: #6366f1;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: .7;
  transition: opacity .12s;
}

.tag-remove:hover { opacity: 1; }

.tag-input {
  border: none;
  outline: none;
  background: none;
  font-size: 12px;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
  min-width: 80px;
}

.tag-input::placeholder { color: #94a3b8; }

/* Comments */
.comments-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 12px; }

.comment-row { display: flex; gap: 10px; }

.c-av {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
}

.c-body { flex: 1; min-width: 0; }

.c-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}

.c-author { font-size: 12px; font-weight: 600; color: #0f172a; }
.c-time { font-size: 11px; color: #64748b; flex: 1; }

.c-del {
  opacity: 0;
  transition: opacity .12s;
}

.comment-row:hover .c-del { opacity: 1; }

.c-text { font-size: 12.5px; color: #1e293b; line-height: 1.5; }

/* New comment */
.new-comment { display: flex; gap: 10px; }

.new-comment-wrap {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  background: #fff;
  transition: border-color .15s;
}

.new-comment-wrap:focus-within { border-color: #94a3b8; }

.new-comment-input {
  width: 100%;
  border: none;
  outline: none;
  background: none;
  font-size: 13px;
  color: #1e293b;
  font-family: 'Inter', sans-serif;
  resize: none;
  box-sizing: border-box;
}

.new-comment-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.comment-actions { display: flex; gap: 4px; }

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

.icon-btn-sm:hover { background: #f1f5f9; color: #0f172a; }

.comment-hint { font-size: 11px; color: #94a3b8; }

.btn-post {
  padding: 5px 14px;
  border-radius: 6px;
  border: none;
  background: #4f46e5;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: background .12s;
}

.btn-post:hover:not(:disabled) { background: #4338ca; }
.btn-post:disabled { opacity: .4; cursor: not-allowed; }

/* ── Full page mode ── */
.panel-overlay--full { background: #fff; }
.panel-drawer--full { width: 100vw; max-width: 100vw; }

/* ── Toolbar active state ── */
.tb-active { background: #eef2ff; color: #4f46e5; }

/* ── Three-dot dropdown ── */
.task-dropdown {
  position: absolute; top: 100%; right: 0; z-index: 600;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
  box-shadow: 0 8px 28px rgba(0,0,0,.14); min-width: 260px; padding: 4px;
}
.td-group { padding: 2px 0; }
.td-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }
.td-item {
  display: flex; align-items: center; gap: 9px;
  width: 100%; padding: 8px 12px; border: none; background: none;
  font-size: 13px; color: #1e293b; cursor: pointer;
  border-radius: 7px; font-family: 'Inter', sans-serif; text-align: left;
  transition: background .1s;
}
.td-item:hover { background: #f8fafc; }
.td-item--danger { color: #ef4444; }
.td-item--danger:hover { background: #fef2f2; }
.td-kbd { display: flex; align-items: center; gap: 3px; margin-left: auto; }
.td-kbd kbd {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 1px 5px; border-radius: 4px; border: 1px solid #e2e8f0;
  background: #f8fafc; font-size: 10px; font-family: 'Inter', sans-serif;
  color: #64748b; font-weight: 500; min-width: 22px;
}

/* ── Assignee picker ── */
.assignee-picker-fixed {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.15);
  min-width: 220px;
  padding: 6px;
  max-height: 280px;
  overflow-y: auto;
}
.ap-title { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; padding: 4px 8px 6px; }
.ap-search-wrap { display: flex; align-items: center; gap: 6px; padding: 6px 8px; border-bottom: 1px solid #f1f5f9; margin-bottom: 4px; }
.ap-search { flex: 1; border: none; outline: none; font-size: 12.5px; color: #1e293b; font-family: 'Inter', sans-serif; background: none; }
.ap-search::placeholder { color: #94a3b8; }
.ap-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 7px; cursor: pointer; transition: background .1s; }
.ap-item:hover { background: #f8fafc; }
.ap-item--active { background: #f0fdf4; }
.ap-av { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.ap-av-empty { width: 26px; height: 26px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ap-name { flex: 1; font-size: 12.5px; color: #1e293b; }
.ap-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }
</style>
