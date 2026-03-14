<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="1200"
    scrollable :fullscreen="isFullscreen" scroll-strategy="none">
    <v-card v-if="issue" class="h-100 rounded-lg">
      <v-toolbar color="surface" density="compact" flat class="border-b">
        <v-btn icon="mdi-pencil-outline" variant="text" size="small" class="ml-2"></v-btn>
        <div class="text-caption text-medium-emphasis ml-2">
          Add epic / <v-icon size="small" color="primary">mdi-checkbox-marked-circle</v-icon> {{ issue?.key }}
        </div>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" size="small">
          <v-icon>mdi-lock-outline</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="small">
          <v-icon>mdi-eye-outline</v-icon>
          <span class="text-caption ml-1">1</span>
        </v-btn>
        <v-btn icon variant="text" size="small">
          <v-icon>mdi-share-variant-outline</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="small">
          <v-icon>mdi-dots-horizontal</v-icon>
        </v-btn>
        <v-btn icon variant="text" size="small" @click="isFullscreen = !isFullscreen">
          <v-icon>{{ isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen' }}</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pa-0">
        <v-container fluid class="fill-height align-start pa-0">
          <v-row no-gutters class="h-100">
            <!-- Main Content -->
            <v-col cols="12" md="8" class="pa-6 border-e overflow-y-auto"
              :style="{ 'max-height': isFullscreen ? '' : '80vh' }">
              <h1 class="text-h6 font-weight-medium mb-4">{{ issue?.summary }}</h1>

              <div class="d-flex gap-2 mb-6">
                <v-btn variant="outlined" size="small" prepend-icon="mdi-paperclip">Attach</v-btn>
                <v-btn variant="outlined" size="small" prepend-icon="mdi-sitemap">Add child
                  issue</v-btn>
                <v-btn variant="outlined" size="small" prepend-icon="mdi-link">Link issue</v-btn>
                <v-btn variant="text" size="small" icon="mdi-dots-horizontal"></v-btn>
              </div>

              <div class="mb-6">
                <h3 class="text-subtitle-1 font-weight-bold mb-2">Description</h3>

                <div v-if="!isDescriptionEditing" class="pa-3 rounded-lg cursor-text text-body-2"
                  style="min-height: 80px" @click="enableDescriptionEditing">
                  <div v-if="internalDescription" v-html="internalDescription" class="user-content"></div>
                  <div v-else class="text-medium-emphasis">Add a description...</div>
                </div>

                <div v-else class="border rounded-lg pa-2 bg-surface elevation-1">
                  <QuillEditor :content="internalDescription" @update:content="internalDescription = $event"
                    :modules="modules" placeholder="Add a description..." />
                  <div class="d-flex gap-2 mt-2">
                    <v-btn color="primary" size="small" @click="saveDescription">Save</v-btn>
                    <v-btn variant="text" size="small" @click="cancelDescription">Cancel</v-btn>
                  </div>
                </div>
              </div>

              <div class="mb-6">
                <div class="d-flex align-center justify-space-between mb-3">
                  <h3 class="text-subtitle-1 font-weight-bold">Attachments</h3>
                  <v-btn size="x-small" variant="tonal" color="primary" prepend-icon="mdi-plus"
                    class="text-none font-weight-medium">Add</v-btn>
                </div>

                <!-- File list -->
                <div class="d-flex flex-column gap-2 mb-3">
                  <div v-for="file in attachments" :key="file.name"
                    class="attach-file-item d-flex align-center gap-3 rounded-lg pa-3 cursor-pointer">
                    <div class="attach-file-icon d-flex align-center justify-center rounded-lg flex-shrink-0"
                      :class="file.bgClass">
                      <v-icon :color="file.iconColor" size="20">{{ file.icon }}</v-icon>
                    </div>
                    <div class="flex-grow-1 min-width-0">
                      <div class="text-body-2 font-weight-medium text-truncate text-high-emphasis">{{ file.name }}</div>
                      <div class="d-flex align-center gap-1 mt-1">
                        <span class="text-caption text-medium-emphasis">{{ file.size }}</span>
                        <span class="text-caption text-disabled mx-1">·</span>
                        <span class="text-caption text-medium-emphasis">{{ file.time }}</span>
                        <span class="text-caption text-disabled mx-1">·</span>
                        <span class="text-caption text-medium-emphasis">{{ file.uploader }}</span>
                      </div>
                    </div>
                    <div class="attach-file-actions d-flex align-center gap-1">
                      <v-btn icon="mdi-eye-outline" variant="text" size="x-small" class="text-medium-emphasis" density="comfortable" />
                      <v-btn icon="mdi-download-outline" variant="text" size="x-small" class="text-medium-emphasis" density="comfortable" />
                      <v-btn icon="mdi-delete-outline" variant="text" size="x-small" color="error" density="comfortable" />
                    </div>
                  </div>
                </div>

                <!-- Drop zone -->
                <div class="attach-dropzone rounded-xl d-flex flex-column align-center justify-center gap-1 cursor-pointer"
                  :class="{ 'attach-dropzone--active': isDragging }"
                  @dragover.prevent="isDragging = true"
                  @dragleave="isDragging = false"
                  @drop.prevent="isDragging = false">
                  <div class="drop-icon-bg d-flex align-center justify-center rounded-lg mb-1">
                    <v-icon size="22" color="primary">mdi-cloud-upload-outline</v-icon>
                  </div>
                  <div class="text-body-2 font-weight-medium text-high-emphasis">
                    Drop files here or <span class="text-primary font-weight-bold">browse</span>
                  </div>
                  <div class="text-caption text-medium-emphasis">PDF, images, docs · Max 10MB</div>
                </div>
              </div>

              <div class="mb-6">
                <div class="d-flex align-center justify-space-between mb-2">
                  <h3 class="text-subtitle-1 font-weight-bold">Linked Issues</h3>
                  <v-btn icon="mdi-plus" variant="text" size="small"></v-btn>
                </div>
                <div class="border rounded px-4 py-2 d-flex align-center bg-surface-variant mb-2">
                  <v-icon color="blue" size="small" class="mr-2">mdi-check-bold</v-icon>
                  <span class="text-caption font-weight-bold mr-2">KAN-5</span>
                  <span class="text-body-2 text-medium-emphasis text-truncate flex-grow-1">Implement
                    authentication</span>
                  <v-chip size="x-small" color="info" class="font-weight-bold" variant="flat">IN PROGRESS</v-chip>
                </div>
              </div>

              <div class="mb-6">
                <div class="d-flex align-center justify-space-between mb-2">
                  <h3 class="text-subtitle-1 font-weight-bold">Subtasks</h3>
                  <div>
                    <v-btn icon="mdi-dots-horizontal" variant="text" size="small"></v-btn>
                    <v-btn icon="mdi-plus" variant="text" size="small"></v-btn>
                  </div>
                </div>
                <v-progress-linear model-value="0" color="primary" height="4" rounded class="mb-4"></v-progress-linear>
                <!-- Add empty state matching screenshot roughly -->
                <div class="border rounded px-4 py-2 d-flex align-center bg-surface-variant">
                  <v-icon color="primary" class="mr-2">mdi-checkbox-blank-outline</v-icon>
                  <span class="text-body-2 text-medium-emphasis">No subtasks yet</span>
                </div>
              </div>

              <div class="mb-6">
                <h3 class="text-subtitle-1 font-weight-bold mb-2">Activity</h3>
                <div class="d-flex align-center gap-2 mb-4">
                  <span class="text-caption font-weight-bold">Show:</span>
                  <v-chip-group selected-class="text-primary bg-blue-lighten-5" multiple>
                    <v-chip size="small" variant="outlined" filter value="all" class="font-weight-medium">All</v-chip>
                    <v-chip size="small" variant="outlined" filter value="comments"
                      class="font-weight-medium">Comments</v-chip>
                    <v-chip size="small" variant="outlined" filter value="history"
                      class="font-weight-medium">History</v-chip>
                  </v-chip-group>
                </div>

                <div class="d-flex gap-3">
                  <v-avatar size="32" color="green-darken-1">
                    <v-img v-if="taskStore.currentUser.avatar" :src="taskStore.currentUser.avatar"></v-img>
                    <span v-else class="text-white text-caption">{{ taskStore.currentUser.name.charAt(0) }}</span>
                    <v-tooltip activator="parent" location="top">{{ taskStore.currentUser.name }}</v-tooltip>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <v-text-field variant="outlined" placeholder="Add a comment..." hide-details density="compact"
                      bg-color="surface"></v-text-field>
                    <div class="text-caption text-medium-emphasis mt-1">
                      <strong>Pro tip:</strong> press <kbd>M</kbd> to comment
                    </div>
                  </div>
                </div>
              </div>
            </v-col>

            <!-- Sidebar -->
            <v-col cols="12" md="4" class="pa-4 bg-surface-variant overflow-y-auto"
              :style="{ 'max-height': isFullscreen ? '' : '80vh' }">
              <v-select :model-value="issue?.status" :items="['TODO', 'IN_PROGRESS', 'DONE']" variant="outlined"
                density="compact" hide-details class="mb-6 font-weight-bold bg-surface" style="width: 140px">
                <template #selection="{ item }">
                  <span class="text-caption font-weight-bold">{{ item }}</span>
                </template>
              </v-select>

              <div class="border rounded bg-surface pa-0 mb-4 elevation-1">
                <v-expansion-panels flat variant="accordion" v-model="detailsPanel">
                  <v-expansion-panel title="Details" elevation="0">
                    <template #title>
                      <span class="text-subtitle-2 font-weight-bold">Details</span>
                    </template>
                    <v-expansion-panel-text>
                      <v-list density="compact" class="pa-0">
                        <v-list-item class="px-0">
                          <template #prepend>
                            <div style="width: 100px" class="text-caption text-medium-emphasis">Assignees</div>
                          </template>
                          <div class="flex-grow-1">
                            <v-autocomplete v-if="issue" :model-value="issue.assignees" autocomplete="off"
                              @update:model-value="updateAssignees" :items="taskStore.users" item-title="name"
                              item-value="id" return-object multiple chips closable-chips density="compact"
                              variant="plain" hide-details placeholder="Unassigned" class="pa-0">
                              <template #chip="{ props, item }">
                                <v-chip v-bind="props" :prepend-avatar="item?.avatar" size="x-small"
                                  class="mr-1 mb-1">
                                  {{ item?.name }}
                                </v-chip>
                              </template>
                              <template #item="{ props, item }">
                                <v-list-item v-bind="props" :title="undefined" class="pa-1" min-height="24">
                                  <template #prepend>
                                    <v-avatar :image="item?.avatar" size="22" class="mr-2"></v-avatar>
                                  </template>
                                  <v-list-item-title class="text-caption">{{ item?.name }}</v-list-item-title>
                                </v-list-item>
                              </template>
                            </v-autocomplete>
                          </div>
                        </v-list-item>

                        <v-list-item class="px-0">
                          <template #prepend>
                            <div style="width: 100px" class="text-caption text-medium-emphasis">Labels</div>
                          </template>
                          <span class="text-body-2">None</span>
                        </v-list-item>

                        <v-list-item class="px-0">
                          <template #prepend>
                            <div style="width: 100px" class="text-caption text-medium-emphasis">Parent</div>
                          </template>
                          <span class="text-body-2">None</span>
                        </v-list-item>

                        <v-list-item class="px-0">
                          <template #prepend>
                            <div style="width: 100px" class="text-caption text-medium-emphasis">Priority</div>
                          </template>
                          <div class="d-flex align-center gap-2">
                            <v-icon size="small" :color="getPriorityColor(issue?.priority)">
                              {{ getPriorityIcon(issue?.priority) }}
                            </v-icon>
                            <span class="text-body-2">{{ issue?.priority }}</span>
                          </div>
                        </v-list-item>

                        <v-list-item class="px-0">
                          <template #prepend>
                            <div style="width: 100px" class="text-caption text-medium-emphasis">Story point
                              estimate</div>
                          </template>
                          <span class="text-body-2">None</span>
                        </v-list-item>

                        <v-list-item class="px-0">
                          <template #prepend>
                            <div style="width: 100px" class="text-caption text-medium-emphasis">Reporter</div>
                          </template>
                          <div class="d-flex align-center gap-2">
                            <v-avatar size="24" color="green-darken-1">
                              <span class="text-white text-caption">LM</span>

                            </v-avatar>
                            <span class="text-body-2 text-primary">Lasa Marndi</span>
                          </div>
                        </v-list-item>

                        <v-list-item class="px-0">
                          <template #prepend>
                            <div style="width: 100px" class="text-caption text-medium-emphasis">Components</div>
                          </template>
                          <span class="text-body-2">None</span>
                        </v-list-item>

                        <v-list-item class="px-0">
                          <template #prepend>
                            <div style="width: 100px" class="text-caption text-medium-emphasis">Sprint</div>
                          </template>
                          <span class="text-body-2 text-primary hover-underline cursor-pointer">Sprint
                            4</span>
                        </v-list-item>

                        <v-list-item class="px-0">
                          <template #prepend>
                            <div style="width: 100px" class="text-caption text-medium-emphasis">Fix versions</div>
                          </template>
                          <span class="text-body-2">None</span>
                        </v-list-item>

                        <v-list-item class="px-0">
                          <template #prepend>
                            <div style="width: 100px" class="text-caption text-medium-emphasis">Original estimate
                            </div>
                          </template>
                          <span class="text-body-2 text-medium-emphasis">Unestimated</span>
                        </v-list-item>

                        <v-list-item class="px-0">
                          <template #prepend>
                            <div style="width: 100px" class="text-caption text-medium-emphasis">Time tracking
                            </div>
                          </template>
                          <v-progress-linear model-value="0" color="surface-variant" height="6"
                            rounded></v-progress-linear>
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </div>

              <div class="text-caption text-medium-emphasis mb-2">
                Created 1 minute ago<br>
                Updated 1 minute ago
              </div>

              <div class="d-flex justify-end">
                <v-btn variant="text" size="small" prepend-icon="mdi-cog">Configure</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <!-- ── Fixed Footer ── -->
      <v-divider />
      <div class="px-6 py-3 d-flex align-center justify-end gap-3 bg-surface flex-shrink-0">
        <span class="text-caption text-medium-emphasis mr-auto">
          <v-icon size="14" class="mr-1">mdi-clock-edit-outline</v-icon>
          Last updated just now
        </span>
        <v-btn
          variant="text"
          size="small"
          class="text-none text-medium-emphasis font-weight-medium"
          @click="$emit('update:modelValue', false)">
          Close
        </v-btn>
        <v-btn
          color="primary"
          size="small"
          variant="flat"
          class="text-none font-weight-medium px-5"
          elevation="0"
          @click="handleSave">
          Save changes
        </v-btn>
      </div>

    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Issue, User } from '@/stores/taskStore'
import { useTaskStore } from '@/stores/taskStore'
import { ref } from 'vue'
import QuillEditor from './QuillEditor.vue'

const props = defineProps<{
  modelValue: boolean
  issue: Issue | null
}>()

const isFullscreen = ref(false)
const internalDescription = ref(props.issue?.description || '')
const isDescriptionEditing = ref(false)
const taskStore = useTaskStore()
const detailsPanel = ref(0)
const isDragging = ref(false)

const attachments = ref([
  {
    name: 'requirements_v1.pdf',
    size: '2.4 MB',
    time: '2 hours ago',
    uploader: 'Lasam',
    icon: 'mdi-file-pdf-box',
    iconColor: 'red-darken-1',
    bgClass: 'attach-bg-red',
    hovered: false,
  },
  {
    name: 'design_mockup.png',
    size: '1.1 MB',
    time: 'Yesterday',
    uploader: 'Alana Song',
    icon: 'mdi-file-image-outline',
    iconColor: 'blue-darken-1',
    bgClass: 'attach-bg-blue',
    hovered: false,
  },
])

const enableDescriptionEditing = () => {
  isDescriptionEditing.value = true
}

const saveDescription = () => {
  if (props.issue) {
    props.issue.description = internalDescription.value
    // In a real app, you'd save to store/API here
  }
  isDescriptionEditing.value = false
}

const cancelDescription = () => {
  internalDescription.value = props.issue?.description || ''
  isDescriptionEditing.value = false
}

const modules = {
  mention: {
    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
    mentionDenotationChars: ["@"],
    source: function (searchTerm: string, renderList: Function) {
      const values = taskStore.users.map(u => ({ id: u.id, value: u.name }))
      if (searchTerm.length === 0) {
        renderList(values, searchTerm)
      } else {
        const matches = []
        for (let i = 0; i < values.length; i++) {
          if (~values[i]!.value.toLowerCase().indexOf(searchTerm.toLowerCase())) {
            matches.push(values[i]!)
          }
        }
        renderList(matches, searchTerm)
      }
    },
  }
}

const emit = defineEmits(['update:modelValue'])

const getPriorityColor = (priority: string | undefined) => {
  if (!priority) return 'grey'
  switch (priority.toLowerCase()) {
    case 'high': return 'red'
    case 'medium': return 'orange'
    case 'low': return 'blue'
    default: return 'grey'
  }
}

const getPriorityIcon = (priority: string | undefined) => {
  if (!priority) return 'mdi-minus'
  switch (priority.toLowerCase()) {
    case 'high': return 'mdi-arrow-up'
    case 'medium': return 'mdi-equal'
    case 'low': return 'mdi-arrow-down'
    default: return 'mdi-minus'
  }
}

const updateAssignees = (newAssignees: User[]) => {
  if (props.issue) {
    props.issue.assignees = newAssignees
  }
}

const handleSave = () => {
  // Persist any in-progress description edit
  if (isDescriptionEditing.value) saveDescription()
  emit('update:modelValue', false)
}
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.hover-underline:hover {
  text-decoration: underline;
}

.cursor-pointer {
  cursor: pointer;
}

/* ── Attachment file items ── */
.attach-file-item {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: background 0.15s, box-shadow 0.15s;
}
.attach-file-item:hover {
  background: rgb(var(--v-theme-surface-variant));
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.attach-file-item:hover .attach-file-actions {
  opacity: 1;
}
.attach-file-actions {
  opacity: 0;
  transition: opacity 0.15s;
}

.attach-file-icon {
  width: 40px;
  height: 40px;
}
.attach-bg-red  { background: #FEF2F2; }
.attach-bg-blue { background: #EFF6FF; }
.attach-bg-green { background: #F0FDF4; }
.attach-bg-purple { background: #F5F3FF; }

/* ── Drop zone ── */
.attach-dropzone {
  border: 2px dashed rgba(var(--v-border-color), 0.35);
  padding: 24px 16px;
  transition: border-color 0.2s, background 0.2s;
}
.attach-dropzone:hover,
.attach-dropzone--active {
  border-color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.04);
}
.drop-icon-bg {
  width: 44px;
  height: 44px;
  background: rgba(var(--v-theme-primary), 0.1);
}
</style>
