<template>
  <div class="dec-root">

    <!-- Header -->
    <div class="dec-header">
      <div>
        <h1 class="dec-title">Decision Log</h1>
        <p class="dec-sub">{{ decisions.length }} decisions · {{ decisions.filter(d => d.status === 'Approved').length }} approved</p>
      </div>
      <button class="hdr-btn hdr-btn--primary" @click="isCreateOpen = true">
        <v-icon size="13">mdi-plus</v-icon> New Decision
      </button>
    </div>

    <!-- List view -->
    <template v-if="!selectedDecision">

      <!-- Filters toolbar -->
      <div class="dec-toolbar">
        <div class="search-wrap">
          <v-icon size="14" class="search-icon">mdi-magnify</v-icon>
          <input v-model="search" class="search-input" placeholder="Search decisions…" />
        </div>
        <div class="toolbar-right">
          <button class="tool-btn"><v-icon size="13">mdi-calendar-outline</v-icon> Date</button>
          <button class="tool-btn"><v-icon size="13">mdi-folder-outline</v-icon> Project</button>
          <div class="tool-sep"></div>
          <div class="status-filters">
            <button v-for="f in statusFilters" :key="f.value"
              class="sf-btn" :class="{ active: statusFilter === f.value }"
              @click="statusFilter = f.value">
              {{ f.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="dec-table-wrap">
        <table class="dec-table">
          <thead>
            <tr>
              <th style="width:36px"><input type="checkbox" class="cb" /></th>
              <th style="width:100px">ID</th>
              <th style="width:28%">Title</th>
              <th style="width:20%">Linked Work</th>
              <th style="width:100px">Date</th>
              <th style="width:80px">Impact</th>
              <th style="width:90px">Status</th>
              <th style="width:130px">Created By</th>
              <th style="width:80px" class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filtered.length === 0">
              <td colspan="9" class="empty-row">
                <div class="empty-state">
                  <v-icon size="36" style="color:#cbd5e1">mdi-clipboard-text-outline</v-icon>
                  <div>No decisions found</div>
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
              <td>
                <span class="impact-chip" :class="`impact-${d.impact.toLowerCase()}`">
                  {{ d.impact }}
                </span>
              </td>
              <td>
                <span class="status-chip" :class="d.status === 'Approved' ? 'status-approved' : 'status-pending'">
                  {{ d.status }}
                </span>
              </td>
              <td>
                <div class="creator-cell">
                  <div class="creator-av">{{ d.createdBy.name.slice(0, 2).toUpperCase() }}</div>
                  <span class="creator-name">{{ d.createdBy.name }}</span>
                </div>
              </td>
              <td class="actions-cell" @click.stop>
                <button class="act-btn" title="Edit" @click.stop="openEdit(d)">
                  <v-icon size="14">mdi-pencil-outline</v-icon>
                </button>
                <button class="act-btn" title="View" @click.stop="selectedDecision = d">
                  <v-icon size="14">mdi-eye-outline</v-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="dec-pagination">
        <span class="pag-info">Showing {{ filtered.length }} of {{ decisions.length }}</span>
        <div class="pag-btns">
          <button class="pag-btn" disabled><v-icon size="13">mdi-chevron-left</v-icon></button>
          <button class="pag-btn pag-btn--active">1</button>
          <button class="pag-btn">2</button>
          <button class="pag-btn">3</button>
          <button class="pag-btn" disabled><v-icon size="13">mdi-chevron-right</v-icon></button>
        </div>
      </div>

    </template>

    <!-- Detail view -->
    <template v-else>
      <DecisionDetails :decision="selectedDecision" @close="selectedDecision = null" />
    </template>

    <!-- Create dialog -->
    <CreateDecisionDialog v-model="isCreateOpen" :issues="store.issues" :current-user="store.currentUser"
      @save="saveNew" />

    <!-- Edit dialog -->
    <EditDecisionDialog v-model="isEditOpen" :decision="decisionToEdit" :issues="store.issues"
      :current-user="store.currentUser" @save="saveEdit" />

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import DecisionDetails from './components/DecisionDetails.vue'
import CreateDecisionDialog from './components/CreateDecisionDialog.vue'
import EditDecisionDialog from './components/EditDecisionDialog.vue'
import type { Decision } from '@/stores/taskStore'

const store = useTaskStore()
const decisions = computed(() => store.decisions)

const search       = ref('')
const statusFilter = ref('all')
const selectedDecision = ref<Decision | null>(null)

const statusFilters = [
  { value: 'all',      label: 'All' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Pending',  label: 'Pending' },
]

const filtered = computed(() =>
  decisions.value.filter(d => {
    const matchSearch = !search.value ||
      d.title.toLowerCase().includes(search.value.toLowerCase()) ||
      d.id.toLowerCase().includes(search.value.toLowerCase())
    const matchStatus = statusFilter.value === 'all' || d.status === statusFilter.value
    return matchSearch && matchStatus
  })
)

// Create
const isCreateOpen = ref(false)
function saveNew(payload: Omit<Decision, 'id' | 'createdBy'>) {
  store.addDecision({ ...payload, createdBy: store.currentUser })
  isCreateOpen.value = false
}

// Edit
const isEditOpen     = ref(false)
const decisionToEdit = ref<Decision | null>(null)
function openEdit(d: Decision) { decisionToEdit.value = d; isEditOpen.value = true }
function saveEdit(id: string, payload: Partial<Decision>) {
  store.updateDecision(id, payload)
  isEditOpen.value = false
}
</script>

<style scoped>
.dec-root {
  display: flex; flex-direction: column; height: 100%; overflow: hidden;
  font-family: 'Inter', sans-serif; font-size: 13px; color: #1e293b; background: #f8fafc;
}

/* Header */
.dec-header {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  padding: 16px 24px 12px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
}
.dec-title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
.dec-sub { font-size: 12px; color: #94a3b8; margin: 0; }
.hdr-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 8px 16px;
  border-radius: 8px; border: 1px solid #e2e8f0; background: #fff;
  font-size: 12.5px; font-weight: 500; color: #475569;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s;
}
.hdr-btn--primary { background: #4f46e5; border-color: #4f46e5; color: #fff; box-shadow: 0 2px 8px rgba(79,70,229,.25); }
.hdr-btn--primary:hover { background: #4338ca; }

/* Toolbar */
.dec-toolbar {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
  padding: 10px 24px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; gap: 12px;
}
.search-wrap { position: relative; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
.search-input {
  width: 260px; padding: 7px 12px 7px 32px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #f8fafc; font-size: 12.5px;
  color: #1e293b; font-family: 'Inter', sans-serif; outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.search-input:focus { border-color: #a5b4fc; box-shadow: 0 0 0 3px rgba(99,102,241,.1); }
.toolbar-right { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.tool-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px;
  border-radius: 7px; border: 1px solid #e2e8f0; background: #fff;
  font-size: 12px; color: #64748b; cursor: pointer; font-family: 'Inter', sans-serif;
  transition: background .12s, color .12s;
}
.tool-btn:hover { background: #f1f5f9; color: #0f172a; }
.tool-sep { width: 1px; height: 20px; background: #e2e8f0; }
.status-filters { display: flex; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.sf-btn { padding: 5px 12px; border: none; background: #fff; font-size: 12px; font-weight: 500; color: #64748b; cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s, color .12s; }
.sf-btn.active { background: #eef2ff; color: #4f46e5; font-weight: 600; }

/* Table */
.dec-table-wrap { flex: 1; overflow: auto; padding: 16px 24px 0; }
.dec-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; min-width: 700px; }
.dec-table thead th {
  padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600;
  color: #94a3b8; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase; letter-spacing: .04em;
}
.dec-table thead th.text-center { text-align: center; }
.dec-row { cursor: pointer; animation: fadeUp .22s ease both; }
.dec-row:hover td { background: #f8fafc; }
.dec-row td { padding: 11px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
.dec-row:last-child td { border-bottom: none; }

.cb { cursor: pointer; accent-color: #4f46e5; }
.dec-id { font-size: 12px; font-weight: 700; color: #4f46e5; font-family: monospace; }
.dec-title-cell { font-size: 13px; font-weight: 500; color: #0f172a; }
.dec-linked { font-size: 12px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; display: block; }
.dec-date { font-size: 12px; color: #94a3b8; white-space: nowrap; }

.impact-chip { font-size: 10.5px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
.impact-high   { background: #fef2f2; color: #ef4444; }
.impact-medium { background: #fffbeb; color: #d97706; }
.impact-low    { background: #f0fdf4; color: #16a34a; }

.status-chip { font-size: 10.5px; font-weight: 700; padding: 2px 9px; border-radius: 20px; }
.status-approved { background: #f0fdf4; color: #16a34a; }
.status-pending  { background: #fffbeb; color: #d97706; }

.creator-cell { display: flex; align-items: center; gap: 7px; }
.creator-av { width: 24px; height: 24px; border-radius: 50%; background: #eef2ff; color: #4f46e5; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.creator-name { font-size: 12.5px; color: #475569; }

.actions-cell { text-align: center; }
.act-btn { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px; border: none; background: none; color: #94a3b8; cursor: pointer; transition: background .12s, color .12s; }
.act-btn:hover { background: #eef2ff; color: #4f46e5; }

.empty-row { padding: 0 !important; }
.empty-state { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 48px 20px; color: #94a3b8; font-size: 13px; }

/* Pagination */
.dec-pagination { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; background: #fff; border-top: 1px solid #e2e8f0; flex-shrink: 0; }
.pag-info { font-size: 12px; color: #94a3b8; }
.pag-btns { display: flex; gap: 4px; }
.pag-btn { display: flex; align-items: center; justify-content: center; min-width: 30px; height: 30px; padding: 0 8px; border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; font-size: 12px; color: #475569; cursor: pointer; transition: background .12s; }
.pag-btn:hover:not(:disabled) { background: #f1f5f9; }
.pag-btn--active { background: #eef2ff; border-color: #c7d2fe; color: #4f46e5; font-weight: 600; }
.pag-btn:disabled { opacity: .4; cursor: default; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
</style>
