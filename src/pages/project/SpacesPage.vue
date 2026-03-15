<template>
  <div class="spaces-root">

    <!-- Header -->
    <div class="spaces-header">
      <div>
        <h1 class="spaces-title">Spaces</h1>
        <p class="spaces-sub">{{ spaces.length }} projects · {{ spaces.filter(s => s.starred).length }} starred</p>
      </div>
      <button class="hdr-btn hdr-btn--primary" @click="showCreate = true">
        <v-icon size="13">mdi-plus</v-icon> Create Project
      </button>
    </div>

    <!-- Controls -->
    <div class="spaces-controls">
      <div class="search-wrap">
        <v-icon size="14" class="search-icon">mdi-magnify</v-icon>
        <input v-model="search" class="search-input" placeholder="Search spaces…" />
      </div>
      <div class="controls-right">
        <select v-model="filterType" class="filter-select">
          <option value="">All types</option>
          <option value="software">Team-managed software</option>
          <option value="business">Team-managed business</option>
        </select>
        <div class="view-toggle">
          <button class="vt-btn" :class="{ active: view === 'table' }" @click="view = 'table'">
            <v-icon size="14">mdi-format-list-bulleted</v-icon>
          </button>
          <button class="vt-btn" :class="{ active: view === 'grid' }" @click="view = 'grid'">
            <v-icon size="14">mdi-view-grid-outline</v-icon>
          </button>
        </div>
      </div>
    </div>

    <!-- Table view -->
    <div v-if="view === 'table'" class="table-wrap">
      <table class="spaces-table">
        <thead>
          <tr>
            <th style="width:36px"></th>
            <th style="width:30%">Name</th>
            <th style="width:10%">Key</th>
            <th style="width:22%">Type</th>
            <th style="width:20%">Lead</th>
            <th style="width:18%">Progress</th>
            <th style="width:36px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in filtered" :key="s.key"
            class="s-row" :style="{ animationDelay: i * 35 + 'ms' }">
            <td>
              <button class="star-btn" :class="{ starred: s.starred }" @click="s.starred = !s.starred">
                <v-icon size="14">{{ s.starred ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
              </button>
            </td>
            <td>
              <div class="s-name-cell">
                <div class="s-icon" :style="{ background: s.iconBg }">
                  <v-icon size="14" :color="s.iconColor">{{ s.icon }}</v-icon>
                </div>
                <span class="s-name">{{ s.name }}</span>
              </div>
            </td>
            <td><span class="s-key">{{ s.key }}</span></td>
            <td><span class="s-type">{{ s.type }}</span></td>
            <td>
              <div class="s-lead">
                <div class="s-lead-av" :style="{ background: s.leadBg }">{{ s.leadInitials }}</div>
                <span class="s-lead-name">{{ s.leadName }}</span>
              </div>
            </td>
            <td>
              <div class="s-progress">
                <div class="s-prog-bar">
                  <div class="s-prog-fill" :style="{ width: s.progress + '%', background: s.iconColor }"></div>
                </div>
                <span class="s-prog-pct">{{ s.progress }}%</span>
              </div>
            </td>
            <td>
              <button class="row-menu-btn"><v-icon size="15">mdi-dots-horizontal</v-icon></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Grid view -->
    <div v-else class="grid-view">
      <div v-for="(s, i) in filtered" :key="s.key"
        class="sg-card" :style="{ animationDelay: i * 45 + 'ms' }">
        <div class="sgc-accent" :style="{ background: s.iconColor }"></div>
        <div class="sgc-body">
          <div class="sgc-top">
            <div class="s-icon" :style="{ background: s.iconBg }">
              <v-icon size="16" :color="s.iconColor">{{ s.icon }}</v-icon>
            </div>
            <button class="star-btn" :class="{ starred: s.starred }" @click="s.starred = !s.starred">
              <v-icon size="14">{{ s.starred ? 'mdi-star' : 'mdi-star-outline' }}</v-icon>
            </button>
          </div>
          <div class="sgc-name">{{ s.name }}</div>
          <div class="sgc-key">{{ s.key }} · {{ s.type }}</div>
          <div class="sgc-progress">
            <div class="s-prog-bar">
              <div class="s-prog-fill" :style="{ width: s.progress + '%', background: s.iconColor }"></div>
            </div>
            <span class="s-prog-pct">{{ s.progress }}%</span>
          </div>
        </div>
        <div class="sgc-footer">
          <div class="s-lead">
            <div class="s-lead-av" :style="{ background: s.leadBg }">{{ s.leadInitials }}</div>
            <span class="s-lead-name">{{ s.leadName }}</span>
          </div>
          <button class="row-menu-btn"><v-icon size="15">mdi-dots-horizontal</v-icon></button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-row">
      <span class="pag-info">Showing {{ filtered.length }} of {{ spaces.length }} projects</span>
      <div class="pag-btns">
        <button class="pag-btn" disabled><v-icon size="14">mdi-chevron-left</v-icon></button>
        <button class="pag-btn pag-btn--active">1</button>
        <button class="pag-btn" disabled><v-icon size="14">mdi-chevron-right</v-icon></button>
      </div>
    </div>

    <!-- Create Project Dialog -->
    <div v-if="showCreate" class="dialog-overlay" @click.self="showCreate = false">
      <div class="dialog">
        <div class="dialog-hd">
          <span class="dialog-title">Create Project</span>
          <button class="dialog-close" @click="showCreate = false"><v-icon size="16">mdi-close</v-icon></button>
        </div>
        <div class="dialog-body">
          <div class="form-group">
            <label class="form-label">Project Name <span class="req">*</span></label>
            <input v-model="newProject.name" class="form-input" placeholder="e.g. Mobile App Development" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Project Type</label>
              <select v-model="newProject.type" class="form-select">
                <option>Scrum</option><option>Kanban</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Sprint Duration</label>
              <select v-model="newProject.sprint" class="form-select">
                <option>1 Week</option><option>2 Weeks</option><option>3 Weeks</option><option>4 Weeks</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input v-model="newProject.startDate" type="date" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Lead</label>
              <select v-model="newProject.lead" class="form-select">
                <option>Satya Ranjan Bal</option><option>Lasa Marandi</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea v-model="newProject.description" class="form-textarea" rows="3" placeholder="Brief project description…"></textarea>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="dlg-btn" @click="showCreate = false">Cancel</button>
          <button class="dlg-btn dlg-btn--primary" @click="createProject">Create</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const view       = ref<'table' | 'grid'>('table')
const search     = ref('')
const filterType = ref('')
const showCreate = ref(false)

const newProject = ref({ name: '', type: 'Scrum', sprint: '2 Weeks', startDate: '', lead: 'Satya Ranjan Bal', description: '' })

interface Space {
  name: string; key: string; type: string; icon: string
  iconBg: string; iconColor: string; leadName: string; leadInitials: string
  leadBg: string; starred: boolean; progress: number
}

const spaces = ref<Space[]>([
  { name: 'Cryptocurrency Payment Gateway', key: 'CPG', type: 'Team-managed software', icon: 'mdi-poll',           iconBg: '#fef2f2', iconColor: '#ef4444', leadName: 'Satya Ranjan Bal', leadInitials: 'SB', leadBg: '#fed7aa', starred: true,  progress: 68 },
  { name: 'Execora',                        key: 'EX',  type: 'Team-managed software', icon: 'mdi-wallet-bifold',  iconBg: '#eff6ff', iconColor: '#2563eb', leadName: 'Satya Ranjan Bal', leadInitials: 'SB', leadBg: '#fed7aa', starred: false, progress: 45 },
  { name: 'Kanban',                         key: 'KAN', type: 'Team-managed software', icon: 'mdi-cellphone-link', iconBg: '#fffbeb', iconColor: '#d97706', leadName: 'Lasa Marandi',     leadInitials: 'LM', leadBg: '#fce7f3', starred: false, progress: 30 },
  { name: 'Kanban 1',                       key: 'K1',  type: 'Team-managed software', icon: 'mdi-cellphone-link', iconBg: '#eff6ff', iconColor: '#3b82f6', leadName: 'Lasa Marandi',     leadInitials: 'LM', leadBg: '#fce7f3', starred: false, progress: 15 },
  { name: 'Marketing Asset Creation',       key: 'MAC', type: 'Team-managed business', icon: 'mdi-puzzle',         iconBg: '#ecfeff', iconColor: '#0891b2', leadName: 'Lasa Marandi',     leadInitials: 'LM', leadBg: '#fce7f3', starred: false, progress: 82 },
  { name: 'Project Management',             key: 'PM',  type: 'Team-managed business', icon: 'mdi-rocket-launch',  iconBg: '#eef2ff', iconColor: '#4f46e5', leadName: 'Lasa Marandi',     leadInitials: 'LM', leadBg: '#fce7f3', starred: false, progress: 55 },
])

const filtered = computed(() =>
  spaces.value.filter(s => {
    const matchSearch = !search.value || s.name.toLowerCase().includes(search.value.toLowerCase()) || s.key.toLowerCase().includes(search.value.toLowerCase())
    const matchType   = !filterType.value || s.type.toLowerCase().includes(filterType.value)
    return matchSearch && matchType
  })
)

function createProject() {
  if (!newProject.value.name.trim()) return
  spaces.value.push({
    name: newProject.value.name, key: newProject.value.name.slice(0, 3).toUpperCase(),
    type: `Team-managed ${newProject.value.type === 'Scrum' ? 'software' : 'business'}`,
    icon: 'mdi-folder-outline', iconBg: '#eef2ff', iconColor: '#4f46e5',
    leadName: newProject.value.lead, leadInitials: newProject.value.lead.slice(0, 2).toUpperCase(),
    leadBg: '#e0e7ff', starred: false, progress: 0,
  })
  showCreate.value = false
  newProject.value = { name: '', type: 'Scrum', sprint: '2 Weeks', startDate: '', lead: 'Satya Ranjan Bal', description: '' }
}
</script>

<style scoped>
.spaces-root {
  display: flex; flex-direction: column; height: 100%; overflow: hidden;
  font-family: 'Inter', sans-serif; font-size: 13px; color: #1e293b; background: #f8fafc;
}

/* Header */
.spaces-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 26px 14px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0;
}
.spaces-title { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 3px; }
.spaces-sub { font-size: 12px; color: #94a3b8; margin: 0; }
.hdr-btn {
  display: inline-flex; align-items: center; gap: 5px; padding: 8px 16px;
  border-radius: 8px; border: 1px solid #e2e8f0; background: #fff;
  font-size: 12.5px; font-weight: 500; color: #475569;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s;
}
.hdr-btn--primary { background: #4f46e5; border-color: #4f46e5; color: #fff; box-shadow: 0 2px 8px rgba(79,70,229,.25); }
.hdr-btn--primary:hover { background: #4338ca; border-color: #4338ca; }

/* Controls */
.spaces-controls {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 26px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; gap: 12px;
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
.controls-right { display: flex; align-items: center; gap: 8px; }
.filter-select {
  padding: 7px 12px; border-radius: 8px; border: 1px solid #e2e8f0;
  background: #fff; font-size: 12.5px; color: #475569;
  font-family: 'Inter', sans-serif; outline: none; cursor: pointer;
}
.view-toggle { display: flex; border: 1px solid #e2e8f0; border-radius: 7px; overflow: hidden; }
.vt-btn { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; border: none; background: #fff; color: #64748b; cursor: pointer; transition: background .12s, color .12s; }
.vt-btn.active { background: #eef2ff; color: #4f46e5; }

/* Table */
.table-wrap { flex: 1; overflow-y: auto; padding: 16px 26px; }
.spaces-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
.spaces-table thead th {
  padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600;
  color: #94a3b8; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase; letter-spacing: .04em;
}
.s-row { cursor: pointer; animation: fadeUp .22s ease both; }
.s-row:hover td { background: #f8fafc; }
.s-row td { padding: 11px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
.s-row:last-child td { border-bottom: none; }

.star-btn { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 6px; border: none; background: none; color: #cbd5e1; cursor: pointer; transition: color .15s; }
.star-btn:hover, .star-btn.starred { color: #f59e0b; }
.s-name-cell { display: flex; align-items: center; gap: 10px; }
.s-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.s-name { font-size: 13px; font-weight: 600; color: #0f172a; }
.s-key { font-size: 11.5px; font-weight: 600; background: #f1f5f9; color: #64748b; padding: 2px 7px; border-radius: 6px; }
.s-type { font-size: 12px; color: #64748b; }
.s-lead { display: flex; align-items: center; gap: 7px; }
.s-lead-av { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #475569; flex-shrink: 0; }
.s-lead-name { font-size: 12.5px; color: #475569; }
.s-progress { display: flex; align-items: center; gap: 8px; }
.s-prog-bar { flex: 1; height: 5px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
.s-prog-fill { height: 100%; border-radius: 99px; transition: width .5s; }
.s-prog-pct { font-size: 11px; font-weight: 600; color: #64748b; white-space: nowrap; }
.row-menu-btn { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; border: none; background: none; color: #94a3b8; cursor: pointer; transition: background .12s, color .12s; }
.row-menu-btn:hover { background: #f1f5f9; color: #475569; }

/* Grid view */
.grid-view { flex: 1; overflow-y: auto; padding: 16px 26px; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; align-content: start; }
.sg-card {
  background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;
  overflow: hidden; display: flex; flex-direction: column;
  animation: fadeUp .22s ease both;
  transition: border-color .15s, box-shadow .15s, transform .15s;
}
.sg-card:hover { border-color: #a5b4fc; box-shadow: 0 4px 16px rgba(79,70,229,.08); transform: translateY(-2px); }
.sgc-accent { height: 3px; }
.sgc-body { padding: 14px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
.sgc-top { display: flex; align-items: center; justify-content: space-between; }
.sgc-name { font-size: 13px; font-weight: 600; color: #0f172a; line-height: 1.3; }
.sgc-key { font-size: 11px; color: #94a3b8; }
.sgc-progress { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.sgc-footer { display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; border-top: 1px solid #f1f5f9; background: #f8fafc; }

/* Pagination */
.pagination-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 26px; background: #fff; border-top: 1px solid #e2e8f0; flex-shrink: 0; }
.pag-info { font-size: 12px; color: #94a3b8; }
.pag-btns { display: flex; gap: 4px; }
.pag-btn { display: flex; align-items: center; justify-content: center; min-width: 30px; height: 30px; padding: 0 8px; border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; font-size: 12px; color: #475569; cursor: pointer; transition: background .12s, border-color .12s; }
.pag-btn:hover:not(:disabled) { background: #f1f5f9; }
.pag-btn--active { background: #eef2ff; border-color: #c7d2fe; color: #4f46e5; font-weight: 600; }
.pag-btn:disabled { opacity: .4; cursor: default; }

/* Dialog */
.dialog-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.3); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
.dialog { background: #fff; border-radius: 16px; width: 100%; max-width: 560px; box-shadow: 0 20px 60px rgba(0,0,0,.15); display: flex; flex-direction: column; animation: scaleIn .2s ease; max-height: 90vh; overflow: hidden; }
.dialog-hd { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; }
.dialog-title { font-size: 15px; font-weight: 700; color: #0f172a; }
.dialog-close { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px; border: none; background: none; color: #94a3b8; cursor: pointer; transition: background .12s; }
.dialog-close:hover { background: #f1f5f9; }
.dialog-body { flex: 1; overflow-y: auto; padding: 20px 22px; display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-label { font-size: 12px; font-weight: 600; color: #475569; }
.req { color: #ef4444; }
.form-input, .form-select, .form-textarea {
  padding: 8px 12px; border-radius: 8px; border: 1px solid #e2e8f0;
  background: #fff; font-size: 13px; color: #1e293b;
  font-family: 'Inter', sans-serif; outline: none;
  transition: border-color .15s, box-shadow .15s;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #a5b4fc; box-shadow: 0 0 0 3px rgba(99,102,241,.1);
}
.form-textarea { resize: vertical; min-height: 72px; }
.dialog-footer { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 14px 22px; border-top: 1px solid #e2e8f0; background: #f8fafc; flex-shrink: 0; }
.dlg-btn { padding: 8px 18px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; font-size: 12.5px; font-weight: 500; color: #475569; cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s; }
.dlg-btn:hover { background: #f1f5f9; }
.dlg-btn--primary { background: #4f46e5; border-color: #4f46e5; color: #fff; box-shadow: 0 2px 8px rgba(79,70,229,.25); }
.dlg-btn--primary:hover { background: #4338ca; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: scale(1); } }
</style>
