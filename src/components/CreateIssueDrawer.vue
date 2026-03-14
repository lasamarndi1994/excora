<template>
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    location="right"
    width="560"
    temporary
    scroll-strategy="none"
    class="create-issue-drawer">

    <div class="d-flex flex-column h-100">

      <!-- ── Header ── -->
      <div class="drawer-header px-5 py-4 d-flex align-center justify-space-between">
        <div class="d-flex align-center gap-3">
          <div class="header-icon d-flex align-center justify-center rounded">
            <v-icon size="18" color="primary">mdi-plus-circle-outline</v-icon>
          </div>
          <div>
            <div class="text-subtitle-1 font-weight-bold text-high-emphasis">Create Issue</div>
            <div class="text-caption text-medium-emphasis">Sprint 24.2 · EX Board</div>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" density="comfortable"
          class="text-medium-emphasis" @click="$emit('update:modelValue', false)" />
      </div>

      <v-divider />

      <!-- ── Body ── -->
      <div class="flex-grow-1 overflow-y-auto">

        <!-- Issue type selector -->
        <div class="px-5 pt-4 pb-3">
          <div class="text-caption text-medium-emphasis font-weight-medium mb-2 text-uppercase tracking-wide">
            Issue Type
          </div>
          <div class="d-flex gap-2 flex-wrap">
            <button
              v-for="t in issueTypes" :key="t.value"
              class="type-pill d-flex align-center gap-2 px-3 py-2 rounded-lg cursor-pointer"
              :class="{ 'type-pill--active': form.type === t.value }"
              @click="form.type = t.value">
              <v-icon size="15" :color="t.color">{{ t.icon }}</v-icon>
              <span class="text-body-2 font-weight-medium">{{ t.label }}</span>
            </button>
          </div>
        </div>

        <v-divider class="mx-5" />

        <!-- Title -->
        <div class="px-5 pt-4">
          <v-text-field
            v-model="form.summary"
            placeholder="Issue title"
            variant="outlined"
            density="comfortable"
            color="primary"
            hide-details
            class="title-field mb-1"
            autofocus />
        </div>

        <!-- Description -->
        <div class="px-5 pt-3 pb-2">
          <div class="desc-editor-wrap rounded-lg overflow-hidden">
            <QuillEditor
              :content="form.description"
              placeholder="Add a description..."
              @update:content="form.description = $event" />
          </div>
        </div>

        <v-divider class="mx-5 my-3" />

        <!-- ── Field rows ── -->
        <div class="px-5 pb-2">

          <!-- Status -->
          <div class="field-row d-flex align-center py-2">
            <div class="field-label d-flex align-center gap-2">
              <v-icon size="16" color="medium-emphasis">mdi-circle-slice-8</v-icon>
              <span class="text-body-2 text-medium-emphasis">Status</span>
            </div>
            <div class="field-value">
              <v-select
                v-model="form.status"
                :items="statusOptions"
                item-title="label"
                item-value="value"
                variant="plain"
                density="compact"
                hide-details
                class="field-select">
                <template #selection="{ item }">
                  <div class="d-flex align-center gap-2">
                    <div class="status-dot" :style="{ background: (item as any).color }"></div>
                    <span class="text-body-2 font-weight-medium">{{ (item as any).label }}</span>
                  </div>
                </template>
                <template #item="{ props, item }">
                  <v-list-item v-bind="props" :title="undefined">
                    <div class="d-flex align-center gap-2 py-1">
                      <div class="status-dot" :style="{ background: (item as any).color }"></div>
                      <span class="text-body-2">{{ (item as any).label }}</span>
                    </div>
                  </v-list-item>
                </template>
              </v-select>
            </div>
          </div>

          <!-- Priority -->
          <div class="field-row d-flex align-center py-2">
            <div class="field-label d-flex align-center gap-2">
              <v-icon size="16" color="medium-emphasis">mdi-flag-outline</v-icon>
              <span class="text-body-2 text-medium-emphasis">Priority</span>
            </div>
            <div class="field-value">
              <v-select
                v-model="form.priority"
                :items="priorityOptions"
                item-title="label"
                item-value="value"
                variant="plain"
                density="compact"
                hide-details
                class="field-select">
                <template #selection="{ item }">
                  <div class="d-flex align-center gap-2">
                    <v-icon size="14" :color="(item as any).color">mdi-flag</v-icon>
                    <span class="text-body-2 font-weight-medium">{{ (item as any).label }}</span>
                  </div>
                </template>
                <template #item="{ props, item }">
                  <v-list-item v-bind="props" :title="undefined">
                    <div class="d-flex align-center gap-2 py-1">
                      <v-icon size="14" :color="(item as any).color">mdi-flag</v-icon>
                      <span class="text-body-2">{{ (item as any).label }}</span>
                    </div>
                  </v-list-item>
                </template>
              </v-select>
            </div>
          </div>

          <!-- Assignees -->
          <div class="field-row d-flex align-center py-2">
            <div class="field-label d-flex align-center gap-2">
              <v-icon size="16" color="medium-emphasis">mdi-account-outline</v-icon>
              <span class="text-body-2 text-medium-emphasis">Assignee</span>
            </div>
            <div class="field-value">
              <v-autocomplete
                v-model="form.assignees"
                :items="store.users"
                item-title="name"
                item-value="id"
                multiple
                variant="plain"
                density="compact"
                hide-details
                placeholder="Unassigned"
                class="field-select">
                <template #selection="{ item, index }">
                  <v-avatar v-if="index < 3" size="22" class="mr-n1"
                    style="border: 2px solid white; z-index: 1">
                    <v-img :src="(item as any).avatar" cover />
                  </v-avatar>
                  <span v-if="index === 3" class="text-caption text-medium-emphasis ml-2">
                    +{{ form.assignees.length - 3 }}
                  </span>
                </template>
                <template #item="{ props, item }">
                  <v-list-item v-bind="props" :title="undefined">
                    <div class="d-flex align-center gap-3 py-1">
                      <v-avatar size="28">
                        <v-img :src="(item as any).avatar" cover />
                      </v-avatar>
                      <span class="text-body-2">{{ (item as any).name }}</span>
                    </div>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </div>
          </div>

          <!-- Sprint -->
          <div class="field-row d-flex align-center py-2">
            <div class="field-label d-flex align-center gap-2">
              <v-icon size="16" color="medium-emphasis">mdi-lightning-bolt-outline</v-icon>
              <span class="text-body-2 text-medium-emphasis">Sprint</span>
            </div>
            <div class="field-value">
              <v-select
                v-model="form.sprintId"
                :items="store.sprints"
                item-title="name"
                item-value="id"
                variant="plain"
                density="compact"
                hide-details
                placeholder="No sprint"
                class="field-select" />
            </div>
          </div>

          <!-- Epic -->
          <div class="field-row d-flex align-center py-2">
            <div class="field-label d-flex align-center gap-2">
              <v-icon size="16" color="medium-emphasis">mdi-lightning-bolt</v-icon>
              <span class="text-body-2 text-medium-emphasis">Epic</span>
            </div>
            <div class="field-value">
              <v-select
                v-model="form.epicLink"
                :items="store.epics"
                item-title="name"
                item-value="id"
                variant="plain"
                density="compact"
                hide-details
                placeholder="No epic"
                class="field-select">
                <template #selection="{ item }">
                  <div class="d-flex align-center gap-2">
                    <div class="epic-dot rounded-sm"
                      :style="{ background: (item as any).color, width: '10px', height: '10px' }"></div>
                    <span class="text-body-2 font-weight-medium">{{ (item as any).name }}</span>
                  </div>
                </template>
                <template #item="{ props, item }">
                  <v-list-item v-bind="props" :title="undefined">
                    <div class="d-flex align-center gap-2 py-1">
                      <div class="rounded-sm"
                        :style="{ background: (item as any).color, width: '10px', height: '10px' }"></div>
                      <span class="text-body-2">{{ (item as any).name }}</span>
                    </div>
                  </v-list-item>
                </template>
              </v-select>
            </div>
          </div>

          <!-- Estimation -->
          <div class="field-row d-flex align-center py-2">
            <div class="field-label d-flex align-center gap-2">
              <v-icon size="16" color="medium-emphasis">mdi-clock-outline</v-icon>
              <span class="text-body-2 text-medium-emphasis">Story Points</span>
            </div>
            <div class="field-value">
              <v-select
                v-model="form.storyPoints"
                :items="['1', '2', '3', '5', '8', '13', '21']"
                variant="plain"
                density="compact"
                hide-details
                placeholder="Unestimated"
                class="field-select" />
            </div>
          </div>

          <!-- Tags -->
          <div class="field-row d-flex align-center py-2">
            <div class="field-label d-flex align-center gap-2">
              <v-icon size="16" color="medium-emphasis">mdi-tag-outline</v-icon>
              <span class="text-body-2 text-medium-emphasis">Tags</span>
            </div>
            <div class="field-value">
              <v-combobox
                v-model="form.tags"
                multiple
                variant="plain"
                density="compact"
                hide-details
                placeholder="Add tags"
                class="field-select">
                <template #selection="{ item, index }">
                  <v-chip v-if="index < 2" size="x-small" color="primary" variant="tonal"
                    class="mr-1 font-weight-medium">{{ item.title }}</v-chip>
                  <span v-if="index === 2" class="text-caption text-medium-emphasis">
                    +{{ form.tags.length - 2 }}
                  </span>
                </template>
              </v-combobox>
            </div>
          </div>

        </div>

        <!-- Attachment drop zone -->
        <div class="mx-5 mb-4 mt-2">
          <div class="attach-zone rounded-lg pa-4 d-flex align-center gap-3 cursor-pointer">
            <v-icon size="20" color="medium-emphasis">mdi-paperclip</v-icon>
            <div>
              <span class="text-body-2 text-medium-emphasis">Drop files or </span>
              <span class="text-body-2 text-primary font-weight-medium cursor-pointer">browse</span>
              <div class="text-caption text-disabled mt-0">Up to 10 files · Max 10MB each</div>
            </div>
          </div>
        </div>

      </div>

      <!-- ── Footer ── -->
      <v-divider />
      <div class="px-5 py-4 d-flex align-center justify-space-between bg-surface">
        <v-btn variant="text" size="small" prepend-icon="mdi-apps"
          class="text-none text-medium-emphasis font-weight-medium" color="medium-emphasis">
          More fields
        </v-btn>
        <div class="d-flex gap-2">
          <v-btn variant="text" size="small" class="text-none text-medium-emphasis"
            @click="$emit('update:modelValue', false)">Cancel</v-btn>
          <v-btn variant="outlined" size="small" class="text-none font-weight-medium"
            color="primary" @click="handleCreate(true)">
            Save &amp; add another
          </v-btn>
          <v-btn color="primary" size="small" class="text-none font-weight-medium px-5"
            elevation="0" @click="handleCreate(false)">
            Create
          </v-btn>
        </div>
      </div>

    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import QuillEditor from '@/components/QuillEditor.vue'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const store = useTaskStore()

const issueTypes: { value: 'Story' | 'Task' | 'Bug' | 'Epic'; label: string; icon: string; color: string }[] = [
  { value: 'Story',  label: 'Story',  icon: 'mdi-bookmark',       color: 'green-darken-1' },
  { value: 'Task',   label: 'Task',   icon: 'mdi-check-circle',    color: 'blue-darken-1' },
  { value: 'Bug',    label: 'Bug',    icon: 'mdi-bug',             color: 'red-darken-1' },
  { value: 'Epic',   label: 'Epic',   icon: 'mdi-lightning-bolt',  color: 'purple-darken-1' },
]

const statusOptions = [
  { value: 'TODO',        label: 'To Do',       color: '#94A3B8' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: '#4F46E5' },
  { value: 'DONE',        label: 'Done',        color: '#10B981' },
]

const priorityOptions = [
  { value: 'High',   label: 'High',   color: 'red-darken-1' },
  { value: 'Medium', label: 'Medium', color: 'orange-darken-1' },
  { value: 'Low',    label: 'Low',    color: 'green-darken-1' },
]

const defaultForm = () => ({
  summary: '',
  description: '',
  type: 'Story' as 'Story' | 'Task' | 'Bug' | 'Epic',
  status: 'TODO' as 'TODO' | 'IN_PROGRESS' | 'DONE',
  priority: 'Medium' as 'High' | 'Medium' | 'Low',
  assignees: [] as string[],
  sprintId: '',
  epicLink: '',
  storyPoints: '',
  tags: [] as string[],
})

const form = reactive(defaultForm())

function handleCreate(addAnother: boolean) {
  if (!form.summary.trim()) return

  store.createIssue({
    summary: form.summary,
    description: form.description,
    type: form.type,
    status: form.status,
    priority: form.priority,
    assignees: store.users.filter(u => form.assignees.includes(u.id)),
    sprintId: form.sprintId || undefined,
    epicLink: form.epicLink || undefined,
  })

  Object.assign(form, defaultForm())

  if (!addAnother) {
    emit('update:modelValue', false)
  }
}
</script>

<style scoped>
.create-issue-drawer :deep(.v-navigation-drawer__content) {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  background: rgb(var(--v-theme-surface));
}

.header-icon {
  width: 34px;
  height: 34px;
  background: rgba(var(--v-theme-primary), 0.08);
}

/* Issue type pills */
.type-pill {
  border: 1.5px solid rgb(var(--v-theme-surface-variant));
  background: rgb(var(--v-theme-surface));
  transition: all 0.15s ease;
  outline: none;
}
.type-pill:hover {
  border-color: rgba(var(--v-theme-primary), 0.4);
  background: rgba(var(--v-theme-primary), 0.04);
}
.type-pill--active {
  border-color: rgb(var(--v-theme-primary)) !important;
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

/* Field rows */
.field-row {
  border-bottom: 1px solid rgba(var(--v-border-color), 0.08);
  min-height: 44px;
}
.field-row:last-child {
  border-bottom: none;
}
.field-label {
  width: 130px;
  min-width: 130px;
  flex-shrink: 0;
}
.field-value {
  flex: 1;
  min-width: 0;
}

.field-select :deep(.v-field__input) {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  min-height: 32px !important;
}
.field-select :deep(.v-field__append-inner) {
  padding-top: 4px !important;
}

/* Title field */
.title-field :deep(.v-field__input) {
  font-size: 15px;
  font-weight: 600;
}

/* Status dot */
.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Attachment zone */
.attach-zone {
  border: 1.5px dashed rgba(var(--v-border-color), 0.4);
  background: rgba(var(--v-theme-surface-variant), 0.4);
  transition: border-color 0.15s;
}
.attach-zone:hover {
  border-color: rgba(var(--v-theme-primary), 0.5);
}

.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.tracking-wide { letter-spacing: 0.06em; }

/* Quill editor inside drawer */
.desc-editor-wrap {
  border: 1px solid rgba(var(--v-border-color), 0.38);
  transition: border-color 0.15s;
}
.desc-editor-wrap:focus-within {
  border-color: rgb(var(--v-theme-primary));
}
.desc-editor-wrap :deep(.ql-toolbar) {
  border: none !important;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.2) !important;
  padding: 6px 8px !important;
  background: rgba(var(--v-theme-surface-variant), 0.5);
}
.desc-editor-wrap :deep(.ql-container) {
  border: none !important;
  font-family: inherit;
  font-size: 14px;
}
.desc-editor-wrap :deep(.ql-editor) {
  min-height: 100px !important;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px 12px;
}
.desc-editor-wrap :deep(.ql-editor.ql-blank::before) {
  color: rgba(var(--v-theme-on-surface), 0.38);
  font-style: normal;
  font-size: 14px;
}
.desc-editor-wrap {
  border: 1px solid rgba(var(--v-border-color), 0.38);
  transition: border-color 0.15s;
}
.desc-editor-wrap:focus-within {
  border-color: rgb(var(--v-theme-primary));
}
.desc-editor-wrap :deep(.ql-toolbar) {
  border: none !important;
  border-bottom: 1px solid rgba(var(--v-border-color), 0.2) !important;
  padding: 6px 8px !important;
  background: rgba(var(--v-theme-surface-variant), 0.5);
}
.desc-editor-wrap :deep(.ql-container) {
  border: none !important;
  font-family: inherit;
  font-size: 14px;
}
.desc-editor-wrap :deep(.ql-editor) {
  min-height: 100px !important;
  max-height: 200px;
  overflow-y: auto;
  padding: 10px 12px;
}
.desc-editor-wrap :deep(.ql-editor.ql-blank::before) {
  color: rgba(var(--v-theme-on-surface), 0.38);
  font-style: normal;
  font-size: 14px;
}
</style>
