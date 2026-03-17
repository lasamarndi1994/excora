<template>
  <div class="board-page" @click="closeAllMenus">
    <ProjectHeader active-tab="board" />

    <!-- Sprint banner -->
    <div class="sprint-banner">
      <div class="sb-left">
        <span class="sb-sprint-tag">SPRINT</span>
        <span class="sb-name">{{ activeSprint?.name ?? 'No active sprint' }}</span>
        <span v-if="activeSprint" class="sb-dates">{{ activeSprint.startDate }} – {{ activeSprint.endDate }}</span>
        <span class="sb-count">{{ filteredIssues.length }} issues</span>
        <span v-if="doneCount > 0" class="sb-done">{{ doneCount }} done</span>
      </div>
    </div>

    <!-- Controls bar -->
    <div class="board-bar">
      <div class="bar-left">
        <!-- Search -->
        <div class="search-wrap">
          <svg class="search-ico" width="13" height="13" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#94a3b8" stroke-width="2"/>
            <path d="m21 21-4.35-4.35" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <input class="search-inp" v-model="searchQuery" placeholder="Search board" @click.stop />
        </div>

        <!-- Assignee avatars -->
        <div class="avatars">
          <div v-for="(user, i) in store.users.slice(0, 5)" :key="user.id"
            class="av-wrap" :title="user.name"
            :style="{ marginLeft: i > 0 ? '-6px' : '0', zIndex: 5 - i }"
            :class="{ 'av-active': assigneeFilter.includes(user.id) }"
            @click.stop="toggleAssigneeFilter(user.id)">
            <img :src="user.avatar" class="av-img" />
          </div>
        </div>

        <!-- Filter button -->
        <div class="dd-wrap" ref="filterWrapRef">
          <button class="bar-btn" :class="{ active: hasFilters }" @click.stop="toggleDd('filter')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Filter
            <span v-if="activeFilterCount > 0" class="bar-badge">{{ activeFilterCount }}</span>
          </button>

          <!-- Filter panel -->
          <div v-if="openDd === 'filter'" class="filter-panel" @click.stop>
            <div class="fp-sidebar">
              <div v-for="cat in filterCategories" :key="cat.value"
                class="fp-cat" :class="{ active: activeFilterCat === cat.value }"
                @click="activeFilterCat = cat.value">
                {{ cat.label }}
              </div>
            </div>
            <div class="fp-body">
              <!-- Assignee -->
              <template v-if="activeFilterCat === 'assignee'">
                <div class="fp-title">Assignee</div>
                <div v-for="u in store.users" :key="u.id" class="fp-check-row" @click.stop="toggleAssigneeFilter(u.id)">
                  <span class="fp-checkbox" :class="{ checked: assigneeFilter.includes(u.id) }">
                    <svg v-if="assigneeFilter.includes(u.id)" width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>
                  </span>
                  <img :src="u.avatar" class="fp-av" />
                  <span>{{ u.name }}</span>
                </div>
              </template>
              <!-- Type -->
              <template v-else-if="activeFilterCat === 'type'">
                <div class="fp-title">Work type</div>
                <div v-for="t in issueTypes" :key="t" class="fp-check-row" @click.stop="toggleTypeFilter(t)">
                  <span class="fp-checkbox" :class="{ checked: typeFilter.includes(t) }">
                    <svg v-if="typeFilter.includes(t)" width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>
                  </span>
                  <span class="fp-type-icon" v-html="typeIcon(t)"></span>
                  <span>{{ t }}</span>
                </div>
              </template>
              <!-- Priority -->
              <template v-else-if="activeFilterCat === 'priority'">
                <div class="fp-title">Priority</div>
                <div v-for="p in ['High','Medium','Low']" :key="p" class="fp-check-row" @click.stop="togglePriorityFilter(p)">
                  <span class="fp-checkbox" :class="{ checked: priorityFilter.includes(p) }">
                    <svg v-if="priorityFilter.includes(p)" width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>
                  </span>
                  <span class="fp-prio-dot" :style="{ background: prioColor(p) }"></span>
                  <span>{{ p }}</span>
                </div>
              </template>
              <!-- Epic -->
              <template v-else-if="activeFilterCat === 'epic'">
                <div class="fp-title">Epic</div>
                <div v-for="e in store.epics" :key="e.id" class="fp-check-row" @click.stop="toggleEpicFilter(e.id)">
                  <span class="fp-checkbox" :class="{ checked: epicFilter.includes(e.id) }">
                    <svg v-if="epicFilter.includes(e.id)" width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>
                  </span>
                  <span class="fp-epic-dot" :style="{ background: e.color }"></span>
                  <span>{{ e.name }}</span>
                </div>
              </template>
              <!-- Sprint -->
              <template v-else>
                <div class="fp-title">Sprint</div>
                <div v-for="s in store.sprints" :key="s.id" class="fp-check-row" @click.stop="toggleSprintFilter(s.id)">
                  <span class="fp-checkbox" :class="{ checked: sprintFilter.includes(s.id) }">
                    <svg v-if="sprintFilter.includes(s.id)" width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>
                  </span>
                  <span>{{ s.name }}</span>
                  <span class="fp-sprint-status" :class="'sprint-'+s.status.toLowerCase()">{{ s.status }}</span>
                </div>
              </template>
              <div class="fp-footer">
                <button class="fp-clear" @click="clearFilters">Clear all</button>
                <span class="fp-hint">Press <kbd>Shift</kbd>+<kbd>F</kbd> to open</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Active filter chips -->
        <template v-if="hasFilters">
          <span v-for="uid in assigneeFilter" :key="'a'+uid" class="fchip">
            {{ store.users.find(u=>u.id===uid)?.name }}
            <button class="fchip-x" @click.stop="toggleAssigneeFilter(uid)">×</button>
          </span>
          <span v-for="t in typeFilter" :key="'t'+t" class="fchip fchip--type">
            {{ t }}<button class="fchip-x" @click.stop="toggleTypeFilter(t)">×</button>
          </span>
          <span v-for="p in priorityFilter" :key="'p'+p" class="fchip fchip--prio">
            {{ p }}<button class="fchip-x" @click.stop="togglePriorityFilter(p)">×</button>
          </span>
          <span v-for="eid in epicFilter" :key="'e'+eid" class="fchip fchip--epic">
            {{ store.epics.find(e=>e.id===eid)?.name }}<button class="fchip-x" @click.stop="toggleEpicFilter(eid)">×</button>
          </span>
          <button class="bar-btn bar-btn--clear" @click.stop="clearFilters">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            Clear
          </button>
        </template>
      </div>

      <div class="bar-right">
        <!-- Complete Sprint -->
        <button class="bar-btn bar-btn--primary" @click.stop="showCompleteDialog = true">Complete Sprint</button>

        <!-- Group by -->
        <div class="dd-wrap">
          <button class="bar-btn" @click.stop="toggleDd('group')">
            Group by
            <span v-if="groupBy !== 'None'" style="font-weight:700;margin-left:3px">{{ groupBy }}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <div v-if="openDd === 'group'" class="dd-panel dd-panel-right" @click.stop>
            <div class="dd-title">Group by</div>
            <div v-for="g in ['None','Assignee','Priority','Epic']" :key="g"
              class="dd-radio-row" :class="{ active: groupBy === g }"
              @click="groupBy = g; openDd = null">
              <span class="dd-radio" :class="{ checked: groupBy === g }"></span>{{ g }}
            </div>
          </div>
        </div>

        <!-- View toggle -->
        <button class="bar-icon-btn" title="View options" @click.stop="toggleDd('view')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
        </button>

        <!-- Sort -->
        <div class="dd-wrap">
          <button class="bar-icon-btn" title="Sort" @click.stop="toggleDd('sort')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="15" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="9" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <div v-if="openDd === 'sort'" class="dd-panel dd-panel-right" @click.stop style="min-width:180px">
            <div class="dd-title">Sort by</div>
            <div v-for="s in sortOptions" :key="s.value" class="dd-radio-row" :class="{ active: sortBy === s.value }" @click="sortBy = s.value; openDd = null">
              <span class="dd-radio" :class="{ checked: sortBy === s.value }"></span>{{ s.label }}
            </div>
          </div>
        </div>

        <!-- More / Settings -->
        <div class="dd-wrap">
          <button class="bar-icon-btn" title="More options" @click.stop="toggleDd('more')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/><circle cx="5" cy="12" r="1.5" fill="currentColor"/></svg>
          </button>
          <div v-if="openDd === 'more'" class="dd-panel dd-panel-right" @click.stop style="min-width:200px">
            <div class="dd-title">Board settings</div>
            <div class="dd-check-row" @click.stop="showEpicLabels = !showEpicLabels">
              <span class="dd-checkbox" :class="{ checked: showEpicLabels }">
                <svg v-if="showEpicLabels" width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>
              </span>
              Show epic labels
            </div>
            <div class="dd-check-row" @click.stop="showPriorityBadge = !showPriorityBadge">
              <span class="dd-checkbox" :class="{ checked: showPriorityBadge }">
                <svg v-if="showPriorityBadge" width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>
              </span>
              Show priority badge
            </div>
            <div class="dd-divider"></div>
            <div class="dd-check-row" @click.stop="showSubtaskProgress = !showSubtaskProgress">
              <span class="dd-checkbox" :class="{ checked: showSubtaskProgress }">
                <svg v-if="showSubtaskProgress" width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>
              </span>
              Show subtask progress
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Board body -->
    <div class="board-body">
      <div class="board-scroll">

        <!-- GROUP BY: NONE — flat columns -->
        <template v-if="groupBy === 'None'">
          <div v-for="col in boardColumns" :key="col.id" class="board-col">
            <!-- Column header -->
            <div class="col-hd">
              <div class="col-hd-left">
                <span class="col-dot" :style="{ background: col.color }"></span>
                <span class="col-name">{{ col.title }}</span>
                <span class="col-cnt">{{ getColIssues(col).length }}</span>
              </div>
              <div class="col-hd-right">
                <button class="col-icon-btn" title="Add issue" @click.stop="openCreateIssue(col.id)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                </button>
                <div style="position:relative">
                  <button class="col-icon-btn" @click.stop="toggleColMenu(col.id)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>
                  </button>
                  <div v-if="colMenuOpen === col.id" class="col-dropdown" @click.stop>
                    <button class="cdd-item" @click="openCreateIssue(col.id); colMenuOpen=null">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                      Add issue
                    </button>
                    <button class="cdd-item" @click="startRenameCol(col); colMenuOpen=null">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                      Rename
                    </button>
                    <div class="cdd-divider"></div>
                    <button v-if="!col.isDefault" class="cdd-item cdd-item--danger" @click="removeColumn(col.id); colMenuOpen=null">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg>
                      Delete column
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rename input -->
            <div v-if="renamingColId === col.id" class="col-rename-wrap" @click.stop>
              <input class="col-rename-input" v-model="renameValue" ref="renameInputRef"
                @keydown.enter="confirmRename(col)"
                @keydown.esc="renamingColId = null"
                @blur="confirmRename(col)" />
            </div>

            <!-- Drop zone -->
            <div class="col-body"
              :class="{ 'col-body--over': dragOver === col.id }"
              @dragover.prevent="onColDragOver(col.id)"
              @dragleave="onColDragLeave(col.id)"
              @drop.prevent="onDrop(col.id, $event)">

              <template v-for="issue in getColIssues(col)" :key="issue.id">
                <div v-if="dropTarget.colId === col.id && dropTarget.beforeId === issue.id" class="drop-line"></div>
                <div class="issue-card"
                  :class="{ 'issue-card--dragging': dragId === issue.id }"
                  draggable="true"
                  @dragstart="onDragStart(issue, col.id, $event)"
                  @dragend="onDragEnd"
                  @dragover.prevent.stop="onCardDragOver(col.id, issue.id, $event)"
                  @click.stop="openIssueDetails(issue)">
                  <div v-if="showEpicLabels && issue.epicLink" class="ic-epic"
                    :style="{ background: epicColor(issue.epicLink)+'22', color: epicColor(issue.epicLink) }">
                    {{ epicName(issue.epicLink) }}
                  </div>
                  <div class="ic-summary">{{ issue.summary }}</div>
                  <div class="ic-footer">
                    <div class="ic-left">
                      <span class="ic-type" v-html="typeIcon(issue.type)"></span>
                      <span class="ic-key">{{ issue.key }}</span>
                      <span v-if="showPriorityBadge" class="ic-prio"
                        :style="{ background: prioColor(issue.priority)+'22', color: prioColor(issue.priority) }">
                        {{ issue.priority }}
                      </span>
                    </div>
                    <div class="ic-assignees">
                      <img v-for="(a,i) in issue.assignees.slice(0,2)" :key="a.id"
                        :src="a.avatar" :title="a.name" class="ic-av"
                        :style="{ marginLeft: i>0?'-5px':'0', zIndex: 2-i }" />
                    </div>
                  </div>
                </div>
              </template>
              <div v-if="dropTarget.colId === col.id && dropTarget.beforeId === null" class="drop-line"></div>

              <!-- Inline create -->
              <div v-if="inlineCreateCol === col.id" class="inline-create" @click.stop>
                <input class="ic-input" v-model="inlineCreateText" ref="inlineInputRef"
                  placeholder="Issue summary…"
                  @keydown.enter="confirmInlineCreate(col)"
                  @keydown.esc="inlineCreateCol = null" />
                <div class="ic-type-row">
                  <select class="ic-select" v-model="inlineCreateType">
                    <option v-for="t in issueTypes" :key="t" :value="t">{{ t }}</option>
                  </select>
                  <select class="ic-select" v-model="inlineCreatePriority">
                    <option v-for="p in ['High','Medium','Low']" :key="p" :value="p">{{ p }}</option>
                  </select>
                </div>
                <div class="ic-actions">
                  <button class="ic-btn-confirm" @click.stop="confirmInlineCreate(col)">Create</button>
                  <button class="ic-btn-cancel" @click.stop="inlineCreateCol = null">Cancel</button>
                </div>
              </div>

              <button class="create-btn" @click.stop="openCreateIssue(col.id)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                Create issue
              </button>
            </div>
          </div>
        </template>

        <!-- GROUP BY: ASSIGNEE / PRIORITY / EPIC — swimlanes -->
        <template v-else>
          <div class="swimlane-board">
            <!-- Column headers row -->
            <div class="swimlane-col-headers">
              <div class="swimlane-row-label-spacer"></div>
              <div v-for="col in boardColumns" :key="col.id" class="swimlane-col-hd">
                <span class="col-dot" :style="{ background: col.color }"></span>
                <span class="col-name">{{ col.title }}</span>
              </div>
            </div>
            <!-- Swimlane rows -->
            <div v-for="group in groupedView" :key="group.key" class="swimlane-row">
              <div class="swimlane-row-label" @click="toggleSwimlane(group.key)">
                <svg class="sl-arrow" :class="{ collapsed: collapsedSwimlanes.includes(group.key) }" width="11" height="11" viewBox="0 0 24 24" fill="none"><polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                <img v-if="group.avatar" :src="group.avatar" class="sl-av" />
                <span v-if="group.color" class="sl-dot" :style="{ background: group.color }"></span>
                <span class="sl-label">{{ group.label }}</span>
                <span class="sl-cnt">{{ group.totalCount }}</span>
              </div>
              <template v-if="!collapsedSwimlanes.includes(group.key)">
                <div v-for="col in boardColumns" :key="col.id" class="swimlane-col-body"
                  :class="{ 'col-body--over': dragOver === col.id + group.key }"
                  @dragover.prevent="onColDragOver(col.id + group.key)"
                  @dragleave="onColDragLeave(col.id + group.key)"
                  @drop.prevent="onDrop(col.id, $event)">
                  <template v-for="issue in getSwimlaneColIssues(group, col)" :key="issue.id">
                    <div v-if="dropTarget.colId === col.id+group.key && dropTarget.beforeId === issue.id" class="drop-line"></div>
                    <div class="issue-card"
                      :class="{ 'issue-card--dragging': dragId === issue.id }"
                      draggable="true"
                      @dragstart="onDragStart(issue, col.id, $event)"
                      @dragend="onDragEnd"
                      @dragover.prevent.stop="onCardDragOver(col.id+group.key, issue.id, $event)"
                      @click.stop="openIssueDetails(issue)">
                      <div class="ic-summary">{{ issue.summary }}</div>
                      <div class="ic-footer">
                        <div class="ic-left">
                          <span class="ic-type" v-html="typeIcon(issue.type)"></span>
                          <span class="ic-key">{{ issue.key }}</span>
                        </div>
                        <div class="ic-assignees">
                          <img v-for="(a,i) in issue.assignees.slice(0,2)" :key="a.id" :src="a.avatar" :title="a.name" class="ic-av" :style="{ marginLeft: i>0?'-5px':'0' }" />
                        </div>
                      </div>
                    </div>
                  </template>
                  <div v-if="dropTarget.colId === col.id+group.key && dropTarget.beforeId === null" class="drop-line"></div>
                  <button class="create-btn" @click.stop="openCreateIssue(col.id)">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                    Create
                  </button>
                </div>
              </template>
              <template v-else>
                <div v-for="col in boardColumns" :key="col.id" class="swimlane-col-body swimlane-col-collapsed"></div>
              </template>
            </div>
          </div>
        </template>

        <!-- Add column -->
        <button class="add-col-btn" @click.stop="addColumn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          Add column
        </button>
      </div>
    </div>

    <!-- Complete Sprint dialog -->
    <Teleport to="body">
      <div v-if="showCompleteDialog" class="modal-overlay" @click.self="showCompleteDialog = false">
        <div class="modal-box" @click.stop>
          <div class="modal-title">Complete Sprint</div>
          <div class="modal-body">
            <p>Complete <strong>{{ activeSprint?.name }}</strong>?</p>
            <p class="modal-sub">{{ openIssueCount }} open {{ openIssueCount === 1 ? 'issue' : 'issues' }} will be moved to the backlog.</p>
            <p class="modal-sub">{{ doneCount }} {{ doneCount === 1 ? 'issue' : 'issues' }} completed.</p>
          </div>
          <div class="modal-actions">
            <button class="modal-btn-cancel" @click="showCompleteDialog = false">Cancel</button>
            <button class="modal-btn-confirm" @click="completeSprint">Complete Sprint</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <transition name="toast-fade">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </transition>

    <!-- Issue Details Dialog (keep existing layout) -->
    <IssueDetailsDialog v-model="isDetailsOpen" :issue="selectedIssue" />

    <!-- Create Issue Drawer (keep existing layout) -->
    <CreateIssueDrawer v-model="isCreateDrawerOpen" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import type { Issue } from '@/stores/taskStore'
import ProjectHeader from '@/components/ProjectHeader.vue'
import IssueDetailsDialog from '@/components/IssueDetailsDialog.vue'
import CreateIssueDrawer from '@/components/CreateIssueDrawer.vue'

const store = useTaskStore()

// ── Dialogs ──
const isDetailsOpen     = ref(false)
const isCreateDrawerOpen = ref(false)
const selectedIssue     = ref<Issue | null>(null)

function openIssueDetails(issue: Issue) {
  selectedIssue.value = issue
  isDetailsOpen.value = true
}
function openCreateIssue(_colId?: string) {
  isCreateDrawerOpen.value = true
}

// ── Filters ──
const searchQuery    = ref('')
const assigneeFilter = ref<string[]>([])
const epicFilter     = ref<string[]>([])
const typeFilter     = ref<string[]>([])
const priorityFilter = ref<string[]>([])
const sprintFilter   = ref<string[]>([])
const groupBy        = ref('None')
const sortBy         = ref('default')
const openDd         = ref<string | null>(null)
const colMenuOpen    = ref<string | null>(null)
const activeFilterCat = ref('sprint')

// Board settings
const showEpicLabels     = ref(true)
const showPriorityBadge  = ref(true)
const showSubtaskProgress = ref(false)

const issueTypes = ['Task', 'Bug', 'Story', 'Epic'] as const

const filterCategories = [
  { label: 'Sprint',    value: 'sprint'   },
  { label: 'Assignee',  value: 'assignee' },
  { label: 'Work type', value: 'type'     },
  { label: 'Priority',  value: 'priority' },
  { label: 'Epic',      value: 'epic'     },
]

const sortOptions = [
  { label: 'Default',    value: 'default'  },
  { label: 'Priority',   value: 'priority' },
  { label: 'Created',    value: 'created'  },
  { label: 'Updated',    value: 'updated'  },
  { label: 'Assignee',   value: 'assignee' },
]

const activeFilterCount = computed(() =>
  assigneeFilter.value.length + epicFilter.value.length +
  typeFilter.value.length + priorityFilter.value.length + sprintFilter.value.length
)
const hasFilters = computed(() => !!searchQuery.value || activeFilterCount.value > 0)

function toggleDd(name: string) { openDd.value = openDd.value === name ? null : name }
function toggleColMenu(id: string) { colMenuOpen.value = colMenuOpen.value === id ? null : id }
function closeAllMenus() { openDd.value = null; colMenuOpen.value = null }

function toggleAssigneeFilter(id: string) {
  const i = assigneeFilter.value.indexOf(id)
  i === -1 ? assigneeFilter.value.push(id) : assigneeFilter.value.splice(i, 1)
}
function toggleEpicFilter(id: string) {
  const i = epicFilter.value.indexOf(id)
  i === -1 ? epicFilter.value.push(id) : epicFilter.value.splice(i, 1)
}
function toggleTypeFilter(t: string) {
  const i = typeFilter.value.indexOf(t)
  i === -1 ? typeFilter.value.push(t) : typeFilter.value.splice(i, 1)
}
function togglePriorityFilter(p: string) {
  const i = priorityFilter.value.indexOf(p)
  i === -1 ? priorityFilter.value.push(p) : priorityFilter.value.splice(i, 1)
}
function toggleSprintFilter(id: string) {
  const i = sprintFilter.value.indexOf(id)
  i === -1 ? sprintFilter.value.push(id) : sprintFilter.value.splice(i, 1)
}
function clearFilters() {
  searchQuery.value = ''; assigneeFilter.value = []; epicFilter.value = []
  typeFilter.value = []; priorityFilter.value = []; sprintFilter.value = []
}

const filteredIssues = computed(() => {
  let list = [...store.issues]
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(i => i.summary.toLowerCase().includes(q) || i.key.toLowerCase().includes(q))
  }
  if (assigneeFilter.value.length) list = list.filter(i => i.assignees.some(a => assigneeFilter.value.includes(a.id)))
  if (epicFilter.value.length)     list = list.filter(i => !!i.epicLink && epicFilter.value.includes(i.epicLink))
  if (typeFilter.value.length)     list = list.filter(i => typeFilter.value.includes(i.type))
  if (priorityFilter.value.length) list = list.filter(i => priorityFilter.value.includes(i.priority))
  if (sprintFilter.value.length)   list = list.filter(i => !!i.sprintId && sprintFilter.value.includes(i.sprintId))
  // Sort
  if (sortBy.value === 'priority') {
    const order = { High: 0, Medium: 1, Low: 2 }
    list.sort((a, b) => (order[a.priority] ?? 1) - (order[b.priority] ?? 1))
  } else if (sortBy.value === 'assignee') {
    list.sort((a, b) => (a.assignees[0]?.name ?? '').localeCompare(b.assignees[0]?.name ?? ''))
  }
  return list
})

// ── Columns ──
interface BoardCol { id: string; title: string; color: string; isDefault: boolean; status?: Issue['status'] }
const customColumns = reactive<BoardCol[]>([])

const boardColumns = computed<BoardCol[]>(() => [
  { id: 'todo',       title: 'TO DO',       color: '#94a3b8', isDefault: true, status: 'TODO' },
  { id: 'inprogress', title: 'IN PROGRESS', color: '#4f46e5', isDefault: true, status: 'IN_PROGRESS' },
  { id: 'done',       title: 'DONE',        color: '#10b981', isDefault: true, status: 'DONE' },
  ...customColumns,
])

function getColIssues(col: BoardCol): Issue[] {
  if (!col.isDefault) return []
  return filteredIssues.value.filter(i => i.status === col.status)
}

function addColumn() {
  customColumns.push({ id: `col-${Date.now()}`, title: 'NEW COLUMN', color: '#cbd5e1', isDefault: false })
}
function removeColumn(id: string) {
  const idx = customColumns.findIndex(c => c.id === id)
  if (idx !== -1) customColumns.splice(idx, 1)
}

// ── Column rename ──
const renamingColId  = ref<string | null>(null)
const renameValue    = ref('')
const renameInputRef = ref<HTMLInputElement | null>(null)

function startRenameCol(col: BoardCol) {
  renamingColId.value = col.id
  renameValue.value = col.title
  nextTick(() => renameInputRef.value?.focus())
}
function confirmRename(col: BoardCol) {
  const v = renameValue.value.trim()
  if (v) {
    const c = customColumns.find(c => c.id === col.id)
    if (c) c.title = v.toUpperCase()
  }
  renamingColId.value = null
}

// ── Sprint ──
const activeSprint   = computed(() => store.sprints.find(s => s.status === 'Active') ?? store.sprints[0])
const doneCount      = computed(() => filteredIssues.value.filter(i => i.status === 'DONE').length)
const openIssueCount = computed(() => filteredIssues.value.filter(i => i.status !== 'DONE').length)
const showCompleteDialog = ref(false)

function completeSprint() {
  store.issues.forEach(i => { if (i.status !== 'DONE') i.status = 'TODO' })
  showCompleteDialog.value = false
  showToast('Sprint completed! Open issues moved to backlog.')
}

// ── Group by ──
interface SwimlaneGroup {
  key: string; label: string; avatar?: string; color?: string
  issues: Issue[]; totalCount: number
}
const collapsedSwimlanes = ref<string[]>([])
function toggleSwimlane(key: string) {
  const i = collapsedSwimlanes.value.indexOf(key)
  i === -1 ? collapsedSwimlanes.value.push(key) : collapsedSwimlanes.value.splice(i, 1)
}

const groupedView = computed<SwimlaneGroup[]>(() => {
  const issues = filteredIssues.value
  if (groupBy.value === 'Assignee') {
    const map = new Map<string, SwimlaneGroup>()
    store.users.forEach(u => map.set(u.id, { key: u.id, label: u.name, avatar: u.avatar, issues: [], totalCount: 0 }))
    map.set('unassigned', { key: 'unassigned', label: 'Unassigned', issues: [], totalCount: 0 })
    issues.forEach(issue => {
      if (!issue.assignees.length) { map.get('unassigned')!.issues.push(issue) }
      else issue.assignees.forEach(a => { if (map.has(a.id)) map.get(a.id)!.issues.push(issue) })
    })
    return [...map.values()].map(g => ({ ...g, totalCount: g.issues.length }))
  }
  if (groupBy.value === 'Priority') {
    return ['High', 'Medium', 'Low'].map(p => {
      const gi = issues.filter(i => i.priority === p)
      return { key: p, label: p, color: prioColor(p), issues: gi, totalCount: gi.length }
    })
  }
  if (groupBy.value === 'Epic') {
    const groups: SwimlaneGroup[] = store.epics.map(e => ({
      key: e.id, label: e.name, color: e.color,
      issues: issues.filter(i => i.epicLink === e.id),
      totalCount: issues.filter(i => i.epicLink === e.id).length,
    }))
    const noEpic = issues.filter(i => !i.epicLink)
    groups.push({ key: 'no-epic', label: 'No Epic', issues: noEpic, totalCount: noEpic.length })
    return groups
  }
  return []
})

function getSwimlaneColIssues(group: SwimlaneGroup, col: BoardCol): Issue[] {
  if (!col.isDefault) return []
  return group.issues.filter(i => i.status === col.status)
}

// ── Drag & Drop ──
const dragId   = ref<string | null>(null)
const dragFrom = ref<string | null>(null)
const dragOver = ref<string | null>(null)
const dropTarget = reactive({ colId: '', beforeId: null as string | null })

function onDragStart(issue: Issue, colId: string, e: DragEvent) {
  dragId.value = issue.id; dragFrom.value = colId
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('text/plain', issue.id)
}
function onDragEnd() {
  dragId.value = null; dragFrom.value = null; dragOver.value = null
  dropTarget.colId = ''; dropTarget.beforeId = null
}
function onColDragOver(colId: string) {
  dragOver.value = colId; dropTarget.colId = colId; dropTarget.beforeId = null
}
function onColDragLeave(colId: string) {
  if (dragOver.value === colId) { dragOver.value = null; dropTarget.colId = '' }
}
function onCardDragOver(colId: string, issueId: string, e: DragEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  dropTarget.colId = colId
  if (e.clientY < rect.top + rect.height / 2) {
    dropTarget.beforeId = issueId
  } else {
    const baseColId = boardColumns.value.find(c => colId.startsWith(c.id))?.id ?? colId
    const col = boardColumns.value.find(c => c.id === baseColId)
    if (!col) return
    const colIssues = filteredIssues.value.filter(i => i.status === col.status)
    const idx = colIssues.findIndex(i => i.id === issueId)
    dropTarget.beforeId = colIssues[idx + 1]?.id ?? null
  }
}
function onDrop(colId: string, e: DragEvent) {
  const issueId = e.dataTransfer!.getData('text/plain')
  const issue = store.issues.find(i => i.id === issueId)
  const col = boardColumns.value.find(c => c.id === colId)
  if (!issue || !col || !col.isDefault || !col.status) { onDragEnd(); return }
  store.moveIssue(issueId, col.status)
  if (dragFrom.value === colId && dropTarget.beforeId) {
    const colIssues = store.issues.filter(i => i.status === col.status)
    const fromIdx = colIssues.findIndex(i => i.id === issueId)
    const toIdx   = colIssues.findIndex(i => i.id === dropTarget.beforeId)
    if (fromIdx !== -1 && toIdx !== -1) {
      const sfi = store.issues.findIndex(i => i.id === issueId)
      const sti = store.issues.findIndex(i => i.id === dropTarget.beforeId)
      const [moved] = store.issues.splice(sfi, 1)
      if (moved) store.issues.splice(sti > sfi ? sti - 1 : sti, 0, moved)
    }
  }
  onDragEnd()
}

// ── Inline create ──
const inlineCreateCol      = ref<string | null>(null)
const inlineCreateText     = ref('')
const inlineCreateType     = ref<Issue['type']>('Task')
const inlineCreatePriority = ref<Issue['priority']>('Medium')
const inlineInputRef       = ref<HTMLInputElement | null>(null)

function startInlineCreate(colId: string) {
  inlineCreateCol.value = colId; inlineCreateText.value = ''
  nextTick(() => inlineInputRef.value?.focus())
}
function confirmInlineCreate(col: BoardCol) {
  const summary = inlineCreateText.value.trim()
  if (!summary) { inlineCreateCol.value = null; return }
  store.createIssue({
    summary, status: col.status ?? 'TODO',
    type: inlineCreateType.value, priority: inlineCreatePriority.value,
    assignees: [], description: '',
  })
  inlineCreateText.value = ''
  showToast('Issue created')
}

// ── Helpers ──
function epicColor(id?: string) { return store.epics.find(e => e.id === id)?.color ?? '#94a3b8' }
function epicName(id?: string)  { return store.epics.find(e => e.id === id)?.name ?? '' }
function prioColor(p: string) {
  return p === 'High' ? '#ef4444' : p === 'Medium' ? '#f59e0b' : '#10b981'
}
function typeIcon(t: string) {
  if (t === 'Bug')   return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="#ef4444"/><path d="M12 8v4M12 16h.01" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>'
  if (t === 'Story') return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" fill="#10b981"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  if (t === 'Epic')  return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" fill="#a855f7"/><path d="M13 3l-5 9h5l-1 9 7-11h-5l1-7z" fill="#fff"/></svg>'
  return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" fill="#4f46e5"/><path d="M8 12h8M8 8h8M8 16h5" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>'
}

// ── Toast ──
const toast = ref('')
let toastTimer: ReturnType<typeof setTimeout>
function showToast(msg: string) {
  toast.value = msg; clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 2500)
}

// ── Keyboard shortcuts ──
function onKeydown(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement).tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
  if (e.key === 'Escape') { openDd.value = null; colMenuOpen.value = null }
  if ((e.key === 'c' || e.key === 'C') && !e.metaKey && !e.ctrlKey) openCreateIssue()
  if (e.shiftKey && (e.key === 'f' || e.key === 'F')) { e.preventDefault(); toggleDd('filter') }
}
onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
*, *::before, *::after { box-sizing: border-box; }
.board-page { display: flex; flex-direction: column; height: 100%; background: #fff; font-family: 'Inter', sans-serif; overflow: hidden; }

/* Sprint banner */
.sprint-banner { display: flex; align-items: center; justify-content: space-between; padding: 6px 16px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; }
.sb-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.sb-sprint-tag { font-size: 10px; font-weight: 800; letter-spacing: .08em; color: #94a3b8; text-transform: uppercase; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; }
.sb-name { font-size: 13px; font-weight: 700; color: #0f172a; }
.sb-dates { font-size: 11.5px; color: #94a3b8; }
.sb-count { font-size: 11.5px; background: #e2e8f0; color: #64748b; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
.sb-done  { font-size: 11.5px; background: #dcfce7; color: #16a34a; padding: 2px 8px; border-radius: 20px; font-weight: 600; }

/* Controls bar */
.board-bar { display: flex; align-items: center; justify-content: space-between; padding: 7px 16px; border-bottom: 1px solid #e2e8f0; background: #fff; flex-shrink: 0; gap: 8px; flex-wrap: wrap; }
.bar-left, .bar-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

.search-wrap { position: relative; display: flex; align-items: center; }
.search-ico  { position: absolute; left: 8px; pointer-events: none; }
.search-inp  { border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 10px 5px 28px; font-size: 12.5px; font-family: 'Inter', sans-serif; color: #1e293b; background: #fff; outline: none; width: 155px; transition: border-color .15s; }
.search-inp:focus { border-color: #4f46e5; }

.avatars { display: flex; align-items: center; }
.av-wrap  { width: 26px; height: 26px; border-radius: 50%; border: 2px solid #fff; cursor: pointer; overflow: hidden; transition: transform .15s, box-shadow .15s; flex-shrink: 0; }
.av-wrap:hover { transform: scale(1.1); }
.av-wrap.av-active { box-shadow: 0 0 0 2px #4f46e5; }
.av-img { width: 100%; height: 100%; object-fit: cover; }

.bar-btn { display: inline-flex; align-items: center; gap: 5px; border: 1px solid #e2e8f0; border-radius: 6px; padding: 5px 10px; font-size: 12.5px; font-weight: 500; color: #475569; background: #fff; cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap; transition: background .12s, border-color .12s; }
.bar-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
.bar-btn.active { border-color: #4f46e5; color: #4f46e5; background: #eef2ff; }
.bar-btn--primary { background: #4f46e5; color: #fff; border-color: #4f46e5; font-weight: 600; }
.bar-btn--primary:hover { background: #4338ca; }
.bar-btn--clear { color: #ef4444; border-color: #fca5a5; padding: 4px 8px; }
.bar-btn--clear:hover { background: #fef2f2; }
.bar-badge { background: #4f46e5; color: #fff; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 20px; }
.bar-icon-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background: none; color: #64748b; cursor: pointer; border-radius: 5px; transition: background .12s; }
.bar-icon-btn:hover { background: #f1f5f9; color: #475569; }

/* Filter chips */
.fchip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px 3px 10px; border-radius: 20px; background: #eef2ff; color: #4f46e5; border: 1px solid #c7d2fe; font-size: 11.5px; font-weight: 500; }
.fchip--epic { background: #f5f3ff; color: #7c3aed; border-color: #ddd6fe; }
.fchip--type { background: #f0fdf4; color: #16a34a; border-color: #86efac; }
.fchip--prio { background: #fff7ed; color: #c2410c; border-color: #fed7aa; }
.fchip-x { border: none; background: none; color: inherit; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; opacity: .7; }
.fchip-x:hover { opacity: 1; }

/* Filter panel */
.dd-wrap { position: relative; }
.filter-panel { position: absolute; top: calc(100% + 6px); left: 0; z-index: 600; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,.14); display: flex; min-width: 460px; overflow: hidden; }
.fp-sidebar { width: 160px; border-right: 1px solid #f1f5f9; padding: 8px; background: #f8fafc; flex-shrink: 0; }
.fp-cat { padding: 7px 10px; border-radius: 7px; font-size: 12.5px; font-weight: 500; color: #64748b; cursor: pointer; transition: background .1s, color .1s; }
.fp-cat:hover { background: #e2e8f0; color: #1e293b; }
.fp-cat.active { background: #eef2ff; color: #4f46e5; font-weight: 600; }
.fp-body { flex: 1; padding: 12px; display: flex; flex-direction: column; gap: 2px; min-height: 220px; }
.fp-title { font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; padding: 2px 6px 8px; }
.fp-check-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 7px; cursor: pointer; font-size: 12.5px; color: #374151; transition: background .1s; user-select: none; }
.fp-check-row:hover { background: #f8fafc; }
.fp-checkbox { width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid #cbd5e1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .12s; }
.fp-checkbox.checked { background: #4f46e5; border-color: #4f46e5; }
.fp-av { width: 20px; height: 20px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.fp-prio-dot, .fp-epic-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.fp-type-icon { display: flex; align-items: center; }
.fp-sprint-status { margin-left: auto; font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 20px; background: #e2e8f0; color: #64748b; }
.fp-sprint-status.sprint-active { background: #dcfce7; color: #16a34a; }
.fp-sprint-status.sprint-completed { background: #f1f5f9; color: #94a3b8; }
.fp-footer { margin-top: auto; padding-top: 10px; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
.fp-clear { border: none; background: none; font-size: 12px; color: #ef4444; cursor: pointer; font-family: 'Inter', sans-serif; padding: 4px 6px; border-radius: 5px; }
.fp-clear:hover { background: #fef2f2; }
.fp-hint { font-size: 11px; color: #94a3b8; }

/* Generic dropdown panel */
.dd-panel { position: absolute; top: calc(100% + 6px); left: 0; z-index: 500; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.13); min-width: 190px; padding: 6px; }
.dd-panel-right { left: auto; right: 0; }
.dd-title { font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; padding: 4px 8px 6px; }
.dd-radio-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 7px; cursor: pointer; font-size: 12.5px; color: #374151; transition: background .1s; }
.dd-radio-row:hover, .dd-radio-row.active { background: #f8fafc; }
.dd-radio { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid #cbd5e1; flex-shrink: 0; transition: all .12s; }
.dd-radio.checked { border-color: #4f46e5; border-width: 4px; }
.dd-check-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 7px; cursor: pointer; font-size: 12.5px; color: #374151; transition: background .1s; user-select: none; }
.dd-check-row:hover { background: #f8fafc; }
.dd-checkbox { width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid #cbd5e1; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all .12s; }
.dd-checkbox.checked { background: #4f46e5; border-color: #4f46e5; }
.dd-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

/* Board body */
.board-body { flex: 1; overflow: hidden; background: #f8fafc; }
.board-scroll { display: flex; align-items: flex-start; gap: 12px; padding: 16px; height: 100%; overflow-x: auto; overflow-y: hidden; }

/* Column */
.board-col { width: 272px; min-width: 272px; flex-shrink: 0; display: flex; flex-direction: column; }
.col-hd { display: flex; align-items: center; justify-content: space-between; padding: 0 4px 8px; }
.col-hd-left { display: flex; align-items: center; gap: 7px; }
.col-hd-right { display: flex; align-items: center; gap: 2px; }
.col-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.col-name { font-size: 11.5px; font-weight: 700; letter-spacing: .06em; color: #475569; }
.col-cnt { font-size: 11px; font-weight: 600; background: #e2e8f0; color: #64748b; padding: 1px 7px; border-radius: 20px; }
.col-icon-btn { display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; border: none; background: none; color: #94a3b8; cursor: pointer; border-radius: 4px; transition: background .12s, color .12s; }
.col-icon-btn:hover { background: #e2e8f0; color: #475569; }
.col-dropdown { position: absolute; top: 100%; right: 0; z-index: 400; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.12); min-width: 170px; padding: 4px; }
.cdd-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 10px; border: none; background: none; font-size: 12.5px; color: #374151; cursor: pointer; border-radius: 7px; font-family: 'Inter', sans-serif; text-align: left; transition: background .1s; }
.cdd-item:hover { background: #f8fafc; }
.cdd-item--danger { color: #ef4444; }
.cdd-item--danger:hover { background: #fef2f2; }
.cdd-divider { height: 1px; background: #f1f5f9; margin: 3px 0; }

/* Column rename */
.col-rename-wrap { padding: 0 4px 8px; }
.col-rename-input { width: 100%; border: 1.5px solid #4f46e5; border-radius: 6px; padding: 5px 8px; font-size: 12px; font-weight: 700; letter-spacing: .06em; color: #475569; font-family: 'Inter', sans-serif; outline: none; background: #fff; }

/* Drop zone */
.col-body { background: #f1f5f9; border-radius: 10px; padding: 8px; display: flex; flex-direction: column; gap: 6px; min-height: 200px; flex: 1; transition: background .15s; overflow-y: auto; max-height: calc(100vh - 240px); }
.col-body--over { background: #e0e7ff; }

/* Drop line */
.drop-line { height: 2px; background: #4f46e5; border-radius: 2px; margin: 1px 0; box-shadow: 0 0 6px rgba(79,70,229,.5); }

/* Issue card */
.issue-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; cursor: grab; transition: box-shadow .15s, border-color .15s, transform .15s; }
.issue-card:hover { box-shadow: 0 3px 10px rgba(0,0,0,.08); border-color: #c7d2fe; transform: translateY(-1px); }
.issue-card--dragging { opacity: .35; cursor: grabbing; }
.ic-epic { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px; margin-bottom: 6px; }
.ic-summary { font-size: 12.5px; font-weight: 500; color: #0f172a; line-height: 1.45; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; line-clamp: 3; }
.ic-footer { display: flex; align-items: center; justify-content: space-between; }
.ic-left { display: flex; align-items: center; gap: 5px; }
.ic-type { display: flex; align-items: center; }
.ic-key { font-size: 11px; color: #94a3b8; font-weight: 500; }
.ic-prio { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 20px; }
.ic-assignees { display: flex; align-items: center; }
.ic-av { width: 20px; height: 20px; border-radius: 50%; object-fit: cover; border: 1.5px solid #fff; }

/* Inline create */
.inline-create { background: #fff; border: 1.5px solid #a5b4fc; border-radius: 8px; padding: 10px; }
.ic-input { width: 100%; border: none; outline: none; font-size: 12.5px; color: #0f172a; font-family: 'Inter', sans-serif; margin-bottom: 8px; }
.ic-type-row { display: flex; gap: 6px; margin-bottom: 8px; }
.ic-select { flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 6px; font-size: 11.5px; font-family: 'Inter', sans-serif; color: #374151; outline: none; background: #f8fafc; }
.ic-actions { display: flex; gap: 6px; }
.ic-btn-confirm { padding: 4px 12px; border-radius: 6px; border: none; background: #4f46e5; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
.ic-btn-confirm:hover { background: #4338ca; }
.ic-btn-cancel { padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; font-size: 12px; cursor: pointer; font-family: 'Inter', sans-serif; }
.create-btn { display: flex; align-items: center; gap: 5px; padding: 6px; background: none; border: none; font-size: 12px; font-weight: 500; color: #94a3b8; cursor: pointer; font-family: 'Inter', sans-serif; border-radius: 6px; transition: background .12s, color .12s; }
.create-btn:hover { background: #e2e8f0; color: #475569; }
.add-col-btn { display: inline-flex; align-items: center; gap: 5px; padding: 8px 12px; background: none; border: 1px dashed #cbd5e1; font-size: 12.5px; color: #94a3b8; cursor: pointer; font-family: 'Inter', sans-serif; border-radius: 8px; white-space: nowrap; align-self: flex-start; margin-top: 32px; transition: border-color .12s, color .12s; }
.add-col-btn:hover { border-color: #a5b4fc; color: #4f46e5; }

/* Swimlane layout */
.swimlane-board { display: flex; flex-direction: column; gap: 0; min-width: max-content; }
.swimlane-col-headers { display: flex; align-items: center; padding-bottom: 8px; gap: 12px; }
.swimlane-row-label-spacer { width: 200px; min-width: 200px; flex-shrink: 0; }
.swimlane-col-hd { width: 272px; min-width: 272px; display: flex; align-items: center; gap: 7px; padding: 0 4px; }
.swimlane-row { display: flex; align-items: flex-start; gap: 12px; border-top: 1px solid #e2e8f0; padding: 8px 0; }
.swimlane-row-label { width: 200px; min-width: 200px; flex-shrink: 0; display: flex; align-items: center; gap: 8px; padding: 8px 6px; cursor: pointer; border-radius: 8px; transition: background .12s; user-select: none; }
.swimlane-row-label:hover { background: #f1f5f9; }
.sl-arrow { transition: transform .2s; color: #64748b; flex-shrink: 0; }
.sl-arrow.collapsed { transform: rotate(-90deg); }
.sl-av { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.sl-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.sl-label { font-size: 13px; font-weight: 600; color: #0f172a; }
.sl-cnt { font-size: 11px; background: #e2e8f0; color: #64748b; padding: 1px 7px; border-radius: 20px; font-weight: 600; margin-left: 4px; }
.swimlane-col-body { width: 272px; min-width: 272px; background: #f1f5f9; border-radius: 10px; padding: 8px; display: flex; flex-direction: column; gap: 6px; min-height: 80px; max-height: 300px; overflow-y: auto; transition: background .15s; }
.swimlane-col-collapsed { min-height: 32px; max-height: 32px; background: #f8fafc; }

/* Complete sprint modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.35); z-index: 1300; display: flex; align-items: center; justify-content: center; }
.modal-box { background: #fff; border-radius: 14px; padding: 28px; width: 420px; max-width: 95vw; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
.modal-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 14px; }
.modal-body { font-size: 13.5px; color: #374151; line-height: 1.6; margin-bottom: 20px; }
.modal-body p { margin: 0 0 6px; }
.modal-sub { color: #94a3b8; font-size: 12.5px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; }
.modal-btn-cancel { padding: 7px 18px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; color: #475569; font-size: 13px; font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif; }
.modal-btn-cancel:hover { background: #f8fafc; }
.modal-btn-confirm { padding: 7px 18px; border-radius: 8px; border: none; background: #4f46e5; color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
.modal-btn-confirm:hover { background: #4338ca; }

/* Toast */
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #0f172a; color: #fff; font-size: 12.5px; font-weight: 500; padding: 9px 18px; border-radius: 20px; box-shadow: 0 4px 16px rgba(0,0,0,.2); z-index: 1500; pointer-events: none; white-space: nowrap; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity .2s, transform .2s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }

kbd { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 3px; padding: 1px 5px; font-size: 11px; font-family: 'Inter', sans-serif; }
</style>
