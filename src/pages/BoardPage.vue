<template>
  <v-container fluid class="pa-0 h-100 d-flex flex-column whitespace-nowrap overflow-hidden">
    <!-- Project Header -->
    <ProjectHeader active-tab="board" />

    <!-- Board Controls -->
    <div class="px-6 py-4 d-flex align-center justify-space-between flex-wrap gap-4">
      <div class="d-flex align-center gap-3">
        <v-text-field density="compact" single-line variant="outlined" placeholder="Search board"
          prepend-inner-icon="mdi-magnify" clearable hide-details width="200" color="primary"
          class="bg-surface custom-board-input"></v-text-field>

        <div class="d-flex align-center">
          <v-avatar v-for="(user, i) in store.users.slice(0, 4)" :key="user.id" size="32" :class="{ 'ml-n2': i > 0 }"
            style="border: 2px solid rgb(var(--v-theme-surface))" class="cursor-pointer">
            <v-img :src="user.avatar" cover></v-img>
            <v-tooltip activator="parent" location="top">{{ user.name }}</v-tooltip>
          </v-avatar>
        </div>

        <v-menu v-model="filterMenu" :close-on-content-click="false" location="bottom start" offset="4">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" variant="outlined" prepend-icon="mdi-filter-variant" class="text-none px-4"
              color="medium-emphasis">Filter</v-btn>
          </template>
          <v-card width="540" elevation="4" class="rounded-lg overflow-hidden border">
            <div class="d-flex" style="height: 380px;">
              <div class="border-e w-50 py-2 d-flex flex-column bg-surface">
                <v-list density="compact" nav class="px-2">
                  <v-list-item v-for="item in filterCategories" :key="item.value" :value="item.value"
                    :active="activeFilterCategory === item.value" @click="activeFilterCategory = item.value"
                    class="rounded-md mb-1 px-3" color="primary">
                    <template v-slot:title>
                      <span class="text-body-2 font-weight-medium"
                        :class="activeFilterCategory === item.value ? 'text-primary' : 'text-medium-emphasis'">
                        {{ item.title }}
                      </span>
                    </template>
                  </v-list-item>
                </v-list>
              </div>
              <div class="w-50 pa-4 mt-2 bg-surface">
                <template v-if="activeFilterCategory === 'sprint'">
                  <v-text-field density="compact" variant="outlined" placeholder="Search sprint"
                    prepend-inner-icon="mdi-magnify" hide-details class="bg-surface custom-search-input"
                    single-line></v-text-field>
                  <div class="overflow-y-auto pr-2 mt-2">
                    <v-checkbox density="compact" hide-details color="primary" class="filter-checkbox mb-2">
                      <template v-slot:label>
                        <span class="text-body-2 text-high-emphasis ml-2">No sprint</span>
                      </template>
                    </v-checkbox>
                    <v-checkbox density="compact" hide-details color="primary" class="filter-checkbox">
                      <template v-slot:label>
                        <div class="d-flex flex-column ml-2">
                          <span class="text-body-2 text-high-emphasis">Sprint 1</span>
                          <span class="text-caption text-medium-emphasis" style="line-height: 1.2;">Active - EX board</span>
                        </div>
                      </template>
                    </v-checkbox>
                  </div>
                </template>
                <template v-else>
                  <div class="d-flex align-center justify-center h-100 text-medium-emphasis text-body-2">
                    Select {{ filterCategories.find(c => c.value === activeFilterCategory)?.title }} options
                  </div>
                </template>
              </div>
            </div>
            <v-divider></v-divider>
            <div class="px-4 py-3 bg-surface d-flex justify-space-between align-center text-caption text-medium-emphasis">
              <div class="d-flex align-center cursor-pointer hover-opacity font-weight-medium">
                <v-icon size="small" class="mr-2 text-medium-emphasis">mdi-bullhorn-outline</v-icon>
                Give feedback
              </div>
              <div class="d-flex align-center gap-1 font-weight-medium">
                Press
                <div class="px-2 py-0 text-caption bg-surface border rounded" style="line-height:1.5;">Shift</div>
                +
                <div class="px-2 py-0 text-caption bg-surface border rounded" style="line-height:1.5;">F</div>
                to open and close
              </div>
            </div>
          </v-card>
        </v-menu>
      </div>

      <div class="d-flex align-center gap-2">
        <v-btn color="primary" size="small" class="px-4 font-weight-bold">Complete Sprint</v-btn>
        <v-btn variant="plain" class="text-none px-2" density="comfortable" color="medium-emphasis">
          Group by <v-icon end icon="mdi-chevron-down"></v-icon>
        </v-btn>
        <v-btn icon="mdi-eye-outline" variant="text" size="small" class="text-medium-emphasis"></v-btn>
        <v-btn icon="mdi-sort-variant" variant="text" size="small" class="text-medium-emphasis"></v-btn>
        <v-btn icon="mdi-dots-horizontal" variant="text" size="small" class="text-medium-emphasis"></v-btn>
      </div>
    </div>

    <!-- Kanban Columns -->
    <div class="flex-grow-1 px-6 pb-6 overflow-hidden">
      <div class="d-flex gap-4 h-100 overflow-x-auto pb-4 align-start">

        <!-- Dynamic columns -->
        <v-sheet
          v-for="col in boardColumns"
          :key="col.id"
          class="board-column rounded-lg pa-3 d-flex flex-column"
          color="surface-variant"
          border>

          <!-- Column header -->
          <div class="d-flex align-center justify-space-between mb-3 px-1">
            <div class="d-flex align-center gap-2">
              <div :style="{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }"></div>
              <span class="text-caption text-uppercase text-medium-emphasis font-weight-bold tracking-wide">
                {{ col.title }}
              </span>
            </div>
            <div class="d-flex align-center gap-1">
              <v-chip size="x-small" variant="flat" color="surface-variant" class="font-weight-bold">
                {{ col.issues.length }}
              </v-chip>
              <v-menu location="bottom end" :close-on-content-click="true">
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" icon="mdi-dots-horizontal" variant="text" size="x-small"
                    class="text-medium-emphasis" density="compact" />
                </template>
                <v-list density="compact" min-width="160">
                  <v-list-item v-if="!col.isDefault" @click="removeColumn(col.id)" prepend-icon="mdi-delete-outline"
                    title="Delete column" class="text-error" />
                  <v-list-item @click="openCreateIssue(col.id)" prepend-icon="mdi-plus" title="Add issue" />
                </v-list>
              </v-menu>
            </div>
          </div>

          <!-- Draggable issues (status-backed columns) -->
          <template v-if="col.isDefault">
            <draggable
              :list="col.issues"
              group="issues"
              item-key="id"
              class="d-flex flex-column gap-2 overflow-y-auto px-1 flex-grow-1"
              style="min-height: 80px;"
              @change="onDragChange($event, col.status!)">
              <template #item="{ element }">
                <IssueCard :issue="element" @click="openIssueDetails(element)" />
              </template>
            </draggable>
          </template>

          <!-- Custom column issues -->
          <template v-else>
            <div class="d-flex flex-column gap-2 overflow-y-auto px-1 flex-grow-1" style="min-height: 80px;">
              <v-card
                v-for="issue in col.issues"
                :key="issue.id"
                class="custom-issue-card pa-3 cursor-pointer"
                elevation="0"
                border
                @click="openIssueDetails(issue)">
                <div class="d-flex align-start gap-2">
                  <v-icon size="15" color="medium-emphasis" class="mt-1 flex-shrink-0">mdi-circle-outline</v-icon>
                  <span class="text-body-2 font-weight-medium text-high-emphasis" style="line-height:1.4">
                    {{ issue.summary }}
                  </span>
                </div>
                <div class="d-flex align-center gap-2 mt-2">
                  <v-chip size="x-small" :color="priorityColor(issue.priority)" variant="tonal" class="font-weight-medium">
                    {{ issue.priority }}
                  </v-chip>
                  <span class="text-caption text-medium-emphasis">{{ issue.key }}</span>
                </div>
              </v-card>
            </div>
          </template>

          <!-- Create issue button -->
          <v-btn variant="text" block class="text-start justify-start text-caption mt-2 text-none"
            prepend-icon="mdi-plus" color="medium-emphasis" @click="openCreateIssue(col.id)">
            Create issue
          </v-btn>
        </v-sheet>

        <!-- Add column button -->
        <div class="flex-shrink-0 d-flex align-start pt-2">
          <v-btn variant="text" prepend-icon="mdi-plus"
            class="text-none text-medium-emphasis font-weight-medium"
            size="small" @click="addColumn">
            Add column
          </v-btn>
        </div>

      </div>
    </div>

    <IssueDetailsDialog v-model="isDetailsOpen" :issue="selectedIssue" scroll-strategy="none" />
    <CreateIssueDrawer v-model="isCreateDrawerOpen" scroll-strategy="none" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import type { Issue } from '@/stores/taskStore'
import ProjectHeader from '@/components/ProjectHeader.vue'
import IssueCard from '@/components/IssueCard.vue'
import draggable from 'vuedraggable'
import CreateIssueDrawer from '@/components/CreateIssueDrawer.vue'
import IssueDetailsDialog from '@/components/IssueDetailsDialog.vue'

const store = useTaskStore()
const isDetailsOpen = ref(false)
const isCreateDrawerOpen = ref(false)
const selectedIssue = ref<Issue | null>(null)
const filterMenu = ref(false)
const activeFilterCategory = ref('sprint')

const filterCategories = [
  { title: 'Parent', value: 'parent' },
  { title: 'Sprint', value: 'sprint' },
  { title: 'Assignee', value: 'assignee' },
  { title: 'Work type', value: 'workType' },
  { title: 'Labels', value: 'labels' },
  { title: 'Status', value: 'status' },
  { title: 'Priority', value: 'priority' },
]

// ── Column definition ─────────────────────────────────────────────────────────
interface BoardColumn {
  id: string
  title: string
  color: string
  isDefault: boolean
  status?: Issue['status']
  issues: Issue[]
}

const customColumns = reactive<BoardColumn[]>([])

const defaultColumns: BoardColumn[] = [
  { id: 'todo',       title: 'To Do',      color: '#94A3B8', isDefault: true, status: 'TODO',        issues: [] },
  { id: 'inprogress', title: 'In Progress', color: '#4F46E5', isDefault: true, status: 'IN_PROGRESS', issues: [] },
  { id: 'done',       title: 'Done',        color: '#10B981', isDefault: true, status: 'DONE',        issues: [] },
]

const boardColumns = computed<BoardColumn[]>(() => {
  return [
    { ...defaultColumns[0]!, issues: store.getIssuesByStatus('TODO') },
    { ...defaultColumns[1]!, issues: store.getIssuesByStatus('IN_PROGRESS') },
    { ...defaultColumns[2]!, issues: store.getIssuesByStatus('DONE') },
    ...customColumns,
  ]
})

// ── Drag & drop ───────────────────────────────────────────────────────────────
function onDragChange(event: any, targetStatus: Issue['status']) {
  if (event.added) {
    store.moveIssue(event.added.element.id, targetStatus)
  }
}

// ── Column actions ────────────────────────────────────────────────────────────
function addColumn() {
  customColumns.push({
    id: `col-${Date.now()}`,
    title: 'New column',
    color: '#CBD5E1',
    isDefault: false,
    issues: [],
  })
}

function removeColumn(colId: string) {
  const idx = customColumns.findIndex(c => c.id === colId)
  if (idx !== -1) customColumns.splice(idx, 1)
}

// ── Issue actions ─────────────────────────────────────────────────────────────
function openIssueDetails(issue: Issue) {
  selectedIssue.value = issue
  isDetailsOpen.value = true
}

function openCreateIssue(_colId: string) {
  isCreateDrawerOpen.value = true
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function priorityColor(priority: string) {
  return priority === 'High' ? 'error' : priority === 'Medium' ? 'warning' : 'success'
}

// ── Keyboard shortcut ─────────────────────────────────────────────────────────
const handleKeydown = (e: KeyboardEvent) => {
  if (e.shiftKey && (e.key === 'f' || e.key === 'F')) {
    if (e.target && ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
    e.preventDefault()
    filterMenu.value = !filterMenu.value
  }
}
onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.board-column {
  min-width: 280px;
  width: 280px;
  max-width: 280px;
}

.custom-issue-card {
  background: rgb(var(--v-theme-surface)) !important;
  border-radius: 8px !important;
  transition: box-shadow 0.15s ease;
}
.custom-issue-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.10) !important;
}

.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.gap-4 { gap: 16px; }

.custom-board-input :deep(.v-field__input) {
  min-height: 36px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.hover-opacity:hover { opacity: 0.8; }

.filter-checkbox :deep(.v-selection-control) { min-height: auto; }
.filter-checkbox :deep(.v-selection-control__wrapper) { margin-top: 2px; }
</style>
