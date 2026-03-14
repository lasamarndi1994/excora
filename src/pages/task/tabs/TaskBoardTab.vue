<template>
  <div class="d-flex h-100 overflow-x-auto px-4 pb-4 gap-3 pt-1">

    <div v-for="col in boardColumns" :key="col.id"
      class="board-col d-flex flex-column flex-shrink-0">

      <div class="d-flex align-center justify-space-between px-2 py-2 mb-1">
        <div class="d-flex align-center gap-2">
          <span class="text-body-2 font-weight-semibold text-high-emphasis">{{ col.title }}</span>
          <span class="text-caption text-medium-emphasis">{{ col.tasks.length }}</span>
        </div>
        <v-btn icon="mdi-dots-horizontal" variant="text" size="x-small"
          class="text-medium-emphasis" density="compact" />
      </div>

      <div class="flex-grow-1 overflow-y-auto d-flex flex-column gap-2 px-1">
        <v-card v-for="task in col.tasks" :key="task.id"
          class="task-card pa-3 cursor-pointer" elevation="0" border
          @click="selectedTask = task; taskDialog = true">

          <div class="d-flex align-start gap-2 mb-2">
            <v-icon size="16" :color="task.done ? 'success' : 'medium-emphasis'"
              class="mt-1 flex-shrink-0">
              {{ task.done ? 'mdi-check-circle' : 'mdi-circle-outline' }}
            </v-icon>
            <span class="text-body-2 font-weight-medium text-high-emphasis"
              style="line-height:1.4">{{ task.name }}</span>
          </div>

          <v-chip v-if="task.tag" size="x-small" :color="task.tagColor ?? 'grey'"
            variant="tonal" class="mb-2 font-weight-medium">{{ task.tag }}</v-chip>

          <div class="d-flex align-center justify-space-between mt-1">
            <span class="text-caption text-medium-emphasis">{{ task.date }}</span>
            <div class="d-flex align-center gap-2 text-medium-emphasis">
              <span v-if="task.likes" class="d-flex align-center gap-1 text-caption">
                {{ task.likes }}<v-icon size="13">mdi-thumb-up-outline</v-icon>
              </span>
              <span v-if="task.comments" class="d-flex align-center gap-1 text-caption">
                {{ task.comments }}<v-icon size="13">mdi-message-outline</v-icon>
              </span>
            </div>
          </div>
        </v-card>

        <div class="add-task-row d-flex align-center gap-2 px-2 py-2 cursor-pointer rounded"
          @click="addTaskToColumn(col.id)">
          <v-icon size="16" color="medium-emphasis">mdi-plus</v-icon>
          <span class="text-body-2 text-medium-emphasis">Add task</span>
        </div>
      </div>
    </div>

    <div class="flex-shrink-0 d-flex align-start pt-2">
      <v-btn variant="text" prepend-icon="mdi-plus"
        class="text-none text-medium-emphasis font-weight-medium"
        size="small" @click="addSection">
        Add section
      </v-btn>
    </div>

  </div>

  <!-- Task detail dialog -->
  <v-dialog v-model="taskDialog" max-width="480" scroll-strategy="none">
    <v-card v-if="selectedTask" class="pa-4">
      <div class="d-flex align-center justify-space-between mb-3">
        <span class="text-subtitle-1 font-weight-bold">{{ selectedTask.name }}</span>
        <v-btn icon="mdi-close" variant="text" size="small" @click="taskDialog = false" />
      </div>
      <v-chip v-if="selectedTask.tag" size="small" :color="selectedTask.tagColor ?? 'grey'"
        variant="tonal" class="mb-3">{{ selectedTask.tag }}</v-chip>
      <div class="text-caption text-medium-emphasis">{{ selectedTask.date }}</div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface BoardTask {
  id: number
  name: string
  done: boolean
  tag?: string
  tagColor?: string
  date?: string
  likes?: number
  comments?: number
}

interface BoardColumn {
  id: string
  title: string
  tasks: BoardTask[]
}

const boardColumns = reactive<BoardColumn[]>([
  {
    id: 'recent',
    title: 'Recently assigned',
    tasks: [
      { id: 1, name: 'Get EKYC Additional segment KT from Ganavi', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jun 28, 2023', likes: 1, comments: 4 },
      { id: 2, name: 'Get EKYC NRI Flow KT from Ganavi', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jun 29, 2023', comments: 4 },
      { id: 3, name: 'Get EKYC Admin side for Main segment, Addsegment, Dormant Flow and NRI Flow KT from Ganavi', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jun 30, 2023', likes: 1 },
      { id: 4, name: 'EKYC Code analysing for Main segment, Addsegment, Dormant, NRI and Admin side.', done: true, tag: 'EKYC-V2', tagColor: 'green', date: 'Jul 1, 2023' },
      { id: 5, name: 'Research on EKYC flow and prepare test cases', done: false, tag: 'EKYC-V2', tagColor: 'green', date: 'Jul 3, 2023' },
      { id: 6, name: 'Implement authentication module', done: false, tag: 'Sprint-1', tagColor: 'blue', date: 'Jul 5, 2023', comments: 2 },
    ],
  },
  { id: 'today', title: 'Do today', tasks: [] },
  { id: 'next-week', title: 'Do next week', tasks: [] },
  { id: 'later', title: 'Do later', tasks: [] },
])

const taskDialog = ref(false)
const selectedTask = ref<BoardTask | null>(null)
let nextTaskId = 100

function addTaskToColumn(colId: string) {
  const col = boardColumns.find(c => c.id === colId)
  if (!col) return
  col.tasks.push({
    id: nextTaskId++,
    name: 'New task',
    done: false,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  })
}

function addSection() {
  boardColumns.push({
    id: `section-${Date.now()}`,
    title: 'New section',
    tasks: [],
  })
}
</script>

<style scoped>
.board-col {
  width: 240px;
  min-width: 240px;
  max-width: 240px;
  background: #f5f6f7;
  border-radius: 10px;
  padding: 8px 6px;
}
.task-card {
  background: #ffffff !important;
  border-radius: 8px !important;
  transition: box-shadow 0.15s ease;
}
.task-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.10) !important;
}
.add-task-row {
  transition: background 0.15s;
}
.add-task-row:hover {
  background: rgba(0,0,0,0.04);
}
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.font-weight-semibold { font-weight: 600; }
</style>
