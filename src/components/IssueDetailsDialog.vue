<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="modelValue && issue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal-panel" :class="{ fullscreen: isFullscreen }">

          <!-- Toolbar -->
          <div class="modal-toolbar">
            <div class="toolbar-left">
              <button class="icon-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
              <span class="toolbar-breadcrumb">Add epic /</span>
              <span class="issue-key-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="22 4 12 14.01 9 11.01" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ issue.key }}
              </span>
            </div>
            <div class="toolbar-right">
              <button class="icon-btn" title="Lock"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
              <button class="icon-btn" title="Watch"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg><span class="toolbar-count">1</span></button>
              <button class="icon-btn" title="Share"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" stroke-width="2"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" stroke-width="2"/></svg></button>
              <button class="icon-btn" title="More"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/></svg></button>
              <button class="icon-btn" @click="isFullscreen = !isFullscreen">
                <svg v-if="!isFullscreen" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              <button class="icon-btn close-btn" @click="$emit('update:modelValue', false)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>

          <!-- Content -->
          <div class="modal-content">

            <!-- Main -->
            <div class="main-col">
              <h1 class="issue-title">{{ issue.summary }}</h1>

              <!-- Action bar -->
              <div class="action-bar">
                <button class="action-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Attach</button>
                <button class="action-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Add child issue</button>
                <button class="action-btn"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Link issue</button>
                <button class="action-btn icon-only"><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/></svg></button>
              </div>

              <!-- Description -->
              <div class="section">
                <div class="section-title">Description</div>
                <div v-if="!isDescriptionEditing"
                  class="desc-view"
                  @click="enableDescriptionEditing">
                  <div v-if="internalDescription" v-html="internalDescription" class="user-content"></div>
                  <div v-else class="desc-placeholder">Add a description...</div>
                </div>
                <div v-else class="desc-editor-wrap">
                  <QuillEditor :content="internalDescription" @update:content="internalDescription = $event"
                    :modules="modules" placeholder="Add a description..." />
                  <div class="desc-actions">
                    <button class="btn-primary-sm" @click="saveDescription">Save</button>
                    <button class="btn-ghost-sm" @click="cancelDescription">Cancel</button>
                  </div>
                </div>
              </div>

              <!-- Attachments -->
              <div class="section">
                <div class="section-header">
                  <div class="section-title">Attachments</div>
                  <button class="btn-add"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Add</button>
                </div>
                <div class="attach-list">
                  <div v-for="file in attachments" :key="file.name" class="attach-item">
                    <div class="attach-icon" :class="file.bgClass">
                      <svg v-if="file.type==='pdf'" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="#3b82f6" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" stroke="#3b82f6" stroke-width="2"/><polyline points="21 15 16 10 5 21" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <div class="attach-info">
                      <div class="attach-name">{{ file.name }}</div>
                      <div class="attach-meta">{{ file.size }} · {{ file.time }} · {{ file.uploader }}</div>
                    </div>
                    <div class="attach-actions">
                      <button class="icon-btn-sm">👁</button>
                      <button class="icon-btn-sm">⬇</button>
                      <button class="icon-btn-sm danger">🗑</button>
                    </div>
                  </div>
                </div>
                <div class="dropzone"
                  :class="{ active: isDragging }"
                  @dragover.prevent="isDragging = true"
                  @dragleave="isDragging = false"
                  @drop.prevent="isDragging = false">
                  <div class="drop-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><polyline points="16 16 12 12 8 16" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="12" x2="12" y2="21" stroke="#4f46e5" stroke-width="2" stroke-linecap="round"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                  <div class="drop-text">Drop files here or <span class="drop-link">browse</span></div>
                  <div class="drop-hint">PDF, images, docs · Max 10MB</div>
                </div>
              </div>

              <!-- Linked Issues -->
              <div class="section">
                <div class="section-header">
                  <div class="section-title">Linked Issues</div>
                  <button class="icon-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
                </div>
                <div class="linked-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/><polyline points="22 4 12 14.01 9 11.01" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/></svg>
                  <span class="linked-key">KAN-5</span>
                  <span class="linked-title">Implement authentication</span>
                  <span class="status-badge badge-blue">IN PROGRESS</span>
                </div>
              </div>

              <!-- Subtasks -->
              <div class="section">
                <div class="section-header">
                  <div class="section-title">Subtasks</div>
                  <div style="display:flex;gap:4px">
                    <button class="icon-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="19" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/></svg></button>
                    <button class="icon-btn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
                  </div>
                </div>
                <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:0%"></div></div>
                <div class="empty-subtask">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#4f46e5" stroke-width="2"/></svg>
                  <span>No subtasks yet</span>
                </div>
              </div>

              <!-- Activity -->
              <div class="section">
                <div class="section-title">Activity</div>
                <div class="activity-filter">
                  <span class="filter-label">Show:</span>
                  <button v-for="f in ['All','Comments','History']" :key="f"
                    class="filter-chip" :class="{ active: activityFilter === f }"
                    @click="activityFilter = f">{{ f }}</button>
                </div>
                <div class="comment-row">
                  <div class="comment-avatar">{{ taskStore.currentUser.name.charAt(0) }}</div>
                  <div class="comment-input-wrap">
                    <input class="comment-input" placeholder="Add a comment..." />
                    <div class="comment-hint"><strong>Pro tip:</strong> press <kbd>M</kbd> to comment</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="sidebar-col">
              <!-- Status select -->
              <select class="status-select" :value="issue.status">
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>

              <!-- Details card -->
              <div class="details-card">
                <div class="details-header" @click="detailsOpen = !detailsOpen">
                  <span class="details-title">Details</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :style="`transform:rotate(${detailsOpen?180:0}deg);transition:.2s`"><polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div v-if="detailsOpen" class="details-body">

                  <div class="detail-row">
                    <div class="detail-label">Assignees</div>
                    <div class="detail-value">
                      <div v-if="issue.assignees?.length" class="assignee-chips">
                        <div v-for="a in issue.assignees" :key="a.id" class="assignee-chip">
                          <img :src="a.avatar" class="chip-avatar" />
                          {{ a.name }}
                        </div>
                      </div>
                      <span v-else class="detail-none">Unassigned</span>
                    </div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">Labels</div>
                    <div class="detail-value detail-none">None</div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">Parent</div>
                    <div class="detail-value detail-none">None</div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">Priority</div>
                    <div class="detail-value">
                      <span class="priority-badge" :class="`priority-${(issue.priority||'').toLowerCase()}`">
                        {{ issue.priority || 'None' }}
                      </span>
                    </div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">Story points</div>
                    <div class="detail-value detail-none">None</div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">Reporter</div>
                    <div class="detail-value reporter-row">
                      <div class="reporter-avatar">{{ taskStore.currentUser.name.charAt(0) }}</div>
                      <span class="reporter-name">{{ taskStore.currentUser.name }}</span>
                    </div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">Components</div>
                    <div class="detail-value detail-none">None</div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">Sprint</div>
                    <div class="detail-value"><span class="link-text">Sprint 4</span></div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">Fix versions</div>
                    <div class="detail-value detail-none">None</div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">Original est.</div>
                    <div class="detail-value detail-none">Unestimated</div>
                  </div>

                  <div class="detail-row">
                    <div class="detail-label">Time tracking</div>
                    <div class="detail-value" style="flex:1">
                      <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:0%"></div></div>
                    </div>
                  </div>

                </div>
              </div>

              <div class="timestamps">
                Created 1 minute ago<br>Updated 1 minute ago
              </div>
              <div style="display:flex;justify-content:flex-end">
                <button class="btn-ghost-sm">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" stroke-width="2"/></svg>
                  Configure
                </button>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <span class="footer-meta">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Last updated just now
            </span>
            <div style="display:flex;gap:8px">
              <button class="btn-ghost-sm" @click="$emit('update:modelValue', false)">Close</button>
              <button class="btn-primary-sm" @click="handleSave">Save changes</button>
            </div>
          </div>

        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import type { Issue, User } from '@/stores/taskStore'
import { useTaskStore } from '@/stores/taskStore'
import { ref } from 'vue'
import QuillEditor from './QuillEditor.vue'

const props = defineProps<{ modelValue: boolean; issue: Issue | null }>()
const emit = defineEmits(['update:modelValue'])

const isFullscreen = ref(false)
const internalDescription = ref(props.issue?.description || '')
const isDescriptionEditing = ref(false)
const taskStore = useTaskStore()
const detailsOpen = ref(true)
const isDragging = ref(false)
const activityFilter = ref('All')

const attachments = ref([
  { name: 'requirements_v1.pdf', size: '2.4 MB', time: '2 hours ago', uploader: 'Lasam', type: 'pdf', bgClass: 'attach-bg-red' },
  { name: 'design_mockup.png',   size: '1.1 MB', time: 'Yesterday',   uploader: 'Alana Song', type: 'img', bgClass: 'attach-bg-blue' },
])

const enableDescriptionEditing = () => { isDescriptionEditing.value = true }
const saveDescription = () => {
  if (props.issue) props.issue.description = internalDescription.value
  isDescriptionEditing.value = false
}
const cancelDescription = () => {
  internalDescription.value = props.issue?.description || ''
  isDescriptionEditing.value = false
}

const modules = {
  mention: {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    mentionDenotationChars: ['@'],
    source: (searchTerm: string, renderList: Function) => {
      const values = taskStore.users.map(u => ({ id: u.id, value: u.name }))
      renderList(searchTerm ? values.filter(v => v.value.toLowerCase().includes(searchTerm.toLowerCase())) : values, searchTerm)
    },
  },
}

const updateAssignees = (newAssignees: User[]) => { if (props.issue) props.issue.assignees = newAssignees }
const handleSave = () => { if (isDescriptionEditing.value) saveDescription(); emit('update:modelValue', false) }
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(15,23,42,0.4);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
}
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .2s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* Panel */
.modal-panel {
  width: 100%; max-width: 1200px; max-height: 90vh;
  background: #fff; border-radius: 14px;
  display: flex; flex-direction: column;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  overflow: hidden;
}
.modal-panel.fullscreen {
  max-width: 100vw; max-height: 100vh;
  border-radius: 0; position: fixed; inset: 0;
}

/* Toolbar */
.modal-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
  background: #fff;
}
.toolbar-left { display: flex; align-items: center; gap: 8px; }
.toolbar-right { display: flex; align-items: center; gap: 4px; }
.toolbar-breadcrumb { font-size: 12px; color: #94a3b8; }
.issue-key-badge {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 600; color: #4f46e5;
  background: #ede9fe; padding: 3px 8px; border-radius: 6px;
}
.toolbar-count { font-size: 11px; color: #64748b; margin-left: 2px; }

/* Content layout */
.modal-content {
  display: flex; flex: 1; overflow: hidden;
}
.main-col {
  flex: 1; overflow-y: auto; padding: 24px 28px;
  border-right: 1px solid #e2e8f0;
}
.sidebar-col {
  width: 280px; flex-shrink: 0; overflow-y: auto;
  padding: 20px 16px; background: #f8fafc;
}

/* Issue title */
.issue-title { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px; line-height: 1.3; }

/* Action bar */
.action-bar { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.action-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 7px;
  border: 1.5px solid #e2e8f0; background: #fff;
  font-size: 12.5px; color: #374151; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: all .15s;
}
.action-btn:hover { border-color: #a5b4fc; background: #f5f3ff; }
.action-btn.icon-only { padding: 6px 10px; }

/* Sections */
.section { margin-bottom: 28px; }
.section-title { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }

/* Description */
.desc-view {
  min-height: 72px; padding: 12px; border-radius: 8px;
  border: 1.5px solid transparent; cursor: text;
  font-size: 14px; color: #374151; line-height: 1.6;
  transition: border-color .15s, background .15s;
}
.desc-view:hover { border-color: #e2e8f0; background: #f8fafc; }
.desc-placeholder { color: #cbd5e1; }
.desc-editor-wrap {
  border: 1.5px solid #4f46e5; border-radius: 8px; overflow: hidden;
}
.desc-editor-wrap :deep(.ql-toolbar) { border: none !important; border-bottom: 1px solid #f1f5f9 !important; background: #f8fafc; padding: 6px 8px !important; }
.desc-editor-wrap :deep(.ql-container) { border: none !important; font-family: 'Inter', sans-serif; font-size: 14px; }
.desc-editor-wrap :deep(.ql-editor) { min-height: 100px; padding: 10px 12px; }
.desc-actions { display: flex; gap: 8px; padding: 8px 12px; border-top: 1px solid #f1f5f9; }

/* Attachments */
.attach-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.attach-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #fff;
  transition: background .15s;
}
.attach-item:hover { background: #f8fafc; }
.attach-item:hover .attach-actions { opacity: 1; }
.attach-icon {
  width: 38px; height: 38px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.attach-bg-red  { background: #fef2f2; }
.attach-bg-blue { background: #eff6ff; }
.attach-info { flex: 1; min-width: 0; }
.attach-name { font-size: 13px; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.attach-meta { font-size: 11.5px; color: #94a3b8; margin-top: 2px; }
.attach-actions { display: flex; gap: 2px; opacity: 0; transition: opacity .15s; }
.icon-btn-sm {
  width: 26px; height: 26px; border-radius: 5px; border: none;
  background: transparent; cursor: pointer; font-size: 12px;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.icon-btn-sm:hover { background: #f1f5f9; }
.icon-btn-sm.danger:hover { background: #fee2e2; }

/* Dropzone */
.dropzone {
  border: 2px dashed #cbd5e1; border-radius: 10px;
  padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 6px;
  cursor: pointer; transition: all .2s;
}
.dropzone:hover, .dropzone.active { border-color: #4f46e5; background: #f5f3ff; }
.drop-icon { width: 40px; height: 40px; border-radius: 10px; background: #ede9fe; display: flex; align-items: center; justify-content: center; }
.drop-text { font-size: 13px; font-weight: 500; color: #374151; }
.drop-link { color: #4f46e5; font-weight: 700; }
.drop-hint { font-size: 11.5px; color: #94a3b8; }

/* Linked issues */
.linked-item {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  font-size: 13px;
}
.linked-key { font-weight: 700; color: #374151; }
.linked-title { flex: 1; color: #64748b; }
.status-badge { padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 700; }
.badge-blue { background: #dbeafe; color: #1d4ed8; }

/* Subtasks */
.progress-bar-wrap { height: 5px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-bottom: 10px; }
.progress-bar-fill { height: 100%; background: #4f46e5; border-radius: 4px; }
.empty-subtask {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #f8fafc;
  font-size: 13px; color: #94a3b8;
}

/* Activity */
.activity-filter { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.filter-label { font-size: 12px; font-weight: 600; color: #64748b; }
.filter-chip {
  padding: 4px 12px; border-radius: 20px; border: 1.5px solid #e2e8f0;
  background: #fff; font-size: 12px; font-weight: 500; color: #64748b;
  cursor: pointer; transition: all .15s; font-family: 'Inter', sans-serif;
}
.filter-chip:hover { border-color: #a5b4fc; }
.filter-chip.active { border-color: #4f46e5; background: #ede9fe; color: #4f46e5; font-weight: 600; }
.comment-row { display: flex; gap: 12px; align-items: flex-start; }
.comment-avatar {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  background: #22c55e; color: #fff; font-size: 13px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.comment-input-wrap { flex: 1; }
.comment-input {
  width: 100%; padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; color: #374151; font-family: 'Inter', sans-serif; outline: none;
  transition: border-color .15s; box-sizing: border-box;
}
.comment-input:focus { border-color: #4f46e5; }
.comment-hint { font-size: 11.5px; color: #94a3b8; margin-top: 5px; }

/* Sidebar */
.status-select {
  width: 100%; padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; font-weight: 600; color: #1e293b; background: #fff;
  font-family: 'Inter', sans-serif; outline: none; cursor: pointer; margin-bottom: 16px;
}
.details-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 16px; }
.details-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; cursor: pointer; user-select: none;
}
.details-title { font-size: 13px; font-weight: 700; color: #0f172a; }
.details-body { padding: 4px 0 8px; border-top: 1px solid #f1f5f9; }
.detail-row {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 8px 14px; border-bottom: 1px solid #f8fafc;
}
.detail-row:last-child { border-bottom: none; }
.detail-label { width: 100px; min-width: 100px; font-size: 12px; color: #94a3b8; padding-top: 2px; }
.detail-value { flex: 1; font-size: 13px; color: #374151; }
.detail-none { color: #cbd5e1; }
.assignee-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.assignee-chip {
  display: flex; align-items: center; gap: 5px;
  padding: 2px 8px; border-radius: 20px;
  background: #f1f5f9; font-size: 11.5px; color: #374151;
}
.chip-avatar { width: 18px; height: 18px; border-radius: 50%; object-fit: cover; }
.priority-badge { padding: 2px 8px; border-radius: 20px; font-size: 11.5px; font-weight: 600; }
.priority-high   { background: #fee2e2; color: #dc2626; }
.priority-medium { background: #fef3c7; color: #d97706; }
.priority-low    { background: #dcfce7; color: #15803d; }
.reporter-row { display: flex; align-items: center; gap: 7px; }
.reporter-avatar {
  width: 22px; height: 22px; border-radius: 50%;
  background: #22c55e; color: #fff; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.reporter-name { color: #4f46e5; font-size: 13px; }
.link-text { color: #4f46e5; cursor: pointer; font-size: 13px; }
.link-text:hover { text-decoration: underline; }
.timestamps { font-size: 11.5px; color: #94a3b8; line-height: 1.7; margin-bottom: 12px; }

/* Footer */
.modal-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px; border-top: 1px solid #e2e8f0; flex-shrink: 0; background: #fff;
}
.footer-meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #94a3b8; }

/* Shared buttons */
.icon-btn {
  width: 28px; height: 28px; border-radius: 6px; border: none;
  background: transparent; cursor: pointer; color: #64748b;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.icon-btn:hover { background: #f1f5f9; }
.close-btn:hover { background: #fee2e2; color: #dc2626; }

.btn-add {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: 6px;
  border: 1.5px solid #e2e8f0; background: #fff;
  font-size: 12px; font-weight: 600; color: #4f46e5;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: all .15s;
}
.btn-add:hover { background: #ede9fe; border-color: #a5b4fc; }

.btn-primary-sm {
  padding: 7px 16px; border-radius: 7px; border: none;
  background: #4f46e5; color: #fff; font-size: 13px; font-weight: 600;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: background .15s;
}
.btn-primary-sm:hover { background: #4338ca; }

.btn-ghost-sm {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 12px; border-radius: 7px; border: none;
  background: transparent; font-size: 13px; color: #64748b;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: background .15s;
}
.btn-ghost-sm:hover { background: #f1f5f9; }
</style>
