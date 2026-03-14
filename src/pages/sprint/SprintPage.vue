<template>
    <v-container fluid class="pa-0 h-100 d-flex flex-column whitespace-nowrap overflow-hidden bg-surface">
        <!-- Project Header -->
        <ProjectHeader active-tab="sprint" />

        <!-- Sprint List View (Screen 1) -->
        <template v-if="!selectedSprint">
            <!-- Controls -->
            <div class="px-6 py-3 d-flex align-center justify-space-between flex-wrap gap-4 border-b">
                <h1 class="text-h5 font-weight-bold mb-0 text-high-emphasis">Sprints</h1>
                <v-btn color="primary" class="text-none font-weight-bold rounded-md" prepend-icon="mdi-plus"
                    size="small" elevation="0" @click="isAddDialogOpen = true">
                    New Sprint
                </v-btn>
            </div>

            <div class="px-6 py-4 d-flex align-center justify-space-between flex-wrap gap-4">
                <div class="d-flex align-center gap-2">
                    <!-- Filters -->
                    <v-chip-group v-model="activeFilter" selected-class="text-primary bg-primary-lighten" mandatory>
                        <v-chip value="All" variant="outlined" class="font-weight-medium rounded-lg" size="small">All
                            <v-icon end icon="mdi-chevron-down"></v-icon></v-chip>
                        <v-chip value="Draft" variant="outlined" class="font-weight-medium rounded-lg"
                            size="small">Draft <v-icon end icon="mdi-chevron-down"></v-icon></v-chip>
                        <v-chip value="Active" variant="outlined" class="font-weight-medium rounded-lg"
                            size="small">Active <v-icon end icon="mdi-chevron-down"></v-icon></v-chip>
                        <v-chip value="Completed" variant="outlined" class="font-weight-medium rounded-lg"
                            size="small">Completed
                            <v-icon end icon="mdi-chevron-down"></v-icon></v-chip>
                    </v-chip-group>
                </div>

                <v-text-field density="compact" single-line variant="outlined" placeholder="Search sprints..."
                    prepend-inner-icon="mdi-magnify" hide-details width="300" color="primary" clearable
                    autocomplete="off" class="bg-surface custom-sprint-search"></v-text-field>
            </div>

            <!-- Sprints Table -->
            <div class="flex-grow-1 px-6 pb-6 overflow-y-auto">
                <v-table density="comfortable" class="border rounded-lg" hover>
                    <thead>
                        <tr>
                            <th class="text-subtitle-2 font-weight-bold text-medium-emphasis">Sprint title</th>
                            <th class="text-subtitle-2 font-weight-bold text-medium-emphasis">Status</th>
                            <th class="text-subtitle-2 font-weight-bold text-medium-emphasis">Start date</th>
                            <th class="text-subtitle-2 font-weight-bold text-medium-emphasis">End date</th>
                            <th class="text-subtitle-2 font-weight-bold text-medium-emphasis">Task count</th>
                            <th class="text-subtitle-2 font-weight-bold text-medium-emphasis">Progress</th>
                            <th class="text-subtitle-2 font-weight-bold text-medium-emphasis text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="sprint in filteredSprints" :key="sprint.id" class="cursor-pointer"
                            @click="selectSprint(sprint)">
                            <td class="font-weight-medium text-high-emphasis border-b py-3">{{ sprint.name }}</td>
                            <td class="border-b">
                                <v-chip size="x-small" :color="getStatusColor(sprint.status)" variant="tonal"
                                    class="font-weight-bold py-1 px-2 rounded" label>
                                    {{ sprint.status.toLowerCase() }}: {{ sprint.name.split(' ')[1] }}
                                </v-chip>
                            </td>
                            <td class="text-body-2 text-medium-emphasis border-b">{{ sprint.startDate }}</td>
                            <td class="text-body-2 text-medium-emphasis border-b">{{ sprint.endDate }}</td>
                            <td class="text-body-2 text-medium-emphasis border-b">{{ getTaskCount(sprint) }}/{{
                                sprint.taskCount }}
                                tasks</td>
                            <td class="border-b" style="min-width: 150px;">
                                <div class="d-flex align-center gap-3">
                                    <v-progress-linear :model-value="sprint.progress"
                                        :color="getProgressBarColor(sprint.progress)" height="6"
                                        rounded></v-progress-linear>
                                    <span class="text-caption font-weight-medium text-medium-emphasis"
                                        style="min-width: 32px">{{
                                        sprint.progress }}%</span>
                                </div>
                            </td>
                            <td class="text-center border-b">
                                <v-btn icon="mdi-pencil-outline" variant="text" size="small" color="medium-emphasis"
                                    @click.stop="openEditDialog(sprint)"></v-btn>
                                <v-btn icon="mdi-trash-can-outline" variant="text" size="small" color="medium-emphasis"
                                    @click.stop="openDeleteDialog(sprint)"></v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>

                <div class="d-flex justify-end mt-4 align-center gap-2">
                    <span class="text-caption text-medium-emphasis">Previous</span>
                    <v-btn-group variant="outlined" density="compact" rounded="lg" color="grey-lighten-1" divided>
                        <v-btn class="font-weight-bold px-3 text-primary bg-primary-lighten border-primary"
                            style="min-width: 32px;">1</v-btn>
                        <v-btn class="font-weight-bold px-3 text-medium-emphasis" style="min-width: 32px;">2</v-btn>
                        <v-btn class="font-weight-bold px-3 text-medium-emphasis" style="min-width: 32px;">3</v-btn>
                        <v-btn class="font-weight-bold px-3 text-medium-emphasis" style="min-width: 32px;">...</v-btn>
                    </v-btn-group>
                    <span class="text-caption font-weight-bold text-high-emphasis ml-2">Next</span>
                </div>
            </div>
        </template>

        <!-- Active Sprint View (Screen 3) -->
        <template v-else>
            <div class="px-6 py-3 d-flex align-center justify-space-between border-b bg-surface flex-wrap gap-4">
                <div class="d-flex align-center gap-3">
                    <v-btn icon="mdi-arrow-left" variant="text" size="small" @click="selectedSprint = null"></v-btn>
                    <h2 class="text-h6 font-weight-bold mb-0">Active Sprint: {{ selectedSprint.name }}</h2>
                    <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold rounded px-2 py-1"
                        label>Active</v-chip>
                </div>
                <v-btn variant="outlined" color="medium-emphasis"
                    class="text-none font-weight-bold rounded-lg border-grey-lighten-1" size="small">End Sprint</v-btn>
            </div>

            <div class="flex-grow-1 overflow-y-auto px-6 py-6 bg-grey-lighten-5">
                <!-- KPI Cards -->
                <v-row class="mb-4">
                    <v-col cols="12" md="4">
                        <v-card
                            class="pa-4 rounded-lg border elevation-0 d-flex justify-space-between align-center h-100 bg-surface">
                            <div>
                                <div class="text-caption font-weight-medium text-medium-emphasis mb-1">Total Tasks</div>
                                <div class="text-h4 font-weight-black">{{store.issues.filter(i => i.sprintId ===
                                    selectedSprint?.id).length}}</div>
                            </div>
                            <v-progress-circular :model-value="selectedSprint.progress" :size="56" :width="6"
                                color="primary" class="font-weight-bold text-caption text-primary">
                                {{ selectedSprint.progress }}%
                            </v-progress-circular>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card
                            class="pa-4 rounded-lg border elevation-0 d-flex justify-space-between align-center h-100 bg-surface">
                            <div>
                                <div class="text-caption font-weight-medium text-medium-emphasis mb-1">Completed Tasks
                                </div>
                                <div class="text-h4 font-weight-black">{{store.issues.filter(i => i.sprintId ===
                                    selectedSprint?.id &&
                                    i.status === 'DONE').length}}</div>
                            </div>
                            <v-avatar color="success" size="36" variant="tonal">
                                <v-icon color="success" size="20">mdi-check-circle</v-icon>
                            </v-avatar>
                        </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-card
                            class="pa-4 rounded-lg border elevation-0 d-flex justify-space-between align-center h-100 bg-surface">
                            <div>
                                <div class="text-caption font-weight-medium text-medium-emphasis mt-n2 mb-1">Remaining
                                    Hours</div>
                                <div class="text-h4 font-weight-black d-flex align-center gap-2">
                                    40h <v-icon color="error" size="20">mdi-alert-outline</v-icon>
                                </div>
                            </div>
                            <div class="text-right text-caption d-flex flex-column gap-1">
                                <div class="d-flex align-center justify-end gap-2">
                                    <div style="width:6px;height:6px;border-radius:50%;" class="bg-primary"></div><span
                                        class="text-medium-emphasis" style="font-size:11px;">Ideal: <strong
                                            class="text-high-emphasis">35h</strong></span>
                                </div>
                                <div class="d-flex align-center justify-end gap-2">
                                    <div style="width:6px;height:6px;border-radius:50%;" class="bg-error"></div><span
                                        class="text-error" style="font-size:11px;">Behind hours: <strong
                                            class="text-error">38h</strong></span>
                                </div>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Burndown Chart Mockup -->
                <v-card class="pa-6 rounded-lg border elevation-0 mb-6 bg-surface position-relative"
                    style="overflow:visible;">
                    <div class="d-flex justify-space-between align-center mb-6">
                        <div class="font-weight-bold text-subtitle-1">Burndown Chart</div>
                        <div class="d-flex align-center gap-4 text-caption text-medium-emphasis">
                            <div class="d-flex align-center gap-2">
                                <div style="width:16px; border-top: 2px dashed rgb(var(--v-theme-primary));"></div>
                                Ideal
                            </div>
                            <div class="d-flex align-center gap-2">
                                <div style="width:16px; border-top: 2px solid rgb(var(--v-theme-error));"></div> Actual
                            </div>
                        </div>
                    </div>

                    <div class="chart-container position-relative w-100"
                        style="height: 180px; margin-left: 30px; width: calc(100% - 30px) !important;">
                        <!-- Grid Lines -->
                        <div
                            class="grid-lines fill-height w-100 d-flex flex-column justify-space-between position-absolute top-0 left-0">
                            <div v-for="i in 6" :key="i" class="w-100 border-b"
                                style="height: 1px; border-color: rgba(0,0,0,0.06) !important;"></div>
                        </div>

                        <!-- SVG Chart Lines -->
                        <svg class="position-absolute w-100 h-100" preserveAspectRatio="none" viewBox="0 0 100 100"
                            style="overflow:visible;">
                            <!-- Ideal Line -->
                            <line x1="0" y1="0" x2="100" y2="100" stroke="rgb(var(--v-theme-primary))"
                                stroke-width="0.3" stroke-dasharray="1.5 1.5" />
                            <!-- Actual Line - Approximating mockup shape -->
                            <polyline points="0,0 15,10 30,25 45,15 60,35 75,25 85,75 100,90" fill="none"
                                stroke="rgb(var(--v-theme-error))" stroke-width="0.5" stroke-linejoin="round" />
                        </svg>

                        <!-- Y-Axis Labels -->
                        <div class="chart-y-axis position-absolute left-0 top-0 h-100 d-flex flex-column justify-space-between py-0"
                            style="transform: translateX(-35px); font-size: 11px; color:#9e9e9e;">
                            <span class="mt-n2 text-right w-100 d-block">100</span>
                            <span class="mt-n1 text-right w-100 d-block">80</span>
                            <span class="mt-n1 text-right w-100 d-block">60</span>
                            <span class="mt-n1 text-right w-100 d-block">40</span>
                            <span class="mt-n1 text-right w-100 d-block">20</span>
                            <span class="mb-n2 text-right w-100 d-block">0</span>
                        </div>

                        <!-- Y-Axis Title -->
                        <div class="chart-y-axis-label position-absolute left-0 top-50 font-weight-medium"
                            style="transform: rotate(-90deg) translate(-50%, -55px); transform-origin: left top; font-size: 11px; color: #9e9e9e; max-width: 150px; text-align: center;">
                            Hours remaining</div>
                    </div>

                    <!-- X-Axis Labels -->
                    <div class="d-flex justify-space-between w-100 pt-2"
                        style="font-size: 11px; color:#9e9e9e; margin-left: 30px; width: calc(100% - 30px) !important;">
                        <span v-for="d in 14" :key="d">Day {{ d }}</span>
                    </div>

                    <!-- X-Axis Title -->
                    <div class="text-center mt-2 font-weight-medium"
                        style="font-size: 11px; color: #9e9e9e; margin-left: 30px;">
                        Days</div>
                </v-card>

                <!-- Board -->
                <h3 class="text-subtitle-1 font-weight-bold mb-3 text-high-emphasis">Sprint Board</h3>
                <div class="d-flex gap-4 overflow-x-auto pb-4 h-100" style="min-height: 400px;">
                    <!-- To Do -->
                    <v-sheet class="board-column rounded-lg pa-3 d-flex flex-column surface-variant" border>
                        <div class="text-subtitle-2 text-high-emphasis mb-3 px-1 font-weight-bold d-flex align-center">
                            <span>To Do</span>
                            <span class="text-caption text-medium-emphasis ml-2 font-weight-regular">({{
                                todoIssues.length }} tasks)</span>
                        </div>
                        <draggable v-model="todoIssues" group="sprint-issues" item-key="id"
                            class="d-flex flex-column gap-2 overflow-y-auto px-1 flex-grow-1 h-100">
                            <template #item="{ element }">
                                <IssueCard :issue="element" @click="openIssueDetails(element)" />
                            </template>
                        </draggable>
                    </v-sheet>

                    <!-- In Progress -->
                    <v-sheet class="board-column rounded-lg pa-3 d-flex flex-column surface-variant" border>
                        <div class="text-subtitle-2 text-high-emphasis mb-3 px-1 font-weight-bold d-flex align-center">
                            <span>In Progress</span>
                            <span class="text-caption text-medium-emphasis ml-2 font-weight-regular">({{
                                inProgressIssues.length }}
                                tasks)</span>
                        </div>
                        <draggable v-model="inProgressIssues" group="sprint-issues" item-key="id"
                            class="d-flex flex-column gap-2 overflow-y-auto px-1 flex-grow-1 h-100">
                            <template #item="{ element }">
                                <IssueCard :issue="element" @click="openIssueDetails(element)" />
                            </template>
                        </draggable>
                    </v-sheet>

                    <!-- Review -->
                    <v-sheet class="board-column rounded-lg pa-3 d-flex flex-column surface-variant" border>
                        <div class="text-subtitle-2 text-high-emphasis mb-3 px-1 font-weight-bold d-flex align-center">
                            <span>Review</span>
                            <span class="text-caption text-medium-emphasis ml-2 font-weight-regular">({{
                                reviewIssues.length }}
                                tasks)</span>
                        </div>
                        <draggable v-model="reviewIssues" group="sprint-issues" item-key="id"
                            class="d-flex flex-column gap-2 overflow-y-auto px-1 flex-grow-1 h-100">
                            <template #item="{ element }">
                                <IssueCard :issue="element" @click="openIssueDetails(element)" />
                            </template>
                        </draggable>
                    </v-sheet>

                    <!-- Done -->
                    <v-sheet class="board-column rounded-lg pa-3 d-flex flex-column surface-variant" border>
                        <div class="text-subtitle-2 text-high-emphasis mb-3 px-1 font-weight-bold d-flex align-center">
                            <span>Done</span>
                            <span class="text-caption text-medium-emphasis ml-2 font-weight-regular">({{
                                doneIssues.length }} tasks)</span>
                        </div>
                        <draggable v-model="doneIssues" group="sprint-issues" item-key="id"
                            class="d-flex flex-column gap-2 overflow-y-auto px-1 flex-grow-1 h-100">
                            <template #item="{ element }">
                                <IssueCard :issue="element" @click="openIssueDetails(element)" />
                            </template>
                        </draggable>
                    </v-sheet>
                </div>
            </div>
        </template>

        <!-- Modals -->
        <IssueDetailsDialog v-model="isDetailsOpen" :issue="selectedIssue" />
        <CreateSprintDialog v-model="isAddDialogOpen" @save="saveNewSprint" />
        <EditSprintDialog v-model="isEditDialogOpen" :sprint="sprintToEdit" @save="saveSprintEdit" />
        <DeleteSprintDialog v-model="isDeleteDialogOpen" :sprint="sprintToDelete" @confirm="confirmDeleteSprint" />

    </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import ProjectHeader from '@/components/ProjectHeader.vue'
import IssueCard from '@/components/IssueCard.vue'
import draggable from 'vuedraggable'
import IssueDetailsDialog from '@/components/IssueDetailsDialog.vue'
import CreateSprintDialog from './components/CreateSprintDialog.vue'
import EditSprintDialog from './components/EditSprintDialog.vue'
import DeleteSprintDialog from './components/DeleteSprintDialog.vue'
import type { Sprint, Issue } from '@/stores/taskStore'

const store = useTaskStore()

const selectedSprint = ref<Sprint | null>(null)
const activeFilter = ref('All')

// Compute filtered sprints
const filteredSprints = computed(() => {
    if (activeFilter.value === 'All') return store.sprints
    return store.sprints.filter(s => s.status === activeFilter.value)
})

const getTaskCount = (sprint: Sprint) => {
    return store.issues.filter(i => i.sprintId === sprint.id).length
}

const selectSprint = (sprint: Sprint) => {
    selectedSprint.value = sprint
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Draft': return 'info'
        case 'Active': return 'info'
        case 'Completed': return 'success'
        default: return 'grey'
    }
}

const getProgressBarColor = (progress: number) => {
    if (progress === 100) return 'success'
    if (progress === 0) return 'grey-lighten-2'
    return 'primary'
}

// Kanban Handlers
const isDetailsOpen = ref(false)
const selectedIssue = ref<Issue | null>(null)

const openIssueDetails = (issue: Issue) => {
    selectedIssue.value = issue
    isDetailsOpen.value = true
}

const createListComputed = (status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'REVIEW') => {
    return computed({
        get: () => {
            return store.issues.filter(i => i.sprintId === selectedSprint.value?.id && i.status === status as any)
        },
        set: (newIssues: Issue[]) => {
            newIssues.forEach(issue => {
                if (issue.status !== status) {
                    store.moveIssue(issue.id, status as any)
                }
            })
        }
    })
}

const todoIssues = createListComputed('TODO')
const inProgressIssues = createListComputed('IN_PROGRESS')
// Mock review issues for UI since 'REVIEW' is missing from main Issue interface temporarily
const reviewIssues = ref<Issue[]>([])
const doneIssues = createListComputed('DONE')

// --- Add Logic ---
const isAddDialogOpen = ref(false)
const saveNewSprint = (data: Omit<Sprint, 'id' | 'taskCount' | 'progress'>) => {
    store.addSprint(data)
    isAddDialogOpen.value = false
}

// --- Edit & Delete Logic ---
const isEditDialogOpen = ref(false)
const sprintToEdit = ref<Sprint | null>(null)

const openEditDialog = (sprint: Sprint) => {
    sprintToEdit.value = sprint
    isEditDialogOpen.value = true
}

const saveSprintEdit = (id: string, data: Partial<Sprint>) => {
    store.updateSprint(id, data)
    isEditDialogOpen.value = false
}

const isDeleteDialogOpen = ref(false)
const sprintToDelete = ref<Sprint | null>(null)

const openDeleteDialog = (sprint: Sprint) => {
    sprintToDelete.value = sprint
    isDeleteDialogOpen.value = true
}

const confirmDeleteSprint = (id: string) => {
    store.deleteSprint(id)
    isDeleteDialogOpen.value = false
    sprintToDelete.value = null
}
</script>

<style scoped>
:deep(.v-btn--active) {
    color: var(--v-theme-primary);
}

.custom-sprint-search :deep(.v-field__input) {
    min-height: 36px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
}

.bg-primary-lighten {
    background-color: rgba(var(--v-theme-primary), 0.08) !important;
}

.gap-1 {
    gap: 4px;
}

.gap-2 {
    gap: 8px;
}

.gap-3 {
    gap: 12px;
}

.gap-4 {
    gap: 16px;
}

.board-column {
    min-width: 280px;
    width: 280px;
    max-width: 280px;
    background-color: rgb(var(--v-theme-surface-variant));
}

.surface-variant {
    background-color: rgba(0, 0, 0, 0.03) !important;
}

/* Custom chart styling */
.chart-container svg {
    z-index: 10;
}

.grid-lines {
    z-index: 1;
}
</style>
