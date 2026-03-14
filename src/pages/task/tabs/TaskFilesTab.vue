<template>
  <div class="h-100 overflow-y-auto">
    <div class="pa-6">

      <!-- Toolbar -->
      <div class="d-flex align-center justify-space-between mb-5">
        <div class="d-flex align-center gap-2">
          <v-btn-toggle v-model="viewMode" density="compact" variant="outlined" divided mandatory>
            <v-btn value="grid" size="small" icon="mdi-view-grid-outline" />
            <v-btn value="list" size="small" icon="mdi-format-list-bulleted" />
          </v-btn-toggle>
          <v-btn variant="outlined" size="small" prepend-icon="mdi-filter-variant"
            class="text-none text-medium-emphasis font-weight-medium" color="medium-emphasis">
            Filter
          </v-btn>
          <v-btn variant="outlined" size="small" prepend-icon="mdi-swap-vertical"
            class="text-none text-medium-emphasis font-weight-medium" color="medium-emphasis">
            Sort
          </v-btn>
        </div>
        <v-btn color="primary" size="small" prepend-icon="mdi-upload-outline"
          class="text-none font-weight-medium" elevation="0">
          Upload file
        </v-btn>
      </div>

      <!-- Drop zone -->
      <div class="drop-zone d-flex flex-column align-center justify-center mb-6 rounded-lg"
        :class="{ 'drop-zone--active': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="onDrop">
        <v-icon size="36" class="mb-2 text-medium-emphasis opacity-60">mdi-cloud-upload-outline</v-icon>
        <div class="text-body-2 font-weight-medium text-medium-emphasis">Drop files here to upload</div>
        <div class="text-caption text-disabled mt-1">or click Upload file above</div>
      </div>

      <!-- Grid view -->
      <template v-if="viewMode === 'grid'">
        <div class="text-caption text-medium-emphasis font-weight-medium mb-3 text-uppercase" style="letter-spacing:.05em">
          All files ({{ files.length }})
        </div>
        <v-row dense>
          <v-col v-for="file in files" :key="file.id" cols="6" sm="4" md="3" lg="2">
            <v-card border elevation="0" class="file-card pa-3 d-flex flex-column align-center text-center cursor-pointer"
              @click="previewFile(file)">
              <div class="file-icon-wrap d-flex align-center justify-center mb-3 rounded-lg"
                :style="{ background: file.iconBg }">
                <v-icon size="28" :color="file.iconColor">{{ file.icon }}</v-icon>
              </div>
              <div class="text-body-2 font-weight-medium text-truncate w-100 mb-1"
                style="max-width:100%">{{ file.name }}</div>
              <div class="text-caption text-disabled">{{ file.size }}</div>
              <div class="text-caption text-disabled">{{ file.date }}</div>

              <div class="file-actions d-flex gap-1 mt-2">
                <v-btn icon="mdi-download-outline" variant="text" size="x-small"
                  class="text-medium-emphasis" density="compact" @click.stop />
                <v-btn icon="mdi-dots-horizontal" variant="text" size="x-small"
                  class="text-medium-emphasis" density="compact" @click.stop />
              </div>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <!-- List view -->
      <template v-else>
        <v-card border elevation="0" class="overflow-hidden">
          <v-table class="files-table">
            <thead>
              <tr>
                <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:40%">Name</th>
                <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:15%">Size</th>
                <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:20%">Uploaded by</th>
                <th class="text-left text-caption text-medium-emphasis font-weight-regular" style="width:15%">Date</th>
                <th style="width:10%"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="file in files" :key="file.id" class="file-row cursor-pointer"
                @click="previewFile(file)">
                <td class="py-2">
                  <div class="d-flex align-center gap-3">
                    <div class="file-icon-sm d-flex align-center justify-center rounded"
                      :style="{ background: file.iconBg }">
                      <v-icon size="16" :color="file.iconColor">{{ file.icon }}</v-icon>
                    </div>
                    <span class="text-body-2 font-weight-medium">{{ file.name }}</span>
                  </div>
                </td>
                <td class="text-body-2 text-medium-emphasis">{{ file.size }}</td>
                <td class="py-2">
                  <div class="d-flex align-center gap-2">
                    <v-avatar size="22" :color="file.uploaderColor">
                      <span style="font-size:9px" class="font-weight-bold">{{ file.uploaderInitials }}</span>
                    </v-avatar>
                    <span class="text-body-2 text-medium-emphasis">{{ file.uploader }}</span>
                  </div>
                </td>
                <td class="text-body-2 text-medium-emphasis">{{ file.date }}</td>
                <td>
                  <div class="d-flex align-center justify-end gap-1">
                    <v-btn icon="mdi-download-outline" variant="text" size="x-small"
                      class="text-medium-emphasis" density="compact" @click.stop />
                    <v-btn icon="mdi-dots-horizontal" variant="text" size="x-small"
                      class="text-medium-emphasis" density="compact" @click.stop />
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </template>

    </div>
  </div>

  <!-- Preview dialog -->
  <v-dialog v-model="previewDialog" max-width="520" scroll-strategy="none">
    <v-card v-if="selectedFile">
      <div class="d-flex align-center justify-space-between px-4 py-3 border-b">
        <div class="d-flex align-center gap-3">
          <div class="file-icon-sm d-flex align-center justify-center rounded"
            :style="{ background: selectedFile.iconBg }">
            <v-icon size="16" :color="selectedFile.iconColor">{{ selectedFile.icon }}</v-icon>
          </div>
          <div>
            <div class="text-body-2 font-weight-medium">{{ selectedFile.name }}</div>
            <div class="text-caption text-disabled">{{ selectedFile.size }} · {{ selectedFile.date }}</div>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="previewDialog = false" />
      </div>
      <div class="pa-6 d-flex flex-column align-center justify-center" style="min-height:200px">
        <v-icon size="64" :color="selectedFile.iconColor" class="mb-4 opacity-60">{{ selectedFile.icon }}</v-icon>
        <div class="text-body-2 text-medium-emphasis mb-4">Preview not available</div>
        <v-btn color="primary" variant="tonal" prepend-icon="mdi-download-outline"
          class="text-none" size="small">Download file</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const viewMode = ref<'grid' | 'list'>('grid')
const isDragging = ref(false)
const previewDialog = ref(false)

interface FileItem {
  id: number
  name: string
  size: string
  date: string
  icon: string
  iconColor: string
  iconBg: string
  uploader: string
  uploaderInitials: string
  uploaderColor: string
}

const files = ref<FileItem[]>([
  { id: 1, name: 'Project Brief.pdf', size: '2.4 MB', date: 'Mar 10, 2025', icon: 'mdi-file-pdf-box', iconColor: 'red-darken-1', iconBg: '#fef2f2', uploader: 'Arjun P.', uploaderInitials: 'AP', uploaderColor: 'orange-lighten-2' },
  { id: 2, name: 'Design Mockup.fig', size: '8.1 MB', date: 'Mar 11, 2025', icon: 'mdi-vector-square', iconColor: 'purple-darken-1', iconBg: '#f5f3ff', uploader: 'Sara M.', uploaderInitials: 'SM', uploaderColor: 'amber-lighten-2' },
  { id: 3, name: 'Sprint Notes.docx', size: '340 KB', date: 'Mar 12, 2025', icon: 'mdi-file-word-box', iconColor: 'blue-darken-1', iconBg: '#eff6ff', uploader: 'Raj R.', uploaderInitials: 'RR', uploaderColor: 'yellow-lighten-2' },
  { id: 4, name: 'API Spec.yaml', size: '56 KB', date: 'Mar 13, 2025', icon: 'mdi-code-braces', iconColor: 'green-darken-1', iconBg: '#f0fdf4', uploader: 'Uma P.', uploaderInitials: 'UP', uploaderColor: 'deep-purple-lighten-4' },
  { id: 5, name: 'Velocity Chart.xlsx', size: '1.2 MB', date: 'Mar 14, 2025', icon: 'mdi-file-excel-box', iconColor: 'green-darken-2', iconBg: '#f0fdf4', uploader: 'Arjun P.', uploaderInitials: 'AP', uploaderColor: 'orange-lighten-2' },
  { id: 6, name: 'Screen Recording.mp4', size: '45 MB', date: 'Mar 15, 2025', icon: 'mdi-file-video-outline', iconColor: 'pink-darken-1', iconBg: '#fdf2f8', uploader: 'Sara M.', uploaderInitials: 'SM', uploaderColor: 'amber-lighten-2' },
])

const selectedFile = ref<FileItem | null>(null)

function previewFile(file: FileItem) {
  selectedFile.value = file
  previewDialog.value = true
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  // handle dropped files here
}
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #e2e8f0;
  padding: 32px;
  transition: border-color 0.2s, background 0.2s;
}
.drop-zone--active {
  border-color: #818cf8;
  background: #f5f3ff;
}
.file-card {
  transition: box-shadow 0.15s;
}
.file-card:hover {
  box-shadow: 0 2px 10px rgba(0,0,0,0.08) !important;
}
.file-icon-wrap {
  width: 56px;
  height: 56px;
}
.file-icon-sm {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}
.file-actions {
  opacity: 0;
  transition: opacity 0.15s;
}
.file-card:hover .file-actions {
  opacity: 1;
}
.files-table th {
  border-bottom: 1px solid #f0f0f0 !important;
  background: transparent !important;
  padding: 8px 16px !important;
}
.files-table td {
  border-bottom: 1px solid #f0f0f0 !important;
}
.file-row:hover td {
  background-color: #f8f9fa !important;
}
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
</style>
