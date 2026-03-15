<template>
  <div class="board-page">
    <ProjectHeader active-tab="board" />

    <!-- Controls bar -->
    <div class="board-bar">
      <div class="bar-left">
        <!-- Search -->
        <div class="search-wrap">
          <v-icon size="13" class="search-ico">mdi-magnify</v-icon>
          <input class="search-inp" placeholder="Search board" />
        </div>

        <!-- Avatars -->
        <div class="avatars">
          <v-avatar v-for="(user, i) in store.users.slice(0, 4)" :key="user.id"
            size="24" :style="{ marginLeft: i > 0 ? '-6px' : '0', border: '2px solid #fff', zIndex: 4 - i }">
            <v-img :src="user.avatar" cover />
          </v-avatar>
        </div>

        <!-- Filter -->
        <v-menu v-model="filterMenu" :close-on-content-click="false" location="bottom start" offset="4" scroll-strategy="none">
          <template v-slot:activator="{ props }">
            <button v-bind="props" class="bar-btn">
              <v-icon size="13" class="mr-1">mdi-filter-variant</v-icon>Filter
            </button>
          </template>
          <v-card width="540" elevation="4" class="rounded-lg overflow-hidden border">
            <div class="d-flex" style="height:380px">
              <div class="border-e w-50 py-2 bg-surface">
                <v-list density="compact" nav class="px-2">
                  <v-list-item v-for="item in filterCategories" :key="item.value"
                    :active="activeFilterCategory === item.value"
                    @click="activeFilterCategory = item.value"
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
              <div class="w-50 pa-4 bg-surface">
                <template v-if="activeFilterCategory === 'sprint'">
                  <v-text-field density="compact" variant="outlined" placeholder="Search sprint"
                    prepend-inner-icon="mdi-magnify" hide-details single-line />
                  <div class="mt-2">
                    <v-checkbox density="compact" hide-details color="primary" class="mb-1">
                      <template v-slot:label><span class="text-body-2 ml-2">No sprint</span></template>
                    </v-checkbox>
                    <v-checkbox density="compact" hide-details color="primary">
                      <template v-slot:label>
                        <div class="ml-2">
                          <div class="text-body-2">Sprint 1</div>
                          <div class="text-caption text-medium-emphasis">Active - EX board</div>
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
            <v-divider />
            <div class="px-4 py-3 d-flex justify-space-between text-caption text-medium-emphasis">
              <span class="cursor-pointer d-flex align-center gap-1">
                <v-icon size="13">mdi-bullhorn-outline</v-icon> Give feedback
              </span>
              <span class="d-flex align-center gap-1">
                Press <kbd>Shift</kbd> + <kbd>F</kbd> to open
              </span>
            </div>
          </v-card>
        </v-menu>
      </div>

      <div class="bar-right">
        <button class="bar-btn bar-btn--primary" @click="">Complete Sprint</button>
        <button class="bar-btn">Group by <v-icon size="13" class="ml-1">mdi-chevron-down</v-icon></button>
        <button class="bar-icon-btn"><v-icon size="16">mdi-eye-outline</v-icon></button>
        <button class="bar-icon-btn"><v-icon size="16">mdi-sort-variant</v-icon></button>
        <button class="bar-icon-btn"><v-icon size="16">mdi-dots-horizontal</v-icon></button>
      </div>
    </div>

    <!-- Board -->
    <div class="board-body">
      <div class="board-scroll">

        <div v-for="col in boardColumns" :key="col.id" class="board-col">
          <!-- Col header -->
          <div class="col-hd">
            <div class="col-hd-left">
              <span class="col-name">{{ col.title.toUpperCase() }}</span>
              <span class="col-cnt">{{ col.issues.length }}</span>
            </div>
            <v-menu location="bottom end" :close-on-content-click="true">
              <template v-slot:activator="{ props }">
                <button v-bind="props" class="col-menu-btn"><v-icon size="15">mdi-dots-horizontal</v-icon></button>
              </template>
              <v-list density="compact" min-width="160">
                <v-list-item v-if="!col.isDefault" @click="removeColumn(col.id)"
                  prepend-icon="mdi-delete-outline" title="Delete column" class="text-error" />
                <v-list-item @click="openCreateIssue(col.id)" prepend-icon="mdi-plus" title="Add issue" />
              </v-list>
            </v-menu>
          </div>

          <!-- Cards area -->
          <div class="col-body">
            <template v-if="col.isDefault">
              <draggable :list="col.issues" group="issues" item-key="id"
                class="cards-list" style="min-height:32px"
                @change="onDragChange($event, col.status!)">
                <template #item="{ element }">
                  <IssueCard :issue="element" @click="openIssueDetails(element)" />
                </template>
              </draggable>
            </template>
            <template v-else>
              <div class="cards-list">
                <IssueCard v-for="issue in col.issues" :key="issue.id"
                  :issue="issue" @click="openIssueDetails(issue)" />
              </div>
            </template>

            <button class="create-btn" @click="openCreateIssue(col.id)">
              <v-icon size="13" class="mr-1">mdi-plus</v-icon>Create issue
            </button>
          </div>
        </div>

        <!-- Add column -->
        <button class="add-col-btn" @click="addColumn">
          <v-icon size="14" class="mr-1">mdi-plus</v-icon>Add column
        </button>

      </div>
    </div>

    <IssueDetailsDialog v-model="isDetailsOpen" :issue="selectedIssue" scroll-strategy="none" />
    <CreateIssueDrawer v-model="isCreateDrawerOpen" scroll-strategy="none" />
  </div>
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

interface BoardColumn {
  id: string; title: string; color: string
  isDefault: boolean; status?: Issue['status']; issues: Issue[]
}

const customColumns = reactive<BoardColumn[]>([])

const boardColumns = computed<BoardColumn[]>(() => [
  { id: 'todo',       title: 'To Do',       color: '#94A3B8', isDefault: true, status: 'TODO',        issues: store.getIssuesByStatus('TODO') },
  { id: 'inprogress', title: 'In Progress',  color: '#4F46E5', isDefault: true, status: 'IN_PROGRESS', issues: store.getIssuesByStatus('IN_PROGRESS') },
  { id: 'done',       title: 'Done',         color: '#10B981', isDefault: true, status: 'DONE',        issues: store.getIssuesByStatus('DONE') },
  ...customColumns,
])

function onDragChange(event: any, targetStatus: Issue['status']) {
  if (event.added) store.moveIssue(event.added.element.id, targetStatus)
}
function addColumn() {
  customColumns.push({ id: `col-${Date.now()}`, title: 'New column', color: '#CBD5E1', isDefault: false, issues: [] })
}
function removeColumn(colId: string) {
  const idx = customColumns.findIndex(c => c.id === colId)
  if (idx !== -1) customColumns.splice(idx, 1)
}
function openIssueDetails(issue: Issue) {
  selectedIssue.value = issue; isDetailsOpen.value = true
}
function openCreateIssue(_colId: string) {
  isCreateDrawerOpen.value = true
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.shiftKey && (e.key === 'f' || e.key === 'F')) {
    if (e.target && ['INPUT','TEXTAREA'].includes((e.target as HTMLElement).tagName)) return
    e.preventDefault(); filterMenu.value = !filterMenu.value
  }
}
onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.board-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
}

/* ── Controls bar ── */
.board-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
  flex-shrink: 0;
}
.bar-left, .bar-right { display: flex; align-items: center; gap: 8px; }

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-ico {
  position: absolute;
  left: 7px;
  color: #94a3b8;
  pointer-events: none;
}
.search-inp {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 5px 10px 5px 26px;
  font-size: 12.5px;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  background: #fff;
  outline: none;
  width: 160px;
}
.search-inp:focus { border-color: #4f46e5; }

.avatars { display: flex; align-items: center; }

.bar-btn {
  display: inline-flex; align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 5px 10px;
  font-size: 12.5px; font-weight: 500;
  color: #475569; background: #fff;
  cursor: pointer; font-family: 'Inter', sans-serif;
  white-space: nowrap;
  transition: background .12s;
}
.bar-btn:hover { background: #f8fafc; }
.bar-btn--primary {
  background: #4f46e5; color: #fff;
  border-color: #4f46e5; font-weight: 600;
}
.bar-btn--primary:hover { background: #4338ca; }

.bar-icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  border: none; background: none;
  color: #64748b; cursor: pointer;
  border-radius: 5px;
  transition: background .12s;
}
.bar-icon-btn:hover { background: #f1f5f9; }

/* ── Board body ── */
.board-body {
  flex: 1;
  overflow: hidden;
  background: #f8fafc;
}
.board-scroll {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}

/* ── Column ── */
.board-col {
  width: 260px;
  min-width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.col-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 6px;
}
.col-hd-left { display: flex; align-items: center; gap: 6px; }
.col-name {
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: .06em;
  color: #475569;
}
.col-cnt {
  font-size: 11px;
  font-weight: 600;
  background: #e2e8f0;
  color: #64748b;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}
.col-menu-btn {
  display: flex; align-items: center; justify-content: center;
  width: 22px; height: 22px;
  border: none; background: none;
  color: #94a3b8; cursor: pointer;
  border-radius: 4px;
  transition: background .12s;
}
.col-menu-btn:hover { background: #e2e8f0; color: #475569; }

.col-body {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 420px;
  flex: 1;
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.create-btn {
  display: flex; align-items: center;
  padding: 5px 4px;
  background: none; border: none;
  font-size: 12px; font-weight: 500;
  color: #94a3b8; cursor: pointer;
  font-family: 'Inter', sans-serif;
  border-radius: 5px;
  transition: background .12s, color .12s;
  margin-top: 2px;
}
.create-btn:hover { background: #e2e8f0; color: #475569; }

.add-col-btn {
  display: inline-flex; align-items: center;
  padding: 6px 10px;
  background: none; border: none;
  font-size: 12.5px; font-weight: 500;
  color: #94a3b8; cursor: pointer;
  font-family: 'Inter', sans-serif;
  border-radius: 6px;
  white-space: nowrap;
  align-self: flex-start;
  margin-top: 28px;
  transition: background .12s, color .12s;
}
.add-col-btn:hover { background: #e2e8f0; color: #475569; }

kbd {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 11px;
  font-family: 'Inter', sans-serif;
}
</style>
