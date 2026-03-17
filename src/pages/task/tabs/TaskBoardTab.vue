<template>
  <div class="board-root" @click="closeAll">

    <!-- Columns -->
    <div v-for="col in columns" :key="col.id" class="board-col">
      <div class="col-hd">
        <div class="col-hd-left">
          <span class="col-dot" :style="{ background: col.color }"></span>
          <span v-if="!col.editing" class="col-title" @dblclick="startEditCol(col)">{{ col.title }}</span>
          <input v-else class="col-title-input" v-model="col.title"
            @blur="col.editing = false" @keydown.enter="col.editing = false"
            @keydown.esc="col.editing = false" />
          <span class="col-count">{{ col.tasks.length }}</span>
        </div>
        <div class="col-hd-right">
          <button class="icon-btn" @click.stop="addTask(col.id)" title="Add task">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          </button>
          <div class="col-menu-wrap">
            <button class="icon-btn" @click.stop="toggleColMenu(col.id)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>
            </button>
            <div v-if="colMenuOpen === col.id" class="dropdown" @click.stop>
              <button class="dd-item" @click="startEditCol(col); colMenuOpen = null">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Rename section
              </button>
              <button class="dd-item" @click="addTask(col.id); colMenuOpen = null">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                Add task
              </button>
              <div class="dd-divider"></div>
              <button class="dd-item dd-item--danger" @click="removeColumn(col.id); colMenuOpen = null">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg>
                Delete section
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="col-body"
        @dragover.prevent="onColDragOver(col.id, $event)"
        @dragleave="onColDragLeave(col.id)"
        @drop.prevent="onDrop(col.id, $event)">
        <div v-for="(task, i) in visibleTasks(col.tasks)" :key="task.id"
          class="b-card" :class="{ 'b-card--done': task.done, 'b-card--dragging': dragState.taskId === task.id }"
          :style="{ animationDelay: i * 40 + 'ms' }"
          draggable="true"
          @dragstart="onDragStart(task, col.id, $event)"
          @dragend="onDragEnd"
          @dragover.prevent="onCardDragOver(col.id, task.id, $event)"
          @click.stop="openTask(task)">
          <!-- drop indicator above card -->
          <div v-if="dropIndicator.colId === col.id && dropIndicator.beforeTaskId === task.id" class="drop-line"></div>
          <div class="bc-top">
            <button class="check-btn" :class="{ done: task.done }" @click.stop="toggleDone(task)">
              <svg v-if="task.done" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#10b981"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#cbd5e1" stroke-width="2"/></svg>
            </button>
            <span class="bc-name" :class="{ 'is-done': task.done }">{{ task.name }}</span>
          </div>
          <div v-if="task.tag && showTags" class="bc-tag" :style="{ background: tagBg(task.tagColor), color: tagFg(task.tagColor) }">{{ task.tag }}</div>
          <div class="bc-foot">
            <span v-if="showDates && task.date" class="bc-date" :class="{ overdue: isOverdue(task.dueDate) }">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              {{ task.date }}
            </span>
            <div class="bc-meta">
              <span v-if="task.subtasks?.length" class="bc-mi">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                {{ task.subtasks.filter(s=>s.done).length }}/{{ task.subtasks.length }}
              </span>
              <span v-if="task.comments?.length" class="bc-mi">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ task.comments.length }}
              </span>
              <div v-if="task.assignee && showAssignees" class="bc-av" :style="{ background: task.assignee.bg }" :title="task.assignee.name">{{ task.assignee.initials }}</div>
            </div>
          </div>
        </div>

        <!-- Inline add -->
        <div v-if="addingIn === col.id" class="add-inline">
          <input class="add-inline-input" v-model="newTaskName" placeholder="Task name…"
            @keydown.enter="confirmAdd(col.id)" @keydown.esc="addingIn = null; newTaskName = ''"
            ref="addInputRef" @click.stop />
          <div class="add-inline-actions">
            <button class="btn-confirm" @click.stop="confirmAdd(col.id)">Add task</button>
            <button class="btn-cancel" @click.stop="addingIn = null; newTaskName = ''">Cancel</button>
          </div>
        </div>

        <!-- drop indicator at bottom of column -->
        <div v-if="dropIndicator.colId === col.id && dropIndicator.beforeTaskId === null" class="drop-line"></div>

        <button class="col-add" @click.stop="addTask(col.id)">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          Add task
        </button>
      </div>
    </div>

    <button class="add-section" @click.stop="addSection">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
      Add section
    </button>

  </div>

  <!-- Task Detail Panel (right side) -->
  <transition name="panel-slide">
    <div v-if="selected" class="panel-overlay" @click.self="selected = null">
      <div class="panel" @click.stop>

        <!-- Panel toolbar -->
        <div class="panel-toolbar">
          <button class="mark-btn" :class="{ completed: selected.done }" @click="toggleDone(selected)">
            <svg v-if="selected.done" width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#10b981"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#cbd5e1" stroke-width="2"/></svg>
            {{ selected.done ? 'Completed' : 'Mark complete' }}
          </button>
          <div class="panel-toolbar-right">
            <button class="tb-btn" title="Attach">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <button class="tb-btn" title="Copy link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
            <div style="position:relative">
              <button class="tb-btn" @click.stop="taskMenuOpen = !taskMenuOpen">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>
              </button>
              <div v-if="taskMenuOpen" class="dropdown dropdown-left" @click.stop>
                <button class="dd-item" @click="duplicateTask(); taskMenuOpen=false">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  Duplicate task
                </button>
                <button class="dd-item" @click="convertToMilestone(); taskMenuOpen=false">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  {{ selected.isMilestone ? 'Remove milestone' : 'Convert to milestone' }}
                </button>
                <div class="dd-divider"></div>
                <button class="dd-item dd-item--danger" @click="deleteTask(); taskMenuOpen=false">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg>
                  Delete task
                </button>
              </div>
            </div>
            <button class="tb-btn tb-close" @click="selected = null" title="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>

        <!-- Panel body -->
        <div class="panel-body" @click="collabPickerOpen = false; taskMenuOpen = false">

          <!-- Task name -->
          <div class="task-name-wrap">
            <button class="check-btn-lg" :class="{ done: selected.done }" @click="toggleDone(selected)">
              <svg v-if="selected.done" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#10b981"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#cbd5e1" stroke-width="2"/></svg>
            </button>
            <textarea class="task-name-input" v-model="selected.name" rows="1" @input="autoResize" />
          </div>

          <!-- Meta fields -->
          <div class="meta-fields">
            <div class="meta-row">
              <span class="meta-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
                Assignee
              </span>
              <div class="meta-val">
                <div v-if="selected.assignee" class="assignee-chip" @click="selected.assignee = undefined">
                  <div class="chip-av" :style="{ background: selected.assignee.bg }">{{ selected.assignee.initials }}</div>
                  {{ selected.assignee.name }}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style="opacity:.5"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                </div>
                <button v-else class="meta-btn" @click="assignSelf">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="11" x2="16" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  Assign to me
                </button>
              </div>
            </div>
            <div class="meta-row">
              <span class="meta-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Due date
              </span>
              <div class="meta-val"><input class="date-input" type="date" v-model="selected.dueDate" /></div>
            </div>
            <div class="meta-row">
              <span class="meta-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="4" y1="22" x2="4" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Priority
              </span>
              <div class="meta-val">
                <div class="priority-btns">
                  <button class="prio-btn prio-high" :class="{ active: selected.priority === 'High' }" @click="selected.priority = 'High'">High</button>
                  <button class="prio-btn prio-med" :class="{ active: selected.priority === 'Medium' }" @click="selected.priority = 'Medium'">Medium</button>
                  <button class="prio-btn prio-low" :class="{ active: selected.priority === 'Low' }" @click="selected.priority = 'Low'">Low</button>
                </div>
              </div>
            </div>
            <div class="meta-row">
              <span class="meta-label">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Project
              </span>
              <div class="meta-val">
                <span v-if="selected.project" class="proj-chip">
                  <span class="proj-dot" style="background:#4f46e5"></span>{{ selected.project }}
                </span>
                <button v-else class="meta-btn">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                  Add project
                </button>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="section-block">
            <div class="section-title">Description</div>
            <textarea class="desc-input" v-model="selected.description" rows="3" placeholder="Add a description…" @input="autoResize" />
          </div>

          <!-- Subtasks -->
          <div class="section-block">
            <div class="section-title-row">
              <span class="section-title">Subtasks <span class="count-badge">{{ selected.subtasks.filter(s=>s.done).length }}/{{ selected.subtasks.length }}</span></span>
              <button class="section-action" @click="addSubtask">+ Add subtask</button>
            </div>
            <div v-for="st in selected.subtasks" :key="st.id" class="subtask-row">
              <button class="check-btn" :class="{ done: st.done }" @click="st.done = !st.done">
                <svg v-if="st.done" width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#10b981"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#cbd5e1" stroke-width="2"/></svg>
              </button>
              <input class="subtask-input" :class="{ 'is-done': st.done }" v-model="st.name" />
              <button class="icon-btn-sm" @click="removeSubtask(st.id)">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
              </button>
            </div>
            <button class="add-sub-btn" @click="addSubtask">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
              Add subtask
            </button>
          </div>

          <!-- Attachments -->
          <div class="section-block">
            <div class="section-title-row">
              <span class="section-title">Attachments</span>
              <button class="section-action">+ Attach file</button>
            </div>
            <div v-if="selected.attachments.length" class="att-list">
              <div v-for="att in selected.attachments" :key="att.name" class="att-chip">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                {{ att.name }}
                <button class="icon-btn-sm" @click="removeAttachment(att.name)">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Comments -->
          <div class="section-block">
            <div class="section-title">Comments</div>
            <div v-for="c in selected.comments" :key="c.id" class="comment-row">
              <div class="c-av" :style="{ background: c.avBg }">{{ c.avInitials }}</div>
              <div class="c-body">
                <div class="c-header">
                  <span class="c-author">{{ c.author }}</span>
                  <span class="c-time">{{ c.time }}</span>
                  <button class="icon-btn-sm c-del" @click="deleteComment(c.id)">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  </button>
                </div>
                <div class="c-text">{{ c.text }}</div>
              </div>
            </div>
            <div class="new-comment">
              <div class="c-av" style="background:#4f46e5">Me</div>
              <div class="new-comment-wrap">
                <textarea class="new-comment-input" v-model="newComment" rows="2" placeholder="Add a comment… (Ctrl+Enter to post)" @keydown.ctrl.enter="postComment" />
                <div class="new-comment-footer">
                  <span class="comment-hint">Ctrl+Enter to post</span>
                  <button class="btn-post" :disabled="!newComment.trim()" @click="postComment">Post</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Collaborators -->
          <div class="section-block">
            <div class="section-title">Collaborators</div>
            <div class="collab-row">
              <div v-for="collab in selected.collaborators" :key="collab.name"
                class="collab-av" :style="{ background: collab.bg }"
                :title="'Remove ' + collab.name" @click="removeCollaborator(collab.name)">
                <span class="collab-initials">{{ collab.initials }}</span>
                <span class="collab-x">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>
                </span>
              </div>
              <div style="position:relative">
                <button class="collab-add" @click.stop="collabPickerOpen = !collabPickerOpen" title="Add collaborator">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                </button>
                <div v-if="collabPickerOpen" class="collab-picker" @click.stop>
                  <div class="collab-picker-title">Add collaborator</div>
                  <div v-for="u in availableCollaborators" :key="u.name"
                    class="collab-picker-item" :class="{ 'is-added': selected.collaborators.some(c => c.name === u.name) }"
                    @click="toggleCollaborator(u)">
                    <div class="collab-picker-av" :style="{ background: u.bg }">{{ u.initials }}</div>
                    <span class="collab-picker-name">{{ u.name }}</span>
                    <svg v-if="selected.collaborators.some(c => c.name === u.name)" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </transition>

</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import {
  activeFilters, sortBy, searchQuery,
  showDone, showTags, showDates, showAssignees,
} from '@/stores/boardToolbarStore'

interface Subtask    { id: number; name: string; done: boolean }
interface Comment    { id: number; author: string; avInitials: string; avBg: string; text: string; time: string }
interface Assignee   { name: string; initials: string; bg: string }
interface Attachment { name: string }
interface Task {
  id: number; name: string; done: boolean
  tag?: string; tagColor?: string; date?: string; dueDate?: string
  priority?: 'High' | 'Medium' | 'Low'
  assignee?: Assignee; project?: string; description?: string
  subtasks: Subtask[]; comments: Comment[]; collaborators: Assignee[]; attachments: Attachment[]
  isMilestone?: boolean
}
interface Col { id: string; title: string; color: string; tasks: Task[]; editing?: boolean }

const selected       = ref<Task | null>(null)
const colMenuOpen    = ref<string | null>(null)
const taskMenuOpen   = ref(false)
const addingIn       = ref<string | null>(null)
const newTaskName    = ref('')
const newComment     = ref('')
const collabPickerOpen = ref(false)
const addInputRef    = ref<HTMLInputElement | null>(null)

// ── Drag & Drop state ──
const dragState = reactive({ taskId: -1, fromColId: '' })
const dropIndicator = reactive({ colId: '', beforeTaskId: null as number | null })

function onDragStart(task: Task, colId: string, e: DragEvent) {
  dragState.taskId = task.id
  dragState.fromColId = colId
  e.dataTransfer!.effectAllowed = 'move'
  e.dataTransfer!.setData('text/plain', String(task.id))
  // slight delay so the ghost image renders before we hide the card
  setTimeout(() => {}, 0)
}

function onDragEnd() {
  dragState.taskId = -1
  dragState.fromColId = ''
  dropIndicator.colId = ''
  dropIndicator.beforeTaskId = null
}

function onColDragOver(colId: string, e: DragEvent) {
  e.preventDefault()
  // If hovering the empty space below all cards, show indicator at bottom
  dropIndicator.colId = colId
  dropIndicator.beforeTaskId = null
}

function onColDragLeave(colId: string) {
  if (dropIndicator.colId === colId) {
    dropIndicator.colId = ''
    dropIndicator.beforeTaskId = null
  }
}

function onCardDragOver(colId: string, taskId: number, e: DragEvent) {
  e.stopPropagation()
  const el = (e.currentTarget as HTMLElement)
  const rect = el.getBoundingClientRect()
  const midY = rect.top + rect.height / 2
  dropIndicator.colId = colId
  // if cursor is in top half → insert before this card; bottom half → insert before next
  dropIndicator.beforeTaskId = e.clientY < midY ? taskId : getNextTaskId(colId, taskId)
}

function getNextTaskId(colId: string, taskId: number): number | null {
  const col = columns.find(c => c.id === colId)
  if (!col) return null
  const idx = col.tasks.findIndex(t => t.id === taskId)
  return col.tasks[idx + 1]?.id ?? null
}

function onDrop(colId: string, e: DragEvent) {
  e.preventDefault()
  const taskId = Number(e.dataTransfer!.getData('text/plain'))
  if (!taskId) return

  const fromCol = columns.find(c => c.id === dragState.fromColId)
  const toCol   = columns.find(c => c.id === colId)
  if (!fromCol || !toCol) return

  const taskIdx = fromCol.tasks.findIndex(t => t.id === taskId)
  if (taskIdx === -1) return
  const removed = fromCol.tasks.splice(taskIdx, 1)
  const task = removed[0]
  if (!task) return

  const beforeId = dropIndicator.beforeTaskId
  if (beforeId === null) {
    toCol.tasks.push(task)
  } else {
    const insertIdx = toCol.tasks.findIndex(t => t.id === beforeId)
    toCol.tasks.splice(insertIdx === -1 ? toCol.tasks.length : insertIdx, 0, task)
  }

  dropIndicator.colId = ''
  dropIndicator.beforeTaskId = null
  dragState.taskId = -1
  dragState.fromColId = ''
}

const tagMap: Record<string, [string, string]> = {
  green: ['#f0fdf4','#16a34a'], blue: ['#eff6ff','#2563eb'],
  red:   ['#fef2f2','#ef4444'], amber: ['#fffbeb','#d97706'],
}
const tagBg = (c?: string) => tagMap[c ?? '']?.[0] ?? '#f1f5f9'
const tagFg = (c?: string) => tagMap[c ?? '']?.[1] ?? '#475569'
function isOverdue(date?: string) { return !!date && new Date(date) < new Date() }

const priorityOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 }

function visibleTasks(tasks: Task[]): Task[] {
  let list = [...tasks]
  if (!showDone.value)                              list = list.filter(t => !t.done)
  if (activeFilters.value.includes('incomplete'))   list = list.filter(t => !t.done)
  if (activeFilters.value.includes('overdue'))      list = list.filter(t => isOverdue(t.dueDate))
  if (activeFilters.value.includes('assigned'))     list = list.filter(t => !!t.assignee)
  if (activeFilters.value.includes('has-subtasks')) list = list.filter(t => t.subtasks.length > 0)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(t => t.name.toLowerCase().includes(q) || t.tag?.toLowerCase().includes(q))
  }
  if (sortBy.value === 'name')      list.sort((a, b) => a.name.localeCompare(b.name))
  if (sortBy.value === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name))
  if (sortBy.value === 'due')       list.sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''))
  if (sortBy.value === 'priority')  list.sort((a, b) => (priorityOrder[a.priority ?? ''] ?? 9) - (priorityOrder[b.priority ?? ''] ?? 9))
  return list
}

const columns = reactive<Col[]>([
  { id: 'untitled-1', title: 'Untitled section', color: '#94a3b8', tasks: [] },
  {
    id: 'recent', title: 'Recently assigned', color: '#818cf8',
    tasks: [
      { id: 1, name: 'Get EKYC Additional segment KT from Ganavi', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jun 28, 2023', dueDate: '2023-06-28', priority: 'Medium', assignee: { name: 'Arjun P.', initials: 'AP', bg: '#fed7aa' }, project: 'My EKYC', description: '', subtasks: [{ id: 1, name: 'Review docs', done: true }, { id: 2, name: 'Take notes', done: false }], comments: [{ id: 1, author: 'Sara M.', avInitials: 'SM', avBg: '#fef3c7', text: 'LGTM! Ship it 🚀', time: '2 days ago' }], collaborators: [{ name: 'Sara M.', initials: 'SM', bg: '#fef3c7' }], attachments: [] },
      { id: 2, name: 'Get EKYC NRI Flow KT from Ganavi', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jun 29, 2023', dueDate: '2023-06-29', priority: 'Medium', assignee: undefined, project: 'My EKYC', description: '', subtasks: [], comments: [], collaborators: [], attachments: [] },
      { id: 3, name: 'EKYC Admin side — Main, Addsegment, Dormant, NRI Flow KT', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jun 30, 2023', dueDate: '2023-06-30', priority: 'High', assignee: { name: 'Raj R.', initials: 'RR', bg: '#fde68a' }, project: 'My EKYC', description: 'Cover all admin flows.', subtasks: [{ id: 1, name: 'Main flow', done: true }], comments: [], collaborators: [{ name: 'Raj R.', initials: 'RR', bg: '#fde68a' }], attachments: [{ name: 'admin-flow.pdf' }] },
      { id: 4, name: 'EKYC Code analysis for all segments', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jul 1, 2023', dueDate: '2023-07-01', priority: 'Low', assignee: undefined, project: 'My EKYC', description: '', subtasks: [], comments: [], collaborators: [], attachments: [] },
      { id: 5, name: 'Research on EKYC flow and prepare test cases', done: false, tag: 'EKYC-V2', tagColor: 'green', date: 'Jul 3, 2023', dueDate: '2023-07-03', priority: 'High', assignee: { name: 'Uma P.', initials: 'UP', bg: '#ede9fe' }, project: 'My EKYC', description: '', subtasks: [], comments: [], collaborators: [], attachments: [] },
      { id: 6, name: 'Implement authentication module', done: false, tag: 'Sprint-1', tagColor: 'blue', date: 'Jul 5, 2023', dueDate: '2023-07-05', priority: 'Medium', assignee: undefined, project: 'My EKYC', description: '', subtasks: [], comments: [{ id: 1, author: 'Arjun P.', avInitials: 'AP', avBg: '#fed7aa', text: 'In progress.', time: '1 day ago' }], collaborators: [], attachments: [] },
    ],
  },
  { id: 'today',     title: 'Do today',     color: '#f59e0b', tasks: [] },
  { id: 'next-week', title: 'Do next week', color: '#10b981', tasks: [] },
])

function closeAll() { colMenuOpen.value = null; taskMenuOpen.value = false; collabPickerOpen.value = false }
function openTask(task: Task) { selected.value = task; taskMenuOpen.value = false; collabPickerOpen.value = false }
function toggleDone(task: Task) { task.done = !task.done }
function toggleColMenu(id: string) { colMenuOpen.value = colMenuOpen.value === id ? null : id }
function startEditCol(col: Col) {
  col.editing = true
  nextTick(() => { const el = document.querySelector('.col-title-input') as HTMLInputElement; el?.focus(); el?.select() })
}

let nid = 300
function addTask(colId: string) { addingIn.value = colId; newTaskName.value = ''; nextTick(() => addInputRef.value?.focus()) }
function confirmAdd(colId: string) {
  const name = newTaskName.value.trim()
  if (!name) { addingIn.value = null; return }
  const col = columns.find(c => c.id === colId)
  if (col) {
    const task: Task = { id: nid++, name, done: false, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), subtasks: [], comments: [], collaborators: [], attachments: [] }
    col.tasks.push(task); openTask(task)
  }
  addingIn.value = null; newTaskName.value = ''
}
function removeColumn(colId: string) {
  const idx = columns.findIndex(c => c.id === colId)
  if (idx !== -1) columns.splice(idx, 1)
  if (selected.value) selected.value = null
}
function addSection() { columns.push({ id: `s-${Date.now()}`, title: 'Untitled section', color: '#94a3b8', tasks: [] }) }
function assignSelf() { if (selected.value) selected.value.assignee = { name: 'Me', initials: 'Me', bg: '#4f46e5' } }
function addSubtask() { if (selected.value) selected.value.subtasks.push({ id: Date.now(), name: 'New subtask', done: false }) }
function removeSubtask(id: number) { if (selected.value) selected.value.subtasks = selected.value.subtasks.filter(s => s.id !== id) }
function removeAttachment(name: string) { if (selected.value) selected.value.attachments = selected.value.attachments.filter(a => a.name !== name) }

let cid = 500
function postComment() {
  if (!selected.value || !newComment.value.trim()) return
  selected.value.comments.push({ id: cid++, author: 'Me', avInitials: 'Me', avBg: '#4f46e5', text: newComment.value.trim(), time: 'Just now' })
  newComment.value = ''
}
function deleteComment(id: number) { if (selected.value) selected.value.comments = selected.value.comments.filter(c => c.id !== id) }

const availableCollaborators: Assignee[] = [
  { name: 'Arjun P.', initials: 'AP', bg: '#fed7aa' }, { name: 'Sara M.', initials: 'SM', bg: '#fef3c7' },
  { name: 'Raj R.',   initials: 'RR', bg: '#fde68a' }, { name: 'Uma P.',  initials: 'UP', bg: '#ede9fe' },
  { name: 'Lasa M.',  initials: 'LM', bg: '#cffafe' }, { name: 'Dev K.',  initials: 'DK', bg: '#d1fae5' },
]
function toggleCollaborator(user: Assignee) {
  if (!selected.value) return
  const idx = selected.value.collaborators.findIndex(c => c.name === user.name)
  if (idx !== -1) selected.value.collaborators.splice(idx, 1)
  else selected.value.collaborators.push({ ...user })
}
function removeCollaborator(name: string) { if (selected.value) selected.value.collaborators = selected.value.collaborators.filter(c => c.name !== name) }
function duplicateTask() {
  if (!selected.value) return
  const col = columns.find(c => c.tasks.some(t => t.id === selected.value!.id))
  if (!col) return
  const copy: Task = { ...JSON.parse(JSON.stringify(selected.value)), id: nid++ }
  copy.name += ' (copy)'; col.tasks.push(copy)
}
function convertToMilestone() { if (selected.value) selected.value.isMilestone = !selected.value.isMilestone }
function deleteTask() {
  if (!selected.value) return
  for (const col of columns) {
    const idx = col.tasks.findIndex(t => t.id === selected.value!.id)
    if (idx !== -1) { col.tasks.splice(idx, 1); break }
  }
  selected.value = null
}
function autoResize(e: Event) { const el = e.target as HTMLTextAreaElement; el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' }
</script>

<style scoped>
/* ── Board root ── */
.board-root { display: flex; gap: 14px; flex: 1; min-height: 0; padding: 16px 20px; overflow-x: auto; overflow-y: hidden; align-items: stretch; font-family: 'Inter', sans-serif; position: relative; }

/* ── Column ── */
.board-col { width: 260px; min-width: 260px; flex-shrink: 0; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; overflow: hidden; max-height: 100%; }
.col-hd { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px 8px; border-bottom: 1px solid #f1f5f9; flex-shrink: 0; }
.col-hd-left { display: flex; align-items: center; gap: 7px; flex: 1; min-width: 0; }
.col-hd-right { display: flex; align-items: center; gap: 2px; }
.col-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.col-title { font-size: 13px; font-weight: 600; color: #0f172a; cursor: default; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.col-title-input { font-size: 13px; font-weight: 600; color: #0f172a; border: 1px solid #a5b4fc; border-radius: 5px; padding: 1px 6px; outline: none; width: 120px; }
.col-count { font-size: 11px; font-weight: 600; background: #f1f5f9; color: #64748b; padding: 1px 6px; border-radius: 20px; flex-shrink: 0; }
.col-menu-wrap { position: relative; }
.icon-btn { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 6px; border: none; background: none; color: #94a3b8; cursor: pointer; transition: background .12s, color .12s; }
.icon-btn:hover { background: #f1f5f9; color: #475569; }
.col-body { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 8px; display: flex; flex-direction: column; gap: 6px; min-height: 0; }

/* ── Card ── */
.b-card { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; padding: 10px 11px; cursor: grab; animation: fadeUp .22s ease both; transition: border-color .15s, box-shadow .15s, transform .15s; position: relative; }
.b-card:hover { border-color: #a5b4fc; box-shadow: 0 4px 14px rgba(79,70,229,.08); transform: translateY(-1px); }
.b-card--done { opacity: .65; }
.b-card--dragging { opacity: .35; border-color: #a5b4fc; box-shadow: none; transform: none; cursor: grabbing; }

/* ── Drop indicator ── */
.drop-line { height: 2px; background: #4f46e5; border-radius: 2px; margin: 2px 0; box-shadow: 0 0 6px rgba(79,70,229,.4); animation: dropLinePulse .6s ease infinite alternate; }
@keyframes dropLinePulse { from { opacity: .7; } to { opacity: 1; } }

/* ── Column drop highlight ── */
.col-body.drag-over { background: #f5f3ff; }
.bc-top { display: flex; align-items: flex-start; gap: 7px; margin-bottom: 6px; }
.check-btn { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; border: none; background: none; cursor: pointer; flex-shrink: 0; transition: opacity .15s; margin-top: 1px; }
.check-btn:hover { opacity: .75; }
.bc-name { font-size: 12.5px; font-weight: 500; color: #0f172a; line-height: 1.45; }
.is-done { text-decoration: line-through; color: #94a3b8; }
.bc-tag { display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 20px; margin-bottom: 6px; }
.bc-foot { display: flex; align-items: center; justify-content: space-between; }
.bc-date { font-size: 10.5px; color: #94a3b8; display: flex; align-items: center; gap: 3px; }
.bc-date.overdue { color: #ef4444; }
.bc-meta { display: flex; align-items: center; gap: 6px; }
.bc-mi { display: inline-flex; align-items: center; gap: 3px; font-size: 10.5px; color: #94a3b8; }
.bc-av { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7px; font-weight: 700; color: #fff; }

/* ── Inline add ── */
.add-inline { background: #f8fafc; border: 1px solid #a5b4fc; border-radius: 9px; padding: 8px 10px; }
.add-inline-input { width: 100%; border: none; background: none; outline: none; font-size: 12.5px; color: #0f172a; font-family: 'Inter', sans-serif; }
.add-inline-actions { display: flex; gap: 6px; margin-top: 6px; }
.btn-confirm { padding: 4px 12px; border-radius: 6px; border: none; background: #4f46e5; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
.btn-confirm:hover { background: #4338ca; }
.btn-cancel { padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0; background: #fff; color: #64748b; font-size: 12px; cursor: pointer; font-family: 'Inter', sans-serif; }
.col-add { display: flex; align-items: center; gap: 5px; padding: 7px 8px; border-radius: 8px; border: 1px dashed #e2e8f0; background: none; font-size: 12px; color: #94a3b8; cursor: pointer; font-family: 'Inter', sans-serif; width: 100%; transition: border-color .12s, color .12s, background .12s; }
.col-add:hover { border-color: #a5b4fc; color: #4f46e5; background: #fafafe; }
.add-section { display: inline-flex; align-items: center; gap: 5px; padding: 10px 14px; border-radius: 10px; border: 1px dashed #e2e8f0; background: #fff; font-size: 12.5px; color: #94a3b8; cursor: pointer; font-family: 'Inter', sans-serif; white-space: nowrap; flex-shrink: 0; align-self: flex-start; transition: border-color .12s, color .12s; }
.add-section:hover { border-color: #a5b4fc; color: #4f46e5; }

/* ── Dropdown ── */
.dropdown { position: absolute; top: 100%; right: 0; z-index: 300; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.12); min-width: 180px; padding: 4px; }
.dropdown-left { left: auto; right: 0; }
.dd-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 10px; border: none; background: none; font-size: 12.5px; color: #374151; cursor: pointer; border-radius: 7px; font-family: 'Inter', sans-serif; text-align: left; transition: background .1s; }
.dd-item:hover { background: #f8fafc; }
.dd-item--danger { color: #ef4444; }
.dd-item--danger:hover { background: #fef2f2; }
.dd-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

/* ── Panel overlay ── */
.panel-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.25); z-index: 1100; display: flex; justify-content: flex-end; }
.panel { width: 480px; max-width: 95vw; background: #fff; height: 100%; box-shadow: -6px 0 32px rgba(0,0,0,.14); display: flex; flex-direction: column; overflow: hidden; }
.panel-slide-enter-active, .panel-slide-leave-active { transition: transform .22s ease; }
.panel-slide-enter-from, .panel-slide-leave-to { transform: translateX(100%); }

/* ── Panel toolbar ── */
.panel-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; }
.mark-btn { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; border: 1.5px solid #e2e8f0; background: #fff; font-size: 12px; font-weight: 600; color: #475569; cursor: pointer; font-family: 'Inter', sans-serif; transition: all .15s; }
.mark-btn:hover { border-color: #10b981; color: #10b981; }
.mark-btn.completed { border-color: #10b981; background: #f0fdf4; color: #10b981; }
.panel-toolbar-right { display: flex; align-items: center; gap: 2px; }
.tb-btn { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 7px; border: none; background: none; color: #64748b; cursor: pointer; transition: background .12s, color .12s; }
.tb-btn:hover { background: #f1f5f9; color: #0f172a; }
.tb-close:hover { background: #fef2f2; color: #ef4444; }

/* ── Panel body ── */
.panel-body { flex: 1; overflow-y: auto; padding: 20px 22px; display: flex; flex-direction: column; gap: 20px; }
.task-name-wrap { display: flex; align-items: flex-start; gap: 10px; }
.check-btn-lg { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 50%; border: none; background: none; cursor: pointer; flex-shrink: 0; margin-top: 2px; }
.task-name-input { flex: 1; border: none; outline: none; resize: none; font-size: 18px; font-weight: 700; color: #0f172a; font-family: 'Inter', sans-serif; line-height: 1.4; background: transparent; overflow: hidden; }

/* ── Meta fields ── */
.meta-fields { display: flex; flex-direction: column; border: 1px solid #f1f5f9; border-radius: 10px; overflow: hidden; }
.meta-row { display: flex; align-items: center; min-height: 38px; border-bottom: 1px solid #f8fafc; padding: 0 12px; }
.meta-row:last-child { border-bottom: none; }
.meta-label { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: #94a3b8; width: 110px; flex-shrink: 0; }
.meta-val { flex: 1; display: flex; align-items: center; }
.meta-btn { display: inline-flex; align-items: center; gap: 5px; padding: 4px 8px; border-radius: 6px; border: none; background: none; font-size: 12px; color: #94a3b8; cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s, color .12s; }
.meta-btn:hover { background: #f1f5f9; color: #475569; }
.assignee-chip { display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px; border-radius: 20px; background: #f1f5f9; font-size: 12px; font-weight: 500; color: #374151; cursor: pointer; transition: background .12s; }
.assignee-chip:hover { background: #fef2f2; }
.chip-av { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 7px; font-weight: 700; color: #fff; }
.date-input { border: none; outline: none; background: none; font-size: 12px; color: #374151; font-family: 'Inter', sans-serif; cursor: pointer; }
.proj-chip { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: #374151; }
.proj-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.priority-btns { display: flex; gap: 5px; }
.prio-btn { padding: 3px 10px; border-radius: 20px; border: 1.5px solid #e2e8f0; font-size: 11px; font-weight: 600; cursor: pointer; background: #f8fafc; color: #64748b; font-family: 'Inter', sans-serif; transition: all .12s; }
.prio-high.active { background: #fef2f2; color: #ef4444; border-color: #fca5a5; }
.prio-med.active  { background: #fffbeb; color: #d97706; border-color: #fcd34d; }
.prio-low.active  { background: #f0fdf4; color: #16a34a; border-color: #86efac; }

/* ── Sections ── */
.section-block { display: flex; flex-direction: column; gap: 8px; }
.section-title { font-size: 11.5px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: .04em; }
.section-title-row { display: flex; align-items: center; justify-content: space-between; }
.count-badge { font-size: 11px; color: #94a3b8; font-weight: 400; text-transform: none; letter-spacing: 0; }
.section-action { font-size: 11.5px; color: #4f46e5; cursor: pointer; border: none; background: none; font-family: 'Inter', sans-serif; padding: 0; }
.section-action:hover { text-decoration: underline; }
.desc-input { width: 100%; border: 1px solid #f1f5f9; border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #374151; font-family: 'Inter', sans-serif; resize: vertical; outline: none; background: #f8fafc; transition: border-color .15s; box-sizing: border-box; }
.desc-input:focus { border-color: #a5b4fc; background: #fff; }

/* ── Subtasks ── */
.subtask-row { display: flex; align-items: center; gap: 6px; padding: 4px 0; border-bottom: 1px solid #f8fafc; }
.subtask-input { flex: 1; border: none; outline: none; background: none; font-size: 12.5px; color: #374151; font-family: 'Inter', sans-serif; }
.subtask-input.is-done { text-decoration: line-through; color: #94a3b8; }
.icon-btn-sm { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 5px; border: none; background: none; color: #cbd5e1; cursor: pointer; transition: color .12s, background .12s; }
.icon-btn-sm:hover { color: #ef4444; background: #fef2f2; }
.add-sub-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 8px; border-radius: 7px; border: 1px dashed #e2e8f0; background: none; font-size: 12px; color: #94a3b8; cursor: pointer; font-family: 'Inter', sans-serif; transition: border-color .12s, color .12s; }
.add-sub-btn:hover { border-color: #a5b4fc; color: #4f46e5; }

/* ── Attachments ── */
.att-list { display: flex; flex-wrap: wrap; gap: 6px; }
.att-chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; background: #eef2ff; font-size: 11.5px; color: #4f46e5; border: 1px solid #c7d2fe; }

/* ── Comments ── */
.comment-row { display: flex; gap: 10px; }
.c-av { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #fff; }
.c-body { flex: 1; min-width: 0; }
.c-header { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; }
.c-author { font-size: 12px; font-weight: 600; color: #0f172a; }
.c-time { font-size: 11px; color: #94a3b8; flex: 1; }
.c-del { opacity: 0; transition: opacity .12s; }
.comment-row:hover .c-del { opacity: 1; }
.c-text { font-size: 12.5px; color: #374151; line-height: 1.5; }
.new-comment { display: flex; gap: 10px; }
.new-comment-wrap { flex: 1; }
.new-comment-input { width: 100%; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; font-size: 12.5px; color: #374151; font-family: 'Inter', sans-serif; resize: none; outline: none; transition: border-color .15s; box-sizing: border-box; }
.new-comment-input:focus { border-color: #a5b4fc; }
.new-comment-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 5px; }
.comment-hint { font-size: 10.5px; color: #94a3b8; }
.btn-post { padding: 4px 14px; border-radius: 6px; border: none; background: #4f46e5; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s; }
.btn-post:hover:not(:disabled) { background: #4338ca; }
.btn-post:disabled { opacity: .4; cursor: not-allowed; }

/* ── Collaborators ── */
.collab-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.collab-av { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #fff; border: 2px solid #fff; box-shadow: 0 0 0 1px #e2e8f0; cursor: pointer; position: relative; overflow: hidden; }
.collab-av .collab-x { display: none; position: absolute; inset: 0; background: rgba(239,68,68,.8); border-radius: 50%; align-items: center; justify-content: center; }
.collab-av:hover .collab-x { display: flex; }
.collab-av:hover .collab-initials { opacity: 0; }
.collab-add { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1.5px dashed #c7d2fe; background: #f5f3ff; color: #4f46e5; cursor: pointer; transition: background .12s; }
.collab-add:hover { background: #ede9fe; }
.collab-picker { position: absolute; bottom: 36px; left: 0; z-index: 600; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.12); min-width: 200px; padding: 4px; }
.collab-picker-title { font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .04em; padding: 6px 10px 4px; }
.collab-picker-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 7px; cursor: pointer; transition: background .1s; }
.collab-picker-item:hover { background: #f8fafc; }
.collab-picker-item.is-added { background: #f0fdf4; }
.collab-picker-av { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; color: #fff; flex-shrink: 0; }
.collab-picker-name { flex: 1; font-size: 12.5px; color: #374151; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
</style>
