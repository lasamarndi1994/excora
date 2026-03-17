<template>
  <div class="files-root" @click="closeAllMenus">

    <!-- Toolbar -->
    <div class="files-toolbar">
      <div class="ft-left">
        <div class="view-toggle">
          <button class="vt-btn" :class="{ active: view === 'grid' }" @click="view = 'grid'" title="Grid view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>
          </button>
          <button class="vt-btn" :class="{ active: view === 'list' }" @click="view = 'list'" title="List view">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>

        <!-- Filter -->
        <div style="position:relative">
          <button class="ft-btn" :class="{ active: activeFilters.length > 0 }" @click.stop="filterOpen = !filterOpen; sortOpen = false">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Filter
            <span v-if="activeFilters.length" class="badge">{{ activeFilters.length }}</span>
          </button>
          <div v-if="filterOpen" class="dd-panel" @click.stop>
            <div class="dd-title">Filter by type</div>
            <label v-for="ft in fileTypes" :key="ft" class="dd-check">
              <input type="checkbox" :value="ft" v-model="activeFilters" />
              {{ ft }}
            </label>
            <button v-if="activeFilters.length" class="dd-clear" @click="activeFilters = []">Clear filters</button>
          </div>
        </div>

        <!-- Sort -->
        <div style="position:relative">
          <button class="ft-btn" @click.stop="sortOpen = !sortOpen; filterOpen = false">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><polyline points="19 12 12 19 5 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            Sort
            <span v-if="sortBy !== 'name'" class="badge-dot"></span>
          </button>
          <div v-if="sortOpen" class="dd-panel" @click.stop>
            <div class="dd-title">Sort by</div>
            <button v-for="opt in sortOptions" :key="opt.value"
              class="dd-opt" :class="{ active: sortBy === opt.value }"
              @click="setSortBy(opt.value); sortOpen = false">
              {{ opt.label }}
              <svg v-if="sortBy === opt.value" width="12" height="12" viewBox="0 0 24 24" fill="none" style="margin-left:auto"><path d="M5 13l4 4L19 7" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      <button class="upload-btn" @click="triggerUpload">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="17 8 12 3 7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Upload file
      </button>
      <input ref="fileInputRef" type="file" multiple style="display:none" @change="onFileInputChange" />
    </div>

    <!-- Drop zone -->
    <div class="drop-zone" :class="{ active: dragging }"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" style="color:#94a3b8;margin-bottom:8px"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12v9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="m16 16-4-4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div class="dz-title">Drop files here to upload</div>
      <div class="dz-sub">or click Upload file above</div>
    </div>

    <div class="section-label">
      {{ activeFilters.length ? 'Filtered' : 'All' }} files ({{ filteredFiles.length }})
    </div>

    <!-- Grid view -->
    <div v-if="view === 'grid'" class="file-grid">
      <div v-for="(f, i) in filteredFiles" :key="f.id" class="fg-card"
        :style="{ animationDelay: i * 40 + 'ms' }"
        @click="openPreview(f)">
        <div class="fg-icon" :style="{ background: f.iconBg }">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" :style="{ color: f.iconColor }" v-html="f.iconSvg"></svg>
        </div>
        <div class="fg-name">{{ f.name }}</div>
        <div class="fg-meta">{{ f.size }} · {{ f.date }}</div>
        <div class="fg-actions">
          <button class="fa-btn" title="Download" @click.stop="downloadFile(f)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <div style="position:relative">
            <button class="fa-btn" title="More options" @click.stop="openMenu(f.id)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/></svg>
            </button>
            <div v-if="menuOpenId === f.id" class="ctx-menu" @click.stop>
              <button class="ctx-item" @click="openPreview(f); menuOpenId = null">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                Preview
              </button>
              <button class="ctx-item" @click="downloadFile(f); menuOpenId = null">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Download
              </button>
              <div class="ctx-divider"></div>
              <button class="ctx-item danger" @click="deleteFile(f.id); menuOpenId = null">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredFiles.length === 0" class="empty-state">No files match the current filter.</div>
    </div>

    <!-- List view -->
    <div v-else class="file-list-wrap">
      <table class="file-table">
        <thead>
          <tr>
            <th style="width:40%">Name</th>
            <th style="width:12%">Size</th>
            <th style="width:22%">Uploaded by</th>
            <th style="width:16%">Date</th>
            <th style="width:10%"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(f, i) in filteredFiles" :key="f.id" class="fl-row"
            :style="{ animationDelay: i * 35 + 'ms' }"
            @click="openPreview(f)">
            <td>
              <div class="fl-name-cell">
                <div class="fl-icon" :style="{ background: f.iconBg }">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :style="{ color: f.iconColor }" v-html="f.iconSvg"></svg>
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
              <div class="fl-actions">
                <button class="fa-btn" title="Download" @click.stop="downloadFile(f)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <div style="position:relative">
                  <button class="fa-btn" title="More options" @click.stop="openMenu(f.id)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/></svg>
                  </button>
                  <div v-if="menuOpenId === f.id" class="ctx-menu ctx-menu--left" @click.stop>
                    <button class="ctx-item" @click="openPreview(f); menuOpenId = null">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>
                      Preview
                    </button>
                    <button class="ctx-item" @click="downloadFile(f); menuOpenId = null">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                      Download
                    </button>
                    <div class="ctx-divider"></div>
                    <button class="ctx-item danger" @click="deleteFile(f.id); menuOpenId = null">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="filteredFiles.length === 0" class="empty-state">No files match the current filter.</div>
    </div>

    <!-- Preview drawer -->
    <teleport to="body">
      <div v-if="preview" class="drawer-overlay" @click.self="preview = null">
        <div class="drawer">
          <div class="drawer-hd">
            <div class="fl-icon" :style="{ background: preview.iconBg }">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :style="{ color: preview.iconColor }" v-html="preview.iconSvg"></svg>
            </div>
            <div class="drawer-info">
              <div class="drawer-fname">{{ preview.name }}</div>
              <div class="drawer-fmeta">{{ preview.size }} · {{ preview.date }}</div>
            </div>
            <button class="drawer-close" @click="preview = null">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="drawer-bd">
            <div class="preview-placeholder">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" :style="{ color: preview.iconColor, opacity: 0.4 }" v-html="preview.iconSvg"></svg>
              <div class="pp-text">Preview not available</div>
              <button class="download-btn" @click="downloadFile(preview)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                Download
              </button>
            </div>
            <div class="d-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/></svg>
              {{ preview.uploader }}
            </div>
            <div class="d-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              {{ preview.date }}
            </div>
            <div class="d-meta-row">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ preview.size }}
            </div>
          </div>
        </div>
      </div>
    </teleport>

  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'

type SortKey = 'name' | 'size' | 'date'

interface FileItem {
  id: number
  name: string
  size: string
  sizeBytes: number
  date: string
  dateTs: number
  type: string
  iconSvg: string
  iconColor: string
  iconBg: string
  uploader: string
  avInitials: string
  avBg: string
}

const view        = ref<'grid' | 'list'>('grid')
const dragging    = ref(false)
const filterOpen  = ref(false)
const sortOpen    = ref(false)
const menuOpenId  = ref<number | null>(null)
const preview     = ref<FileItem | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const activeFilters = ref<string[]>([])
const sortBy      = ref<SortKey>('name')

const fileTypes = ['PDF', 'Figma', 'Word', 'YAML', 'Excel', 'Video']

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'name', label: 'Name (A to Z)' },
  { value: 'size', label: 'File size' },
  { value: 'date', label: 'Date uploaded' },
]

const pdfSvg   = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="9" y1="17" x2="15" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
const figmaSvg = '<path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" stroke="currentColor" stroke-width="1.5"/><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" stroke="currentColor" stroke-width="1.5"/><path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" stroke="currentColor" stroke-width="1.5"/><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 15.5z" stroke="currentColor" stroke-width="1.5"/><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" stroke="currentColor" stroke-width="1.5"/>'
const wordSvg  = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="9" y1="17" x2="12" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
const codeSvg  = '<polyline points="16 18 22 12 16 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="8 6 2 12 8 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
const excelSvg = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="9" y1="17" x2="15" y2="17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="10" x2="12" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>'
const videoSvg = '<polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="1.5"/>'
const fileSvg  = '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="14 2 14 8 20 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'

const files = ref<FileItem[]>([
  { id: 1, name: 'Project Brief.pdf',     size: '2.4 MB', sizeBytes: 2400000, date: 'Mar 10, 2025', dateTs: 1741564800, type: 'PDF',   iconSvg: pdfSvg,   iconColor: '#ef4444', iconBg: '#fef2f2', uploader: 'Arjun P.',  avInitials: 'AP', avBg: '#fed7aa' },
  { id: 2, name: 'Design Mockup.fig',     size: '8.1 MB', sizeBytes: 8100000, date: 'Mar 11, 2025', dateTs: 1741651200, type: 'Figma', iconSvg: figmaSvg, iconColor: '#7c3aed', iconBg: '#f5f3ff', uploader: 'Sara M.',   avInitials: 'SM', avBg: '#fef3c7' },
  { id: 3, name: 'Sprint Notes.docx',     size: '340 KB', sizeBytes: 340000,  date: 'Mar 12, 2025', dateTs: 1741737600, type: 'Word',  iconSvg: wordSvg,  iconColor: '#2563eb', iconBg: '#eff6ff', uploader: 'Raj R.',    avInitials: 'RR', avBg: '#fde68a' },
  { id: 4, name: 'API Spec.yaml',         size: '56 KB',  sizeBytes: 56000,   date: 'Mar 13, 2025', dateTs: 1741824000, type: 'YAML',  iconSvg: codeSvg,  iconColor: '#16a34a', iconBg: '#f0fdf4', uploader: 'Uma P.',    avInitials: 'UP', avBg: '#ede9fe' },
  { id: 5, name: 'Velocity Chart.xlsx',   size: '1.2 MB', sizeBytes: 1200000, date: 'Mar 14, 2025', dateTs: 1741910400, type: 'Excel', iconSvg: excelSvg, iconColor: '#15803d', iconBg: '#f0fdf4', uploader: 'Arjun P.',  avInitials: 'AP', avBg: '#fed7aa' },
  { id: 6, name: 'Screen Recording.mp4', size: '45 MB',  sizeBytes: 45000000, date: 'Mar 15, 2025', dateTs: 1741996800, type: 'Video', iconSvg: videoSvg, iconColor: '#db2777', iconBg: '#fdf2f8', uploader: 'Sara M.',   avInitials: 'SM', avBg: '#fef3c7' },
])

const filteredFiles = computed(() => {
  let result = files.value
  if (activeFilters.value.length) {
    result = result.filter(f => activeFilters.value.includes(f.type))
  }
  return [...result].sort((a, b) => {
    if (sortBy.value === 'size') return b.sizeBytes - a.sizeBytes
    if (sortBy.value === 'date') return b.dateTs - a.dateTs
    return a.name.localeCompare(b.name)
  })
})

function setSortBy(v: string) {
  sortBy.value = v as SortKey
}

function openPreview(f: FileItem) {
  preview.value = f
  menuOpenId.value = null
}

function openMenu(id: number) {
  menuOpenId.value = menuOpenId.value === id ? null : id
}

function closeAllMenus() {
  menuOpenId.value = null
  filterOpen.value = false
  sortOpen.value = false
}

function downloadFile(f: FileItem) {
  console.log('Download:', f.name)
}

function deleteFile(id: number) {
  files.value = files.value.filter(f => f.id !== id)
  if (preview.value?.id === id) preview.value = null
}

function triggerUpload() {
  fileInputRef.value?.click()
}

function onFileInputChange(e: Event) {
  const input = e.target as HTMLInputElement
  if (!input.files) return
  Array.from(input.files).forEach((file, idx) => {
    files.value.push({
      id: Date.now() + idx,
      name: file.name,
      size: file.size > 1_000_000
        ? `${(file.size / 1_000_000).toFixed(1)} MB`
        : `${Math.round(file.size / 1000)} KB`,
      sizeBytes: file.size,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dateTs: Date.now(),
      type: (file.name.split('.').pop() ?? 'FILE').toUpperCase(),
      iconSvg: fileSvg,
      iconColor: '#64748b',
      iconBg: '#f1f5f9',
      uploader: 'You',
      avInitials: 'YO',
      avBg: '#e0e7ff',
    })
  })
  input.value = ''
}

function onDrop(e: DragEvent) {
  dragging.value = false
  if (!e.dataTransfer?.files.length) return
  const fakeEvent = { target: { files: e.dataTransfer.files, value: '' } } as unknown as Event
  onFileInputChange(fakeEvent)
}
</script>


<style scoped>
.files-root {
  display: flex; flex-direction: column; height: 100%;
  overflow: hidden; font-family: 'Inter', sans-serif; background: #f8fafc;
}

/* Toolbar */
.files-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 24px; background: #fff; border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0; gap: 8px; flex-wrap: wrap;
}
.ft-left { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

.view-toggle {
  display: flex; border: 1px solid #e2e8f0; border-radius: 7px; overflow: hidden;
}
.vt-btn {
  display: flex; align-items: center; justify-content: center;
  width: 30px; height: 28px; border: none; background: #fff;
  color: #64748b; cursor: pointer; transition: background .12s, color .12s;
}
.vt-btn.active { background: #eef2ff; color: #4f46e5; }

.ft-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: 7px; border: 1px solid #e2e8f0;
  background: #fff; font-size: 12px; color: #64748b; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: background .12s, color .12s;
  position: relative;
}
.ft-btn:hover { background: #f1f5f9; color: #0f172a; }
.ft-btn.active { border-color: #a5b4fc; color: #4f46e5; background: #eef2ff; }

.badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; border-radius: 50%;
  background: #4f46e5; color: #fff; font-size: 10px; font-weight: 700;
}
.badge-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #4f46e5;
  position: absolute; top: 4px; right: 4px;
}

.upload-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 14px; border-radius: 8px; border: none;
  background: #4f46e5; color: #fff; font-size: 12.5px; font-weight: 600;
  cursor: pointer; font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 8px rgba(79,70,229,.25); transition: background .12s;
}
.upload-btn:hover { background: #4338ca; }

/* Dropdown panels */
.dd-panel {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 500;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.12); min-width: 180px; padding: 8px;
}
.dd-title {
  font-size: 10px; font-weight: 700; text-transform: uppercase;
  letter-spacing: .06em; color: #94a3b8; padding: 4px 8px 6px;
}
.dd-check {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 8px; border-radius: 6px; font-size: 12.5px; color: #374151;
  cursor: pointer; transition: background .1s;
}
.dd-check:hover { background: #f8fafc; }
.dd-check input { accent-color: #4f46e5; cursor: pointer; }
.dd-opt {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 7px 10px; border-radius: 7px; border: none;
  background: none; font-size: 12.5px; color: #374151; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: background .1s; text-align: left;
}
.dd-opt:hover, .dd-opt.active { background: #f5f3ff; color: #4f46e5; }
.dd-clear {
  width: 100%; margin-top: 4px; padding: 6px 8px; border-radius: 6px;
  border: none; background: #fef2f2; color: #ef4444; font-size: 12px;
  font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif;
}
.dd-clear:hover { background: #fee2e2; }

/* Drop zone */
.drop-zone {
  margin: 14px 24px 0; border: 2px dashed #e2e8f0; border-radius: 12px;
  padding: 24px; display: flex; flex-direction: column; align-items: center;
  background: #fff; transition: border-color .15s, background .15s;
  flex-shrink: 0; cursor: pointer;
}
.drop-zone.active { border-color: #818cf8; background: #f5f3ff; }
.dz-title { font-size: 13px; font-weight: 500; color: #475569; }
.dz-sub { font-size: 11.5px; color: #94a3b8; margin-top: 3px; }

.section-label {
  padding: 12px 24px 8px; font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: .05em; color: #94a3b8; flex-shrink: 0;
}

/* ── Grid: responsive, capped width on large screens ── */
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  padding: 0 24px 24px;
  overflow-y: auto;
  flex: 1;
  align-content: start;
}

@media (min-width: 1280px) {
  .file-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 175px));
  }
}

.fg-card {
  background: #fff; border-radius: 12px; border: 1px solid #e2e8f0;
  padding: 14px 12px; display: flex; flex-direction: column;
  align-items: center; text-align: center; cursor: pointer;
  animation: fadeUp .22s ease both;
  transition: border-color .15s, box-shadow .15s, transform .15s;
}
.fg-card:hover {
  border-color: #a5b4fc;
  box-shadow: 0 4px 14px rgba(79,70,229,.08);
  transform: translateY(-2px);
}
.fg-icon {
  width: 52px; height: 52px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; margin-bottom: 10px;
}
.fg-name { font-size: 12px; font-weight: 600; color: #0f172a; margin-bottom: 3px; word-break: break-word; }
.fg-meta { font-size: 10.5px; color: #94a3b8; }
.fg-actions { display: flex; gap: 4px; margin-top: 8px; opacity: 0; transition: opacity .15s; }
.fg-card:hover .fg-actions { opacity: 1; }

/* List view */
.file-list-wrap { flex: 1; overflow-y: auto; padding: 0 24px 24px; }
.file-table {
  width: 100%; border-collapse: collapse; background: #fff;
  border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;
}
.file-table thead th {
  padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600;
  color: #94a3b8; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase; letter-spacing: .04em;
}
.fl-row { cursor: pointer; animation: fadeUp .22s ease both; }
.fl-row:hover td { background: #f8fafc; }
.fl-row td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
.fl-name-cell { display: flex; align-items: center; gap: 10px; }
.fl-icon {
  width: 30px; height: 30px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.fl-name { font-size: 13px; font-weight: 500; color: #0f172a; }
.fl-meta { font-size: 12px; color: #64748b; }
.fl-uploader { display: flex; align-items: center; gap: 8px; }
.fl-av {
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 700; color: #475569; flex-shrink: 0;
}
.fl-actions { display: flex; gap: 4px; justify-content: flex-end; opacity: 0; transition: opacity .15s; }
.fl-row:hover .fl-actions { opacity: 1; }

/* Shared action button */
.fa-btn {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 6px; border: 1px solid #e2e8f0;
  background: #fff; color: #94a3b8; cursor: pointer;
  transition: background .12s, color .12s;
}
.fa-btn:hover { background: #eef2ff; color: #4f46e5; border-color: #c7d2fe; }

/* Context menu */
.ctx-menu {
  position: absolute; top: 100%; right: 0; z-index: 600;
  background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.13); min-width: 150px; padding: 4px;
}
.ctx-menu--left { right: auto; left: 0; }
.ctx-item {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 7px 10px; border-radius: 7px; border: none;
  background: none; font-size: 12.5px; color: #374151; cursor: pointer;
  font-family: 'Inter', sans-serif; transition: background .1s; text-align: left;
}
.ctx-item:hover { background: #f5f3ff; color: #4f46e5; }
.ctx-item.danger { color: #ef4444; }
.ctx-item.danger:hover { background: #fef2f2; color: #dc2626; }
.ctx-divider { height: 1px; background: #f1f5f9; margin: 4px 0; }

/* Preview drawer */
.drawer-overlay {
  position: fixed; inset: 0; background: rgba(15,23,42,.2);
  z-index: 1200; display: flex; justify-content: flex-end;
}
.drawer {
  width: 340px; background: #fff; height: 100%;
  box-shadow: -4px 0 24px rgba(0,0,0,.1);
  display: flex; flex-direction: column; animation: slideIn .2s ease;
}
.drawer-hd {
  display: flex; align-items: center; gap: 10px;
  padding: 16px 18px; border-bottom: 1px solid #e2e8f0;
}
.drawer-info { flex: 1; min-width: 0; }
.drawer-fname {
  font-size: 13px; font-weight: 600; color: #0f172a;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.drawer-fmeta { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.drawer-close {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 6px; border: none;
  background: none; color: #94a3b8; cursor: pointer; transition: background .12s;
}
.drawer-close:hover { background: #f1f5f9; }
.drawer-bd {
  flex: 1; overflow-y: auto; padding: 16px 18px;
  display: flex; flex-direction: column; gap: 10px;
}
.preview-placeholder {
  display: flex; flex-direction: column; align-items: center; padding: 24px 0; gap: 10px;
}
.pp-text { font-size: 12.5px; color: #94a3b8; }
.download-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 14px; border-radius: 8px; border: none;
  background: #eef2ff; color: #4f46e5; font-size: 12.5px; font-weight: 600;
  cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s;
}
.download-btn:hover { background: #e0e7ff; }
.d-meta-row { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #64748b; }

.empty-state {
  grid-column: 1 / -1; text-align: center;
  padding: 40px; font-size: 13px; color: #94a3b8;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes slideIn {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}
</style>
