<template>
  <div class="files-root">
    <!-- Toolbar -->
    <div class="files-toolbar">
      <div class="ft-left">
        <div class="view-toggle">
          <button class="vt-btn" :class="{ active: view === 'grid' }" @click="view = 'grid'">
            <v-icon size="14">mdi-view-grid-outline</v-icon>
          </button>
          <button class="vt-btn" :class="{ active: view === 'list' }" @click="view = 'list'">
            <v-icon size="14">mdi-format-list-bulleted</v-icon>
          </button>
        </div>
        <button class="ft-btn"><v-icon size="13">mdi-filter-variant</v-icon> Filter</button>
        <button class="ft-btn"><v-icon size="13">mdi-swap-vertical</v-icon> Sort</button>
      </div>
      <button class="upload-btn"><v-icon size="14">mdi-upload-outline</v-icon> Upload file</button>
    </div>

    <!-- Drop zone -->
    <div class="drop-zone" :class="{ active: dragging }"
      @dragover.prevent="dragging = true" @dragleave="dragging = false" @drop.prevent="dragging = false">
      <v-icon size="32" style="color:#94a3b8;margin-bottom:8px">mdi-cloud-upload-outline</v-icon>
      <div class="dz-title">Drop files here to upload</div>
      <div class="dz-sub">or click Upload file above</div>
    </div>

    <div class="section-label">All files ({{ files.length }})</div>

    <!-- Grid view -->
    <div v-if="view === 'grid'" class="file-grid">
      <div v-for="(f, i) in files" :key="f.id" class="fg-card"
        :style="{ animationDelay: i * 40 + 'ms' }" @click="preview = f">
        <div class="fg-icon" :style="{ background: f.iconBg }">
          <v-icon size="26" :color="f.iconColor">{{ f.icon }}</v-icon>
        </div>
        <div class="fg-name">{{ f.name }}</div>
        <div class="fg-meta">{{ f.size }} · {{ f.date }}</div>
        <div class="fg-actions">
          <button class="fa-btn" @click.stop><v-icon size="13">mdi-download-outline</v-icon></button>
          <button class="fa-btn" @click.stop><v-icon size="13">mdi-dots-horizontal</v-icon></button>
        </div>
      </div>
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
          <tr v-for="(f, i) in files" :key="f.id" class="fl-row"
            :style="{ animationDelay: i * 35 + 'ms' }" @click="preview = f">
            <td>
              <div class="fl-name-cell">
                <div class="fl-icon" :style="{ background: f.iconBg }">
                  <v-icon size="14" :color="f.iconColor">{{ f.icon }}</v-icon>
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
                <button class="fa-btn" @click.stop><v-icon size="13">mdi-download-outline</v-icon></button>
                <button class="fa-btn" @click.stop><v-icon size="13">mdi-dots-horizontal</v-icon></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Preview drawer -->
    <div v-if="preview" class="drawer-overlay" @click.self="preview = null">
      <div class="drawer">
        <div class="drawer-hd">
          <div class="fl-icon" :style="{ background: preview.iconBg }">
            <v-icon size="14" :color="preview.iconColor">{{ preview.icon }}</v-icon>
          </div>
          <div class="drawer-info">
            <div class="drawer-fname">{{ preview.name }}</div>
            <div class="drawer-fmeta">{{ preview.size }} · {{ preview.date }}</div>
          </div>
          <button class="drawer-close" @click="preview = null"><v-icon size="15">mdi-close</v-icon></button>
        </div>
        <div class="drawer-bd">
          <div class="preview-placeholder">
            <v-icon size="56" :color="preview.iconColor" style="opacity:.5">{{ preview.icon }}</v-icon>
            <div class="pp-text">Preview not available</div>
            <button class="download-btn"><v-icon size="13">mdi-download-outline</v-icon> Download</button>
          </div>
          <div class="d-meta-row"><v-icon size="13">mdi-account-outline</v-icon> {{ preview.uploader }}</div>
          <div class="d-meta-row"><v-icon size="13">mdi-calendar-outline</v-icon> {{ preview.date }}</div>
          <div class="d-meta-row"><v-icon size="13">mdi-file-outline</v-icon> {{ preview.size }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const view     = ref<'grid' | 'list'>('grid')
const dragging = ref(false)

interface FileItem {
  id: number; name: string; size: string; date: string
  icon: string; iconColor: string; iconBg: string
  uploader: string; avInitials: string; avBg: string
}

const files = ref<FileItem[]>([
  { id: 1, name: 'Project Brief.pdf',      size: '2.4 MB', date: 'Mar 10, 2025', icon: 'mdi-file-pdf-box',      iconColor: '#ef4444', iconBg: '#fef2f2', uploader: 'Arjun P.',  avInitials: 'AP', avBg: '#fed7aa' },
  { id: 2, name: 'Design Mockup.fig',      size: '8.1 MB', date: 'Mar 11, 2025', icon: 'mdi-vector-square',     iconColor: '#7c3aed', iconBg: '#f5f3ff', uploader: 'Sara M.',   avInitials: 'SM', avBg: '#fef3c7' },
  { id: 3, name: 'Sprint Notes.docx',      size: '340 KB', date: 'Mar 12, 2025', icon: 'mdi-file-word-box',     iconColor: '#2563eb', iconBg: '#eff6ff', uploader: 'Raj R.',    avInitials: 'RR', avBg: '#fde68a' },
  { id: 4, name: 'API Spec.yaml',          size: '56 KB',  date: 'Mar 13, 2025', icon: 'mdi-code-braces',       iconColor: '#16a34a', iconBg: '#f0fdf4', uploader: 'Uma P.',    avInitials: 'UP', avBg: '#ede9fe' },
  { id: 5, name: 'Velocity Chart.xlsx',    size: '1.2 MB', date: 'Mar 14, 2025', icon: 'mdi-file-excel-box',    iconColor: '#15803d', iconBg: '#f0fdf4', uploader: 'Arjun P.',  avInitials: 'AP', avBg: '#fed7aa' },
  { id: 6, name: 'Screen Recording.mp4',  size: '45 MB',  date: 'Mar 15, 2025', icon: 'mdi-file-video-outline', iconColor: '#db2777', iconBg: '#fdf2f8', uploader: 'Sara M.',   avInitials: 'SM', avBg: '#fef3c7' },
])

const preview = ref<FileItem | null>(null)
</script>

<style scoped>
.files-root { display: flex; flex-direction: column; height: 100%; overflow: hidden; font-family: 'Inter', sans-serif; background: #f8fafc; }
.files-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; background: #fff; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; }
.ft-left { display: flex; align-items: center; gap: 8px; }
.view-toggle { display: flex; border: 1px solid #e2e8f0; border-radius: 7px; overflow: hidden; }
.vt-btn { display: flex; align-items: center; justify-content: center; width: 30px; height: 28px; border: none; background: #fff; color: #64748b; cursor: pointer; transition: background .12s, color .12s; }
.vt-btn.active { background: #eef2ff; color: #4f46e5; }
.ft-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 7px; border: 1px solid #e2e8f0; background: #fff; font-size: 12px; color: #64748b; cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s, color .12s; }
.ft-btn:hover { background: #f1f5f9; color: #0f172a; }
.upload-btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 8px; border: none; background: #4f46e5; color: #fff; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; box-shadow: 0 2px 8px rgba(79,70,229,.25); transition: background .12s; }
.upload-btn:hover { background: #4338ca; }
.drop-zone { margin: 14px 24px 0; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; align-items: center; background: #fff; transition: border-color .15s, background .15s; flex-shrink: 0; }
.drop-zone.active { border-color: #818cf8; background: #f5f3ff; }
.dz-title { font-size: 13px; font-weight: 500; color: #475569; }
.dz-sub { font-size: 11.5px; color: #94a3b8; margin-top: 3px; }
.section-label { padding: 12px 24px 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #94a3b8; flex-shrink: 0; }
.file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; padding: 0 24px 24px; overflow-y: auto; flex: 1; }
.fg-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 14px 12px; display: flex; flex-direction: column; align-items: center; text-align: center; cursor: pointer; animation: fadeUp .22s ease both; transition: border-color .15s, box-shadow .15s, transform .15s; }
.fg-card:hover { border-color: #a5b4fc; box-shadow: 0 4px 14px rgba(79,70,229,.08); transform: translateY(-2px); }
.fg-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px; }
.fg-name { font-size: 12px; font-weight: 600; color: #0f172a; margin-bottom: 3px; word-break: break-word; }
.fg-meta { font-size: 10.5px; color: #94a3b8; }
.fg-actions { display: flex; gap: 4px; margin-top: 8px; opacity: 0; transition: opacity .15s; }
.fg-card:hover .fg-actions { opacity: 1; }
.file-list-wrap { flex: 1; overflow-y: auto; padding: 0 24px 24px; }
.file-table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
.file-table thead th { padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 600; color: #94a3b8; background: #f8fafc; border-bottom: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: .04em; }
.fl-row { cursor: pointer; animation: fadeUp .22s ease both; }
.fl-row:hover td { background: #f8fafc; }
.fl-row td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
.fl-name-cell { display: flex; align-items: center; gap: 10px; }
.fl-icon { width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fl-name { font-size: 13px; font-weight: 500; color: #0f172a; }
.fl-meta { font-size: 12px; color: #64748b; }
.fl-uploader { display: flex; align-items: center; gap: 8px; }
.fl-av { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #475569; flex-shrink: 0; }
.fl-actions { display: flex; gap: 4px; justify-content: flex-end; opacity: 0; transition: opacity .15s; }
.fl-row:hover .fl-actions { opacity: 1; }
.fa-btn { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; border: 1px solid #e2e8f0; background: #fff; color: #94a3b8; cursor: pointer; transition: background .12s, color .12s; }
.fa-btn:hover { background: #eef2ff; color: #4f46e5; border-color: #c7d2fe; }
.drawer-overlay { position: fixed; inset: 0; background: rgba(15,23,42,.2); z-index: 200; display: flex; justify-content: flex-end; }
.drawer { width: 340px; background: #fff; height: 100%; box-shadow: -4px 0 24px rgba(0,0,0,.1); display: flex; flex-direction: column; animation: slideIn .2s ease; }
.drawer-hd { display: flex; align-items: center; gap: 10px; padding: 16px 18px; border-bottom: 1px solid #e2e8f0; }
.drawer-info { flex: 1; min-width: 0; }
.drawer-fname { font-size: 13px; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.drawer-fmeta { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.drawer-close { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 6px; border: none; background: none; color: #94a3b8; cursor: pointer; transition: background .12s; }
.drawer-close:hover { background: #f1f5f9; }
.drawer-bd { flex: 1; overflow-y: auto; padding: 16px 18px; display: flex; flex-direction: column; gap: 10px; }
.preview-placeholder { display: flex; flex-direction: column; align-items: center; padding: 24px 0; gap: 10px; }
.pp-text { font-size: 12.5px; color: #94a3b8; }
.download-btn { display: inline-flex; align-items: center; gap: 5px; padding: 7px 14px; border-radius: 8px; border: none; background: #eef2ff; color: #4f46e5; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: background .12s; }
.download-btn:hover { background: #e0e7ff; }
.d-meta-row { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #64748b; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
</style>