<template>
  <div class="backlog-page">
    <ProjectHeader active-tab="backlog" />

    <!-- Toolbar -->
    <div class="bl-toolbar">
      <div class="bl-toolbar-left">
        <div class="search-wrap">
          <v-icon size="14" color="#94a3b8" style="position:absolute;left:10px;top:50%;transform:translateY(-50%)">mdi-magnify</v-icon>
          <input class="search-input" placeholder="Search backlog..." />
        </div>
        <div class="avatar-chip">SB</div>
        <button class="tool-btn"><v-icon size="13">mdi-filter-variant</v-icon> Filter</button>
      </div>
      <div class="bl-toolbar-right">
        <button class="icon-btn"><v-icon size="15">mdi-arrow-collapse-down</v-icon></button>
        <button class="icon-btn"><v-icon size="15">mdi-wrench-outline</v-icon></button>
        <button class="icon-btn"><v-icon size="15">mdi-dots-horizontal</v-icon></button>
      </div>
    </div>

    <!-- Body -->
    <div class="bl-body">

      <!-- Sprint Section -->
      <div class="section">
        <div class="section-header">
          <div class="section-header-left" @click="sprintCollapsed = !sprintCollapsed">
            <v-icon size="16" color="#64748b">{{ sprintCollapsed ? 'mdi-chevron-right' : 'mdi-chevron-down' }}</v-icon>
            <span class="section-title">{{ sprintDetails.name }}</span>
            <span v-if="isSprintActive" class="section-dates">{{ formatDates(sprintDetails.startDate, sprintDetails.endDate) }}</span>
            <span class="section-count">({{ sprintIssues.length }} items)</span>
          </div>
          <div class="section-header-right">
            <div class="status-pills">
              <span class="pill pill-grey">0</span>
              <span class="pill pill-blue">0</span>
              <span class="pill pill-green">0</span>
            </div>
            <button v-if="!isSprintActive" class="btn-secondary" :disabled="sprintIssues.length === 0" @click="isStartDialogOpen = true">Start sprint</button>
            <button v-else class="btn-secondary" @click="completeSprint">Complete sprint</button>
            <button class="icon-btn"><v-icon size="15">mdi-dots-horizontal</v-icon></button>
          </div>
        </div>

        <template v-if="!sprintCollapsed">
          <!-- Empty state -->
          <div v-if="sprintIssues.length === 0" class="empty-sprint">
            <div class="empty-shapes">
              <span class="shape shape-circle"></span>
              <span class="shape shape-triangle"></span>
              <span class="shape shape-square"></span>
            </div>
            <div class="empty-title">Plan your sprint</div>
            <div class="empty-sub">Drag work items from the <strong>Backlog</strong> or create new ones, then click <strong>Start sprint</strong>.</div>
          </div>

          <!-- Issue rows -->
          <div v-else class="issue-list">
            <div v-for="issue in sprintIssues" :key="issue.id" class="issue-row">
              <div class="issue-type-icon" :style="`background:${getIcon(issue.type).color}`">
                <v-icon size="12" color="white">{{ getIcon(issue.type).icon }}</v-icon>
              </div>
              <span class="issue-key">{{ issue.key }}</span>
              <span class="issue-summary">{{ issue.summary }}</span>
              <div class="issue-actions">
                <span class="status-tag">{{ issue.status }}</span>
                <img v-if="issue.assignees[0]" :src="issue.assignees[0].avatar" class="assignee-avatar" />
                <div v-else class="assignee-avatar assignee-empty"><v-icon size="13" color="#94a3b8">mdi-account-outline</v-icon></div>
              </div>
            </div>
          </div>

          <!-- Inline create -->
          <div v-if="creatingSprintIssue" class="inline-create">
            <v-icon size="16" color="#4f46e5">mdi-checkbox-marked-outline</v-icon>
            <input v-model="newSprintTitle" class="inline-input" placeholder="Describe what needs to be done."
              autofocus @keyup.enter="createSprintIssue" @keydown.esc="creatingSprintIssue = false" />
            <button class="btn-create" @click="createSprintIssue">Create</button>
            <button class="btn-cancel-sm" @click="creatingSprintIssue = false">Cancel</button>
          </div>
          <button v-else class="btn-add" @click="creatingSprintIssue = true">
            <v-icon size="13">mdi-plus</v-icon> Create
          </button>
        </template>
      </div>

      <!-- Divider -->
      <div class="estimate-divider">
        <div class="divider-line"></div>
        <v-icon size="16" color="#94a3b8">mdi-unfold-more-horizontal</v-icon>
        <div class="divider-line"></div>
        <span class="divider-meta"><strong>0</strong> of <strong>0</strong> visible &nbsp;|&nbsp; Estimate: <strong>0</strong> of <strong>0</strong></span>
      </div>

      <!-- Backlog Section -->
      <div class="section">
        <div class="section-header">
          <div class="section-header-left" @click="backlogCollapsed = !backlogCollapsed">
            <v-icon size="16" color="#64748b">{{ backlogCollapsed ? 'mdi-chevron-right' : 'mdi-chevron-down' }}</v-icon>
            <span class="section-title">Backlog</span>
            <span class="section-count">({{ backlogIssues.length }} items)</span>
          </div>
          <div class="section-header-right">
            <div class="status-pills">
              <span class="pill pill-grey">0</span>
              <span class="pill pill-blue">0</span>
              <span class="pill pill-green">0</span>
            </div>
            <button class="btn-secondary">Create sprint</button>
          </div>
        </div>

        <template v-if="!backlogCollapsed">
          <div v-if="backlogIssues.length > 0" class="issue-list">
            <div v-for="issue in backlogIssues" :key="issue.id" class="issue-row">
              <div class="issue-type-icon" :style="`background:${getIcon(issue.type).color}`">
                <v-icon size="12" color="white">{{ getIcon(issue.type).icon }}</v-icon>
              </div>
              <span class="issue-key">{{ issue.key }}</span>
              <span class="issue-summary">{{ issue.summary }}</span>
              <div class="issue-actions">
                <span class="status-tag">{{ issue.status === 'TODO' ? 'TO DO' : issue.status }}</span>
                <img v-if="issue.assignees[0]" :src="issue.assignees[0].avatar" class="assignee-avatar" />
                <div v-else class="assignee-avatar assignee-empty"><v-icon size="13" color="#94a3b8">mdi-account-outline</v-icon></div>
              </div>
            </div>
          </div>

          <div v-if="creatingBacklogIssue" class="inline-create">
            <v-icon size="16" color="#4f46e5">mdi-checkbox-marked-outline</v-icon>
            <input v-model="newBacklogTitle" class="inline-input" placeholder="Describe what needs to be done."
              autofocus @keyup.enter="createBacklogIssue" @keydown.esc="creatingBacklogIssue = false" />
            <button class="btn-create" @click="createBacklogIssue">Create</button>
            <button class="btn-cancel-sm" @click="creatingBacklogIssue = false">Cancel</button>
          </div>
          <button v-else class="btn-add" @click="creatingBacklogIssue = true">
            <v-icon size="13">mdi-plus</v-icon> Create
          </button>
        </template>
      </div>
    </div>

    <!-- Start Sprint Dialog -->
    <div v-if="isStartDialogOpen" class="dialog-overlay" @click.self="isStartDialogOpen = false">
      <div class="dialog-box">
        <div class="dialog-header">
          <span class="dialog-title">Start Sprint</span>
          <button class="close-btn" @click="isStartDialogOpen = false">✕</button>
        </div>
        <div class="dialog-body">
          <p class="dialog-info"><strong>{{ sprintIssues.length }}</strong> work item(s) will be included.</p>
          <div class="field-group">
            <label class="field-label">Sprint name <span class="req">*</span></label>
            <input v-model="sprintDetails.name" class="field-input" />
          </div>
          <div class="field-group">
            <label class="field-label">Duration</label>
            <select v-model="sprintDetails.duration" class="field-input field-select">
              <option v-for="d in ['custom','1 week','2 weeks','3 weeks','4 weeks']" :key="d">{{ d }}</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Start date <span class="req">*</span></label>
            <input v-model="sprintDetails.startDate" type="datetime-local" class="field-input" />
          </div>
          <div class="field-group">
            <label class="field-label">End date <span class="req">*</span></label>
            <input v-model="sprintDetails.endDate" type="datetime-local" class="field-input" />
          </div>
          <div class="field-group">
            <label class="field-label">Sprint goal</label>
            <textarea v-model="sprintDetails.goal" class="field-input field-textarea" rows="3" placeholder="What is the goal of this sprint?"></textarea>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-cancel-dialog" @click="isStartDialogOpen = false">Cancel</button>
          <button class="btn-primary-dialog" @click="startSprint">Start Sprint</button>
        </div>
      </div>
    </div>

    <!-- Complete Sprint Dialog -->
    <div v-if="isCompleteDialogOpen" class="dialog-overlay" @click.self="isCompleteDialogOpen = false">
      <div class="dialog-box">
        <div class="complete-hero">
          <svg viewBox="0 0 400 100" width="100%" height="100">
            <path d="M0,60 Q100,20 200,50 T400,30 L400,100 L0,100 Z" fill="#4f46e5" opacity=".15"/>
            <path d="M0,80 Q100,50 200,70 T400,55 L400,100 L0,100 Z" fill="#4f46e5" opacity=".25"/>
          </svg>
          <div class="complete-badge">🏅</div>
        </div>
        <div class="dialog-header" style="border-top:1px solid #e2e8f0;margin-top:8px">
          <span class="dialog-title">Complete {{ sprintDetails.name }}</span>
          <button class="close-btn" @click="isCompleteDialogOpen = false">✕</button>
        </div>
        <div class="dialog-body">
          <p class="dialog-info">
            <strong>{{ completedCount }}</strong> completed · <strong>{{ openCount }}</strong> open items.
          </p>
          <div class="field-group">
            <label class="field-label">Move open items to</label>
            <select v-model="moveTo" class="field-input field-select">
              <option>EX Sprint 2</option>
              <option>Backlog</option>
            </select>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-cancel-dialog" @click="isCompleteDialogOpen = false">Cancel</button>
          <button class="btn-primary-dialog" @click="confirmComplete">Complete sprint</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import ProjectHeader from '@/components/ProjectHeader.vue'

const store = useTaskStore()

const sprintIssues  = computed(() => store.issues.filter(i => i.sprintId === 'sprint-1'))
const backlogIssues = computed(() => store.issues.filter(i => !i.sprintId))

const sprintCollapsed  = ref(false)
const backlogCollapsed = ref(false)
const isSprintActive   = ref(false)
const isStartDialogOpen    = ref(false)
const isCompleteDialogOpen = ref(false)
const moveTo = ref('EX Sprint 2')

const sprintDetails = ref({ name: 'EX Sprint 1', duration: 'custom', startDate: '', endDate: '', goal: '' })

const completedCount = computed(() => sprintIssues.value.filter(i => i.status === 'DONE').length)
const openCount      = computed(() => sprintIssues.value.filter(i => i.status !== 'DONE').length)

const formatDates = (s: string, e: string) => {
  if (!s || !e) return ''
  return `${new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${new Date(e).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
}

const startSprint   = () => { isSprintActive.value = true; isStartDialogOpen.value = false }
const completeSprint = () => { isCompleteDialogOpen.value = true }
const confirmComplete = () => { isSprintActive.value = false; isCompleteDialogOpen.value = false; sprintDetails.value.name = 'EX Sprint 2' }

const getIcon = (type: string) => ({
  Task:  { icon: 'mdi-check-bold',   color: '#3b82f6' },
  Bug:   { icon: 'mdi-circle',       color: '#ef4444' },
  Story: { icon: 'mdi-bookmark',     color: '#22c55e' },
  Epic:  { icon: 'mdi-lightning-bolt', color: '#8b5cf6' },
}[type] ?? { icon: 'mdi-check-bold', color: '#3b82f6' })

const creatingSprintIssue = ref(false)
const newSprintTitle = ref('')
const createSprintIssue = () => {
  if (!newSprintTitle.value.trim()) return
  store.createIssue({ summary: newSprintTitle.value, status: 'TODO', priority: 'Medium', assignees: [], type: 'Task', sprintId: 'sprint-1' })
  newSprintTitle.value = ''; creatingSprintIssue.value = false
}

const creatingBacklogIssue = ref(false)
const newBacklogTitle = ref('')
const createBacklogIssue = () => {
  if (!newBacklogTitle.value.trim()) return
  store.createIssue({ summary: newBacklogTitle.value, status: 'TODO', priority: 'Medium', assignees: [], type: 'Task' })
  newBacklogTitle.value = ''; creatingBacklogIssue.value = false
}
</script>

<style scoped>
.backlog-page {
  display: flex; flex-direction: column; height: 100%;
  font-family: 'Inter', sans-serif; background: #f8fafc; overflow: hidden;
}

/* Toolbar */
.bl-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 24px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; gap: 12px;
}
.bl-toolbar-left, .bl-toolbar-right { display: flex; align-items: center; gap: 8px; }
.search-wrap { position: relative; }
.search-input {
  padding: 6px 10px 6px 30px; border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; color: #1e293b; background: #f8fafc; outline: none; width: 200px;
  font-family: 'Inter', sans-serif;
}
.search-input:focus { border-color: #4f46e5; background: #fff; }
.avatar-chip {
  width: 30px; height: 30px; border-radius: 50%; background: #f97316;
  color: #fff; font-size: 11px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.tool-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px;
  border: 1px solid #e2e8f0; border-radius: 8px; background: #fff;
  font-size: 12.5px; color: #475569; cursor: pointer; font-family: 'Inter', sans-serif;
}
.tool-btn:hover { background: #f1f5f9; }
.icon-btn {
  width: 30px; height: 30px; border: 1px solid #e2e8f0; border-radius: 7px;
  background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #64748b; transition: background .12s;
}
.icon-btn:hover { background: #f1f5f9; }

/* Body */
.bl-body { flex: 1; overflow-y: auto; padding: 20px 24px 32px; display: flex; flex-direction: column; gap: 20px; }

/* Section */
.section { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.section-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-bottom: 1px solid #f1f5f9; cursor: pointer;
}
.section-header:hover { background: #fafafa; }
.section-header-left { display: flex; align-items: center; gap: 8px; }
.section-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.section-dates { font-size: 12px; color: #94a3b8; }
.section-count { font-size: 12px; color: #94a3b8; }
.section-header-right { display: flex; align-items: center; gap: 8px; }
.status-pills { display: flex; gap: 4px; }
.pill { padding: 1px 8px; border-radius: 10px; font-size: 11px; font-weight: 700; }
.pill-grey  { background: #f1f5f9; color: #64748b; }
.pill-blue  { background: #dbeafe; color: #1d4ed8; }
.pill-green { background: #dcfce7; color: #15803d; }
.btn-secondary {
  padding: 5px 12px; border: 1px solid #e2e8f0; border-radius: 7px;
  background: #f8fafc; font-size: 12.5px; font-weight: 500; color: #475569;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s;
}
.btn-secondary:hover:not(:disabled) { background: #f1f5f9; }
.btn-secondary:disabled { opacity: .45; cursor: not-allowed; }

/* Empty state */
.empty-sprint {
  padding: 32px 24px; display: flex; flex-direction: column; align-items: center; gap: 10px;
  border: 2px dashed #e2e8f0; margin: 12px; border-radius: 10px; background: #fafafa;
}
.empty-shapes { display: flex; gap: 6px; align-items: center; }
.shape { display: inline-block; }
.shape-circle   { width: 22px; height: 22px; border-radius: 50%; background: #8b5cf6; opacity: .8; }
.shape-triangle { width: 0; height: 0; border-left: 11px solid transparent; border-right: 11px solid transparent; border-bottom: 20px solid #f97316; opacity: .8; }
.shape-square   { width: 20px; height: 20px; background: #22c55e; opacity: .8; border-radius: 3px; }
.empty-title { font-size: 14px; font-weight: 700; color: #0f172a; }
.empty-sub   { font-size: 13px; color: #64748b; text-align: center; max-width: 420px; line-height: 1.5; }

/* Issue list */
.issue-list { display: flex; flex-direction: column; }
.issue-row {
  display: flex; align-items: center; gap: 10px; padding: 9px 16px;
  border-bottom: 1px solid #f1f5f9; transition: background .1s;
}
.issue-row:last-child { border-bottom: none; }
.issue-row:hover { background: #f8fafc; }
.issue-type-icon {
  width: 20px; height: 20px; border-radius: 5px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.issue-key { font-size: 12px; color: #94a3b8; font-weight: 600; width: 52px; flex-shrink: 0; }
.issue-summary { flex: 1; font-size: 13px; color: #1e293b; cursor: pointer; }
.issue-summary:hover { text-decoration: underline; }
.issue-actions { display: flex; align-items: center; gap: 8px; opacity: .7; transition: opacity .15s; }
.issue-row:hover .issue-actions { opacity: 1; }
.status-tag {
  padding: 2px 8px; background: #f1f5f9; border-radius: 5px;
  font-size: 11px; font-weight: 600; color: #475569; white-space: nowrap;
}
.assignee-avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; }
.assignee-empty  { width: 24px; height: 24px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; }

/* Inline create */
.inline-create {
  display: flex; align-items: center; gap: 8px; padding: 8px 16px;
  border-top: 1px solid #e2e8f0; background: #fff;
  border: 1px solid #4f46e5; border-radius: 0 0 12px 12px;
  box-shadow: 0 0 0 2px rgba(79,70,229,.1);
}
.inline-input {
  flex: 1; border: none; outline: none; font-size: 13px; color: #1e293b;
  font-family: 'Inter', sans-serif; background: transparent;
}
.inline-input::placeholder { color: #94a3b8; }
.btn-create {
  padding: 4px 12px; background: #4f46e5; color: #fff; border: none;
  border-radius: 6px; font-size: 12.5px; font-weight: 600; cursor: pointer;
  font-family: 'Inter', sans-serif;
}
.btn-cancel-sm {
  padding: 4px 10px; background: none; border: 1px solid #e2e8f0;
  border-radius: 6px; font-size: 12.5px; color: #64748b; cursor: pointer;
  font-family: 'Inter', sans-serif;
}
.btn-add {
  display: inline-flex; align-items: center; gap: 4px; margin: 10px 16px;
  padding: 5px 12px; background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 7px; font-size: 12.5px; color: #64748b; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: background .12s;
}
.btn-add:hover { background: #f1f5f9; color: #4f46e5; }

/* Divider */
.estimate-divider {
  display: flex; align-items: center; gap: 10px; padding: 0 4px;
}
.divider-line { flex: 1; border-top: 2px dashed #e2e8f0; }
.divider-meta { font-size: 12px; color: #94a3b8; white-space: nowrap; }

/* Dialog */
.dialog-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px;
}
.dialog-box {
  background: #fff; border-radius: 14px; width: 100%; max-width: 520px;
  max-height: 90vh; display: flex; flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,.18); font-family: 'Inter', sans-serif;
  animation: fadeUp .2s ease; overflow: hidden;
}
@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
.complete-hero { position: relative; overflow: hidden; }
.complete-badge {
  position: absolute; bottom: -16px; left: 50%; transform: translateX(-50%);
  font-size: 40px; z-index: 2;
}
.dialog-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 24px 14px; border-bottom: 1px solid #e2e8f0;
}
.dialog-title { font-size: 16px; font-weight: 700; color: #0f172a; }
.close-btn { background: none; border: none; cursor: pointer; font-size: 14px; color: #94a3b8; padding: 4px 8px; border-radius: 6px; }
.close-btn:hover { background: #f1f5f9; }
.dialog-body { padding: 18px 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 14px; }
.dialog-info { font-size: 13px; color: #475569; margin: 0; }
.field-group { display: flex; flex-direction: column; gap: 5px; }
.field-label { font-size: 13px; font-weight: 600; color: #374151; }
.req { color: #ef4444; }
.field-input {
  padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 13px; color: #1e293b; background: #f8fafc; outline: none;
  font-family: 'Inter', sans-serif; transition: border-color .15s;
}
.field-input:focus { border-color: #4f46e5; background: #fff; }
.field-select { appearance: none; cursor: pointer; }
.field-textarea { resize: vertical; min-height: 80px; }
.dialog-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 14px 24px; border-top: 1px solid #e2e8f0; background: #f8fafc;
}
.btn-cancel-dialog {
  padding: 8px 16px; border: 1px solid #e2e8f0; border-radius: 8px;
  background: #fff; font-size: 13px; color: #475569; cursor: pointer; font-family: 'Inter', sans-serif;
}
.btn-cancel-dialog:hover { background: #f1f5f9; }
.btn-primary-dialog {
  padding: 8px 20px; border: none; border-radius: 8px;
  background: #4f46e5; color: #fff; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: 'Inter', sans-serif;
}
.btn-primary-dialog:hover { background: #4338ca; }
</style>
