<template>
  <div class="ph-wrap">
    <!-- Breadcrumb -->
    <div class="ph-bc">Spaces</div>

    <!-- Title + right actions -->
    <div class="ph-title-row">
      <div class="ph-title-left">
        <div class="ph-icon">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="white" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="white" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="white" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="white" stroke-width="2"/></svg>
        </div>
        <span class="ph-name">Cryptocurrency Payment Gateway</span>
        <button class="ph-icon-btn" title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <button class="ph-icon-btn" title="More">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>
        </button>
      </div>
      <div class="ph-title-right">
        <button class="ph-icon-btn" title="Share">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2"/><circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <button class="ph-icon-btn" title="Automate">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button class="ph-icon-btn" title="View">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="ph-tabs">
      <router-link v-for="tab in routeTabs" :key="tab.to" :to="tab.to"
        class="ph-tab" :class="{ 'ph-tab--active': activeTab === tab.value }">
        <component :is="'svg'" v-html="tab.iconSvg" width="13" height="13" viewBox="0 0 24 24" fill="none" class="tab-icon"></component>
        {{ tab.label }}
      </router-link>
      <!-- Decisions tab (inline, no route) -->
      <button class="ph-tab" :class="{ 'ph-tab--active': activeTab === 'decision' || decisionTabOpen }"
        @click="decisionTabOpen = !decisionTabOpen">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" class="tab-icon"><path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Decisions
      </button>
      <button class="ph-tab ph-tab-add" title="Add tab">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>

  <!-- ── Decisions Panel (teleported so it sits below header, full page) ── -->
  <teleport to="body">
    <transition name="dec-slide">
      <div v-if="decisionTabOpen" class="dec-panel">
        <div class="dec-inner">

          <!-- Panel header -->
          <div class="dec-hd">
            <div>
              <div class="dec-hd-title">Decision Log</div>
              <div class="dec-hd-sub">{{ store.decisions.length }} decisions · {{ store.decisions.filter(d => d.status === 'Approved').length }} approved</div>
            </div>
            <div class="dec-hd-right">
              <button class="dec-btn dec-btn--primary" @click="openCreate">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
                New Decision
              </button>
              <button class="dec-close-btn" @click="decisionTabOpen = false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </button>
            </div>
          </div>

          <!-- Detail view -->
          <template v-if="selectedDecision">
            <div class="dec-detail-bar">
              <div class="dec-detail-bar-left">
                <button class="dec-back-btn" @click="selectedDecision = null">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <span class="dec-detail-title">Decision Detail</span>
                <span class="dec-id-badge">{{ selectedDecision.id }}</span>
              </div>
              <div class="dec-detail-bar-right">
                <span class="status-chip" :class="selectedDecision.status === 'Approved' ? 'status-approved' : 'status-pending'">{{ selectedDecision.status }}</span>
                <button class="dec-btn" @click="openEdit(selectedDecision)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                  Edit
                </button>
              </div>
            </div>
            <div class="dec-body">
              <div class="detail-card">
                <div class="dc-title-section">
                  <div class="dc-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 11l3 3L22 4" stroke="#4f46e5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="#4f46e5" stroke-width="2" stroke-linecap="round"/></svg>
                  </div>
                  <div>
                    <h2 class="dc-main-title">{{ selectedDecision.title }}</h2>
                    <div class="dc-meta-row">
                      <span class="dc-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        {{ selectedDecision.date }}
                      </span>
                      <span class="dc-meta-sep">·</span>
                      <span class="dc-meta-item">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
                        {{ selectedDecision.createdBy.name }}
                      </span>
                      <span class="dc-meta-sep">·</span>
                      <span class="impact-chip" :class="`impact-${selectedDecision.impact.toLowerCase()}`">{{ selectedDecision.impact }} Impact</span>
                    </div>
                  </div>
                </div>
                <div class="dc-divider"></div>
                <div class="dc-grid">
                  <div class="dc-section">
                    <div class="dc-section-title">Reason</div>
                    <div class="dc-section-body">{{ selectedDecision.reason }}</div>
                  </div>
                  <div class="dc-section">
                    <div class="dc-section-title">Linked Work</div>
                    <div class="dc-section-body"><a href="#" class="dc-link">{{ selectedDecision.linkedWork || '—' }}</a></div>
                  </div>
                  <div v-if="selectedDecision.decisionMade" class="dc-section dc-section--full">
                    <div class="dc-section-title">Decision Made</div>
                    <div class="dc-section-body dc-preformat">{{ selectedDecision.decisionMade }}</div>
                  </div>
                  <div v-if="selectedDecision.optionsConsidered" class="dc-section dc-section--full">
                    <div class="dc-section-title">Options Considered</div>
                    <div class="dc-section-body dc-preformat">{{ selectedDecision.optionsConsidered }}</div>
                  </div>
                </div>
                <div class="dc-divider"></div>
                <div class="dc-section-title" style="margin-bottom:12px">Status Timeline</div>
                <div class="timeline-steps">
                  <div v-for="(step, i) in timelineSteps" :key="step.label"
                    class="ts-step" :class="{ 'ts-done': step.done, 'ts-active': step.active }">
                    <div class="ts-dot">
                      <svg v-if="step.done" width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" stroke-width="3" stroke-linecap="round"/></svg>
                    </div>
                    <div v-if="i < 3" class="ts-line" :class="{ 'ts-line--done': step.done }"></div>
                    <div class="ts-label">{{ step.label }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- List view -->
          <template v-else>
            <!-- Toolbar -->
            <div class="dec-toolbar">
              <div class="dec-search-wrap">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="dec-search-icon"><circle cx="11" cy="11" r="8" stroke="#94a3b8" stroke-width="2"/><path d="M21 21l-4.35-4.35" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/></svg>
                <input v-model="search" class="dec-search-input" placeholder="Search decisions…" />
              </div>
              <div class="dec-toolbar-right">
                <div class="status-filters">
                  <button v-for="f in statusFilters" :key="f.value"
                    class="sf-btn" :class="{ active: statusFilter === f.value }"
                    @click="statusFilter = f.value">{{ f.label }}</button>
                </div>
                <div class="impact-filters">
                  <button v-for="f in impactFilters" :key="f.value"
                    class="sf-btn" :class="{ active: impactFilter === f.value }"
                    @click="impactFilter = f.value">{{ f.label }}</button>
                </div>
              </div>
            </div>

            <!-- Table -->
            <div class="dec-table-wrap">
              <table class="dec-table">
                <thead>
                  <tr>
                    <th style="width:36px"><input type="checkbox" class="cb" /></th>
                    <th style="width:90px">ID</th>
                    <th style="width:28%">Title</th>
                    <th style="width:20%">Linked Work</th>
                    <th style="width:90px">Date</th>
                    <th style="width:80px">Impact</th>
                    <th style="width:90px">Status</th>
                    <th style="width:130px">Created By</th>
                    <th style="width:80px" class="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filtered.length === 0">
                    <td colspan="9" class="empty-row">
                      <div class="dec-empty">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="#cbd5e1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        No decisions found
                      </div>
                    </td>
                  </tr>
                  <tr v-for="(d, i) in filtered" :key="d.id"
                    class="dec-row" :style="{ animationDelay: i * 30 + 'ms' }"
                    @click="selectedDecision = d">
                    <td @click.stop><input type="checkbox" class="cb" /></td>
                    <td><span class="dec-id">{{ d.id }}</span></td>
                    <td><span class="dec-title-cell">{{ d.title }}</span></td>
                    <td><span class="dec-linked">{{ d.linkedWork }}</span></td>
                    <td class="dec-date">{{ d.date }}</td>
                    <td><span class="impact-chip" :class="`impact-${d.impact.toLowerCase()}`">{{ d.impact }}</span></td>
                    <td><span class="status-chip" :class="d.status === 'Approved' ? 'status-approved' : 'status-pending'">{{ d.status }}</span></td>
                    <td>
                      <div class="creator-cell">
                        <div class="creator-av">{{ d.createdBy.name.slice(0,2).toUpperCase() }}</div>
                        <span class="creator-name">{{ d.createdBy.name }}</span>
                      </div>
                    </td>
                    <td class="actions-cell" @click.stop>
                      <button class="act-btn" title="Edit" @click.stop="openEdit(d)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                      </button>
                      <button class="act-btn" title="View" @click.stop="selectedDecision = d">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                      </button>
                      <button class="act-btn act-btn--danger" title="Delete" @click.stop="store.deleteDecision(d.id)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="dec-pagination">
              <span class="pag-info">Showing {{ filtered.length }} of {{ store.decisions.length }}</span>
              <div class="pag-btns">
                <button class="pag-btn" disabled>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button class="pag-btn pag-btn--active">1</button>
                <button class="pag-btn" disabled>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </div>
          </template>

        </div>
      </div>
    </transition>
  </teleport>

  <!-- ── Create / Edit Dialog ── -->
  <teleport to="body">
    <div v-if="dialogOpen" class="dialog-overlay" @click.self="dialogOpen = false">
      <div class="dialog-box">
        <div class="dialog-header">
          <span class="dialog-title">{{ editingDecision ? 'Edit Decision' : 'Create Decision' }}</span>
          <button class="dialog-close" @click="dialogOpen = false">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
        <div class="dialog-body">
          <div class="field-group">
            <label class="field-label">Decision Title <span class="required">*</span></label>
            <input v-model="form.title" class="field-input" :class="{ 'field-error': errors.title }" placeholder="What decision needs to be made?" />
            <span v-if="errors.title" class="error-msg">{{ errors.title }}</span>
          </div>
          <div class="field-group">
            <label class="field-label">Reason <span class="required">*</span></label>
            <textarea v-model="form.reason" class="field-input field-textarea" :class="{ 'field-error': errors.reason }" placeholder="Why is this decision needed?" rows="3"></textarea>
            <span v-if="errors.reason" class="error-msg">{{ errors.reason }}</span>
          </div>
          <div class="field-group">
            <label class="field-label">Impact</label>
            <div class="impact-buttons">
              <button v-for="lvl in ['High','Medium','Low']" :key="lvl" type="button"
                class="impact-btn" :class="[`impact-${lvl.toLowerCase()}`, { active: form.impact === lvl }]"
                @click="form.impact = lvl as any">{{ lvl }}</button>
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Status</label>
            <div class="impact-buttons">
              <button v-for="s in ['Pending','Approved']" :key="s" type="button"
                class="impact-btn" :class="[s === 'Approved' ? 'impact-low' : 'impact-medium', { active: form.status === s }]"
                @click="form.status = s as any">{{ s }}</button>
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Linked Work Item</label>
            <select v-model="form.linkedWork" class="field-input field-select">
              <option value="">Select task or sprint…</option>
              <option v-for="issue in store.issues" :key="issue.id" :value="`${issue.key} ${issue.summary}`">{{ issue.key }} {{ issue.summary }}</option>
            </select>
          </div>
          <div class="field-group">
            <label class="field-label">Options Considered</label>
            <textarea v-model="form.optionsConsidered" class="field-input field-textarea" placeholder="List options if applicable" rows="3"></textarea>
          </div>
          <div class="field-group">
            <label class="field-label">Decision Made</label>
            <textarea v-model="form.decisionMade" class="field-input field-textarea" placeholder="Describe the decision outcome" rows="3"></textarea>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn-cancel" @click="dialogOpen = false">Cancel</button>
          <button class="btn-primary" @click="saveDecision">{{ editingDecision ? 'Save Changes' : 'Create Decision' }}</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import type { Decision } from '@/stores/taskStore'

defineProps<{ activeTab?: string }>()

const store = useTaskStore()

// ── Route tabs ──
const routeTabs = [
  { value: 'overview', label: 'Overview',  to: '/overview',
    iconSvg: '<rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/>' },
  { value: 'backlog',  label: 'Backlog',   to: '/backlog',
    iconSvg: '<line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  { value: 'board',    label: 'Board',     to: '/board',
    iconSvg: '<rect x="3" y="3" width="4" height="18" rx="1" stroke="currentColor" stroke-width="2"/><rect x="10" y="3" width="4" height="12" rx="1" stroke="currentColor" stroke-width="2"/><rect x="17" y="3" width="4" height="15" rx="1" stroke="currentColor" stroke-width="2"/>' },
  { value: 'sprint',   label: 'Sprint',    to: '/sprint',
    iconSvg: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' },
  { value: 'report',   label: 'Reports',   to: '/reports',
    iconSvg: '<line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  { value: 'timeline', label: 'Timeline',  to: '/timeline',
    iconSvg: '<line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="7" cy="12" r="2" fill="currentColor"/><circle cx="17" cy="12" r="2" fill="currentColor"/>' },
]

// ── Decisions panel state ──
const decisionTabOpen  = ref(false)
const selectedDecision = ref<Decision | null>(null)
const search           = ref('')
const statusFilter     = ref('all')
const impactFilter     = ref('all')

const statusFilters = [
  { value: 'all', label: 'All' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Pending', label: 'Pending' },
]
const impactFilters = [
  { value: 'all', label: 'All Impact' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
]

const filtered = computed(() =>
  store.decisions.filter(d => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.id.toLowerCase().includes(q)
    const matchStatus = statusFilter.value === 'all' || d.status === statusFilter.value
    const matchImpact = impactFilter.value === 'all' || d.impact === impactFilter.value
    return matchSearch && matchStatus && matchImpact
  })
)

const timelineSteps = computed(() => {
  const approved = selectedDecision.value?.status === 'Approved'
  return [
    { label: 'Created',     done: true,     active: false },
    { label: 'In Review',   done: approved, active: !approved },
    { label: 'Approved',    done: approved, active: false },
    { label: 'Implemented', done: false,    active: false },
  ]
})

// ── Dialog state ──
const dialogOpen       = ref(false)
const editingDecision  = ref<Decision | null>(null)
const errors           = reactive({ title: '', reason: '' })

const defaultForm = () => ({
  title: '', reason: '',
  impact: 'Medium' as 'High' | 'Medium' | 'Low',
  status: 'Pending' as 'Approved' | 'Pending',
  linkedWork: '', optionsConsidered: '', decisionMade: '',
})
const form = reactive(defaultForm())

const openCreate = () => {
  editingDecision.value = null
  Object.assign(form, defaultForm())
  errors.title = ''; errors.reason = ''
  dialogOpen.value = true
}

const openEdit = (d: Decision) => {
  editingDecision.value = d
  Object.assign(form, {
    title: d.title, reason: d.reason, impact: d.impact,
    status: d.status, linkedWork: d.linkedWork,
    optionsConsidered: d.optionsConsidered, decisionMade: d.decisionMade,
  })
  errors.title = ''; errors.reason = ''
  dialogOpen.value = true
}

const saveDecision = () => {
  errors.title = ''; errors.reason = ''
  if (!form.title.trim()) { errors.title = 'Title is required.'; return }
  if (!form.reason.trim()) { errors.reason = 'Reason is required.'; return }

  if (editingDecision.value) {
    store.updateDecision(editingDecision.value.id, { ...form })
    if (selectedDecision.value?.id === editingDecision.value.id) {
      selectedDecision.value = store.decisions.find(d => d.id === editingDecision.value!.id) ?? null
    }
  } else {
    store.addDecision({
      ...form,
      date: new Date().toISOString().split('T')[0]!,
      createdBy: store.currentUser,
    })
  }
  dialogOpen.value = false
}
</script>

<style scoped>
/* ── Header wrap ── */
.ph-wrap { background:#fff; border-bottom:1px solid #e2e8f0; font-family:'Inter',sans-serif; position:sticky; top:0; z-index:10; }
.ph-bc { padding:6px 16px 0; font-size:11px; color:#94a3b8; }
.ph-title-row { display:flex; align-items:center; justify-content:space-between; padding:4px 16px 6px; }
.ph-title-left { display:flex; align-items:center; gap:6px; }
.ph-icon { width:22px; height:22px; border-radius:5px; background:#f97316; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.ph-name { font-size:14px; font-weight:700; color:#0f172a; }
.ph-icon-btn { display:flex; align-items:center; justify-content:center; width:22px; height:22px; border:none; background:none; color:#94a3b8; cursor:pointer; border-radius:4px; transition:background .12s,color .12s; }
.ph-icon-btn:hover { background:#f1f5f9; color:#475569; }
.ph-title-right { display:flex; align-items:center; gap:2px; }
.ph-tabs { display:flex; align-items:center; padding:0 16px; overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; }
.ph-tabs::-webkit-scrollbar { display:none; }
.ph-tab { display:flex; align-items:center; gap:5px; padding:7px 11px; font-size:12.5px; font-weight:500; color:#64748b; text-decoration:none; border-bottom:2px solid transparent; white-space:nowrap; flex-shrink:0; transition:color .12s,border-color .12s; background:none; border-top:none; border-left:none; border-right:none; cursor:pointer; font-family:'Inter',sans-serif; }
.ph-tab:hover { color:#1e293b; }
.ph-tab--active { color:#4f46e5; border-bottom-color:#4f46e5; font-weight:600; }
.ph-tab-add { color:#94a3b8; padding:7px 8px; }
.tab-icon { flex-shrink:0; }
@media (max-width:640px) { .ph-name { font-size:12px; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; } .ph-title-right { display:none; } }

/* ── Decisions panel ── */
.dec-panel { position:fixed; inset:0; z-index:1100; display:flex; justify-content:flex-end; background:rgba(15,23,42,.25); }
.dec-inner { width:min(900px,95vw); background:#fff; height:100%; display:flex; flex-direction:column; box-shadow:-6px 0 32px rgba(0,0,0,.14); overflow:hidden; }
.dec-slide-enter-active, .dec-slide-leave-active { transition:transform .22s ease; }
.dec-slide-enter-from .dec-inner, .dec-slide-leave-to .dec-inner { transform:translateX(100%); }

.dec-hd { display:flex; align-items:center; justify-content:space-between; padding:16px 24px 12px; border-bottom:1px solid #e2e8f0; flex-shrink:0; }
.dec-hd-title { font-size:16px; font-weight:700; color:#0f172a; }
.dec-hd-sub { font-size:12px; color:#94a3b8; margin-top:2px; }
.dec-hd-right { display:flex; align-items:center; gap:8px; }
.dec-btn { display:inline-flex; align-items:center; gap:5px; padding:7px 14px; border-radius:8px; border:1px solid #e2e8f0; background:#fff; font-size:12.5px; font-weight:500; color:#475569; cursor:pointer; font-family:'Inter',sans-serif; transition:background .12s; }
.dec-btn:hover { background:#f1f5f9; }
.dec-btn--primary { background:#4f46e5; border-color:#4f46e5; color:#fff; box-shadow:0 2px 8px rgba(79,70,229,.25); }
.dec-btn--primary:hover { background:#4338ca; }
.dec-close-btn { display:flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:7px; border:none; background:none; color:#64748b; cursor:pointer; transition:background .12s,color .12s; }
.dec-close-btn:hover { background:#fef2f2; color:#ef4444; }

/* Detail bar */
.dec-detail-bar { display:flex; align-items:center; justify-content:space-between; padding:10px 24px; border-bottom:1px solid #e2e8f0; flex-shrink:0; gap:12px; }
.dec-detail-bar-left { display:flex; align-items:center; gap:10px; }
.dec-back-btn { display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; border:1px solid #e2e8f0; background:#fff; color:#475569; cursor:pointer; transition:background .12s; }
.dec-back-btn:hover { background:#f1f5f9; }
.dec-detail-title { font-size:14px; font-weight:700; color:#0f172a; }
.dec-id-badge { font-size:11px; font-weight:700; background:#eef2ff; color:#4f46e5; padding:2px 8px; border-radius:6px; font-family:monospace; }
.dec-detail-bar-right { display:flex; align-items:center; gap:8px; }

/* Toolbar */
.dec-toolbar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; padding:10px 24px; border-bottom:1px solid #e2e8f0; flex-shrink:0; gap:10px; background:#fff; }
.dec-search-wrap { position:relative; display:flex; align-items:center; }
.dec-search-icon { position:absolute; left:10px; pointer-events:none; }
.dec-search-input { width:240px; padding:7px 12px 7px 32px; border-radius:8px; border:1px solid #e2e8f0; background:#f8fafc; font-size:12.5px; color:#1e293b; font-family:'Inter',sans-serif; outline:none; transition:border-color .15s; }
.dec-search-input:focus { border-color:#a5b4fc; }
.dec-toolbar-right { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.status-filters, .impact-filters { display:flex; border:1px solid #e2e8f0; border-radius:8px; overflow:hidden; }
.sf-btn { padding:5px 12px; border:none; background:#fff; font-size:12px; font-weight:500; color:#64748b; cursor:pointer; font-family:'Inter',sans-serif; transition:background .12s,color .12s; }
.sf-btn.active { background:#eef2ff; color:#4f46e5; font-weight:600; }

/* Table */
.dec-table-wrap { flex:1; overflow:auto; padding:16px 24px 0; }
.dec-table { width:100%; border-collapse:collapse; background:#fff; border-radius:12px; border:1px solid #e2e8f0; overflow:hidden; min-width:680px; }
.dec-table thead th { padding:10px 14px; text-align:left; font-size:11px; font-weight:600; color:#94a3b8; background:#f8fafc; border-bottom:1px solid #e2e8f0; text-transform:uppercase; letter-spacing:.04em; }
.dec-table thead th.text-center { text-align:center; }
.dec-row { cursor:pointer; animation:fadeUp .22s ease both; }
.dec-row:hover td { background:#f8fafc; }
.dec-row td { padding:11px 14px; border-bottom:1px solid #f1f5f9; vertical-align:middle; }
.dec-row:last-child td { border-bottom:none; }
.cb { cursor:pointer; accent-color:#4f46e5; }
.dec-id { font-size:12px; font-weight:700; color:#4f46e5; font-family:monospace; }
.dec-title-cell { font-size:13px; font-weight:500; color:#0f172a; }
.dec-linked { font-size:12px; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:200px; display:block; }
.dec-date { font-size:12px; color:#94a3b8; white-space:nowrap; }
.impact-chip { font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:20px; }
.impact-high   { background:#fef2f2; color:#ef4444; }
.impact-medium { background:#fffbeb; color:#d97706; }
.impact-low    { background:#f0fdf4; color:#16a34a; }
.status-chip { font-size:10.5px; font-weight:700; padding:2px 9px; border-radius:20px; }
.status-approved { background:#f0fdf4; color:#16a34a; }
.status-pending  { background:#fffbeb; color:#d97706; }
.creator-cell { display:flex; align-items:center; gap:7px; }
.creator-av { width:24px; height:24px; border-radius:50%; background:#eef2ff; color:#4f46e5; font-size:9px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.creator-name { font-size:12.5px; color:#475569; }
.actions-cell { text-align:center; }
.act-btn { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; border:none; background:none; color:#94a3b8; cursor:pointer; transition:background .12s,color .12s; }
.act-btn:hover { background:#eef2ff; color:#4f46e5; }
.act-btn--danger:hover { background:#fef2f2; color:#ef4444; }
.empty-row { padding:0 !important; }
.dec-empty { display:flex; flex-direction:column; align-items:center; gap:8px; padding:48px 20px; color:#94a3b8; font-size:13px; }

/* Pagination */
.dec-pagination { display:flex; align-items:center; justify-content:space-between; padding:12px 24px; background:#fff; border-top:1px solid #e2e8f0; flex-shrink:0; }
.pag-info { font-size:12px; color:#94a3b8; }
.pag-btns { display:flex; gap:4px; }
.pag-btn { display:flex; align-items:center; justify-content:center; min-width:30px; height:30px; padding:0 8px; border-radius:7px; border:1px solid #e2e8f0; background:#fff; font-size:12px; color:#475569; cursor:pointer; transition:background .12s; }
.pag-btn:hover:not(:disabled) { background:#f1f5f9; }
.pag-btn--active { background:#eef2ff; border-color:#c7d2fe; color:#4f46e5; font-weight:600; }
.pag-btn:disabled { opacity:.4; cursor:default; }

/* Detail card */
.dec-body { flex:1; overflow-y:auto; padding:20px 24px; background:#f8fafc; }
.detail-card { background:#fff; border-radius:14px; border:1px solid #e2e8f0; padding:24px; max-width:800px; margin:0 auto; }
.dc-title-section { display:flex; align-items:flex-start; gap:14px; margin-bottom:20px; }
.dc-icon { width:44px; height:44px; border-radius:12px; background:#eef2ff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.dc-main-title { font-size:17px; font-weight:700; color:#0f172a; margin:0 0 6px; line-height:1.3; }
.dc-meta-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.dc-meta-item { display:inline-flex; align-items:center; gap:4px; font-size:12px; color:#64748b; }
.dc-meta-sep { color:#cbd5e1; }
.dc-divider { height:1px; background:#f1f5f9; margin:20px 0; }
.dc-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.dc-section { display:flex; flex-direction:column; gap:6px; }
.dc-section--full { grid-column:1/-1; }
.dc-section-title { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:#94a3b8; }
.dc-section-body { font-size:13px; color:#1e293b; line-height:1.6; }
.dc-preformat { white-space:pre-wrap; background:#f8fafc; border-radius:8px; padding:12px; font-size:12.5px; }
.dc-link { color:#4f46e5; font-weight:500; text-decoration:none; }
.dc-link:hover { text-decoration:underline; }
.timeline-steps { display:flex; align-items:flex-start; }
.ts-step { display:flex; flex-direction:column; align-items:center; flex:1; position:relative; }
.ts-dot { width:24px; height:24px; border-radius:50%; border:2px solid #e2e8f0; background:#fff; display:flex; align-items:center; justify-content:center; z-index:1; flex-shrink:0; }
.ts-done .ts-dot { background:#10b981; border-color:#10b981; }
.ts-active .ts-dot { border-color:#4f46e5; box-shadow:0 0 0 4px rgba(79,70,229,.15); }
.ts-line { position:absolute; top:11px; left:50%; width:100%; height:2px; background:#e2e8f0; z-index:0; }
.ts-line--done { background:#10b981; }
.ts-label { font-size:11px; font-weight:500; color:#64748b; margin-top:6px; text-align:center; }
.ts-done .ts-label { color:#10b981; font-weight:600; }
.ts-active .ts-label { color:#4f46e5; font-weight:600; }

/* Dialog */
.dialog-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:1200; padding:16px; }
.dialog-box { background:#fff; border-radius:14px; width:100%; max-width:560px; max-height:90vh; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0,0,0,.18); font-family:'Inter',sans-serif; animation:fadeUp .2s ease; }
.dialog-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px 16px; border-bottom:1px solid #e2e8f0; }
.dialog-title { font-size:16px; font-weight:700; color:#0f172a; }
.dialog-close { display:flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:7px; border:none; background:none; color:#94a3b8; cursor:pointer; transition:background .12s; }
.dialog-close:hover { background:#f1f5f9; color:#475569; }
.dialog-body { padding:20px 24px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:16px; }
.field-group { display:flex; flex-direction:column; gap:6px; }
.field-label { font-size:13px; font-weight:600; color:#374151; }
.required { color:#ef4444; }
.field-input { padding:9px 12px; border:1px solid #e2e8f0; border-radius:8px; font-size:13px; color:#1e293b; background:#f8fafc; outline:none; transition:border-color .15s; font-family:'Inter',sans-serif; }
.field-input:focus { border-color:#4f46e5; background:#fff; }
.field-input.field-error { border-color:#ef4444; }
.field-textarea { resize:vertical; min-height:80px; }
.field-select { appearance:none; cursor:pointer; }
.error-msg { font-size:12px; color:#ef4444; }
.impact-buttons { display:flex; gap:8px; }
.impact-btn { padding:6px 16px; border-radius:20px; border:2px solid transparent; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; background:#f1f5f9; color:#64748b; font-family:'Inter',sans-serif; }
.impact-btn.impact-high { border-color:#fecaca; color:#dc2626; background:#fff5f5; }
.impact-btn.impact-high.active { background:#dc2626; color:#fff; border-color:#dc2626; }
.impact-btn.impact-medium { border-color:#fed7aa; color:#d97706; background:#fffbeb; }
.impact-btn.impact-medium.active { background:#d97706; color:#fff; border-color:#d97706; }
.impact-btn.impact-low { border-color:#bbf7d0; color:#16a34a; background:#f0fdf4; }
.impact-btn.impact-low.active { background:#16a34a; color:#fff; border-color:#16a34a; }
.dialog-footer { display:flex; justify-content:flex-end; gap:10px; padding:16px 24px; border-top:1px solid #e2e8f0; background:#f8fafc; border-radius:0 0 14px 14px; }
.btn-cancel { padding:8px 18px; border:1px solid #e2e8f0; border-radius:8px; background:#fff; color:#475569; font-size:13px; font-weight:500; cursor:pointer; transition:background .15s; font-family:'Inter',sans-serif; }
.btn-cancel:hover { background:#f1f5f9; }
.btn-primary { padding:8px 20px; border:none; border-radius:8px; background:#4f46e5; color:#fff; font-size:13px; font-weight:600; cursor:pointer; transition:background .15s; font-family:'Inter',sans-serif; }
.btn-primary:hover { background:#4338ca; }

@keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
</style>
