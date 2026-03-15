<template>
  <teleport to="body">
    <transition name="drawer-fade">
      <div v-if="modelValue" class="drawer-overlay" @click.self="$emit('update:modelValue', false)">
        <transition name="drawer-slide">
          <div v-if="modelValue" class="drawer-panel">

            <!-- Header -->
            <div class="drawer-header">
              <div class="header-left">
                <div class="header-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#4f46e5" stroke-width="2"/><path d="M12 8v8M8 12h8" stroke="#4f46e5" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <div>
                  <div class="header-title">Create Issue</div>
                  <div class="header-sub">Sprint 24.2 · EX Board</div>
                </div>
              </div>
              <button class="icon-btn" @click="$emit('update:modelValue', false)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              </button>
            </div>

            <div class="drawer-divider"></div>

            <!-- Body -->
            <div class="drawer-body">

              <!-- Issue Type -->
              <div class="section">
                <div class="section-label">Issue Type</div>
                <div class="type-pills">
                  <button v-for="t in issueTypes" :key="t.value"
                    class="type-pill" :class="{ active: form.type === t.value }"
                    @click="form.type = t.value">
                    <span class="type-dot" :style="`background:${t.dotColor}`"></span>
                    {{ t.label }}
                  </button>
                </div>
              </div>

              <div class="drawer-divider mx"></div>

              <!-- Title -->
              <div class="section">
                <input v-model="form.summary" class="title-input" placeholder="Issue title" autofocus />
              </div>

              <!-- Description -->
              <div class="section">
                <div class="desc-wrap">
                  <QuillEditor
                    :content="form.description"
                    placeholder="Add a description..."
                    @update:content="form.description = $event" />
                </div>
              </div>

              <div class="drawer-divider mx"></div>

              <!-- Fields -->
              <div class="fields-section">

                <!-- Status -->
                <div class="field-row">
                  <div class="field-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#94a3b8" stroke-width="2"/><path d="M12 6v6l4 2" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/></svg>
                    Status
                  </div>
                  <div class="field-value">
                    <select v-model="form.status" class="field-select">
                      <option v-for="s in statusOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
                    </select>
                  </div>
                </div>

                <!-- Priority -->
                <div class="field-row">
                  <div class="field-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="4" y1="22" x2="4" y2="15" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/></svg>
                    Priority
                  </div>
                  <div class="field-value">
                    <select v-model="form.priority" class="field-select">
                      <option v-for="p in priorityOptions" :key="p.value" :value="p.value">{{ p.label }}</option>
                    </select>
                  </div>
                </div>

                <!-- Assignee -->
                <div class="field-row">
                  <div class="field-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="7" r="4" stroke="#94a3b8" stroke-width="2"/></svg>
                    Assignee
                  </div>
                  <div class="field-value assignee-value">
                    <div class="assignee-avatars">
                      <img v-for="(uid, i) in form.assignees.slice(0,3)" :key="uid"
                        :src="store.users.find(u=>u.id===uid)?.avatar"
                        class="assignee-avatar" :style="`z-index:${3-i}`" />
                      <span v-if="form.assignees.length > 3" class="assignee-more">+{{ form.assignees.length - 3 }}</span>
                    </div>
                    <select v-model="form.assignees" multiple class="field-select assignee-select">
                      <option v-for="u in store.users" :key="u.id" :value="u.id">{{ u.name }}</option>
                    </select>
                  </div>
                </div>

                <!-- Sprint -->
                <div class="field-row">
                  <div class="field-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Sprint
                  </div>
                  <div class="field-value">
                    <select v-model="form.sprintId" class="field-select">
                      <option value="">No sprint</option>
                      <option v-for="s in store.sprints" :key="s.id" :value="s.id">{{ s.name }}</option>
                    </select>
                  </div>
                </div>

                <!-- Epic -->
                <div class="field-row">
                  <div class="field-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    Epic
                  </div>
                  <div class="field-value">
                    <select v-model="form.epicLink" class="field-select">
                      <option value="">No epic</option>
                      <option v-for="e in store.epics" :key="e.id" :value="e.id">{{ e.name }}</option>
                    </select>
                  </div>
                </div>

                <!-- Story Points -->
                <div class="field-row">
                  <div class="field-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#94a3b8" stroke-width="2"/><path d="M12 6v6l4 2" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/></svg>
                    Story Points
                  </div>
                  <div class="field-value">
                    <select v-model="form.storyPoints" class="field-select">
                      <option value="">Unestimated</option>
                      <option v-for="p in ['1','2','3','5','8','13','21']" :key="p" :value="p">{{ p }}</option>
                    </select>
                  </div>
                </div>

                <!-- Tags -->
                <div class="field-row">
                  <div class="field-label">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="7" y1="7" x2="7.01" y2="7" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/></svg>
                    Tags
                  </div>
                  <div class="field-value tags-value">
                    <div class="tags-list">
                      <span v-for="(tag, i) in form.tags" :key="i" class="tag-chip">
                        {{ tag }}
                        <button class="tag-remove" @click="form.tags.splice(i,1)">×</button>
                      </span>
                    </div>
                    <input class="tag-input" placeholder="Add tag…" @keydown.enter.prevent="addTag" @keydown.comma.prevent="addTag" ref="tagInputRef" />
                  </div>
                </div>

              </div>

              <!-- Attachment zone -->
              <div class="section">
                <div class="attach-zone">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <div>
                    <span class="attach-text">Drop files or </span>
                    <span class="attach-link">browse</span>
                    <div class="attach-hint">Up to 10 files · Max 10MB each</div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div class="drawer-divider"></div>
            <div class="drawer-footer">
              <button class="btn-ghost">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2"/></svg>
                More fields
              </button>
              <div class="footer-actions">
                <button class="btn-ghost" @click="$emit('update:modelValue', false)">Cancel</button>
                <button class="btn-outline" @click="handleCreate(true)">Save &amp; add another</button>
                <button class="btn-primary" @click="handleCreate(false)">Create</button>
              </div>
            </div>

          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import QuillEditor from '@/components/QuillEditor.vue'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const store = useTaskStore()
const tagInputRef = ref<HTMLInputElement | null>(null)

const issueTypes: { value: 'Story' | 'Task' | 'Bug' | 'Epic'; label: string; dotColor: string }[] = [
  { value: 'Story', label: 'Story', dotColor: '#22c55e' },
  { value: 'Task',  label: 'Task',  dotColor: '#3b82f6' },
  { value: 'Bug',   label: 'Bug',   dotColor: '#ef4444' },
  { value: 'Epic',  label: 'Epic',  dotColor: '#8b5cf6' },
]

const statusOptions = [
  { value: 'TODO',        label: 'To Do'       },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE',        label: 'Done'        },
]

const priorityOptions = [
  { value: 'High',   label: 'High'   },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low',    label: 'Low'    },
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

function addTag(e: KeyboardEvent) {
  const val = (e.target as HTMLInputElement).value.trim().replace(/,$/, '')
  if (val && !form.tags.includes(val)) form.tags.push(val);
  (e.target as HTMLInputElement).value = ''
}

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
  if (!addAnother) emit('update:modelValue', false)
}
</script>

<style scoped>
/* Overlay */
.drawer-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(15,23,42,0.35);
  display: flex; justify-content: flex-end; align-items: stretch;
}

/* Panel */
.drawer-panel {
  width: 560px; max-width: 100vw;
  height: 100vh; max-height: 100vh;
  background: #fff;
  display: flex; flex-direction: column;
  font-family: 'Inter', sans-serif;
  box-shadow: -8px 0 40px rgba(0,0,0,0.12);
  overflow: hidden;
}

/* Transitions */
.drawer-fade-enter-active, .drawer-fade-leave-active { transition: opacity 0.2s; }
.drawer-fade-enter-from, .drawer-fade-leave-to { opacity: 0; }
.drawer-slide-enter-active, .drawer-slide-leave-active { transition: transform 0.25s cubic-bezier(.4,0,.2,1); }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateX(100%); }

/* Header */
.drawer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; flex-shrink: 0;
}
.header-left { display: flex; align-items: center; gap: 12px; }
.header-icon {
  width: 34px; height: 34px; border-radius: 8px;
  background: #ede9fe; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.header-title { font-size: 15px; font-weight: 700; color: #0f172a; }
.header-sub   { font-size: 12px; color: #94a3b8; margin-top: 1px; }

/* Divider */
.drawer-divider { height: 1px; background: #e2e8f0; flex-shrink: 0; }
.drawer-divider.mx { margin: 0 20px; }

/* Body */
.drawer-body { flex: 1; min-height: 0; overflow-y: auto; }

/* Section */
.section { padding: 14px 20px; }

/* Section label */
.section-label {
  font-size: 11px; font-weight: 600; color: #94a3b8;
  text-transform: uppercase; letter-spacing: .06em; margin-bottom: 10px;
}

/* Type pills */
.type-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.type-pill {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 14px; border-radius: 8px;
  border: 1.5px solid #e2e8f0; background: #fff;
  font-size: 13px; font-weight: 500; color: #374151;
  cursor: pointer; transition: all .15s;
}
.type-pill:hover { border-color: #a5b4fc; background: #f5f3ff; }
.type-pill.active { border-color: #4f46e5; background: #ede9fe; color: #4f46e5; font-weight: 600; }
.type-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }

/* Title input */
.title-input {
  width: 100%; border: 1.5px solid #e2e8f0; border-radius: 8px;
  padding: 10px 14px; font-size: 15px; font-weight: 600; color: #0f172a;
  font-family: 'Inter', sans-serif; outline: none; transition: border-color .15s;
  box-sizing: border-box;
}
.title-input:focus { border-color: #4f46e5; }
.title-input::placeholder { color: #cbd5e1; font-weight: 400; }

/* Description */
.desc-wrap {
  border: 1.5px solid #e2e8f0; border-radius: 8px; overflow: hidden;
  transition: border-color .15s;
}
.desc-wrap:focus-within { border-color: #4f46e5; }
.desc-wrap :deep(.ql-toolbar) {
  border: none !important; border-bottom: 1px solid #f1f5f9 !important;
  padding: 6px 8px !important; background: #f8fafc;
}
.desc-wrap :deep(.ql-container) { border: none !important; font-family: 'Inter', sans-serif; font-size: 14px; }
.desc-wrap :deep(.ql-editor) { min-height: 100px; max-height: 200px; overflow-y: auto; padding: 10px 12px; }
.desc-wrap :deep(.ql-editor.ql-blank::before) { color: #cbd5e1; font-style: normal; }

/* Fields */
.fields-section { padding: 4px 20px 8px; }
.field-row {
  display: flex; align-items: center; min-height: 42px;
  border-bottom: 1px solid #f1f5f9;
}
.field-row:last-child { border-bottom: none; }
.field-label {
  width: 130px; min-width: 130px; flex-shrink: 0;
  display: flex; align-items: center; gap: 7px;
  font-size: 13px; color: #64748b;
}
.field-value { flex: 1; min-width: 0; }

.field-select {
  width: 100%; border: none; background: transparent;
  font-size: 13px; color: #1e293b; font-family: 'Inter', sans-serif;
  outline: none; cursor: pointer; padding: 4px 0;
}

/* Assignee */
.assignee-value { display: flex; align-items: center; gap: 8px; }
.assignee-avatars { display: flex; }
.assignee-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  border: 2px solid #fff; margin-left: -6px; object-fit: cover;
}
.assignee-avatars .assignee-avatar:first-child { margin-left: 0; }
.assignee-more { font-size: 11px; color: #64748b; margin-left: 4px; }
.assignee-select { max-width: 160px; }

/* Tags */
.tags-value { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; padding: 4px 0; }
.tags-list { display: flex; flex-wrap: wrap; gap: 4px; }
.tag-chip {
  display: flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: 20px;
  background: #ede9fe; color: #4f46e5; font-size: 11.5px; font-weight: 600;
}
.tag-remove {
  background: none; border: none; cursor: pointer;
  color: #4f46e5; font-size: 14px; line-height: 1; padding: 0;
}
.tag-input {
  border: none; outline: none; font-size: 13px; color: #374151;
  font-family: 'Inter', sans-serif; min-width: 80px; background: transparent;
}
.tag-input::placeholder { color: #cbd5e1; }

/* Attach zone */
.attach-zone {
  display: flex; align-items: center; gap: 12px;
  border: 1.5px dashed #cbd5e1; border-radius: 10px;
  padding: 14px 16px; cursor: pointer; transition: border-color .15s, background .15s;
}
.attach-zone:hover { border-color: #4f46e5; background: #f5f3ff; }
.attach-text { font-size: 13px; color: #64748b; }
.attach-link { font-size: 13px; color: #4f46e5; font-weight: 600; cursor: pointer; }
.attach-hint { font-size: 11.5px; color: #94a3b8; margin-top: 2px; }

/* Footer */
.drawer-footer {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 20px; flex-shrink: 0; background: #fff;
}
.footer-actions { display: flex; gap: 8px; }

/* Buttons */
.icon-btn {
  width: 30px; height: 30px; border-radius: 6px; border: none;
  background: transparent; cursor: pointer; color: #64748b;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.icon-btn:hover { background: #f1f5f9; }

.btn-ghost {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 12px; border-radius: 7px; border: none;
  background: transparent; font-size: 13px; color: #64748b;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: background .15s;
}
.btn-ghost:hover { background: #f1f5f9; }

.btn-outline {
  padding: 7px 14px; border-radius: 7px;
  border: 1.5px solid #4f46e5; background: transparent;
  font-size: 13px; font-weight: 600; color: #4f46e5;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: background .15s;
}
.btn-outline:hover { background: #ede9fe; }

.btn-primary {
  padding: 7px 20px; border-radius: 7px; border: none;
  background: #4f46e5; color: #fff;
  font-size: 13px; font-weight: 600;
  font-family: 'Inter', sans-serif; cursor: pointer; transition: background .15s;
}
.btn-primary:hover { background: #4338ca; }
</style>
