<template>
  <div class="list-root" @click="closeAll">
    <div class="list-wrap">
      <table class="list-table">
        <thead>
          <tr>
            <th style="width:44%">Name</th>
            <th style="width:13%">Due date</th>
            <th style="width:18%">Assignees</th>
            <th style="width:13%">Project</th>
            <th style="width:12%">Priority</th>
          </tr>
        </thead>
        <tbody>
          <tr class="group-row">
            <td colspan="5">
              <div class="group-label" @click.stop="collapsed = !collapsed">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" :style="{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0)', transition: 'transform .2s' }"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Recently assigned
                <span class="group-count">{{ tasks.length }}</span>
              </div>
            </td>
          </tr>
          <template v-if="!collapsed">
            <tr v-for="(task, i) in tasks" :key="task.id"
              class="list-row" :style="{ animationDelay: i * 35 + 'ms' }"
              @click.stop="openTask(task)">
              <td class="name-cell">
                <button class="check-btn" :class="{ done: task.done }" @click.stop="task.done = !task.done">
                  <svg v-if="task.done" width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#10b981"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#cbd5e1" stroke-width="2"/></svg>
                </button>
                <span class="t-name" :class="{ 'is-done': task.done }">{{ task.name }}</span>
                <span v-if="task.comments?.length" class="cmt-badge">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ task.comments.length }}
                </span>
              </td>
              <td class="due-cell" :class="{ overdue: task.overdue }">
                <template v-if="task.dueDate">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style="margin-right:3px"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  {{ task.date }}
                </template>
                <span v-else style="color:#cbd5e1">—</span>
              </td>
              <td>
                <div class="avatar-stack">
                  <div v-if="task.assignee" class="mini-av" :style="{ background: task.assignee.bg }" :title="task.assignee.name">{{ task.assignee.initials }}</div>
                </div>
              </td>
              <td>
                <span v-if="task.project" class="proj-chip">{{ task.project }}</span>
              </td>
              <td>
                <span v-if="task.priority" class="prio-pill" :class="`prio-${task.priority.toLowerCase()}`">{{ task.priority }}</span>
              </td>
            </tr>
            <tr class="add-row" @click.stop="addTask">
              <td colspan="5">
                <span class="add-inner">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                  Add task
                </span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Task Detail Panel -->
    <transition name="panel-slide">
      <div v-if="selected" class="panel-overlay">
        <div class="panel" @click.stop>

          <!-- Toolbar -->
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

          <!-- Body -->
          <div class="panel-body" @click="collabPickerOpen = false; taskMenuOpen = false; assigneePickerOpen = false">

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
                  <div style="position:relative">
                    <div v-if="selected.assignee" class="assignee-chip" ref="assigneeTriggerRef" @click.stop="toggleAssigneePicker">
                      <div class="chip-av" :style="{ background: selected.assignee.bg }">{{ selected.assignee.initials }}</div>
                      {{ selected.assignee.name }}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style="opacity:.5;margin-left:2px"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </div>
                    <button v-else class="meta-btn" ref="assigneeTriggerRef" @click.stop="toggleAssigneePicker">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="11" x2="16" y2="11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                      Assign to me
                    </button>
                  </div>
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
                    <button class="prio-btn prio-med"  :class="{ active: selected.priority === 'Medium' }" @click="selected.priority = 'Medium'">Medium</button>
                    <button class="prio-btn prio-low"  :class="{ active: selected.priority === 'Low' }" @click="selected.priority = 'Low'">Low</button>
                  </div>
                </div>
              </div>
              <div class="meta-row">
                <span class="meta-label">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Project
                </span>
                <div class="meta-val">
                  <span v-if="selected.project" class="proj-chip-meta">
                    <span class="proj-dot"></span>{{ selected.project }}
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
                <button class="check-btn check-btn--md" :class="{ done: st.done }" @click="st.done = !st.done">
                  <svg v-if="st.done" width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#10b981"/><path d="M8 12l3 3 5-5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#cbd5e1" stroke-width="2"/></svg>
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

    <!-- Assignee picker teleported -->
    <teleport to="body">
      <div v-if="assigneePickerOpen && selected" class="assignee-picker-fixed" :style="assigneePickerStyle" @click.stop>
        <div class="assignee-picker-title">Assign to</div>
        <div class="assignee-search-wrap">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#94a3b8" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/></svg>
          <input class="assignee-search-input" v-model="assigneeSearch" placeholder="Search name…" @click.stop />
        </div>
        <div v-for="u in filteredAssignees" :key="u.name"
          class="assignee-picker-item" :class="{ 'is-selected': selected.assignee?.name === u.name }"
          @click="selected.assignee = { ...u }; assigneePickerOpen = false">
          <div class="assignee-picker-av" :style="{ background: u.bg }">{{ u.initials }}</div>
          <span class="assignee-picker-name">{{ u.name }}</span>
          <svg v-if="selected.assignee?.name === u.name" width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div v-if="filteredAssignees.length === 0" class="assignee-no-results">No users found</div>
        <div class="assignee-picker-divider"></div>
        <div class="assignee-picker-item" @click="selected.assignee = undefined; assigneePickerOpen = false">
          <div class="assignee-picker-av" style="background:#f1f5f9">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round"/></svg>
          </div>
          <span class="assignee-picker-name" style="color:#94a3b8">Unassign</span>
        </div>
      </div>
    </teleport>

  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

interface Subtask    { id: number; name: string; done: boolean }
interface Comment    { id: number; author: string; avInitials: string; avBg: string; text: string; time: string }
interface Assignee   { name: string; initials: string; bg: string }
interface Attachment { name: string }
interface Task {
  id: number; name: string; done: boolean
  date?: string; dueDate?: string; overdue?: boolean
  priority?: 'High' | 'Medium' | 'Low'
  assignee?: Assignee; project?: string; description?: string
  subtasks: Subtask[]; comments: Comment[]; collaborators: Assignee[]; attachments: Attachment[]
}

const collapsed           = ref(false)
const selected            = ref<Task | null>(null)
const taskMenuOpen        = ref(false)
const collabPickerOpen    = ref(false)
const assigneePickerOpen  = ref(false)
const assigneeSearch      = ref('')
const assigneeTriggerRef  = ref<HTMLElement | null>(null)
const assigneePickerStyle = ref({})
const newComment          = ref('')

const tasks = reactive<Task[]>([
  { id:1, name:'Partner library task updates', done:false, date:'29 Jan', dueDate:'2025-01-29', priority:'High', assignee:{ name:'Arjun P.', initials:'AP', bg:'#fed7aa' }, project:'Execora', description:'', subtasks:[{ id:1, name:'Review changelog', done:false }], comments:[{ id:1, author:'Sara M.', avInitials:'SM', avBg:'#fef3c7', text:'LGTM! Ship it 🚀', time:'2 days ago' }], collaborators:[{ name:'Sara M.', initials:'SM', bg:'#fef3c7' }], attachments:[] },
  { id:2, name:'Mutual Fund - Backoffice', done:false, priority:'Medium', assignee:{ name:'Raj R.', initials:'RR', bg:'#fde68a' }, project:'Finance', description:'', subtasks:[], comments:[], collaborators:[], attachments:[] },
  { id:3, name:'Performance Dashboard Requirement and Implementation', done:false, date:'Friday', dueDate:'2025-03-14', overdue:true, priority:'High', assignee:{ name:'Uma P.', initials:'UP', bg:'#ede9fe' }, project:'Analytics', description:'Cover all dashboard flows.', subtasks:[{ id:1, name:'Gather requirements', done:true }, { id:2, name:'Design mockup', done:false }], comments:[{ id:1, author:'Arjun P.', avInitials:'AP', avBg:'#fed7aa', text:'Needs review before Friday.', time:'1 day ago' }], collaborators:[], attachments:[{ name:'requirements.pdf' }] },
  { id:4, name:'Sprint 24 retrospective action items', done:true, date:'Mar 10', dueDate:'2025-03-10', priority:'Low', assignee:{ name:'Sara M.', initials:'SM', bg:'#fef3c7' }, project:'Execora', description:'', subtasks:[], comments:[], collaborators:[], attachments:[] },
  { id:5, name:'API rate limit strategy discussion', done:false, date:'Mar 18', dueDate:'2025-03-18', priority:'Medium', assignee:{ name:'Arjun P.', initials:'AP', bg:'#fed7aa' }, project:'Backend', description:'', subtasks:[], comments:[], collaborators:[], attachments:[] },
])

let nextId = 50
let cid    = 500

const addTask = () => {
  tasks.push({ id: nextId++, name: 'New task', done: false, subtasks: [], comments: [], collaborators: [], attachments: [] })
}

const openTask = (task: Task) => {
  selected.value = task
  taskMenuOpen.value = false
  collabPickerOpen.value = false
}

const toggleDone = (task: Task) => {
  task.done = !task.done
}

const closeAll = () => {
  taskMenuOpen.value = false
  collabPickerOpen.value = false
  assigneePickerOpen.value = false
}

const toggleAssigneePicker = () => {
  assigneePickerOpen.value = !assigneePickerOpen.value
  if (assigneePickerOpen.value && assigneeTriggerRef.value) {
    assigneeSearch.value = ''
    const rect = assigneeTriggerRef.value.getBoundingClientRect()
    assigneePickerStyle.value = { position: 'fixed', top: rect.bottom + 6 + 'px', left: rect.left + 'px', zIndex: 9999 }
  }
}

const addSubtask = () => {
  if (selected.value) selected.value.subtasks.push({ id: Date.now(), name: 'New subtask', done: false })
}

const removeSubtask = (id: number) => {
  if (selected.value) selected.value.subtasks = selected.value.subtasks.filter(s => s.id !== id)
}

const removeAttachment = (name: string) => {
  if (selected.value) selected.value.attachments = selected.value.attachments.filter(a => a.name !== name)
}

const postComment = () => {
  if (!selected.value || !newComment.value.trim()) return
  selected.value.comments.push({ id: cid++, author: 'Me', avInitials: 'Me', avBg: '#4f46e5', text: newComment.value.trim(), time: 'Just now' })
  newComment.value = ''
}

const deleteComment = (id: number) => {
  if (selected.value) selected.value.comments = selected.value.comments.filter(c => c.id !== id)
}

const availableCollaborators: Assignee[] = [
  { name: 'Arjun P.', initials: 'AP', bg: '#fed7aa' },
  { name: 'Sara M.',  initials: 'SM', bg: '#fef3c7' },
  { name: 'Raj R.',   initials: 'RR', bg: '#fde68a' },
  { name: 'Uma P.',   initials: 'UP', bg: '#ede9fe' },
  { name: 'Lasa M.',  initials: 'LM', bg: '#cffafe' },
  { name: 'Dev K.',   initials: 'DK', bg: '#d1fae5' },
]

const filteredAssignees = computed(() =>
  assigneeSearch.value.trim()
    ? availableCollaborators.filter(u => u.name.toLowerCase().includes(assigneeSearch.value.toLowerCase()))
    : availableCollaborators
)

const toggleCollaborator = (user: Assignee) => {
  if (!selected.value) return
  const idx = selected.value.collaborators.findIndex(c => c.name === user.name)
  idx !== -1 ? selected.value.collaborators.splice(idx, 1) : selected.value.collaborators.push({ ...user })
}

const removeCollaborator = (name: string) => {
  if (selected.value) selected.value.collaborators = selected.value.collaborators.filter(c => c.name !== name)
}

const duplicateTask = () => {
  if (!selected.value) return
  const copy: Task = { ...JSON.parse(JSON.stringify(selected.value)), id: nextId++ }
  copy.name += ' (copy)'
  tasks.push(copy)
}

const deleteTask = () => {
  if (!selected.value) return
  const idx = tasks.findIndex(t => t.id === selected.value!.id)
  if (idx !== -1) tasks.splice(idx, 1)
  selected.value = null
}

const autoResize = (e: Event) => {
  const el = e.target as HTMLTextAreaElement
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}
</script>
<style scoped>
.list-root { display:flex; flex-direction:column; height:100%; overflow:hidden; font-family:'Inter',sans-serif; }
.list-wrap { flex:1; overflow-y:auto; padding:16px 24px; }
.list-table { width:100%; border-collapse:collapse; background:#fff; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden; }
.list-table thead th { padding:10px 14px; text-align:left; font-size:11px; font-weight:600; color:#94a3b8; background:#f8fafc; border-bottom:1px solid #e2e8f0; text-transform:uppercase; letter-spacing:.04em; }
.group-row td { padding:0; }
.group-label { display:flex; align-items:center; gap:6px; padding:9px 14px; font-size:12px; font-weight:700; color:#475569; background:#f8fafc; border-bottom:1px solid #e2e8f0; cursor:pointer; user-select:none; }
.group-label:hover { background:#f1f5f9; }
.group-count { background:#e2e8f0; color:#64748b; font-size:10px; font-weight:700; padding:1px 6px; border-radius:20px; }
.list-row { cursor:pointer; animation:fadeUp .22s ease both; }
.list-row:hover td { background:#f8fafc; }
.list-row td { padding:10px 14px; border-bottom:1px solid #f1f5f9; vertical-align:middle; font-size:13px; }
.name-cell { display:flex; align-items:center; gap:8px; }
.name-cell .check-btn { width:28px; height:28px; }
.t-name { font-size:13px; font-weight:500; color:#0f172a; }
.cmt-badge { display:inline-flex; align-items:center; gap:3px; font-size:11px; color:#94a3b8; }
.due-cell { font-size:12px; color:#64748b; white-space:nowrap; display:flex; align-items:center; }
.due-cell.overdue { color:#ef4444; font-weight:600; }
.avatar-stack { display:flex; }
.mini-av { width:24px; height:24px; border-radius:50%; border:2px solid #fff; display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:700; color:#475569; overflow:hidden; flex-shrink:0; }
.add-row { cursor:pointer; }
.add-row:hover td { background:#f8fafc; }
.add-row td { padding:9px 14px; border-top:1px dashed #e2e8f0; }
.add-inner { display:inline-flex; align-items:center; gap:5px; font-size:12.5px; color:#94a3b8; transition:color .12s; }
.add-row:hover .add-inner { color:#4f46e5; }
</style>