<template>
  <div class="files-root" @click="closeMenus">

    <!-- Toolbar -->
    <div class="files-toolbar">
      <div class="ft-left">
        <!-- View toggle -->
        <div class="view-toggle">
          <button class="vt-btn" :class="{ active: view === 'grid' }" @click="view = 'grid'" title="Grid view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>
          </button>
          <button class="vt-btn" :class="{ active: view === 'list' }" @click="view = 'list'" title="List view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>

        <!-- Search -->
        <div class="ft-search-wrap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#94a3b8" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/></svg>
          <input class="ft-search" v-model="searchQuery" placeholder="Search files…" />
          <button v-if="searchQuery" class="ft-search-clear" @click="searchQuery = ''">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
          </button>
        </div>

        <!-- Filter by type -->
        <div class="ft-wrap" ref="filterBtnRef">
          <button class="ft-btn" :class="{ active: typeFilter !== 'all' }" @click.stop="toggleDropdown('filter', ($event.currentTarget as HTMLElement).closest('.ft-wrap') as HTMLElement)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            {{ typeFilter === 'all' ? 'Filter' : typeFilter }}
            <span v-if="typeFilter !== 'all'" class="ft-badge">1</span>
          </button>
        </div>

        <!-- Sort -->
        <div class="ft-wrap" ref="sortBtnRef">
          <button class="ft-btn" :class="{ active: sortBy !== 'date-desc' }" @click.stop="toggleDropdown('sort', ($event.currentTarget as HTMLElement).closest('.ft-wrap') as HTMLElement)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Sort
            <span v-if="sortBy !== 'date-desc'" class="ft-badge-text">· {{ sortOptions.find(s=>s.value===sortBy)?.label }}</span>
          </button>
        </div>
      </div>

      <!-- Upload -->
      <label class="upload-btn" title="Upload files">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Upload file
        <input type="file" multiple style="display:none" @change="handleUpload" />
      </label>
    </div>

    <!-- Drop zone -->
    <div class="drop-zone" :class="{ active: dragging }"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="handleDrop">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="color:#94a3b8;flex-shrink:0"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      <div>
        <div class="dz-title">{{ dragging ? 'Release to upload' : 'Drop files here to upload' }}</div>
        <div class="dz-sub">Supports all file types · Max 100 MB per file</div>
      </div>
    </div>

    <!-- Section label + count -->
    <div class="section-label">
      {{ visibleFiles.length }} {{ visibleFiles.length === 1 ? 'file' : 'files' }}
      <span v-if="searchQuery || typeFilter !== 'all'" class="section-label-sub">filtered from {{ files.length }} total</span>
    </div>

    <!-- Empty state -->
    <div v-if="visibleFiles.length === 0" class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style="color:#cbd5e1"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="13 2 13 9 20 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div class="empty-title">No files found</div>
      <div class="empty-sub">{{ searchQuery ? 'Try a different search term' : 'Upload files or drag them here' }}</div>
    </div>

    <!-- Grid view -->
    <div v-else-if="view === 'grid'" class="file-grid">
      <div v-for="(f, i) in visibleFiles" :key="f.id" class="fg-card"
        :style="{ animationDelay: i * 35 + 'ms' }"
        @click="openPreview(f)"
        @contextmenu.prevent="openCtxMenu(f, $event)">
        <div class="fg-icon" :style="{ background: f.iconBg }">
          <span class="file-emoji">{{ f.emoji }}</span>
        </div>
        <div class="fg-name" :title="f.name">{{ f.name }}</div>
        <div class="fg-meta">{{ f.size }} · {{ f.date }}</div>
        <div class="fg-actions" @click.stop>
          <button class="fa-btn" @click.stop="downloadFile(f)" title="Download">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <button class="fa-btn" @click.stop="openCtxMenu(f, $event)" title="More">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- List view -->
    <div v-else class="file-list-wrap">
      <table class="file-table">
        <thead>
          <tr>
            <th @click="toggleSort('name')" class="th-sortable">
              Name
              <svg v-if="sortBy.startsWith('name')" width="10" height="10" viewBox="0 0 24 24" fill="none"><path :d="sortBy === 'name-asc' ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7'" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </th>
            <th @click="toggleSort('size')" class="th-sortable">
              Size
              <svg v-if="sortBy.startsWith('size')" width="10" height="10" viewBox="0 0 24 24" fill="none"><path :d="sortBy === 'size-asc' ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7'" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </th>
            <th>Uploaded by</th>
            <th @click="toggleSort('date')" class="th-sortable">
              Date
              <svg v-if="sortBy.startsWith('date')" width="10" height="10" viewBox="0 0 24 24" fill="none"><path :d="sortBy === 'date-asc' ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7'" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(f, i) in visibleFiles" :key="f.id" class="fl-row"
            :style="{ animationDelay: i * 30 + 'ms' }"
            @click="openPreview(f)"
            @contextmenu.prevent="openCtxMenu(f, $event)">
            <td>
              <div class="fl-name-cell">
                <div class="fl-icon" :style="{ background: f.iconBg }">
                  <span style="font-size:13px">{{ f.emoji }}</span>
                </div>
                <span class="fl-name">{{ f.name }}</span>
              </div>
            </td>
            <td class="fl-meta">{{ f.size }}</td>
            <td>
              <div class="fl-uploader">
                <div class="fl-av" :style="{ background: f.avBg }">{{ f.avInitials }}</div>
                <span class="fl-meta">{{ f.uploader }}</span>
              </div>
            </td>
            <td class="fl-meta">{{ f.date }}</td>
            <td>
              <div class="fl-actions" @click.stop>
                <button class="fa-btn" @click.stop="downloadFile(f)" title="Download">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <button class="fa-btn" @click.stop="openCtxMenu(f, $event)" title="More">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Teleported dropdowns (fixed position, never clipped) -->
    <Teleport to="body">
      <div v-if="openDropdown === 'filter'" class="ft-panel-fixed" :style="dropdownStyle" @click.stop>
        <div class="ft-panel-title">File type</div>
        <div v-for="t in typeOptions" :key="t.value" class="ft-radio-row"
          :class="{ active: typeFilter === t.value }"
          @click="typeFilter = t.value; openDropdown = null">
          <span class="ft-radio" :class="{ checked: typeFilter === t.value }"></span>
          {{ t.label }}
        </div>
      </div>
      <div v-if="openDropdown === 'sort'" class="ft-panel-fixed" :style="dropdownStyle" @click.stop>
        <div class="ft-panel-title">Sort by</div>
        <div v-for="s in sortOptions" :key="s.value" class="ft-radio-row"
          :class="{ active: sortBy === s.value }"
          @click="sortBy = s.value; openDropdown = null">
          <span class="ft-radio" :class="{ checked: sortBy === s.value }"></span>
          {{ s.label }}
        </div>
      </div>
    </Teleport>

    <!-- Context menu -->
    <Teleport to="body">
    <div v-if="ctxMenu.open" class="ctx-menu"
      :style="{ top: ctxMenu.y + 'px', left: ctxMenu.x + 'px' }"
      @click.stop>
      <button class="ctx-item" @click="openPreview(ctxMenu.file!); closeMenus()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
        Preview
      </button>
      <button class="ctx-item" @click="startRename(ctxMenu.file!); closeMenus()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Rename
      </button>
      <button class="ctx-item" @click="downloadFile(ctxMenu.file!); closeMenus()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Download
      </button>
      <button class="ctx-item" @click="copyLink(ctxMenu.file!); closeMenus()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Copy link
      </button>
      <div class="ctx-divider"></div>
      <button class="ctx-item ctx-item--danger" @click="deleteFile(ctxMenu.file!.id); closeMenus()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg>
        Delete
      </button>
    </div>
    </Teleport>

    <!-- Rename modal -->
    <div v-if="renaming" class="modal-overlay" @click.self="renaming = null">
      <div class="modal" @click.stop>
        <div class="modal-title">Rename file</div>
        <input class="modal-input" v-model="renameValue" @keydown.enter="confirmRename" @keydown.esc="renaming = null" ref="renameInputRef" />
        <div class="modal-actions">
          <button class="modal-btn modal-btn--cancel" @click="renaming = null">Cancel</button>
          <button class="modal-btn modal-btn--confirm" @click="confirmRename">Rename</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast-fade">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </transition>

    <!-- Preview panel -->
    <transition name="panel-slide">
      <div v-if="preview" class="panel-overlay" @click.self="preview = null">
        <div class="panel">
          <div class="panel-hd">
            <div class="fl-icon" :style="{ background: preview.iconBg }">
              <span style="font-size:16px">{{ preview.emoji }}</span>
            </div>
            <div class="panel-info">
              <div class="panel-fname">{{ preview.name }}</div>
              <div class="panel-fmeta">{{ preview.size }} · {{ preview.date }}</div>
            </div>
            <button class="panel-close" @click="preview = null">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="panel-body">
            <div class="preview-area">
              <span style="font-size:64px">{{ preview.emoji }}</span>
              <div class="pp-text">Preview not available</div>
              <button class="download-btn" @click="downloadFile(preview)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Download
              </button>
            </div>
            <div class="panel-meta-section">
              <div class="panel-meta-title">File details</div>
              <div class="panel-meta-row">
                <span class="panel-meta-label">Uploaded by</span>
                <div class="fl-uploader">
                  <div class="fl-av" :style="{ background: preview.avBg }">{{ preview.avInitials }}</div>
                  <span>{{ preview.uploader }}</span>
                </div>
              </div>
              <div class="panel-meta-row">
                <span class="panel-meta-label">Date</span>
                <span>{{ preview.date }}</span>
              </div>
              <div class="panel-meta-row">
                <span class="panel-meta-label">Size</span>
                <span>{{ preview.size }}</span>
              </div>
              <div class="panel-meta-row">
                <span class="panel-meta-label">Type</span>
                <span>{{ preview.ext.toUpperCase() }}</span>
              </div>
            </div>
            <div class="panel-actions">
              <button class="panel-action-btn" @click="startRename(preview); preview = null">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Rename
              </button>
              <button class="panel-action-btn" @click="copyLink(preview)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Copy link
              </button>
              <button class="panel-action-btn panel-action-btn--danger" @click="deleteFile(preview.id); preview = null">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'

interface FileItem {
  id: number; name: string; ext: string; size: string; date: string
  emoji: string; iconBg: string
  uploader: string; avInitials: string; avBg: string
  type: 'doc' | 'image' | 'video' | 'code' | 'sheet' | 'other'
}

const view        = ref<'grid' | 'list'>('grid')
const dragging    = ref(false)
const searchQuery = ref('')
const typeFilter  = ref('all')
const sortBy      = ref('date-desc')
const filterOpen  = ref(false) // kept for compat, unused
const sortOpen    = ref(false) // kept for compat, unused
const preview     = ref<FileItem | null>(null)

// ── Fixed-position dropdown (teleported, never clipped) ──
const openDropdown  = ref<'filter' | 'sort' | null>(null)
const dropdownStyle = ref({ top: '0px', left: '0px' })
const filterBtnRef  = ref<HTMLElement | null>(null)
const sortBtnRef    = ref<HTMLElement | null>(null)

function toggleDropdown(name: 'filter' | 'sort', el: HTMLElement | null) {
  if (openDropdown.value === name) { openDropdown.value = null; return }
  if (el) {
    const r = el.getBoundingClientRect()
    dropdownStyle.value = { top: (r.bottom + 6) + 'px', left: r.left + 'px' }
  }
  openDropdown.value = name
}

function onDocClick() { openDropdown.value = null }
onMounted(() => document.addEventListener('mousedown', onDocClick))
onUnmounted(() => document.removeEventListener('mousedown', onDocClick))
const renaming    = ref<FileItem | null>(null)
const renameValue = ref('')
const renameInputRef = ref<HTMLInputElement | null>(null)
const toast       = ref('')
let toastTimer: ReturnType<typeof setTimeout>

const typeOptions = [
  { value: 'all',   label: 'All files' },
  { value: 'doc',   label: 'Documents' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'code',  label: 'Code' },
  { value: 'sheet', label: 'Spreadsheets' },
  { value: 'other', label: 'Other' },
]

const sortOptions = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc',  label: 'Oldest first' },
  { value: 'name-asc',  label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'size-desc', label: 'Largest first' },
  { value: 'size-asc',  label: 'Smallest first' },
]

let nid = 10
const files = ref<FileItem[]>([
  { id: 1, name: 'Project Brief.pdf',     ext: 'pdf',  size: '2.4 MB', date: 'Mar 10, 2025', emoji: '📄', iconBg: '#fef2f2', uploader: 'Arjun P.',  avInitials: 'AP', avBg: '#fed7aa', type: 'doc'   },
  { id: 2, name: 'Design Mockup.fig',     ext: 'fig',  size: '8.1 MB', date: 'Mar 11, 2025', emoji: '🎨', iconBg: '#f5f3ff', uploader: 'Sara M.',   avInitials: 'SM', avBg: '#fef3c7', type: 'image' },
  { id: 3, name: 'Sprint Notes.docx',     ext: 'docx', size: '340 KB', date: 'Mar 12, 2025', emoji: '📝', iconBg: '#eff6ff', uploader: 'Raj R.',    avInitials: 'RR', avBg: '#fde68a', type: 'doc'   },
  { id: 4, name: 'API Spec.yaml',         ext: 'yaml', size: '56 KB',  date: 'Mar 13, 2025', emoji: '⚙️', iconBg: '#f0fdf4', uploader: 'Uma P.',    avInitials: 'UP', avBg: '#ede9fe', type: 'code'  },
  { id: 5, name: 'Velocity Chart.xlsx',   ext: 'xlsx', size: '1.2 MB', date: 'Mar 14, 2025', emoji: '📊', iconBg: '#f0fdf4', uploader: 'Arjun P.',  avInitials: 'AP', avBg: '#fed7aa', type: 'sheet' },
  { id: 6, name: 'Screen Recording.mp4', ext: 'mp4',  size: '45 MB',  date: 'Mar 15, 2025', emoji: '🎬', iconBg: '#fdf2f8', uploader: 'Sara M.',   avInitials: 'SM', avBg: '#fef3c7', type: 'video' },
  { id: 7, name: 'Logo.png',             ext: 'png',  size: '180 KB', date: 'Mar 16, 2025', emoji: '🖼️', iconBg: '#fff7ed', uploader: 'Dev K.',    avInitials: 'DK', avBg: '#d1fae5', type: 'image' },
  { id: 8, name: 'main.ts',              ext: 'ts',   size: '12 KB',  date: 'Mar 17, 2025', emoji: '💻', iconBg: '#eff6ff', uploader: 'Raj R.',    avInitials: 'RR', avBg: '#fde68a', type: 'code'  },
])

// parse size to bytes for sorting
function parseSize(s: string): number {
  const n = parseFloat(s)
  if (s.includes('MB')) return n * 1024 * 1024
  if (s.includes('KB')) return n * 1024
  return n
}

const visibleFiles = computed(() => {
  let list = [...files.value]
  if (typeFilter.value !== 'all') list = list.filter(f => f.type === typeFilter.value)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(f => f.name.toLowerCase().includes(q) || f.ext.toLowerCase().includes(q))
  }
  switch (sortBy.value) {
    case 'name-asc':  list.sort((a, b) => a.name.localeCompare(b.name)); break
    case 'name-desc': list.sort((a, b) => b.name.localeCompare(a.name)); break
    case 'size-asc':  list.sort((a, b) => parseSize(a.size) - parseSize(b.size)); break
    case 'size-desc': list.sort((a, b) => parseSize(b.size) - parseSize(a.size)); break
    case 'date-asc':  list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); break
    case 'date-desc': list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); break
  }
  return list
})

function toggleSort(field: string) {
  if (sortBy.value === `${field}-desc`) sortBy.value = `${field}-asc`
  else sortBy.value = `${field}-desc`
}

// ── Context menu ──
const ctxMenu = ref({ open: false, x: 0, y: 0, file: null as FileItem | null })
function openCtxMenu(f: FileItem, e: MouseEvent) {
  ctxMenu.value = { open: true, x: e.clientX, y: e.clientY, file: f }
}

function closeMenus() {
  ctxMenu.value.open = false
  filterOpen.value = false
  sortOpen.value = false
  openDropdown.value = null
}

// ── Preview ──
function openPreview(f: FileItem) { preview.value = f }

// ── Upload ──
function getFileType(ext: string): FileItem['type'] {
  if (['pdf','doc','docx','txt','ppt','pptx'].includes(ext)) return 'doc'
  if (['png','jpg','jpeg','gif','svg','webp','fig'].includes(ext)) return 'image'
  if (['mp4','mov','avi','mkv','webm'].includes(ext)) return 'video'
  if (['ts','js','py','go','rs','yaml','json','html','css','vue'].includes(ext)) return 'code'
  if (['xls','xlsx','csv'].includes(ext)) return 'sheet'
  return 'other'
}
function getEmoji(ext: string): string {
  if (['pdf','doc','docx','txt'].includes(ext)) return '📄'
  if (['ppt','pptx'].includes(ext)) return '📊'
  if (['png','jpg','jpeg','gif','svg','webp'].includes(ext)) return '🖼️'
  if (['fig','sketch'].includes(ext)) return '🎨'
  if (['mp4','mov','avi','mkv'].includes(ext)) return '🎬'
  if (['ts','js','py','go','rs','vue'].includes(ext)) return '💻'
  if (['yaml','json','html','css'].includes(ext)) return '⚙️'
  if (['xls','xlsx','csv'].includes(ext)) return '📊'
  return '📁'
}
function getIconBg(type: FileItem['type']): string {
  const map: Record<string, string> = { doc: '#eff6ff', image: '#fff7ed', video: '#fdf2f8', code: '#f0fdf4', sheet: '#f0fdf4', other: '#f8fafc' }
  return map[type] ?? '#f8fafc'
}
function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  if (bytes >= 1024) return Math.round(bytes / 1024) + ' KB'
  return bytes + ' B'
}

function processFiles(fileList: File[]) {
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  for (const file of fileList) {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    const type = getFileType(ext)
    files.value.unshift({
      id: nid++, name: file.name, ext, size: formatSize(file.size), date: now,
      emoji: getEmoji(ext), iconBg: getIconBg(type), type,
      uploader: 'Me', avInitials: 'Me', avBg: '#4f46e5',
    })
  }
  showToast(`${fileList.length} file${fileList.length > 1 ? 's' : ''} uploaded`)
}

function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement
  if (input.files?.length) processFiles(Array.from(input.files))
  input.value = ''
}

function handleDrop(e: DragEvent) {
  dragging.value = false
  if (e.dataTransfer?.files.length) processFiles(Array.from(e.dataTransfer.files))
}

// ── Actions ──
function downloadFile(f: FileItem) {
  showToast(`Downloading ${f.name}…`)
}

function copyLink(f: FileItem) {
  navigator.clipboard?.writeText(`https://app.execora.com/files/${f.id}`).catch(() => {})
  showToast('Link copied to clipboard')
}

function deleteFile(id: number) {
  files.value = files.value.filter(f => f.id !== id)
  showToast('File deleted')
}

function startRename(f: FileItem) {
  renaming.value = f
  renameValue.value = f.name
  nextTick(() => { renameInputRef.value?.focus(); renameInputRef.value?.select() })
}

function confirmRename() {
  if (!renaming.value || !renameValue.value.trim()) return
  const f = files.value.find(f => f.id === renaming.value!.id)
  if (f) {
    f.name = renameValue.value.trim()
    const ext = f.name.split('.').pop()?.toLowerCase() ?? ''
    f.ext = ext
  }
  showToast('File renamed')
  renaming.value = null
}

function showToast(msg: string) {
  toast.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toast.value = '' }, 2500)
}
</script>

<style scoped>
/* ── Root ── */
.files-root { display: flex; flex-direction: column; gap: 0; padding: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1e293b; min-height: 0; flex: 1; overflow-y: auto; overflow-x: hidden; }

/* ── Toolbar ── */
.files-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; padding: 10px 20px; background: #fff; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 50; flex-shrink: 0; }
.ft-left { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

/* ── View toggle ── */
.view-toggle { display: flex; border: 1px solid #e2e8f0; border-radius: 7px; overflow: hidden; }
.vt-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: none; background: none; color: #94a3b8; cursor: pointer; transition: background .12s, color .12s; }
.vt-btn:hover { background: #f1f5f9; color: #475569; }
.vt-btn.active { background: #eef2ff; color: #4f46e5; }

/* ── Search ── */
.ft-search-wrap { display: flex; align-items: center; gap: 6px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 7px; padding: 4px 8px; min-width: 160px; }
.ft-search { border: none; outline: none; background: none; font-size: 12.5px; color: #0f172a; font-family: 'Inter', sans-serif; flex: 1; width: 110px; }
.ft-search-clear { display: flex; align-items: center; border: none; background: none; color: #94a3b8; cursor: pointer; padding: 0; }
.ft-search-clear:hover { color: #ef4444; }

/* ── Filter / Sort wraps ── */
.ft-wrap { position: relative; }
.ft-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 10px; border-radius: 6px; border: none; background: none; font-size: 12px; color: #64748b; cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s, color .12s; white-space: nowrap; }
.ft-btn:hover, .ft-btn.active { background: #f1f5f9; color: #4f46e5; }
.ft-badge { background: #4f46e5; color: #fff; font-size: 9px; font-weight: 700; padding: 1px 5px; border-radius: 20px; margin-left: 2px; }
.ft-badge-text { font-size: 10.5px; color: #4f46e5; font-weight: 600; }

.ft-panel { position: absolute; top: calc(100% + 6px); left: 0; z-index: 400; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.12); min-width: 180px; padding: 6px; }
.ft-panel-fixed { position: fixed; z-index: 9999; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.15); min-width: 180px; padding: 6px; }
.ft-panel-title { font-size: 10.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; padding: 4px 8px 6px; }
.ft-radio-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 7px; cursor: pointer; font-size: 12.5px; color: #374151; transition: background .1s; }
.ft-radio-row:hover, .ft-radio-row.active { background: #f8fafc; }
.ft-radio { width: 14px; height: 14px; border-radius: 50%; border: 1.5px solid #cbd5e1; flex-shrink: 0; transition: all .12s; }
.ft-radio.checked { border-color: #4f46e5; border-width: 4px; }

/* ── Upload button ── */
.upload-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; font-size: 12.5px; font-weight: 500; color: #475569; cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s, border-color .12s; white-space: nowrap; }
.upload-btn:hover { background: #f8fafc; border-color: #a5b4fc; color: #4f46e5; }

/* ── Drop zone ── */
.drop-zone { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 14px 20px; border: 2px dashed #e2e8f0; border-radius: 10px; background: #f8fafc; transition: border-color .15s, background .15s; text-align: center; margin: 12px 20px 0; flex-direction: row; gap: 10px; }
.drop-zone.active { border-color: #a5b4fc; background: #eef2ff; }
.dz-title { font-size: 12.5px; font-weight: 600; color: #475569; }
.dz-sub { font-size: 11.5px; color: #94a3b8; }

/* ── Section label ── */
.section-label { font-size: 11.5px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; padding: 12px 20px 6px; }
.section-label-sub { font-weight: 400; text-transform: none; letter-spacing: 0; margin-left: 6px; }

/* ── Empty state ── */
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 48px 20px; text-align: center; flex: 1; }
.empty-title { font-size: 14px; font-weight: 600; color: #475569; }
.empty-sub { font-size: 12.5px; color: #94a3b8; }

/* ── Grid ── */
.file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; padding: 0 20px 20px; }
.fg-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 12px 10px; cursor: pointer; animation: fadeUp .22s ease both; transition: border-color .15s, box-shadow .15s, transform .15s; position: relative; }
.fg-card:hover { border-color: #a5b4fc; box-shadow: 0 4px 14px rgba(79,70,229,.08); transform: translateY(-2px); }
.fg-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
.file-emoji { font-size: 22px; }
.fg-name { font-size: 12.5px; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
.fg-meta { font-size: 11px; color: #94a3b8; }
.fg-actions { display: flex; gap: 4px; margin-top: 8px; opacity: 0; transition: opacity .15s; }
.fg-card:hover .fg-actions { opacity: 1; }
.fa-btn { display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 6px; border: none; background: #f1f5f9; color: #64748b; cursor: pointer; transition: background .12s, color .12s; }
.fa-btn:hover { background: #eef2ff; color: #4f46e5; }

/* ── List ── */
.file-list-wrap { overflow-x: auto; padding: 0 20px 20px; }
.file-table { width: 100%; border-collapse: collapse; }
.file-table th { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .04em; padding: 6px 12px; text-align: left; border-bottom: 1px solid #f1f5f9; white-space: nowrap; }
.th-sortable { cursor: pointer; user-select: none; }
.th-sortable:hover { color: #4f46e5; }
.fl-row { cursor: pointer; animation: fadeUp .2s ease both; transition: background .1s; }
.fl-row:hover { background: #f8fafc; }
.fl-row td { padding: 9px 12px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
.fl-name-cell { display: flex; align-items: center; gap: 8px; }
.fl-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fl-name { font-size: 12.5px; font-weight: 500; color: #0f172a; }
.fl-meta { font-size: 12px; color: #94a3b8; white-space: nowrap; }
.fl-uploader { display: flex; align-items: center; gap: 6px; }
.fl-av { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 700; color: #fff; flex-shrink: 0; }
.fl-actions { display: flex; gap: 4px; opacity: 0; transition: opacity .15s; }
.fl-row:hover .fl-actions { opacity: 1; }

/* ── Context menu ── */
.ctx-menu { position: fixed; z-index: 1200; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,.14); min-width: 170px; padding: 4px; }
.ctx-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 10px; border: none; background: none; font-size: 12.5px; color: #374151; cursor: pointer; border-radius: 7px; font-family: 'Inter', sans-serif; text-align: left; transition: background .1s; }
.ctx-item:hover { background: #f8fafc; }
.ctx-item--danger { color: #ef4444; }
.ctx-item--danger:hover { background: #fef2f2; }
.ctx-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

/* ── Rename modal ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.35); z-index: 1300; display: flex; align-items: center; justify-content: center; }
.modal { background: #fff; border-radius: 14px; padding: 24px; width: 360px; max-width: 95vw; box-shadow: 0 20px 60px rgba(0,0,0,.18); }
.modal-title { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 14px; }
.modal-input { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 9px 12px; font-size: 13px; color: #0f172a; font-family: 'Inter', sans-serif; outline: none; box-sizing: border-box; transition: border-color .15s; }
.modal-input:focus { border-color: #a5b4fc; }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
.modal-btn { padding: 7px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; border: none; transition: background .12s; }
.modal-btn--cancel { background: #f1f5f9; color: #475569; }
.modal-btn--cancel:hover { background: #e2e8f0; }
.modal-btn--confirm { background: #4f46e5; color: #fff; }
.modal-btn--confirm:hover { background: #4338ca; }

/* ── Toast ── */
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #0f172a; color: #fff; font-size: 12.5px; font-weight: 500; padding: 9px 18px; border-radius: 20px; box-shadow: 0 4px 16px rgba(0,0,0,.2); z-index: 1500; pointer-events: none; white-space: nowrap; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity .2s, transform .2s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }

/* ── Preview panel ── */
.panel-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.25); z-index: 1100; display: flex; justify-content: flex-end; }
.panel { width: 420px; max-width: 95vw; background: #fff; height: 100%; box-shadow: -6px 0 32px rgba(0,0,0,.14); display: flex; flex-direction: column; overflow: hidden; }
.panel-slide-enter-active, .panel-slide-leave-active { transition: transform .22s ease; }
.panel-slide-enter-from, .panel-slide-leave-to { transform: translateX(100%); }
.panel-hd { display: flex; align-items: center; gap: 10px; padding: 14px 16px; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; }
.panel-info { flex: 1; min-width: 0; }
.panel-fname { font-size: 14px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.panel-fmeta { font-size: 11.5px; color: #94a3b8; margin-top: 2px; }
.panel-close { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 7px; border: none; background: none; color: #94a3b8; cursor: pointer; transition: background .12s, color .12s; flex-shrink: 0; }
.panel-close:hover { background: #fef2f2; color: #ef4444; }
.panel-body { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 20px; }
.preview-area { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 32px 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
.pp-text { font-size: 12.5px; color: #94a3b8; }
.download-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 16px; border-radius: 8px; border: 1px solid #e2e8f0; background: #fff; font-size: 12.5px; font-weight: 500; color: #475569; cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s, border-color .12s; }
.download-btn:hover { background: #f8fafc; border-color: #a5b4fc; color: #4f46e5; }
.panel-meta-section { display: flex; flex-direction: column; gap: 2px; }
.panel-meta-title { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 6px; }
.panel-meta-row { display: flex; align-items: center; min-height: 34px; border-bottom: 1px solid #f8fafc; font-size: 12.5px; }
.panel-meta-row:last-child { border-bottom: none; }
.panel-meta-label { width: 90px; flex-shrink: 0; color: #94a3b8; font-size: 12px; }
.panel-actions { display: flex; flex-direction: column; gap: 4px; }
.panel-action-btn { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 8px; border: none; background: none; font-size: 12.5px; color: #374151; cursor: pointer; font-family: 'Inter', sans-serif; text-align: left; transition: background .1s; }
.panel-action-btn:hover { background: #f8fafc; }
.panel-action-btn--danger { color: #ef4444; }
.panel-action-btn--danger:hover { background: #fef2f2; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
</style>
